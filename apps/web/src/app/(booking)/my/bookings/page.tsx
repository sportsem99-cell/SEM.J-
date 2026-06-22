import Header from '@/components/features/Header'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  pending:    { text: '대기 중',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed:  { text: '예약 확정', color: 'bg-green-100 text-green-700' },
  checked_in: { text: '체크인',    color: 'bg-blue-100 text-blue-700' },
  completed:  { text: '완료',      color: 'bg-gray-100 text-gray-600' },
  cancelled:  { text: '취소됨',    color: 'bg-red-100 text-red-600' },
  no_show:    { text: '노쇼',      color: 'bg-red-100 text-red-600' },
}

export default async function MyBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`id, status, start_at, end_at, total_amount, created_at, programs ( name, type )`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const now = new Date()
  const upcoming = bookings?.filter(b =>
    b.status !== 'cancelled' && b.status !== 'completed' && new Date(b.start_at) >= now
  ) ?? []
  const past = bookings?.filter(b =>
    b.status === 'completed' || b.status === 'cancelled' || new Date(b.start_at) < now
  ) ?? []

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">내 예약</h1>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">예정된 예약</h2>
          {upcoming.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-4xl mb-3">🐴</p>
              <p className="font-semibold text-gray-600 mb-1">예정된 예약이 없습니다</p>
              <p className="text-sm text-gray-400 mb-5">첫 번째 승마 체험을 예약해보세요!</p>
              <Link
                href="/programs"
                className="inline-block bg-brand-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors"
              >
                프로그램 보러가기
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">지난 예약</h2>
            <div className="space-y-3 opacity-70">
              {past.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const status = STATUS_LABEL[booking.status] ?? { text: booking.status, color: 'bg-gray-100 text-gray-600' }
  const startDate = new Date(booking.start_at)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="font-bold text-gray-800">{(booking.programs as any)?.name ?? '프로그램'}</p>
        <p className="text-sm text-gray-500 mt-1">
          {startDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}{' '}
          {startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-sm font-semibold text-brand-green-700 mt-1">
          {booking.total_amount.toLocaleString()}원
        </p>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
        {status.text}
      </span>
    </div>
  )
}
