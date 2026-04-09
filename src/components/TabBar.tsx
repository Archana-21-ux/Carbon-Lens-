import React from 'react';
import { useStore } from '../store/useStore';
import { Home, PlusCircle, Sparkles, MessageCircle, MoreHorizontal } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'log', label: 'Log', Icon: PlusCircle },
  { id: 'mirror', label: 'Mirror', Icon: Sparkles },
  { id: 'coach', label: 'Coach', Icon: MessageCircle },
  { id: 'more', label: 'More', Icon: MoreHorizontal },
];

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav style={{
      width: '100%',
      background: 'var(--color-bg-surface)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      padding: '6px 0 10px',
      flexShrink: 0,
      zIndex: 100,
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 4px',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isActive && (
                <div style={{
                  position: 'absolute', inset: -5,
                  background: 'rgba(133,79,108,0.15)',
                  borderRadius: '50%',
                }} />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
