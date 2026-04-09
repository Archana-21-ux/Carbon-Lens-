# AI Climate Agent — Implementation Plan

## Overview

A full-stack, AI-driven carbon footprint tracking app tailored for India, combining a **React Native (Expo)** mobile frontend with a **Firebase** backend and an **LLM-powered agentic loop** (OpenAI GPT-4o / Claude). The app adapts its behavioral nudge strategy based on user responses, and culminates in a beautiful "Carbon Mirror" weekly recap.

---

## User Review Required

> [!IMPORTANT]
> **LLM Provider**: The spec mentions both GPT-4o and Claude Sonnet. The plan defaults to **OpenAI GPT-4o** via LangChain (Node.js) inside Firebase Cloud Functions. Please confirm which LLM you'd like to use, or if you want both as a fallback chain.

> [!IMPORTANT]
> **Demo vs. Production Scope**: This plan targets a **working demo / hackathon-ready** app with:
> - Full UI across all 8 screens
> - Simulated agent loop (runs on demand + scheduled via Cloud Functions)
> - Mocked FCM push notifications (real FCM setup requires paid Apple/Android dev accounts)
> - Real emission calculations and LLM integration
> Optional features (Pinecone, OCR bill scanning, BESCOM API) are deferred to Phase 2.

> [!WARNING]
> **Firebase Setup Required**: You'll need to provide a Firebase project with Firestore, Auth, Cloud Functions (Blaze plan for external API calls), and FCM enabled. The plan will generate all config files and placeholders.

---

## Project Structure

```
carbonfootprint-app/
├── app/                        # React Native (Expo) frontend
│   ├── assets/
│   ├── components/
│   │   ├── EmissionRing.tsx
│   │   ├── NudgeCard.tsx
│   │   ├── CarbonMirrorCard.tsx
│   │   ├── ActivityLogger.tsx
│   │   └── Charts/
│   ├── screens/
│   │   ├── Onboarding/
│   │   ├── Home/
│   │   ├── LogActivity/
│   │   ├── CarbonMirror/
│   │   ├── AICoach/
│   │   ├── Challenges/
│   │   ├── OffsetCenter/
│   │   └── Settings/
│   ├── navigation/
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── emissionCalculator.ts
│   │   └── agentClient.ts
│   ├── store/                  # Zustand state management
│   ├── constants/
│   │   └── emissionFactors.ts  # India-specific factors
│   ├── App.tsx
│   └── app.json
│
├── functions/                  # Firebase Cloud Functions (Node.js)
│   ├── src/
│   │   ├── agent/
│   │   │   ├── agentLoop.ts    # Main LangChain agent
│   │   │   ├── tools.ts        # Agent tool definitions
│   │   │   ├── prompts.ts      # System prompts
│   │   │   └── patternDetector.ts
│   │   ├── triggers/
│   │   │   ├── onActivityLogged.ts
│   │   │   └── scheduledAgentRun.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── firestore.rules
├── firebase.json
└── README.md
```

---

## Proposed Changes

### Phase 1 — Project Scaffold & Config

#### [NEW] `app/` — Expo React Native app
- `npx create-expo-app` with TypeScript template
- Install: `nativewind`, `react-navigation`, `react-native-reanimated`, `victory-native`, `lottie-react-native`, `zustand`, `firebase`
- Configure NativeWind with Tailwind config

#### [NEW] `functions/` — Firebase Cloud Functions
- Node.js 18 runtime
- Install: `langchain`, `@langchain/openai`, `firebase-admin`, `firebase-functions`

#### [NEW] `firebase.json` + `firestore.rules`
- Firestore security rules scoped per user
- Functions deployment config

---

### Phase 2 — Emission Calculator Engine

#### [NEW] `app/constants/emissionFactors.ts`
All India-specific emission factors as typed constants:
- Transport: petrol car (0.21), auto (0.09), Ola/Uber (0.14), BMTC (0.04), metro (0.011) kg CO₂/km
- Electricity: 0.71 kg CO₂/kWh (CEA grid factor)
- Food: chicken (0.97), vegetarian (0.35), beef (6.0) kg CO₂/meal

#### [NEW] `app/services/emissionCalculator.ts`
- `calculateEmission(type, subtype, quantity)` → kg CO₂e
- `normalizeToDaily(emission, frequency)` 
- `getCategoryBreakdown(activities[])` → percentages

---

### Phase 3 — Firestore Data Layer

Collections per DB schema in spec:
- `users/{uid}/profile`, `settings`
- `activities/{uid}/{activityId}`
- `nudges/{uid}/{nudgeId}`
- `agent_state/{uid}`
- `weekly_snapshots/{uid}/{weekId}`

#### [NEW] `app/services/firebase.ts`
- Auth: email + Google Sign-In
- Firestore CRUD helpers per collection
- Real-time listener for agent state changes

---

### Phase 4 — Navigation & Screens

