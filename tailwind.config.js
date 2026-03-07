/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatBackground: '#313338', // Discord Grey
        chatInput: '#383a40',
        chatText: '#dbdee1'
      }
    },
  },
  plugins: [],
}
