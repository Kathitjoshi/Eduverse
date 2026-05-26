import React from "react";
import { Plus, Minus, CheckCircle, Flame, Star, Compass, ArrowRight } from "lucide-react";
import { Subject } from "../types";

interface ProgressTrackerProps {
  subjects: Subject[];
  onUpdateProgress: (subjectId: string, increment: number) => void;
  onNavigateToTab: (tab: string, initialSubject?: string) => void;
}

export default function ProgressTracker({ subjects, onUpdateProgress, onNavigateToTab }: ProgressTrackerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-2xl font-bold text-[#f0eee8] flex items-center gap-1.5">
          <Compass className="w-5 h-5 text-[#c8f56a]" />
          Discipline Progress
        </h3>
        <span className="text-[10px] font-mono text-[#8a8d99] uppercase select-none">
          Click +/- to log milestones
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const isComplete = sub.progress >= 100;
          return (
            <div
              key={sub.id}
              className="bg-[#13161c] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-lg shadow">
                    {sub.icon}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-[#f0eee8]">{sub.name}</h4>
                    <span className="text-[10px] text-[#8a8d99] block font-mono">
                      {sub.conceptsCount} concepts · {sub.modulesCount} modules
                    </span>
                  </div>
                </div>

                <div className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                  isComplete
                    ? "bg-[#7dd9b8]/15 text-[#7dd9b8] border border-[#7dd9b8]/20"
                    : "bg-white/[0.03] text-[#f0eee8]"
                }`}>
                  {sub.progress}%
                </div>
              </div>

              {/* Progress visual tracker */}
              <div className="space-y-1.5">
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${sub.progress}%`,
                      backgroundColor: sub.color === "accent" ? "#c8f56a" : sub.color === "accent2" ? "#7dd9b8" : sub.color === "accent3" ? "#f0c46a" : "#b8a0f0"
                    }}
                  />
                </div>
                
                {/* Adjustments buttons */}
                <div className="flex justify-between items-center pt-1.5">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateProgress(sub.id, -10)}
                      disabled={sub.progress <= 0}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[#8a8d99] hover:text-[#f0eee8] flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateProgress(sub.id, 10)}
                      disabled={sub.progress >= 100}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[#8a8d99] hover:text-[#f0eee8] flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab("tutor", sub.name)}
                    className="text-[11px] font-semibold text-[#8a8d99] hover:text-[#c8f56a] flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
