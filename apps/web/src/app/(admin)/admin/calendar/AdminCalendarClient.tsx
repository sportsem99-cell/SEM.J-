'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

// ─── 상수 ───────────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8) // 08 ~ 18
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-800',  border: 'border-amber-300',  dot: 'bg-amber-400' },
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-800',border: 'border-emerald-300',dot: 'bg-emerald-500' },
  completed: { bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-300',  dot: 'bg-slate-400' },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-400' },
}
const STATUS_LABEL: Record<string, string> = {
  pending: '대기', confirmed: '확정', completed: '완료', cancelled: '취소',
}

// ─── 타입 ───────────────────────────────────────────────────────────────────
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
type ViewType = 'day' | 'week' | 'month'

interface Props {
  bookings: Booking[]
  selectedDate: string
  initialView: ViewType
  today: string
}

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────
function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}
function getWeekDays(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const mon = new Date(d)
  mon.setDate(d.getDate() - ((day + 6) % 7)) // 월요일 기준
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(mon)
    x.setDate(mon.getDate() + i)
    return toDateStr(x)
  })
}
function getMonthGrid(dateStr: string) {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (firstDay + 6) % 7 // 월요일 시작

  const cells: { date: string; isCurrentMonth: boolean }[] = []
  for (let i = 0; i < offset; i++) {
    const x = new Date(year, month, 1 - (offset - i))
    cells.push({ date: toDateStr(x), isCurrentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: toDateStr(new Date(year, month, i)), isCurrentMonth: true })
  }
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: toDateStr(new Date(year, month + 1, i)), isCurrentMonth: false })
  }
  return cells
}
function formatHour(h: number) { return `${String(h).padStart(2, '0')}:00` }
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

