/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {

      backgroundImage : {
        "open-menu": "url('/assets/line-3-svgrepo-com.svg')",
        "close-menu": "url('/assets/iconx-icon.svg')"
      }

    },
  },
  plugins: [],
}

