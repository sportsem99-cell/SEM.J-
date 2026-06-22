'use client'

import { useState, useTransition } from 'react'
import { saveProfile } from '@/app/actions/profile'

interface Profile {
  name?: string | null
  phone?: string | null
  birth_date?: string | null
  gender?: string | null
  height_cm?: number | null
  weight_kg?: number | null
  experience?: string | null
  allergy?: boolean | null
  allergy_desc?: string | null
  condition?: boolean | null
  condition_desc?: string | null
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    birth_date: profile?.birth_date || '',
    gender: profile?.gender || '',
    height_cm: profile?.height_cm?.toString() || '',
    weight_kg: profile?.weight_kg?.toString() || '',
    experience: profile?.experience || '',
    allergy: profile?.allergy ?? false,
    allergy_desc: profile?.allergy_desc || '',
    condition: profile?.condition ?? false,
    condition_desc: profile?.condition_desc || '',
  })
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const u = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    setSaved(false)
    startTransition(async () => {
      const result = await saveProfile({
        ...form,
        height_cm: parseFloat(form.height_cm) || null,
        weight_kg: parseFloat(form.weight_kg) || null,
      })
      if (!result?.error) setSaved(true)
    })
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-700 text-sm">기본 정보</h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
          <input type="text" placeholder="홍길동" value={form.name}
            onChange={e => u('name', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">휴대폰 번호</label>
          <input type="tel" placeholder="010-0000-0000" value={form.phone}
            onChange={e => u('phone', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
          <input type="date" value={form.birth_date}
            onChange={e => u('birth_date', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
          <div className="flex gap-2">
            {['남성', '여성'].map(g => (
              <button key={g} onClick={() => u('gender', g)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
                  ${form.gender === g ? 'bg-brand-green-700 text-white border-brand-green-700' : 'border-gray-200 text-gray-700 hover:border-brand-green-500'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">몸무게 (kg)</label>
            <input type="number" placeholder="60" value={form.weight_kg}
              onChange={e => u('weight_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">키 (cm)</label>
            <input type="number" placeholder="170" value={form.height_cm}
              onChange={e => u('height_cm', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">승마 경험</label>
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

      {/* 건강 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-700 text-sm">건강 정보</h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">알레르기 여부</label>
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
            <textarea placeholder="알레르기 종류 입력" value={form.allergy_desc}
              onChange={e => u('allergy_desc', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">기저질환 여부</label>
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
            <textarea placeholder="기저질환 내용 입력" value={form.condition_desc}
              onChange={e => u('condition_desc', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none" />
          )}
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-semibold text-center">
          ✅ 저장되었습니다. 다음 예약 시 자동으로 입력됩니다.
        </div>
      )}

      <button onClick={handleSubmit} disabled={isPending}
        className="w-full bg-brand-green-700 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-green-600 transition-colors disabled:opacity-50">
        {isPending ? '저장 중...' : '저장하기'}
      </button>
    </div>
  )
}
