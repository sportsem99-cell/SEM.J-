import Header from '@/components/features/Header'
import Link from 'next/link'
import JotformEmbed from '@/components/features/JotformEmbed'

export default function CompetitionApplyPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/competition/register" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">← 시합 신청으로</Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📋</span>
          <h1 className="text-xl font-black text-gray-800">시합 신청</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <JotformEmbed formId="260860782042052" />
        </div>
      </div>
    </>
  )
}
