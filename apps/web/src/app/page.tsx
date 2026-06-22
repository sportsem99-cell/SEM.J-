import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/features/Header'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 히어로 */}
      <section className="relative bg-brand-green-700 text-white overflow-hidden" style={{ minHeight: '520px' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          {/* 로고 */}
          <div className="flex justify-center">
            <Image src="/images/logo.webp" alt="SEM.J 로고" width={320} height={320}
              className="rounded-3xl shadow-2xl border-2 border-green-500 w-full max-w-xs" />
          </div>

          {/* 텍스트 */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-600/50 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-100 font-medium">충북 괴산군 문무로 468</span>
            </div>
            <p className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-2">Sports that Everyone Makes</p>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              말과 함께하는<br />
              <span className="text-yellow-400">특별한 경험</span>
            </h1>
            <p className="text-green-200 text-sm mb-2 leading-relaxed">
              승마에서 시작해 모든 스포츠로 —<br />
              <span className="text-yellow-300 font-semibold">모핏AI</span>가 당신의 움직임을 분석합니다
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6">
              <Link href="/programs"
                className="bg-yellow-400 text-green-900 px-7 py-3 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg">
                프로그램 예약 →
              </Link>
              <Link href="/mofit"
                className="border border-yellow-400/60 text-yellow-300 px-7 py-3 rounded-full font-bold text-sm hover:bg-green-600 transition-colors">
                모핏AI 알아보기
              </Link>
            </div>
          </div>

          {/* 마장 사진 */}
          <div className="w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-green-600" style={{ aspectRatio: '4/3' }}>
              <Image src="/images/arena.jpg" alt="SEM.J 승마교육원 마장" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* 승마 프로그램 */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand-green-700 text-xs font-bold tracking-widest uppercase mb-2">Programs</p>
          <h2 className="text-2xl font-black text-gray-800 mb-2">승마 프로그램</h2>
          <p className="text-gray-400 text-sm">SEM.J 승마교육원의 다양한 교육 과정</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROGRAMS.map((p) => (
            <Link key={p.href} href={p.href}
              className="group border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-green-400 transition-all bg-white">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-brand-green-700">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
              <div className="space-y-0.5">
                {p.prices.map((pr, i) => (
                  <p key={i} className="text-sm font-semibold text-brand-green-700">{pr}</p>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 비전: 승마 → 모핏AI → 모든 스포츠 */}
      <section className="py-20 px-6 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">Our Vision</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-snug">
            승마에서 시작된 데이터,<br />
            <span className="text-yellow-400">모든 스포츠</span>로 확장됩니다
          </h2>
          <p className="text-gray-400 text-sm mb-14 max-w-xl mx-auto leading-relaxed">
            SEM.J는 단순한 승마 교육원이 아닙니다. 말 위에서 만들어지는 신체 데이터를
            모핏AI가 분석하여 개인 맞춤형 트레이닝 솔루션을 제공하고,
            그 방법론을 모든 스포츠로 확장해 나갑니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-brand-green-600 transition-all">
              <div className="text-5xl mb-4">🐴</div>
              <h3 className="font-black text-lg mb-2 text-white">1단계 · 승마</h3>
              <p className="text-gray-400 text-sm leading-relaxed">말과의 교감에서 발생하는<br />균형·자세·움직임 데이터</p>
              <div className="mt-4 inline-block bg-brand-green-700/30 text-green-400 text-xs px-3 py-1 rounded-full font-semibold">베이스 플랫폼</div>
            </div>
            <div className="relative">
              <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 text-yellow-400 text-3xl">→</div>
              <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-yellow-400 text-3xl">→</div>
              <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-400/5 border border-yellow-400/40 rounded-3xl p-8 text-center shadow-2xl">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="font-black text-lg mb-2 text-yellow-400">2단계 · 모핏AI</h3>
                <p className="text-gray-300 text-sm leading-relaxed">신체 움직임·균형·자세를<br />AI가 실시간 분석</p>
                <div className="mt-4 inline-block bg-yellow-400/20 text-yellow-300 text-xs px-3 py-1 rounded-full font-semibold">개발 중</div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-yellow-400/40 transition-all">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="font-black text-lg mb-2 text-white">3단계 · 모든 스포츠</h3>
              <p className="text-gray-400 text-sm leading-relaxed">도출된 트레이닝 방법론을<br />전 종목으로 확장</p>
              <div className="mt-4 inline-block bg-gray-700/50 text-gray-400 text-xs px-3 py-1 rounded-full font-semibold">확장 예정</div>
            </div>
          </div>
          <div className="mt-10">
            <a href="/mofit" className="inline-block bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors text-sm">
              모핏AI 자세히 보기 →
            </a>
          </div>
        </div>
      </section>

      {/* 서비스 */}
      <section className="py-12 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-800 mb-2">더 많은 서비스</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map(s => (
            <Link key={s.href} href={s.href}
              className="group bg-gray-50 hover:bg-brand-green-700 rounded-2xl p-5 text-center transition-all border border-gray-100 hover:border-brand-green-700 hover:shadow-lg">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-bold text-sm text-gray-700 group-hover:text-white">{s.title}</p>
              {s.badge && (
                <span className="inline-block mt-1 text-[10px] bg-yellow-400 text-green-900 px-2 py-0.5 rounded-full font-bold">{s.badge}</span>
              )}
              <p className="text-xs text-gray-400 group-hover:text-green-200 mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-2xl font-black text-white mb-1">SEM.J</p>
              <p className="text-xs text-yellow-400 mb-2 font-medium">모두가 만들어가는 스포츠</p>
              <p className="text-sm leading-relaxed">
                충북 괴산군 괴산읍 문무로 468<br />
                (중원대학교 내 승마교육원)
              </p>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">대표번호</span> <span className="text-white font-semibold">010-6822-1131</span></p>
              <p><span className="text-gray-500">문의번호</span> <span className="text-white font-semibold">070-4132-6134</span></p>
              <p><span className="text-gray-500">이메일</span> <span className="text-white font-semibold">sportsem99@gmail.com</span></p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600">
            © 2026 SEM.J · Sports that Everyone Makes · All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

const PROGRAMS = [
  {
    icon: '🐴',
    title: '체험승마',
    desc: '처음 타시는 분도 OK! 안전하게 말과 교감',
    prices: ['1회 (10분 기승) 20,000원'],
    href: '/booking/experience',
  },
  {
    icon: '🏇',
    title: '개인레슨',
    desc: '1:1 맞춤 지도로 실력을 빠르게 향상',
    prices: [
      '1회 45,000원 / 10회 450,000원',
      '군민 1회 38,250원 / 10회 382,500원',
    ],
    href: '/booking/private',
  },
  {
    icon: '🌟',
    title: '유소년 프로그램',
    desc: '어린이·청소년을 위한 맞춤 승마 교육',
    prices: [
      '괴산군 유소년 10회 315,000원',
      '10인 이상 단체 인당 25,000원',
    ],
    href: '/booking/youth',
  },
]

const SERVICES = [
  { icon: '🏆', title: '시합 일정', desc: '대회 일정 확인', href: '/competition', badge: undefined },
  { icon: '📋', title: '게시판', desc: '공지·자유게시판', href: '/board', badge: undefined },
  { icon: '📁', title: '자료실', desc: '교육자료 다운로드', href: '/resources', badge: undefined },
  { icon: '🤖', title: '모핏AI', desc: 'AI 코칭 서비스', href: '/mofit', badge: 'Beta' },
]
