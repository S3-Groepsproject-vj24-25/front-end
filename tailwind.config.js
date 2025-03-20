/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      colors: {
        'text': '#050315',
        'background': '#fbfbfe',
        'primary': '#880D1E',
        'secondary': '#F39379',
        'accent': '#FFCE3C',
       },
    },
  },
  plugins: [],
}

