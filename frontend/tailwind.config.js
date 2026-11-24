/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moz: {
          green: "#007A3D",
          yellow: "#FCD116",
          red: "#CE1126",
          dark: "#1A202C"
        }
      }
    },
  },
  plugins: [],
}
