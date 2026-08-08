import Header from '@/components/features/Header'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function BookingSuccessLoading() {
  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mx-auto mb-6" />
            <Skeleton className="h-7 w-52 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-6">
            <div className="bg-gray-200 animate-pulse h-24" />
            <div className="px-6 py-6 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-14 w-full mb-3" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </>
  )
}
