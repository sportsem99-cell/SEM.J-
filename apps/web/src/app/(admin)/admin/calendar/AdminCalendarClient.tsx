'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8) // 08~17시

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  confirmed: 'bg-green-100 border-green-300 text-green-800',
  cancelled: 'bg-red-100 border-red-300 text-red-800',
  completed: 'bg-gray-100 border-gray-300 text-gray-600',
}
const STATUS_LABEL: Record<string, string> = {
  pending: '대기', confirmed: '확정', cancelled: '취소', completed: '완료',
}

interface Participant {
  name: string; phone: string; gender: string
  weight_kg: number | null; height_cm: number | null
  allergy: boolean; allergy_desc: string | null
  condition: boolean; condition_desc: string | null
  experience: string | null; notes: string | null
}

interface Booking {
  id: string; status: string; start_at: string; end_at: string; total_amount: number
  programs: { name: string; type: string } | null
  booking_participants: Participant[]
}

interface Props {
  bookings: Booking[]
  selectedDate: string
}

export default function AdminCalendarClient({ bookings, selectedDate }: Props) {
  const router = useRouter()
  const [detailId, setDetailId] = useState<string | null>(null)

  const prevDate = new Date(new Date(selectedDate).getTime() - 86400000).toISOString().split('T')[0]
  const nextDate = new Date(new Date(selectedDate).getTime() + 86400000).toISOString().split('T')[0]

  const getBookingsForHour = (hour: number) =>
    bookings.filter(b => {
      const h = new Date(b.start_at).getHours()
      return h === hour
    })

  const detailBooking = bookings.find(b => b.id === detailId)

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">예약 캘린더</h1>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => router.push(`/admin/calendar?date=${prevDate}`)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">← 전날</button>
          <input type="date" value={selectedDate}
            onChange={e => router.push(`/admin/calendar?date=${e.target.value}`)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          <button onClick={() => router.push(`/admin/calendar?date=${nextDate}`)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">다음날 →</button>
        </div>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-brand-green-700">{bookings.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">전체 예약</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">확정</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">대기</p>
        </div>
      </div>

      {/* 시간대별 뷰 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {HOURS.map(hour => {
          const hourBookings = getBookingsForHour(hour)
          return (
            <div key={hour} className={`flex min-h-[64px] border-b border-gray-50 last:border-0 ${hour % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
              {/* 시간 라벨 */}
              <div className="w-16 flex-shrink-0 flex items-start justify-center pt-3 text-xs font-bold text-gray-400 border-r border-gray-100">
                {String(hour).padStart(2, '0')}:00
              </div>
              {/* 예약 목록 */}
              <div className="flex-1 p-2 flex flex-wrap gap-2">
                {hourBookings.length === 0 ? (
                  <div className="w-full flex items-center">
                    <span className="text-xs text-gray-300">-</span>
                  </div>
                ) : (
                  hourBookings.map(b => {
                    const p = b.booking_participants[0]
                    const startTime = new Date(b.start_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                    const endTime = new Date(b.end_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <button key={b.id} onClick={() => setDetailId(detailId === b.id ? null : b.id)}
                        className={`text-left border rounded-xl px-3 py-2 transition-all hover:shadow-md ${STATUS_STYLE[b.status] || 'bg-gray-100'}`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-bold">{startTime}~{endTime}</span>
                          <span className="text-xs opacity-70">{STATUS_LABEL[b.status]}</span>
                        </div>
                        <div className="text-xs font-semibold">{p?.name || '(이름 없음)'}</div>
                        <div className="text-xs opacity-70">{b.programs?.name}</div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 상세 패널 */}
      {detailBooking && (
        <div className="mt-4 bg-white rounded-2xl border border-brand-green-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-base">예약 상세</h2>
            <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>

          {(() => {
            const b = detailBooking
            const p = b.booking_participants[0]
            const startTime = new Date(b.start_at).toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })
            const endTime = new Date(b.end_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">예약 정보</h3>
                  {[
                    ['프로그램', b.programs?.name],
                    ['시간', `${startTime} ~ ${endTime}`],
                    ['상태', STATUS_LABEL[b.status]],
                    ['금액', `${b.total_amount?.toLocaleString()}원`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm py-1 border-b border-gray-50">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-gray-800">{v || '-'}</span>
                    </div>
                  ))}
                </div>
                {p && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">이용자 정보</h3>
                    {[
                      ['이름', p.name],
                      ['연락처', p.phone],
                      ['성별', p.gender],
                      ['몸무게', p.weight_kg ? `${p.weight_kg}kg` : '-'],
                      ['키', p.height_cm ? `${p.height_cm}cm` : '-'],
                      ['경험', p.experience],
                      ['알레르기', p.allergy ? `있음${p.allergy_desc ? ` (${p.allergy_desc})` : ''}` : '없음'],
                      ['기저질환', p.condition ? `있음${p.condition_desc ? ` (${p.condition_desc})` : ''}` : '없음'],
                      ['요청사항', p.notes],
                    ].map(([k, v]) => v && (
                      <div key={k} className="flex justify-between text-sm py-1 border-b border-gray-50">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-gray-800 text-right max-w-[60%]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <a href={`/admin/bookings/${detailBooking.id}`}
              className="flex-1 text-center bg-brand-green-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-brand-green-600 transition-colors">
              상세 보기
            </a>
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="mt-4 bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm">이 날짜에 예약이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
