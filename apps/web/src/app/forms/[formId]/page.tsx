import Header from '@/components/features/Header'
import Link from 'next/link'
import JotformEmbed from '@/components/features/JotformEmbed'
import { PUBLIC_CATEGORIES } from '@/lib/forms-data'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ formId: string }>
}

export default async function FormPage({ params }: Props) {
  const { formId } = await params
  const allForms = PUBLIC_CATEGORIES.flatMap(c => c.forms)
  const form = allForms.find(f => f.id === formId)

  if (!form) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/forms" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">← 목록으로</Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{form.icon}</span>
          <h1 className="text-xl font-black text-gray-800">{form.title}</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <JotformEmbed formId={form.id} />
        </div>
      </div>
    </>
  )
}
