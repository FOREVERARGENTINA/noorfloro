/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores de marca NOORFLORO
        'noorfloro': {
          'orange': '#FA8F01',      // Naranja principal
          'orange-light': '#FF8C61', // Naranja claro
          'orange-dark': '#E85A2B',  // Naranja oscuro
          'black': '#1A1A1A',        // Negro
          'gray-dark': '#2D2D2D',    // Gris oscuro
        },
      },
    },
  },
  plugins: [],
}
