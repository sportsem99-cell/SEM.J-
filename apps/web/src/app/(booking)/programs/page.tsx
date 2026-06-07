import Link from 'next/link'
import Header from '@/components/features/Header'

const PROGRAMS = [
  {
    type: 'experience',
    name: '체험승마',
    desc: '처음 타시는 분도 OK! 말과 교감하는 특별한 경험. 안전 장비 제공 및 전문 강사 동행.',
    price: 30000,
    duration: 60,
    capacity: 6,
    icon: '🐴',
    tags: ['입문', '가족', '단체'],
  },
  {
    type: 'private',
    name: '개인레슨',
    desc: '1:1 맞춤 지도로 빠른 실력 향상. 초보부터 심화까지 수준별 맞춤 커리큘럼.',
    price: 60000,
    duration: 60,
    capacity: 1,
    icon: '🏇',
    tags: ['1:1', '심화', '성인'],
  },
  {
    type: 'group',
    name: '그룹레슨',
    desc: '소그룹(최대 6명)으로 함께 배우는 승마. 또래와 함께 즐겁게 배울 수 있어요.',
    price: 40000,
    duration: 60,
    capacity: 6,
    icon: '👥',
    tags: ['그룹', '친목', '소그룹'],
  },
  {
    type: 'youth',
    name: '유소년 프로그램',
    desc: '어린이·청소년을 위한 맞춤 승마 교육. 말과의 교감으로 정서 발달에 도움.',
    price: 35000,
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

              <div className="flex gap-4 text-sm text-gray-600 mb-5">
                <span>⏱ {p.duration}분</span>
                <span>👥 최대 {p.capacity}명</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand-green-700">
                  {p.price.toLocaleString()}원
                </span>
                <Link
                  href={`/booking/${p.type}`}
                  className="bg-brand-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors"
                >
                  예약하기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
