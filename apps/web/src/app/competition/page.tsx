import Header from '@/components/features/Header'
import Link from 'next/link'

export default function CompetitionPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-gray-800 mb-2">시합 일정</h1>
        <p className="text-gray-500 text-sm mb-8">대회 일정 및 팀 등록 안내</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <Link href="/competition/schedule"
            className="bg-brand-green-700 text-white rounded-2xl p-6 hover:bg-brand-green-600 transition-colors">
            <p className="text-3xl mb-3">🏆</p>
            <p className="font-bold text-lg mb-1">시합 일정</p>
            <p className="text-green-200 text-sm">예정된 대회 일정을 확인하세요</p>
          </Link>
          <Link href="/competition/register"
            className="border-2 border-brand-green-700 text-brand-green-700 rounded-2xl p-6 hover:bg-brand-green-50 transition-colors">
            <p className="text-3xl mb-3">📝</p>
            <p className="font-bold text-lg mb-1">시합 신청 및 팀 등록</p>
            <p className="text-gray-500 text-sm">팀·마필·선수 등록을 진행하세요</p>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-semibold text-gray-600 mb-1">예정된 시합 일정이 없습니다</p>
          <p className="text-sm">새 일정이 등록되면 여기에 표시됩니다</p>
        </div>
      </div>
    </>
  )
}
