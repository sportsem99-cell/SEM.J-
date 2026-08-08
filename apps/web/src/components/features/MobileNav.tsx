'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

interface NavItem { href: string; label: string; badge?: string }

interface Props {
  nav: NavItem[]
  isLoggedIn: boolean
  isAdmin: boolean
}

export default function MobileNav({ nav, isLoggedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
        className="p-2 -mr-2 text-white"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-lg font-black text-brand-green-700">SEM.J</span>
              <button onClick={() => setOpen(false)} aria-label="메뉴 닫기" className="p-2 -mr-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {nav.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] bg-yellow-400 text-green-900 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
                  )}
                </Link>
              ))}

              <div className="my-2 border-t border-gray-100" />

              {isLoggedIn ? (
                <>
                  <Link href="/my/bookings" onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    내 예약
                  </Link>
                  <Link href="/my/profile" onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    내 정보
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-brand-green-700 font-bold hover:bg-green-50 transition-colors">
                      관리자 페이지
                    </Link>
                  )}
                  <div className="px-2 pt-2">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}
                  className="block mx-2 mt-2 text-center bg-yellow-400 text-green-900 px-4 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
                  로그인
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
