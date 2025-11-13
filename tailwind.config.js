/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './public/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          primary: '#137e96',
          'primary-active': '#83c2d0',
        },
      },
    },
  },
  plugins: [],
};

