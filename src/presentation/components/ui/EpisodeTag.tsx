import type { ReactNode } from "react";

interface EpisodeTagProps {
  children: ReactNode;
}

export default function EpisodeTag({ children }: EpisodeTagProps) {
  return (
    <p className="mb-3 font-display text-xs tracking-[0.3em] text-holo-gold">{children}</p>
  );
}
