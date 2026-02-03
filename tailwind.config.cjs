/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './entrypoints/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', '"Fira Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        mist: {
          50: '#f7f7f8',
          100: '#efeff1',
          200: '#e2e2e6',
          800: '#202125',
          900: '#131417',
        },
        ink: {
          900: '#0f1115',
          700: '#2a2d34',
        },
        ui: {
          text: '#0f172a',
          muted: '#475569',
          textDark: '#f1f5f9',
          mutedDark: '#cbd5e1',
        },
        accent: {
          500: '#1e3a8a',
          600: '#1e293b',
        },
      },
      boxShadow: {
        card: '0 10px 24px rgba(0,0,0,0.08)',
        dock: '0 12px 24px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [],
};
