import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Activity, ActivityType } from '../services/emissionCalculator';
import { calculateEmission, getTimeOfDay } from '../services/emissionCalculator';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  city: string;
  vehicleType: string;
  dietType: string;
  electricityProvider: string;
  onboarded: boolean;
}

export type NudgeFraming = 'environmental' | 'financial' | 'social';

export interface Nudge {
  id: string;
  type: string;
  framing: NudgeFraming;
  message: string;
  icon: string;
  sent_at: string;
  response: 'pending' | 'accepted' | 'ignored' | 'dismissed' | 'completed';
}

export interface AgentState {
  currentGoal: { targetKg: number; deadline: string; framing: NudgeFraming } | null;
  currentStrategy: NudgeFraming | 'challenge' | 'micro_action';
  ignoreCounts: Record<string, number>;
  detectedPatterns: string[];
  lastRun: string | null;
  carbonMirrorPersona: CarbonMirrorPersona | null;
}

export interface CarbonMirrorPersona {
  name: string;
  tagline: string;
  topVillain: { activity: string; kg: number; explanation: string };
  hiddenWin: string;
  oneMove: { action: string; projectedSavingKg: number };
  vsCity: { diffPct: number; isBetter: boolean };
  generatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetKg: number;
  currentKg: number;
  deadline: string;
  status: 'active' | 'completed' | 'failed';
  type: 'weekly' | 'streak' | 'swap';
}

// ─── Demo seed data ───────────────────────────────────────────────────────────

const today = new Date();
const fmt = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};

const SEED_ACTIVITIES: Activity[] = [
  // This week
  { id: 'a1', type: 'transport', subtype: 'ola_uber', quantity: 12, emission_kg: 1.68, timestamp: fmt(daysAgo(0)), context: { dayOfWeek: 'Tuesday', timeOfDay: 'morning' } },
  { id: 'a2', type: 'food', subtype: 'chicken', quantity: 1, emission_kg: 0.97, timestamp: fmt(daysAgo(0)), context: { dayOfWeek: 'Tuesday', timeOfDay: 'afternoon' } },
  { id: 'a3', type: 'electricity', subtype: 'electricity', quantity: 8, emission_kg: 5.68, timestamp: fmt(daysAgo(1)), context: { dayOfWeek: 'Monday', timeOfDay: 'evening' } },
  { id: 'a4', type: 'transport', subtype: 'namma_metro', quantity: 18, emission_kg: 0.198, timestamp: fmt(daysAgo(1)), context: { dayOfWeek: 'Monday', timeOfDay: 'morning' } },
  { id: 'a5', type: 'food', subtype: 'vegetarian', quantity: 2, emission_kg: 0.70, timestamp: fmt(daysAgo(2)), context: { dayOfWeek: 'Sunday', timeOfDay: 'afternoon' } },
  { id: 'a6', type: 'transport', subtype: 'petrol_car', quantity: 24, emission_kg: 5.04, timestamp: fmt(daysAgo(2)), context: { dayOfWeek: 'Sunday', timeOfDay: 'morning' } },
  { id: 'a7', type: 'transport', subtype: 'ola_uber', quantity: 8, emission_kg: 1.12, timestamp: fmt(daysAgo(3)), context: { dayOfWeek: 'Saturday', timeOfDay: 'evening' } },
  { id: 'a8', type: 'food', subtype: 'chicken', quantity: 1, emission_kg: 0.97, timestamp: fmt(daysAgo(3)), context: { dayOfWeek: 'Saturday', timeOfDay: 'evening' } },
  { id: 'a9', type: 'electricity', subtype: 'electricity', quantity: 6, emission_kg: 4.26, timestamp: fmt(daysAgo(4)), context: { dayOfWeek: 'Friday', timeOfDay: 'night' } },
  { id: 'a10', type: 'transport', subtype: 'two_wheeler', quantity: 15, emission_kg: 0.975, timestamp: fmt(daysAgo(5)), context: { dayOfWeek: 'Thursday', timeOfDay: 'morning' } },
  { id: 'a11', type: 'food', subtype: 'vegetarian', quantity: 3, emission_kg: 1.05, timestamp: fmt(daysAgo(6)), context: { dayOfWeek: 'Wednesday', timeOfDay: 'afternoon' } },
  { id: 'a12', type: 'transport', subtype: 'namma_metro', quantity: 22, emission_kg: 0.242, timestamp: fmt(daysAgo(6)), context: { dayOfWeek: 'Wednesday', timeOfDay: 'morning' } },
];

