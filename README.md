# 🔍 Carbon Lens — Track · Reflect · Reduce

A sleek, AI-powered carbon footprint tracker built for urban India. Log your daily habits, get a weekly **Carbon Mirror** persona, and let Claude nudge you toward lower-impact choices.

[![React](https://img.shields.io/badge/React_18-Frontend-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Typed-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-Build-purple?logo=vite)](https://vitejs.dev)
[![Claude AI](https://img.shields.io/badge/Claude_AI-Anthropic-orange)](https://www.anthropic.com)
[![Zustand](https://img.shields.io/badge/Zustand-State-brown)](https://zustand-demo.pmnd.rs)
[![Recharts](https://img.shields.io/badge/Recharts-Charts-red?logo=chartdotjs)](https://recharts.org)
[![Lucide](https://img.shields.io/badge/Lucide-Icons-gray?logo=lucide)](https://lucide.dev)

---

## ✨ Features

- **🇮🇳 India-Specific Emission Engine:** Accurate CO₂e scores using local grid factors (BESCOM, MSEDCL, TNEB), Indian transit modes (Namma Metro, BMTC, Auto Rickshaw), and regional diet profiles.
- **✦ The Carbon Mirror:** A Spotify Wrapped–style weekly review that generates your AI persona (e.g., *"The Reluctant Commuter"*), names your top villain activity, and proposes your single highest-leverage habit swap.
- **🤖 Claude-Powered Coaching:** Chat with an AI coach that reads your 14-day history and gives hyper-local, context-aware advice — not generic tips.
- **🎯 Adaptive Challenges:** Streak goals auto-generated from your behavioral patterns. If cabs dominate your footprint, you'll get a Metro challenge — not a generic one.
- **🌓 Light & Dark Mode:** Full theme switching with a rich `#190019 → #FBE4D8` purple-mauve palette.

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/carbon-lens.git
   cd carbon-lens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API key (optional):**
   The app ships with a Smart Demo Mode and graceful AI fallbacks — no key needed to explore. For live AI features, copy the env template:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and add your key:
   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```

4. **Run the dev server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173). On desktop, the app frames itself inside a 390×844 iOS-style viewport automatically.

---

## 📂 Project Structure

```
carbon-lens/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/       # TabBar, EmissionRing, NudgeCard
│   ├── constants/        # emissionFactors.ts
│   ├── screens/          # All app screens
│   ├── services/         # agentService, emissionCalculator
│   ├── store/            # useStore (Zustand)
│   ├── App.tsx
│   ├── index.css         # Full design system & theme vars
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

---

*See the patterns. Shift the habit. 🌍*
