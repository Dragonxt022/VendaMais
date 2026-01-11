/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'food-light': '#fff7ed',
        'food-orange': '#f97316',
        'food-dark': '#9a3412',
      }
    },
  },
  plugins: [],
}

