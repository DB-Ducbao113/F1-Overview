/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#ff1801',
          dark: '#0a0a0c',
          card: '#121216',
          border: '#22222a',
          cyan: '#00f0ff',
          amber: '#f59e0b',
          muted: '#8e8e9f',
        }
      },
      fontFamily: {
        f1: ['"Titillium Web"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
