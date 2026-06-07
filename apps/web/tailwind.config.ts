import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SEM.J 브랜드 컬러
        brand: {
          green: {
            50:  '#f0f7f0',
            100: '#d9edd9',
            500: '#2d6a2d',
            600: '#245724',
            700: '#1a421a',
            900: '#0d210d',
          },
          gold: {
            400: '#d4af37',
            500: '#b8960c',
            600: '#9a7c0a',
          },
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
