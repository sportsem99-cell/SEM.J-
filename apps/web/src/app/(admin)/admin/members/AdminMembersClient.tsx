'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCoupon, deleteCoupon } from '@/app/actions/coupons'

interface Customer {
  userId: string; name: string; phone: string
  bookingCount: number; totalSpent: number; lastVisit: string
  programs: string[]; statuses: string[]
}
interface CouponInfo {
  id: string; phone: string; holder_name: string | null; program_name: string | null
  total_count: number; used_count: number; remaining: number
  expires_at: string | null; notes: string | null; created_at: string
  usages: { booking_id: string | null; used_at: string }[]
}
interface Program { id: string; name: string }

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',  cancelled: 'bg-red-100 text-red-700',
}
const STATUS_LABEL: Record<string, string> = {
  pending: '대기', confirmed: '확정', completed: '완료', cancelled: '취소',
}

export default function AdminMembersClient({ customers, coupons, programs }: {
  customers: Customer[]; coupons: CouponInfo[]; programs: Program[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [couponModal, setCouponModal] = useState<{ phone: string; name: string } | null>(null)
  const [couponForm, setCouponForm] = useState({ totalCount: '1', programId: '', expiresAt: '', notes: '' })
  const [couponError, setCouponError] = useState('')
  const [expandedMember, setExpandedMember] = useState<string | null>(null)

  const openCouponModal = (phone: string, name: string) => {
    setCouponModal({ phone, name })
    setCouponForm({ totalCount: '1', programId: '', expiresAt: '', notes: '' })
    setCouponError('')
  }

  const handleCreateCoupon = () => {
    if (!couponModal) return
    const count = parseInt(couponForm.totalCount) || 0
    if (count < 1) { setCouponError('쿠폰 수량은 1개 이상이어야 합니다.'); return }
    setCouponError('')
    startTransition(async () => {
      const res = await createCoupon({
        phone: couponModal.phone, holderName: couponModal.name,
        programId: couponForm.programId || null, totalCount: count,
        expiresAt: couponForm.expiresAt || null, notes: couponForm.notes,
      })
      if (res?.error) setCouponError(res.error)
      else { setCouponModal(null); router.refresh() }
    })
  }

  const handleDeleteCoupon = (id: string) => {
    if (!confirm('이 쿠폰을 삭제하시겠어요?')) return
    startTransition(async () => {
      const res = await deleteCoupon(id)
      if (res?.error) alert(res.error)
      else router.refresh()
    })
  }

  const couponsByPhone = (phone: string) =>
    coupons.filter(c => c.phone === phone.replace(/[^0-9]/g, ''))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">이용자 관리</h1>
          <p className="text-sm text-gray-400 mt-1">예약 이력이 있는 고객 목록 · 쿠폰 등록 가능</p>
        </div>
        <div className="bg-brand-green-50 border border-brand-green-200 rounded-2xl px-5 py-3 text-center">
          <p className="text-2xl font-black text-brand-green-700">{customers.length}</p>
          <p className="text-xs text-brand-green-600">총 회원</p>
        </div>
      </div>

      {/* 쿠폰 등록 모달 */}
      {couponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">쿠폰 등록</h2>
                <p className="text-sm text-gray-500 mt-0.5">{couponModal.name} · {couponModal.phone}</p>
              </div>
              <button onClick={() => setCouponModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            {couponError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{couponError}</div>}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">쿠폰 수량 *</label>
              <input type="number" min="1" max="100" value={couponForm.totalCount}
                onChange={e => setCouponForm(p => ({ ...p, totalCount: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <p className="text-xs text-gray-400 mt-1 text-center">등록할 이용권 횟수</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">적용 프로그램</label>
              <select value={couponForm.programId}
                onChange={e => setCouponForm(p => ({ ...p, programId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="">전체 프로그램 (제한 없음)</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">만료일 (선택)</label>
              <input type="date" value={couponForm.expiresAt}
                onChange={e => setCouponForm(p => ({ ...p, expiresAt: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">메모 (선택)</label>
              <input type="text" placeholder="예: 10회권 구매, 이벤트 당첨"
                value={couponForm.notes}
                onChange={e => setCouponForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCouponModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50">취소</button>
              <button onClick={handleCreateCoupon} disabled={isPending}
                className="flex-[2] bg-purple-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-500 disabled:opacity-50">
                {isPending ? '등록 중...' : `🎟 쿠폰 ${couponForm.totalCount}장 등록`}
              </button>
            </div>
          </div>
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-3xl mb-2">👥</p><p className="text-sm">예약 이력이 있는 회원이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => {
            const memberCoupons = couponsByPhone(c.phone)
            const totalRemaining = memberCoupons.reduce((s, cp) => s + cp.remaining, 0)
            const isExpanded = expandedMember === c.userId

            return (
              <div key={c.userId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-green-700 font-bold text-sm">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-5 text-center">
                      <div>
                        <p className="text-lg font-black text-brand-green-700">{c.bookingCount}</p>
                        <p className="text-xs text-gray-400">총 예약</p>
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{c.totalSpent.toLocaleString()}원</p>
                        <p className="text-xs text-gray-400">누적 결제</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          {new Date(c.lastVisit).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-400">최근 예약</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {memberCoupons.length > 0 && (
                        <button onClick={() => setExpandedMember(isExpanded ? null : c.userId)}
                          className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-purple-100">
                          🎟 {totalRemaining > 0 ? `잔여 ${totalRemaining}장` : '만료됨'}
                        </button>
                      )}
                      <button onClick={() => openCouponModal(c.phone, c.name)}
                        className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500">
                        + 쿠폰 등록
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {Object.entries(
                      c.statuses.reduce((acc, s) => ({ ...acc, [s]: (acc[s] ?? 0) + 1 }), {} as Record<string, number>)
                    ).map(([status, count]) => (
                      <span key={status} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[status] ?? status} {count}건
                      </span>
                    ))}
                    {c.programs.map(p => (
                      <span key={p} className="text-[11px] bg-green-50 text-brand-green-700 px-2 py-0.5 rounded-full font-medium">{p}</span>
                    ))}
                  </div>
                </div>

                {/* 쿠폰 내역 패널 */}
                {isExpanded && memberCoupons.length > 0 && (
                  <div className="border-t border-gray-100 bg-purple-50/50 px-6 py-4">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-3">쿠폰 내역</p>
                    <div className="space-y-2">
                      {memberCoupons.map(cp => (
                        <div key={cp.id} className="bg-white rounded-xl border border-purple-100 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {cp.program_name ? `${cp.program_name} 이용권` : '전 프로그램 이용권'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                사용 {cp.used_count}/{cp.total_count}회
                                {cp.expires_at && ` · 만료 ${cp.expires_at}`}
                                {cp.notes && ` · ${cp.notes}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-black ${cp.remaining > 0 ? 'text-purple-600' : 'text-gray-300'}`}>
                                {cp.remaining}장
                              </span>
                              {cp.usages.length === 0 && (
                                <button onClick={() => handleDeleteCoupon(cp.id)}
                                  className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded-lg">삭제</button>
                              )}
                            </div>
                          </div>
                          {cp.usages.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100 space-y-0.5">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">사용 날짜</p>
                              {cp.usages.map((u, i) => (
                                <p key={i} className="text-xs text-gray-500">
                                  {new Date(u.used_at).toLocaleDateString('ko-KR', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit',
                                  })}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
