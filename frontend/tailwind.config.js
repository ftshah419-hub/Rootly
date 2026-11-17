/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F0E3',
          card: '#FFFDF8',
          hover: '#EFE7D5',
        },
        olive: {
          50: '#F4F6F2',
          100: '#E4E9E0',
          600: '#4F6644',
          700: '#3E5035', // Primary brand olive
          800: '#2E3B27',
          900: '#1F271A',
        },
        terracotta: {
          DEFAULT: '#C8754D',
          hover: '#B5643E',
          light: '#F8ECE6',
        },
        bark: '#282B24',
        earth: '#795640',
        sand: '#E9D8B9',
        sage: '#A5AD91',
        darkbg: '#282B24',
        darkcard: '#34382F',
        darkborder: '#464C3F',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        malayalam: ['"Gayathri"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 20px 40px -15px rgba(62, 80, 53, 0.08), 0 0 15px 0 rgba(200, 117, 77, 0.04)',
        'warm-lg': '0 25px 50px -12px rgba(41, 46, 39, 0.15)',
      }
    },
  },
  plugins: [],
}
