import { createAdminClient } from '@/lib/supabase/admin'
import AdminCalendarClient from './AdminCalendarClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

interface SearchParams {
  date?: string
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
    .gte('start_at', `${selectedDate}T00:00:00+09:00`)
    .lte('start_at', `${selectedDate}T23:59:59+09:00`)
    .order('start_at')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookingList = (bookings ?? []) as any[]

  return (
    <AdminCalendarClient
      bookings={bookingList}
      selectedDate={selectedDate}
    />
  )
}
