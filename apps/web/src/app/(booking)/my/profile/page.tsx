import Header from '@/components/features/Header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './ProfileForm'
import { getMyCoupons } from '@/app/actions/coupons'

export default async function MyProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'cancelled')

  const { data: totalData } = await supabase
    .from('bookings')
    .select('total_amount')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'completed'])

  const totalSpent = (totalData ?? []).reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  // 쿠폰 조회 (프로필 전화번호 기준)
  const myCoupons = profile?.phone ? await getMyCoupons(profile.phone) : []
  const activeCoupons = myCoupons.filter(c => c.remaining > 0)

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* 뒤로가기 */}
        <Link href="/my/bookings" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          내 예약
        </Link>

        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-br from-brand-green-700 to-green-800 rounded-3xl px-6 py-7 mb-6 text-white shadow-xl shadow-green-200">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black">
              {profile?.name ? profile.name.charAt(0) : user.email?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-xl font-black">{profile?.name ?? '이름 미설정'}</p>
              <p className="text-green-200 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black">{bookingCount ?? 0}</p>
              <p className="text-green-200 text-xs mt-0.5">총 예약</p>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black">{totalSpent > 0 ? `${(totalSpent / 10000).toFixed(0)}만` : '0'}</p>
              <p className="text-green-200 text-xs mt-0.5">누적 결제</p>
            </div>
          </div>
        </div>

        {/* 쿠폰 섹션 */}
        {myCoupons.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎟</span>
              <h2 className="font-bold text-gray-800">보유 쿠폰</h2>
              {activeCoupons.length > 0 && (
                <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  잔여 {activeCoupons.reduce((s, c) => s + c.remaining, 0)}장
                </span>
              )}
            </div>
            <div className="space-y-2">
              {myCoupons.map(c => (
                <div key={c.id} className={`rounded-2xl border px-5 py-4 ${c.remaining > 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-gray-800 text-sm">
                      {c.program_name ? `${c.program_name} 이용권` : '전 프로그램 이용권'}
                    </p>
                    <span className={`text-2xl font-black ${c.remaining > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                      {c.remaining}장
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>사용 {c.used_count}/{c.total_count}회</span>
                    {c.expires_at && (
                      <span className={new Date(c.expires_at) < new Date() ? 'text-red-500 font-semibold' : ''}>
                        만료 {c.expires_at}
                      </span>
                    )}
                    {c.notes && <span className="text-gray-400">{c.notes}</span>}
                  </div>
                  {c.usages.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-purple-100 space-y-0.5">
                      <p className="text-[10px] font-bold text-purple-400 uppercase">사용 내역</p>
                      {c.usages.map((u, i) => (
                        <p key={i} className="text-xs text-gray-500">
                          {new Date(u.used_at).toLocaleDateString('ko-KR', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })} 사용
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!profile?.phone && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ 프로필에 전화번호를 등록하면 쿠폰이 자동으로 표시됩니다.
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-6 text-center">
          저장된 정보는 예약 시 자동으로 입력됩니다.
        </p>

        <ProfileForm profile={profile} />
      </div>
    </>
  )
}
