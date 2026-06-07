export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">대시보드</h1>

      {/* 오늘 현황 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">{card.icon}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 오늘 예약 목록 (플레이스홀더) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4">오늘 예약 ({new Date().toLocaleDateString('ko-KR')})</h2>
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm">Supabase 연결 후 실시간 예약 현황이 표시됩니다</p>
        </div>
      </div>
    </div>
  )
}

const STAT_CARDS = [
  { icon: '📅', label: '오늘 예약',   value: '-' },
  { icon: '✅', label: '완료',        value: '-' },
  { icon: '⏳', label: '대기 중',     value: '-' },
  { icon: '💰', label: '오늘 매출',   value: '-' },
]
