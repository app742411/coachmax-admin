/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#172C53",    // Dark Blue
        secondary: "#3ACBFA",  // Light Blue
        danger: "#D02030",     // Red
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        raleway: ['Arial', 'sans-serif'],
        roboto: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
