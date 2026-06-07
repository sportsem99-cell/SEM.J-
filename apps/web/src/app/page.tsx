import Link from 'next/link'
import Header from '@/components/features/Header'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 히어로 */}
      <section className="relative bg-brand-green-700 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          말과 함께하는 특별한 경험
        </h1>
        <p className="text-lg text-green-200 mb-8 max-w-xl mx-auto">
          충북 괴산 중원대학교 내 SEM.J 승마교육원에서<br />
          체험승마부터 전문 레슨까지 온라인으로 편리하게 예약하세요.
        </p>
        <Link
          href="/programs"
          className="inline-block bg-brand-gold-400 text-brand-green-900 px-8 py-3 rounded-full text-lg font-bold hover:bg-brand-gold-500 transition-colors"
        >
          프로그램 둘러보기
        </Link>
      </section>

      {/* 프로그램 카드 */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-brand-green-700 mb-10">
          주요 프로그램
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-brand-green-500 transition-all group"
            >
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-lg text-brand-green-700 mb-1 group-hover:text-brand-green-600">
                {p.title}
              </h3>
              <p className="text-sm text-gray-500">{p.desc}</p>
              <p className="mt-3 text-brand-gold-500 font-semibold text-sm">
                {p.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-brand-green-900 text-green-300 py-10 px-6 text-center text-sm">
        <p className="font-bold text-white mb-1">SEM.J 승마교육원</p>
        <p>충북 괴산군 중원대학교 내 | 대표: 정창덕</p>
        <p className="mt-1">문의: 카카오 채널 @semj승마</p>
      </footer>
    </main>
  )
}

const PROGRAMS = [
  {
    icon: '🐴',
    title: '체험승마',
    desc: '처음 타시는 분도 OK! 안전하게 말과 교감',
    price: '30,000원~',
    href: '/programs?type=experience',
  },
  {
    icon: '🏇',
    title: '개인레슨',
    desc: '1:1 맞춤 지도로 실력을 빠르게 향상',
    price: '60,000원~',
    href: '/programs?type=private',
  },
  {
    icon: '👥',
    title: '그룹레슨',
    desc: '소그룹(최대 6명) 함께 배우는 즐거움',
    price: '40,000원~',
    href: '/programs?type=group',
  },
  {
    icon: '🌟',
    title: '유소년 프로그램',
    desc: '어린이·청소년을 위한 맞춤 승마 교육',
    price: '35,000원~',
    href: '/programs?type=youth',
  },
]