#### [NEW] `app/navigation/`
- **Root navigator**: Auth stack → App tabs
- **Tab navigator**: Home | Log | Mirror | Coach | More
- **Stack navigators** per tab for sub-screens

#### [NEW] All 8 Screens with full UI:

| Screen | Key UI Elements |
|--------|----------------|
| Onboarding | 4-step flow: city, vehicle, diet, provider |
| Home Dashboard | Animated emission ring, breakdown donut, nudge card, goal bar |
| Log Activity | 3-tab logger (Transport/Food/Energy), smart defaults by time |
| Carbon Mirror | Full-screen animated card reveal (Reanimated 2) |
| AI Coach Chat | Chat UI, tool-backed responses, typing indicator |
| Challenges | Active/completed list, streak badge, impact counter |
| Offset Center | Remaining footprint, cost calc, partner project cards |
| Settings | Preferences form, diet/vehicle type, goal style |

---

### Phase 5 — AI Agent Layer (Cloud Functions)

#### [NEW] `functions/src/agent/tools.ts`
Implements all 10 agent tools as LangChain `DynamicStructuredTool`:
- `get_user_emission_history` → queries Firestore
- `get_nudge_response_log` → returns nudge state
- `set_weekly_goal`, `send_nudge`, `schedule_challenge`
- `update_goal`, `generate_carbon_mirror`
- `detect_behavioral_patterns`, `flag_high_emission_event`
- `get_city_average_benchmark` → returns hardcoded Bengaluru average (8.5 kg/week)

#### [NEW] `functions/src/agent/agentLoop.ts`
LangChain `createOpenAIFunctionsAgent` with:
- System prompt defining the agent's role and behavioral constraints
- Context object passed each run: current streak, nudge ignore counts, recent activity, patterns
- Adaptive nudge logic: environmental → financial → social → challenge → micro-action

#### [NEW] `functions/src/agent/patternDetector.ts`
- 48-hour background LLM analysis of 14 days of logs
- Returns structured JSON: `{ skippedSustainableChoices, recurringHighEmissions, positiveTrends, recommendedStrategyShift }`

#### [NEW] `functions/src/triggers/`
- `onActivityLogged`: Triggered on new Firestore write → runs lightweight agent nudge decision
- `scheduledAgentRun`: Pub/Sub schedule every 48h → runs full pattern analysis + strategy update

---

### Phase 6 — Carbon Mirror Feature

The weekly "Spotify Wrapped" moment:

**LLM Prompt** → generates:
- Persona name (e.g., "The Reluctant Commuter")
- Top villain activity + exact kg
- Hidden win (something positive they didn't notice)
- One Move (highest-leverage action + projected savings)
- Trajectory vs. city average

**UI** (Carbon Mirror screen):
- Dark background with subtle particle animation
- Glowing emission ring that fills in with `react-native-reanimated`
- Persona name animates in with spring physics
- Stats slide up sequentially with stagger delay
- "Share" button renders as image for social

---

### Phase 7 — Mitigation Features

Contextually triggered by agent, not a static list:
- Metro Route Suggester (after cab log)
- Carpool Detection (repeated route)
- Peak Hour Energy Warnings (6–10pm nudge)
- AC Thermostat suggestion (1°C = ~₹X/month)
- Meal Swap (post high-emission meal)
- BESCOM Solar Nudge (for high-electricity users in Bengaluru)
- Offset Calculator + verified project cards (Gold Standard/Verra)

---

## Open Questions

> [!IMPORTANT]
> **LLM API Key**: Do you have an OpenAI or Anthropic API key ready? The Cloud Functions will need it as an environment variable (`OPENAI_API_KEY` or `ANTHROPIC_API_KEY`).

> [!IMPORTANT]
> **Firebase Project**: Do you have an existing Firebase project, or should the plan include full Firebase initialization steps? (Requires Firebase CLI installed: `npm install -g firebase-tools`)

> [!WARNING]
> **React Native Environment**: Building React Native with Expo requires Node.js ≥ 18 and either Expo Go app on a physical device, or Android Emulator (Android Studio) / iOS Simulator (Mac only). Please confirm your testing setup.

> [!NOTE]
> **Scope Decision**: Given the complexity, I recommend building in this order:
> 1. Full working UI (all 8 screens, navigation, emission calculator) — **can demo offline**
> 2. Firebase Auth + Firestore data layer — enables persistence
> 3. AI agent loop + Cloud Functions — enables real intelligence
> 4. Carbon Mirror animated reveal — the visual showstopper
> Does this priority order work for you?

---

## Verification Plan

### Automated
- Emission calculator unit tests (`jest`) for all India-specific factors
- Firestore security rules validation (`firebase emulators:exec`)

### Manual / Demo
- Full onboarding flow walkthrough
- Log 3 activities across transport/food/energy → verify CO₂ calculation
- Trigger agent run → verify nudge appears on home screen
- Navigate to Carbon Mirror → verify animated reveal works
- Test adaptive framing: log 3 ignored nudges → verify strategy shift in agent state
