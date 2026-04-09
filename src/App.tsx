import React, { useState, useEffect } from 'react';
import './index.css';
import { useStore } from './store/useStore';
import { SplashScreen } from './screens/SplashScreen';
import { GetStartedScreen } from './screens/GetStartedScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LogActivityScreen } from './screens/LogActivityScreen';
import { CarbonMirrorScreen } from './screens/CarbonMirrorScreen';
import { AICoachScreen } from './screens/AICoachScreen';
import { ChallengesScreen } from './screens/ChallengesScreen';
import { OffsetCenterScreen } from './screens/OffsetCenterScreen';
import { MoreScreen } from './screens/MoreScreen';
import { TabBar } from './components/TabBar';
import { Sun, Moon } from 'lucide-react';

// ─── Theme toggle button ────────────────────────────────────────────────────

const ThemeToggle: React.FC<{ theme: string; toggle: () => void }> = ({ theme, toggle }) => (
  <button
    onClick={toggle}
    style={{
      position: 'fixed', top: 16, right: 16,
      width: 38, height: 38, borderRadius: '50%',
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', zIndex: 500,
      color: 'var(--color-text-secondary)',
      transition: 'all 0.2s',
      boxShadow: 'var(--shadow-card)',
    }}
    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
  </button>
);

// ─── Desktop Frame ──────────────────────────────────────────────────────────

const DesktopFrame: React.FC<{ children: React.ReactNode; theme: string; toggleTheme: () => void }> = ({ children, theme, toggleTheme }) => {
  return (
    <div style={{
      minHeight: '100dvh',
      background: theme === 'dark' ? '#07000a' : '#e8c8bc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      backgroundImage: theme === 'dark' ? `
        radial-gradient(ellipse at 20% 30%, rgba(133,79,108,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(82,43,91,0.05) 0%, transparent 50%)
      ` : `
        radial-gradient(ellipse at 20% 30%, rgba(251,228,216,0.5) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(133,79,108,0.08) 0%, transparent 50%)
      `,
      transition: 'background 0.3s',
    }}>
      {/* Watermark */}
      <div style={{ position: 'fixed', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.7 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #854F6C, #522B5B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(133,79,108,0.4)',
        }}>
          <svg width={20} height={20} viewBox="0 0 52 52" fill="none">
            <circle cx={26} cy={26} r={16} stroke="#FBE4D8" strokeWidth={3}/>
            <circle cx={26} cy={26} r={6} fill="#FBE4D8"/>
            <line x1={26} y1={4} x2={26} y2={14} stroke="#FBE4D8" strokeWidth={2.5}/>
            <line x1={26} y1={38} x2={26} y2={48} stroke="#FBE4D8" strokeWidth={2.5}/>
            <line x1={4} y1={26} x2={14} y2={26} stroke="#FBE4D8" strokeWidth={2.5}/>
            <line x1={38} y1={26} x2={48} y2={26} stroke="#FBE4D8" strokeWidth={2.5}/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.95rem', color: theme === 'dark' ? '#FBE4D8' : '#190019' }}>Carbon Lens</div>
          <div style={{ fontSize: '0.65rem', color: theme === 'dark' ? '#854F6C' : '#522B5B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Track · Reflect · Reduce</div>
        </div>
      </div>

      {/* Theme toggle */}
      <div style={{ position: 'fixed', top: 28, right: 40 }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '7px 16px', borderRadius: 9999,
            background: theme === 'dark' ? 'rgba(133,79,108,0.15)' : 'rgba(82,43,91,0.1)',
            border: `1px solid ${theme === 'dark' ? 'rgba(133,79,108,0.3)' : 'rgba(82,43,91,0.2)'}`,
            display: 'flex', alignItems: 'center', gap: 7,
            cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 600,
            color: theme === 'dark' ? '#DFB6B2' : '#522B5B',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          {theme === 'dark' ? <><Sun size={14}/> Light</> : <><Moon size={14}/> Dark</>}
        </button>
      </div>

      {/* Phone frame */}
      <div style={{
        width: 390, height: 844,
        borderRadius: 48,
        background: 'var(--color-bg-base)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: [
          '0 0 0 1px rgba(133,79,108,0.15)',
          '0 32px 80px rgba(0,0,0,0.5)',
          '0 0 120px rgba(133,79,108,0.08)',
          'inset 0 0 0 1px rgba(255,255,255,0.03)',
        ].join(', '),
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 30, borderRadius: 20,
          background: '#000', zIndex: 200,
        }} />
        {children}
      </div>
    </div>
  );
};

// ─── App Screen Router ──────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  const { activeTab } = useStore();
  const isFullScreen = activeTab === 'coach';

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':       return <HomeScreen />;
      case 'log':        return <LogActivityScreen />;
      case 'mirror':     return <CarbonMirrorScreen />;
      case 'coach':      return <AICoachScreen />;
      case 'challenges': return <ChallengesScreen />;
      case 'offset':     return <OffsetCenterScreen />;
      case 'more':       return <MoreScreen />;
      default:           return <HomeScreen />;
    }
  };

  return (
    <>
      <div className="bg-mesh" />
      <div style={{ height: 44, flexShrink: 0 }} />
      <div style={{
        flex: 1,
        overflowY: isFullScreen ? 'hidden' : 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        position: 'relative',
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {renderScreen()}
      </div>
      {!isFullScreen && <TabBar />}
    </>
  );
};

// ─── Root App ───────────────────────────────────────────────────────────────

type AppPhase = 'splash' | 'getstarted' | 'onboarding' | 'app';

const App: React.FC = () => {
  const { profile, setProfile } = useStore();
  const isMobile = window.innerWidth <= 500;

  const [phase, setPhase] = useState<AppPhase>('splash');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleSplashDone = () => {
    if (profile.onboarded) {
      setPhase('app');
    } else {
      setPhase('getstarted');
    }
  };

  const handleGetStarted = (name: string) => {
    setProfile({ name });
    setPhase('onboarding');
  };

  const handleOnboardingDone = () => {
    setPhase('app');
  };

  // Watch for onboarding completion
  useEffect(() => {
    if (phase === 'onboarding' && profile.onboarded) {
      setPhase('app');
    }
  }, [profile.onboarded, phase]);

  if (phase === 'splash') {
    const content = <SplashScreen onDone={handleSplashDone} />;
    return isMobile ? content : (
      <DesktopFrame theme={theme} toggleTheme={toggleTheme}>
        {content}
      </DesktopFrame>
    );
  }

  if (phase === 'getstarted') {
    const content = <GetStartedScreen onStart={handleGetStarted} />;
    return isMobile ? content : (
      <DesktopFrame theme={theme} toggleTheme={toggleTheme}>
        {content}
      </DesktopFrame>
    );
  }

  if (phase === 'onboarding' || !profile.onboarded) {
    const content = <OnboardingScreen onDone={handleOnboardingDone} />;
    return isMobile ? content : (
      <DesktopFrame theme={theme} toggleTheme={toggleTheme}>
        {content}
      </DesktopFrame>
    );
  }

  const appShell = (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base)', overflow: 'hidden', position: 'relative' }}>
      {!isMobile && (
        <ThemeToggle theme={theme} toggle={toggleTheme} />
      )}
      <AppContent />
    </div>
  );

  return isMobile
    ? appShell
    : <DesktopFrame theme={theme} toggleTheme={toggleTheme}><AppContent /></DesktopFrame>;
};

export default App;
