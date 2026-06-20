# RoadSentinel AI (TrafficVision AI)

RoadSentinel AI is a high-performance web console for an automated traffic violation detection system. It monitors camera streams and uploaded footage to flag helmet violations, triple riding, illegal parking, wrong-lane driving, and signal jumps, generating explaining evidence packs with automatic number plate recognition (ANPR/OCR).

---

## 🎨 Design Theme: Glassmorphism

The dashboard is styled with a premium, consumer-gadget style **glassmorphism UI** refracting an aerial dark city night junction background. 

* **Translucent Frosted Cards**: Dense black-tinted backing overlays with high backdrop blurs (`25px`–`32px`) and bright border glows.
* **Light-Catching Highlights**: Upper and left-edge gradient hairline borders on all elements using absolute pseudo-elements.
* **Minimalist High-Contrast CTAs**: Sleek solid-white calls-to-action with dark typography next to glass-bordered buttons.
* **Responsive Sidebar & Header**: A floating desktop layout that seamlessly transitions into a menu drawer for tablet and mobile viewports.

---

## 🛠️ Technology Stack

* **Core**: React 19 + TypeScript
* **Routing**: TanStack Router (File-based routing)
* **Data Fetching**: TanStack Query (React Query)
* **Styling**: Tailwind CSS v4 + Vanilla CSS highlights
* **Icons**: React Icons (Feather Icons)
* **Charts**: Recharts
* **Components**: Custom styled shadcn/ui primitives

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed. Alternatively, you can use **Bun**.

### 2. Installation

Clone the repository and install all dependencies:

```bash
npm install
```

---

## 💻 Commands Reference

### Development Server
Starts the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
*Once running, navigate to `http://localhost:8080` in your browser.*

### Production Build
Compiles and bundles the application for production deployment:
```bash
npm run build
```

### Development Build
Compiles and bundles the application in development mode (preserving source maps, etc.):
```bash
npm run build:dev
```

### Preview Build
Locally previews the compiled production build:
```bash
npm run preview
```

### Code Formatting
Formats all source files with Prettier:
```bash
npm run format
```

### Linting
Runs ESLint check to find syntax or coding standard issues:
```bash
npm run lint
```
