import React, { useEffect, useRef } from 'react';

interface EmissionRingProps {
  value: number;        // current kg
  max: number;          // weekly target/max
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  children?: React.ReactNode;
}

export const EmissionRing: React.FC<EmissionRingProps> = ({
  value,
  max,
  size = 180,
  strokeWidth = 14,
  animate = true,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;

  // Color based on percentage
  const getColor = () => {
    if (pct < 0.5) return '#4ade80';
    if (pct < 0.75) return '#fbbf24';
    return '#f43f5e';
  };

  const getGlow = () => {
    if (pct < 0.5) return 'rgba(74, 222, 128, 0.4)';
    if (pct < 0.75) return 'rgba(251, 191, 36, 0.4)';
    return 'rgba(244, 63, 94, 0.4)';
  };

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    circleRef.current.style.strokeDashoffset = `${circumference}`;
    const timer = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [offset, circumference, animate]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute',
        inset: -8,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${getGlow()} 0%, transparent 70%)`,
        opacity: 0.6,
        animation: 'pulse-glow 3s ease-in-out infinite',
      }} />
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={{
            filter: `drop-shadow(0 0 8px ${getColor()})`,
          }}
        />
      </svg>
      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );
};
