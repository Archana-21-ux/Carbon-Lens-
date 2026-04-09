import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TRANSPORT_SUBTYPES, FOOD_SUBTYPES, ENERGY_SUBTYPES } from '../constants/emissionFactors';
import { calculateEmission } from '../services/emissionCalculator';
import { CheckCircle, Minus, Plus } from 'lucide-react';

type TabType = 'transport' | 'food' | 'electricity';

const TAB_CONFIG: Record<TabType, { label: string; emoji: string; color: string }> = {
  transport: { label: 'Transport', emoji: '🚗', color: '#38bdf8' },
  food: { label: 'Food', emoji: '🍽️', color: '#fb923c' },
  electricity: { label: 'Energy', emoji: '⚡', color: '#a78bfa' },
};

export const LogActivityScreen: React.FC = () => {
  const { addActivity, profile } = useStore();

  // Smart default: morning → transport, lunch → food, evening → energy
  const getDefaultTab = (): TabType => {
    const h = new Date().getHours();
    if (h >= 5 && h < 10) return 'transport';
    if (h >= 11 && h < 15) return 'food';
    if (h >= 17 && h < 22) return 'electricity';
    return 'transport';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getDefaultTab());
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [logged, setLogged] = useState(false);

  const subtypes = activeTab === 'transport' ? TRANSPORT_SUBTYPES : activeTab === 'food' ? FOOD_SUBTYPES : ENERGY_SUBTYPES;

  const previewEmission = selectedSubtype ? calculateEmission(activeTab, selectedSubtype, quantity) : 0;

  const getUnit = () => {
    if (activeTab === 'transport') return 'km';
    if (activeTab === 'food') return quantity === 1 ? 'meal' : 'meals';
    const sub = ENERGY_SUBTYPES.find(s => s.id === selectedSubtype);
    return sub?.unit ?? 'kWh';
  };

  const handleLog = () => {
    if (!selectedSubtype || quantity <= 0) return;
    addActivity(activeTab, selectedSubtype, quantity);
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      setSelectedSubtype('');
      setQuantity(activeTab === 'food' ? 1 : activeTab === 'electricity' ? 5 : 10);
    }, 1500);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedSubtype('');
    setQuantity(tab === 'food' ? 1 : tab === 'electricity' ? 5 : 10);
  };

  const emissionColor = previewEmission < 1 ? '#4ade80' : previewEmission < 3 ? '#fbbf24' : '#f43f5e';

  return (
    <div className="page-content animate-fadeIn">
      {/* Page header */}
      <div className="page-header" style={{ padding: 0, marginBottom: 'var(--space-lg)' }}>
        <div>
          <h2 className="page-title">Log Activity</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            Track your carbon footprint for {profile.city}
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {(Object.entries(TAB_CONFIG) as [TabType, typeof TAB_CONFIG[TabType]][]).map(([id, cfg]) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 8px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${activeTab === id ? cfg.color + '44' : 'var(--color-border)'}`,
              background: activeTab === id ? cfg.color + '15' : 'transparent',
              color: activeTab === id ? cfg.color : 'var(--color-text-muted)',
              fontWeight: activeTab === id ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cfg.emoji} {cfg.label}
          </button>
        ))}
      </div>

      {/* Subtype selector */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
          {activeTab === 'transport' ? 'Mode of transport' : activeTab === 'food' ? 'Meal type' : 'Energy type'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
          {subtypes.map(sub => (
            <button
              key={sub.id}
              className={`option-btn${selectedSubtype === sub.id ? ' selected' : ''}`}
              style={{ padding: '12px', gap: 10 }}
              onClick={() => setSelectedSubtype(sub.id)}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${sub.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                {sub.emoji}
              </div>
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sub.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: sub.color, marginTop: 2, fontWeight: 500 }}>
                  {(calculateEmission(activeTab, sub.id, 1) * (activeTab === 'transport' ? 10 : 1)).toFixed(2)} kg
                  {activeTab === 'transport' ? '/10km' : '/unit'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity input */}
      {selectedSubtype && (
        <div className="card animate-fadeInUp" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
            {activeTab === 'transport' ? 'Distance (km)' : activeTab === 'food' ? 'Number of meals' : `Quantity (${getUnit()})`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)' }}>
            <button
              onClick={() => setQuantity(q => Math.max(activeTab === 'transport' ? 1 : 1, q - (activeTab === 'transport' ? 5 : 1)))}
              className="btn btn-ghost btn-icon"
              style={{ width: 48, height: 48, borderRadius: '50%' }}
            >
              <Minus size={18} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
                {quantity}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{getUnit()}</div>
            </div>
            <button
              onClick={() => setQuantity(q => q + (activeTab === 'transport' ? 5 : 1))}
              className="btn btn-ghost btn-icon"
              style={{ width: 48, height: 48, borderRadius: '50%' }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Preview emission */}
          <div style={{
            marginTop: 'var(--space-md)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: `${emissionColor}12`,
            border: `1px solid ${emissionColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>CO₂ footprint</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: emissionColor }}>
              {previewEmission.toFixed(3)} kg CO₂e
            </span>
          </div>
        </div>
      )}

      {/* Log button */}
      <button
        className={`btn btn-primary btn-lg btn-full${!selectedSubtype ? '' : ''}`}
        disabled={!selectedSubtype || quantity <= 0 || logged}
        onClick={handleLog}
        style={{ opacity: !selectedSubtype ? 0.4 : 1 }}
      >
        {logged ? (
          <><CheckCircle size={18} /> Logged! ✨</>
        ) : (
          `Log ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Activity`
        )}
      </button>

      {/* Quick tips */}
      <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.15)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-violet)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          💡 India Data Note
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
          {activeTab === 'transport' && 'Namma Metro emits 95% less CO₂ than an Ola/Uber for the same distance. India-specific IPCC Tier 1 factors used.'}
          {activeTab === 'food' && 'Indian diets are rice-heavy with lower beef consumption. Our food factors reflect local dietary patterns, not Western datasets.'}
          {activeTab === 'electricity' && `CEA (2023) India grid emission factor: 0.71 kg CO₂/kWh — 45% higher than the global average of 0.49. BESCOM's grid is slightly greener due to hydropower mix.`}
        </p>
      </div>
    </div>
  );
};
