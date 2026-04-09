import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { NudgeCard } from '../components/NudgeCard';
import { User, Bell, Zap, ChevronRight, TreePine, Trophy, RotateCcw, Car, Utensils } from 'lucide-react';

type Section = 'profile' | 'nudges' | 'agent';

export const MoreScreen: React.FC = () => {
  const { profile, setProfile, nudges, agentState, setActiveTab } = useStore();
  const [section, setSection] = useState<Section>('profile');

  const respondedNudges = nudges.filter(n => n.response !== 'pending');
  const ignoredCount = nudges.filter(n => n.response === 'ignored').length;
  const acceptedCount = nudges.filter(n => n.response === 'accepted' || n.response === 'completed').length;

  const handleReset = () => {
    if (window.confirm('Reset your profile and start onboarding again?')) {
      setProfile({ onboarded: false });
      localStorage.removeItem('climate-agent-store');
      window.location.reload();
    }
  };

  const SectionBtn: React.FC<{ id: Section; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setSection(id)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '10px 4px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        background: section === id ? 'rgba(74,222,128,0.1)' : 'transparent',
        color: section === id ? 'var(--color-green-400)' : 'var(--color-text-muted)',
        fontWeight: section === id ? 700 : 500, fontSize: '0.74rem',
        transition: 'all 0.2s',
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="page-content animate-fadeIn" style={{ paddingBottom: '6rem' }}>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h2 className="page-title">Settings & More</h2>
      </div>

      {/* ─── Quick nav shortcuts ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <button onClick={() => setActiveTab('challenges')} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)',
          background: 'rgba(245,158,11,0.07)', cursor: 'pointer', color: 'var(--color-text-primary)',
          transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: '1.3rem' }}>🏆</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>Challenges</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-amber)' }}>2 active</div>
          </div>
          <ChevronRight size={14} color="var(--color-text-muted)" style={{ marginLeft: 'auto' }} />
        </button>
        <button onClick={() => setActiveTab('offset')} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)', border: '1px solid rgba(74,222,128,0.2)',
          background: 'rgba(74,222,128,0.07)', cursor: 'pointer', color: 'var(--color-text-primary)',
          transition: 'all 0.2s',
        }}>
          <TreePine size={20} color="#4ade80" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>Offset Center</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-green-400)' }}>3 projects</div>
          </div>
          <ChevronRight size={14} color="var(--color-text-muted)" style={{ marginLeft: 'auto' }} />
        </button>
      </div>

      {/* ─── Sub-nav ─── */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <SectionBtn id="profile" label="Profile" icon={<User size={16} />} />
        <SectionBtn id="nudges" label="Nudges" icon={<Bell size={16} />} />
        <SectionBtn id="agent" label="AI Agent" icon={<Zap size={16} />} />
      </div>

      {/* ─── Profile section ─── */}
      {section === 'profile' && (
        <div className="animate-fadeIn">
          {/* Avatar card */}
          <div className="card" style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
              flexShrink: 0,
            }}>
              {profile.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {profile.city} · {profile.electricityProvider}
              </div>
            </div>
          </div>

          {/* Settings rows */}
          {[
            {
              Icon: Car, label: 'Primary Transport', field: 'vehicleType' as const,
              options: [
                { value: 'namma_metro', label: '🚇 Namma Metro' },
                { value: 'bmtc_bus', label: '🚌 BMTC Bus' },
                { value: 'two_wheeler', label: '🛵 Two Wheeler' },
                { value: 'auto_rickshaw', label: '🛺 Auto Rickshaw' },
                { value: 'ola_uber', label: '🚗 Ola/Uber' },
                { value: 'petrol_car', label: '🚙 Personal Car' },
              ],
            },
            {
              Icon: Utensils, label: 'Diet Type', field: 'dietType' as const,
              options: [
                { value: 'vegan', label: '🥦 Vegan' },
                { value: 'vegetarian', label: '🥗 Vegetarian' },
                { value: 'egg', label: '🍳 Eggetarian' },
                { value: 'chicken', label: '🍗 Chicken/Fish' },
                { value: 'beef', label: '🥩 Mixed' },
              ],
            },
            {
              Icon: Zap, label: 'Electricity Provider', field: 'electricityProvider' as const,
              options: [
                { value: 'BESCOM', label: '⚡ BESCOM (Bengaluru)' },
                { value: 'MSEDCL', label: '⚡ MSEDCL (Maharashtra)' },
                { value: 'BSES', label: '⚡ BSES (Delhi)' },
                { value: 'TNEB', label: '⚡ TNEB (Tamil Nadu)' },
                { value: 'Other', label: '🔌 Other' },
              ],
            },
          ].map(({ Icon, label, field, options }) => (
            <div key={field} className="card" style={{ marginBottom: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-sm)' }}>
                <Icon size={15} color="var(--color-text-muted)" />
                <span className="form-label" style={{ marginBottom: 0 }}>{label}</span>
              </div>
              <select
                className="select"
                value={(profile as any)[field]}
                onChange={e => setProfile({ [field]: e.target.value })}
              >
                {options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-full"
            style={{ marginTop: 'var(--space-md)', color: 'var(--color-rose)', borderColor: 'rgba(244,63,94,0.2)', display: 'flex', gap: 8 }}
          >
            <RotateCcw size={15} /> Reset & Re-onboard
          </button>
        </div>
      )}

      {/* ─── Nudges section ─── */}
      {section === 'nudges' && (
        <div className="animate-fadeIn">
          {/* Nudge response stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-green-400)' }}>{acceptedCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Accepted</div>
            </div>
            <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-amber)' }}>{ignoredCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Ignored</div>
            </div>
          </div>

          {/* Adaptive strategy info */}
          <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.15)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Zap size={13} color="var(--color-violet)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-violet)' }}>Current AI Strategy</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: 4 }}>
              {agentState.currentStrategy.replace('_', ' ')} framing
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              After 2 ignores, the agent shifts: environmental → financial → social → micro-action.
            </div>
          </div>

          <div className="section-header">
            <span className="section-title">Nudge History</span>
          </div>
          <div className="card">
            {respondedNudges.length > 0
              ? respondedNudges.map(n => <NudgeCard key={n.id} nudge={n} compact />)
              : <div style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No nudge history yet</div>}
          </div>
        </div>
      )}

      {/* ─── Agent State section ─── */}
      {section === 'agent' && (
        <div className="animate-fadeIn">
          <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
              <Trophy size={16} color="var(--color-violet)" />
              <span style={{ fontWeight: 700 }}>Agent State</span>
            </div>
            {[
              { label: 'Strategy', val: agentState.currentStrategy },
              { label: 'Goal', val: agentState.currentGoal ? `${agentState.currentGoal.targetKg} kg target` : 'None' },
              { label: 'Last Run', val: agentState.lastRun ? new Date(agentState.lastRun).toLocaleDateString('en-IN') : 'Never' },
              { label: 'Patterns', val: `${agentState.detectedPatterns.length} detected` },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} color="var(--color-green-400)" /> Detected Patterns
            </div>
            {agentState.detectedPatterns.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < agentState.detectedPatterns.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-green-400)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{p.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            🤖 The AI agent runs every 48 hours, analyses 14 days of activity, detects behavioural patterns, and adapts its nudge strategy automatically.
          </div>
        </div>
      )}
    </div>
  );
};
