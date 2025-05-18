/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['dark', 'warm'],
      textColor: ['dark', 'warm'],
      borderColor: ['dark', 'warm'],
    },
  },
};