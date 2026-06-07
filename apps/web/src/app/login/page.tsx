import KakaoLoginButton from '@/components/features/KakaoLoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-green-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center">
        {/* 로고 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-green-700">SEM.J</h1>
          <p className="text-sm text-gray-500 mt-1">승마교육원</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">로그인</h2>
        <p className="text-sm text-gray-500 mb-8">
          카카오 계정으로 간편하게 시작하세요
        </p>

        <KakaoLoginButton />

        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          로그인 시{' '}
          <span className="underline cursor-pointer">이용약관</span> 및{' '}
          <span className="underline cursor-pointer">개인정보처리방침</span>에<br />
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
