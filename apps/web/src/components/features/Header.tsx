import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { createClient } from '@/lib/supabase/server'

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
  } catch {
    return null
  }
}

export default async function Header() {
  const user = await getUser()

  return (
    <header className="bg-brand-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tight">SEM.J</span>
        <span className="text-sm text-green-200 hidden sm:inline">승마교육원</span>
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link href="/programs" className="hover:text-yellow-300 transition-colors">
          프로그램
        </Link>

        {user ? (
          <>
            <Link href="/my/bookings" className="hover:text-yellow-300 transition-colors">
              내 예약
            </Link>
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="bg-yellow-400 text-green-900 px-4 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
          >
            로그인
          </Link>
        )}
      </nav>
    </header>
  )
}
