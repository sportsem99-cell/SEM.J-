import { createAdminClient } from '@/lib/supabase/admin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export async function getIsAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', ORG_ID)
    .eq('user_id', userId)
    .in('role', ['owner', 'admin'])
    .maybeSingle()
  return !!data
}
