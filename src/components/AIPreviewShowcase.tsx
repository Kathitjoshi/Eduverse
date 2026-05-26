import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Link2, 
  Atom, 
  BarChart3, 
  Brain,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

interface SubjectPreview {
  id: string;
  name: string;
  icon: React.ReactNode;
  concepts: number;
  modules: number;
  progress: number;
  progressColor: string;
  userPrompt: string;
  aiResponse: string;
}

const PREVIEW_SUBJECTS: SubjectPreview[] = [
  {
    id: "ml",
    name: "Machine Learning Theory",
    icon: <Brain className="w-5 h-5 text-[#c8f56a]" />,
    concepts: 411,
    modules: 34,
    progress: 53,
    progressColor: "bg-[#c8f56a]",
    userPrompt: "Explain gradient descent like I'm a visual learner",
    aiResponse: "Imagine you're hiking down a foggy mountain. You can't see the bottom, but you can feel which direction is downhill under your feet.\n\nGradient descent works the same way — at each step, you look at the local slope of your error (the gradient), and take a small step in the direction that goes downhill fastest. Over many steps, you reach the lowest point: the minimum error.\n\nThe 'learning rate' is how big your steps are — too large and you overshoot valleys, too small and you take forever. Visually, picture a 3D surface (your loss landscape) with valleys, ridges, and saddle points — and a ball rolling toward the deepest valley."
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: <Link2 className="w-5 h-5 text-[#7dd9b8]" />,
    concepts: 342,
    modules: 28,
    progress: 68,
    progressColor: "bg-[#7dd9b8]",
    userPrompt: "Explain the Big O complexity matching a matrix search",
    aiResponse: "In computer science, Big O represents the asymptotic upper bound. Look at linear searches versus logarithmic trees:\n\nIf you search a sorted matrix row-by-row, it runs in O(N * M), whereas binary search trees prune search spaces exponentially, achieving O(log N) which is extremely fast for larger scales."
  },
  {
    id: "qm",
    name: "Quantum Mechanics",
    icon: <Atom className="w-5 h-5 text-[#b8a0f0]" />,
    concepts: 218,
    modules: 19,
    progress: 31,
    progressColor: "bg-[#b8a0f0]",
    userPrompt: "Explain quantum superposition with a clean analogy",
    aiResponse: "Imagine a coin spinning on a table. While spinning, it isn't strictly 'heads' or 'tails' — it's a dynamic mix of both states simultaneously.\n\nOnly when you clap your hand down to measure it does it collapse into a definite state. Quantum particles exist in similar probabilistic wavefunctions until measured!"
  },
  {
    id: "eco",
    name: "Econometrics",
    icon: <BarChart3 className="w-5 h-5 text-[#f0c46a]" />,
    concepts: 156,
    modules: 12,
    progress: 12,
    progressColor: "bg-[#f0c46a]",
    userPrompt: "How do we adjust for multicollinearity in multivariate models?",
    aiResponse: "Multicollinearity occurs when independent variables are highly correlated, introducing severe variance and making estimates unstable.\n\nWe solve this by compiling Variance Inflation Factors (VIF), dropping redundant indicators, or applying Ridge/Lasso shrinkage coefficients (regularization)."
  }
];

