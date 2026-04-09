/**
 * AI Agent Service — Claude-powered behavioral analysis
 * Runs pattern detection + adaptive nudge generation
 */

import type { Activity } from './emissionCalculator';
import { getBreakdown, compareToCity } from './emissionCalculator';
import type { CarbonMirrorPersona, NudgeFraming } from '../store/useStore';

const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

// ─── Call Claude via direct API (browser-safe demo mode) ─────────────────────

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  if (!CLAUDE_API_KEY) {
    // Return mock response for demo without API key
    return getMockResponse(userMessage);
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) {
    console.warn(`Claude API error (${res.status}): Falling back to demo mode.`);
    return getMockResponse(userMessage);
  }
  const data = await res.json();
  return data.content[0].text;
}

// ─── Mock responses for demo mode ────────────────────────────────────────────

function getMockResponse(prompt: string): string {
  if (prompt.includes('carbon mirror')) {
    return JSON.stringify({
      name: 'The Reluctant Commuter',
      tagline: "You know the metro exists. You just haven't committed to it yet.",
      topVillain: {
        activity: 'Ride-hailing (Ola/Uber)',
        kg: 8.4,
        explanation: "Your 6 cab rides this week emitted more CO₂ than your entire food footprint. Each trip averaged 14 km — more than a full day of vegetarian meals.",
      },
      hiddenWin: "You chose the metro on Monday and Wednesday — saving 1.8 kg compared to your usual cab.",
      oneMove: { action: 'Replace your Tuesday and Thursday morning Uber with the metro.', projectedSavingKg: 3.1 },
      vsCity: { diffPct: -8, isBetter: true },
    });
  }
  if (prompt.includes('patterns')) {
    return JSON.stringify({
      skippedSustainable: ['Metro skipped on Friday evenings', 'Vegetarian options ignored at lunch'],
      recurringHigh: ['Peak-hour electricity use 7-9pm', 'Ola/Uber for short trips < 5km'],
      positiveTrends: ['Metro usage up 40% vs last week', 'Consistent vegetarian lunches Mon-Wed'],
      recommendedShift: 'Switch from environmental framing to financial — user responds better to cost savings.',
    });
  }
  // Default chat response
  return "Great question! Based on your data, your biggest win this week would be taking the metro for your Tuesday commute. That single change saves 1.5 kg CO₂ and ₹180 vs your current Uber habit. Want me to set that as your challenge?";
}

// ─── Agent Tools (Client-side implementations) ───────────────────────────────

