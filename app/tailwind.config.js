import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/index.html', './app/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F9F6F0',
          50: '#FDFCFA',
          100: '#F9F6F0',
          200: '#F3EFE8',
          300: '#EDE6DA',
          400: '#E8E0D5',
          500: '#D4C9B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F3EFE8',
        },
        border: {
          DEFAULT: '#E8E0D5',
          strong: '#D4C9B8',
        },
        accent: {
          DEFAULT: '#0D5C4E',
          light: '#E6F2F0',
          mid: '#1A7A68',
          dark: '#083D35',
        },
        muted: {
          DEFAULT: '#8A8A82',
        },
        teal: {
          DEFAULT: '#0D5C4E',
          light: '#E6F2F0',
          mid: '#1A7A68',
          dark: '#083D35',
          50: '#E6F2F0',
          100: '#B8DDD8',
          500: '#1A7A68',
          600: '#0D5C4E',
          900: '#083D35',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#F5EDD3',
          dark: '#A8872E',
        },
        charcoal: {
          DEFAULT: '#1A1A18',
          200: '#4A4A45',
          300: '#6A6A62',
          400: '#8A8A82',
        },
        status: {
          success: '#0D5C4E',
          warning: '#C9A84C',
          error: '#C0392B',
          info: '#1A7A68',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(26, 26, 24, 0.06)',
        card: '0 2px 16px rgba(26, 26, 24, 0.08)',
        lifted: '0 8px 32px rgba(26, 26, 24, 0.12)',
        teal: '0 8px 24px rgba(13, 92, 78, 0.2)',
        gold: '0 4px 16px rgba(201, 168, 76, 0.2)',
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
