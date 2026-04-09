import React from 'react';
import { useStore } from '../store/useStore';
import type { Nudge } from '../store/useStore';
import { CheckCircle, X, ChevronRight, Zap } from 'lucide-react';

interface NudgeCardProps {
  nudge: Nudge;
  compact?: boolean;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge, compact = false }) => {
  const { respondToNudge } = useStore();

  const framingBadge = {
    environmental: { label: 'For the Planet', class: 'badge-green' },
    financial: { label: 'Saves Money', class: 'badge-amber' },
    social: { label: 'vs City Avg', class: 'badge-sky' },
  }[nudge.framing];

  if (nudge.response !== 'pending') {
    return (
      <div className="activity-item animate-fadeIn" style={{ opacity: 0.6 }}>
        <div className="activity-icon-wrap" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '1.2rem' }}>{nudge.icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nudge.message.slice(0, 60)}…
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span className={`badge ${nudge.response === 'completed' ? 'badge-green' : nudge.response === 'accepted' ? 'badge-sky' : 'badge-amber'}`}>
              {nudge.response === 'completed' ? '✓ Completed' : nudge.response === 'accepted' ? '✓ Accepted' : '↩ Dismissed'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nudge-card animate-fadeInUp" style={{ marginBottom: compact ? 0 : 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', flexShrink: 0,
          }}>
            {nudge.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-green-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                AI Nudge
              </span>
              <Zap size={10} color="var(--color-green-400)" />
            </div>
            <span className={`badge ${framingBadge.class}`} style={{ marginTop: 2 }}>{framingBadge.label}</span>
          </div>
        </div>
        <button
          className="btn-icon btn-ghost"
          style={{ padding: 6 }}
          onClick={() => respondToNudge(nudge.id, 'dismissed')}
        >
          <X size={14} />
        </button>
      </div>

      <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
        {nudge.message}
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={() => respondToNudge(nudge.id, 'accepted')}
        >
          <CheckCircle size={14} /> Accept
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => respondToNudge(nudge.id, 'ignored')}
        >
          Later <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};
