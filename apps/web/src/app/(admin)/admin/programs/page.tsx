import { createAdminClient } from '@/lib/supabase/admin'
import ProgramsClient from './ProgramsClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminProgramsPage() {
  const supabase = createAdminClient()
  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, type, description, price, local_price, duration_min, capacity, is_active')
    .eq('org_id', ORG_ID)
    .order('created_at')

  return <ProgramsClient programs={programs ?? []} />
}
