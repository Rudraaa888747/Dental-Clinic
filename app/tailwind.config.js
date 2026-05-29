import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/index.html', './app/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          800: '#1e293b',
          900: '#0f172a',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA8C2C',
        },
        softwhite: '#F8FAFC',
        support: {
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
        card: '0 16px 40px rgba(15, 23, 42, 0.06)',
        glow: '0 28px 70px rgba(212, 175, 55, 0.15)',
        gold: '0 0 40px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(212, 175, 55, 0.15), transparent 42%), linear-gradient(135deg, rgba(15,23,42,1), rgba(15,23,42,0.95))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.6))',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shine: 'shine 8s linear infinite',
      },
    },
  },
  plugins: [forms],
}
