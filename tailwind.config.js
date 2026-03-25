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
        // Optional: add custom fonts
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
