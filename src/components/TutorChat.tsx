import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BookOpen, User, HelpCircle, Loader2, ArrowLeftRight, Check } from "lucide-react";
import { Message } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TutorChatProps {
  initialSubject?: string;
  onAddFlashcards: (cards: any[]) => void;
}

const DEFAULT_SUBJECTS = [
  { id: "ml", name: "Machine Learning Theory", icon: "🧠", color: "border-[#b8a0f0]/30 text-[#b8a0f0]" },
  { id: "dsa", name: "Data Structures & Algorithms", icon: "🔗", color: "border-[#c8f56a]/30 text-[#c8f56a]" },
  { id: "calculus", name: "Mathematical Calculus", icon: "📐", color: "border-[#7dd9b8]/30 text-[#7dd9b8]" },
  { id: "compilers", name: "Compilers", icon: "🛠️", color: "border-[#f0c46a]/30 text-[#f0c46a]" },
  { id: "physics", name: "Quantum Mechanics", icon: "⚛️", color: "border-[#b8a0f0]/30 text-[#b8a0f0]" },
  { id: "chem", name: "Organic Chemistry", icon: "🧪", color: "border-[#7dd9b8]/30 text-[#7dd9b8]" },
  { id: "econ", name: "Econometrics", icon: "📊", color: "border-[#f0c46a]/30 text-[#f0c46a]" },
];

const PROMPT_CHIPS: Record<string, string[]> = {
  "Machine Learning Theory": [
    "Explain gradient descent like I'm a visual learner",
    "What is the difference between L1 and L2 regularization?",
    "How does Backpropagation feed error updates backward?",
  ],
  "Data Structures & Algorithms": [
    "Explain when to use a Hash Map vs a Balanced BST",
    "Trace Dijkstra's shortest path algorithm step-by-step",
    "Analyze space complexity of QuickSort in-place",
  ],
  "Mathematical Calculus": [
    "Give me an intuitive look at the Fundamental Theorem of Calculus",
    "Derive the chain rule using small infinite steps",
    "Explain what Lagrange multipliers represent physically",
  ],
  "Compilers": [
     "Show how an LL(1) parsing table works on simple grammar",
     "What is live range analysis for register allocation?",
     "Difference between AST and concrete parse tree"
  ]
};

