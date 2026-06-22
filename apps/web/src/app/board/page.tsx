import Header from '@/components/features/Header'

export default function BoardPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-gray-800 mb-2">게시판</h1>
        <p className="text-gray-500 text-sm mb-8">공지사항 및 자유게시판</p>

        <div className="flex gap-2 mb-6">
          {['공지사항', '자유게시판', 'Q&A'].map(tab => (
            <button key={tab} className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-brand-green-700 hover:text-white hover:border-brand-green-700 transition-colors">
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-gray-600 mb-1">게시글이 없습니다</p>
          <p className="text-sm">준비 중입니다</p>
        </div>
      </div>
    </>
  )
}
