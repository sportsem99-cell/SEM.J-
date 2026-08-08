import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/features/Header'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* ── 1. 풀스크린 히어로 (장애물 점프 사진) ────────── */}
      <section className="relative w-full" style={{ height: '100svh', minHeight: 640 }}>
        <Image
          src="/images/photo-jumping.jpg"
          alt="SEM.J 승마교육원 — 장애물 점프"
          fill
          className="object-cover object-center"
          priority
        />
        {/* 오버레이: 좌측 진하게, 우측 투명 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* 좌측 정렬 콘텐츠 */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-5xl">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 border border-white/25 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 w-fit">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
            <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
              충북 괴산 · 중원대학교 승마교육원
            </span>
          </div>

          <h1
            className="font-display text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', letterSpacing: '-0.01em' }}
          >
            말을 통해,<br />
            <em className="not-italic" style={{ color: '#c9a84c' }}>스포츠를 보다</em>
          </h1>

          <p className="text-white/65 text-base md:text-lg max-w-lg leading-relaxed mb-10">
            승마에서 시작된 움직임이 모든 스포츠의 기초가 됩니다.<br className="hidden md:block" />
            SEM.J에서 몸과 마음의 균형을 찾아보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/programs"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all shadow-xl w-fit"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)', color: '#1a2e1a' }}
            >
              프로그램 예약하기
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#programs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all w-fit"
            >
              프로그램 살펴보기
            </Link>
          </div>
        </div>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── 2. 핵심 수치 ──────────────────────────────────── */}
      <section style={{ background: '#111c11' }} className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {STATS.map(s => (
            <div key={s.label}>
              <p
                className="font-display font-bold mb-1"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#c9a84c' }}
              >
                {s.value}
              </p>
              <p className="text-white/45 text-xs tracking-wider uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. 포토 갤러리 (실제 현장 사진들) ─────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#b8973a' }}>Our Story</p>
            <h2 className="font-display text-gray-900 text-3xl md:text-4xl mb-3">현장에서 만나는 SEM.J</h2>
            <div className="w-10 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #b8973a, transparent)' }} />
          </div>

          {/* 비대칭 그리드 (모바일: 2열 단순 그리드 / md 이상: 12컬럼 비대칭) */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-2 md:gap-3 md:h-[520px]">
            {/* 큰 왼쪽: 야외 마장 */}
            <div className="col-span-2 h-56 md:h-auto md:col-span-7 md:row-span-2 relative rounded-3xl overflow-hidden">
              <Image src="/images/photo-outdoor.jpg" alt="야외 마장 전경" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-xs font-bold tracking-wider uppercase opacity-70 mb-0.5">Outdoor Arena</p>
                <p className="font-display text-lg font-semibold">드넓은 자연 마장</p>
              </div>
            </div>
            {/* 오른쪽 위: 아이들 수업 */}
            <div className="col-span-2 h-40 md:h-auto md:col-span-5 md:row-span-1 relative rounded-3xl overflow-hidden">
              <Image src="/images/photo-kids-lesson.jpg" alt="유소년 교육" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="font-display text-sm font-semibold">전문 강사 지도</p>
              </div>
            </div>
            {/* 오른쪽 아래 두 칸 */}
            <div className="col-span-1 h-32 md:h-auto md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden">
              <Image src="/images/photo-class.jpg" alt="이론 교육" fill className="object-cover" />
              <div className="absolute inset-0 bg-brand-green-900/30" />
            </div>
            <div className="col-span-1 h-32 md:h-auto md:col-span-3 md:row-span-1 relative rounded-3xl overflow-hidden">
              <Image src="/images/photo-youth-winter.jpg" alt="유소년 프로그램" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-display text-sm font-semibold">유소년 교육</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 브랜드 소개 ────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#b8973a' }}>About SEM.J</p>
            <h2 className="font-display text-gray-900 leading-snug mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              스포츠는<br />
              <span style={{ color: '#2d6a2d' }}>말 위에서 시작됩니다</span>
            </h2>
            <div className="w-10 h-0.5 mb-8" style={{ background: 'linear-gradient(90deg, #b8973a, transparent)' }} />
            <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
              괴산 중원대학교 캠퍼스 내 SEM.J 승마교육원은 이론부터 실기까지
              체계적인 커리큘럼으로 승마를 통한 전인적 스포츠 교육을 제공합니다.
            </p>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              어린이·청소년 유소년 교육부터 학교 단체 수업, 복지 바우처 프로그램까지
              누구나 접근할 수 있는 스포츠 복지 환경을 만들어갑니다.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {FEATURES.map(f => (
                <div key={f.label} className="text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: 'rgba(45,106,45,0.08)' }}
                  >
                    <span className="text-xl">{f.icon}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">{f.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 강사 수업 사진 */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <Image src="/images/photo-kids-lesson.jpg" alt="강사와 아이들" fill className="object-cover" />
            </div>
            <div
              className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100"
              style={{ minWidth: 155 }}
            >
              <p className="text-xs text-gray-400 mb-0.5">운영 시간</p>
              <p className="font-bold text-sm text-gray-800">화 ~ 일</p>
              <p className="text-xs text-gray-500">09:00 ~ 18:00</p>
              <p className="text-[10px] text-red-400 mt-1 font-medium">월요일 정기 휴장</p>
            </div>
            <div
              className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100"
              style={{ minWidth: 155 }}
            >
              <p className="text-xs text-gray-400 mb-0.5">위치</p>
              <p className="font-bold text-sm text-gray-800">충북 괴산</p>
              <p className="text-xs text-gray-500">중원대학교 내</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 프로그램 ─────────────────────────────────── */}
      <section id="programs" className="py-24 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#b8973a' }}>Programs</p>
            <h2 className="font-display text-gray-900 text-3xl md:text-4xl mb-3">승마 프로그램</h2>
            <div className="w-10 h-0.5 mx-auto" style={{ background: 'linear-gradient(90deg, #b8973a, transparent)' }} />
          </div>

          {/* 상단 3개 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {PROGRAMS_TOP.map((p, i) => (
              <ProgramCard key={p.href} program={p} colorIdx={i} />
            ))}
          </div>

          {/* 하단 2개 (넓게) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROGRAMS_BOTTOM.map((p, i) => (
              <ProgramCardWide key={p.href} program={p} colorIdx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. 복지 혜택 섹션 ────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#b8973a' }}>Why Horseback Riding</p>
            <h2 className="font-display text-gray-900 text-3xl md:text-4xl">승마가 주는 선물</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {BENEFITS.map(b => (
              <div
                key={b.title}
                className="bg-cream rounded-3xl p-6 border border-gray-100 card-lift"
                style={{ boxShadow: '0 2px 16px -4px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl"
                  style={{ background: 'rgba(45,106,45,0.08)' }}
                >
                  {b.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">{b.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. 현장 스트립 (가로 스크롤 사진) ─────────────── */}
      <section className="py-12 overflow-hidden" style={{ background: '#111c11' }}>
        <div className="flex gap-4 px-6 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {GALLERY_PHOTOS.map(g => (
            <div key={g.alt} className="flex-shrink-0 relative rounded-2xl overflow-hidden" style={{ width: 280, height: 200 }}>
              <Image src={g.src} alt={g.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-bold">{g.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. 비전 ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#111c11] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#b8973a' }}>Our Vision</p>
            <h2 className="font-display text-white text-3xl md:text-4xl leading-snug">
              승마에서 시작된 데이터,<br />
              <span style={{ color: '#c9a84c' }}>모든 스포츠로 확장됩니다</span>
            </h2>
            <p className="text-white/40 text-sm mt-4 max-w-lg mx-auto leading-relaxed">
              SEM.J는 말 위에서 수집된 신체 데이터를 AI로 분석하여 개인 맞춤형 트레이닝 솔루션으로 확장합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VISION_STEPS.map((s, i) => (
              <div
                key={s.title}
                className={`rounded-3xl p-8 text-center border transition-all ${
                  i === 1
                    ? 'border-[#b8973a]/40 bg-gradient-to-b from-[#b8973a]/10 to-transparent shadow-2xl'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
                  style={{ background: i === 1 ? 'rgba(184,151,58,0.15)' : 'rgba(255,255,255,0.05)' }}
                >
                  {s.icon}
                </div>
                <p className="text-xs font-bold tracking-wider uppercase mb-2" style={{ color: '#b8973a' }}>{i + 1}단계</p>
                <h3 className="font-display text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                <div
                  className="mt-5 inline-block text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: i === 0 ? 'rgba(45,106,45,0.3)' : i === 1 ? 'rgba(184,151,58,0.2)' : 'rgba(255,255,255,0.08)',
                    color: i === 0 ? '#6dba6d' : i === 1 ? '#c9a84c' : '#888',
                  }}
                >
                  {s.badge}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/mofit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)', color: '#111c11' }}
            >
              모핏AI 자세히 보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. 더 많은 서비스 ─────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#b8973a' }}>Services</p>
            <h2 className="font-display text-gray-900 text-3xl">더 많은 서비스</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICES.map(s => (
              <Link
                key={s.href}
                href={s.href}
                className="card-lift group bg-gray-50 hover:bg-brand-green-700 rounded-2xl p-6 text-center border border-gray-100 hover:border-brand-green-700"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl" style={{ background: 'rgba(45,106,45,0.08)' }}>
                  {s.icon}
                </div>
                <p className="font-bold text-sm text-gray-700 group-hover:text-white transition-colors">{s.title}</p>
                {s.badge && (
                  <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#c9a84c', color: '#111' }}>
                    {s.badge}
                  </span>
                )}
                <p className="text-xs text-gray-400 group-hover:text-green-200 mt-1 transition-colors">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA 배너 ──────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <Image src="/images/photo-outdoor.jpg" alt="마장" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,46,26,0.6), transparent)' }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#c9a84c' }}>Ready to Ride?</p>
          <h2 className="font-display text-white text-3xl md:text-4xl mb-4 leading-snug">
            오늘, 첫 번째 말 위에<br />올라보세요
          </h2>
          <p className="text-white/65 text-sm mb-8 leading-relaxed">
            초보자도 안전하게, 전문 강사가 처음부터 함께합니다.<br />
            바우처 이용 가능 · 단체 예약 문의 환영
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c96a)', color: '#1a2e1a' }}
          >
            지금 예약하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── 11. 푸터 ──────────────────────────────────────── */}
      <footer className="bg-[#0f1a0f] text-gray-400 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            <div>
              <p className="font-display text-3xl font-bold text-white mb-1">SEM.J</p>
              <p className="text-xs tracking-wider uppercase mb-4" style={{ color: '#b8973a' }}>Sports that Everyone Makes</p>
              <p className="text-sm leading-relaxed text-gray-500">
                충북 괴산군 괴산읍 문무로 468<br />중원대학교 내 승마교육원
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Contact</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">대표번호</span><span className="text-white font-semibold ml-2">010-6822-1131</span></p>
                <p><span className="text-gray-600">문의번호</span><span className="text-white font-semibold ml-2">070-4132-6134</span></p>
                <p><span className="text-gray-600">이메일</span><span className="text-white font-semibold ml-2">sportsem99@gmail.com</span></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Hours</p>
              <div className="space-y-1 text-sm">
                <p className="text-white">화요일 ~ 일요일</p>
                <p className="text-gray-500">오전 09:00 ~ 오후 18:00</p>
                <p className="text-red-400/80 text-xs mt-2 font-medium">매주 월요일 정기 휴장</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© 2026 SEM.J · All rights reserved.</p>
            <p style={{ color: '#b8973a' }}>Powered by Mofit AI</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// ── 프로그램 카드 컴포넌트 ────────────────────────────────────────────────

const PALETTE = [
  { bar: 'linear-gradient(90deg, #2d6a2d, #4a8f4a)', icon: 'rgba(45,106,45,0.08)', text: '#2d6a2d' },
  { bar: 'linear-gradient(90deg, #b8973a, #d4b05a)', icon: 'rgba(184,151,58,0.08)', text: '#b8973a' },
  { bar: 'linear-gradient(90deg, #1a3d3d, #2d6a6a)', icon: 'rgba(26,61,61,0.08)',   text: '#1a3d3d' },
  { bar: 'linear-gradient(90deg, #6b3a2a, #9a5c3e)', icon: 'rgba(107,58,42,0.08)',  text: '#6b3a2a' },
  { bar: 'linear-gradient(90deg, #2a3d6b, #3e5c9a)', icon: 'rgba(42,61,107,0.08)',  text: '#2a3d6b' },
]

function ProgramCard({ program, colorIdx }: { program: typeof PROGRAMS_TOP[0]; colorIdx: number }) {
  const c = PALETTE[colorIdx % PALETTE.length]
  return (
    <Link
      href={program.href}
      className="card-lift group relative rounded-3xl overflow-hidden border border-gray-100 bg-white flex flex-col"
      style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)' }}
    >
      <div className="h-3 w-full" style={{ background: c.bar }} />
      <div className="p-7 flex flex-col flex-1">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl" style={{ background: c.icon }}>
          {program.icon}
        </div>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:transition-colors" style={{ color: undefined }}>
          {program.title}
        </h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed flex-1">{program.desc}</p>
        <div className="border-t border-gray-100 pt-4 space-y-1">
          {program.prices.map((pr, j) => (
            <p key={j} className="text-sm font-semibold" style={{ color: c.text }}>{pr}</p>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-1 text-sm font-bold" style={{ color: c.text }}>
          <span>예약하기</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

function ProgramCardWide({ program, colorIdx }: { program: typeof PROGRAMS_BOTTOM[0]; colorIdx: number }) {
  const c = PALETTE[(colorIdx + 3) % PALETTE.length]
  return (
    <Link
      href={program.href}
      className="card-lift group relative rounded-3xl overflow-hidden border bg-white flex"
      style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)', borderColor: 'rgba(0,0,0,0.06)' }}
    >
      {/* 좌측 컬러 바 */}
      <div className="w-3 flex-shrink-0" style={{ background: c.bar }} />
      <div className="p-6 flex gap-5 items-start flex-1">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl mt-1" style={{ background: c.icon }}>
          {program.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-gray-900">{program.title}</h3>
            {program.badge && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-1"
                style={{ background: c.icon, color: c.text, border: `1px solid ${c.text}30` }}
              >
                {program.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3 leading-relaxed">{program.desc}</p>
          <div className="space-y-0.5">
            {program.prices.map((pr, j) => (
              <p key={j} className="text-sm font-semibold" style={{ color: c.text }}>{pr}</p>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm font-bold" style={{ color: c.text }}>
            <span>문의 / 예약</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── 데이터 ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '5종', label: '전문 프로그램' },
  { value: '안전', label: '전담 강사 동행' },
  { value: '바우처', label: '복지 서비스 가능' },
  { value: '괴산', label: '중원대 캠퍼스' },
]

const FEATURES = [
  { icon: '🌿', label: '자연 환경', sub: '드넓은 마장' },
  { icon: '🛡️', label: '안전 우선', sub: '전문 강사 동행' },
  { icon: '📚', label: '이론+실기', sub: '체계적 커리큘럼' },
]

const PROGRAMS_TOP = [
  {
    icon: '🐴',
    title: '체험승마',
    desc: '처음이어도 괜찮습니다. 말과의 첫 교감을 전문 강사와 함께 안전하게 경험해보세요.',
    prices: ['1회 (10분 기승) 20,000원'],
    href: '/booking/experience',
  },
  {
    icon: '🏇',
    title: '개인레슨',
    desc: '1:1 전담 지도로 균형감각과 자세를 집중적으로 향상시킵니다.',
    prices: ['1회 45,000원 / 10회 450,000원', '괴산 군민 특가 38,250원~'],
    href: '/booking/private',
  },
  {
    icon: '⭐',
    title: '유소년 프로그램',
    desc: '어린이·청소년의 정서 발달과 체력 향상을 위한 맞춤 승마 교육 과정입니다.',
    prices: ['괴산군 유소년 10회 315,000원', '10인 이상 단체 인당 25,000원'],
    href: '/booking/youth',
  },
]

const PROGRAMS_BOTTOM = [
  {
    icon: '🏫',
    title: '학생승마',
    desc: '학교 단위 교육 프로그램으로 정해진 기간 동안 체계적인 이론+실기 커리큘럼을 운영합니다. 단체 학생 대상으로 안전 교육부터 기승 실습까지 진행됩니다.',
    prices: ['기간·인원별 별도 협의', '학교·기관 단체 문의 환영'],
    href: '/programs',
    badge: '단체 프로그램',
  },
  {
    icon: '💪',
    title: '몸 튼튼 슈퍼키즈 승마서비스',
    desc: '문화누리카드 등 바우처를 활용해 이용할 수 있는 어린이 복지 승마 서비스입니다. 경제적 부담 없이 아이들이 승마를 경험할 수 있도록 지원합니다.',
    prices: ['바우처 (문화누리카드 등) 이용 가능', '자세한 내용은 전화 문의'],
    href: '/programs',
    badge: '복지 바우처',
  },
]

const GALLERY_PHOTOS = [
  { src: '/images/photo-jumping.jpg',     alt: '장애물 점프',   label: '전문 승마' },
  { src: '/images/photo-outdoor.jpg',     alt: '야외 마장',     label: '드넓은 자연' },
  { src: '/images/photo-youth-winter.jpg',alt: '유소년 교육',   label: '유소년 교육' },
  { src: '/images/photo-kids-lesson.jpg', alt: '강사 수업',     label: '전문 강사' },
  { src: '/images/photo-class.jpg',       alt: '이론 수업',     label: '이론 교육' },
  { src: '/images/arena.jpg',             alt: '마장 전경',     label: '마장 전경' },
]

const BENEFITS = [
  { icon: '⚖️', title: '균형감각 향상', desc: '말 위에서의 균형 훈련은 코어 근육과 자세 교정에 탁월합니다.' },
  { icon: '🧘', title: '정서적 안정', desc: '말과의 교감은 스트레스 해소와 심리적 안정에 효과가 있습니다.' },
  { icon: '💪', title: '전신 운동', desc: '승마 중 600개 이상의 근육이 자연스럽게 활성화됩니다.' },
  { icon: '🌱', title: '자연 치유', desc: '자연 속 활동으로 심신이 함께 건강해지는 생태 복지 운동입니다.' },
]

const VISION_STEPS = [
  {
    icon: '🐴',
    title: '승마',
    desc: '말과의 교감에서 발생하는 균형·자세·움직임 데이터를 수집합니다.',
    badge: '베이스 플랫폼',
  },
  {
    icon: '🤖',
    title: '모핏 AI',
    desc: '신체 움직임·균형·자세를 AI가 실시간으로 분석하고 피드백합니다.',
    badge: '개발 중',
  },
  {
    icon: '🏅',
    title: '모든 스포츠',
    desc: '도출된 트레이닝 방법론을 전 스포츠 종목으로 확장합니다.',
    badge: '확장 예정',
  },
]

const SERVICES = [
  { icon: '🏆', title: '시합 일정', desc: '대회 일정 확인', href: '/competition', badge: undefined },
  { icon: '📋', title: '게시판', desc: '공지·자유게시판', href: '/board', badge: undefined },
  { icon: '📁', title: '자료실', desc: '교육자료 다운로드', href: '/resources', badge: undefined },
  { icon: '🤖', title: '모핏 AI', desc: 'AI 코칭 서비스', href: '/mofit', badge: 'Beta' },
]
