import { createAdminClient } from '@/lib/supabase/admin'
import AdminMembersClient from './AdminMembersClient'
import { getAdminCoupons } from '@/app/actions/coupons'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminMembersPage() {
  const supabase = createAdminClient()

  const [bookingsResult, couponsResult, programsResult] = await Promise.all([
    supabase
      .from('bookings')
      .select(`id, status, start_at, total_amount, created_at, user_id,
        programs ( name, type ), booking_participants ( name, phone )`)
      .eq('org_id', ORG_ID)
      .order('created_at', { ascending: false }),
    getAdminCoupons(),
    supabase
      .from('programs')
      .select('id, name')
      .eq('org_id', ORG_ID)
      .eq('is_active', true)
      .order('created_at'),
  ])

  const bookings = bookingsResult.data ?? []

  const customerMap = new Map<string, {
    userId: string; name: string; phone: string
    bookingCount: number; totalSpent: number; lastVisit: string
    programs: Set<string>; statuses: string[]
  }>()

  for (const b of bookings) {
    const participant = (b.booking_participants as any[])?.[0]
    if (!participant) continue
    const key = b.user_id

    if (!customerMap.has(key)) {
      customerMap.set(key, {
        userId: key,
        name: participant.name || '(이름없음)',
        phone: participant.phone || '-',
        bookingCount: 0, totalSpent: 0,
        lastVisit: b.start_at,
        programs: new Set(), statuses: [],
      })
    }

    const c = customerMap.get(key)!
    c.bookingCount++
    if (b.status !== 'cancelled') c.totalSpent += b.total_amount ?? 0
    if (b.start_at > c.lastVisit) c.lastVisit = b.start_at
    const progName = (b.programs as any)?.name
    if (progName) c.programs.add(progName)
    c.statuses.push(b.status)
  }

  const customers = Array.from(customerMap.values())
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .map(c => ({ ...c, programs: Array.from(c.programs) }))

  return (
    <AdminMembersClient
      customers={customers}
      coupons={couponsResult}
      programs={programsResult.data ?? []}
    />
  )
}
