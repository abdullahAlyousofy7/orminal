import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      fontFamily: {
        sans: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-ui)', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b9dbff',
          300: '#84c2fd',
          400: '#4aa3f8',
          500: '#1f7fea',
          600: '#0f60d4',
          700: '#0f4bab',
          800: '#123f89',
          900: '#0d2a5c',
          950: '#071b3e',
        },
        sky2: '#29a9f3',
        accent: {
          50: '#eafaf1',
          500: '#16a34a',
          600: '#128a3f',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,27,62,.06), 0 8px 24px -12px rgba(7,27,62,.18)',
        lift: '0 18px 40px -18px rgba(15,96,212,.45)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(10px,-18px,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(.85)', opacity: '.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 11s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseRing: 'pulseRing 2.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
