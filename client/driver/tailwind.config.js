/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'driver-dark': '#1a1d21', // Darker theme for driver app (easier on eyes at night)
        'driver-accent': '#3b82f6', // Blue for "Action"
      },
      animation: {
        'scan-line': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(250px)' },
        }
      }
    },
  },
  plugins: [],
}