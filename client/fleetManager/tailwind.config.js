/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#A0522D', // Your specific brown color
        'brand-dark': '#252b31',  // Your specific dark color
      }
    },
  },
  plugins: [],
}