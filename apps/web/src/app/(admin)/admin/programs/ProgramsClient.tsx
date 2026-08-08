'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProgram, createProgram, deleteProgram } from '@/app/actions/programs'

interface Program {
  id: string
  name: string
  type: string
  description: string | null
  price: number | null
  local_price: number | null
  duration_min: number | null
  capacity: number | null
  is_active: boolean | null
}

const PROGRAM_ICONS: Record<string, string> = {
  experience: '🐴', private: '🏇', group: '🎯', youth: '⭐',
}

const EMPTY_CREATE = {
  name: '', description: '', price: '', local_price: '', duration_min: '60', capacity: '1',
}

export default function ProgramsClient({ programs }: { programs: Program[] }) {
  const router = useRouter()
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string | boolean>>({})
  const [isPending, startTransition] = useTransition()
  const [savedId, setSavedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // 추가 모달
  const [showAdd, setShowAdd] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_CREATE)
  const [createError, setCreateError] = useState('')

  // 삭제 확인
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const startEdit = (p: Program) => {
    setEditId(p.id)
    setSavedId(null)
    setError('')
    setForm({
      price:        String(p.price ?? 0),
      local_price:  String(p.local_price ?? 0),
      duration_min: String(p.duration_min ?? 60),
      capacity:     String(p.capacity ?? 1),
      is_active:    p.is_active ?? true,
    })
  }

  const cancelEdit = () => { setEditId(null); setError('') }

  const handleSave = (id: string) => {
    setError('')
    startTransition(async () => {
      const res = await updateProgram(id, {
        price:        parseInt(String(form.price)) || 0,
        local_price:  parseInt(String(form.local_price)) || 0,
        duration_min: parseInt(String(form.duration_min)) || 60,
        capacity:     parseInt(String(form.capacity)) || 1,
        is_active:    Boolean(form.is_active),
      })
      if (res?.error) {
        setError(res.error)
      } else {
        setSavedId(id)
        setEditId(null)
        router.refresh()
      }
    })
  }

  const handleCreate = () => {
    setCreateError('')
    if (!createForm.name.trim()) { setCreateError('프로그램 이름을 입력해주세요.'); return }
    startTransition(async () => {
      const res = await createProgram({
        name:         createForm.name.trim(),
        description:  createForm.description.trim(),
        price:        parseInt(createForm.price) || 0,
        local_price:  parseInt(createForm.local_price) || parseInt(createForm.price) || 0,
        duration_min: parseInt(createForm.duration_min) || 60,
        capacity:     parseInt(createForm.capacity) || 1,
      })
      if (res?.error) {
        setCreateError(res.error)
      } else {
        setShowAdd(false)
        setCreateForm(EMPTY_CREATE)
        router.refresh()
      }
    })
  }

  const handleDelete = (id: string) => {
    setDeleteError('')
    startTransition(async () => {
      const res = await deleteProgram(id)
      if (res?.error) {
        setDeleteError(res.error)
      } else {
        setDeleteId(null)
        router.refresh()
      }
    })
  }

  const u = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))
  const uc = (k: string, v: string) => setCreateForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로그램 관리</h1>
          <p className="text-sm text-gray-400 mt-1">추가/수정/삭제 즉시 예약 페이지에 반영됩니다</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setCreateError('') }}
          className="bg-brand-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-600 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span> 프로그램 추가
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
      )}

      {/* 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">새 프로그램 추가</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{createError}</div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">프로그램 이름 *</label>
              <input
                type="text" placeholder="예: 임신부 승마 치료" value={createForm.name}
                onChange={e => uc('name', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">설명</label>
              <textarea
                placeholder="프로그램 소개 (예약 페이지에 표시됩니다)" value={createForm.description}
                onChange={e => uc('description', e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">일반 가격 (원)</label>
                <input
                  type="number" placeholder="45000" value={createForm.price}
                  onChange={e => uc('price', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-1.5">군민 할인가 (원)</label>
                <input
                  type="number" placeholder="38250" value={createForm.local_price}
                  onChange={e => uc('local_price', e.target.value)}
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">수업 시간 (분)</label>
                <input
                  type="number" placeholder="60" value={createForm.duration_min}
                  onChange={e => uc('duration_min', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">최대 인원 (명)</label>
                <input
                  type="number" placeholder="1" value={createForm.capacity}
                  onChange={e => uc('capacity', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="flex-[2] bg-brand-green-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-brand-green-600 transition-colors disabled:opacity-50"
              >
                {isPending ? '추가 중...' : '프로그램 추가하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">프로그램 삭제</h2>
            <p className="text-sm text-gray-600">
              정말 삭제하시겠어요? 진행 중인 예약이 없는 경우에만 삭제됩니다.
            </p>
            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{deleteError}</div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteId(null); setDeleteError('') }}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isPending}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-3xl mb-2">🎯</p>
          <p className="text-sm">등록된 프로그램이 없습니다.</p>
          <p className="text-xs mt-1">위 "프로그램 추가" 버튼을 눌러 첫 번째 프로그램을 만들어보세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map(p => {
            const isEditing = editId === p.id
            const justSaved = savedId === p.id && !isEditing
            const discountRate = p.price && p.local_price
              ? Math.round((1 - p.local_price / p.price) * 100)
              : 0
            const icon = PROGRAM_ICONS[p.type] ?? '🐴'

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all ${
                  isEditing ? 'border-brand-green-400 shadow-md' : 'border-gray-100'
                }`}
              >
                {/* 카드 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-gray-400 max-w-xs truncate">{p.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {justSaved && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">✓ 저장됨</span>
                    )}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.is_active ? '운영 중' : '일시 중단'}
                    </span>
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => { setDeleteId(p.id); setDeleteError('') }}
                          className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-500 font-medium transition-colors"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 카드 바디 */}
                {!isEditing ? (
                  <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <InfoBox label="일반 가격" value={`${(p.price ?? 0).toLocaleString()}원`} highlight />
                    <InfoBox
                      label="군민 할인가"
                      value={`${(p.local_price ?? 0).toLocaleString()}원`}
                      sub={discountRate > 0 ? `${discountRate}% 할인` : undefined}
                      highlight
                      color="gold"
                    />
                    <InfoBox label="수업 시간" value={`${p.duration_min ?? 60}분`} />
                    <InfoBox label="최대 인원" value={`${p.capacity ?? 1}명`} />
                  </div>
                ) : (
                  <div className="px-6 py-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">일반 가격 (원)</label>
                        <div className="relative">
                          <input
                            type="number" value={String(form.price)}
                            onChange={e => u('price', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                          />
                          <span className="absolute right-4 top-3.5 text-xs text-gray-400">원</span>
                        </div>
                        {form.price && (
                          <p className="text-xs text-gray-500 mt-1 ml-1">{parseInt(String(form.price)).toLocaleString()}원</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">군민 할인가 (원)</label>
                        <div className="relative">
                          <input
                            type="number" value={String(form.local_price)}
                            onChange={e => u('local_price', e.target.value)}
                            className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                          <span className="absolute right-4 top-3.5 text-xs text-amber-400">원</span>
                        </div>
                        {form.price && form.local_price && parseInt(String(form.price)) > 0 && (
                          <p className="text-xs text-amber-600 mt-1 ml-1 font-semibold">
                            {Math.round((1 - parseInt(String(form.local_price)) / parseInt(String(form.price))) * 100)}% 할인 적용
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">수업 시간 (분)</label>
                        <input
                          type="number" value={String(form.duration_min)}
                          onChange={e => u('duration_min', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">최대 인원 (명)</label>
                        <input
                          type="number" value={String(form.capacity)}
                          onChange={e => u('capacity', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">운영 상태</label>
                      <div className="flex gap-2">
                        {([true, false] as const).map(val => (
                          <button
                            key={String(val)}
                            onClick={() => u('is_active', val)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                              form.is_active === val
                                ? val ? 'bg-brand-green-700 text-white border-brand-green-700' : 'bg-red-50 text-red-700 border-red-300'
                                : 'border-gray-200 text-gray-500'
                            }`}
                          >
                            {val ? '✅ 운영 중' : '⏸ 일시 중단'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={cancelEdit}
                        className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSave(p.id)}
                        disabled={isPending}
                        className="flex-[2] bg-brand-green-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-brand-green-600 transition-colors disabled:opacity-50"
                      >
                        {isPending ? '저장 중...' : '변경사항 저장'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-700">
        <p className="font-bold mb-1">💡 연동 안내</p>
        <p className="text-xs leading-relaxed text-blue-600">
          추가한 프로그램은 고객 예약 페이지에 즉시 표시됩니다. 삭제는 진행 중인 예약이 없을 때만 가능합니다.
        </p>
      </div>
    </div>
  )
}

function InfoBox({
  label, value, sub, highlight = false, color = 'green',
}: {
  label: string; value: string; sub?: string; highlight?: boolean; color?: 'green' | 'gold'
}) {
  return (
    <div className={`rounded-xl px-4 py-3 ${highlight ? (color === 'gold' ? 'bg-amber-50' : 'bg-brand-green-50') : 'bg-gray-50'}`}>
      <p className={`text-xs font-medium mb-0.5 ${highlight ? (color === 'gold' ? 'text-amber-500' : 'text-brand-green-600') : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`font-black text-base ${highlight ? (color === 'gold' ? 'text-amber-700' : 'text-brand-green-700') : 'text-gray-700'}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] font-bold text-amber-500 mt-0.5">{sub}</p>}
    </div>
  )
}
