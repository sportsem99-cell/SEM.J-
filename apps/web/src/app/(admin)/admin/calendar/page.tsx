import { createAdminClient } from '@/lib/supabase/admin'
import AdminCalendarClient from './AdminCalendarClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

interface SearchParams {
  date?: string
  view?: string
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = createAdminClient()

  const today = new Date().toISOString().split('T')[0]
  const selectedDate = params.date || today
  const view = (params.view as 'day' | 'week' | 'month') || 'month'

  // 선택된 날짜 기준으로 해당 월 전체 + 앞뒤 여유 가져오기
  const base = new Date(selectedDate)
  const rangeStart = new Date(base.getFullYear(), base.getMonth() - 1, 25)
  const rangeEnd = new Date(base.getFullYear(), base.getMonth() + 2, 5)

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, status, start_at, end_at, total_amount,
      programs ( name, type ),
      booking_participants (
        name, phone, gender, weight_kg, height_cm,
        allergy, allergy_desc, condition, condition_desc,
        experience, notes
      )
    `)
    .eq('org_id', ORG_ID)
    .gte('start_at', rangeStart.toISOString())
    .lte('start_at', rangeEnd.toISOString())
    .not('status', 'eq', 'cancelled')
    .order('start_at')

  return (
    <AdminCalendarClient
      bookings={(bookings ?? []) as any[]}
      selectedDate={selectedDate}
      initialView={view}
      today={today}
    />
  )
}
