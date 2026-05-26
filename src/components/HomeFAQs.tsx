import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How does the Spaced Repetition (SM-2) scheduling model work?",
    a: "The SuperMemo-2 (SM-2) cognitive scheduling model calculates optimal study delays based on recall ratings feedback (1-5 range). When records are retrieved with ease, the algorithm enlarges subsequent intervals exponentially by multiplying the topic's Ease Factor. When items are forgotten, delays contract immediately to 1 day to re-trigger neural recall."
  },
  {
    q: "Can I scan handwritten physics formulas and text clippings?",
    a: "Yes! The Snap & Understand tool processes handwriting, equations, textbook pages, and chemical diagrams. Simply snap a clear photograph, upload it, and Gemini will perform an intensive structural OCR to synthesize core summaries, tag concepts, and define difficult nomenclature."
  },
  {
    q: "Are my chat logs and learning flashcard decks stored locally?",
    a: "Everything is kept secure in local memory states, giving you immediate access without creating secondary server overhead or signup boundaries. Click intervals and leaderboard standings persist as long as your session is running."
  },
  {
    q: "How do learning pills compare to standard lectures?",
    a: "Standard lectures offer coarse, long-form content. On EduVerse, we translate major subjects into snackable learning pills. We log study intervals, concepts mapped, and completion ratios. Every conceptual link reviewed adds milestone progress points directly into your subject completion metrics!"
  }
];

export default function HomeFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="bg-[#13161c] border border-white/5 rounded-3xl p-6 space-y-6">
      
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <HelpCircle className="w-5 h-5 text-[#c8f56a]" />
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">Clarifying Information</span>
          <h4 className="font-serif text-xl font-bold text-[#f0eee8]">Frequently Asked Questions</h4>
        </div>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className="border border-white/5 hover:border-white/10 rounded-2xl bg-black/10 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleIndex(i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-[#f0eee8] hover:text-[#c8f56a] transition-colors focus:outline-none"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-350 ${isOpen ? "rotate-180 text-[#c8f56a]" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#8a8d99] leading-relaxed border-t border-white/5 pt-3 whitespace-pre-line">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
