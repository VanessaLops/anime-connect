import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-anime-cyan/40">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-anime-cyan/10 blur-2xl transition group-hover:bg-anime-cyan/20" />
      <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-anime-cyan/10 text-anime-cyan">
        {icon}
      </div>
      <h3 className="relative mb-2 font-display text-lg font-bold text-white">{title}</h3>
      <p className="relative text-sm text-gray-400">{description}</p>
    </div>
  );
}
