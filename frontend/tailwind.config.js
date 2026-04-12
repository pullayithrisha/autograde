/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0B0F19',
        card: '#111827',
        border: '#1F2937',
        foreground: '#F9FAFB',
        muted: '#9CA3AF',
        primary: {
          DEFAULT: '#1C4D8D', // Corporate Blue
          hover: '#0F2854', // Deep Navy
        }
      }
    },
  },
  plugins: [],
}
