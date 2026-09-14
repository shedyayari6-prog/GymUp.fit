/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15161A',
        graphite: '#232429',
        steel: '#3A3B42',
        chalk: '#EDEEF0',
        chalkdim: '#B9BBC3',
        brass: '#B08D3E',
        brasslight: '#D4AF60',
        rust: '#9A3324',
        good: '#3F7D5C'
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
}
