module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'c-blue': '#314768',
        'c-yellow': '#F4B000',
        'c-green': '#61A825',
        'c-light': '#BACBE3',
        'c-black': '#1D2A39',
        'c-red': '#C3222D',
      },
      fontFamily: {
        // 'baloo': ['baloo', 'sans-serif'],
      },
      maxWidth: {
        '87.5': '21.875rem'
      },
      height: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}