/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Vamos adicionar suas cores personalizadas aqui
      colors: {
        'ocean-light': '#87CEEB', // Céu
        'ocean-deep': '#00BFFF',  // Mar
        'sand': '#F4A460',        // Areia
        'sun': '#FFD700',         // Sol
      },
      fontFamily: {
        'hand': ['cursive'], // Fonte estilo "carta"
      }
    },
  },
  plugins: [],
}