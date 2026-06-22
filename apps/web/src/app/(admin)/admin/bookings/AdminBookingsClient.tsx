'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const STATUS_TABS = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { value: 'confirmed', label: '확정', color: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'cancelled', label: '취소', color: 'text-red-700 bg-red-50 border-red-200' },
  { value: 'completed', label: '완료', color: 'text-gray-600 bg-gray-50 border-gray-200' },
]

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-600',
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
  id: string; status: string; start_at: string; end_at: string
  total_amount: number; created_at: string
  programs: { name: string; type: string } | null
  booking_participants: Participant[]
}

interface Props {
  bookings: Booking[]
  currentStatus: string
  currentDate: string
}

export default function AdminBookingsClient({ bookings, currentStatus, currentDate }: Props) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const buildUrl = (status: string, date?: string) => {
    const p = new URLSearchParams()
    if (status !== 'all') p.set('status', status)
    if (date) p.set('date', date)
    return `/admin/bookings?${p.toString()}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">예약 관리</h1>
        <span className="text-sm text-gray-400">{bookings.length}건</span>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {STATUS_TABS.map(tab => (
          <button key={tab.value}
            onClick={() => router.push(buildUrl(tab.value, currentDate))}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors
              ${currentStatus === tab.value
                ? 'bg-brand-green-700 text-white border-brand-green-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
        <input type="date" value={currentDate}
          onChange={e => router.push(buildUrl(currentStatus, e.target.value))}
          className="ml-auto text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
        {currentDate && (
          <button onClick={() => router.push(buildUrl(currentStatus, ''))}
            className="text-xs text-gray-400 hover:text-gray-600">날짜 초기화</button>
        )}
      </div>

      {/* 목록 */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">예약 내역이 없습니다</p>
          </div>
        ) : (
          bookings.map(b => {
            const p = b.booking_participants[0]
            const dateStr = new Date(b.start_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })
            const timeStr = new Date(b.start_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
            const isExpanded = expandedId === b.id
            return (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* 요약 행 */}
                <button className="w-full text-left px-5 py-4" onClick={() => setExpandedId(isExpanded ? null : b.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{p?.name || '(이름 없음)'}</p>
                        <p className="text-xs text-gray-500">{p?.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">{b.programs?.name}</p>
                      <p className="text-xs text-gray-400">{dateStr} {timeStr}</p>
                    </div>
                    <span className="text-gray-300 ml-3 text-sm">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* 상세 (펼침) */}
                {isExpanded && p && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      {[
                        ['성별', p.gender],
                        ['몸무게', p.weight_kg ? `${p.weight_kg}kg` : '-'],
                        ['키', p.height_cm ? `${p.height_cm}cm` : '-'],
                        ['승마 경험', p.experience],
                        ['알레르기', p.allergy ? `있음${p.allergy_desc ? ` (${p.allergy_desc})` : ''}` : '없음'],
                        ['기저질환', p.condition ? `있음${p.condition_desc ? ` (${p.condition_desc})` : ''}` : '없음'],
                        ['요청사항', p.notes || '-'],
                        ['결제금액', `${b.total_amount?.toLocaleString()}원`],
                        ['예약일시', new Date(b.created_at).toLocaleDateString('ko-KR')],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-white rounded-xl p-3 border border-gray-100">
                          <p className="text-xs text-gray-400 mb-1">{k}</p>
                          <p className="font-semibold text-gray-800 text-xs">{v || '-'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {b.status === 'pending' && (
                        <>
                          <ConfirmButton bookingId={b.id} action="confirmed" label="✅ 예약 확정" />
                          <ConfirmButton bookingId={b.id} action="cancelled" label="❌ 취소" variant="danger" />
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <ConfirmButton bookingId={b.id} action="completed" label="🏁 완료 처리" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ConfirmButton({ bookingId, action, label, variant = 'primary' }: {
  bookingId: string; action: string; label: string; variant?: 'primary' | 'danger'
}) {
  const router = useRouter()
  const handleClick = async () => {
    await fetch('/api/admin/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status: action }),
    })
    router.refresh()
  }
  return (
    <button onClick={handleClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors
        ${variant === 'danger'
          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          : 'bg-brand-green-700 text-white hover:bg-brand-green-600'}`}>
      {label}
    </button>
  )
}
