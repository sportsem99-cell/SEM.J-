import Header from '@/components/features/Header'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function BookingsLoading() {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-28 mb-6" />

        {/* 탭 스켈레톤 */}
        <div className="flex gap-2 mb-6">
          {['w-20', 'w-20', 'w-16', 'w-16'].map((w, i) => (
            <Skeleton key={i} className={`h-9 rounded-xl ${w}`} />
          ))}
        </div>

        {/* 카드 스켈레톤 */}
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
