# AuraCast — Autonomous AI Social Marketing Operating System (v2.5)

**AuraCast** is an enterprise-grade, end-to-end autonomous AI marketing operating system. It transforms brand concepts into multi-channel social growth playbooks, custom-branded visual cards, viral text captions, video storyboards, scheduled calendar posts, unified customer inbox management, and revenue conversion analytics.

---

## 🧾 Version History

- **v2.0** — Initial major release with the core AuraCast operating system, onboarding flow, campaign planning, content studio, and social analytics foundation.
- **v2.5** — Latest update with production-ready polish, expanded automation modules, smarter AI workflows, and an improved enterprise-style dashboard experience.

---

## 🌟 What is AuraCast?

AuraCast unifies all disconnected marketing, design, scheduling, and analytics tools into a single cohesive, self-learning AI engine. Whether you are a solo creator, a digital marketing agency, or an enterprise team, AuraCast automates the entire content lifecycle:

$$\text{Strategy Blueprint} \longrightarrow \text{Content Creation} \longrightarrow \text{Automated Scheduling} \longrightarrow \text{Unified Engagement} \longrightarrow \text{Conversion Analytics}$$

---

## 🧭 Multi-Page Navigation Architecture

AuraCast features a professional multi-page navigation system giving marketing teams instant, tabbed access to specialized operation hubs:

| Navigation Tab | Hub Name | Key Capabilities |
| :--- | :--- | :--- |
| **Dashboard** | **Command Center** | AI Marketing Command Center header, step-by-step onboarding guide, Aura Copilot AI Brain, live system telemetry, and 10 OS module shortcuts. |
| **AI Strategy & Campaigns** | **Growth & Strategy Studio** | 30-day brand blueprint generator, Spark Post instant campaign triggers, Autonomous Campaign Builder, A/B Split Testing Studio, and Viral Trend Radar. |
| **Content Studio** | **Visual & Copy Studio** | Interactive graphic card visual builder, AI image generator, multi-channel caption composer (Instagram, TikTok, X, LinkedIn, Facebook, WhatsApp), and AI Video Studio. |
| **Calendar & Schedule** | **Content Planner** | Interactive chronological 7-day content planner, drag-and-drop rescheduling, multi-channel batch publishing, and dispatch status logs. |
| **Social Inbox** | **Unified Inbox** | Centralized cross-platform message center, AI smart reply generator, audience sentiment tagger, and response automation. |
| **Analytics & Intelligence** | **Performance Hub** | Interactive Recharts multi-platform engagement trends, CSV metric export, competitor benchmark matrix, and lead/revenue conversion tracker. |
| **Team & Settings** | **Collaboration & Brand Kit** | Member invitation pipeline, role management (Owner, Admin, Editor, Viewer), editorial approval workflows, and Brand Kit manager. |
| **Developer API** | **Developer Hub** | Custom API key generator, webhook endpoint manager, rate limits, enterprise security vault, and developer documentation. |

---

## 🚀 Key Feature Pillar Highlights

### 1. ⚡ AI Marketing Command Center
- **Unified Master Header**: Real-time stats on connected channels, weekly active posts, and active brand identity.
- **Interactive Onboarding Walkthrough**: Step-by-step checklist guiding team members from initial brand setup to first auto-scheduled campaign.
- **Aura Copilot Brain**: Embedded AI Assistant capable of generating post ideas, answering marketing strategy questions, and injecting recommendations directly into active workspaces.

### 2. 🧠 AI Marketing Strategy & Campaign Engine
- **30-Day Growth Roadmap**: Generates a weekly structured execution strategy customized to your brand, niche, target audience, and primary growth goals.
- **Spark Post Execution**: Click "Spark Post" on any strategy prompt to instantly jump into the Content Studio with pre-filled content templates ready to generate.
- **Autonomous Campaign Builder**: Auto-generates multi-week themed campaigns complete with viral hooks, visual directions, and approval toggles.

### 3. 🎨 Content Studio & AI Video Studio
- **Custom Branded Graphic Cards**: Generates high-impact visual quote cards, carousels, and promo images formatted for all major aspect ratios.
- **AI Image Generator**: Integrates server-side Gemini AI image generation for custom hero visual assets.
- **AI Video Studio**: Drafts scene-by-scene video scripts, voiceover narration prompts, visual shot directions, and audio preview controls.
- **Multi-Platform Captions**: Generates platform-tailored copy with hashtags for Instagram, TikTok, Twitter/X, Facebook, WhatsApp, and LinkedIn.

### 4. 📅 Interactive Content Calendar & Scheduler
- **Rolling 7-Day Scheduler**: Plan content across the upcoming week with visual channel badges and status indicators (`Draft`, `Scheduled`, `Published`).
- **One-Click Multi-Channel Dispatch**: Publish content simultaneously to connected accounts or schedule for automated dispatch at optimal engagement times.

### 5. 💬 Unified Cross-Platform Social Inbox
- **Centralized Messaging**: View incoming comments and direct messages from Instagram, X, Facebook, and LinkedIn in one feed.
- **AI Smart Replies**: Click to get AI-suggested personalized responses based on the commenter's tone and intent.
- **Sentiment Analysis**: Automatically categorizes customer messages as positive, neutral, or inquisitive.

### 6. 👥 Team Collaboration & Editorial Approval Workflows
- **Role-Based Access Control**: Assign granular permissions to team members (**Owner**, **Admin**, **Editor**, **Viewer**).
- **Editorial Sign-Off Pipeline**: Require manager or client approval before content transitions from `Draft` to `Scheduled`.
- **Brand Kit Enforcement**: Global vault for brand colors, logos, voice guidelines, and target persona rules automatically applied to all generated assets.

### 7. 📊 Analytics, Competitor Benchmark & Revenue Tracking
- **Interactive Recharts Engagement Dashboard**: Area chart visualization for comment and engagement velocity across Twitter, Instagram, and Facebook.
- **CSV Data Export**: Download structured engagement reports with a single click.
- **Competitor Benchmark Matrix**: Monitor competitor posting frequency, estimated reach, and share of voice.
- **Full-Funnel Lead & Conversion Tracker**: Measure click-through rates, form signups, and direct revenue attribution.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (Data Visualizations), Framer Motion animations.
- **Backend**: Express.js server on Node (`server.ts`), compiled to `dist/server.cjs` via `esbuild`.
- **Database & Auth**: Firebase Firestore and Firebase Authentication with local state fallback.
- **AI Engine**: `@google/genai` TypeScript SDK with server-side API proxying for security.

---

## 🔑 Environment Variables Setup

Create a `.env` or declare environment variables in your deployment setup:

```env
# .env.example
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

> **Note**: Secrets such as `GEMINI_API_KEY` are strictly maintained on the server side (`server.ts`) and are never exposed to client-side browser code.

---

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
npm start
```
This builds the production static assets and bundles the backend server to `dist/server.cjs`.

---

## 📄 License & Attribution
AuraCast © 2026. All Rights Reserved. Built with React, Tailwind CSS, Firebase, and Gemini AI.

