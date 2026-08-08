import Header from '@/components/features/Header'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function BookingDetailLoading() {
  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">
        <Skeleton className="h-5 w-24 mb-6" />
        <Skeleton className="h-7 w-36 mb-1" />
        <Skeleton className="h-5 w-52 mb-6" />

        {/* 일정 카드 */}
        <div className="bg-gray-200 animate-pulse rounded-3xl h-36 mb-4" />

        {/* 정보 카드 */}
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 mb-4 space-y-3">
            <Skeleton className="h-3 w-16" />
            {[1, 2, 3].map(j => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
