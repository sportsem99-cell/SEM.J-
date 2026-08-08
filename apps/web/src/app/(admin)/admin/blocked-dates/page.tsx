import { createAdminClient } from '@/lib/supabase/admin'
import BlockedDatesClient from './BlockedDatesClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export default async function BlockedDatesPage() {
  const supabase = createAdminClient()

  let blockedDates: { id: string; date: string; reason: string | null }[] = []
  try {
    const { data } = await supabase
      .from('blocked_dates')
      .select('id, date, reason')
      .eq('org_id', ORG_ID)
      .order('date', { ascending: true })
    blockedDates = data ?? []
  } catch {
    // blocked_dates 테이블 미생성 시 빈 배열
  }

  return <BlockedDatesClient blockedDates={blockedDates} />
}
