import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/features/Header'

export default async function BookingSuccessPage({
  params,
}: {
  params: { bookingId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      id, status, start_at, end_at, total_amount, created_at,
      programs ( name, type ),
      booking_participants ( name, phone )
    `)
    .eq('id', params.bookingId)
    .eq('user_id', user.id)
    .single()

  if (!booking) redirect('/my/bookings')

  const startDate = new Date(booking.start_at)
  const participant = (booking.booking_participants as any[])?.[0]

  const dateStr = startDate.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  const timeStr = startDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-brand-green-50 to-white">
        <div className="w-full max-w-md">

          {/* 상단 성공 아이콘 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-green-700 shadow-lg shadow-green-200 mb-6">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-1">예약이 접수되었습니다</h1>
            <p className="text-sm text-gray-500">관리자 확인 후 예약이 확정됩니다.</p>
          </div>

          {/* 예약 정보 카드 */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden mb-6">

            {/* 상단 프로그램 배너 */}
            <div className="bg-brand-green-700 px-6 py-5">
              <p className="text-green-200 text-xs font-semibold tracking-widest uppercase mb-1">Program</p>
              <p className="text-white text-xl font-black">{(booking.programs as any)?.name ?? '프로그램'}</p>
            </div>

            {/* 상세 정보 */}
            <div className="px-6 py-6 space-y-4">
              <InfoRow icon="📅" label="날짜" value={dateStr} />
              <InfoRow icon="⏰" label="시간" value={timeStr} />
              {participant?.name && <InfoRow icon="🏇" label="이용자" value={participant.name} />}
              {participant?.phone && <InfoRow icon="📞" label="연락처" value={participant.phone} />}
              <div className="border-t border-gray-100 pt-4">
                <InfoRow icon="💳" label="결제 예정금액" value={`${booking.total_amount?.toLocaleString()}원`} highlight />
              </div>
            </div>

            {/* 예약 번호 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-0.5">예약 번호</p>
              <p className="text-xs font-mono text-gray-500">{booking.id}</p>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-brand-green-50 border border-brand-green-100 rounded-2xl px-5 py-4 mb-6">
            <p className="text-sm font-bold text-brand-green-800 mb-2">📌 예약 안내</p>
            <ul className="text-xs text-brand-green-700 space-y-1.5">
              <li>• 관리자 확인 후 예약 확정 문자가 발송됩니다.</li>
              <li>• 48시간 이전 취소 시 전액 환불, 24시간 이내 50% 환불됩니다.</li>
              <li>• 당일 취소 및 노쇼는 환불이 불가합니다.</li>
              <li>• 현장 결제 (현금/카드) 방식으로 진행됩니다.</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <Link
              href="/my/bookings"
              className="w-full bg-brand-green-700 text-white py-4 rounded-2xl text-center font-bold text-sm hover:bg-brand-green-600 transition-colors shadow-lg shadow-green-200"
            >
              내 예약 확인하기
            </Link>
            <Link
              href="/programs"
              className="w-full bg-white border border-gray-200 text-gray-600 py-3.5 rounded-2xl text-center font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              다른 프로그램 보기
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}

function InfoRow({
  icon, label, value, highlight = false,
}: {
  icon: string
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 flex-shrink-0">{icon}</span>
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <span className={`text-sm font-bold text-right ${highlight ? 'text-brand-green-700 text-base' : 'text-gray-800'}`}>
          {value}
        </span>
      </div>
    </div>
  )
}
