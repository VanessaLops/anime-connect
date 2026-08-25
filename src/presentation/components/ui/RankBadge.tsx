interface RankBadgeProps {
  label: string;
  active?: boolean;
}

export default function RankBadge({ label, active = false }: RankBadgeProps) {
  return (
    <span
      className={
        active
          ? "rounded-full border border-holo-gold/50 bg-holo-gold/10 px-4 py-2 font-display text-sm text-holo-gold"
          : "rounded-full border border-white/10 bg-white/5 px-4 py-2 font-display text-sm text-gray-500"
      }
    >
      {label}
    </span>
  );
}
