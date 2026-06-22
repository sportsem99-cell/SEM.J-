import Header from '@/components/features/Header'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const TABS = [
  { key: 'pending',   label: '대기 중',  color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { key: 'confirmed', label: '예약 확정', color: 'text-green-700 bg-green-50 border-green-200' },
  { key: 'completed', label: '완료',     color: 'text-gray-600 bg-gray-50 border-gray-200' },
  { key: 'cancelled', label: '취소',     color: 'text-red-600 bg-red-50 border-red-200' },
]

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

interface SearchParams { tab?: string }

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const tab = params.tab || 'pending'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: allBookings } = await supabase
    .from('bookings')
    .select(`id, status, start_at, end_at, total_amount, created_at, cancel_reason, programs ( name, type )`)
    .eq('user_id', user.id)
    .order('start_at', { ascending: false })

  const counts: Record<string, number> = {}
  TABS.forEach(t => {
    counts[t.key] = (allBookings ?? []).filter(b => b.status === t.key).length
  })
  const filtered = (allBookings ?? []).filter(b => b.status === tab)

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">내 예약</h1>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
          {TABS.map(t => (
            <Link key={t.key} href={`/my/bookings?tab=${t.key}`}
              className={`px-4 py-2 text-sm font-semibold rounded-t-xl border-b-2 transition-colors
                ${tab === t.key
                  ? 'border-brand-green-700 text-brand-green-700'
                  : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t.label}
              {counts[t.key] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-brand-green-100 text-brand-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[t.key]}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* 예약 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-2xl">
            <p className="text-4xl mb-3">🐴</p>
            <p className="font-semibold text-gray-600 mb-1">
              {tab === 'pending' ? '대기 중인 예약이 없습니다' :
               tab === 'confirmed' ? '확정된 예약이 없습니다' :
               tab === 'completed' ? '완료된 예약이 없습니다' : '취소된 예약이 없습니다'}
            </p>
            {(tab === 'pending' || tab === 'confirmed') && (
              <>
                <p className="text-sm text-gray-400 mb-5">첫 번째 승마 체험을 예약해보세요!</p>
                <Link href="/programs"
                  className="inline-block bg-brand-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
                  프로그램 보러가기
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const startDate = new Date(booking.start_at)
  const isCancelled = booking.status === 'cancelled'

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${isCancelled ? 'border-red-100 opacity-80' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-800">{booking.programs?.name ?? '프로그램'}</p>
          <p className="text-sm text-gray-500 mt-1">
            {startDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}{' '}
            {startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-sm font-semibold text-brand-green-700 mt-1">
            {booking.total_amount?.toLocaleString()}원
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[booking.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {TABS.find(t => t.key === booking.status)?.label ?? booking.status}
        </span>
      </div>

      {/* 취소 사유 + 재예약 */}
      {isCancelled && (
        <div className="mt-4 pt-4 border-t border-red-100">
          {booking.cancel_reason && (
            <div className="bg-red-50 rounded-xl p-3 mb-3">
              <p className="text-xs font-bold text-red-600 mb-1">취소 사유</p>
              <p className="text-sm text-red-700">{booking.cancel_reason}</p>
            </div>
          )}
          <Link href={`/programs`}
            className="inline-block bg-brand-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
            재예약 신청하기
          </Link>
        </div>
      )}
    </div>
  )
}
