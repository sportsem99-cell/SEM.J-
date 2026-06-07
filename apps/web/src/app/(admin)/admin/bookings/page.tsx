export default function AdminBookings() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">예약 관리</h1>
        <button className="bg-brand-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
          + 예약 직접 등록
        </button>
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-3 flex-wrap">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>전체 상태</option>
          <option>확정</option>
          <option>대기</option>
          <option>취소</option>
          <option>완료</option>
        </select>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>전체 프로그램</option>
          <option>체험승마</option>
          <option>개인레슨</option>
          <option>그룹레슨</option>
          <option>유소년</option>
        </select>
        <input
          type="date"
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 예약 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">예약자</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">프로그램</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">일시</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">상태</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold">금액</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-16 text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p>Supabase 연결 후 예약 목록이 표시됩니다</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
