import type { PriceBreakdown } from '../booking/types'

interface PriceInput {
  basePrice: number
  participantCount: number
  discountRate?: number  // 0~1
  voucherAmount?: number
}

/**
 * 예약 금액 계산 (서버 전용 — 클라이언트 신뢰 금지)
 * 모든 금액은 원(KRW) 정수
 */
export function calculatePrice(input: PriceInput): PriceBreakdown {
  const { basePrice, participantCount, discountRate = 0, voucherAmount = 0 } = input

  const subtotal = basePrice * participantCount
  const discountAmount = Math.floor(subtotal * discountRate)
  const afterDiscount = subtotal - discountAmount
  const appliedVoucher = Math.min(voucherAmount, afterDiscount)
  const totalAmount = afterDiscount - appliedVoucher

  return {
    basePrice: subtotal,
    discountAmount,
    voucherAmount: appliedVoucher,
    totalAmount,
  }
}
