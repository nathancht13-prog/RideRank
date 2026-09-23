type SpeedDialProps = {
  value: number;
  max?: number;
  unit?: string;
  className?: string;
};

export function SpeedDial({ value, max = 100, unit = 'km/h', className = 'w-56 h-56' }: SpeedDialProps) {
  const tickCount = 40;
  const ratio = Math.min(Math.max(value / max, 0), 1);
  const litCount = Math.round(ratio * tickCount);

  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {Array.from({ length: tickCount }, (_, i) => (
          <line
            key={i}
            x1="100" y1="14" x2="100" y2="26"
            stroke={i < litCount ? '#ff5b1a' : 'rgba(255,255,255,0.15)'}
            strokeWidth="3" strokeLinecap="round"
            transform={`rotate(${(i / tickCount) * 360} 100 100)`}
            style={{ transition: 'stroke 0.2s ease' }}
          />
        ))}
      </svg>
      <div className="text-center">
        <div className="text-7xl font-bold leading-none">{Math.round(value)}</div>
        <div className="text-primary font-bold tracking-widest mt-1">{unit}</div>
      </div>
    </div>
  );
}
