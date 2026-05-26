import React, { useState } from "react";
import { CheckCircle2, RotateCw, ArrowLeft, HelpCircle, Star, ThumbsUp, Sparkles, BookOpen, Undo } from "lucide-react";
import { Flashcard } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface FlashcardReviewProps {
  cards: Flashcard[];
  onRateCard: (cardId: string, rating: 'easy' | 'medium' | 'hard') => void;
  onResetDeck?: () => void;
  selectedSubject?: string;
}

export default function FlashcardReview({ cards, onRateCard, onResetDeck, selectedSubject }: FlashcardReviewProps) {
  const [activeSessionCards, setActiveSessionCards] = useState<Flashcard[]>(() => {
    // Filter cards based on subject if specified, else use all
    if (selectedSubject && selectedSubject !== "All") {
      return cards.filter(c => c.subject === selectedSubject);
    }
    return cards;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({});

  // Fix: Total session count is fixed at the start of the review session
  const totalInSession = activeSessionCards.length;

  const handleRate = (rating: 'easy' | 'medium' | 'hard') => {
    if (currentIndex >= totalInSession) return;
    
    const activeCard = activeSessionCards[currentIndex];
    setSessionRatings(prev => ({
      ...prev,
      [activeCard.id]: rating
    }));

    onRateCard(activeCard.id, rating);
    
    // Animate to next card
    setIsRevealed(false);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 150);
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setSessionRatings({});
    if (onResetDeck) {
      onResetDeck();
    }
  };

  // Completed State
  const isCompleted = currentIndex >= totalInSession;

  // Statistics summaries
  const easyCount = Object.values(sessionRatings).filter(r => r === "easy").length;
  const mediumCount = Object.values(sessionRatings).filter(r => r === "medium").length;
  const hardCount = Object.values(sessionRatings).filter(r => r === "hard").length;

  if (totalInSession === 0) {
    return (
      <div className="pt-20 px-4 max-w-xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 mb-4 animate-[pulse_2s_infinite]">
          <BookOpen className="w-8 h-8 text-[#8a8d99]" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#f0eee8] mb-2">No Review Cards Available</h3>
        <p className="text-xs text-[#8a8d99] mb-6 max-w-sm">
          You haven't added or generated any study flashcards for this deck yet. Head to "Snap &amp; Understand" to scannerize notes and auto-inject some, or chat with the AI Tutor!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 max-w-xl mx-auto min-h-screen pb-12 flex flex-col justify-center">
      
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="active-session"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="text-center">
              <span className="text-[10px] tracking-widest text-[#c8f56a] font-mono uppercase bg-[#c8f56a]/10 px-3 py-1 rounded-full border border-[#c8f56a]/15">
                Spaced Repetition Review (SM-2)
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#f0eee8] mt-3">
                Remember Forever
              </h2>
            </div>

            {/* Consistent Counter and Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-[#8a8d99] font-mono select-none">
                <span>ACTIVE DECK: {activeSessionCards[currentIndex]?.subject || "General Study"}</span>
                {/* Counter is fixed in code here: correctly displays e.g., '1 of 6' up to '6 of 6' */}
                <span className="font-bold text-[#f0eee8] bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">
                  Card {currentIndex + 1} of {totalInSession}
                </span>
              </div>
              
              {/* Progress bar fill */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#7dd9b8] to-[#c8f56a] transition-all duration-300" 
                  style={{ width: `${((currentIndex) / totalInSession) * 100}%` }}
                />
              </div>
            </div>

            {/* Simulated Flip Card viewport */}
            <div 
              onClick={() => setIsRevealed(!isRevealed)}
              className="relative aspect-[16/10] bg-[#13161c] border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.99] select-none hover:shadow-2xl overflow-hidden group"
            >
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider text-[#8a8d99]">
                <HelpCircle className="w-3.5 h-3.5 text-[#c8f56a]" />
                <span>{isRevealed ? "Answer Side" : "Question Side"}</span>
              </div>

              {/* Central text details layout */}
              <div className="flex-1 flex items-center justify-center text-center py-4">
                <AnimatePresence mode="wait">
                  {!isRevealed ? (
                    <motion.p
                      key="question"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-serif text-lg md:text-xl font-bold text-[#f0eee8] tracking-tight leading-relaxed px-2"
                    >
                      {activeSessionCards[currentIndex]?.question}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="answer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs md:text-sm text-[#8a8d99] leading-relaxed px-2 whitespace-pre-wrap"
                    >
                      {activeSessionCards[currentIndex]?.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center text-[10px] text-gray-500 font-mono tracking-wide group-hover:text-[#c8f56a] transition-colors">
                {isRevealed ? "Click cards to see Question" : "Click cards to reveal Answer"}
              </div>
            </div>

            {/* Dynamic review ratings triggers */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.div
                    key="rating-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleRate("hard")}
                      className="bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-red-400 font-semibold py-2.5 rounded-xl border border-white/5 text-xs transition-all active:scale-95 flex flex-col items-center gap-0.5"
                    >
                      <span>Hard</span>
                      <span className="text-[9px] text-[#5a5d6a] font-normal font-mono">Review soon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate("medium")}
                      className="bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/20 text-amber-300 font-semibold py-2.5 rounded-xl border border-white/5 text-xs transition-all active:scale-95 flex flex-col items-center gap-0.5"
                    >
                      <span>Good</span>
                      <span className="text-[9px] text-[#5a5d6a] font-normal font-mono">Balanced timing</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRate("easy")}
                      className="bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-emerald-400 font-semibold py-2.5 rounded-xl border border-white/5 text-xs transition-all active:scale-95 flex flex-col items-center gap-0.5"
                    >
                      <span>Easy</span>
                      <span className="text-[9px] text-[#5a5d6a] font-normal font-mono">Retained safely</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reveal-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <button
                      type="button"
                      onClick={() => setIsRevealed(true)}
                      className="w-full bg-[#1a1e27] hover:bg-[#222733] text-[#f0eee8] border border-white/5 rounded-xl py-3 text-xs font-semibold tracking-wide transition-all active:scale-95 text-center"
                    >
                      Reveal Answer Side
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="recap-celebration"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13161c] border border-white/5 rounded-2xl p-6 space-y-6 text-center shadow-2xl"
          >
            <div className="w-14 h-14 bg-[#c8f56a]/15 border border-[#c8f56a]/30 text-[#c8f56a] rounded-xl flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#f0eee8]">Review Deck Concluded</h3>
              <p className="text-xs text-[#8a8d99] max-w-xs mx-auto">
                Spaced repetition timing updated. You have reinforced {totalInSession} educational constants successfully!
              </p>
            </div>

            {/* Study stats */}
            <div className="bg-[#07080a] border border-white/5 p-4 rounded-xl max-w-sm mx-auto grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#5a5d6a] font-mono block uppercase">Easy rated</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{easyCount}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#5a5d6a] font-mono block uppercase">Good rated</span>
                <span className="text-lg font-bold text-amber-300 font-mono">{mediumCount}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#5a5d6a] font-mono block uppercase">Hard rated</span>
                <span className="text-lg font-bold text-red-400 font-mono">{hardCount}</span>
              </div>
            </div>

            {/* Streaks increment details */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#7dd9b8] font-bold">
              <Sparkles className="w-4 h-4 text-[#c8f56a] animate-pulse" />
              <span>Streak Milestone: +1 Day Added!</span>
            </div>

            {/* Session actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestartSession}
                className="flex-1 bg-[#1a1e27] hover:bg-[#222733] border border-white/5 text-[#f0eee8] font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Review Again
              </button>
              <button
                type="button"
                onClick={() => {
                  // select another subject or back home
                  setActiveSessionCards(cards);
                  setCurrentIndex(0);
                  setIsRevealed(false);
                }}
                className="flex-1 bg-[#c8f56a] hover:bg-[#c8f56a]/90 text-[#07080a] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                Reset All Decks
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
