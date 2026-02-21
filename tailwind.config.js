/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [
    require('@tolle_/tolle-ui/preset') // Point to your library preset
  ],
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@tolle_/tolle-ui/**/*.{html,ts,mjs,html}"
  ],
  plugins: [],
};