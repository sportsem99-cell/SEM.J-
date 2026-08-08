'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export interface BookingFormData {
  programId: string
  date: string
  time: string
  // 예약자
  bookerName: string
  bookerPhone: string
  // 이용자
  riderName: string
  riderBirthDate: string
  riderGender: string
  riderWeightKg: number
  riderHeightCm: number
  experience: string
  // 건강정보
  allergy: boolean
  allergyDesc: string
  condition: boolean
  conditionDesc: string
  notes: string
  // 금액
  totalAmount: number
  // 쿠폰
  couponId: string | null
  paymentMethod: 'card' | 'transfer' | 'coupon'
}

export async function createBooking(data: BookingFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('id, duration_min')
    .eq('id', data.programId)
    .eq('org_id', ORG_ID)
    .single()

  if (programError || !program) {
    return { error: '프로그램을 찾을 수 없습니다.' }
  }

  const startAt = new Date(`${data.date}T${data.time}:00+09:00`)
  const endAt   = new Date(startAt.getTime() + program.duration_min * 60 * 1000)

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      org_id:          ORG_ID,
      user_id:         user.id,
      program_id:      program.id,
      status:          'pending',
      start_at:        startAt.toISOString(),
      end_at:          endAt.toISOString(),
      total_amount:    data.couponId ? 0 : data.totalAmount,
      paid_amount:     0,
      participants:    1,
      payment_method:  data.paymentMethod,
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    return { error: '예약 생성 중 오류가 발생했습니다.' }
  }

  const { error: participantError } = await supabase
    .from('booking_participants')
    .insert({
      booking_id:       booking.id,
      name:             data.riderName,
      birth_date:       data.riderBirthDate || null,
      phone:            data.bookerPhone,
      is_account_holder: data.bookerName === data.riderName,
      gender:           data.riderGender,
      weight_kg:        data.riderWeightKg || null,
      height_cm:        data.riderHeightCm || null,
      allergy:          data.allergy,
      allergy_desc:     data.allergyDesc || null,
      condition:        data.condition,
      condition_desc:   data.conditionDesc || null,
      notes:            data.notes || null,
    })

  if (participantError) {
    return { error: '참가자 정보 저장 중 오류가 발생했습니다.' }
  }

  // 쿠폰 사용 처리 (원자적 PostgreSQL 함수 호출)
  if (data.couponId) {
    const adminSupabase = createAdminClient()
    const { data: couponResult } = await adminSupabase.rpc('use_coupon', {
      p_coupon_id: data.couponId,
      p_booking_id: booking.id,
    })
    if (couponResult?.error) {
      // 쿠폰 사용 실패 시 예약 취소 처리
      await adminSupabase
        .from('bookings')
        .update({ status: 'cancelled', cancel_reason: `쿠폰 사용 실패: ${couponResult.error}` })
        .eq('id', booking.id)
      return { error: `쿠폰 사용 중 오류가 발생했습니다: ${couponResult.error}` }
    }
  }

  redirect(`/my/bookings/success/${booking.id}`)
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '로그인이 필요합니다.' }

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, start_at, user_id')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !booking) return { error: '예약을 찾을 수 없습니다.' }
  if (!['pending', 'confirmed'].includes(booking.status)) return { error: '취소할 수 없는 예약입니다.' }

  const hoursUntil = (new Date(booking.start_at).getTime() - Date.now()) / (1000 * 60 * 60)
  if (hoursUntil < 0) return { error: '이미 지난 예약은 취소할 수 없습니다.' }

  let cancelReason = '고객 직접 취소'
  if (hoursUntil < 24)      cancelReason = '고객 직접 취소 (당일 — 환불 불가)'
  else if (hoursUntil < 48) cancelReason = '고객 직접 취소 (24시간 이내 — 50% 환불)'
  else                      cancelReason = '고객 직접 취소 (48시간 이전 — 전액 환불)'

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancel_reason: cancelReason, cancelled_at: new Date().toISOString() })
    .eq('id', bookingId)
    .eq('user_id', user.id)

  if (error) return { error: '취소 처리 중 오류가 발생했습니다.' }
  return { success: true, message: cancelReason }
}
