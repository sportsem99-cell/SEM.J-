'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export interface CouponInfo {
  id: string
  holder_name: string | null
  phone: string
  program_id: string | null
  program_name: string | null
  total_count: number
  used_count: number
  remaining: number
  expires_at: string | null
  notes: string | null
  created_at: string
  usages: { booking_id: string | null; used_at: string }[]
}

// 어드민: 쿠폰 등록
export async function createCoupon(data: {
  phone: string
  holderName: string
  programId: string | null
  totalCount: number
  expiresAt: string | null
  notes: string
}) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('user_coupons')
    .insert({
      org_id:      ORG_ID,
      phone:       data.phone.replace(/[^0-9]/g, ''),
      holder_name: data.holderName || null,
      program_id:  data.programId || null,
      total_count: data.totalCount,
      expires_at:  data.expiresAt || null,
      notes:       data.notes || null,
    })

  if (error) return { error: error.message }
  revalidatePath('/admin/members')
  return { ok: true }
}

// 어드민: 쿠폰 삭제
export async function deleteCoupon(id: string) {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('coupon_usages')
    .select('*', { count: 'exact', head: true })
    .eq('user_coupon_id', id)

  if (count && count > 0) {
    return { error: '이미 사용 내역이 있는 쿠폰은 삭제할 수 없습니다.' }
  }

  const { error } = await supabase
    .from('user_coupons')
    .delete()
    .eq('id', id)
    .eq('org_id', ORG_ID)

  if (error) return { error: error.message }
  revalidatePath('/admin/members')
  return { ok: true }
}

// 어드민: 전체 쿠폰 목록 (회원별)
export async function getAdminCoupons(): Promise<CouponInfo[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_coupons')
    .select(`
      id, holder_name, phone, program_id, total_count, used_count, expires_at, notes, created_at,
      programs ( name ),
      coupon_usages ( booking_id, used_at )
    `)
    .eq('org_id', ORG_ID)
    .order('created_at', { ascending: false })

  return (data ?? []).map((c: any) => ({
    id:           c.id,
    holder_name:  c.holder_name,
    phone:        c.phone,
    program_id:   c.program_id,
    program_name: c.programs?.name ?? null,
    total_count:  c.total_count,
    used_count:   c.used_count,
    remaining:    c.total_count - c.used_count,
    expires_at:   c.expires_at,
    notes:        c.notes,
    created_at:   c.created_at,
    usages:       c.coupon_usages ?? [],
  }))
}

// 예약 시: 전화번호 + 프로그램으로 사용 가능한 쿠폰 조회
export async function getCouponsByPhone(
  phone: string,
  programId: string,
): Promise<{ id: string; holderName: string | null; remaining: number; expiresAt: string | null; programName: string | null }[]> {
  const normalizedPhone = phone.replace(/[^0-9]/g, '')
  if (!normalizedPhone) return []

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_coupons')
    .select('id, holder_name, total_count, used_count, expires_at, program_id, programs(name)')
    .eq('org_id', ORG_ID)
    .eq('phone', normalizedPhone)
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString().slice(0, 10)}`)

  return (data ?? [])
    .filter((c: any) => {
      const remaining = c.total_count - c.used_count
      if (remaining <= 0) return false
      // program_id가 null이면 모든 프로그램 사용 가능
      if (c.program_id && c.program_id !== programId) return false
      return true
    })
    .map((c: any) => ({
      id:          c.id,
      holderName:  c.holder_name,
      remaining:   c.total_count - c.used_count,
      expiresAt:   c.expires_at,
      programName: c.programs?.name ?? null,
    }))
}

// 내 쿠폰 목록 (회원용 - 전화번호 기준)
export async function getMyCoupons(phone: string): Promise<CouponInfo[]> {
  const normalizedPhone = phone.replace(/[^0-9]/g, '')
  if (!normalizedPhone) return []

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('user_coupons')
    .select(`
      id, holder_name, phone, program_id, total_count, used_count, expires_at, notes, created_at,
      programs ( name ),
      coupon_usages ( booking_id, used_at )
    `)
    .eq('org_id', ORG_ID)
    .eq('phone', normalizedPhone)
    .order('created_at', { ascending: false })

  return (data ?? []).map((c: any) => ({
    id:           c.id,
    holder_name:  c.holder_name,
    phone:        c.phone,
    program_id:   c.program_id,
    program_name: c.programs?.name ?? null,
    total_count:  c.total_count,
    used_count:   c.used_count,
    remaining:    c.total_count - c.used_count,
    expires_at:   c.expires_at,
    notes:        c.notes,
    created_at:   c.created_at,
    usages:       c.coupon_usages ?? [],
  }))
}
