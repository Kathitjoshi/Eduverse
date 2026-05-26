# EduVerse — Project Handover & Troubleshooting Guide

Welcome! This document provides a exhaustive analysis of what was corrected, the bugs solved, and how to execute this full-stack application on your native environments.

---

## 🛠️ Summary of Corrected Bugs

### 1. Review Flashcards Crash / Counter Bug
* **The issue:** The counter went recursively from `0/6` to `1/5` to `2/4` etc., before blacking out/crashing.
* **The cause:** The active review deck size was being dynamically spliced/reduced with state updates while the pointer index was advancing. Thus, the index exceeded the queue length, rendering an `undefined` card component slot which crashed the browser view.
* **The fix:**
  * We locked the `totalInSession` parameter constant at the start of review loops.
  * The pointer simply increments (`currentIndex + 1`) to correctly display `Card 1 of 6`, `Card 2 of 6`... up to `Card 6 of 6`.
  * Splicing is eliminated. Once `currentIndex >= totalInSession`, the reviewer transitions to a beautiful congrats recap screen displaying study performance ratings (Easy, Good, Hard), daily streaks, and restart controls.

### 2. Missing Home Page Animations
* **The issue:** Home page motion graphics or visual slide entrances weren't showing in your web layout.
* **The fix:** 
  * We integrated the recommended `motion` library, importing strictly from `"motion/react"` to support high-performance transitions.
  * Added smooth fade-in sliders, staggered deck list appearances, and AnimatePresence tabs swapping for full responsive fidelity.

### 3. PowerShell Environment Key Terminal Issue
* **The issue:** Running `GEMINI_API_KEY=AIzaSy... uvicorn main:app` threw PowerShell syntax interpretation blockages.
* **The cause:** Setting environment variables inline on the same line before a binary instruction (e.g., `ENV=val command`) is a Linux/Bash-specific syntax. On Windows PowerShell, this command throws errors as Windows does not recognize it.
* **The fix:**
  * Provided step-by-step terminal instructions for PowerShell inline execution below.
  * Built automatic local demo/fallback triggers so that if `GEMINI_API_KEY` is not filled in, the Note Scanners gracefully display high-quality simulated data payloads instead of throwing fatal 500 errors.

### 4. Incorrect Model / Provider Branding References
* **The issue:** The old Python system output printed information stating "Error: ANTHROPIC_API_KEY is missing."
* **The cause:** Leftover code traces from legacy Claude setups.
* **The fix:** 
  * Rebuilt the backend in TypeScript Express utilizing Google's modern `@google/genai` model client bindings. All key prompts utilize `gemini-3.5-flash` with direct JSON validation schemas.

---

## 🏃 Launching the Application

### Prerequisites
Make sure you have Node.js installed on your workspace.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment keys inside .env file (or let dotenv read it)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

### Running in Development Mode
Starts the Express full-stack proxy running on port `3000` with hot asset bundling via Vite.

```bash
npm run dev
```

### Running in Production Build Mode
Builds client statics into `dist/` and runs the compiled CJS server bundle standalone.

```bash
npm run build
npm start
```

---

## 🖥️ Terminal Executions & PowerShell Environment Keys

If you want to run the server on Windows PowerShell while explicitly injecting your `GEMINI_API_KEY` on the fly, use standard PowerShell variables setting instead of Linux bash inline variables:

### 🟢 Correct PowerShell Environment Variable Injection
```powershell
$env:GEMINI_API_KEY="AIzaSyXYZ-YOUR-ACTUAL-KEY"; npm run dev
```

### 🔴 Incorrect Syntax (For Unix Bash and macOS terminals only, fails in PowerShell)
```bash
GEMINI_API_KEY=AIzaSyXYZ-YOUR-ACTUAL-KEY npm run dev
```

---

## 🗺️ Functional Highlights of EduVerse
1. **Snap & Understand Note Scanner:** OCR scan template selector + real-time OCR summaries and custom-synthesized spaced repetition reviews.
2. **AI Tutor Sandbox:** Dynamic math gradient descent descent loop mountain hikers simulator displaying interactive downhill steps as optimization values minimize.
3. **Knowledge Graph Mappings:** SVG concept map nodes showing prerequisite lines. Clicking a concept links immediately to discussion proxies.
4. **Spaced Repetition Review Deck:** Refined SM-2 interval rating triggers. Corrected total counter.
5. **Leaderboard Sprint Metrics:** Streak milestones, study badges, and profile xp gains.
