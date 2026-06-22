import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIsAdmin } from '@/lib/auth/isAdmin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'
const VALID_ROLES = ['admin', 'instructor', 'member']

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const ok = await getIsAdmin(user.id)
  return ok ? supabase : null
}

export async function POST(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { userId, role } = await request.json()
  if (!userId || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })
  }

  const { error } = await supabase
    .from('org_members')
    .upsert({ org_id: ORG_ID, user_id: userId, role }, { onConflict: 'org_id,user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { memberId, role } = await request.json()
  if (!memberId || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })
  }

  const { error } = await supabase
    .from('org_members')
    .update({ role })
    .eq('id', memberId)
    .eq('org_id', ORG_ID)
    .neq('role', 'owner')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const { memberId } = await request.json()
  if (!memberId) return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })

  const { error } = await supabase
    .from('org_members')
    .delete()
    .eq('id', memberId)
    .eq('org_id', ORG_ID)
    .neq('role', 'owner')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
