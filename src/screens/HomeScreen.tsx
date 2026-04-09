import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { EmissionRing } from '../components/EmissionRing';
import { NudgeCard } from '../components/NudgeCard';
import { getBreakdown, compareToCity, formatKg } from '../services/emissionCalculator';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingDown, TrendingUp, Target, Zap, Bell, Activity } from 'lucide-react';

const CATEGORY_CONFIG = {
  transport: { label: 'Transport', emoji: '🚗', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  food:      { label: 'Food',      emoji: '🍽️', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  electricity: { label: 'Energy', emoji: '⚡', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HomeScreen: React.FC = () => {
  const { profile, activities, nudges, agentState, setActiveTab } = useStore();

  const weekActivities = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return activities.filter(a => new Date(a.timestamp) >= cutoff);
  }, [activities]);

  const breakdown = useMemo(() => getBreakdown(weekActivities), [weekActivities]);
  const cityComp = useMemo(() => compareToCity(breakdown.total, profile.city), [breakdown.total, profile.city]);

  // Build daily bar chart data (last 7 days)
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd   = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const dayActivities = activities.filter(a => {
        const ts = new Date(a.timestamp);
        return ts >= dayStart && ts < dayEnd;
      });
      const total = dayActivities.reduce((s, a) => s + a.emission_kg, 0);
      return {
        day: DAYS[d.getDay()],
        kg: Math.round(total * 100) / 100,
        isToday: i === 6,
      };
    });
  }, [activities]);

  const pendingNudge = nudges.find(n => n.response === 'pending');
  const weeklyTarget = agentState.currentGoal?.targetKg ?? 35;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-content animate-fadeIn" style={{ paddingBottom: '6rem' }}>

      {/* ─── Greeting Header ─── */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {greeting}
            </div>
            <h1 style={{ fontSize: '1.6rem', marginTop: 2 }}>{profile.name} 🌱</h1>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setActiveTab('coach')}
              title="Go to AI Coach"
            >
              <Bell size={20} />
            </button>
            {pendingNudge && (
              <div style={{
                position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                borderRadius: '50%', background: 'var(--color-green-400)',
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
              }} />
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Emission Ring Card ─── */}
      <div className="card animate-fadeInUp" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: 'var(--space-xl)', marginBottom: 'var(--space-md)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
          THIS WEEK'S FOOTPRINT
        </div>

        <EmissionRing value={breakdown.total} max={weeklyTarget} size={180}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {breakdown.total.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>kg CO₂e</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 4 }}>of {weeklyTarget} kg goal</div>
          </div>
        </EmissionRing>

        {/* City comparison badge */}
        <div style={{
          marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
          background: cityComp.isBetter ? 'rgba(74,222,128,0.1)' : 'rgba(244,63,94,0.1)',
          border: `1px solid ${cityComp.isBetter ? 'rgba(74,222,128,0.25)' : 'rgba(244,63,94,0.25)'}`,
        }}>
          {cityComp.isBetter
            ? <TrendingDown size={14} color="var(--color-green-400)" />
            : <TrendingUp   size={14} color="var(--color-rose)" />}
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: cityComp.isBetter ? 'var(--color-green-400)' : 'var(--color-rose)' }}>
            {Math.abs(cityComp.diffPct)}% {cityComp.isBetter ? 'below' : 'above'} {profile.city} avg
          </span>
        </div>

        {/* Category breakdown row */}
        <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', width: '100%', justifyContent: 'center' }}>
          {(['transport', 'food', 'electricity'] as const).map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const val = breakdown[cat];
            const pct = breakdown[`${cat}Pct` as keyof typeof breakdown] as number;
            return (
              <div key={cat} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: cfg.bg, border: `1px solid ${cfg.color}26`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', margin: '0 auto 6px',
                }}>
                  {cfg.emoji}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: cfg.color }}>
                  {val.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--color-text-muted)', marginTop: 1 }}>
                  {cfg.label} · {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Weekly Activity Chart ─── */}
      <div className="card animate-fadeInUp delay-1" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Activity size={15} color="var(--color-sky)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Daily Trends</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={chartData} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, fontSize: '0.76rem', color: '#f1f5f9',
              }}
              formatter={(v: any) => [`${Number(v || 0).toFixed(2)} kg`, 'CO₂e']}
              labelStyle={{ color: 'var(--color-text-muted)', marginBottom: 2 }}
            />
            <Bar dataKey="kg" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isToday ? '#4ade80' : 'rgba(74,222,128,0.3)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Goal Progress ─── */}
      {agentState.currentGoal && (
        <div className="card animate-fadeInUp delay-2" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={15} color="var(--color-green-400)" />
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Weekly Goal</span>
            </div>
            <span className="badge badge-green">
              {formatKg(Math.max(0, weeklyTarget - breakdown.total))} remaining
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: `${Math.min((breakdown.total / weeklyTarget) * 100, 100)}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--color-text-muted)' }}>
            <span>{breakdown.total.toFixed(1)} kg used</span>
            <span>Target: {weeklyTarget} kg/week</span>
          </div>
        </div>
      )}

      {/* ─── Active Nudge ─── */}
      {pendingNudge && (
        <div className="animate-fadeInUp delay-3">
          <div className="section-header">
            <span className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={15} color="var(--color-green-400)" /> AI Suggestion
            </span>
          </div>
          <NudgeCard nudge={pendingNudge} />
        </div>
      )}

      {/* ─── Recent Activity ─── */}
      <div className="animate-fadeInUp delay-4">
        <div className="section-header">
          <span className="section-title">Recent Activity</span>
          <button
            onClick={() => setActiveTab('log')}
            style={{ fontSize: '0.78rem', color: 'var(--color-green-400)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            + Log more
          </button>
        </div>
        <div className="card">
          {activities.slice(0, 6).map(activity => {
            const cat = CATEGORY_CONFIG[activity.type];
            return (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrap" style={{ background: cat.bg, border: `1px solid ${cat.color}22` }}>
                  <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                    {activity.subtype.replace(/_/g, ' ')}
                    {activity.type === 'transport'    && ` · ${activity.quantity} km`}
                    {activity.type === 'electricity'  && ` · ${activity.quantity} kWh`}
                    {activity.type === 'food'         && ` · ${activity.quantity} meal${activity.quantity > 1 ? 's' : ''}`}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {activity.context.dayOfWeek} · {activity.context.timeOfDay}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: cat.color }}>
                    {activity.emission_kg.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.63rem', color: 'var(--color-text-muted)' }}>kg CO₂</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── AI Detected Patterns ─── */}
      {agentState.detectedPatterns.length > 0 && (
        <div className="animate-fadeInUp delay-5" style={{ marginTop: 'var(--space-md)' }}>
          <div className="section-header">
            <span className="section-title" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Zap size={14} color="var(--color-violet)" /> AI Detected Patterns
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {agentState.detectedPatterns.map((p, i) => (
              <span key={i} className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                {p.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
