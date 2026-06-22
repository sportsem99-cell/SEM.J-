import Header from '@/components/features/Header'
import Link from 'next/link'
import { PUBLIC_CATEGORIES } from '@/lib/forms-data'

export default function FormsPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black text-gray-800 mb-2">신청서 / 서식</h1>
        <p className="text-gray-500 text-sm mb-10">필요한 신청서를 선택하세요</p>

        <div className="space-y-10">
          {PUBLIC_CATEGORIES.map(cat => (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{cat.icon}</span>
                <h2 className="text-lg font-bold text-gray-800">{cat.label}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.forms.map(form => (
                  <Link key={form.id} href={`/forms/${form.id}`}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-4 hover:border-brand-green-500 hover:shadow-md transition-all group">
                    <span className="text-2xl flex-shrink-0">{form.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-green-700 leading-snug">{form.title}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-brand-green-500 text-sm">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
