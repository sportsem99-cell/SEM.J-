'use client'

import { useState, useTransition } from 'react'
import { createBooking, type BookingFormData } from '@/app/actions/booking'

type Step = 1 | 2 | 3 | 4 | 5

interface Props {
  programType: string
  program: { name: string; price: number; capacity: number }
}

const TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

const STEP_LABELS = ['날짜·시간', '예약자', '이용자', '건강정보', '최종확인']

export default function BookingWizard({ programType, program }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    date: '', time: '',
    bookerName: '', bookerPhone: '',
    sameAsBooker: false,
    riderName: '', riderBirthDate: '', riderGender: '',
    riderWeightKg: '', riderHeightCm: '',
    experience: '',
    allergy: false, allergyDesc: '',
    condition: false, conditionDesc: '',
    notes: '',
  })

  const u = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const today = new Date().toISOString().split('T')[0]

  const canNext = () => {
    if (step === 1) return !!form.date && !!form.time
    if (step === 2) return !!form.bookerName && !!form.bookerPhone
    if (step === 3) return !!form.riderName && !!form.riderGender && !!form.experience && !!form.riderWeightKg
    return true
  }

  const handleSubmit = () => {
    setError('')
    startTransition(async () => {
      const data: BookingFormData = {
        programType,
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
        totalAmount: program.price,
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
              onChange={e => u('date', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          </div>
          {form.date && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">시간 선택 *</label>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map(t => (
                  <button key={t} onClick={() => u('time', t)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors
                      ${form.time === t ? 'bg-brand-green-700 text-white border-brand-green-700' : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: 예약자 정보 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <p className="text-sm text-gray-500">예약 확인 문자를 받으실 분의 정보입니다.</p>
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
              {[['있음', true], ['없음', false]].map(([label, val]) => (
                <button key={String(label)} onClick={() => u('allergy', val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                    ${form.allergy === val ? (val ? 'bg-red-50 text-red-700 border-red-300' : 'bg-brand-green-700 text-white border-brand-green-700') : 'border-gray-200 text-gray-700'}`}>
                  {String(label)}
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
              {[['있음', true], ['없음', false]].map(([label, val]) => (
                <button key={String(label)} onClick={() => u('condition', val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                    ${form.condition === val ? (val ? 'bg-red-50 text-red-700 border-red-300' : 'bg-brand-green-700 text-white border-brand-green-700') : 'border-gray-200 text-gray-700'}`}>
                  {String(label)}
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
            <div className="border-t border-gray-200 pt-2.5 flex justify-between">
              <span className="font-bold text-gray-700">총 금액</span>
              <span className="font-bold text-brand-green-700 text-base">{program.price.toLocaleString()}원</span>
            </div>
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
          <button disabled={isPending} onClick={handleSubmit}
            className="flex-[2] bg-yellow-400 text-green-900 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">
            {isPending ? '예약 중...' : '예약 신청하기 ✅'}
          </button>
        )}
      </div>
    </div>
  )
}
