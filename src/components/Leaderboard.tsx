import React, { useState } from "react";
import { 
  Flame, 
  Clock, 
  Award, 
  Star, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Target,
  RotateCw,
  Sliders,
  Sparkle
} from "lucide-react";

interface StudyTopic {
  id: string;
  name: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completedModules: number;
  totalModules: number;
  lastReviewed: string | null;
}

const INITIAL_TOPICS: StudyTopic[] = [
  { id: "tp1", name: "Gradient Descent & Chain Rule", category: "Machine Learning", difficulty: "Medium", completedModules: 3, totalModules: 5, lastReviewed: "Yesterday" },
  { id: "tp2", name: "Red-Black Tree Balance Insertion", category: "DSA", difficulty: "Hard", completedModules: 1, totalModules: 4, lastReviewed: "2 days ago" },
  { id: "tp3", name: "Schrödinger Wave Equation", category: "Quantum Physics", difficulty: "Hard", completedModules: 2, totalModules: 6, lastReviewed: "5 days ago" },
  { id: "tp4", name: "LALR Parsing Lookup Tables", category: "Compilers", difficulty: "Medium", completedModules: 4, totalModules: 4, lastReviewed: "Today" },
  { id: "tp5", name: "Lagrangian Mechanics & Constraints", category: "Theoretical Physics", difficulty: "Easy", completedModules: 3, totalModules: 3, lastReviewed: "3 days ago" },
];

