import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  FileText, 
  Layers, 
  RotateCcw, 
  Brain, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  Heart, 
  HelpCircle, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Cpu,
  GraduationCap
} from "lucide-react";

// Ticker keywords representing core topics for study subjects:
const TICKER_TOPICS = [
  { text: "Gradient Descent Optimization", cat: "Machine Learning" },
  { text: "Red-Black Tree Insertion", cat: "DSA" },
  { text: "Euler's Identity & Calculus", cat: "Mathematics" },
  { text: "Register Interference Maps", cat: "Compilers" },
  { text: "Quantum Superposition State", cat: "Physics" },
  { text: "SM-2 Leitner Retentions", cat: "Spaced Rep" },
  { text: "Backpropagation Graph Chaining", cat: "Deep Learning" },
  { text: "Fourier Transform Matrix", cat: "Signals" },
  { text: "Dijkstra's Pathfinding", cat: "Algorithms" },
  { text: "Organic Chemistry Esterification", cat: "Chemistry" }
];

export default function HomeSandbox({ onNavigateToTab }: { onNavigateToTab: (tab: string, initialSubject?: string) => void }) {
  // OCR Scan Simulation states
  const [activeScanItem, setActiveScanItem] = useState(0);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanPercentage, setScanPercentage] = useState(0);

  const scanOptions = [
    {
      title: "Complex Calculus Sheet",
      excerpt: "e^(i*pi) + 1 = 0",
      subject: "Mathematical Calculus",
      definition: "Euler's Identity bridges transcendental numbers (e, pi) and imaginary unit (i) symmetrically.",
      question: "What is Euler's identity and what does it connect?",
      answer: "e^(i*pi) + 1 = 0, connecting fundamental numbers e, i, pi, 1, and 0 in complex analytical geometry."
    },
    {
      title: "Backpropagation Note",
      excerpt: "dLoss/dWeight = (dLoss/dOut) * (dOut/dWeight)",
      subject: "Machine Learning Theory",
      definition: "The chain rule calculates gradient vectors backwards through network neural junctions.",
      question: "Explain the chain rule inside artificial neural networks.",
      answer: "Backpropagation applies mathematical matrix derivative chains recursively from final loss layers to previous nodes."
    },
    {
      title: "Syntax State Table",
      excerpt: "Action: Shift 2, Reduce 4 with LL(1) parse lookup",
      subject: "Compilers",
      definition: "Predictive syntax parsing compiles source files into abstract syntax syntax trees.",
      question: "How does LL(1) differ from LR(1) syntax validation?",
      answer: "LL(1) predicts grammar matches top-down (left-most), whereas LR(1) parses bottom-up using shift-reduce tables."
    }
  ];

  // Run the mock scanner
  const triggerScan = () => {
    setScanStatus("scanning");
    setScanPercentage(0);
    const interval = setInterval(() => {
      setScanPercentage((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setScanStatus("completed");
          return 100;
        }
        return p + 4;
      });
    }, 50);
  };

  useEffect(() => {
    if (scanStatus === "scanning") {
      // resets when user shifts items
    }
  }, [activeScanItem]);

  // Explanation Tone states
  const [activeTone, setActiveTone] = useState<"kids" | "expert" | "analogy" | "visual">("visual");

  // Spaced repetition calculator states
  const [qualityRating, setQualityRating] = useState<number>(4);
  const [cardInterval, setCardInterval] = useState<number>(6);
  const [cardEF, setCardEF] = useState<number>(2.50);

  const calculateSM2 = (q: number) => {
    setQualityRating(q);
    // Standard SM-2 simulated algorithm values
    let nextEF = Number((cardEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))).toFixed(2));
    if (nextEF < 1.3) nextEF = 1.3;
    setCardEF(nextEF);
    
    let nextInterval = 1;
    if (q >= 3) {
      if (cardInterval === 1) nextInterval = 6;
      else nextInterval = Math.round(cardInterval * nextEF);
    } else {
      nextInterval = 1;
    }
    setCardInterval(nextInterval);
  };

  return (
    <div className="w-full space-y-16">
      
      {/* INFINITE SCROLLING TICKER */}
      <div className="relative w-full overflow-hidden py-3 bg-white/[0.02] border-y border-white/5">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-[#07080a] to-transparent bg-gradient-to-r z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-[#07080a] to-transparent bg-gradient-to-l z-10 pointer-events-none" />
        
        {/* Infinite CSS horizontal loop alignment */}
        <div className="animate-marquee-loop flex gap-8">
          {/* First iteration of ticker rows */}
          <div className="flex gap-8 flex-shrink-0">
            {TICKER_TOPICS.map((topic, i) => (
              <div key={`t1-${i}`} className="inline-flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8f56a]" />
                <span className="font-mono text-gray-500 uppercase tracking-widest">{topic.cat}:</span>
                <span className="text-[#f0eee8] font-bold tracking-wide">{topic.text}</span>
              </div>
            ))}
          </div>
          {/* Second identical iteration for perfect layout seamless wrap */}
          <div className="flex gap-8 flex-shrink-0">
            {TICKER_TOPICS.map((topic, i) => (
              <div key={`t2-${i}`} className="inline-flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8f56a]" />
                <span className="font-mono text-gray-500 uppercase tracking-widest">{topic.cat}:</span>
                <span className="text-[#f0eee8] font-bold tracking-wide">{topic.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLYWHEEL WORKFLOW: HOW IT WORKS */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8f56a] font-bold">The EduVerse Cycle</span>
          <h3 className="font-serif text-3xl font-bold mt-1 text-[#f0eee8]">How it works</h3>
          <p className="text-xs text-[#8a8d99] max-w-lg mx-auto mt-2">
            EduVerse parses notes, diagrams, and textbook chapters to build continuous personalized learning curves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Snap Notes",
              desc: "Upload handwritten materials, textbook chapters or diagrams directly to the AI.",
              color: "text-[#c8f56a] border-[#c8f56a]/20 bg-[#c8f56a]/5"
            },
            {
              step: "02",
              title: "Semantic Mappings",
              desc: "Gemini places ideas auto-categorized into an interactive concept tree.",
              color: "text-[#7dd9b8] border-[#7dd9b8]/20 bg-[#7dd9b8]/5"
            },
            {
              step: "03",
              title: "AI Dialogues",
              desc: "Receive customized, level-attuned explanations and test vectors.",
              color: "text-[#f0c46a] border-[#f0c46a]/20 bg-[#f0c46a]/5"
            },
            {
              step: "04",
              title: "Optimal Recall",
              desc: "Study cards scheduled mathematically via cognitive SM-2 algorithm intervals.",
              color: "text-[#b8a0f0] border-[#b8a0f0]/20 bg-[#b8a0f0]/5"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#13161c] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group hover:translate-y-[-2px] relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${item.color}`}>
                  Step {item.step}
                </span>
                <span className="text-[10px] text-gray-600 font-mono">Live Sync</span>
              </div>
              <h4 className="text-sm font-bold text-[#f0eee8] mb-1.5 group-hover:text-[#c8f56a] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-[#8a8d99] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CORE SANDBOX COMPONENT: SCANNER & EXPLANATION EXPERT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* INTERACTIVE OCR SIMULATOR (5 Cols) */}
        <div className="lg:col-span-6 bg-[#13161c] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#c8f56a] font-mono uppercase tracking-wider font-bold">
              <Cpu className="w-4 h-4" />
              <span>Snap &amp; Understand Sandbox</span>
            </div>
            <h4 className="font-serif text-xl font-bold text-[#f0eee8]">Interactive Note Ingester</h4>
            <p className="text-xs text-[#8a8d99]">
              Replicate the photo-scan ingredient breakdown. Select a notebook cheat-sheet template to trigger simulated lasers.
            </p>
          </div>

          {/* Selection pills */}
          <div className="flex gap-2 justify-start overflow-x-auto pb-1">
            {scanOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveScanItem(i);
                  setScanStatus("idle");
                  setScanPercentage(0);
                }}
                className={`flex-shrink-0 text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                  activeScanItem === i 
                    ? "bg-[#c8f56a]/10 border-[#c8f56a]/30 text-[#c8f56a]" 
                    : "bg-black/20 border-white/5 text-gray-500 hover:text-gray-300"
                }`}
              >
                {opt.title}
              </button>
            ))}
          </div>

          {/* Notebook Sheet mockup with scanning animation */}
          <div className="relative bg-black/40 border border-white/5 rounded-2xl h-36 p-4 overflow-hidden flex flex-col justify-between">
            {/* Green laser beam overlay */}
            {scanStatus === "scanning" && (
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c8f56a] to-transparent shadow-[0_0_15px_#c8f56a] z-20"
                style={{ top: `${scanPercentage}%` }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}

            {/* Glowing sheet layout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-[#8a8d99] uppercase tracking-widest">
                  Input Note Document
                </span>
                <span className="text-[9px] font-mono text-[#c8f56a]">
                  {scanStatus === "scanning" ? `Scanning (${scanPercentage}%)` : scanStatus === "completed" ? "Decoded 100%" : "Ready"}
                </span>
              </div>
              <div className="font-mono text-xs text-[#f0eee8] bg-black/50 p-2 rounded border border-white/5 italic">
                {scanOptions[activeScanItem].excerpt}
              </div>
            </div>

            <p className="text-[10px] text-[#8a8d99] italic line-clamp-2">
              "...{scanOptions[activeScanItem].definition} These variables indicate structural concepts inside academic subjects..."
            </p>

            {/* Trigger control */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
              <span className="text-[9px] font-mono text-gray-600">OCR Vector mapping model</span>
              <button
                type="button"
                onClick={triggerScan}
                disabled={scanStatus === "scanning"}
                className="bg-[#c8f56a] hover:bg-[#c8f56a]/90 text-[#07080a] font-mono text-[10px] font-bold px-3 py-1 rounded transition-all active:scale-95 disabled:opacity-40"
              >
                {scanStatus === "scanning" ? "Running OCR..." : "Simulate Raster Scan"}
              </button>
            </div>
          </div>

          {/* Results display box under scanner */}
          <div className="bg-black/20 rounded-2xl border border-white/5 p-4 min-h-24 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {scanStatus === "idle" && (
                <div className="text-center space-y-1">
                  <FileText className="w-5 h-5 text-gray-700 mx-auto" />
                  <span className="text-[11px] text-gray-500 block font-mono">Telemetry Station Idle</span>
                </div>
              )}
              {scanStatus === "scanning" && (
                <div className="text-center space-y-1 animate-pulse">
                  <Sparkles className="w-5 h-5 text-[#c8f56a] mx-auto animate-spin" />
                  <span className="text-[11px] text-[#c8f56a] block font-mono">Running neural structural extraction...</span>
                </div>
              )}
              {scanStatus === "completed" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[10px] text-[#7dd9b8] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Concept Identified
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{scanOptions[activeScanItem].subject}</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#f0eee8]">{scanOptions[activeScanItem].title}</h5>
                    <p className="text-[11px] text-[#8a8d99] leading-relaxed mt-1">
                      {scanOptions[activeScanItem].definition}
                    </p>
                  </div>
                  <div className="bg-[#7dd9b8]/5 border border-[#7dd9b8]/15 rounded-xl p-2.5 space-y-1 text-[10px]">
                    <span className="text-[#7dd9b8] font-semibold block uppercase">Card added directly to Spaced Repetition deck:</span>
                    <p className="text-[#f0eee8]"><strong className="text-gray-400">Q:</strong> {scanOptions[activeScanItem].question}</p>
                    <p className="text-[#8a8d99]"><strong className="text-gray-400">A:</strong> {scanOptions[activeScanItem].answer}</p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab("review")}
                    className="w-full bg-white/5 hover:bg-white/10 text-[10px] text-[#c8f56a] font-mono py-1 rounded transition-colors text-center"
                  >
                    Go to Review Decks &rarr;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* TONAL EXPLANATION SIMULATOR (7 Cols) */}
        <div className="lg:col-span-6 bg-[#13161c] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#7dd9b8] font-mono uppercase tracking-wider font-bold">
              <Brain className="w-4 h-4" />
              <span>Adaptive Explanation Tuner</span>
            </div>
            <h4 className="font-serif text-xl font-bold text-[#f0eee8]">AI Context Realignment</h4>
            <p className="text-xs text-[#8a8d99]">
              Change the target delivery profile below and watch how the AI adjusts math visuals, graphics and complexity coefficients on the fly.
            </p>
          </div>

          {/* Explanation profile selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "visual", label: "Visual Learner", icon: "📐" },
              { id: "kids", label: "To a 5yo", icon: "🍭" },
              { id: "expert", label: "Technical Expert", icon: "🔬" },
              { id: "analogy", label: "Analogy Maker", icon: "🎭" }
            ].map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => setActiveTone(tone.id as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  activeTone === tone.id 
                    ? "bg-[#7dd9b8]/10 border-[#7dd9b8]/30 text-[#7dd9b8] scale-[1.03]" 
                    : "bg-black/20 border-white/5 text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="text-base mb-1">{tone.icon}</span>
                <span className="text-[10px] font-mono leading-none">{tone.label}</span>
              </button>
            ))}
          </div>

          {/* Display graphic block */}
          <div className="bg-[#07080a] border border-white/5 rounded-2xl p-4 min-h-36 flex flex-col justify-between relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {activeTone === "visual" && (
                <motion.div 
                  key="visual-tone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-2 h-full flex flex-col justify-between"
                >
                  <span className="text-[9px] font-mono text-[#7dd9b8] uppercase">Visual Landscape (Minimization Descent)</span>
                  <div className="h-16 flex items-end justify-center gap-0.5 border-b border-white/5 pb-1">
                    {[32, 24, 18, 12, 8, 4, 2, 1, 4, 10, 16, 22].map((height, idx) => (
                      <div key={idx} className="flex-1 bg-gradient-to-t from-[#7dd9b8] to-transparent rounded-t" style={{ height: `${height * 1.5}px` }}>
                        {idx === 7 && <span className="w-1.5 h-1.5 rounded-full bg-[#c8f56a] block mx-auto -mt-2 animate-ping" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#8a8d99] italic text-center">
                    "Step vectors cascade down high loss mountain ridges direct to a global absolute valley minima point."
                  </p>
                </motion.div>
              )}

              {activeTone === "kids" && (
                <motion.div 
                  key="kids-tone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-3"
                >
                  <span className="text-[9px] font-mono text-[#f0c46a] uppercase">Simplicity analogue</span>
                  <div className="flex items-center justify-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-2xl">🏈 &rarr; 🕳️</span>
                    <span className="text-[10px] font-mono text-[#8a8d99]">Like dropping a toy ball in a clean round soup bowl.</span>
                  </div>
                  <p className="text-[11px] text-[#8a8d99] italic text-center">
                    "Gradient descent is just a heavy rolling bowling ball looking for the absolute lowest deep spot of a curved hill so it can rest!"
                  </p>
                </motion.div>
              )}

              {activeTone === "expert" && (
                <motion.div 
                  key="expert-tone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-2"
                >
                  <span className="text-[9px] font-mono text-[#b8a0f0] uppercase">Mathematical Rigorous Formulation</span>
                  <div className="bg-black/50 p-2 rounded-xl border border-white/5 text-center font-mono text-xs text-[#b8a0f0]">
                    &theta;<sub>next</sub> = &theta;<sub>prev</sub> - &eta; &nabla; J(&theta;<sub>prev</sub>)
                  </div>
                  <p className="text-[11px] text-[#8a8d99] italic text-center leading-relaxed">
                    "We approximate coordinate directions utilizing steep derivatives of partial differentiations along custom vectors."
                  </p>
                </motion.div>
              )}

              {activeTone === "analogy" && (
                <motion.div 
                  key="analogy-tone"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-3"
                >
                  <span className="text-[9px] font-mono text-[#7dd9b8] uppercase">System Metaphor</span>
                  <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <span className="text-xl">🏔️ 🧭 🔥</span>
                    <p className="text-[10px] text-[#8a8d99]">A blind hiker feeling the angle of the soil under his boots in a heavy snowstorm to walk safely down a deep mountain peak.</p>
                  </div>
                  <p className="text-[11px] text-[#8a8d99] italic text-center">
                    "If the dirt tilts high on the left, you step slow which is the opposite direction (negative scalar gradient)."
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Quick study button */}
          <button
            onClick={() => onNavigateToTab("tutor", "Machine Learning Theory")}
            className="w-full bg-[#1a1e27] hover:bg-[#222733] border border-white/5 text-xs text-[#f0eee8] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>Launch Active AI Sandbox Panel</span>
            <ChevronRight className="w-4 h-4 text-[#7dd9b8]" />
          </button>
        </div>

      </div>

      {/* COGNITIVE RETENTION CALC SANDBOX (BENTO GRID HIGH CONTRAST) */}
      <div className="bg-[#13161c] border border-white/5 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8a0f0] font-bold">SM-2 Algorithm Sandbox</span>
            <h4 className="font-serif text-2xl font-bold mt-0.5 text-[#f0eee8]">Spaced Repetition Calculator</h4>
            <p className="text-xs text-[#8a8d99]">
              Replicate daily macro-nutrient trackers. Click a recall quality level to simulate immediate interval increments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Interactive Variables</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* User Score dials */}
          <div className="md:col-span-4 bg-black/40 border border-white/5 rounded-2xl p-4 text-center space-y-4">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Calculated Output Interval</span>
            
            <div className="relative inline-flex items-center justify-center w-28 h-28 bg-white/[0.01] border border-white/5 rounded-full mx-auto">
              {/* Inner details */}
              <div className="text-center space-y-0.5">
                <span className="text-3xl font-bold font-serif text-[#b8a0f0] block">{cardInterval}</span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block">Days Wait</span>
              </div>
            </div>

            <div className="flex justify-around items-center pt-2 text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[9px] uppercase">Ease Factor</span>
                <span className="text-[#7dd9b8] font-bold">{cardEF}x</span>
              </div>
              <div className="h-6 w-[1px] bg-white/5" />
              <div>
                <span className="text-gray-500 block text-[9px] uppercase">Recall Level</span>
                <span className="text-[#f0c46a] font-bold">{qualityRating}/5</span>
              </div>
            </div>
          </div>

          {/* Selector levels */}
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-semibold text-[#f0eee8] block">Select Recall Experience level:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: 1, text: "Incorrect Response", detail: "Fails review entirely. Resets wait back to 1 day.", label: "1 · Forgot", color: "hover:border-red-500/30 text-red-400" },
                { val: 3, text: "Correct With Effort", detail: "Significant delay. Interval scales slightly.", label: "3 · Hard Recall", color: "hover:border-amber-500/30 text-amber-300" },
                { val: 5, text: "Instant Perfect Recall", detail: "Excellent confidence level. Wait interval grows substantially.", label: "5 · Perfect", color: "hover:border-emerald-500/30 text-emerald-300" }
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => calculateSM2(lvl.val)}
                  className={`bg-black/30 text-left p-3.5 rounded-xl border border-white/5 hover:border-white/15 transition-all focus:outline-none cursor-pointer flex flex-col justify-between space-y-1.5 ${lvl.color} ${qualityRating === lvl.val ? "ring-1 ring-[#b8a0f0] bg-[#b8a0f0]/5" : ""}`}
                >
                  <span className="text-xs font-mono font-bold">{lvl.label}</span>
                  <span className="text-[10px] text-gray-400 block font-sans font-semibold italic">{lvl.text}</span>
                  <p className="text-[10px] text-[#8a8d99] leading-relaxed font-sans mt-1">{lvl.detail}</p>
                </button>
              ))}
            </div>

            <div className="bg-[#b8a0f0]/5 rounded-2xl p-4 border border-[#b8a0f0]/15 flex gap-3 items-start">
              <Sparkles className="w-4 h-4 text-[#b8a0f0] mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#f0eee8] block">Cognitive Memory Spacing Math (SM-2)</span>
                <p className="text-[11px] text-[#8a8d99] leading-relaxed">
                  Every correct memory review scales the next test wait interval by multiplying the Ease Factor (EF). Fails reset the countdown to ensure reinforcement is injected immediately on subsequent review days.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
