/** @type {import('tailwindcss').Config} */
export default {
  // CRITICAL: Ensure Tailwind scans all files in src/ for utility classes (.js, .jsx, .ts, .tsx)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define your primary font family
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // You can define custom colors here if needed
    },
  },
  plugins: [],
}