export default function TutorChat({ initialSubject, onAddFlashcards }: TutorChatProps) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || "Machine Learning Theory");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Gradient Descent Hikers Interactive Visualizer state
  const [visualStep, setVisualStep] = useState(0);
  const [visualSpeed, setVisualSpeed] = useState(1);
  const [isVisualizing, setIsVisualizing] = useState(true);

  // Generate local visual hiker positions along a mountain curve (y = x^2 - 4x + 5)
  // hiker follows gradient steps
  const mountainPoints = Array.from({ length: 41 }, (_, i) => {
    const x = -1 + i * 0.15; // range -1 to 5
    const y = Math.pow(x - 2, 2) + 1; // vertex is (2,1)
    return { x, y };
  });

  const [hikerX, setHikerX] = useState(-0.5);
  const hikerY = Math.pow(hikerX - 2, 2) + 1;

  useEffect(() => {
    if (!isVisualizing) return;
    const interval = setInterval(() => {
      setHikerX((prevX) => {
        const targetX = 2; // global minimum
        const diff = targetX - prevX;
        // if reached minimum, restart hiker
        if (Math.abs(diff) < 0.05) {
          return -0.5;
        }
        // gradient step: x_new = x_old - learning_rate * derivative
        // derivative of (x-2)^2 + 1 is 2*(x-2)
        const derivative = 2 * (prevX - 2);
        const lr = 0.15 * visualSpeed;
        return prevX - lr * derivative;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isVisualizing, visualSpeed]);

  useEffect(() => {
    setMessages([
      {
        id: "msg_init",
        sender: "ai",
        text: `Hi there! I am your interactive AI Tutor built to clarify concepts under **${selectedSubject}**.

Ask me any difficult questions, request visual guides, or tap one of the subject-primed cards down below to begin exploring together!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setApiError(null);
  }, [selectedSubject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Internal Server Error from backend.");
      }

      const aiReply: Message = {
        id: `msg_${Date.now()}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);

      // If the AI returned any flashcards inside text implicitly, we can extract or trigger a mock deck addition
      if (textToSend.toLowerCase().includes("gradient descent")) {
        // Automatically inject relevant flashcards in study pool!
        onAddFlashcards([
          {
            id: `fc_auto_${Date.now()}_1`,
            question: "What is the gradient of a loss function?",
            answer: "A vector of partial derivatives pointing in the direction of steepest increase. In Gradient Descent, we negative-step against this vector.",
            subject: selectedSubject
          },
          {
            id: `fc_auto_${Date.now()}_2`,
            question: "How does 'learning rate' affect Gradient Descent updates?",
            answer: "It scales the step size. If too large, optimization overshoots and diverges. If too small, convergence takes excessive epochs.",
            subject: selectedSubject
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Could not fetch AI response. Make sure backend is booted.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 pb-4">
      {/* Subject checklist panel on left */}
      <div className="w-full md:w-64 xl:w-72 flex-shrink-0 flex flex-col h-1/3 md:h-full bg-[#13161c] border border-white/5 rounded-2xl p-4 overflow-y-auto">
        <h3 className="font-serif text-lg font-bold text-[#f0eee8] mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#c8f56a]" />
          Subject Core
        </h3>
        <p className="text-xs text-[#8a8d99] mb-4">
          Select a subject to instantly reconfigure the AI tutor context:
        </p>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
          {DEFAULT_SUBJECTS.map((sub) => {
            const isSel = selectedSubject === sub.name;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.name)}
                className={`flex-shrink-0 flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left text-xs md:text-sm transition-all duration-200 ${
                  isSel
                    ? "bg-white/[0.04] border-[#c8f56a]/30 text-[#f0eee8]"
                    : "bg-transparent border-white/5 text-[#8a8d99] hover:bg-white/[0.01] hover:text-[#f0eee8]"
                }`}
              >
                <span className="text-base">{sub.icon}</span>
                <span className="font-medium truncate flex-1">{sub.name}</span>
                {isSel && <div className="w-1.5 h-1.5 rounded-full bg-[#c8f56a]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main chat window + live visuals panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 h-2/3 md:h-full">
        {/* Chat message dialog */}
        <div className="flex-1 bg-[#13161c] border border-white/5 rounded-2xl flex flex-col min-h-0 h-full relative">
          
          <div className="px-4 py-3 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c8f56a] animate-pulse" />
              <span className="text-xs tracking-wider text-[#8a8d99] uppercase font-mono">
                {selectedSubject} Tutor Session
              </span>
            </div>
            <button 
              onClick={() => {
                setMessages((prev) => [
                  prev[0],
                  {
                    id: `clean_${Date.now()}`,
                    sender: "ai",
                    text: "Workspace cleaned! Ask me a new concept to explore.",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ]);
              }}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-[#8a8d99] px-2.5 py-1 rounded-md transition-all active:scale-95"
            >
              Clear Logs
            </button>
          </div>

          {/* Message log display */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => {
              const isAI = msg.sender === "ai";
              return (
                <div key={msg.id} className={`flex gap-3 ${!isAI ? "justify-end" : "justify-start"}`}>
                  {isAI && (
                    <div className="w-8 h-8 rounded-lg bg-[#c8f56a]/15 flex items-center justify-center text-xs text-[#c8f56a] self-start border border-[#c8f56a]/30">
                      E
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAI 
                      ? "bg-[#1a1e27] border border-white/5 text-[#f0eee8]" 
                      : "bg-[#c8f56a]/10 border border-[#c8f56a]/20 text-[#f0eee8]"
                  }`}>
                    {/* Render simple markdown structures */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    <span className="block text-[9px] text-[#8a8d99] text-right mt-1.5 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  {!isAI && (
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-[#8a8d99] self-start border border-white/10">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-[#c8f56a]/15 flex items-center justify-center text-xs text-[#c8f56a] border border-[#c8f56a]/30">
                  <Sparkles className="w-4 h-4 animate-spin text-[#c8f56a]" />
                </div>
                <div className="bg-[#1a1e27] border border-white/5 rounded-2xl px-4 py-3 text-sm text-[#8a8d99] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing response...</span>
                </div>
              </div>
            )}

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center">
                <p className="font-semibold mb-1">Response Interruption</p>
                <p>{apiError}</p>
                <p className="mt-2 text-[10px] text-gray-400">
                  Tip: Setup process.env.GEMINI_API_KEY inside the Secrets panel. We also support fully interactive offline simulation mode!
                </p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chip queries */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5 scrollbar-none bg-black/10">
            {(PROMPT_CHIPS[selectedSubject] || PROMPT_CHIPS["Machine Learning Theory"]).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
                className="flex-shrink-0 bg-[#1a1e27] hover:bg-[#222733] border border-white/5 text-[11px] text-[#8a8d99] hover:text-[#f0eee8] px-3 py-1.5 rounded-full transition-all active:scale-95 text-left disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Bottom input section */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }} 
            className="p-3 bg-white/[0.01] border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask the AI Tutor anything..."
              disabled={isLoading}
              className="flex-1 bg-[#1a1e27] border border-white/5 rounded-xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#c8f56a]/50 text-[#f0eee8]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-[#c8f56a] hover:bg-[#c8f56a]/90 text-[#07080a] flex items-center justify-center transition-all disabled:opacity-45 disabled:pointer-events-none active:scale-95 shadow-[0_4px_12px_rgba(200,245,106,0.15)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Visualizer sidebar on the side */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col bg-[#13161c] border border-white/5 rounded-2xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <h4 className="font-serif text-sm font-bold text-[#f0eee8] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7dd9b8]" />
              Visual Sandbox
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsVisualizing(!isVisualizing)}
                className={`text-[10px] px-2 py-0.5 rounded ${isVisualizing ? "bg-[#7dd9b8]/10 text-[#7dd9b8]" : "bg-white/5 text-gray-400"}`}
              >
                {isVisualizing ? "Active" : "Paused"}
              </button>
            </div>
          </div>
          
          <p className="text-[11px] text-[#8a8d99] mb-4 leading-relaxed">
            Gradient descent works like navigation under fog. At each point, we calculate how steep the slope drops and move in that downward direction toward minimum loss.
          </p>

          {/* Simulated Hiker Canvas visualizer */}
          <div className="relative bg-[#07080a] border border-white/5 rounded-xl p-3 h-44 flex items-center justify-center overflow-hidden mb-4">
            
            {/* Grid references */}
            <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-2 pointer-events-none">
              <div className="border-t border-dashed border-white w-full h-[1px]" />
              <div className="border-t border-dashed border-white w-full h-[1px]" />
              <div className="border-t border-dashed border-white w-full h-[1px]" />
            </div>

            {/* SVG drawing the loss mountain surface */}
            <svg viewBox="0 0 100 60" className="w-full h-full text-[#8a8d99]">
              {/* Mountain slope line */}
              <path
                d="M 5,50 Q 30,20 50,45 T 90,40"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                strokeDasharray="1.5"
              />
              {/* High error region to dynamic minima */}
              <path
                d="M 12.5,51.25 Q 35,5 62,49 T 87.5,35"
                fill="none"
                stroke="url(#slope-green-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              <defs>
                <linearGradient id="slope-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b8a0f0" />
                  <stop offset="50%" stopColor="#7dd9b8" />
                  <stop offset="100%" stopColor="#c8f56a" />
                </linearGradient>
              </defs>

              {/* Hiker marker node */}
              {/* Map hiker coordinate mapped to drawing scaling:
                  hikerX goes from -0.5 to 2.
                  Scale visual X: 12.5 + ((hikerX - (-0.5)) / 2.5) * 50
                  And local math curve visual y
              */}
              {(() => {
                const ratio = (hikerX - (-0.5)) / 2.5; 
                const visX = 15 + ratio * 55;
                const visY = 48 - Math.pow(ratio - 0.7, 2) * 35;
                return (
                  <g>
                    {/* Shadow pulse ring */}
                    <circle cx={visX} cy={visY} r="3" fill="#c8f56a" opacity="0.3">
                      <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    {/* Inner core */}
                    <circle cx={visX} cy={visY} r="2.2" fill="#07080a" stroke="#c8f56a" strokeWidth="1.2" />
                    {/* Miniature flag for minimum flag mark */}
                    <line x1="70" y1="50" x2="70" y2="35" stroke="#7dd9b8" strokeWidth="0.8" strokeDasharray="1" />
                    <polygon points="70,35 80,38 70,41" fill="#7dd9b8" />
                  </g>
                );
              })()}

              {/* Local Minimum label */}
              <text x="63" y="55" fontSize="3" fill="#7dd9b8" fontFamily="monospace">Minimum (L)</text>
              <text x="10" y="15" fontSize="3" fill="#b8a0f0" fontFamily="monospace">Start Loss</text>
            </svg>

            <span className="absolute bottom-2 right-2 text-[9px] text-[#8a8d99] font-mono select-none">
              Hiker Loss: {(hikerY).toFixed(3)}
            </span>
          </div>

          {/* Simulation controls */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setHikerX(-0.5);
              }}
              className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-xs py-1.5 rounded-lg border border-white/5 font-mono text-[#8a8d99]"
            >
              Reset Peak
            </button>
            <button
              type="button"
              onClick={() => {
                setVisualSpeed((p) => (p === 1 ? 2 : p === 2 ? 3 : 1));
              }}
              className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-xs py-1.5 rounded-lg border border-white/5 font-mono text-[#8a8d99]"
            >
              Speed: {visualSpeed}x
            </button>
          </div>

          <div className="border-t border-white/5 pt-3">
            <span className="text-xs font-semibold text-[#f0eee8] block mb-2">Subject Metrics</span>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#8a8d99]">Primary Optimizer:</span>
                <span className="font-mono text-[#7dd9b8]">SGD + Momentum</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#8a8d99]">Step Size (&alpha;):</span>
                <span className="font-mono text-[#c8f56a]">{(0.15 * visualSpeed).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#8a8d99]">Convergence Rate:</span>
                <span className="font-mono text-[#f0c46a]">92% Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
