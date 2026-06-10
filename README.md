# EduVerse  Application Documentation

EduVerse is a full-stack, modular learning platform powered by React, TypeScript, Tailwind CSS, Express, and Google Gemini. The application is built to accommodate college-level science study through integrated document OCR ingestion simulations, adaptive explanation tuning, spaced-repetition math scheduling via the SM-2 cognitive algorithm, and dynamic dependency mapping of academic concepts.
**Note: Due to high demand, service may be disrupted temporarily!!
**
---
<img width="2879" height="1163" alt="Screenshot 2026-05-26 192149" src="https://github.com/user-attachments/assets/c7ba4b32-4c15-4838-b48a-5db74237228d" />

<img width="2823" height="1390" alt="Screenshot 2026-05-26 192205" src="https://github.com/user-attachments/assets/c9893546-75e9-461e-aa3b-f06fae73c695" />

<img width="2876" height="1160" alt="Screenshot 2026-05-26 192219" src="https://github.com/user-attachments/assets/fa124f91-9259-4065-8ace-d0ad5d7793f6" />

<img width="2725" height="1242" alt="Screenshot 2026-05-26 192235" src="https://github.com/user-attachments/assets/90e53c78-3adb-48b8-9d5b-02d121fb998b" />

<img width="2822" height="1485" alt="Screenshot 2026-05-26 192249" src="https://github.com/user-attachments/assets/dc072ddf-b97d-4a2f-98e7-4c6967846df7" />

<img width="2759" height="1468" alt="Screenshot 2026-05-26 192302" src="https://github.com/user-attachments/assets/190452bc-18eb-45f6-a0fe-1374fb588780" />

<img width="2862" height="1136" alt="Screenshot 2026-05-26 192315" src="https://github.com/user-attachments/assets/0bc905b2-b4ab-4d5e-ae31-b4f2e2b9cfcf" />

<img width="2853" height="999" alt="Screenshot 2026-05-26 192327" src="https://github.com/user-attachments/assets/9fc6411f-4655-426f-9f92-c11e7a908f5c" />

<img width="2876" height="1083" alt="Screenshot 2026-05-26 192340" src="https://github.com/user-attachments/assets/bbdec4a0-d0d9-4986-87f7-ef426431906e" />

<img width="2785" height="1483" alt="Screenshot 2026-05-26 192358" src="https://github.com/user-attachments/assets/7a4c3cc3-04a6-4993-a442-63f220f35d03" />


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

## LICENSE
MIT License

---

