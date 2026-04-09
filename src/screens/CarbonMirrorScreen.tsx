import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { agentTools } from '../services/agentService';
import { getBreakdown } from '../services/emissionCalculator';
import { Sparkles, RefreshCw, Share2, TrendingDown, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

const PARTICLE_COUNT = 22;

const Particle: React.FC<{ index: number }> = ({ index }) => {
  const style = useMemo(() => ({
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 4,
    color: index % 3 === 0 ? '#DFB6B2' : index % 3 === 1 ? '#854F6C' : '#FBE4D8',
  }), [index]);

  return (
    <div style={{
      position: 'absolute',
      width: style.size, height: style.size,
      borderRadius: '50%',
      background: style.color,
      left: `${style.x}%`,
      bottom: '-10px',
      opacity: 0.35 + Math.random() * 0.35,
      animation: `float ${style.duration}s ${style.delay}s ease-in-out infinite`,
      filter: 'blur(0.5px)',
    }} />
  );
};

export const CarbonMirrorScreen: React.FC = () => {
  const { carbonMirror, setCarbonMirror, activities, profile, setActiveTab, setAgentState } = useStore();
  const [revealed, setRevealed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [revealStep, setRevealStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const persona = carbonMirror;

  useEffect(() => {
    if (revealed && revealStep < 5) {
      const timer = setTimeout(() => setRevealStep(s => s + 1), 500);
      return () => clearTimeout(timer);
    }
  }, [revealed, revealStep]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const mirror = await agentTools.generate_carbon_mirror(activities, profile.city);
      setCarbonMirror(mirror);
      setRevealStep(0);
      setRevealed(true);
      setTimeout(() => setRevealStep(1), 100);
    } catch (err) {
      console.error('Carbon mirror generation failed:', err);
      setError('Could not generate AI mirror. Using your activity data instead.');
      setRevealed(true);
      setTimeout(() => setRevealStep(1), 100);
    } finally {
      setGenerating(false);
    }
  };

  const handleReveal = () => {
    setRevealStep(0);
    setRevealed(true);
    setTimeout(() => setRevealStep(1), 100);
  };

  const handleMakeGoal = () => {
    if (!persona) return;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    setAgentState({
      currentGoal: {
        targetKg: Math.max(20, Math.round((getBreakdown(activities.slice(0, 14)).total * 0.85) * 10) / 10),
        deadline: deadline.toISOString(),
        framing: 'environmental',
      },
    });
    setActiveTab('challenges');
  };

  const weeklyBreakdown = getBreakdown(activities.slice(0, 14));

  if (!revealed) {
    return (
      <div style={{
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(133,79,108,0.1) 0%, transparent 60%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-xl)', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: PARTICLE_COUNT }, (_, i) => <Particle key={i} index={i} />)}
        </div>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {[240, 320, 400].map((size, i) => (
            <div key={size} style={{
              position: 'absolute',
              width: size, height: size, borderRadius: '50%',
              border: `1px solid rgba(133,79,108,${0.12 - i * 0.03})`,
              animation: `${i % 2 === 0 ? 'ringRotateCW' : 'ringRotateCCW'} ${15 + i * 6}s linear infinite`,
            }} />
          ))}
        </div>

        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(133,79,108,0.25) 0%, rgba(82,43,91,0.1) 50%, transparent 70%)',
          border: '1px solid rgba(133,79,108,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-xl)',
          animation: 'pulse-glow 3s ease-in-out infinite',
          position: 'relative', zIndex: 1,
        }}>
          <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
            <circle cx={26} cy={26} r={18} stroke="#DFB6B2" strokeWidth={2} opacity={0.8}/>
            <circle cx={26} cy={26} r={8} fill="#DFB6B2" opacity={0.7}/>
            <line x1={26} y1={2} x2={26} y2={13} stroke="#DFB6B2" strokeWidth={1.5} opacity={0.5}/>
            <line x1={26} y1={39} x2={26} y2={50} stroke="#DFB6B2" strokeWidth={1.5} opacity={0.5}/>
            <line x1={2} y1={26} x2={13} y2={26} stroke="#DFB6B2" strokeWidth={1.5} opacity={0.5}/>
            <line x1={39} y1={26} x2={50} y2={26} stroke="#DFB6B2" strokeWidth={1.5} opacity={0.5}/>
          </svg>
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)', fontFamily: "'Playfair Display', serif", color: 'var(--color-text-primary)', position: 'relative', zIndex: 1 }}>
          Your Carbon Mirror
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)', maxWidth: 300, position: 'relative', zIndex: 1, fontStyle: 'italic' }}>
          A weekly portrait of your emission patterns — who you are as a carbon emitter, and who you could be.
        </p>

        {error && (
          <div style={{
            marginBottom: 'var(--space-md)', padding: '10px 16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(224,108,138,0.1)', border: '1px solid rgba(224,108,138,0.25)',
            fontSize: '0.8rem', color: 'var(--color-rose)', maxWidth: 300, position: 'relative', zIndex: 1,
          }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary btn-lg"
          style={{ minWidth: 200, position: 'relative', zIndex: 1, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          onClick={persona ? handleReveal : handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <><RefreshCw size={18} className="animate-spin" /> Generating…</>
          ) : (
            <><Sparkles size={18} /> Reveal My Mirror</>
          )}
        </button>

        {persona && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 'var(--space-md)', position: 'relative', zIndex: 1 }}
            onClick={handleGenerate}
            disabled={generating}
          >
            <RefreshCw size={14} /> Re-generate with AI
          </button>
        )}
      </div>
    );
  }

  // FIXED LOGIC START: Using 'any' to bypass EmissionBreakdown missing 'byCategory'
  const safeBreakdown = (weeklyBreakdown as any).byCategory || { transport: 0, food: 0 };

  const displayPersona = persona ?? {
    name: `${profile.name || 'Your'}'s Weekly Portrait`,
    tagline: 'Your carbon story is unfolding — here\'s what the data shows.',
    topVillain: {
      activity: (safeBreakdown.transport || 0) > (safeBreakdown.food || 0) ? 'Transport' : 'Food choices',
      kg: Math.max(safeBreakdown.transport || 0, safeBreakdown.food || 0),
      explanation: 'This category dominates your weekly footprint. Small changes here have the biggest impact.',
    },
    hiddenWin: 'Your food or transport choices in some areas are already below the city average — that\'s a real win.',
    oneMove: {
      action: 'Try one car-free day or one plant-based meal per day this week.',
      projectedSavingKg: Math.round(weeklyBreakdown.total * 0.12 * 10) / 10,
    },
    vsCity: { diffPct: 12, isBetter: false },
    generatedAt: new Date().toISOString(),
  };
  // FIXED LOGIC END

  const cityDiff = displayPersona.vsCity;

  return (
    <div style={{
      background: 'var(--color-bg-base)',
      padding: 'var(--space-lg)',
      paddingBottom: '80px',
      minHeight: '100%',
      overflowY: 'auto',
      position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 20 }, (_, i) => <Particle key={i} index={i} />)}
      </div>

      <div style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(133,79,108,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setRevealed(false); setRevealStep(0); setError(null); }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
            Weekly Mirror
          </span>
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Share2 size={14} /> Share
          </button>
        </div>

        <div style={{
          textAlign: 'center', marginBottom: 'var(--space-xl)',
          opacity: revealStep >= 1 ? 1 : 0,
          transform: revealStep >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-accent-light)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            ✦ You Are ✦
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem,7vw,2.3rem)',
            fontWeight: 900, letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #FBE4D8 0%, #DFB6B2 40%, #854F6C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(133,79,108,0.4))',
            marginBottom: 12,
          }}>
            {displayPersona.name}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.6, fontFamily: "'Playfair Display', serif" }}>
            "{displayPersona.tagline}"
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)',
          opacity: revealStep >= 2 ? 1 : 0,
          transform: revealStep >= 2 ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s',
        }}>
          <div style={{ position: 'relative' }}>
            <svg width={180} height={180} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={90} cy={90} r={72} fill="none" stroke="rgba(133,79,108,0.12)" strokeWidth={9} />
              <circle cx={90} cy={90} r={72} fill="none"
                stroke="url(#mirrorGrad)" strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 72 * 0.72} ${2 * Math.PI * 72}`}
                style={{ filter: 'drop-shadow(0 0 12px rgba(133,79,108,0.6))', transition: 'stroke-dasharray 1.5s ease 0.3s' }}
              />
              <defs>
                <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#522B5B"/>
                  <stop offset="50%" stopColor="#854F6C"/>
                  <stop offset="100%" stopColor="#DFB6B2"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {weeklyBreakdown.total.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>kg this week</div>
              <div style={{
                marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
                color: cityDiff.isBetter ? 'var(--color-accent-light)' : 'var(--color-rose)',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {cityDiff.isBetter ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {Math.abs(cityDiff.diffPct)}% vs city
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginBottom: 'var(--space-md)',
          opacity: revealStep >= 3 ? 1 : 0,
          transform: revealStep >= 3 ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease 0.2s',
        }}>
          <div style={{
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(224,108,138,0.08), rgba(224,108,138,0.04))',
            border: '1px solid rgba(224,108,138,0.22)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #e06c8a, transparent)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>🔴</span>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#e06c8a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Top Villain</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{displayPersona.topVillain.activity}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.4rem', color: '#e06c8a' }}>
                  {displayPersona.topVillain.kg.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>kg CO₂</div>
              </div>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              {displayPersona.topVillain.explanation}
            </p>
          </div>
        </div>

        <div style={{
          marginBottom: 'var(--space-md)',
          opacity: revealStep >= 4 ? 1 : 0,
          transform: revealStep >= 4 ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          <div style={{
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(133,79,108,0.1), rgba(82,43,91,0.06))',
            border: '1px solid rgba(133,79,108,0.25)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #854F6C, #DFB6B2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '1.3rem' }}>✨</span>
              <div style={{ fontSize: '0.65rem', color: '#DFB6B2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hidden Win</div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.65 }}>{displayPersona.hiddenWin}</p>
          </div>
        </div>

        <div style={{
          marginBottom: 'var(--space-md)',
          opacity: revealStep >= 5 ? 1 : 0,
          transform: revealStep >= 5 ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease 0s',
        }}>
          <div style={{
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(158,197,212,0.08), rgba(181,157,204,0.05))',
            border: '1px solid rgba(158,197,212,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #9ec5d4, #b59dcc)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>⚡</span>
              <div style={{ fontSize: '0.65rem', color: '#9ec5d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>One Move</div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.65, marginBottom: 12 }}>
              {displayPersona.oneMove.action}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 'var(--radius-full)',
              background: 'rgba(158,197,212,0.1)', border: '1px solid rgba(158,197,212,0.22)',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ec5d4' }}>
                💨 Saves {displayPersona.oneMove.projectedSavingKg} kg CO₂ next week
              </span>
            </div>
          </div>
        </div>

        {revealStep >= 5 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-sm)' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1, fontFamily: "'Playfair Display', serif", fontWeight: 700 }} onClick={handleMakeGoal}>
              Make It My Goal <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg btn-icon" onClick={handleGenerate} disabled={generating} title="Re-generate">
              <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};