const SEED_NUDGES: Nudge[] = [
  {
    id: 'n1', type: 'metro_suggestion', framing: 'environmental',
    message: '🚇 Your Tuesday Uber to Koramangala emitted 1.68 kg CO₂. The metro covers the same distance for just 0.15 kg. That\'s 91% less — and only 8 minutes longer.',
    icon: '🚇', sent_at: fmt(daysAgo(0)), response: 'pending',
  },
  {
    id: 'n2', type: 'peak_hour', framing: 'environmental',
    message: '⚡ You charged appliances between 7–9pm yesterday — peak grid hours. India\'s grid is 32% dirtier then. Shifting to after 10pm saves ~0.4 kg CO₂ per session.',
    icon: '⚡', sent_at: fmt(daysAgo(1)), response: 'accepted',
  },
  {
    id: 'n3', type: 'meal_swap', framing: 'financial',
    message: '🥗 Swapping one chicken meal for a dal-chawal this week saves ₹80 and 0.62 kg CO₂. You\'ve done it 3 times this week — that\'s already 1.86 kg saved.',
    icon: '🥗', sent_at: fmt(daysAgo(3)), response: 'completed',
  },
];

const SEED_CHALLENGES: Challenge[] = [
  {
    id: 'ch1', title: 'Metro Week', description: 'Take the metro for all weekday commutes this week',
    icon: '🚇', targetKg: 5.0, currentKg: 2.1, deadline: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    status: 'active', type: 'weekly',
  },
  {
    id: 'ch2', title: 'Meat-Free Mondays', description: 'Go vegetarian every Monday for 4 weeks',
    icon: '🥦', targetKg: 2.48, currentKg: 2.48, deadline: fmt(daysAgo(7)),
    status: 'completed', type: 'streak',
  },
  {
    id: 'ch3', title: 'Off-Peak Power', description: 'Shift your heavy appliance use after 10pm for 5 days',
    icon: '⚡', targetKg: 1.5, currentKg: 0.6, deadline: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    status: 'active', type: 'streak',
  },
];

