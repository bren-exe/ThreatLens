/** Decorative animated cybersecurity background: grid + scanning line + network nodes. */
export function CyberBackground() {
  const nodes = [
    { x: '12%', y: '18%', d: '0s' },
    { x: '78%', y: '12%', d: '0.4s' },
    { x: '42%', y: '30%', d: '0.9s' },
    { x: '88%', y: '44%', d: '1.3s' },
    { x: '22%', y: '62%', d: '0.6s' },
    { x: '62%', y: '72%', d: '1.1s' },
    { x: '34%', y: '84%', d: '0.2s' },
    { x: '8%', y: '48%', d: '1.5s' },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 grid-bg-anim opacity-30" />
      {/* radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_0%,transparent,rgba(5,8,22,0.6))]" />
      {/* network nodes */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="node-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.25)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.0)" />
          </linearGradient>
        </defs>
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <line
              key={i}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#node-line)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyber-cyan/70 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ left: n.x, top: n.y, animation: `pulse-ring 2.4s ease-out ${n.d} infinite` }}
        />
      ))}
      {/* scanning line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent animate-scan-line" />
    </div>
  );
}
