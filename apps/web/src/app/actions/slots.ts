'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

const TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export async function getAvailableSlots(date: string, programId: string) {
  const adminSupabase = createAdminClient()

  // 프로그램 capacity 조회
  const { data: prog } = await adminSupabase
    .from('programs')
    .select('capacity')
    .eq('id', programId)
    .single()

  const maxTeams = prog?.capacity ?? 1

  // 해당 날짜 + 프로그램의 기존 예약 조회
  const supabase = await createClient()
  const dayStart = `${date}T00:00:00+09:00`
  const dayEnd   = `${date}T23:59:59+09:00`

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_at')
    .eq('org_id', ORG_ID)
    .eq('program_id', programId)
    .gte('start_at', dayStart)
    .lte('start_at', dayEnd)
    .in('status', ['pending', 'confirmed', 'checked_in'])

  const countByTime: Record<string, number> = {}
  for (const b of bookings ?? []) {
    const t = new Date(b.start_at).toLocaleTimeString('ko-KR', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul',
    })
    countByTime[t] = (countByTime[t] ?? 0) + 1
  }

  return TIMES.map(t => ({
    time: t,
    available: (countByTime[t] ?? 0) < maxTeams,
    current: countByTime[t] ?? 0,
    max: maxTeams,
  }))
}

export async function getBlockedDates(): Promise<string[]> {
  const supabase = await createClient()
  try {
    const { data } = await supabase
      .from('blocked_dates')
      .select('date')
      .eq('org_id', ORG_ID)
    return (data ?? []).map(d => d.date as string)
  } catch {
    return []
  }
}

export async function addBlockedDate(date: string, reason: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('blocked_dates')
    .insert({ org_id: ORG_ID, date, reason })
  if (error) return { error: error.message }
  return { success: true }
}

export async function removeBlockedDate(date: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('blocked_dates')
    .delete()
    .eq('org_id', ORG_ID)
    .eq('date', date)
  if (error) return { error: error.message }
  return { success: true }
}
