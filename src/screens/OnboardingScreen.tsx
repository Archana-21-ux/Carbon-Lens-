import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    id: 'city',
    title: 'Which city do you live in?',
    subtitle: 'We use city-specific emission data for accurate calculations',
    field: 'city',
    options: [
      { id: 'Bengaluru', label: 'Bengaluru', emoji: '🌿', hint: 'Garden City' },
      { id: 'Mumbai', label: 'Mumbai', emoji: '🌊', hint: 'Maximum City' },
      { id: 'Delhi', label: 'Delhi', emoji: '🏛️', hint: 'Capital' },
      { id: 'Chennai', label: 'Chennai', emoji: '🌞', hint: 'Marina City' },
      { id: 'Hyderabad', label: 'Hyderabad', emoji: '💎', hint: 'Cyberabad' },
      { id: 'Pune', label: 'Pune', emoji: '📚', hint: 'Oxford of the East' },
    ],
  },
  {
    id: 'vehicle',
    title: 'How do you usually commute?',
    subtitle: 'Your primary mode of daily transport',
    field: 'vehicleType',
    options: [
      { id: 'namma_metro', label: 'Namma Metro', emoji: '🚇', hint: '0.011 kg CO₂/km' },
      { id: 'bmtc_bus', label: 'BMTC Bus', emoji: '🚌', hint: '0.04 kg CO₂/km' },
      { id: 'two_wheeler', label: 'Two Wheeler', emoji: '🛵', hint: '0.065 kg CO₂/km' },
      { id: 'auto_rickshaw', label: 'Auto Rickshaw', emoji: '🛺', hint: '0.09 kg CO₂/km' },
      { id: 'ola_uber', label: 'Ola / Uber', emoji: '🚗', hint: '0.14 kg CO₂/km' },
      { id: 'petrol_car', label: 'Personal Car', emoji: '🚙', hint: '0.21 kg CO₂/km' },
    ],
  },
  {
    id: 'diet',
    title: "What's your usual diet?",
    subtitle: "Food accounts for 20–40% of a typical urban Indian's footprint",
    field: 'dietType',
    options: [
      { id: 'vegan', label: 'Vegan', emoji: '🥦', hint: '0.25 kg CO₂/meal' },
      { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', hint: '0.35 kg CO₂/meal' },
      { id: 'egg', label: 'Eggetarian', emoji: '🍳', hint: '0.50 kg CO₂/meal' },
      { id: 'chicken', label: 'Chicken / Fish', emoji: '🍗', hint: '0.97 kg CO₂/meal' },
      { id: 'beef', label: 'Mixed (incl. red meat)', emoji: '🥩', hint: '3+ kg CO₂/meal' },
    ],
  },
  {
    id: 'electricity',
    title: 'Who is your electricity provider?',
    subtitle: "India's grid emits 0.71 kg CO₂ per kWh — 45% higher than the global average",
    field: 'electricityProvider',
    options: [
      { id: 'BESCOM', label: 'BESCOM', emoji: '⚡', hint: 'Bengaluru' },
      { id: 'MSEDCL', label: 'MSEDCL', emoji: '⚡', hint: 'Maharashtra' },
      { id: 'BSES', label: 'BSES', emoji: '⚡', hint: 'Delhi' },
      { id: 'TNEB', label: 'TNEB', emoji: '⚡', hint: 'Tamil Nadu' },
      { id: 'TSSPDCL', label: 'TSSPDCL', emoji: '⚡', hint: 'Telangana' },
      { id: 'Other', label: 'Other', emoji: '🔌', hint: 'Any provider' },
    ],
  },
];

interface OnboardingScreenProps {
  onDone?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const { setProfile, profile } = useStore();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({
    city: '', vehicleType: '', dietType: '', electricityProvider: '',
  });

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleSelect = (field: string, value: string) => {
    setSelections(s => ({ ...s, [field]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      setProfile({
        ...selections,
        name: profile.name || 'You',
        onboarded: true,
      });
      onDone?.();
    } else {
      setStep(s => s + 1);
    }
  };

  const canProceed = !!selections[currentStep.field];

  return (
    <div className="onboarding-wrap">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #854F6C, #522B5B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(133,79,108,0.4)',
          }}>
            <svg width={22} height={22} viewBox="0 0 52 52" fill="none">
              <circle cx={26} cy={26} r={16} stroke="#FBE4D8" strokeWidth={3}/>
              <circle cx={26} cy={26} r={6} fill="#FBE4D8"/>
              <line x1={26} y1={4} x2={26} y2={14} stroke="#FBE4D8" strokeWidth={2.5}/>
              <line x1={26} y1={38} x2={26} y2={48} stroke="#FBE4D8" strokeWidth={2.5}/>
              <line x1={4} y1={26} x2={14} y2={26} stroke="#FBE4D8" strokeWidth={2.5}/>
              <line x1={38} y1={26} x2={48} y2={26} stroke="#FBE4D8" strokeWidth={2.5}/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Carbon Lens</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
              {profile.name ? `Hi, ${profile.name} 👋` : 'Setting up your profile'}
            </div>
          </div>
        </div>

        {/* Progress pips */}
        <div className="onboarding-progress">
          {STEPS.map((_, i) => (
            <div key={i} className={`onboarding-pip${i <= step ? ' active' : ''}`} />
          ))}
        </div>

        <div style={{ marginBottom: 6, fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Step {step + 1} of {STEPS.length}
        </div>
        <h2 style={{ marginBottom: 8, fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: 'var(--color-text-primary)' }}>{currentStep.title}</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{currentStep.subtitle}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
        {currentStep.options.map(opt => (
          <button
            key={opt.id}
            className={`option-btn${selections[currentStep.field] === opt.id ? ' selected' : ''}`}
            onClick={() => handleSelect(currentStep.field, opt.id)}
          >
            <div className="option-icon">{opt.emoji}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>{opt.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{opt.hint}</div>
            </div>
            {selections[currentStep.field] === opt.id && (
              <div style={{ marginLeft: 'auto', color: 'var(--color-accent-light)', fontWeight: 700 }}>✓</div>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          disabled={!canProceed}
          onClick={handleNext}
          style={{ opacity: canProceed ? 1 : 0.4, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
        >
          {isLast ? '✦ Begin My Journey' : 'Continue'}
          {!isLast && <ArrowRight size={18} />}
        </button>

        {step > 0 && (
          <button
            className="btn btn-ghost btn-full"
            style={{ marginTop: 'var(--space-sm)' }}
            onClick={() => setStep(s => s - 1)}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};
