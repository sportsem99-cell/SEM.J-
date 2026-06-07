'use client'

import { useState } from 'react'

type Step = 'date' | 'participants' | 'confirm'

interface Props {
  programType: string
  program: { name: string; price: number; capacity: number }
}

const TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function BookingWizard({ program }: Props) {
  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [participants, setParticipants] = useState(1)

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* 스텝 인디케이터 */}
      <div className="flex items-center gap-2 text-sm">
        {(['date', 'participants', 'confirm'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${step === s ? 'bg-brand-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={step === s ? 'text-brand-green-700 font-semibold' : 'text-gray-400'}>
              {s === 'date' ? '날짜·시간' : s === 'participants' ? '인원' : '최종 확인'}
            </span>
            {i < 2 && <span className="text-gray-300">›</span>}
          </div>
        ))}
      </div>

      {/* STEP 1: 날짜·시간 선택 */}
      {step === 'date' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">날짜 선택</label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">시간 선택</label>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors
                      ${selectedTime === t
                        ? 'bg-brand-green-700 text-white border-brand-green-700'
                        : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">* 실제 가용 슬롯은 Supabase 연결 후 표시됩니다</p>
            </div>
          )}

          <button
            disabled={!selectedDate || !selectedTime}
            onClick={() => setStep('participants')}
            className="w-full bg-brand-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-brand-green-600 transition-colors"
          >
            다음 →
          </button>
        </div>
      )}

      {/* STEP 2: 인원 선택 */}
      {step === 'participants' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <p className="text-sm text-gray-500 mb-1">선택한 일시</p>
            <p className="font-bold text-gray-800">{selectedDate} {selectedTime}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              참가 인원 (최대 {program.capacity}명)
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 text-xl font-bold hover:border-brand-green-500 transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-bold text-brand-green-700 w-8 text-center">
                {participants}
              </span>
              <button
                onClick={() => setParticipants(Math.min(program.capacity, participants + 1))}
                className="w-10 h-10 rounded-full border border-gray-300 text-xl font-bold hover:border-brand-green-500 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500">명</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('date')}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={() => setStep('confirm')}
              className="flex-1 bg-brand-green-700 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-green-600 transition-colors"
            >
              다음 →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: 최종 확인 */}
      {step === 'confirm' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-bold text-gray-800 text-lg">예약 내용 확인</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">프로그램</span>
              <span className="font-semibold">{program.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">일시</span>
              <span className="font-semibold">{selectedDate} {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">인원</span>
              <span className="font-semibold">{participants}명</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-gray-700">총 금액</span>
              <span className="font-bold text-brand-green-700 text-base">
                {(program.price * participants).toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800 leading-relaxed">
            📌 취소 정책: 48시간 전 전액 환불 / 24시간 전 50% 환불 / 당일 환불 불가
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('participants')}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={() => alert('Supabase + TossPayments 연결 후 결제가 진행됩니다')}
              className="flex-1 bg-yellow-400 text-green-900 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
            >
              결제하기 💳
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
