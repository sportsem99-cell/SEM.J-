import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { createClient } from '@/lib/supabase/server'
import { getIsAdmin } from '@/lib/auth/isAdmin'

const NAV = [
  { href: '/programs', label: '프로그램' },
  { href: '/competition', label: '시합일정' },
  { href: '/board', label: '게시판' },
  { href: '/resources', label: '자료실' },
  { href: '/mofit', label: '모핏AI', badge: 'Beta' },
  { href: '/forms', label: '신청서' },
]

async function getUserAndRole() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null
    const isAdmin = user ? await getIsAdmin(user.id) : false
    return { user, isAdmin }
  } catch {
    return { user: null, isAdmin: false }
  }
}

export default async function Header() {
  const { user, isAdmin } = await getUserAndRole()

  return (
    <header className="bg-brand-green-700 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight">SEM.J</span>
        <span className="text-xs text-green-300 hidden sm:inline font-medium">모두가 만들어가는 스포츠</span>
      </Link>

      <nav className="hidden md:flex items-center gap-5 text-sm">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}
            className="hover:text-yellow-300 transition-colors flex items-center gap-1">
            {item.label}
            {item.badge && (
              <span className="text-[10px] bg-yellow-400 text-green-900 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link href="/my/bookings" className="hover:text-yellow-300 transition-colors hidden sm:inline">내 예약</Link>
            <Link href="/my/profile" className="hover:text-yellow-300 transition-colors hidden sm:inline">내 정보</Link>
            {isAdmin && (
              <Link href="/admin" className="bg-yellow-400 text-green-900 px-3 py-1 rounded-full font-bold text-xs hover:bg-yellow-300 transition-colors">
                관리자
              </Link>
            )}
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="bg-yellow-400 text-green-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
            로그인
          </Link>
        )}
      </div>
    </header>
  )
}
