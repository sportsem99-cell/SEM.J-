import Link from 'next/link'
import Header from '@/components/features/Header'

const PROGRAMS = [
  {
    type: 'experience',
    name: '체험승마',
    desc: '처음 타시는 분도 OK! 말과 교감하는 특별한 경험. 안전 장비 제공 및 전문 강사 동행.',
    priceMain: '20,000원',
    priceDetail: '1회 (10분 기승)',
    priceExtra: '',
    duration: 10,
    capacity: 6,
    icon: '🐴',
    tags: ['입문', '가족', '단체'],
  },
  {
    type: 'private',
    name: '개인레슨',
    desc: '1:1 맞춤 지도로 빠른 실력 향상. 초보부터 심화까지 수준별 맞춤 커리큘럼.',
    priceMain: '45,000원',
    priceDetail: '1회 · 10회 450,000원',
    priceExtra: '괴산군민 1회 38,250원 · 10회 382,500원',
    duration: 60,
    capacity: 1,
    icon: '🏇',
    tags: ['1:1', '심화', '성인'],
  },
  {
    type: 'youth',
    name: '유소년 프로그램',
    desc: '어린이·청소년을 위한 맞춤 승마 교육. 말과의 교감으로 정서 발달에 도움.',
    priceMain: '315,000원',
    priceDetail: '10회 (괴산군 유소년)',
    priceExtra: '단체 10인 이상 인당 25,000원',
    duration: 60,
    capacity: 6,
    icon: '🌟',
    tags: ['어린이', '청소년', '교육'],
  },
]

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-brand-green-700 mb-2">프로그램</h1>
        <p className="text-gray-500 mb-8">원하시는 프로그램을 선택하고 예약하세요.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROGRAMS.map((p) => (
            <div key={p.type} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-brand-green-500 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{p.icon}</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs bg-green-50 text-brand-green-700 px-2 py-0.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-1">{p.name}</h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.desc}</p>

              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>⏱ {p.duration}분</span>
                <span>👥 최대 {p.capacity}명</span>
              </div>

              <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 space-y-1.5">
                <div>
                  <p className="text-xl font-black text-brand-green-700">{p.priceMain}</p>
                  <p className="text-xs text-gray-500">{p.priceDetail}</p>
                </div>
                {p.priceExtra && (
                  <div className="border-t border-gray-200 pt-1.5">
                    <p className="text-sm font-bold text-brand-green-600">{p.priceExtra}</p>
                  </div>
                )}
              </div>

              <Link
                href={`/booking/${p.type}`}
                className="block text-center bg-brand-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors"
              >
                예약하기
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
