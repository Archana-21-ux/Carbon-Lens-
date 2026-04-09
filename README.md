# 🌱 AI Climate Agent (India Edition)

An intelligent, zero-friction, behavior-adaptive carbon footprint tracker actively tailored for the urban Indian context. This mobile-first React application ditches static guilt-tripping in favor of an **AI Agentive Feedback Loop** that tracks your routines, calculates precise local emissions, and deploys context-aware nudges.

![App Dashboard Showcase](https://via.placeholder.com/800x400/0a0f1e/4ade80?text=AI+Climate+Agent)

## ✨ Core Features

*   **🇮🇳 India-Specific Emission Engine:** Calculates accurate CO₂e based on local data. Supports custom grid factors (e.g., BESCOM, MSEDCL), local transit modes (Namma Metro, BMTC, Auto Rickshaws), and Indian dietary profiles (Eggetarian vs. Mixed).
*   **🤖 Claude-Powered Patterns & Coaching:** Integrated directly via Anthropic's Claude 3.5 Sonnet to detect 14-day behavioral trends and allow you to dynamically chat for specific, hyper-local advice.
*   **✨ The "Carbon Mirror":** A visually striking, Spotify-Wrapped-style animated weekly review that generates an AI persona for you (e.g., "The Reluctant Commuter"), identifies your "Top Villain" activity, and proposes your highest-leverage lifestyle tweak.
*   **🎯 Adaptive AI Challenges:** Generates personalized streak goals reading from your behavioral patterns (e.g., swapping short Ola rides for the Metro if transport is your heaviest slice).
*   **📱 Stunning Mobile-First UI:** Built on a proprietary dark-mode interface with glassmorphism, micro-animations, and a highly polished floating tab bar structure (with seamless desktop framing).

## 🛠 Tech Stack

*   **Framework:** React 18 + TypeScript + Vite
*   **State Management:** Zustand (with Persist Middleware for zero-backend `localStorage` sync)
*   **Data Visualization:** Recharts (Responsive bar and ring chart trends)
*   **Icons & Assets:** Lucide React
*   **AI Integration:** Anthropic API (`claude-3-5-sonnet-20241022`) with built-in graceful smart fallbacks for offline/no-credit scenarios.
*   **Styling:** Custom fluid CSS design system (`index.css`), entirely utility-based and component-driven without heavy UI libraries.

## 🚀 Quick Start

1.  **Clone down the application**

```bash
git clone <repository_url>
cd carbonfootprint-app
```

2.  **Install exactly required dependencies:**
```bash
npm install
```

3.  **Setup the AI Environment (Optional):**
    The app comes pre-configured with a "Smart Demo Mode" loaded with realistic responses for testing. To use full live AI inference, copy the environment template:
```bash
cp .env.example .env
```
Open `.env` and paste your Anthropic API Key:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

4.  **Run the local Dev Server:**
```bash
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser. 
*(Note: If viewing on a desktop, the layout will elegantly frame itself inside an interactive iOS-style 390x844 pixel viewport wrapper).*

## 🧠 Application Architecture Summary

*   **`store/useStore.ts`**: The pulse of the application. Handles persistent user profiles, historical logs array, completed challenges, and state logic for the AI reasoning agent.
*   **`services/emissionCalculator.ts`**: Contains exact scalar modifiers for kg CO₂. Used to accurately score short-cab rides, high-peak electricity usage, and vegan vs meat food logic.
*   **`services/agentService.ts`**: Bridges the application to Claude AI. Translates UI state into structured JSON requests and dynamically interprets JSON completions into state changes (e.g., automatically pivoting nudge strategies from "Environmental" to "Financial" after consecutive ignored prompts).
*   **`components/DesktopFrame.tsx` / `App.tsx`**: Creates the seamless watermark wrapper bounding so that user experience is visually pristine regardless of browser window scale.

## 🤝 Contributing

This app represents an innovative look into how LLMs can escape the "chat box" and silently facilitate gamified habit development apps. Feel free to fork, add more dynamic APIs (e.g., live grid emission tracking APIs for Indian states), or port the logic to React Native.

---
*Built for the planet. Fueled by Artificial Intelligence.*
