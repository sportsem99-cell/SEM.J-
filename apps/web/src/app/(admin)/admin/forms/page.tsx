import Link from 'next/link'
import { ADMIN_CATEGORIES } from '@/lib/forms-data'

export default function AdminFormsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">서식 관리</h1>
      <p className="text-sm text-gray-500 mb-8">관리자 전용 업무 서식</p>

      <div className="space-y-8">
        {ADMIN_CATEGORIES.map(cat => (
          <div key={cat.key}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="text-base font-bold text-gray-700">{cat.label}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.forms.map(form => (
                <Link key={form.id} href={`/admin/forms/${form.id}`}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-4 hover:border-brand-green-500 hover:shadow-md transition-all group">
                  <span className="text-2xl flex-shrink-0">{form.icon}</span>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-green-700 leading-snug flex-1">{form.title}</p>
                  <span className="text-gray-300 group-hover:text-brand-green-500 text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
