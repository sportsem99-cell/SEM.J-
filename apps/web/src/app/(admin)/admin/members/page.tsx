import { createAdminClient } from '@/lib/supabase/admin'
import AdminMembersClient from './AdminMembersClient'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminMembersPage() {
  const supabase = createAdminClient()

  // 현재 멤버 목록
  const { data: members } = await supabase
    .from('org_members')
    .select('id, role, created_at, user_id')
    .eq('org_id', ORG_ID)
    .order('created_at')

  const memberList = await Promise.all(
    (members ?? []).map(async (m) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, display_name, avatar_url')
        .eq('id', m.user_id)
        .maybeSingle()
      return { ...m, profile }
    })
  )

  const memberUserIds = new Set((members ?? []).map(m => m.user_id))

  // 멤버가 아닌 가입 유저 목록 (profiles 기준)
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, name, display_name, avatar_url')
    .order('created_at', { ascending: false })

  const nonMembers = (allProfiles ?? []).filter(p => !memberUserIds.has(p.id))

  return <AdminMembersClient members={memberList} nonMembers={nonMembers} />
}