const SEED_CARBON_MIRROR: CarbonMirrorPersona = {
  name: 'The Reluctant Commuter',
  tagline: 'You know the metro exists. You just haven\'t committed to it yet.',
  topVillain: {
    activity: 'Ride-hailing (Ola/Uber)',
    kg: 8.4,
    explanation: 'Your 6 cab rides this week emitted more CO₂ than your entire food footprint. Each trip averaged 14 km and 1.96 kg — more than a full vegetarian day of meals.',
  },
  hiddenWin: 'You chose the metro on Monday and Wednesday — saving 1.8 kg compared to your usual cab. That\'s 3 vegetarian meals worth of carbon, and you probably didn\'t even think about it.',
  oneMove: {
    action: 'Replace your Tuesday and Thursday morning Uber with the metro. It\'s the same route.',
    projectedSavingKg: 3.1,
  },
  vsCity: { diffPct: -8, isBetter: true },
  generatedAt: fmt(daysAgo(0)),
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppStore {
  // User
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;

  // Activities
  activities: Activity[];
  addActivity: (type: ActivityType, subtype: string, quantity: number) => void;
  removeActivity: (id: string) => void;

  // Nudges
  nudges: Nudge[];
  respondToNudge: (id: string, response: Nudge['response']) => void;
  addNudge: (n: Nudge) => void;

  // Agent State
  agentState: AgentState;
  setAgentState: (s: Partial<AgentState>) => void;

  // Carbon Mirror
  carbonMirror: CarbonMirrorPersona | null;
  setCarbonMirror: (p: CarbonMirrorPersona) => void;

  // Challenges
  challenges: Challenge[];
  updateChallenge: (id: string, update: Partial<Challenge>) => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chatMessages: Array<{ role: 'agent' | 'user'; content: string; ts: string }>;
  addChatMessage: (msg: { role: 'agent' | 'user'; content: string }) => void;
  isAgentThinking: boolean;
  setAgentThinking: (v: boolean) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, _get) => ({
      // User Profile
      profile: {
        name: '',
        city: 'Bengaluru',
        vehicleType: 'two_wheeler',
        dietType: 'chicken',
        electricityProvider: 'BESCOM',
        onboarded: false,
      },
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

      // Activities — start with seed data for demo
      activities: SEED_ACTIVITIES,
      addActivity: (type, subtype, quantity) => {
        const now = new Date();
        const emission_kg = calculateEmission(type, subtype, quantity);
        const newActivity: Activity = {
          id: `a_${Date.now()}`,
          type,
          subtype,
          quantity,
          emission_kg,
          timestamp: now.toISOString(),
          context: {
            dayOfWeek: now.toLocaleDateString('en-IN', { weekday: 'long' }),
            timeOfDay: getTimeOfDay(now),
          },
        };
        set((s) => ({ activities: [newActivity, ...s.activities] }));
      },
      removeActivity: (id) =>
        set((s) => ({ activities: s.activities.filter((a) => a.id !== id) })),

      // Nudges
      nudges: SEED_NUDGES,
      respondToNudge: (id, response) =>
        set((s) => ({
          nudges: s.nudges.map((n) => (n.id === id ? { ...n, response } : n)),
        })),
      addNudge: (n) => set((s) => ({ nudges: [n, ...s.nudges] })),

      // Agent State
      agentState: {
        currentGoal: { targetKg: 35, deadline: fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)), framing: 'environmental' },
        currentStrategy: 'environmental',
        ignoreCounts: { metro_suggestion: 1, peak_hour: 0 },
        detectedPatterns: ['skips_metro_friday', 'high_ac_evening', 'consistent_metro_monday'],
        lastRun: fmt(daysAgo(1)),
        carbonMirrorPersona: SEED_CARBON_MIRROR,
      },
      setAgentState: (s) => set((st) => ({ agentState: { ...st.agentState, ...s } })),

      // Carbon Mirror
      carbonMirror: SEED_CARBON_MIRROR,
      setCarbonMirror: (p) => set({ carbonMirror: p }),

      // Challenges
      challenges: SEED_CHALLENGES,
      updateChallenge: (id, update) =>
        set((s) => ({
          challenges: s.challenges.map((c) => (c.id === id ? { ...c, ...update } : c)),
        })),

      // UI state
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      chatMessages: [
        {
          role: 'agent',
          content: "Hey Arjun! 👋 I'm your AI Climate Coach. I've been analysing your patterns this week. Your biggest opportunity is your commute — want me to break it down?",
          ts: fmt(daysAgo(0)),
        },
      ],
      addChatMessage: (msg) =>
        set((s) => ({
          chatMessages: [...s.chatMessages, { ...msg, ts: new Date().toISOString() }],
        })),
      isAgentThinking: false,
      setAgentThinking: (v) => set({ isAgentThinking: v }),
    }),
    {
      name: 'climate-agent-store',
      partialize: (s) => ({
        profile: s.profile,
        activities: s.activities,
        nudges: s.nudges,
        agentState: s.agentState,
        carbonMirror: s.carbonMirror,
        challenges: s.challenges,
        chatMessages: s.chatMessages,
      }),
    }
  )
);
