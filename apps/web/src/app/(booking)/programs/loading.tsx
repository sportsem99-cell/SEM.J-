import Header from '@/components/features/Header'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function ProgramsLoading() {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-200 animate-pulse h-48" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
