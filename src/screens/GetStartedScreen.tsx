import React, { useState } from 'react';

interface GetStartedScreenProps {
  onStart: (name: string) => void;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const canProceed = name.trim().length >= 2;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-surface) 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Decorative bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '-20%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(133,79,108,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-15%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(82,43,91,0.1) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 28px', position: 'relative', zIndex: 1 }}>
        {/* Logo mark */}
        <div className="animate-fadeInUp" style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #522B5B, #854F6C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(133,79,108,0.4)',
          }}>
            <svg width={38} height={38} viewBox="0 0 52 52" fill="none">
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
            fontSize: '2.2rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Carbon Lens
          </h1>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 4,
            fontWeight: 500,
          }}>
            Track · Reflect · Reduce
          </p>
        </div>

        {/* Welcome text */}
        <div className="animate-fadeInUp delay-1" style={{ marginBottom: 36, textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.55rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 10,
            lineHeight: 1.3,
          }}>
            Welcome to your<br />
            <span style={{
              background: 'linear-gradient(90deg, #854F6C, #DFB6B2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              carbon journey
            </span>
          </h2>
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            maxWidth: 280,
            margin: '0 auto',
          }}>
            See the patterns in your daily choices and shift habits that matter for the planet.
          </p>
        </div>

        {/* Name input */}
        <div className="animate-fadeInUp delay-2" style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            What should we call you?
          </label>
          <input
            className="input"
            type="text"
            placeholder="Enter your name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && canProceed && onStart(name.trim())}
            maxLength={30}
            style={{
              fontSize: '1.05rem',
              padding: '14px 18px',
              borderColor: focused ? 'var(--color-accent)' : 'var(--color-border)',
              boxShadow: focused ? '0 0 0 3px rgba(133,79,108,0.12)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Playfair Display', serif",
            }}
            autoFocus
          />
        </div>

        {/* CTA */}
        <div className="animate-fadeInUp delay-3">
          <button
            className="btn btn-primary btn-lg btn-full"
            disabled={!canProceed}
            onClick={() => canProceed && onStart(name.trim())}
            style={{
              opacity: canProceed ? 1 : 0.4,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            {canProceed ? `Let's go, ${name.trim()} →` : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="animate-fadeIn delay-4" style={{ padding: '0 28px 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: '0.82rem',
          color: 'rgba(133,79,108,0.7)',
        }}>
          "See the patterns, shift the habit."
        </p>
      </div>
    </div>
  );
};
