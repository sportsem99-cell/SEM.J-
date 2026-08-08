import Header from '@/components/features/Header'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function ProfileLoading() {
  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-20 mb-6" />
        {/* 프로필 헤더 */}
        <div className="bg-gray-200 animate-pulse rounded-3xl h-40 mb-6" />
        {/* 폼 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-3 w-16" />
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
