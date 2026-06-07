'use client'

import { createClient } from '@/lib/supabase/client'

export default function KakaoLoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: 'profile_nickname profile_image',
        queryParams: {
          scope: 'profile_nickname profile_image', // account_email 강제 제외
        },
      },
    })
  }

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#3C1E1E] font-bold py-3.5 rounded-xl hover:bg-[#F0D800] transition-colors text-sm"
    >
      {/* 카카오 아이콘 (SVG) */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2C5.582 2 2 4.858 2 8.4c0 2.26 1.49 4.247 3.738 5.368L4.9 17.08a.25.25 0 0 0 .374.274L9.1 14.77c.296.03.595.046.9.046 4.418 0 8-2.858 8-6.4S14.418 2 10 2Z"
          fill="#3C1E1E"
        />
      </svg>
      카카오로 로그인
    </button>
  )
}
