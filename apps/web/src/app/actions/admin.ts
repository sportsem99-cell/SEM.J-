'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getIsAdmin } from '@/lib/auth/isAdmin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'
const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']

export async function updateBookingStatus(bookingId: string, status: string, cancelReason?: string) {
  if (!VALID_STATUSES.includes(status)) return { error: '잘못된 상태값' }

  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return { error: '로그인 필요' }

  const isAdmin = await getIsAdmin(user.id)
  if (!isAdmin) return { error: '권한 없음' }

  const supabase = createAdminClient()
  const updateData: Record<string, string> = { status }
  if (status === 'cancelled' && cancelReason) {
    updateData.cancel_reason = cancelReason
  }

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .eq('org_id', ORG_ID)

  if (error) return { error: error.message }

  revalidatePath('/admin/bookings')
  revalidatePath('/admin/calendar')
  revalidatePath('/admin')
  return { ok: true }
}
