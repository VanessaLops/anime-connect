
// Cores da marca — reaproveitadas em `colors` e nos keyframes abaixo.
const BRAND = {
  pink: "#FF0080",
  purple: "#7928CA",
  cyan: "#00FFFF",
  gold: "#FFE81F", // amarelo do crawl de Star Wars
};

// Paleta "hextech": dourado envelhecido sobre azul-marinho, no clima de
// cliente de jogo (LoL). É a base da landing; BRAND fica pros acentos.
const HEX = {
  gold: "#C8AA6E",
  "gold-light": "#F0E6D2",
  "gold-dark": "#785A28",
  blue: "#0AC8B9",
  navy: "#010A13",
  panel: "#091428",
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: HEX.navy,
        surface: HEX.panel,
        hex: HEX,
        "anime-pink": BRAND.pink,
        "anime-purple": BRAND.purple,
        "anime-cyan": BRAND.cyan,
        "holo-gold": BRAND.gold,
        "sw-blue": "#4BD5EE", // "Há muito tempo, numa galáxia…"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        // variáveis definidas via next/font em src/app/layout.tsx
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "1" },
        },
        // Anda ao longo do plano inclinado: subir = afastar no fundo.
        crawl: {
          "0%": { transform: "rotateX(24deg) translateY(0)" },
          "100%": { transform: "rotateX(24deg) translateY(-175%)" },
        },
        // Abertura: a frase azul acende e depois recua pra dar lugar ao logo.
        intro: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "30%, 70%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0.55", transform: "translateY(0)" },
        },
        "logo-in": {
          "0%": { opacity: "0", transform: "scale(1.35)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        "planet-rise": {
          "0%": { opacity: "0", transform: "translateY(14%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "nebula-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(4%, -3%) scale(1.08)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Powers Angel/Devil: a asa sobe rápido (até 35%) e desce devagar.
        // Pose de repouso igual à de AngelWings.tsx (±14deg).
        "wing-left": {
          "0%, 100%": { transform: "rotate(-14deg)" },
          "35%": { transform: "rotate(10deg)" },
        },
        "wing-right": {
          "0%, 100%": { transform: "rotate(14deg)" },
          "35%": { transform: "rotate(-10deg)" },
        },
        "halo-float": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.75" },
          "50%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "mascot-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(calc(var(--power-size, 48px) * -0.06))" },
        },
        "mascot-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(0.1)" },
        },
        // Powers de nome: mesma paleta de 6 cores do Namegrad do app.
        namegrad: {
          "0%, 100%": { color: BRAND.pink },
          "16.6%": { color: "#F79D00" },
          "33.3%": { color: BRAND.gold },
          "50%": { color: "#14A37F" },
          "66.6%": { color: BRAND.cyan },
          "83.3%": { color: BRAND.purple },
        },
        namewave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.18em)" },
        },
        nameglow: {
          "0%, 100%": { textShadow: "0 0 4px rgba(255,255,255,0.35)" },
          "50%": { textShadow: "0 0 14px rgba(255,255,255,0.9)" },
        },
        // Ver BANDS_SIZE em Planet.tsx: andar 100% fecha o loop.
        "planet-spin": {
          "0%": { backgroundPosition: "0% 0" },
          "100%": { backgroundPosition: "100% 0" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        crawl: "crawl 48s linear infinite",
        intro: "intro 3.2s ease-out both",
        "logo-in": "logo-in 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "planet-rise": "planet-rise 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "nebula-drift": "nebula-drift 26s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        // ciclo completo = abrir (--flap-ms) + fechar (~2x mais lento)
        "wing-left": "wing-left calc(var(--flap-ms, 700ms) * 3) ease-in-out infinite",
        "wing-right": "wing-right calc(var(--flap-ms, 700ms) * 3) ease-in-out infinite",
        "halo-float": "halo-float 3s ease-in-out infinite",
        "mascot-bob": "mascot-bob 2.6s ease-in-out infinite",
        "mascot-breathe": "mascot-breathe 3.4s ease-in-out infinite",
        blink: "blink 4.2s ease-in-out infinite",
        namegrad: "namegrad 780ms steps(6) infinite",
        namewave: "namewave 1040ms ease-in-out infinite",
        nameglow: "nameglow 2s ease-in-out infinite",
        "planet-spin": "planet-spin 60s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;