export default function Leaderboard() {
  const [comprehensionRating, setComprehensionRating] = useState<number>(4); // Range 1 to 5
  const [topics, setTopics] = useState<StudyTopic[]>(INITIAL_TOPICS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("Machine Learning");
  const [newTopicDiff, setNewTopicDiff] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Activity Planner Heatmap study minutes State
  const [weeklyActivity, setWeeklyActivity] = useState<Record<string, number>>({
    "Mon": 45,
    "Tue": 90,
    "Wed": 30,
    "Thu": 0,
    "Fri": 60,
    "Sat": 120,
    "Sun": 40,
  });
  const [selectedDay, setSelectedDay] = useState<string>("Thu");

  // Calculate stats based on state
  const totalWeeklyMinutes = Object.values(weeklyActivity).reduce((a: number, b: number) => a + b, 0);
  const averageComprehension = comprehensionRating * 20;

  // Toggle difficulty
  const changeDiff = (id: string, diff: "Easy" | "Medium" | "Hard") => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, difficulty: diff } : t));
  };

  // Toggle module completion
  const incrementModule = (id: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === id) {
        const nextCount = t.completedModules < t.totalModules ? t.completedModules + 1 : 0;
        return { 
          ...t, 
          completedModules: nextCount,
          lastReviewed: "Just now"
        };
      }
      return t;
    }));
  };

  // Log active minutes
  const logMinutes = (amount: number) => {
    setWeeklyActivity(prev => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || 0) + amount
    }));
  };

  // Calculate Spaced Repetition Next Date forecast
  const getNextRepetitionDays = (diff: "Easy" | "Medium" | "Hard", quality: number) => {
    // Basic conceptual SM-2 calculation simulation
    let factor = 1.0;
    if (diff === "Easy") factor = 2.5;
    if (diff === "Medium") factor = 1.6;
    if (diff === "Hard") factor = 1.0;

    const days = Math.round(quality * factor * 1.8);
    return days <= 1 ? "Tomorrow" : `In ${days} days`;
  };

  // Add customized topic
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    const newTopic: StudyTopic = {
      id: `custom_${Date.now()}`,
      name: newTopicName,
      category: newTopicCategory,
      difficulty: newTopicDiff,
      completedModules: 0,
      totalModules: 4,
      lastReviewed: "Never"
    };
    setTopics(prev => [newTopic, ...prev]);
    setNewTopicName("");
    setShowAddModal(false);
  };

  // Generate SVG Decay Graph values
  const decayPath = () => {
    // Quality parameter dictates decay rate: lower rating -> steep decay, higher rating -> flat line
    // Decay Formula: y = 20 + 80 * e^(-k * x)
    // Map of quality factors to decay Constant k
    const kMap: Record<number, number> = {
      1: 0.55, // Super fast decay
      2: 0.35, 
      3: 0.18, 
      4: 0.08, 
      5: 0.035, // High retention
    };
    const k = kMap[comprehensionRating] || 0.15;
    
    let points = [];
    for (let x = 0; x <= 10; x++) {
      const px = (x / 10) * 320 + 40; // x scaled to SVG bounds (40 -> 360)
      const currentRetention = Math.exp(-k * x);
      const py = 180 - (currentRetention * 130); // y scaled to SVG bounds (50 -> 180)
      points.push(`${px},${py}`);
    }
    return `M 40,50 L ${points.join(" ")}`;
  };

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto pb-16 space-y-12">
      
      {/* Title block */}
      <div className="text-center space-y-3">
        <span className="text-[10px] tracking-widest text-[#c8f56a] font-mono uppercase bg-[#c8f56a]/10 px-3 py-1 rounded-full border border-[#c8f56a]/15">
          Spaced Repetition &amp; Memory Metrics
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f0eee8]">
          Retention Forecast &amp; <span className="text-[#c8f56a]">Scheduler</span>
        </h2>
        <p className="text-xs md:text-sm text-[#8a8d99] max-w-xl mx-auto leading-relaxed">
          Simulate cognitive memory degradation curves using self-rated recall quality factors. Log daily study minutes, track syllabus modules, and schedule optimal repetitions.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Cognitive Decay Forecast Simulator) */}
        <div className="lg:col-span-5 bg-[#13161c] border border-white/5 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c8f56a]" />
              <h3 className="text-sm font-semibold text-[#f0eee8] uppercase tracking-wider font-mono">Cognitive Decay Simulator</h3>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-[#8a8d99]">SM-2 Math model</span>
          </div>

          <p className="text-xs text-[#8a8d99] leading-relaxed">
            The Ebbinghaus repetition interval formula shifts dynamically based on retention scoring. Toggle the stars to test recall quality and watch the forecast shift instantly.
          </p>

          {/* Interactive Quality Rating Selection */}
          <div className="bg-black/25 rounded-2xl p-4 space-y-3 border border-white/5">
            <span className="text-[10px] font-mono text-[#8a8d99] block uppercase tracking-wider">Configure Self-Recall Quality (Quality Factor 1-5)</span>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setComprehensionRating(level)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      comprehensionRating >= level
                        ? "bg-[#c8f56a]/10 border-[#c8f56a]/30 text-[#c8f56a] scale-105"
                        : "bg-white/5 border-white/5 text-[#8a8d99] hover:border-white/10"
                    }`}
                  >
                    <Star className={`w-5 h-5 ${comprehensionRating >= level ? "fill-[#c8f56a]" : ""}`} />
                  </button>
                ))}
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] block text-[#8a8d99] uppercase select-none">Estimate Status</span>
                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                  comprehensionRating === 5 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  comprehensionRating === 4 ? "bg-[#c8f56a]/15 text-[#c8f56a] border border-[#c8f56a]/20" :
                  comprehensionRating === 3 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {comprehensionRating === 5 ? "Strong Recall (Factor 5)" :
                   comprehensionRating === 4 ? "Good Retain (Factor 4)" :
                   comprehensionRating === 3 ? "Borderline (Factor 3)" :
                   comprehensionRating === 2 ? "Fading Rapidly (Factor 2)" :
                   "Recall Slip (Factor 1)"}
                </span>
              </div>
            </div>

            {/* Micro details displaying spacing intervals */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono text-gray-400">
              <div className="p-2.5 bg-black/10 rounded-lg">
                <span className="text-[9px] text-[#8a8d99] uppercase block mb-0.5">Est. Half-life Retention</span>
                <span className="text-xs font-semibold text-[#f0eee8]">
                  {comprehensionRating === 5 ? "18 days" :
                   comprehensionRating === 4 ? "12 days" :
                   comprehensionRating === 3 ? "6 days" :
                   comprehensionRating === 2 ? "3 days" : "1 day"}
                </span>
              </div>

              <div className="p-2.5 bg-black/10 rounded-lg">
                <span className="text-[9px] text-[#8a8d99] uppercase block mb-0.5">Subsequent SM-2 Multiplier</span>
                <span className="text-xs font-semibold text-[#f0eee8]">
                  {comprehensionRating === 5 ? "2.6x Interval Scale" :
                   comprehensionRating === 4 ? "2.1x Interval Scale" :
                   comprehensionRating === 3 ? "1.6x Interval Scale" :
                   comprehensionRating === 2 ? "1.1x No Scale" : "Reset interval to 1 day"}
                </span>
              </div>
            </div>

          </div>

          {/* SVG Decay Graph */}
          <div className="bg-black/35 rounded-2xl p-4 border border-white/5 space-y-3 relative">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8a8d99]">
              <span className="uppercase tracking-wider">Retention Probability Decay Curves</span>
              <span>Horizontal Timeline (Days 0 - 10)</span>
            </div>

            <div className="relative">
              <svg viewBox="0 0 400 200" className="w-full h-auto text-gray-700">
                {/* Y Axis Guides */}
                <line x1="40" y1="50" x2="380" y2="50" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="40" y1="115" x2="380" y2="115" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="40" y1="180" x2="380" y2="180" stroke="#ffffff" strokeOpacity="0.1" />

                {/* X Axis vertical lines */}
                <line x1="40" y1="50" x2="40" y2="180" stroke="#ffffff" strokeOpacity="0.1" />
                <line x1="120" y1="50" x2="120" y2="180" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="200" y1="50" x2="200" y2="180" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="280" y1="50" x2="280" y2="180" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />
                <line x1="360" y1="50" x2="360" y2="180" stroke="#ffffff" strokeOpacity="0.05" strokeDasharray="3 3" />

                {/* Axis Labels */}
                <text x="35" y="55" fill="#8a8d99" fontSize="9" textAnchor="end" fontFamily="monospace">100%</text>
                <text x="35" y="120" fill="#8a8d99" fontSize="9" textAnchor="end" fontFamily="monospace">50%</text>
                <text x="35" y="185" fill="#8a8d99" fontSize="9" textAnchor="end" fontFamily="monospace">0%</text>

                <text x="40" y="195" fill="#8a8d99" fontSize="8" textAnchor="middle" fontFamily="monospace">Day 0</text>
                <text x="120" y="195" fill="#8a8d99" fontSize="8" textAnchor="middle" fontFamily="monospace">Day 2.5</text>
                <text x="200" y="195" fill="#8a8d99" fontSize="8" textAnchor="middle" fontFamily="monospace">Day 5</text>
                <text x="280" y="195" fill="#8a8d99" fontSize="8" textAnchor="middle" fontFamily="monospace">Day 7.5</text>
                <text x="360" y="195" fill="#8a8d99" fontSize="8" textAnchor="middle" fontFamily="monospace">Day 10</text>

                {/* Theoretical Decay Curve (Stable) */}
                <path d={decayPath()} fill="none" stroke="#c8f56a" strokeWidth="2.5" className="transition-all duration-500" />
              </svg>

              {/* Float badge */}
              <div className="absolute top-8 right-6 bg-black/75 px-3 py-1.5 rounded-lg border border-[#c8f56a]/20 text-[10px] font-mono text-center">
                <span className="text-[#8a8d99] block uppercase tracking-widest text-[8px]">Halving Threshold</span>
                <span className="text-[#c8f56a] font-bold">50% Retained at Day {
                  comprehensionRating === 5 ? "8.5" :
                  comprehensionRating === 4 ? "6.0" :
                  comprehensionRating === 3 ? "3.2" :
                  comprehensionRating === 2 ? "1.8" : "0.8"
                }</span>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-500 leading-relaxed italic text-center text-mono">
              The curve represents probability of recall. Reviews scheduled before falling past 50% solidify neural consolidation permanent.
            </p>
          </div>

        </div>

        {/* Right Column (Study Topics Checklist and Progress Heatmap scheduler) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Weekly Dynamic Activity Heatmap Block */}
          <div className="bg-[#13161c] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-[#f0eee8] uppercase tracking-wider font-mono">Dynamic Study Planner Heatmap</h3>
              </div>
              <div className="text-[11px] font-mono bg-orange-400/10 text-orange-400 border border-orange-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-orange-400" strokeWidth={1} />
                <span>Weekly Total: {totalWeeklyMinutes} m</span>
              </div>
            </div>

            <p className="text-xs text-[#8a8d99]">
              Click on any day in the weekly block to log external textbook, calculations, or lecture study sessions. Grid highlights dynamically.
            </p>

            {/* Weekly block modules */}
            <div className="grid grid-cols-7 gap-2.5">
              {Object.entries(weeklyActivity).map(([day, rawMins]) => {
                const mins = Number(rawMins);
                const isSelected = selectedDay === day;
                // Calculate opacity range based on study minutes
                const heatOpacity = mins === 0 ? "bg-white/[0.02]" :
                                   mins < 45 ? "bg-[#c8f56a]/15 text-[#c8f56a]" :
                                   mins < 80 ? "bg-[#c8f56a]/30 text-[#c8f56a] font-semibold" :
                                   "bg-[#c8f56a] text-[#07080a] font-bold";

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`p-3.5 rounded-xl text-center transition-all flex flex-col items-center justify-between gap-2 border cursor-pointer group hover:scale-[1.03] ${
                      isSelected 
                        ? "border-[#c8f56a] shadow-[0_0_15px_rgba(200,245,106,0.2)] bg-white/5 scale-102"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase text-gray-500 group-hover:text-gray-300">{day}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono select-none ${heatOpacity}`}>
                      {mins}m
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Activity Controller controls */}
            {selectedDay && (
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-gray-500 block">Active Day Context</span>
                  <span className="text-xs font-semibold text-[#f0eee8]">Updating intensity stats for <strong className="text-[#c8f56a] uppercase font-mono">{selectedDay}day</strong></span>
                  <p className="text-[10px] text-gray-500">Currently logged: {weeklyActivity[selectedDay] || 0} minutes of focus.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logMinutes(15)}
                    className="bg-white/5 hover:bg-white/10 text-xs text-[#f0eee8] px-3.5 py-2 rounded-xl border border-white/5 transition-all text-center font-bold font-mono inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c8f56a]" />
                    <span>+15 mins</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => logMinutes(45)}
                    className="bg-white/10 hover:bg-[#c8f56a]/10 hover:text-[#c8f56a] text-xs text-[#c8f56a] px-3.5 py-2 rounded-xl border border-[#c8f56a]/15 transition-all text-center font-bold font-mono inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+45 mins</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeeklyActivity(prev => ({ ...prev, [selectedDay]: 0 }))}
                    className="hover:bg-rose-500/10 hover:text-rose-400 text-xs text-gray-500 px-3.5 py-2 rounded-xl border border-transparent transition-all text-center font-bold font-mono active:scale-95 cursor-pointer"
                  >
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Section 2: Interactive Study Topic Repetition Planner */}
          <div className="bg-[#13161c] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#7dd9b8]" />
                <h3 className="text-sm font-semibold text-[#f0eee8] uppercase tracking-wider font-mono">Syllabus Topic Repetition Planner</h3>
              </div>
              
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-[#c8f56a]/10 hover:bg-[#c8f56a]/20 border border-[#c8f56a]/20 text-xs text-[#c8f56a] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer font-bold duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Plan New Topic</span>
              </button>
            </div>

            <p className="text-xs text-[#8a8d99]">
              Toggle completed modules to advance completion ratings. Change difficulty levels to recalculate the optimal SuperMemo rep schedule.
            </p>

            {/* List of planned courses */}
            <div className="space-y-3.5">
              {topics.map((t) => {
                const nextDate = getNextRepetitionDays(t.difficulty, comprehensionRating);
                const isFullyComplete = t.completedModules === t.totalModules;

                return (
                  <div 
                    key={t.id} 
                    className="p-4 bg-black/25 rounded-2xl border border-white/5 hover:border-white/10 transition-all space-y-3 relative group"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#c8f56a] bg-[#c8f56a]/15 border border-[#c8f56a]/20 px-2 py-0.5 rounded-md uppercase uppercase-wider">
                          {t.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#f0eee8] pt-1 group-hover:text-[#c8f56a] transition-all">
                          {t.name}
                        </h4>
                      </div>

                      {/* Repetition scheduler recommendation */}
                      <div className="text-right font-mono">
                        <span className="text-[8px] text-gray-500 uppercase block select-none">Next Optimal Rep</span>
                        <span className={`text-[11px] font-bold ${
                          nextDate === "Tomorrow" ? "text-rose-400" : "text-[#7dd9b8]"
                        }`}>
                          {nextDate}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracking status and controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-white/5 border-dashed">
                      
                      {/* Sub modules bar */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => incrementModule(t.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                            isFullyComplete 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-white/5 hover:bg-white/10 border-white/10 text-[#f0eee8]"
                          }`}
                          title="Click to completed one page/submodule"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-gray-500">Module Logs</span>
                            <span className="text-gray-300 font-bold">{t.completedModules} / {t.totalModules} Complete</span>
                          </div>
                          
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isFullyComplete ? "bg-emerald-400" : "bg-[#c8f56a]"
                              }`}
                              style={{ width: `${(t.completedModules / t.totalModules) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Scale selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-gray-500 uppercase">Weight:</span>
                        {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                          <button
                            key={diff}
                            type="button"
                            onClick={() => changeDiff(t.id, diff)}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-mono uppercase border transition-all cursor-pointer ${
                              t.difficulty === diff
                                ? diff === "Easy" ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400 font-bold scale-102" :
                                  diff === "Medium" ? "bg-[#c8f56a]/15 border-[#c8f56a]/30 text-[#c8f56a] font-bold scale-102" :
                                  "bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold scale-102"
                                : "bg-white/5 border-transparent text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>

                    </div>

                    {/* Meta tag */}
                    <div className="text-[9px] text-gray-600 font-mono text-right select-none">
                      Last self-recall evaluation: <span className="text-gray-400">{t.lastReviewed || "Never"}</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* Plans Modal Overlay for Topic Adding */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          
          <div className="bg-[#0f1116] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-[#f0eee8] border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Sparkle className="w-5 h-5 text-[#c8f56a]" />
              Add Topic to Syllabus Plan
            </h3>

            <form onSubmit={handleAddTopic} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 block font-bold">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backpropagation Calculus"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#f0eee8] focus:border-[#c8f56a] focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 block font-bold">Category</label>
                  <select
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#f0eee8] focus:border-[#c8f56a] focus:outline-none focus:bg-[#0f1116]"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DSA">DSA</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Compilers">Compilers</option>
                    <option value="Quantum Physics">Quantum Physics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 block font-bold">Difficulty Weight</label>
                  <select
                    value={newTopicDiff}
                    onChange={(e) => setNewTopicDiff(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#f0eee8] focus:border-[#c8f56a] focus:outline-none focus:bg-[#0f1116]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 justify-end pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-black bg-[#c8f56a] hover:bg-[#c8f56a]/90 transition-all font-bold cursor-pointer"
                >
                  Confirm Plan
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}
