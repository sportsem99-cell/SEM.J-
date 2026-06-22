import Link from 'next/link'
import JotformEmbed from '@/components/features/JotformEmbed'
import { ADMIN_CATEGORIES } from '@/lib/forms-data'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ formId: string }>
}

export default async function AdminFormPage({ params }: Props) {
  const { formId } = await params
  const allForms = ADMIN_CATEGORIES.flatMap(c => c.forms)
  const form = allForms.find(f => f.id === formId)

  if (!form) {
    notFound()
  }

  return (
    <div>
      <Link href="/admin/forms" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">← 서식 목록으로</Link>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{form.icon}</span>
        <h1 className="text-xl font-black text-gray-800">{form.title}</h1>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <JotformEmbed formId={form.id} />
      </div>
    </div>
  )
}
