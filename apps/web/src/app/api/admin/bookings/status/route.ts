import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getIsAdmin } from '@/lib/auth/isAdmin'

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']
const ORG_ID = '00000000-0000-0000-0000-000000000001'

export async function POST(request: NextRequest) {
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = await getIsAdmin(user.id)
  if (!isAdmin) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { bookingId, status } = await request.json()
  if (!bookingId || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .eq('org_id', ORG_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
