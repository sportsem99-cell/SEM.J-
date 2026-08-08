import { createAdminClient } from '@/lib/supabase/admin'
import AdminBookingsClient from './AdminBookingsClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

interface SearchParams {
  status?: string
  date?: string
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = createAdminClient()
  let query = supabase
    .from('bookings')
    .select(`
      id, status, start_at, end_at, total_amount, created_at,
      programs ( name, type ),
      booking_participants (
        name, phone, gender, weight_kg, height_cm,
        allergy, allergy_desc, condition, condition_desc,
        experience, notes
      )
    `)
    .eq('org_id', ORG_ID)
    .order('start_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.date) {
    query = query
      .gte('start_at', `${params.date}T00:00:00+09:00`)
      .lte('start_at', `${params.date}T23:59:59+09:00`)
  }

  const { data: bookingsRaw } = await query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookings = (bookingsRaw ?? []) as any[]

  // 탭별 건수 (현재 상태 필터와 무관하게, 날짜 필터만 적용)
  let countQuery = supabase
    .from('bookings')
    .select('status')
    .eq('org_id', ORG_ID)
  if (params.date) {
    countQuery = countQuery
      .gte('start_at', `${params.date}T00:00:00+09:00`)
      .lte('start_at', `${params.date}T23:59:59+09:00`)
  }
  const { data: allForCount } = await countQuery
  const statusCounts = (allForCount ?? []).reduce((acc: Record<string, number>, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1
    return acc
  }, {})
  statusCounts.all = allForCount?.length ?? 0

  return (
    <AdminBookingsClient
      bookings={bookings}
      currentStatus={params.status || 'all'}
      currentDate={params.date || ''}
      statusCounts={statusCounts}
    />
  )
}
