// tailwind.config.js
module.exports = {
  darkMode: 'class', // 👈 essentiel pour fonctionner avec next-themes
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
