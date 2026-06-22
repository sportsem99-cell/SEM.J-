import Link from 'next/link'
import LogoutButton from '@/components/features/LogoutButton'

const NAV_ITEMS = [
  { href: '/admin',           label: '대시보드',     icon: '📊' },
  { href: '/admin/calendar',  label: '예약 캘린더',   icon: '📅' },
  { href: '/admin/bookings',  label: '예약 관리',    icon: '📋' },
  { href: '/admin/resources', label: '리소스 관리',   icon: '🐴' },
  { href: '/admin/programs',  label: '프로그램 관리', icon: '🎯' },
  { href: '/admin/members',   label: '멤버 관리',    icon: '👥' },
  { href: '/admin/forms',    label: '서식 관리',    icon: '📝' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-56 bg-brand-green-700 text-white flex flex-col fixed h-full z-40">
        <div className="px-6 py-5 border-b border-green-600">
          <p className="font-bold text-lg">SEM.J</p>
          <p className="text-xs text-green-300">관리자 페이지</p>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-green-600 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-green-600 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-0 py-2 text-sm text-green-200 hover:text-white transition-colors">
            <span>🏠</span>
            <span>메인 홈으로</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
