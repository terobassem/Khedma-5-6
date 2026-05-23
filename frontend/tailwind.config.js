/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'Tahoma', 'sans-serif'] },
      colors: {
        primary: { 50: '#fef3e2', 100: '#fde4b8', 200: '#fbcf7a', 300: '#f9b84d', 400: '#f59e0b', 500: '#e88b00', 600: '#cc6f00', 700: '#a35400', 800: '#7a3f00', 900: '#522a00' },
        church: { purple: '#7c3aed', pink: '#ec4899', blue: '#3b82f6', green: '#10b981', yellow: '#fbbf24' },
      },
      animation: { float: 'float 3s ease-in-out infinite', bounceSlow: 'bounce 2s infinite' },
      keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
    },
  },
  plugins: [],
};
