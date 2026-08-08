'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addBlockedDate, removeBlockedDate } from '@/app/actions/slots'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

interface BlockedDate {
  id: string
  date: string
  reason: string | null
}

export default function BlockedDatesClient({ blockedDates }: { blockedDates: BlockedDate[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleAdd = () => {
    if (!newDate) return
    setError('')
    startTransition(async () => {
      const res = await addBlockedDate(newDate, newReason || '관리자 설정')
      if (res?.error) setError(res.error)
      else { setNewDate(''); setNewReason(''); router.refresh() }
    })
  }

  const handleRemove = (date: string) => {
    startTransition(async () => {
      await removeBlockedDate(date)
      router.refresh()
    })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${dateStr} (${DAY_NAMES[d.getDay()]})`
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">예약 불가 날짜 관리</h1>
        <p className="text-sm text-gray-400 mt-1">월요일은 기본 휴장일입니다. 추가 휴장일을 아래에서 설정하세요.</p>
      </div>

      {/* 기본 휴장일 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-800">
        📅 <strong>기본 휴장일:</strong> 매주 월요일 (시스템 자동 적용, 별도 등록 불필요)
      </div>

      {/* 추가 날짜 등록 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">추가 예약불가 날짜 등록</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            min={today}
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
          />
          <input
            type="text"
            placeholder="사유 (예: 시합일, 시설 점검)"
            value={newReason}
            onChange={e => setNewReason(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
          />
          <button
            onClick={handleAdd}
            disabled={isPending || !newDate}
            className="bg-brand-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-600 transition-colors disabled:opacity-50"
          >
            추가
          </button>
        </div>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        {error.includes('테이블') || error.includes('relation') ? (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
            ⚠️ blocked_dates 테이블이 아직 생성되지 않았습니다. Supabase SQL 에디터에서 마이그레이션을 실행해주세요.
          </div>
        ) : null}
      </div>

      {/* 등록된 날짜 목록 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-700 mb-4">등록된 예약불가 날짜 ({blockedDates.length}건)</h2>
        {blockedDates.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p className="text-3xl mb-2">📅</p>
            <p>추가 예약불가 날짜가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blockedDates.map(d => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{formatDate(d.date)}</p>
                  {d.reason && <p className="text-xs text-gray-400 mt-0.5">{d.reason}</p>}
                </div>
                <button
                  onClick={() => handleRemove(d.date)}
                  disabled={isPending}
                  className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
