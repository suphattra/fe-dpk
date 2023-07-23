/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        'regal-blue-900': '#243c5a',
      },
      gridAutoColumns: {
        '2fr': 'minmax(0, 2fr)',
      },
      gap: {
        '11': '8.5rem',
      },
      zIndex: {
        '1': '1',
        '2100': '2100',
        '10000': '10000'
      },
      fontFamily: {
        sans: ['Sarabun', "sans-serif"],
        // sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      width: {
        '128': '32rem',
      },
      container: {
        padding: '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
