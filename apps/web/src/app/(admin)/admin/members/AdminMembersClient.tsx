'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const ROLE_LABEL: Record<string, string> = {
  owner: '오너', admin: '관리자', instructor: '강사', member: '일반',
}
const ROLE_STYLE: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-yellow-100 text-yellow-700',
  instructor: 'bg-blue-100 text-blue-700',
  member: 'bg-gray-100 text-gray-600',
}

interface Profile {
  name?: string | null
  display_name?: string | null
  avatar_url?: string | null
}

interface Member {
  id: string; user_id: string; role: string; created_at: string
  profile: Profile | null
}

interface NonMember {
  id: string
  name?: string | null
  display_name?: string | null
  avatar_url?: string | null
}

interface Props {
  members: Member[]
  nonMembers: NonMember[]
}

export default function AdminMembersClient({ members, nonMembers }: Props) {
  const router = useRouter()
  const [addRole, setAddRole] = useState('admin')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const displayName = (p: Profile | NonMember | null) =>
    (p as any)?.display_name || (p as any)?.name || '(이름 없음)'

  const handleAdd = (userId: string) => {
    setError('')
    startTransition(async () => {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: addRole }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || '오류 발생')
      else router.refresh()
    })
  }

  const handleRoleChange = (memberId: string, role: string) => {
    startTransition(async () => {
      await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role }),
      })
      router.refresh()
    })
  }

  const handleRemove = (memberId: string) => {
    if (!confirm('이 멤버를 삭제하시겠습니까?')) return
    startTransition(async () => {
      await fetch('/api/admin/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      })
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">멤버 관리</h1>
      </div>

      {/* 현재 멤버 */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">현재 멤버 ({members.length}명)</h2>
        <div className="space-y-2">
          {members.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">등록된 멤버가 없습니다</div>
          ) : members.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {m.profile?.avatar_url
                    ? <img src={m.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <span className="text-gray-400 text-sm">👤</span>}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{displayName(m.profile)}</p>
                  <p className="text-xs text-gray-400 font-mono">{m.user_id.slice(0, 12)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.role === 'owner' ? (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_STYLE.owner}`}>오너</span>
                ) : (
                  <select value={m.role}
                    onChange={e => handleRoleChange(m.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${ROLE_STYLE[m.role]}`}>
                    <option value="admin">관리자</option>
                    <option value="instructor">강사</option>
                    <option value="member">일반</option>
                  </select>
                )}
                {m.role !== 'owner' && (
                  <button onClick={() => handleRemove(m.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 역할 선택 */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-semibold text-gray-600">추가 시 역할:</span>
        {['admin', 'instructor', 'member'].map(r => (
          <button key={r} onClick={() => setAddRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors
              ${addRole === r ? 'bg-brand-green-700 text-white border-brand-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

      {/* 가입 유저 목록 */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          가입한 사용자 ({nonMembers.length}명) — 클릭하면 멤버로 추가
        </h2>
        {nonMembers.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 text-sm">
            모든 사용자가 이미 멤버입니다
          </div>
        ) : (
          <div className="space-y-2">
            {nonMembers.map(u => (
              <button key={u.id} onClick={() => handleAdd(u.id)} disabled={isPending}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between hover:border-brand-green-300 hover:bg-green-50 transition-colors disabled:opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <span className="text-gray-400 text-sm">👤</span>}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">{displayName(u)}</p>
                    <p className="text-xs text-gray-400 font-mono">{u.id.slice(0, 12)}...</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_STYLE[addRole]}`}>
                  {ROLE_LABEL[addRole]}로 추가 +
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
