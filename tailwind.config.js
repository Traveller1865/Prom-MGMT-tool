/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js",
    "./node_modules/flowbite/**/*.js"  // Add Flowbite's JavaScript files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')  // Add Flowbite plugin
  ],
}
