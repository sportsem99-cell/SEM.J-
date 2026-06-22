import Header from '@/components/features/Header'

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-gray-800 mb-2">자료실</h1>
        <p className="text-gray-500 text-sm mb-8">교육 자료 및 서식 다운로드</p>

        <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-semibold text-gray-600 mb-1">등록된 자료가 없습니다</p>
          <p className="text-sm">준비 중입니다</p>
        </div>
      </div>
    </>
  )
}
