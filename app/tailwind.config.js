import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/index.html', './app/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        skybrand: {
          50: '#effbff',
          100: '#dff6ff',
          200: '#c1edfb',
          300: '#8fd6f4',
          400: '#5bbde9',
          500: '#2a9bd1',
          600: '#167db0',
          700: '#11658f',
          800: '#135576',
          900: '#164765',
        },
        ink: '#0f172a',
        mist: '#f5fbff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgba(21, 94, 117, 0.12)',
        card: '0 16px 40px rgba(15, 23, 42, 0.08)',
        glow: '0 28px 70px rgba(42, 155, 209, 0.18)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(143, 214, 244, 0.55), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,251,255,0.9))',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [forms],
}
