import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { getBreakdown } from '../services/emissionCalculator';
import { ExternalLink, Shield, Leaf, TreePine, Flame, ChevronRight, Info } from 'lucide-react';

const OFFSET_PROJECTS = [
  {
    id: 'p1',
    name: 'Western Ghats Reforestation',
    location: 'Karnataka, India',
    type: 'Reforestation',
    icon: <TreePine size={22} color="#4ade80" />,
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    pricePerTonne: 1200,
    standard: 'Gold Standard',
    description: 'Reforesting 4,800 hectares of degraded land in the Sahyadri mountain range. Sequestering carbon while protecting biodiversity corridors for tigers and elephants.',
    impact: '18,000 tonnes CO₂/yr',
    verified: true,
  },
  {
    id: 'p2',
    name: 'Clean Cookstoves — Rajasthan',
    location: 'Rajasthan, India',
    type: 'Clean Energy',
    icon: <Flame size={22} color="#fb923c" />,
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.2)',
    pricePerTonne: 950,
    standard: 'Verra VCS',
    description: 'Distributing efficient biomass cookstoves to 12,000 rural households, reducing indoor air pollution and wood fuel consumption by 60%.',
    impact: '8,400 tonnes CO₂/yr',
    verified: true,
  },
  {
    id: 'p3',
    name: 'Solar Microgrids — Jharkhand',
    location: 'Jharkhand, India',
    type: 'Renewable Energy',
    icon: <Leaf size={22} color="#38bdf8" />,
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    pricePerTonne: 1100,
    standard: 'Gold Standard',
    description: 'Installing community solar microgrids in 200 villages, displacing diesel generators and providing clean electricity to 50,000 people.',
    impact: '12,000 tonnes CO₂/yr',
    verified: true,
  },
];

export const OffsetCenterScreen: React.FC = () => {
  const { activities } = useStore();
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [selected, setSelected] = useState<string | null>(null);

  const breakdown = getBreakdown(activities.filter(a => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.timestamp) >= weekAgo;
  }));

  // Assume 60% is reducible, rest needs offsetting
  const offsetableKg = Math.round(breakdown.total * 0.4 * 100) / 100;

  return (
    <div className="page-content animate-fadeIn">
      <div className="page-header" style={{ padding: 0, marginBottom: 'var(--space-lg)' }}>
        <div>
          <h2 className="page-title">Offset Center</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            Carbon-certified offsets for the footprint you can't cut yet
          </p>
        </div>
      </div>

      {/* Footprint summary */}
      <div style={{
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)',
        background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(56,189,248,0.04))',
        border: '1px solid rgba(74,222,128,0.15)',
      }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          This week's remaining footprint
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-amber)' }}>
              {breakdown.total.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>kg total this week</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-rose)' }}>
              {offsetableKg.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>kg needs offsetting</div>
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-md)', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            60% of your footprint is behaviorally reducible. The remaining 40% can be offset via verified projects.
          </span>
        </div>
      </div>

      {/* Monthly offset cost */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div className="section-title">Monthly Offset Budget</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-green-400)' }}>
            ₹{monthlyBudget}
          </div>
        </div>
        <input
          type="range" min={100} max={2000} step={100}
          value={monthlyBudget} onChange={e => setMonthlyBudget(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-green-400)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span>₹100/mo</span>
          <span style={{ color: 'var(--color-green-400)', fontWeight: 600 }}>
            ≈ {((monthlyBudget / 1200) * 1000).toFixed(0)} kg CO₂ offset
          </span>
          <span>₹2,000/mo</span>
        </div>
      </div>

      {/* Project cards */}
      <div className="section-header">
        <span className="section-title">🌿 Verified Projects</span>
        <span className="badge badge-green"><Shield size={10} /> Certified</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {OFFSET_PROJECTS.map((p, i) => (
          <div
            key={p.id}
            className="offset-project animate-fadeInUp"
            style={{
              animationDelay: `${i * 0.1}s`,
              border: selected === p.id ? '1px solid rgba(74,222,128,0.4)' : '1px solid var(--color-border)',
              boxShadow: selected === p.id ? '0 4px 20px rgba(74,222,128,0.1)' : 'none',
            }}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: p.bg, border: `1px solid ${p.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {p.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{p.location} · {p.type}</div>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" style={{ flexShrink: 0, marginTop: 2, transition: 'transform 0.2s', transform: selected === p.id ? 'rotate(90deg)' : 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                    <Shield size={8} /> {p.standard}
                  </span>
                  <span className="badge badge-sky" style={{ fontSize: '0.65rem' }}>{p.impact}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-amber)', fontWeight: 600 }}>
                    ₹{p.pricePerTonne}/tonne
                  </span>
                </div>
              </div>
            </div>

            {selected === p.id && (
              <div className="animate-fadeIn" style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 'var(--space-md)' }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Support This Project
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Annual summary */}
      <div style={{
        padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
        background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.15)',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-violet)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          📊 Annual Impact Estimate
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          <span>Offset at ₹{monthlyBudget}/mo</span>
          <span style={{ color: 'var(--color-violet)', fontWeight: 700 }}>
            {((monthlyBudget * 12 / 1200) * 1000).toFixed(0)} kg/year neutralised
          </span>
        </div>
      </div>
    </div>
  );
};
