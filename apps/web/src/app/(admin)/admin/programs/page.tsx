const PROGRAMS = [
  { type: 'experience', name: '체험승마',     price: '30,000원', duration: '60분', capacity: 6 },
  { type: 'private',    name: '개인레슨',     price: '60,000원', duration: '60분', capacity: 1 },
  { type: 'group',      name: '그룹레슨',     price: '40,000원', duration: '60분', capacity: 6 },
  { type: 'youth',      name: '유소년 프로그램', price: '35,000원', duration: '60분', capacity: 6 },
]

export default function AdminPrograms() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">프로그램 관리</h1>
        <button className="bg-brand-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
          + 프로그램 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => (
          <div key={p.type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
              <div className="flex gap-3 text-sm text-gray-500">
                <span>💰 {p.price}</span>
                <span>⏱ {p.duration}</span>
                <span>👥 최대 {p.capacity}명</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">수정</button>
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold">운영 중</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
