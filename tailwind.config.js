/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#7c3aed',
        'neon-cyan':   '#00d4ff',
        'neon-pink':   '#ff006e',
        'dark-bg':     '#0a0a0f',
        'dark-card':   '#12121a',
        'dark-border': '#1e1e2e',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter':    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(124, 58, 237, 0.5)',
        'neon-cyan':   '0 0 20px rgba(0, 212, 255, 0.5)',
        'neon-pink':   '0 0 20px rgba(255, 0, 110, 0.5)',
      },
    },
  },
  plugins: [],
}

