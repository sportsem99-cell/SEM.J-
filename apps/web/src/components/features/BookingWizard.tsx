'use client'

import { useState, useTransition, useEffect } from 'react'
import { createBooking, type BookingFormData } from '@/app/actions/booking'
import { getAvailableSlots } from '@/app/actions/slots'
import { getCouponsByPhone } from '@/app/actions/coupons'

type Step = 1 | 2 | 3 | 4 | 5

interface SlotInfo {
  time: string
  available: boolean
  current: number
  max: number
}

interface SavedProfile {
  name?: string | null; phone?: string | null; birth_date?: string | null
  gender?: string | null; height_cm?: number | null; weight_kg?: number | null
  experience?: string | null; allergy?: boolean | null; allergy_desc?: string | null
  condition?: boolean | null; condition_desc?: string | null
}

interface Props {
  programId: string
  program: { name: string; price: number; localPrice: number; capacity: number }
  savedProfile?: SavedProfile | null
  blockedDates?: string[]
}

const STEP_LABELS = ['날짜·시간', '예약자', '이용자', '건강정보', '최종확인']

export default function BookingWizard({ programId, program, savedProfile, blockedDates = [] }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [payMethod, setPayMethod] = useState<'card' | 'transfer' | 'coupon' | ''>('')
  const [slots, setSlots] = useState<SlotInfo[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [coupons, setCoupons] = useState<{ id: string; holderName: string | null; remaining: number; expiresAt: string | null; programName: string | null }[]>([])
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const [couponsLoading, setCouponsLoading] = useState(false)

  const [residentType, setResidentType] = useState<'general' | 'local'>('general')
  const finalPrice = residentType === 'local' ? program.localPrice : program.price
  const hasDiscount = program.localPrice !== program.price

  const [form, setForm] = useState({
    date: '', time: '',
    bookerName: savedProfile?.name || '',
    bookerPhone: savedProfile?.phone || '',
    sameAsBooker: false,
    riderName: savedProfile?.name || '',
    riderBirthDate: savedProfile?.birth_date || '',
    riderGender: savedProfile?.gender || '',
    riderWeightKg: savedProfile?.weight_kg?.toString() || '',
    riderHeightCm: savedProfile?.height_cm?.toString() || '',
    experience: savedProfile?.experience || '',
    allergy: savedProfile?.allergy ?? false,
    allergyDesc: savedProfile?.allergy_desc || '',
    condition: savedProfile?.condition ?? false,
    conditionDesc: savedProfile?.condition_desc || '',
    notes: '',
  })

  const u = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const today = new Date().toISOString().split('T')[0]

  // 날짜 선택 시 슬롯 조회
  useEffect(() => {
    if (!form.date) { setSlots([]); return }
    setSlotsLoading(true)
    getAvailableSlots(form.date, programId).then(result => {
      setSlots(result)
      setSlotsLoading(false)
      // 선택한 시간이 마감됐으면 초기화
      if (form.time) {
        const found = result.find(s => s.time === form.time)
        if (found && !found.available) u('time', '')
      }
    })
  }, [form.date])

  // Step 5 진입 시 쿠폰 조회
  useEffect(() => {
    if (step !== 5 || !form.bookerPhone) return
    setCouponsLoading(true)
    getCouponsByPhone(form.bookerPhone, programId).then(result => {
      setCoupons(result)
      setCouponsLoading(false)
    })
  }, [step])

  // 날짜가 예약불가인지 확인 (월요일 또는 blocked_dates)
  const isDateBlocked = (dateStr: string) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    if (d.getDay() === 1) return true // 월요일
    return blockedDates.includes(dateStr)
  }

  const canNext = () => {
    if (step === 1) return !!form.date && !!form.time && !isDateBlocked(form.date)
    if (step === 2) return !!form.bookerName && !!form.bookerPhone
    if (step === 3) {
      const nameOk = form.sameAsBooker || !!form.riderName
      return nameOk && !!form.riderGender && !!form.experience && !!form.riderWeightKg
    }
    return true
  }

  const handleSubmit = () => {
    setError('')
    startTransition(async () => {
      const data: BookingFormData = {
        programId,
        date: form.date,
        time: form.time,
        bookerName: form.bookerName,
        bookerPhone: form.bookerPhone,
        riderName: form.sameAsBooker ? form.bookerName : form.riderName,
        riderBirthDate: form.riderBirthDate,
        riderGender: form.riderGender,
        riderWeightKg: parseFloat(form.riderWeightKg) || 0,
        riderHeightCm: parseFloat(form.riderHeightCm) || 0,
        experience: form.experience,
        allergy: form.allergy,
        allergyDesc: form.allergyDesc,
        condition: form.condition,
        conditionDesc: form.conditionDesc,
        notes: form.notes,
        totalAmount: finalPrice,
        couponId: payMethod === 'coupon' ? selectedCouponId : null,
        paymentMethod: (payMethod || 'card') as 'card' | 'transfer' | 'coupon',
      }
      const result = await createBooking(data)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-6">
      {/* 스텝 인디케이터 */}
      <div className="flex gap-1 mb-2">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1 rounded-full mb-1.5 transition-colors ${i + 1 <= step ? 'bg-brand-green-700' : 'bg-gray-200'}`} />
            <p className={`text-xs text-center hidden sm:block ${i + 1 === step ? 'text-brand-green-700 font-bold' : 'text-gray-400'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-brand-green-700">{STEP_LABELS[step - 1]} <span className="text-gray-400 font-normal">({step}/5)</span></p>

      {/* STEP 1: 날짜·시간 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">날짜 선택 *</label>
            <input type="date" min={today} value={form.date}
              onChange={e => { u('date', e.target.value); u('time', '') }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />

            {/* 예약불가 날짜 경고 */}
            {form.date && isDateBlocked(form.date) && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                🚫 {new Date(form.date).getDay() === 1 ? '월요일은 휴장일입니다.' : '해당 날짜는 예약이 불가능합니다.'} 다른 날짜를 선택해주세요.
              </div>
            )}
          </div>

          {form.date && !isDateBlocked(form.date) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">시간 선택 *</label>
              {slotsLoading ? (
                <div className="text-center py-6 text-gray-400 text-sm">가용 시간 확인 중...</div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map(s => (
                    <button key={s.time}
                      disabled={!s.available}
                      onClick={() => s.available && u('time', s.time)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors relative
                        ${!s.available
                          ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed'
                          : form.time === s.time
                            ? 'bg-brand-green-700 text-white border-brand-green-700'
                            : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}>
                      {s.time}
                      {!s.available && <span className="block text-[10px] text-gray-300">마감</span>}
                      {s.available && s.current > 0 && (
                        <span className="block text-[10px] text-yellow-600">{s.current}/{s.max}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">* 회색 시간은 예약이 마감된 슬롯입니다</p>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: 예약자 정보 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <p className="text-sm text-gray-500">예약 확인 문자를 받으실 분의 정보입니다.</p>

          {/* 군민/일반 선택 */}
          {hasDiscount && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">거주지 구분 *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setResidentType('general')}
                  className={`py-3.5 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-1
                    ${residentType === 'general'
                      ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="text-lg">🙋</span>
                  <span>일반</span>
                  <span className="text-xs font-semibold opacity-70">{program.price.toLocaleString()}원</span>
                </button>
                <button
                  onClick={() => setResidentType('local')}
                  className={`py-3.5 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-1
                    ${residentType === 'local'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 text-gray-500 hover:border-amber-200'}`}
                >
                  <span className="text-lg">🏘️</span>
                  <span>괴산군 군민</span>
                  <span className="text-xs font-semibold opacity-70">{program.localPrice.toLocaleString()}원</span>
                </button>
              </div>
              {residentType === 'local' && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                  🏘️ 군민 할인가가 적용됩니다. 현장에서 주민등록증 등 거주지 확인이 필요할 수 있습니다.
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
            <input type="text" placeholder="홍길동" value={form.bookerName}
              onChange={e => u('bookerName', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호 *</label>
            <input type="tel" placeholder="010-0000-0000" value={form.bookerPhone}
              onChange={e => u('bookerPhone', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          </div>
          <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 cursor-pointer">
            <input type="checkbox" checked={form.sameAsBooker}
              onChange={e => u('sameAsBooker', e.target.checked)}
              className="w-4 h-4 accent-brand-green-700" />
            <div>
              <p className="text-sm font-bold text-blue-700">예약자 = 이용자</p>
              <p className="text-xs text-blue-500 mt-0.5">체크 시 이용자 정보 입력을 건너뜁니다</p>
            </div>
          </label>
        </div>
      )}

      {/* STEP 3: 이용자 정보 */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <p className="text-sm text-gray-500">실제 승마를 이용하실 분의 정보입니다.</p>
          {!form.sameAsBooker && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                <input type="text" placeholder="홍길동" value={form.riderName}
                  onChange={e => u('riderName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
                <input type="date" value={form.riderBirthDate}
                  onChange={e => u('riderBirthDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">성별 *</label>
            <div className="flex gap-2">
              {['남성', '여성'].map(g => (
                <button key={g} onClick={() => u('riderGender', g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                    ${form.riderGender === g ? 'bg-brand-green-700 text-white border-brand-green-700' : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">몸무게 (kg) *</label>
              <input type="number" placeholder="60" value={form.riderWeightKg}
                onChange={e => u('riderWeightKg', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">키 (cm)</label>
              <input type="number" placeholder="170" value={form.riderHeightCm}
                onChange={e => u('riderHeightCm', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
            </div>
          </div>
          {form.riderWeightKg && parseFloat(form.riderWeightKg) >= 90 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
              ⚠️ 90kg 이상은 말 배정이 제한될 수 있습니다. 사전 문의 바랍니다.
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">승마 경험 *</label>
            <div className="space-y-2">
              {['처음입니다', '1회 이상 경험 있음', '6개월 이상 경험 있음'].map(exp => (
                <button key={exp} onClick={() => u('experience', exp)}
                  className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors
                    ${form.experience === exp ? 'bg-brand-green-700 text-white border-brand-green-700' : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}>
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: 건강정보 */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <p className="text-sm text-gray-500">안전한 수업 운영을 위해 필요한 정보입니다.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">알레르기 여부 *</label>
            <div className="flex gap-2 mb-2">
              {([['있음', true], ['없음', false]] as const).map(([label, val]) => (
                <button key={label} onClick={() => u('allergy', val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                    ${form.allergy === val ? (val ? 'bg-red-50 text-red-700 border-red-300' : 'bg-brand-green-700 text-white border-brand-green-700') : 'border-gray-200 text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>
            {form.allergy && (
              <textarea placeholder="알레르기 종류를 입력해주세요" value={form.allergyDesc}
                onChange={e => u('allergyDesc', e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">기저질환 여부 *</label>
            <div className="flex gap-2 mb-2">
              {([['있음', true], ['없음', false]] as const).map(([label, val]) => (
                <button key={label} onClick={() => u('condition', val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                    ${form.condition === val ? (val ? 'bg-red-50 text-red-700 border-red-300' : 'bg-brand-green-700 text-white border-brand-green-700') : 'border-gray-200 text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>
            {form.condition && (
              <textarea placeholder="기저질환 내용을 입력해주세요" value={form.conditionDesc}
                onChange={e => u('conditionDesc', e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">기타 요청사항</label>
            <textarea placeholder="강사에게 전달할 사항이 있으면 입력해주세요" value={form.notes}
              onChange={e => u('notes', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none" />
          </div>
        </div>
      )}

      {/* STEP 5: 최종 확인 */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-lg">예약 내용 확인</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
            {[
              ['프로그램', program.name],
              ['날짜', form.date],
              ['시간', form.time],
              ['구분', hasDiscount ? (residentType === 'local' ? '괴산군 군민 (할인 적용)' : '일반') : '일반'],
            ['예약자', `${form.bookerName} (${form.bookerPhone})`],
              ['이용자', form.sameAsBooker ? form.bookerName : form.riderName],
              ['성별', form.riderGender],
              ['몸무게', form.riderWeightKg ? `${form.riderWeightKg}kg` : '-'],
              ['키', form.riderHeightCm ? `${form.riderHeightCm}cm` : '-'],
              ['승마 경험', form.experience],
              ['알레르기', form.allergy ? `있음 (${form.allergyDesc})` : '없음'],
              ['기저질환', form.condition ? `있음 (${form.conditionDesc})` : '없음'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-800">{v || '-'}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center">
              <span className="font-bold text-gray-700">총 금액</span>
              <div className="text-right">
                {residentType === 'local' && hasDiscount && (
                  <p className="text-xs text-gray-400 line-through">{program.price.toLocaleString()}원</p>
                )}
                <span className="font-bold text-brand-green-700 text-base">{finalPrice.toLocaleString()}원</span>
                {residentType === 'local' && hasDiscount && (
                  <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">군민 할인</span>
                )}
              </div>
            </div>
          </div>

          {/* 결제 방법 선택 */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">결제 방법 선택 *</p>

            {/* 쿠폰 옵션 (보유 쿠폰이 있을 때) */}
            {couponsLoading && (
              <div className="mb-3 text-xs text-gray-400 text-center py-2">쿠폰 확인 중...</div>
            )}
            {!couponsLoading && coupons.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => { setPayMethod('coupon'); setSelectedCouponId(coupons[0].id) }}
                  className={`w-full py-4 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between px-5
                    ${payMethod === 'coupon' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🎟</span>
                    <span>쿠폰 사용</span>
                  </span>
                  <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                    {coupons.reduce((s, c) => s + c.remaining, 0)}장 보유
                  </span>
                </button>

                {/* 쿠폰 선택 목록 */}
                {payMethod === 'coupon' && (
                  <div className="mt-2 space-y-2">
                    {coupons.map(c => (
                      <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedCouponId === c.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                        <input
                          type="radio" name="coupon" value={c.id}
                          checked={selectedCouponId === c.id}
                          onChange={() => setSelectedCouponId(c.id)}
                          className="accent-purple-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">
                            {c.programName ? `${c.programName} 이용권` : '전 프로그램 이용권'}
                          </p>
                          <p className="text-xs text-gray-500">
                            잔여 {c.remaining}회
                            {c.expiresAt && ` · 만료 ${c.expiresAt}`}
                          </p>
                        </div>
                        <span className="text-lg font-black text-purple-600">{c.remaining}장</span>
                      </label>
                    ))}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-800">
                      🎟 쿠폰 사용 시 결제 금액이 0원으로 처리됩니다.
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPayMethod('card')}
                className={`py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1
                  ${payMethod === 'card' ? 'border-brand-green-700 bg-brand-green-50 text-brand-green-700' : 'border-gray-200 text-gray-600 hover:border-brand-green-300'}`}>
                <span className="text-2xl">💳</span>
                현장 카드결제
              </button>
              <button onClick={() => setPayMethod('transfer')}
                className={`py-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1
                  ${payMethod === 'transfer' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-600 hover:border-yellow-300'}`}>
                <span className="text-2xl">🏦</span>
                계좌이체
              </button>
            </div>
            {payMethod === 'card' && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                ✅ 방문 당일 현장에서 카드로 결제해 주세요.
              </div>
            )}
            {payMethod === 'transfer' && (
              <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm">
                <p className="font-bold text-yellow-800 mb-2">🏦 입금 계좌 안내</p>
                <div className="bg-white rounded-lg px-4 py-3 border border-yellow-200 text-center">
                  <p className="text-lg font-black text-gray-800 tracking-wider">3333-33-4922639</p>
                  <p className="text-sm text-gray-600 mt-0.5">카카오뱅크 · 정창덕</p>
                </div>
                <p className="text-xs text-yellow-700 mt-2">입금 시 예약자 이름으로 이체해 주세요.</p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed">
            📌 취소 정책: 48시간 전 전액 환불 / 24시간 전 50% 환불 / 당일 환불 불가
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(s => (s - 1) as Step)}
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            ← 이전
          </button>
        )}
        {step < 5 ? (
          <button disabled={!canNext()} onClick={() => setStep(s => (s + 1) as Step)}
            className="flex-[2] bg-brand-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-brand-green-600 transition-colors">
            다음 →
          </button>
        ) : (
          <button disabled={isPending || !payMethod || (payMethod === 'coupon' && !selectedCouponId)} onClick={handleSubmit}
            className="flex-[2] bg-yellow-400 text-green-900 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">
            {isPending ? '예약 중...' : !payMethod ? '결제 방법을 선택해주세요' : '예약 신청하기 ✅'}
          </button>
        )}
      </div>
    </div>
  )
}
