/** @format */

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      Poppins: ['Poppins', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
