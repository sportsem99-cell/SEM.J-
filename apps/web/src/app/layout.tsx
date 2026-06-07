import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEM.J 승마교육원 | 예약',
  description: '충북 괴산 SEM.J 승마교육원 온라인 예약 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
