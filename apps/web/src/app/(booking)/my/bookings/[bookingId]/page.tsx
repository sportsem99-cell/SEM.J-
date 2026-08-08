import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/features/Header'
import CancelBookingButton from '@/components/features/CancelBookingButton'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:   { label: '승인 대기 중', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  confirmed: { label: '예약 확정',   color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  completed: { label: '이용 완료',   color: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-200',   dot: 'bg-gray-400' },
  cancelled: { label: '취소됨',      color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-400' },
}

export default async function BookingDetailPage({
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
      id, status, start_at, end_at, total_amount, paid_amount,
      created_at, cancel_reason, notes,
      programs ( name, type, duration_min ),
      booking_participants ( name, phone, birth_date, gender, weight_kg, height_cm, experience, allergy, allergy_desc, condition, condition_desc, notes )
    `)
    .eq('id', params.bookingId)
    .eq('user_id', user.id)
    .single()

  if (!booking) redirect('/my/bookings')

  const startDate = new Date(booking.start_at)
  const endDate = new Date(booking.end_at)
  const createdDate = new Date(booking.created_at)
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending
  const participant = (booking.booking_participants as any[])?.[0]
  const program = booking.programs as any

  const dateStr = startDate.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  const timeRange = `${startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ ${endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* 뒤로가기 */}
        <Link href="/my/bookings" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          내 예약 목록
        </Link>

        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-800">{program?.name ?? '프로그램'}</h1>
          <p className="text-sm text-gray-400 mt-1">
            예약일시: {createdDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* 예약 일정 카드 */}
        <div className="bg-brand-green-700 rounded-3xl p-6 mb-4 text-white">
          <p className="text-green-200 text-xs font-semibold tracking-widest uppercase mb-3">Schedule</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-green-300 text-sm">📅</span>
              <p className="font-bold">{dateStr}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-300 text-sm">⏰</span>
              <p className="font-semibold text-green-100">{timeRange}</p>
            </div>
            {program?.duration_min && (
              <div className="flex items-center gap-3">
                <span className="text-green-300 text-sm">📍</span>
                <p className="text-sm text-green-200">총 {program.duration_min}분 프로그램</p>
              </div>
            )}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">결제 정보</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">결제 예정 금액</span>
            <span className="text-xl font-black text-gray-800">{booking.total_amount?.toLocaleString()}원</span>
          </div>
          <div className="mt-2 pt-2 border-t border-dashed border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">결제 방식</span>
            <span className="text-xs text-gray-500 font-medium">현장 결제 (현금/카드)</span>
          </div>
        </div>

        {/* 이용자 정보 */}
        {participant && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">이용자 정보</p>
            <div className="space-y-3">
              <DetailRow label="이름" value={participant.name} />
              <DetailRow label="연락처" value={participant.phone} />
              {participant.gender && <DetailRow label="성별" value={participant.gender} />}
              {participant.birth_date && (
                <DetailRow label="생년월일" value={new Date(participant.birth_date).toLocaleDateString('ko-KR')} />
              )}
              {participant.height_cm && <DetailRow label="키" value={`${participant.height_cm}cm`} />}
              {participant.weight_kg && <DetailRow label="몸무게" value={`${participant.weight_kg}kg`} />}
              {participant.experience && <DetailRow label="승마 경험" value={participant.experience} />}
            </div>
          </div>
        )}

        {/* 건강 정보 */}
        {participant && (participant.allergy || participant.condition) && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl px-6 py-5 mb-4">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">건강 정보</p>
            <div className="space-y-3">
              {participant.allergy && (
                <div>
                  <DetailRow label="알레르기" value="있음" warn />
                  {participant.allergy_desc && (
                    <p className="text-xs text-orange-600 mt-1 ml-0 pl-0">{participant.allergy_desc}</p>
                  )}
                </div>
              )}
              {participant.condition && (
                <div>
                  <DetailRow label="기저질환" value="있음" warn />
                  {participant.condition_desc && (
                    <p className="text-xs text-orange-600 mt-1">{participant.condition_desc}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 특이사항 */}
        {participant?.notes && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">특이사항</p>
            <p className="text-sm text-gray-600">{participant.notes}</p>
          </div>
        )}

        {/* 취소 사유 */}
        {booking.status === 'cancelled' && booking.cancel_reason && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 mb-4">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">취소 사유</p>
            <p className="text-sm text-red-700">{booking.cancel_reason}</p>
          </div>
        )}

        {/* 예약 번호 */}
        <div className="bg-gray-50 rounded-2xl px-6 py-4 mb-6">
          <p className="text-xs text-gray-400 mb-1">예약 번호</p>
          <p className="text-xs font-mono text-gray-500 break-all">{booking.id}</p>
        </div>

        {/* 취소 버튼 */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <CancelBookingButton bookingId={booking.id} startAt={booking.start_at} />
        )}

        {/* 재예약 */}
        {booking.status === 'cancelled' && (
          <Link
            href="/programs"
            className="block w-full bg-brand-green-700 text-white py-4 rounded-2xl text-center font-bold text-sm hover:bg-brand-green-600 transition-colors"
          >
            재예약 신청하기
          </Link>
        )}

      </div>
    </>
  )
}

function DetailRow({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-400 font-medium flex-shrink-0">{label}</span>
      <span className={`text-sm font-semibold text-right ${warn ? 'text-orange-700' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}
