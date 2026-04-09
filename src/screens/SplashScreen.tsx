import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 2.5,
  duration: 3 + Math.random() * 2,
  color: i % 3 === 0 ? '#DFB6B2' : i % 3 === 1 ? '#854F6C' : '#FBE4D8',
}));

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 200);
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    const t3 = setTimeout(() => onDone(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="splash-screen"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.7s ease' : 'none',
      }}
    >
      {/* Animated background rings */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {[280, 380, 490].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(133,79,108,${0.18 - i * 0.04})`,
            animation: `${i % 2 === 0 ? 'ringRotateCW' : 'ringRotateCCW'} ${12 + i * 5}s linear infinite`,
          }} />
        ))}
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(133,79,108,0.35) 0%, rgba(82,43,91,0.15) 50%, transparent 70%)',
          animation: 'orbPulse 3s ease-in-out infinite',
        }} />
      </div>

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            bottom: '-10%',
            left: `${p.x}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0,
            animation: `particleAscend ${p.duration}s ${p.delay}s ease-out infinite`,
            filter: 'blur(0.5px)',
          }} />
        ))}
      </div>

      {/* Main logo / brand */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 0,
        opacity: phase === 'enter' ? 0 : 1,
        animation: phase !== 'enter' ? 'splashExpand 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
      }}>
        {/* Lens icon */}
        <div style={{
          width: 96, height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #522B5B 0%, #854F6C 60%, #DFB6B2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(133,79,108,0.6), 0 0 120px rgba(82,43,91,0.3)',
          marginBottom: 20,
          position: 'relative',
        }}>
          {/* Lens crosshair */}
          <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
            <circle cx={26} cy={26} r={18} stroke="#FBE4D8" strokeWidth={2.5} opacity={0.9}/>
            <circle cx={26} cy={26} r={8} fill="#FBE4D8" opacity={0.85}/>
            <line x1={26} y1={2} x2={26} y2={14} stroke="#FBE4D8" strokeWidth={2} opacity={0.6}/>
            <line x1={26} y1={38} x2={26} y2={50} stroke="#FBE4D8" strokeWidth={2} opacity={0.6}/>
            <line x1={2} y1={26} x2={14} y2={26} stroke="#FBE4D8" strokeWidth={2} opacity={0.6}/>
            <line x1={38} y1={26} x2={50} y2={26} stroke="#FBE4D8" strokeWidth={2} opacity={0.6}/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.6rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#FBE4D8',
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: 6,
          textShadow: '0 0 40px rgba(133,79,108,0.7)',
        }}>
          Carbon Lens
        </h1>

        <div style={{
          opacity: phase === 'show' ? 1 : 0,
          animation: phase === 'show' ? 'splashTagline 0.7s 0.4s ease both' : 'none',
          textAlign: 'center',
          marginTop: 4,
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.82rem',
            fontWeight: 400,
            color: '#DFB6B2',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            Track · Reflect · Reduce
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: 'rgba(251, 228, 216, 0.55)',
            marginTop: 6,
          }}>
            See the patterns, shift the habit.
          </p>
        </div>
      </div>

      {/* Bottom loading bar */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 2,
        background: 'rgba(133,79,108,0.2)',
        borderRadius: 1,
        overflow: 'hidden',
        opacity: phase !== 'enter' ? 1 : 0,
        transition: 'opacity 0.5s 0.3s',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #522B5B, #854F6C, #DFB6B2)',
          borderRadius: 1,
          animation: 'shimmer 1.8s ease-in-out infinite',
          width: '60%',
        }} />
      </div>
    </div>
  );
};
