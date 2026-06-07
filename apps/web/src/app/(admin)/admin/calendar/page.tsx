export default function AdminCalendar() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">예약 캘린더</h1>

      {/* 리소스 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['전체', '강사', '말', '마장'].map((f) => (
          <button
            key={f}
            className="px-4 py-1.5 rounded-full text-sm font-semibold border border-brand-green-700 text-brand-green-700 hover:bg-brand-green-700 hover:text-white transition-colors"
          >
            {f}
          </button>
        ))}
      </div>

      {/* 캘린더 플레이스홀더 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-5xl mb-4">📅</p>
        <p className="font-bold text-gray-700 mb-2">리소스 타임라인 캘린더</p>
        <p className="text-sm text-gray-500 mb-4">
          강사 · 말 · 마장을 가로축(시간) × 세로축(리소스)으로 표시
        </p>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-4 text-left leading-relaxed">
          📌 Phase 2에서 FullCalendar resourceTimeline으로 구현 예정<br />
          - 리소스별 예약 슬롯 시각화<br />
          - 드래그로 예약 시간 변경<br />
          - 충돌 시 자동 경고
        </p>
      </div>
    </div>
  )
}
