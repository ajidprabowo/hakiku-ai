/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Colors ────────────────────────────────────────
        blue: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1B4FD8', // primary brand
          900: '#1E3A8A',
        },
        orange: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316', // primary orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.3s ease forwards',
        'fade-in':    'fadeIn 0.25s ease forwards',
        'bounce-in':  'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'typing':     'typing 1.2s infinite ease-in-out',
        'shimmer':    'shimmer 1.5s infinite',
        'pulse-dot':  'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%':           { transform: 'scale(1)',  opacity: '1' },
        },
      },
      boxShadow: {
        'brand':  '0 4px 24px rgba(27,79,216,0.12)',
        'brandL': '0 8px 40px rgba(27,79,216,0.18)',
        'orange': '0 4px 24px rgba(249,115,22,0.18)',
      },
    },
  },
  plugins: [],
}
