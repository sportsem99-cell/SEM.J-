import Link from 'next/link'
import Header from '@/components/features/Header'
import { createAdminClient } from '@/lib/supabase/admin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

const PROGRAM_ICONS: Record<string, string> = {
  experience: '🐴',
  private:    '🏇',
  group:      '🎯',
  youth:      '⭐',
}

export default async function ProgramsPage() {
  const supabase = createAdminClient()
  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, type, description, price, local_price, duration_min, capacity')
    .eq('org_id', ORG_ID)
    .eq('is_active', true)
    .order('created_at')

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-brand-green-700 mb-2">프로그램</h1>
        <p className="text-gray-500 mb-8">원하시는 프로그램을 선택하고 예약하세요.</p>

        {!programs || programs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🐎</p>
            <p className="text-lg font-semibold">현재 운영 중인 프로그램이 없습니다.</p>
            <p className="text-sm mt-2">곧 새로운 프로그램이 추가될 예정입니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => {
              const icon = PROGRAM_ICONS[p.type] ?? '🐴'
              const hasDiscount = p.local_price && p.local_price !== p.price
              return (
                <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-brand-green-500 transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{icon}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-1">{p.name}</h2>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">
                    {p.description || '전문 강사와 함께하는 프리미엄 승마 프로그램입니다.'}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    {p.duration_min && <span>⏱ {p.duration_min}분</span>}
                    {p.capacity && <span>👥 최대 {p.capacity}명</span>}
                  </div>

                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 space-y-1.5">
                    <p className="text-xl font-black text-brand-green-700">
                      {(p.price ?? 0).toLocaleString()}원
                    </p>
                    {hasDiscount && (
                      <div className="border-t border-gray-200 pt-1.5">
                        <p className="text-sm font-bold text-amber-600">
                          괴산군민 {(p.local_price ?? 0).toLocaleString()}원
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/booking/${p.id}`}
                    className="block text-center bg-brand-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors"
                  >
                    예약하기
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
