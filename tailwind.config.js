
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505", // Preto quase absoluto
        surface: "#121212",    // Cinza para cards
        "anime-pink": "#FF0080",
        "anime-purple": "#7928CA",
        "anime-cyan": "#00FFFF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "conic-gradient(from 180deg at 50% 50%, #FF0080 0deg, #7928CA 55%, #00FFFF 120deg)",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-orbitron)'], // Vamos carregar essa fonte
      },
    },
  },
  plugins: [],
};
export default config;