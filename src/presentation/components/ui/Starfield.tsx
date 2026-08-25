const STAR_COUNT = 140;
const STAR_SEED = 1337;

interface Star {
  top: number;
  left: number;
  size: number;
  delay: number;
}

// PRNG determinístico (mesma saída no server e no client) — gerar posição
// com Math.random() aqui quebraria a hidratação do Next.
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count: number, seed: number): Star[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    top: random() * 100,
    left: random() * 100,
    size: random() < 0.85 ? 1 : 2,
    delay: random() * 3,
  }));
}

interface StarfieldProps {
  seed?: number;
}

// Campo de estrelas decorativo. Sem estado, sem efeito — Server Component.
// `seed` diferente por seção evita repetir o mesmo padrão em toda a página.
export default function Starfield({ seed = STAR_SEED }: StarfieldProps) {
  const stars = generateStars(STAR_COUNT, seed);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
