import Header from '@/components/features/Header'
import Link from 'next/link'

export default function MofitPage() {
  return (
    <>
      <Header />
      <div className="bg-gray-950 min-h-screen text-white">

        {/* 히어로 */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase">
            AI 연구 진행중 · 상표 출원 진행중 · 현장 데이터 기반 구축중
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
            MoFit <span className="text-yellow-400">AI</span>
          </h1>
          <p className="text-gray-400 text-base mb-2 font-medium tracking-widest">Motion Fitness AI Platform</p>
          <p className="text-2xl font-bold text-white mt-6 mb-4 leading-snug">
            데이터로 움직임을 분석하고,<br />
            <span className="text-yellow-400">AI로 성장을 설계하다</span>
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
            MoFit AI(모핏AI)는 승마를 포함한 스포츠 활동에서 발생하는 신체 움직임, 균형, 자세, 운동 데이터를 분석하여
            개인 맞춤형 트레이닝과 건강 관리 솔루션을 제공하는 AI 기반 운동 분석 시스템입니다.
            현재 상표 출원 및 연구 개발이 진행 중에 있습니다.
          </p>
        </div>

        {/* 3단계 비전 흐름 */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            <div className="bg-gray-900 border border-brand-green-700/40 rounded-3xl p-8 text-center hover:border-brand-green-600 transition-all">
              <div className="text-5xl mb-4">🐴</div>
              <div className="text-green-400 text-xs font-bold tracking-widest uppercase mb-2">STEP 01</div>
              <h3 className="font-black text-lg mb-3">승마 베이스</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                평보 승마 중 라이더의 모션과 근전도(EMG)를 실시간 측정. 균형·코어안정성·자세정렬·반응속도 데이터 수집
              </p>
              <div className="mt-4 inline-block bg-brand-green-700/30 text-green-400 text-xs px-3 py-1 rounded-full font-semibold">베이스 플랫폼</div>
            </div>

            <div className="relative bg-gradient-to-b from-yellow-500/10 to-transparent border border-yellow-400/50 rounded-3xl p-8 text-center">
              <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-yellow-400 text-2xl font-bold">→</div>
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-yellow-400 text-2xl font-bold">→</div>
              <div className="text-5xl mb-4">🤖</div>
              <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2">STEP 02</div>
              <h3 className="font-black text-lg mb-3 text-yellow-400">모핏AI 분석</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                EMG + 포즈 추정 + 밸런스 AI가 데이터를 분석. 생애주기(아동·성인·시니어·재활)별 맞춤 트레이닝 방법론 자동 도출
              </p>
              <div className="mt-4 inline-block bg-yellow-400/20 text-yellow-300 text-xs px-3 py-1 rounded-full font-semibold">개발 중</div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 text-center hover:border-yellow-400/30 transition-all">
              <div className="text-5xl mb-4">🏅</div>
              <div className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2">STEP 03</div>
              <h3 className="font-black text-lg mb-3">모든 스포츠로</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                승마에서 도출된 트레이닝 방법론을 골프·수영·사이클 등 전 종목으로 확장. 생애주기 기반 트레이닝 방법론 자동 도출
              </p>
              <div className="mt-4 inline-block bg-gray-700/50 text-gray-400 text-xs px-3 py-1 rounded-full font-semibold">확장 예정</div>
            </div>
          </div>
        </div>

        {/* 핵심 분석 4가지 */}
        <div className="bg-gray-900 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase text-center mb-3">Core Analysis</p>
            <h2 className="text-2xl font-black text-center mb-10">승마에서 측정하는 핵심 지표</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {METRICS.map(m => (
                <div key={m.title} className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-yellow-400/30 transition-all">
                  <div className="text-4xl mb-3">{m.icon}</div>
                  <p className="font-bold text-white text-sm mb-1">{m.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 라이더 + 마필 통합 플랫폼 */}
        <div className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase text-center mb-3">Platform</p>
            <h2 className="text-2xl font-black text-center mb-3">라이더 · 마필 통합 관리</h2>
            <p className="text-gray-500 text-sm text-center mb-10">세계 최초 수준의 승마 특화 AI 헬스케어 솔루션</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-brand-green-700/30 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">🏇</span>
                  <div>
                    <p className="font-black text-white">라이더 분석</p>
                    <p className="text-green-400 text-xs">RIDER ANALYSIS</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {RIDER_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 border border-yellow-400/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">🐴</span>
                  <div>
                    <p className="font-black text-white">마필 BMI 관리</p>
                    <p className="text-yellow-400 text-xs">HORSE BMI</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {HORSE_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 개발 로드맵 */}
        <div className="bg-gray-900 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase text-center mb-3">Roadmap</p>
            <h2 className="text-2xl font-black text-center mb-10">24개월 개발 로드맵</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PHASES.map((p, i) => (
                <div key={i} className={`rounded-2xl p-6 border ${i === 0 ? 'border-brand-green-600 bg-brand-green-700/10' : 'border-gray-700 bg-gray-800'}`}>
                  <div className={`text-xs font-bold tracking-widest mb-1 ${i === 0 ? 'text-green-400' : 'text-gray-500'}`}>Phase {i + 1}</div>
                  <p className="text-xs text-gray-500 mb-2">{p.period}</p>
                  <p className="font-black text-sm mb-3">{p.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                  {i === 0 && <div className="mt-3 inline-block bg-green-400/20 text-green-300 text-xs px-2 py-0.5 rounded-full">진행 중</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 비즈니스 모델 */}
        <div className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase text-center mb-3">Business Model</p>
            <h2 className="text-2xl font-black text-center mb-10">수익 모델 & 확장 전략</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BIZ_MODELS.map(b => (
                <div key={b.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center hover:border-yellow-400/30 transition-all">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <p className="font-bold text-sm mb-1">{b.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 공식 소개 문구 + 출시 알림 */}
        <div className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-brand-green-700 to-green-900 rounded-3xl p-10 border border-green-600 text-center mb-6">
              <p className="text-green-200 text-xs font-bold tracking-widest uppercase mb-4">Official Statement</p>
              <p className="text-white text-sm leading-relaxed mb-6">
                MoFit AI(모핏AI)는 스포츠 활동 데이터를 기반으로 개인 맞춤형 운동 분석 및 트레이닝 솔루션을 제공하는 인공지능 시스템으로,
                현재 <span className="text-yellow-300 font-bold">상표 출원 및 연구 개발이 진행 중</span>에 있습니다.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['AI 연구 진행중', '상표 출원 진행중', '현장 데이터 기반 구축중'].map(tag => (
                  <span key={tag} className="bg-green-600/50 border border-green-500 text-green-200 text-xs px-3 py-1.5 rounded-full font-semibold">{tag}</span>
                ))}
              </div>
              <p className="text-green-200 text-sm mb-5 font-medium">출시 알림을 받아보세요</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="이메일 입력"
                  className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none" />
                <button className="bg-yellow-400 text-green-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap">
                  신청
                </button>
              </div>
            </div>
            <div className="text-center">
              <Link href="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">← 홈으로</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

const METRICS = [
  { icon: '⚖️', title: '균형 능력', desc: '좌우 무게중심 이동 패턴 분석' },
  { icon: '💪', title: '코어 안정성', desc: '핵심 근육군 EMG 실시간 측정' },
  { icon: '📐', title: '자세 정렬', desc: '3D 포즈 추정으로 자세 교정' },
  { icon: '⚡', title: '반응 속도', desc: '근육 활성화 타이밍 수치화' },
]

const RIDER_FEATURES = [
  '평보 승마 중 전신 모션캡처 (3D 관절 트래킹)',
  '근전도(EMG) — 코어·허벅지·등·골반 근육군 측정',
  '좌우 밸런스 비율, 무게중심 이동 패턴 분석',
  '생애주기별 (아동·성인·시니어·재활) 맞춤 트레이닝 자동 도출',
  '운동 능력 변화 추적 · 위험 요소 사전 감지',
]

const HORSE_FEATURES = [
  '마필 전용 BCS(Body Condition Score) + AI BMI 산출',
  '체고·체장·흉위·체중 추정 데이터 입력',
  '운동 강도·빈도·회복 데이터 연계 분석',
  '말의 근육 발달 상태 트렌드 리포트',
  '마필 건강 이상 징후 조기 감지 알림',
]

const PHASES = [
  { period: 'M1 ~ M6', title: '프로토타입 & 데이터 수집', desc: '저가 센서 프로토타입 제작, 라이더 30~50명 데이터 수집, 신호처리 파이프라인 구축' },
  { period: 'M7 ~ M14', title: 'AI 모델 개발·검증', desc: 'EMG 근육 분류 AI, 밸런스 분석 알고리즘, 생애주기별 트레이닝 DB 구축' },
  { period: 'M15 ~ M20', title: '앱·플랫폼 개발', desc: '라이더·코치 앱 (iOS·Android), 실시간 대시보드, Claude API 리포트 생성 연동' },
  { period: 'M21 ~ M24', title: '상용화 & 확장', desc: '정식 앱 출시, B2B 솔루션 패키지, 해외 승마 시장 진출, MoFit AI 법인 설립' },
]

const BIZ_MODELS = [
  { icon: '📱', title: 'B2C 앱 구독', desc: '월 3~9만원 구독료, 분석 리포트 건당 판매' },
  { icon: '🏟️', title: 'B2B 승마장', desc: '전국 승마장 SaaS 라이선스, 센서 장비 패키지' },
  { icon: '🏥', title: '재활·의료', desc: '재활승마 병원·센터 납품, 바우처 사업 연계' },
  { icon: '🌏', title: '해외 확장', desc: '일본·유럽 승마 시장, 국제 마술 대회 분석' },
]
