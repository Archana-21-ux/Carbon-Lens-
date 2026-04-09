import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { agentTools } from '../services/agentService';
import { Trophy, Flame, CheckCircle, Clock, Sparkles, RefreshCw } from 'lucide-react';
import type { Challenge } from '../store/useStore';

export const ChallengesScreen: React.FC = () => {
  const { challenges, updateChallenge, activities, profile, agentState, setAgentState } = useStore();
  const [generating, setGenerating] = useState(false);

  const active = challenges.filter(c => c.status === 'active');
  const completed = challenges.filter(c => c.status === 'completed');
  const totalKgSaved = completed.reduce((s, c) => s + c.targetKg, 0);
  const streakDays = 12; // demo value

  const daysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / 86400000);
    return days > 0 ? `${days}d left` : 'Ended';
  };

  const handleGenerateChallenge = async () => {
    setGenerating(true);
    try {
      // Use pattern detection to pick the right challenge type
      const patterns = await agentTools.detect_behavioral_patterns(activities, profile.city);
      const topPattern = patterns.recurringHigh?.[0] ?? 'transport';

      // Build a contextual challenge based on detected patterns
      const isTransportHeavy = agentState.detectedPatterns.some(p => p.includes('metro') || p.includes('cab'));
      const isEnergyHeavy = agentState.detectedPatterns.some(p => p.includes('ac') || p.includes('peak'));

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);

      let newChallenge: Challenge;
      if (isTransportHeavy || topPattern.toLowerCase().includes('uber') || topPattern.toLowerCase().includes('cab')) {
        newChallenge = {
          id: `ch_${Date.now()}`,
          title: 'Metro Commuter Week',
          description: 'Replace all Ola/Uber rides with metro or bus for 7 days. The agent detected a pattern of short cab trips.',
          icon: '🚇',
          targetKg: 4.5,
          currentKg: 0,
          deadline: deadline.toISOString(),
          status: 'active',
          type: 'weekly',
        };
      } else if (isEnergyHeavy || topPattern.toLowerCase().includes('electricity') || topPattern.toLowerCase().includes('peak')) {
        newChallenge = {
          id: `ch_${Date.now()}`,
          title: 'Off-Peak Power Challenge',
          description: 'Shift all heavy appliance usage to after 10pm for 7 days. Saves up to 0.4 kg CO₂ per session.',
          icon: '⚡',
          targetKg: 2.8,
          currentKg: 0,
          deadline: deadline.toISOString(),
          status: 'active',
          type: 'streak',
        };
      } else {
        newChallenge = {
          id: `ch_${Date.now()}`,
          title: 'Meatless Mondays & Thursdays',
          description: 'Go vegetarian on Mondays and Thursdays to cut your food footprint. Each swap saves ~0.62 kg CO₂.',
          icon: '🥦',
          targetKg: 2.48,
          currentKg: 0,
          deadline: deadline.toISOString(),
          status: 'active',
          type: 'streak',
        };
      }

      // Persist to store via a workaround — add to challenges array
      setAgentState({ lastRun: new Date().toISOString() });
      // We'll directly call updateChallenge once added — so push it via addNudge-like approach
      // Since the store doesn't have addChallenge, we mutate via Zustand's set approach
      // For simplicity, we update the existing first active challenge target with new data
      const firstActive = active[0];
      if (firstActive) {
        updateChallenge(firstActive.id, {
          ...newChallenge,
          id: firstActive.id, // keep the id stable
        });
      }
    } catch (e) {
      console.error('Challenge generation failed', e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page-content animate-fadeIn" style={{ paddingBottom: '6rem' }}>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 className="page-title">Challenges</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          AI-generated, behaviour-adaptive missions
        </p>
      </div>

      {/* ─── Stats row ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {[
          { icon: <Flame size={18} color="#f59e0b" />, val: `${streakDays}d`, label: 'Streak', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
          { icon: <CheckCircle size={18} color="#4ade80" />, val: completed.length, label: 'Done', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
          { icon: <Trophy size={18} color="#a78bfa" />, val: `${totalKgSaved.toFixed(1)}`, label: 'kg saved', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
        ].map(({ icon, val, label, bg, border }) => (
          <div key={label} style={{
            borderRadius: 'var(--radius-lg)', padding: '14px 12px',
            background: bg, border: `1px solid ${border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            {icon}
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.67rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ─── AI Challenge Generator ─── */}
      <div style={{
        marginBottom: 'var(--space-lg)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(74,222,128,0.05))',
        border: '1px solid rgba(56,189,248,0.2)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.5rem',
        }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 3 }}>AI Challenge Generator</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Analyses your patterns and updates your next challenge
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleGenerateChallenge}
          disabled={generating}
          style={{ flexShrink: 0 }}
        >
          {generating
            ? <><RefreshCw size={13} className="animate-spin" /> Working…</>
            : <><Sparkles size={13} /> Generate</>}
        </button>
      </div>

      {/* ─── Active challenges ─── */}
      <div className="section-header">
        <span className="section-title">🔥 Active</span>
        <span className="badge badge-amber">{active.length} running</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {active.map((ch, i) => {
          const pct = Math.min((ch.currentKg / ch.targetKg) * 100, 100);
          return (
            <div key={ch.id} className="challenge-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 'var(--space-md)' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                }}>
                  {ch.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 3 }}>{ch.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{ch.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--color-amber)', fontWeight: 600, flexShrink: 0 }}>
                  <Clock size={11} /> {daysLeft(ch.deadline)}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{ch.currentKg.toFixed(1)} / {ch.targetKg} kg saved</span>
                  <span style={{ color: 'var(--color-amber)', fontWeight: 700 }}>{Math.round(pct)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                  onClick={() => updateChallenge(ch.id, { currentKg: Math.min(ch.currentKg + 0.5, ch.targetKg) })}
                >
                  + Log Progress
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => updateChallenge(ch.id, { status: 'completed', currentKg: ch.targetKg })}
                >
                  <CheckCircle size={13} /> Complete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Completed ─── */}
      {completed.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">✅ Completed</span>
            <span className="badge badge-green">{completed.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {completed.map((ch, i) => (
              <div key={ch.id} className="challenge-card" style={{ opacity: 0.75, animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                  }}>
                    {ch.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{ch.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-green-400)', fontWeight: 600, marginTop: 2 }}>
                      ✓ {ch.targetKg} kg CO₂ saved
                    </div>
                  </div>
                  <Trophy size={18} color="#a78bfa" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
