/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        flight:["flight"]
      },
      colors:{
        "c1":"var(--c1)"
      }
    },
  },
  plugins: [],
}

