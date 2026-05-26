import React, { useState } from "react";
import Navbar from "./components/Navbar";
import TutorChat from "./components/TutorChat";
import SnapAnalyze from "./components/SnapAnalyze";
import KnowledgeGraph from "./components/KnowledgeGraph";
import FlashcardReview from "./components/FlashcardReview";
import ProgressTracker from "./components/ProgressTracker";
import Leaderboard from "./components/Leaderboard";
import HomeSandbox from "./components/HomeSandbox";
import HomeFAQs from "./components/HomeFAQs";
import BackgroundParticles from "./components/BackgroundParticles";
import AIPreviewShowcase from "./components/AIPreviewShowcase";
import { Flashcard, Subject, LeaderboardEntry } from "./types";
import { BookOpen, Sparkles, Flame, GraduationCap, ArrowRight, MessageSquare, FileText, Network, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: "fc_1",
    question: "What is Big O formulation primarily used to calculate?",
    answer: "To establish upper-bound computational asymptotic complexities of space and execution durations, matching algorithm growth vectors as size (n) reaches infinity.",
    subject: "Data Structures & Algorithms",
    difficulty: "easy"
  },
  {
    id: "fc_2",
    question: "Explain the main mechanics of Gradient Descent.",
    answer: "An optimization methodology that calculates gradients of differentiable loss surfaces, taking iterative negative steps scaled by progress sizes (learning rates) to locate local minima.",
    subject: "Machine Learning Theory",
    difficulty: "medium"
  },
  {
    id: "fc_3",
    question: "How does the L2 weight regularization function prevent neural network overfitting?",
    answer: " L2 (Ridge) adds squared magnitude penalties directly to weights so cost penalizes extreme weights, resulting in smaller, uniform coefficients throughout.",
    subject: "Machine Learning Theory"
  },
  {
    id: "fc_4",
    question: "What is Euler's identity and its fundamental relevance?",
    answer: "The formula e^(i*pi) + 1 = 0. It bridges e, pi, i, 1, and 0 in complex trigonometric coordinate spaces.",
    subject: "Mathematical Calculus"
  },
  {
    id: "fc_5",
    question: "Explain Register Allocation inside modern Compilers.",
    answer: "A code-generation stage that solves physical CPU storage assignments for compiler values by formulating interference maps and addressing them using graph-coloring.",
    subject: "Compilers"
  },
  {
    id: "fc_6",
    question: "What is a major difference between LL(1) and LR(1) syntax compilers?",
    answer: "LL(1) parsers execute top-down derivation predicting matches early, whereas LR(1) translates left-to-right from bottom-up shift-reduce tables.",
    subject: "Compilers"
  }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub_1", name: "Data Structures & Algorithms", icon: "🔗", conceptsCount: 342, modulesCount: 28, progress: 68, color: "accent" },
  { id: "sub_2", name: "Quantum Mechanics", icon: "⚛️", conceptsCount: 218, modulesCount: 19, progress: 31, color: "accent2" },
  { id: "sub_3", name: "Econometrics", icon: "📊", conceptsCount: 156, modulesCount: 12, progress: 12, color: "accent3" },
  { id: "sub_4", name: "Machine Learning Theory", icon: "🧠", conceptsCount: 411, modulesCount: 34, progress: 53, color: "accent4" },
  { id: "sub_5", name: "Mathematical Calculus", icon: "📐", conceptsCount: 180, modulesCount: 16, progress: 40, color: "accent2" },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: "lb_1", rank: 1, name: "Arjun Kulkarni", avatar: "AK", streakDays: 24, studyMinutes: 420, milestone: "Aspirant Level IV · Bangalore" },
  { id: "lb_2", rank: 2, name: "Priya Menon", avatar: "PM", streakDays: 18, studyMinutes: 380, milestone: "Grad Level III · JNU" },
  { id: "lb_3", rank: 3, name: "Riya Sharma", avatar: "RS", streakDays: 14, studyMinutes: 310, milestone: "BTech Level III · VIT Vellore" },
  { id: "lb_4", rank: 4, name: "Kath Joshi (You)", avatar: "KJ", streakDays: 5, studyMinutes: 180, milestone: "Undergrad Level I · IISc", isCurrentUser: true },
  { id: "lb_5", rank: 5, name: "Rohan Das", avatar: "RD", streakDays: 9, studyMinutes: 140, milestone: "Pre-Grad Scholar · Pune" },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("explore");
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  
  // Primes chat with concept selection
  const [tutorContextSubject, setTutorContextSubject] = useState<string>("Machine Learning Theory");

  const handleRateCard = (cardId: string, rating: 'easy' | 'medium' | 'hard') => {
    // Implement internal timing adjustments for cards
    setFlashcards(prev => prev.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          difficulty: rating,
          lastReviewed: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const handleUpdateProgress = (subjectId: string, increment: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const nextVal = Math.min(100, Math.max(0, s.progress + increment));
        return { ...s, progress: nextVal };
      }
      return s;
    }));
  };

  const handleAddFlashcardsFromOCR = (newCards: any[]) => {
    // Filter out duplicates and append
    setFlashcards(prev => {
      const merged = [...prev];
      newCards.forEach(c => {
        if (!merged.find(existing => existing.question === c.question)) {
          merged.unshift({
            id: c.id || `fc_gen_${Date.now()}_${Math.random()}`,
            question: c.question,
            answer: c.answer,
            subject: c.subject || "Extracted Notes"
          });
        }
      });
      return merged;
    });

    // Award +40 study minutes in leaderboard metrics on note uploads!
    setLeaderboard(prev => prev.map(l => {
      if (l.isCurrentUser) {
        return {
          ...l,
          studyMinutes: l.studyMinutes + 40,
          streakDays: l.streakDays + 1,
          milestone: "Undergrad Level II · IISc"
        };
      }
      return l;
    }));
  };

  const handleNavigateToTab = (tab: string, initialSubject?: string) => {
    setCurrentTab(tab);
    if (initialSubject) {
      setTutorContextSubject(initialSubject);
    }
  };

  return (
    <div className="bg-[#07080a] min-h-screen text-[#f0eee8] overflow-x-hidden relative">
      
      {/* Immersive Background Canvas Particles System */}
      <BackgroundParticles />
      
      {/* Navigation menu */}
      <Navbar currentTab={currentTab} onChangeTab={handleNavigateToTab} />

      {/* Main Container contents display */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* Explore Hub Tab */}
          {currentTab === "explore" && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="pt-24 px-4 max-w-6xl mx-auto pb-16 space-y-16"
            >
              
              {/* HERO CARD */}
              <div className="relative text-center py-16 md:py-24 overflow-hidden rounded-3xl border border-white/5 bg-[#0d0f13]">
                <div className="absolute inset-0 hero-glow-1 w-full h-full pointer-events-none opacity-50" />
                <div className="absolute top-20 left-10 w-96 h-96 hero-glow-2 rounded-full filter blur-3xl pointer-events-none opacity-40 animate-pulse" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
                  
                  {/* Badge mark */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c8f56a]/10 border border-[#c8f56a]/20 text-[#c8f56a] text-xs font-mono uppercase tracking-wider rounded-full select-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-Powered Autonomous Learning Deck</span>
                  </div>

                  {/* Core display serif phrase */}
                  <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#f0eee8] leading-[1.05]">
                    Learn anything,<br />
                    <span className="text-gray-400 font-light italic">explained</span> like you mean it
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-[#8a8d99] max-w-xl mx-auto leading-relaxed">
                    Capture textbook diagrams, formulate interactive study modules, map conceptual dependency node trees, and study hands-free with an adaptive tutor that gets context.
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center pt-3">
                    <button
                      onClick={() => handleNavigateToTab("tutor")}
                      className="bg-[#c8f56a] hover:bg-[#c8f56a]/95 text-[#07080a] font-bold px-6 py-3 rounded-full text-xs md:text-sm shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Start Learning with AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNavigateToTab("snap")}
                      className="border border-white/10 hover:border-white/25 text-[#f0eee8] hover:bg-white/5 px-6 py-3 rounded-full text-xs md:text-sm transition-all focus:outline-none"
                    >
                      Scan Note Document
                    </button>
                  </div>

                  {/* Academic Stats markers */}
                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-8 text-center border-t border-white/5 mt-10 max-w-2xl mx-auto">
                    <div>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#f0eee8] block">50,000+</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8a8d99] block mt-0.5">Concepts mapped</span>
                    </div>
                    <div>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#f0eee8] block">16 Core</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8a8d99] block mt-0.5">Academic Topics</span>
                    </div>
                    <div>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#f0eee8] block">SM-2 Algorithm</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8a8d99] block mt-0.5">Daily Retention Engine</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* INTERACTIVE CHAT PREVIEW AND SUBJ SHOWCASE (PICS OF REQ & RES) */}
              <AIPreviewShowcase onNavigateToTab={handleNavigateToTab} />

              {/* CORE DASHBOARD GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Progress bars on the left panel */}
                <div className="lg:col-span-8 space-y-8 bg-[#13161c]/40 border border-white/5 rounded-3xl p-6 shadow-md">
                  <ProgressTracker 
                    subjects={subjects} 
                    onUpdateProgress={handleUpdateProgress} 
                    onNavigateToTab={handleNavigateToTab} 
                  />
                </div>

                {/* Level / quick facts panel on right */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Daily streak recap widgets */}
                  <div className="bg-[#13161c] border border-white/5 rounded-3xl p-5 space-y-4">
                    <h4 className="font-serif text-sm font-bold text-[#f0eee8] flex items-center gap-1.5 uppercase tracking-wide border-b border-white/5 pb-2">
                      <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                      Active Milestones
                    </h4>

                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-xs font-semibold text-[#f0eee8] block">Compilers Class</span>
                        <span className="text-[9px] text-[#8a8d99] font-mono">2 modules logged</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#c8f56a] font-bold">+10% XP</div>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-xs font-semibold text-[#f0eee8] block">First Document Uploaded</span>
                        <span className="text-[9px] text-[#8a8d99] font-mono">Snap Note scanned</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#7dd9b8] font-bold">Unlocks Deck Review</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNavigateToTab("review")}
                      className="w-full bg-white/5 hover:bg-white/10 text-xs text-[#f0eee8] py-2 rounded-xl transition-all border border-white/5 text-center font-bold"
                    >
                      Examine Active Flash-Decks
                    </button>
                  </div>

                  {/* Open Source / direct study CTA info */}
                  <div className="bg-gradient-to-br from-[#c8f56a]/5 to-transparent border border-[#c8f56a]/15 rounded-3xl p-5 space-y-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#c8f56a]">Open Source Learning Platform</span>
                    <h4 className="text-sm font-semibold text-[#f0eee8]">No Credentials Needed</h4>
                    <p className="text-xs text-[#8a8d99] leading-relaxed">
                      EduVerse provides instant textbook scanning, interactive knowledge networks, and AI Tutor logs directly. Settle milestones immediately without sign-up processes!
                    </p>
                  </div>

                </div>

              </div>

              {/* DYNAMIC LEARNING SANDBOX WIDGETS */}
              <HomeSandbox onNavigateToTab={handleNavigateToTab} />

              {/* FREQUENTLY ASKED QUESTIONS */}
              <HomeFAQs />

            </motion.div>
          )}

          {/* AI Tutor Chat Tab */}
          {currentTab === "tutor" && (
            <motion.div
              key="tutor-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TutorChat 
                initialSubject={tutorContextSubject} 
                onAddFlashcards={handleAddFlashcardsFromOCR} 
              />
            </motion.div>
          )}

          {/* Snap & Understand Document Scanning Tab */}
          {currentTab === "snap" && (
            <motion.div
              key="snap-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SnapAnalyze 
                onAddFlashcards={handleAddFlashcardsFromOCR}
                onNavigateToTab={handleNavigateToTab}
              />
            </motion.div>
          )}

          {/* Interactive Knowledge Graph Tab */}
          {currentTab === "graph" && (
            <motion.div
              key="graph-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <KnowledgeGraph 
                onSearchConcept={setTutorContextSubject}
                onNavigateToTab={handleNavigateToTab}
              />
            </motion.div>
          )}

          {/* Spaced Repetition Review Module Tab */}
          {currentTab === "review" && (
            <motion.div
              key="review-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FlashcardReview 
                cards={flashcards} 
                onRateCard={handleRateCard} 
                onResetDeck={() => setFlashcards(INITIAL_FLASHCARDS)}
              />
            </motion.div>
          )}

          {/* Leaderboard & Study Milestones Tab */}
          {currentTab === "leaderboard" && (
            <motion.div
              key="leaderboard-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Leaderboard />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black/40 text-center text-xs text-[#8a8d99] space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 font-serif text-lg font-bold text-[#f0eee8]">
          <GraduationCap className="w-5 h-5 text-[#c8f56a]" />
          <span>Edu<span className="text-[#c8f56a]">Verse</span></span>
        </div>
        <p>2026 EduVerse • Learn everything • Free and open-source personal tutoring platform</p>
        <p className="text-[10px] text-gray-600">Built using server-side Gemini 3.5 models and beautiful Tailwind architecture.</p>
      </footer>

    </div>
  );
}
