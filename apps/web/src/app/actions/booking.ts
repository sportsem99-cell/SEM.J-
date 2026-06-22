'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export interface BookingFormData {
  programType: string
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
}

export async function createBooking(data: BookingFormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('id, duration_min')
    .eq('org_id', ORG_ID)
    .eq('type', data.programType)
    .single()

  if (programError || !program) {
    return { error: '프로그램을 찾을 수 없습니다.' }
  }

  const startAt = new Date(`${data.date}T${data.time}:00+09:00`)
  const endAt = new Date(startAt.getTime() + program.duration_min * 60 * 1000)

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      org_id: ORG_ID,
      user_id: user.id,
      program_id: program.id,
      status: 'pending',
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      total_amount: data.totalAmount,
      paid_amount: 0,
      participants: 1,
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    return { error: '예약 생성 중 오류가 발생했습니다.' }
  }

  const { error: participantError } = await supabase
    .from('booking_participants')
    .insert({
      booking_id: booking.id,
      name: data.riderName,
      birth_date: data.riderBirthDate || null,
      phone: data.bookerPhone,
      is_account_holder: data.bookerName === data.riderName,
      gender: data.riderGender,
      weight_kg: data.riderWeightKg || null,
      height_cm: data.riderHeightCm || null,
      allergy: data.allergy,
      allergy_desc: data.allergyDesc || null,
      condition: data.condition,
      condition_desc: data.conditionDesc || null,
      notes: data.notes || null,
    })

  if (participantError) {
    return { error: '참가자 정보 저장 중 오류가 발생했습니다.' }
  }

  redirect(`/my/bookings?new=${booking.id}`)
}
