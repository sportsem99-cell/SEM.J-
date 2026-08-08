'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cancelBooking } from '@/app/actions/booking'

interface Props {
  bookingId: string
  startAt: string
}

export default function CancelBookingButton({ bookingId, startAt }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ message: string; isError: boolean } | null>(null)
  const router = useRouter()

  const hoursUntil = (new Date(startAt).getTime() - Date.now()) / (1000 * 60 * 60)

  const refundPolicy =
    hoursUntil >= 48 ? { text: '전액 환불', color: 'text-green-700', bg: 'bg-green-50 border-green-200' }
    : hoursUntil >= 24 ? { text: '50% 환불', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' }
    : { text: '환불 불가', color: 'text-red-700', bg: 'bg-red-50 border-red-200' }

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelBooking(bookingId)
      if (res?.error) {
        setResult({ message: res.error, isError: true })
      } else {
        setResult({ message: res.message ?? '취소되었습니다.', isError: false })
        setTimeout(() => { router.refresh() }, 1500)
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        예약 취소
      </button>
    )
  }

  return (
    <div className="mt-4 border border-red-200 rounded-xl p-4 space-y-3">
      <p className="text-sm font-bold text-red-700">예약을 취소하시겠습니까?</p>

      {/* 환불 정책 안내 */}
      <div className={`rounded-xl border px-4 py-3 text-sm ${refundPolicy.bg}`}>
        <p className="text-xs text-gray-500 mb-1">현재 취소 시 환불 정책</p>
        <p className={`font-bold text-base ${refundPolicy.color}`}>{refundPolicy.text}</p>
        <p className="text-xs text-gray-400 mt-1">
          {hoursUntil >= 48 ? '예약 48시간 전 — 전액 환불'
          : hoursUntil >= 24 ? '예약 24~48시간 전 — 50% 환불'
          : '예약 24시간 이내 — 환불 불가'}
        </p>
      </div>

      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${result.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {result.message}
        </div>
      )}

      {!result && (
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            돌아가기
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? '취소 중...' : '취소 확정'}
          </button>
        </div>
      )}
    </div>
  )
}