export const agentTools = {
  get_user_emission_history: (activities: Activity[], days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return activities.filter(a => new Date(a.timestamp) >= cutoff);
  },

  get_breakdown_summary: (activities: Activity[], city: string) => {
    const breakdown = getBreakdown(activities);
    const cityComp = compareToCity(breakdown.total, city);
    return { breakdown, cityComparison: cityComp };
  },

  detect_behavioral_patterns: async (activities: Activity[], city: string) => {
    const summary = activities.slice(0, 20).map(a => ({
      type: a.type,
      subtype: a.subtype,
      emission_kg: a.emission_kg,
      day: a.context.dayOfWeek,
      time: a.context.timeOfDay,
    }));
    const prompt = `Analyze these 14-day emission patterns for a user in ${city}:
${JSON.stringify(summary, null, 2)}
Return JSON with: skippedSustainable, recurringHigh, positiveTrends, recommendedShift`;

    const response = await callClaude(
      'You are a behavioral AI analyst for a carbon footprint app. Return only valid JSON.',
      `patterns: ${prompt}`
    );
    try { return JSON.parse(response); }
    catch { return { skippedSustainable: [], recurringHigh: [], positiveTrends: [], recommendedShift: 'maintain' }; }
  },

  generate_adaptive_nudge: async (
    activities: Activity[],
    ignoreCounts: Record<string, number>,
    _currentStrategy: string,
    city: string
  ): Promise<{ message: string; type: string; suggestedFraming: NudgeFraming }> => {
    const recent = activities.slice(0, 5);
    const breakdown = getBreakdown(recent);

    // Determine framing based on ignore counts
    let framing: NudgeFraming = 'environmental';
    const totalIgnores = Object.values(ignoreCounts).reduce((a, b) => a + b, 0);
    if (totalIgnores >= 4) framing = 'social';
    else if (totalIgnores >= 2) framing = 'financial';

    const prompt = `Generate a single nudge message for a user in ${city}.
Recent activities: ${JSON.stringify(recent.map(a => ({ type: a.type, subtype: a.subtype, kg: a.emission_kg })))}
Top category: ${breakdown.transport > breakdown.food && breakdown.transport > breakdown.electricity ? 'transport' : breakdown.electricity > breakdown.food ? 'electricity' : 'food'}
Framing: ${framing} (${framing === 'environmental' ? 'focus on CO₂ saved' : framing === 'financial' ? 'focus on money saved in rupees' : 'focus on comparison to city average'})
Keep it under 2 sentences, specific, not preachy. Start with an emoji.`;

    const message = await callClaude(
      'You are a friendly AI climate coach for an India-specific app. Be concise and actionable.',
      prompt
    );

    const typeMap: Record<string, string> = { transport: 'metro_suggestion', food: 'meal_swap', electricity: 'peak_hour' };
    const topType = breakdown.transport > breakdown.food && breakdown.transport > breakdown.electricity ? 'transport' : breakdown.electricity > breakdown.food ? 'electricity' : 'food';

    return { message, type: typeMap[topType], suggestedFraming: framing };
  },

  generate_carbon_mirror: async (
    activities: Activity[],
    city: string
  ): Promise<CarbonMirrorPersona> => {
    const last7 = activities.filter(a => {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.timestamp) >= weekAgo;
    });
    const breakdown = getBreakdown(last7);
    const cityComp = compareToCity(breakdown.total, city);

    const prompt = `Generate a "Carbon Mirror" weekly persona for this user in ${city}.
Week's data: ${JSON.stringify({ breakdown, activities: last7.map(a => ({ type: a.type, subtype: a.subtype, kg: a.emission_kg, day: a.context.dayOfWeek })) })}
City comparison: ${cityComp.diffPct}% vs city average

Return JSON with exactly this structure:
{
  "name": "The [Persona Name]" (creative, slightly playful),
  "tagline": "one line that captures the pattern",
  "topVillain": { "activity": "...", "kg": number, "explanation": "2 sentences, specific" },
  "hiddenWin": "something positive they did, 1-2 sentences",
  "oneMove": { "action": "the single highest-leverage change", "projectedSavingKg": number },
  "vsCity": { "diffPct": ${cityComp.diffPct}, "isBetter": ${cityComp.isBetter} }
}`;

    const response = await callClaude(
      'You are a creative AI writer for a carbon footprint app. Generate the carbon mirror persona. Return only valid JSON.',
      `carbon mirror: ${prompt}`
    );

    try {
      const parsed = JSON.parse(response);
      return { ...parsed, generatedAt: new Date().toISOString() };
    } catch {
      // fallback persona
      return {
        name: 'The Reluctant Commuter',
        tagline: "You know the metro exists. You just haven't committed to it yet.",
        topVillain: { activity: 'Ride-hailing', kg: breakdown.transport, explanation: 'Your transport footprint dominates this week.' },
        hiddenWin: 'You logged your activities consistently — that self-awareness is the first step.',
        oneMove: { action: 'Take the metro for 3 commutes next week', projectedSavingKg: 2.5 },
        vsCity: cityComp,
        generatedAt: new Date().toISOString(),
      };
    }
  },

  get_city_average_benchmark: (city: string) => {
    const benchmarks: Record<string, number> = {
      Bengaluru: 38.5, Mumbai: 35.2, Delhi: 42.1,
      Chennai: 36.8, Hyderabad: 39.4, Pune: 37.0, Kolkata: 33.9,
    };
    return { city, weeklyAvgKg: benchmarks[city] ?? 38.5 };
  },
};

// ─── Chat with AI Coach ───────────────────────────────────────────────────────

export async function chatWithCoach(
  userMessage: string,
  activities: Activity[],
  agentState: { currentStrategy: string; detectedPatterns: string[] },
  city: string
): Promise<string> {
  const breakdown = getBreakdown(activities.slice(0, 30));
  const cityComp = compareToCity(breakdown.total, city);

  const systemPrompt = `You are an AI Climate Coach for a carbon footprint app tailored for India, specifically ${city}.
You have access to the user's emission data and behavioral patterns.
Be concise (2-4 sentences), specific, actionable, and never preachy.
Use Indian context (rupees, BESCOM, Namma Metro, BMTC, etc.).
Current week total: ${breakdown.total} kg CO₂e (${cityComp.isBetter ? cityComp.diffPct + '% below' : Math.abs(cityComp.diffPct) + '% above'} city average).
Top category: ${breakdown.transportPct}% transport, ${breakdown.foodPct}% food, ${breakdown.electricityPct}% energy.
Detected patterns: ${agentState.detectedPatterns.join(', ')}.
Current strategy: ${agentState.currentStrategy}.`;

  return await callClaude(systemPrompt, userMessage);
}
