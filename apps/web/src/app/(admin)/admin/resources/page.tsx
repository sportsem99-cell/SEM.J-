const RESOURCE_TYPES = [
  { type: 'instructor', label: '강사', icon: '👤', color: 'bg-blue-100 text-blue-700' },
  { type: 'horse',      label: '말',   icon: '🐴', color: 'bg-amber-100 text-amber-700' },
  { type: 'arena',      label: '마장', icon: '🏟️', color: 'bg-green-100 text-green-700' },
]

export default function AdminResources() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">리소스 관리</h1>
        <button className="bg-brand-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
          + 리소스 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESOURCE_TYPES.map((rt) => (
          <div key={rt.type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{rt.icon}</span>
              <h2 className="font-bold text-gray-800">{rt.label}</h2>
              <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${rt.color}`}>
                0명/마리
              </span>
            </div>
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>Supabase 연결 후</p>
              <p>{rt.label} 목록이 표시됩니다</p>
            </div>
            <button className="w-full text-sm text-brand-green-700 border border-brand-green-700 rounded-xl py-2 hover:bg-brand-green-700 hover:text-white transition-colors">
              + {rt.label} 추가
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
