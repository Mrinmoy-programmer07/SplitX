/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        splitx: {
          background: '#0B0D17', // Deep nice dark background
          card: '#151925',
          primary: '#00F0FF',     // Neon cyan accent matching a crypto vibe
          secondary: '#7000FF',
          text: '#E2E8F0',
        }
      }
    },
  },
  plugins: [],
}