// ─── 예약 블록 (공통) ───────────────────────────────────────────────────────
function BookingPill({
  booking, onClick, compact = false,
}: {
  booking: Booking; onClick: () => void; compact?: boolean
}) {
  const c = STATUS_COLOR[booking.status] ?? STATUS_COLOR.pending
  const p = booking.booking_participants[0]
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border px-2 py-1.5 transition-all hover:shadow-md hover:scale-[1.01] ${c.bg} ${c.border} ${c.text}`}
    >
      <div className="flex items-center gap-1 mb-0.5">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
        <span className="text-[10px] font-bold leading-none">
          {formatTime(booking.start_at)}
        </span>
        {!compact && (
          <span className="text-[10px] opacity-60 ml-auto">{STATUS_LABEL[booking.status]}</span>
        )}
      </div>
      <p className="text-xs font-bold truncate">{p?.name || '(이름없음)'}</p>
      {!compact && <p className="text-[10px] opacity-70 truncate">{booking.programs?.name}</p>}
    </button>
  )
}

// ─── 상세 패널 ──────────────────────────────────────────────────────────────
function DetailPanel({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const p = booking.booking_participants[0]
  const c = STATUS_COLOR[booking.status] ?? STATUS_COLOR.pending
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 상단 컬러 헤더 */}
        <div className="bg-brand-green-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
              {STATUS_LABEL[booking.status]}
            </span>
            <button onClick={onClose} className="text-green-200 hover:text-white transition-colors text-xl leading-none">×</button>
          </div>
          <p className="text-xl font-black mt-2">{booking.programs?.name ?? '프로그램'}</p>
          <p className="text-green-200 text-sm mt-1">
            {formatTime(booking.start_at)} ~ {formatTime(booking.end_at)}
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 예약 정보 */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">예약 정보</p>
            <div className="space-y-2">
              {[
                ['금액', `${booking.total_amount?.toLocaleString()}원`],
              ].map(([k, v]) => v && (
                <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 이용자 정보 */}
          {p && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">이용자</p>
              <div className="space-y-2">
                {[
                  ['이름', p.name],
                  ['연락처', p.phone],
                  ['성별', p.gender],
                  ['몸무게', p.weight_kg ? `${p.weight_kg}kg` : null],
                  ['키', p.height_cm ? `${p.height_cm}cm` : null],
                  ['경험', p.experience],
                  ['알레르기', p.allergy ? `있음 ${p.allergy_desc ? `(${p.allergy_desc})` : ''}` : null],
                  ['기저질환', p.condition ? `있음 ${p.condition_desc ? `(${p.condition_desc})` : ''}` : null],
                  ['요청사항', p.notes],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="font-semibold text-gray-800 text-right ml-2 max-w-[60%]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 건강 경고 */}
        {p && (p.allergy || p.condition) && (
          <div className="mx-6 mb-4 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 text-xs text-orange-700 font-medium">
            ⚠️ 건강 정보 있음 — 강사 확인 필요
          </div>
        )}

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-brand-green-700 text-white py-3 rounded-2xl font-bold text-sm hover:bg-brand-green-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 뷰: 일별 ───────────────────────────────────────────────────────────────
function DayView({
  bookings, date, onBookingClick,
}: {
  bookings: Booking[]; date: string; onBookingClick: (b: Booking) => void
}) {
  const d = new Date(date)
  const dateLabel = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <div>
      <p className="text-sm font-bold text-gray-500 mb-4 text-center">{dateLabel}</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {HOURS.map(hour => {
          const hourBookings = bookings.filter(b => new Date(b.start_at).getHours() === hour)
          return (
            <div
              key={hour}
              className={`flex min-h-[72px] border-b border-gray-50 last:border-0 ${hourBookings.length ? '' : 'opacity-60'}`}
            >
              <div className="w-16 flex-shrink-0 flex flex-col items-center justify-start pt-3 gap-0.5 border-r border-gray-50">
                <span className="text-xs font-bold text-gray-400">{formatHour(hour)}</span>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-2">
                {hourBookings.length === 0 ? (
                  <div className="flex-1 flex items-center">
                    <span className="text-xs text-gray-200">—</span>
                  </div>
                ) : (
                  hourBookings.map(b => (
                    <BookingPill key={b.id} booking={b} onClick={() => onBookingClick(b)} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 뷰: 주별 ───────────────────────────────────────────────────────────────
function WeekView({
  bookings, weekDays, today, onBookingClick, onDayClick,
}: {
  bookings: Booking[]
  weekDays: string[]
  today: string
  onBookingClick: (b: Booking) => void
  onDayClick: (date: string) => void
}) {
  const bookingsByDateHour = useMemo(() => {
    const map: Record<string, Record<number, Booking[]>> = {}
    for (const b of bookings) {
      const d = toDateStr(new Date(b.start_at))
      const h = new Date(b.start_at).getHours()
      if (!map[d]) map[d] = {}
      if (!map[d][h]) map[d][h] = []
      map[d][h].push(b)
    }
    return map
  }, [bookings])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-100">
        <div className="h-14 border-r border-gray-50" />
        {weekDays.map(date => {
          const d = new Date(date)
          const isToday = date === today
          return (
            <button
              key={date}
              onClick={() => onDayClick(date)}
              className={`h-14 flex flex-col items-center justify-center gap-0.5 hover:bg-gray-50 transition-colors border-r border-gray-50 last:border-0 ${isToday ? 'bg-brand-green-50' : ''}`}
            >
              <span className="text-[10px] font-semibold text-gray-400">{DAY_LABELS[d.getDay()]}</span>
              <span className={`text-sm font-black w-8 h-8 rounded-full flex items-center justify-center
                ${isToday ? 'bg-brand-green-700 text-white' : 'text-gray-700'}`}>
                {d.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      {/* 시간 행 */}
      <div className="overflow-y-auto max-h-[600px]">
        {HOURS.map(hour => (
          <div key={hour} className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-50 last:border-0 min-h-[72px]">
            <div className="flex items-start justify-center pt-2 border-r border-gray-50">
              <span className="text-[10px] font-bold text-gray-400">{formatHour(hour)}</span>
            </div>
            {weekDays.map(date => {
              const dayHour = bookingsByDateHour[date]?.[hour] ?? []
              const isToday = date === today
              return (
                <div
                  key={date}
                  className={`border-r border-gray-50 last:border-0 p-1 flex flex-col gap-1 ${isToday ? 'bg-brand-green-50/30' : ''}`}
                >
                  {dayHour.map(b => (
                    <BookingPill key={b.id} booking={b} onClick={() => onBookingClick(b)} compact />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 뷰: 월별 ───────────────────────────────────────────────────────────────
function MonthView({
  bookings, selectedDate, today, onDayClick,
}: {
  bookings: Booking[]
  selectedDate: string
  today: string
  onDayClick: (date: string) => void
}) {
  const grid = useMemo(() => getMonthGrid(selectedDate), [selectedDate])

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    for (const b of bookings) {
      const d = toDateStr(new Date(b.start_at))
      if (!map[d]) map[d] = []
      map[d].push(b)
    }
    return map
  }, [bookings])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['월','화','수','목','금','토','일'].map((d, i) => (
          <div key={d} className={`py-3 text-center text-xs font-bold ${i === 5 ? 'text-blue-500' : i === 6 ? 'text-red-500' : 'text-gray-500'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {grid.map(({ date, isCurrentMonth }, idx) => {
          const dayBookings = bookingsByDate[date] ?? []
          const isToday = date === today
          const isSelected = date === selectedDate
          const d = new Date(date)
          const isSat = d.getDay() === 6
          const isSun = d.getDay() === 0
          const confirmedCount = dayBookings.filter(b => b.status === 'confirmed').length
          const pendingCount = dayBookings.filter(b => b.status === 'pending').length

          return (
            <button
              key={`${date}-${idx}`}
              onClick={() => onDayClick(date)}
              className={`min-h-[90px] p-2 text-left border-b border-r border-gray-50 hover:bg-gray-50 transition-colors relative
                ${!isCurrentMonth ? 'bg-gray-50/50' : ''}
                ${isSelected && !isToday ? 'bg-brand-green-50' : ''}
              `}
            >
              {/* 날짜 숫자 */}
              <span className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mb-1
                ${isToday ? 'bg-brand-green-700 text-white' : ''}
                ${!isToday && isSelected ? 'bg-brand-green-100 text-brand-green-700' : ''}
                ${!isToday && !isSelected && isSat ? 'text-blue-500' : ''}
                ${!isToday && !isSelected && isSun ? 'text-red-500' : ''}
                ${!isToday && !isSelected && !isSat && !isSun ? (isCurrentMonth ? 'text-gray-700' : 'text-gray-300') : ''}
              `}>
                {d.getDate()}
              </span>

              {/* 예약 표시 */}
              <div className="space-y-0.5 mt-0.5">
                {confirmedCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[10px] text-emerald-700 font-semibold truncate">확정 {confirmedCount}</span>
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-[10px] text-amber-700 font-semibold truncate">대기 {pendingCount}</span>
                  </div>
                )}
                {dayBookings.length > 2 && (
                  <span className="text-[10px] text-gray-400">+{dayBookings.length - 2}건</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────────────
export default function AdminCalendarClient({
  bookings, selectedDate, initialView, today,
}: Props) {
  const router = useRouter()
  const [view, setView] = useState<ViewType>(initialView)
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null)

  // 현재 날짜 기준 뷰 이동
  function navigate(direction: -1 | 1) {
    const d = new Date(selectedDate)
    if (view === 'day') d.setDate(d.getDate() + direction)
    else if (view === 'week') d.setDate(d.getDate() + direction * 7)
    else d.setMonth(d.getMonth() + direction)
    router.push(`/admin/calendar?date=${toDateStr(d)}&view=${view}`)
  }

  function changeView(v: ViewType) {
    setView(v)
    router.push(`/admin/calendar?date=${selectedDate}&view=${v}`)
  }

  function gotoDay(date: string) {
    setView('day')
    router.push(`/admin/calendar?date=${date}&view=day`)
  }

  // 현재 뷰에 해당하는 레이블
  const navLabel = useMemo(() => {
    const d = new Date(selectedDate)
    if (view === 'month') return `${d.getFullYear()}년 ${MONTH_NAMES[d.getMonth()]}`
    if (view === 'week') {
      const days = getWeekDays(selectedDate)
      const s = new Date(days[0])
      const e = new Date(days[6])
      return `${s.getMonth() + 1}월 ${s.getDate()}일 ~ ${e.getMonth() !== s.getMonth() ? `${e.getMonth() + 1}월 ` : ''}${e.getDate()}일`
    }
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })
  }, [selectedDate, view])

  // 현재 뷰 범위의 예약만 필터
  const visibleBookings = useMemo(() => {
    if (view === 'day') {
      return bookings.filter(b => toDateStr(new Date(b.start_at)) === selectedDate)
    }
    if (view === 'week') {
      const days = new Set(getWeekDays(selectedDate))
      return bookings.filter(b => days.has(toDateStr(new Date(b.start_at))))
    }
    const d = new Date(selectedDate)
    return bookings.filter(b => {
      const bd = new Date(b.start_at)
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
    })
  }, [bookings, selectedDate, view])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  // 통계 (현재 뷰 기준)
  const stats = useMemo(() => ({
    total: visibleBookings.length,
    confirmed: visibleBookings.filter(b => b.status === 'confirmed').length,
    pending: visibleBookings.filter(b => b.status === 'pending').length,
    revenue: visibleBookings
      .filter(b => ['confirmed', 'completed'].includes(b.status))
      .reduce((s, b) => s + (b.total_amount ?? 0), 0),
  }), [visibleBookings])

  return (
    <div>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">예약 캘린더</h1>
          <p className="text-sm text-gray-400 mt-0.5">예약 현황을 한눈에 확인하세요</p>
        </div>

        {/* 뷰 전환 */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(['month', 'week', 'day'] as ViewType[]).map(v => (
              <button
                key={v}
                onClick={() => changeView(v)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  view === v
                    ? 'bg-white text-brand-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {v === 'month' ? '월별' : v === 'week' ? '주별' : '일별'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: '전체 예약', value: stats.total, color: 'text-gray-800' },
          { label: '확정', value: stats.confirmed, color: 'text-emerald-600' },
          { label: '대기 중', value: stats.pending, color: 'text-amber-600' },
          { label: '예상 매출', value: `${stats.revenue.toLocaleString()}원`, color: 'text-brand-green-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 내비게이션 바 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-base font-black text-gray-800 min-w-[160px] text-center">{navLabel}</span>
          <button
            onClick={() => navigate(1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <button
          onClick={() => { setView('day'); router.push(`/admin/calendar?date=${today}&view=day`) }}
          className="text-xs font-bold text-brand-green-700 bg-brand-green-50 border border-brand-green-200 px-3 py-1.5 rounded-xl hover:bg-brand-green-100 transition-colors"
        >
          오늘
        </button>
      </div>

      {/* 뷰 렌더링 */}
      {view === 'day' && (
        <DayView
          bookings={visibleBookings}
          date={selectedDate}
          onBookingClick={setDetailBooking}
        />
      )}
      {view === 'week' && (
        <WeekView
          bookings={visibleBookings}
          weekDays={weekDays}
          today={today}
          onBookingClick={setDetailBooking}
          onDayClick={gotoDay}
        />
      )}
      {view === 'month' && (
        <MonthView
          bookings={bookings}
          selectedDate={selectedDate}
          today={today}
          onDayClick={gotoDay}
        />
      )}

      {/* 상세 모달 */}
      {detailBooking && (
        <DetailPanel
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
        />
      )}
    </div>
  )
}
