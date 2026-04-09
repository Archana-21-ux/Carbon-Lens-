import {
  TRANSPORT_FACTORS,
  FOOD_FACTORS,
  ENERGY_FACTORS,
  CITY_BENCHMARKS,
} from '../constants/emissionFactors';

export type ActivityType = 'transport' | 'food' | 'electricity';

export interface Activity {
  id: string;
  type: ActivityType;
  subtype: string;
  quantity: number; // km, meals, or kWh
  emission_kg: number;
  timestamp: string;
  context: {
    dayOfWeek: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

export interface EmissionBreakdown {
  transport: number;
  food: number;
  electricity: number;
  total: number;
  transportPct: number;
  foodPct: number;
  electricityPct: number;
}

/**
 * Core formula: Emission = Activity Quantity × Emission Factor
 */
export function calculateEmission(type: ActivityType, subtype: string, quantity: number): number {
  let factor = 0;
  if (type === 'transport') factor = TRANSPORT_FACTORS[subtype] ?? 0;
  else if (type === 'food') factor = FOOD_FACTORS[subtype] ?? 0;
  else if (type === 'electricity') factor = ENERGY_FACTORS[subtype] ?? 0;
  return Math.round(factor * quantity * 1000) / 1000; // round to 3dp
}

/**
 * Categorize time of day
 */
export function getTimeOfDay(date: Date = new Date()): 'morning' | 'afternoon' | 'evening' | 'night' {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

/**
 * Get emission breakdown from a list of activities
 */
export function getBreakdown(activities: Activity[]): EmissionBreakdown {
  const transport = activities
    .filter(a => a.type === 'transport')
    .reduce((sum, a) => sum + a.emission_kg, 0);
  const food = activities
    .filter(a => a.type === 'food')
    .reduce((sum, a) => sum + a.emission_kg, 0);
  const electricity = activities
    .filter(a => a.type === 'electricity')
    .reduce((sum, a) => sum + a.emission_kg, 0);
  const total = transport + food + electricity;

  return {
    transport: Math.round(transport * 100) / 100,
    food: Math.round(food * 100) / 100,
    electricity: Math.round(electricity * 100) / 100,
    total: Math.round(total * 100) / 100,
    transportPct: total > 0 ? Math.round((transport / total) * 100) : 0,
    foodPct: total > 0 ? Math.round((food / total) * 100) : 0,
    electricityPct: total > 0 ? Math.round((electricity / total) * 100) : 0,
  };
}

/**
 * Compare user's weekly emissions to city average
 */
export function compareToCity(weeklyKg: number, city: string): {
  avgKg: number;
  diffKg: number;
  diffPct: number;
  isBetter: boolean;
} {
  const avgKg = CITY_BENCHMARKS[city] ?? 38.5;
  const diffKg = weeklyKg - avgKg;
  const diffPct = Math.round((diffKg / avgKg) * 100);
  return { avgKg, diffKg: Math.round(diffKg * 100) / 100, diffPct, isBetter: diffKg < 0 };
}

/**
 * Suggest metro route savings for a cab trip
 */
export function getMetroSavings(km: number): { savingsKg: number; savingsPct: number } {
  const cabEmission = TRANSPORT_FACTORS.ola_uber * km;
  const metroEmission = TRANSPORT_FACTORS.namma_metro * km;
  const savingsKg = Math.round((cabEmission - metroEmission) * 1000) / 1000;
  const savingsPct = Math.round((savingsKg / cabEmission) * 100);
  return { savingsKg, savingsPct };
}

/**
 * Calculate AC thermostat savings (1°C = ~6% reduction in cooling energy)
 */
export function getACSavings(dailyKwh: number): { kgPerMonth: number; rupeesPerMonth: number } {
  const savingsKwhPerDay = dailyKwh * 0.06;
  const kgPerMonth = Math.round(savingsKwhPerDay * 30 * ENERGY_FACTORS.electricity * 100) / 100;
  const rupeesPerMonth = Math.round(savingsKwhPerDay * 30 * 8); // ₹8/kWh avg Bengaluru
  return { kgPerMonth, rupeesPerMonth };
}

/**
 * Offset cost calculation (Gold Standard — ~$15/tonne = ~₹1250/tonne)
 */
export function getOffsetCost(remainingKg: number): { kg: number; rupees: number } {
  const rupees = Math.round((remainingKg / 1000) * 1250);
  return { kg: remainingKg, rupees };
}

/**
 * Format kg value for display
 */
export function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  if (kg >= 100) return `${kg.toFixed(1)} kg`;
  return `${kg.toFixed(2)} kg`;
}
