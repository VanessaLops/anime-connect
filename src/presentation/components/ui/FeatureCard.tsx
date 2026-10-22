import type { ReactNode } from "react";
import HexFrame from "@/presentation/components/ui/HexFrame";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <HexFrame as="li" className="group p-6 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(10,200,185,0.35)]">
      {/* ícone num losango, como os slots de runa */}
      <div className="mb-5 ml-2 mt-2 flex h-10 w-10 rotate-45 items-center justify-center border border-hex-gold/60 bg-hex-navy transition-colors group-hover:border-hex-blue">
        <span className="-rotate-45 text-hex-blue">{icon}</span>
      </div>
      <h3 className="mb-2 font-display text-lg font-bold uppercase tracking-wide text-hex-gold-light">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-hex-gold-light/60">{description}</p>
    </HexFrame>
  );
}
