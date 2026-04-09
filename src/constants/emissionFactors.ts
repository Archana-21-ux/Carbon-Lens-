// India-specific emission factors (kg CO₂e per unit)
// Sources: CEA 2023, IPCC Tier 1, Indian dietary studies

export const TRANSPORT_FACTORS: Record<string, number> = {
  petrol_car: 0.21,      // per km
  diesel_car: 0.18,      // per km
  auto_rickshaw: 0.09,   // per km
  ola_uber: 0.14,        // per km
  bmtc_bus: 0.04,        // per km
  namma_metro: 0.011,    // per km
  walking: 0,
  cycling: 0,
  two_wheeler: 0.065,    // per km
  flight_domestic: 0.255, // per km (per passenger)
};

export const FOOD_FACTORS: Record<string, number> = {
  vegetarian: 0.35,      // per meal
  chicken: 0.97,         // per meal
  beef: 6.0,             // per meal
  pork: 1.2,             // per meal
  fish: 0.7,             // per meal
  vegan: 0.25,           // per meal
  egg: 0.5,              // per meal
  dairy_heavy: 0.8,      // per meal (paneer, curd heavy)
};

export const ENERGY_FACTORS: Record<string, number> = {
  electricity: 0.71,     // per kWh — CEA India grid emission factor 2023
  lpg: 2.98,             // per kg of LPG
  natural_gas: 2.02,     // per m³
};

// City benchmarks (kg CO₂e per week)
export const CITY_BENCHMARKS: Record<string, number> = {
  Bengaluru: 38.5,
  Mumbai: 35.2,
  Delhi: 42.1,
  Chennai: 36.8,
  Hyderabad: 39.4,
  Pune: 37.0,
  Kolkata: 33.9,
};

// Activity subtypes metadata
export const TRANSPORT_SUBTYPES = [
  { id: 'namma_metro', label: 'Namma Metro', emoji: '🚇', color: '#38bdf8' },
  { id: 'bmtc_bus', label: 'BMTC Bus', emoji: '🚌', color: '#34d399' },
  { id: 'auto_rickshaw', label: 'Auto Rickshaw', emoji: '🛺', color: '#fbbf24' },
  { id: 'two_wheeler', label: 'Two Wheeler', emoji: '🛵', color: '#fb923c' },
  { id: 'ola_uber', label: 'Ola / Uber', emoji: '🚗', color: '#f87171' },
  { id: 'petrol_car', label: 'Personal Car', emoji: '🚙', color: '#f43f5e' },
  { id: 'cycling', label: 'Cycling', emoji: '🚲', color: '#4ade80' },
  { id: 'walking', label: 'Walking', emoji: '🚶', color: '#4ade80' },
  { id: 'flight_domestic', label: 'Domestic Flight', emoji: '✈️', color: '#c084fc' },
];

export const FOOD_SUBTYPES = [
  { id: 'vegan', label: 'Vegan', emoji: '🥦', color: '#4ade80' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', color: '#86efac' },
  { id: 'egg', label: 'Egg-based', emoji: '🍳', color: '#fde68a' },
  { id: 'dairy_heavy', label: 'Dairy Heavy', emoji: '🧀', color: '#fcd34d' },
  { id: 'fish', label: 'Fish', emoji: '🐟', color: '#67e8f9' },
  { id: 'chicken', label: 'Chicken', emoji: '🍗', color: '#fb923c' },
  { id: 'pork', label: 'Pork', emoji: '🥩', color: '#f87171' },
  { id: 'beef', label: 'Beef', emoji: '🥩', color: '#ef4444' },
];

export const ENERGY_SUBTYPES = [
  { id: 'electricity', label: 'Electricity', emoji: '⚡', color: '#fbbf24', unit: 'kWh' },
  { id: 'lpg', label: 'LPG / Cooking Gas', emoji: '🔥', color: '#fb923c', unit: 'kg' },
  { id: 'natural_gas', label: 'Natural Gas', emoji: '🏭', color: '#94a3b8', unit: 'm³' },
];
