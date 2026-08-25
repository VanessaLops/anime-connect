
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
        "holo-gold": "#FFE81F", // dourado do crawl/branding, tema galáxia
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "conic-gradient(from 180deg at 50% 50%, #FF0080 0deg, #7928CA 55%, #00FFFF 120deg)",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        display: ["Orbitron", "system-ui", "sans-serif"], // carregada via @fontsource/orbitron
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "1" },
        },
        crawl: {
          "0%": { transform: "rotateX(35deg) translateZ(0) translateY(0%)", opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "rotateX(35deg) translateZ(-600px) translateY(-130%)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        crawl: "crawl 22s linear infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;