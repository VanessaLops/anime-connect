interface OrnamentProps {
  className?: string;
}

/** Divisor ─◆─ dourado, usado embaixo de títulos. Decorativo. */
export default function Ornament({ className = "" }: OrnamentProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-hex-gold md:w-24" />
      <span className="h-2 w-2 rotate-45 border border-hex-gold bg-hex-navy" />
      <span className="h-1.5 w-1.5 rotate-45 bg-hex-gold" />
      <span className="h-2 w-2 rotate-45 border border-hex-gold bg-hex-navy" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-hex-gold md:w-24" />
    </div>
  );
}