export default function AIPreviewShowcase({ onNavigateToTab }: { onNavigateToTab: (tab: string, subjectName?: string) => void }) {
  const [activeId, setActiveId] = useState("ml");
  const [isTyping, setIsTyping] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");

  const activeSubject = PREVIEW_SUBJECTS.find((s) => s.id === activeId) || PREVIEW_SUBJECTS[0];

  // Simulated AI typing animation for response changes!
  useEffect(() => {
    setIsTyping(true);
    setTypedResponse("");
    
    // Simulate thinking delay and then render the text with smooth chunks
    const delayTimeout = setTimeout(() => {
      setIsTyping(false);
      setTypedResponse(activeSubject.aiResponse);
    }, 450);

    return () => clearTimeout(delayTimeout);
  }, [activeId, activeSubject]);

  return (
    <div className="space-y-8 py-4">
      {/* SECTION HEADING */}
      <div className="text-left">
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#f0eee8] leading-tight">
          Ask anything. <span className="font-light italic text-[#c8f56a]/90">Really,</span> anything.
        </h2>
        <p className="text-xs sm:text-sm text-[#8a8d99] mt-2 max-w-xl">
          Interact with our simulated chatbot preview below. Select any academic subject on the right to trigger live vector explanations and matching telemetry models.
        </p>
      </div>

      {/* CORE INTERACTIVE LAYOUT BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: ACTIVE CHATBOT SIMULATION INTERFACE */}
        <div className="lg:col-span-7 bg-[#13161c] border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c8f56a]/2 filter blur-[50px] rounded-full pointer-events-none" />
          
          <div className="space-y-4">
            {/* Mock Chat Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#c8f56a]/10 border border-[#c8f56a]/30 flex items-center justify-center text-[#c8f56a] font-bold font-mono text-sm shadow-md shadow-black/40">
                  E
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#f0eee8] font-sans">EduVerse Tutor</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute" />
                    <span className="text-[10px] text-emerald-400 font-mono font-medium pl-1.5">Active now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-gray-500 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>Simulation Active</span>
              </div>
            </div>

            {/* MESSAGE FEED SCROLLER */}
            <div className="space-y-4 min-h-[350px] flex flex-col justify-end">
              
              {/* Message 1: Initial AI Welcome */}
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c8f56a] font-bold text-[11px] font-mono shrink-0">
                  E
                </div>
                <div className="bg-black/20 border border-white/5 text-[#f0eee8] text-xs sm:text-sm p-3 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                  Hi! What are you studying today? I can explain concepts, quiz you, or map out an integrated learning path.
                </div>
              </div>

              {/* Message 2: Dynamic User Select Prompt */}
              <div className="flex gap-2.5 items-start justify-end">
                <div className="bg-[#c8f56a]/10 border border-[#c8f56a]/20 text-[#c8f56a] text-xs sm:text-sm p-3 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
                  {activeSubject.userPrompt}
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#c8f56a]/15 border border-[#c8f56a]/30 flex items-center justify-center text-[#c8f56a] font-bold text-[11px] font-mono shrink-0">
                  KJ
                </div>
              </div>

              {/* Message 3: Dynamic AI Streaming/Analogy Answer */}
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c8f56a] font-bold text-[11px] font-mono shrink-0">
                  E
                </div>
                
                <div className="bg-black/40 border border-white/5 text-[#f0eee8] text-xs sm:text-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed relative min-h-[100px] w-full">
                  <AnimatePresence mode="wait">
                    {isTyping ? (
                      <motion.div 
                        key="thinking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 py-4"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-[bounce_1s_infinite_100ms]" />
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-[bounce_1s_infinite_300ms]" />
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-[bounce_1s_infinite_500ms]" />
                        <span className="text-xs text-gray-500 font-mono pl-1">attuning concept delivery ...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-pre-line space-y-2"
                      >
                        {typedResponse}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Sandbox interactive button */}
          <div className="mt-5 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/20 -mx-5 -mb-5 p-4 rounded-b-3xl">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#c8f56a]" />
              <span>Attuned with Gemini 3.5 Models</span>
            </div>
            <button
              onClick={() => onNavigateToTab("tutor", activeSubject.name)}
              className="text-[11px] font-mono font-bold text-[#07080a] bg-[#c8f56a] hover:bg-[#c8f56a]/90 px-4 py-1.5 rounded-full transition-all flex items-center gap-1 animate-pulse"
            >
              <span>Launch Live AI Chat Session</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE PROGRESS BLOCKS AND EXPLANATION */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Description Paragraph */}
            <div className="bg-[#13161c]/60 border border-white/5 rounded-2xl p-4 leading-relaxed text-xs sm:text-sm text-[#8a8d99] font-sans">
              Jump into any academic subject and your AI tutor instantly indexes the complete knowledge graph—parsing dependencies, common misconceptions, and recommended reading intervals.
            </div>

            {/* 4 Interactive Progress Cards */}
            <div className="space-y-3">
              {PREVIEW_SUBJECTS.map((sub) => {
                const isActive = sub.id === activeId;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveId(sub.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden block ${
                      isActive 
                        ? "bg-[#13161c] border-white/10 ring-1 ring-[#c8f56a]/20 shadow-lg" 
                        : "bg-[#13161c]/40 border-white/5 hover:bg-[#13161c]/70 hover:border-white/10"
                    }`}
                  >
                    {/* Glowing pill marker */}
                    {isActive && (
                      <span className="absolute top-0 right-0 w-16 h-16 bg-[#c8f56a]/5 filter blur-lg rounded-full" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                          {sub.icon}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#f0eee8] transition-colors">
                            {sub.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono font-semibold">
                            {sub.concepts} concepts · {sub.modules} modules
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-[11px] font-mono font-bold ${isActive ? "text-[#c8f56a]" : "text-gray-400"}`}>
                          {sub.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden border border-white/[0.02]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${sub.progressColor} opacity-90`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick study metrics recap box */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-500 font-mono text-[10px]">Select any deck to realign AI vector context</span>
            <button
              onClick={() => onNavigateToTab("explore")}
              className="text-[#c8f56a] font-mono font-bold hover:underline inline-flex items-center gap-1 hover:gap-1.5 transition-all text-[11px]"
            >
              Reset view &rarr;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
