/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#0a0a0f',
          dark: '#12121a',
          card: '#1a1a2e',
          purple: '#6c3fc5',
          violet: '#9b59b6',
          gold: '#f0c040',
          amber: '#f5a623',
          cream: '#f5f0e8',
          muted: '#8892a4',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        spin_slow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        groove_pulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        float_up: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        needle_drop: {
          '0%': { transform: 'rotate(-30deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      },
      animation: {
        'spin-slow': 'spin_slow 4s linear infinite',
        'spin-slower': 'spin_slow 8s linear infinite',
        'groove-pulse': 'groove_pulse 3s ease-in-out infinite',
        'float-up': 'float_up 0.5s ease-out forwards',
        'needle-drop': 'needle_drop 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}
