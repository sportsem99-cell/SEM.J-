import Header from '@/components/features/Header'
import Link from 'next/link'

export default function MyBookingsPage() {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">내 예약</h1>

        {/* 탭 */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {['예정', '완료', '취소'].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors
                ${i === 0 ? 'bg-white text-brand-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 빈 상태 */}
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🐴</p>
          <p className="font-semibold text-gray-600 mb-1">예약 내역이 없습니다</p>
          <p className="text-sm mb-6">첫 번째 승마 체험을 예약해보세요!</p>
          <Link
            href="/programs"
            className="inline-block bg-brand-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors"
          >
            프로그램 보러가기
          </Link>
        </div>
      </div>
    </>
  )
}
