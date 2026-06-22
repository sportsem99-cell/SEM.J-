import Header from '@/components/features/Header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function MyProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">내 정보</h1>
        <p className="text-sm text-gray-500 mb-8">저장된 정보는 예약 시 자동으로 입력됩니다.</p>
        <ProfileForm profile={profile} />
      </div>
    </>
  )
}
