/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kodchasan: ["Kodchasan", "sans-serif"], // Ajout de la police
      },
    },
  },
  plugins: [],
}

