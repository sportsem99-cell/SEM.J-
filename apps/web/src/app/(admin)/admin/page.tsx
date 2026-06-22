import { createAdminClient } from '@/lib/supabase/admin'

const ORG_ID = '00000000-0000-0000-0000-000000000001'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthEnd = new Date()
  monthEnd.setMonth(monthEnd.getMonth() + 1)
  monthEnd.setDate(0)
  monthEnd.setHours(23, 59, 59, 999)

  const { data: todayBookings } = await supabase
    .from('bookings')
    .select(`id, status, total_amount, start_at, programs ( name )`)
    .eq('org_id', ORG_ID)
    .gte('start_at', monthStart.toISOString())
    .lte('start_at', monthEnd.toISOString())
    .order('start_at', { ascending: true })

  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', ORG_ID)
    .neq('status', 'cancelled')

  const bookings = todayBookings ?? []
  const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length
  const pending = bookings.filter(b => b.status === 'pending').length
  const todayRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  const statCards = [
    { icon: '📅', label: '이번달 예약',  value: `${bookings.length}건` },
    { icon: '✅', label: '확정',       value: `${confirmed}건` },
    { icon: '⏳', label: '대기 중',    value: `${pending}건` },
    { icon: '💰', label: '오늘 매출',  value: `${todayRevenue.toLocaleString()}원` },
  ]

  const STATUS_LABEL: Record<string, { text: string; color: string }> = {
    pending:    { text: '대기',   color: 'bg-yellow-100 text-yellow-700' },
    confirmed:  { text: '확정',   color: 'bg-green-100 text-green-700' },
    checked_in: { text: '체크인', color: 'bg-blue-100 text-blue-700' },
    completed:  { text: '완료',   color: 'bg-gray-100 text-gray-600' },
    cancelled:  { text: '취소',   color: 'bg-red-100 text-red-600' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-sm text-gray-400">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 오늘 예약 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">이번 달 예약 현황</h2>
          <span className="text-xs text-gray-400">전체 누적 {totalBookings ?? 0}건</span>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-sm">이번 달 예약이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => {
              const status = STATUS_LABEL[b.status] ?? { text: b.status, color: 'bg-gray-100 text-gray-600' }
              const startTime = new Date(b.start_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-green-700 w-12">{startTime}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {(b.programs as any)?.name ?? '프로그램'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{b.total_amount.toLocaleString()}원</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
