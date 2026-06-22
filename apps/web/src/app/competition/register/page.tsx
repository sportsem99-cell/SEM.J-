import Header from '@/components/features/Header'
import Link from 'next/link'

export default function CompetitionRegisterPage() {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/competition" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">← 시합 일정으로</Link>
        <h1 className="text-2xl font-black text-gray-800 mb-2">시합 신청 및 팀 등록</h1>
        <p className="text-gray-500 text-sm mb-8">팀, 마필, 선수를 등록하고 시합에 참가하세요</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🐎', title: '팀 마필 등록', desc: '참가 말 정보 등록', href: '/competition/register/horse' },
            { icon: '🏇', title: '팀 선수 등록', desc: '선수 정보 및 자격 등록', href: '/competition/register/rider' },
            { icon: '📋', title: '시합 신청', desc: '대회 참가 신청서 제출', href: '/competition/register/apply' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-brand-green-500 hover:shadow-md transition-all text-center">
              <p className="text-4xl mb-3">{item.icon}</p>
              <p className="font-bold text-gray-800 mb-1">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800">
          📌 시합 신청 전 팀 마필 및 선수 등록이 완료되어야 합니다. 문의: 070-4132-6134
        </div>
      </div>
    </>
  )
}
