/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ocean-light': '#87CEEB', // Céu
        'ocean-deep': '#00BFFF',  // Mar
        'sand': '#F4A460',        // Areia
        'sun': '#FFD700',         // Sol
      },
    },
  },
  plugins: [],
}