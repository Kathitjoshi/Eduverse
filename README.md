# EduVerse Application Documentation

EduVerse is a full-stack, modular learning platform powered by React, TypeScript, Tailwind CSS, Express, and Google Gemini. The application is built to accommodate college-level science study through integrated document OCR ingestion simulations, adaptive explanation tuning, spaced-repetition math scheduling via the SM-2 cognitive algorithm, and dynamic dependency mapping of academic concepts.

---

## Technical Overview

The application features a performance-optimized client-side single-page architecture (SPA) that can optionally bind to an Express server backend for secure API routing. Key metrics and student state persist inside local memory scopes to give users instant access without requiring signups or account verification.

---

## Directory Structure and File Responsibilities

Below is an overview of the organization of the codebase:

```text
/
├── .env.example             # Template for required environment variables (e.g., GEMINI_API_KEY)
├── .gitignore               # Ignored build artifacts, dependencies, and environment files
├── README.md                # System documentation, deployment guides, and execution scripts
├── index.html               # Primary HTML mount and viewport meta settings
├── package.json             # Build commands, scripts, and runtime dependencies
├── server.ts                # Full-stack Express server and development middleware configuration
├── tsconfig.json            # TypeScript compiler configuration parameters
├── vite.config.ts           # Vite bundler options and client application settings
└── src/                     # Client application source directory
    ├── App.tsx              # Root application component containing core views and tabs
    ├── index.css            # Styles, tailwind directives, scrollbar configurations, and keyframes
    ├── main.tsx             # Entry point file mounting the application to index.html
    ├── types.ts             # Shared database models, interfaces, and study deck types
    └── components/          # Extracted modular elements and user interface dashboards
        ├── AIPreviewShowcase.tsx   # Simulated chatbot request-and-response component
        ├── BackgroundParticles.tsx # Interactive background canvas rendering academic glyphs
        ├── FlashcardReview.tsx     # Leitner card study deck interface with SM-2 score controls
        ├── HomeFAQs.tsx            # Frequently asked questions component with animated dropdowns
        ├── HomeSandbox.tsx         # Spaced repetition calculator and OCR laser scan emulator
        ├── KnowledgeGraph.tsx      # SVG concept map with node selection and dependency highlights
        ├── Leaderboard.tsx         # Interactive student scoreboards and performance logs
        ├── Navbar.tsx              # Modular header navigation drawer
        ├── ProgressTracker.tsx     # Conceptual completion lists and active study timer
        ├── SnapAnalyze.tsx         # Handwritten notes and formula uploader interface
        └── TutorChat.tsx           # Conversations channel with AI tutor and automated prompts
```

---

## Storage and State Management Architecture

To ensure high-speed client interactions and ease of use, all memory structures are configured as follows:

*   **Runtime Context Layer**: Current tabs, active chat backlogs, and customized visual explanations are bound to React component states.
*   **In-Memory Storage Pools**: Flashcard review dates, Ease Factor values, quality ratings, and custom user questions are preserved across session lifetimes. Interval variables dynamically scale or shrink after scoring reviews.

---

## Compilation and Development Setup

Follow these steps to configure your environment and run the application locally:

### 1. Install Dependencies
Run the package installation command to download and compile the node modules:
```bash
npm install
```

### 2. Configure Environment Variables
You can specify real Google Gemini API keys in a `.env` file at the root level of the folder structure:
```env
GEMINI_API_KEY="AIzaSyYourActualGoogleGeminiKey"
```
*Note: If no key is provided, the application switches gracefully to client-side simulated response parameters so that all features remain accessible.*

### 3. Start the Development Server
This runs Vite combined with the full-stack entry point on port 3000:
```bash
npm run dev
```

### 4. Code Production Build
To build the application for deployment into production, execute:
```bash
npm run build
npm start
```

---

## Deployment Strategy

EduVerse can be deployed to web hosting providers in under five minutes.

### Static SPA Providers (Render, Vercel, Netlify)
If running purely as a static frontend application:
1. Push the code to a GitHub repository.
2. Connect the repository to Vercel, Netlify, or Render.
3. Configure the **Build Command** to: `npm run build`
4. Configure the **Output Directory** to: `dist`
5. If utilizing a client-side environment key, pass `VITE_GEMINI_API_KEY` through the provider's Environment Variables panel.

### Full-Stack Servers (Render Web Service, Cloud Run)
To run both backend server endpoints and the compiled client files synchronously:
1. Ensure the port environment variable dynamically maps to `PORT` on the hosting container.
2. Configure **Build Command** to: `npm run build`
3. Configure the **Start Command** to: `npm run start` (which fires `node dist/server.cjs`).
4. Set the `GEMINI_API_KEY` securely in the provider's secret configuration dashboard.
