import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, ChevronRight, Play, Loader2, Sparkles, Plus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SnapAnalyzeProps {
  onAddFlashcards: (newCards: any[]) => void;
  onNavigateToTab: (tab: string) => void;
}

const TEMPLATES = [
  {
    title: "Backpropagation Principles",
    description: "Calculus behind learning loops, partial derivative steps and node dependencies.",
    text: "Neural Networks backpropagate errors from final layer node losses through back-connections by utilizing derivative chains. Key variables are delta calculation vectors mapped against weight steps, where learning step size dictates loss minimization pace in high-dimensional manifolds.",
    subject: "Machine Learning Theory"
  },
  {
    title: "LR(1) Predictive Parsing",
    description: "State tables, action/goto values and syntax tree parsing inside compilers.",
    text: "LR(1) shift-reduce parsers employ left-to-right lookahead vectors to evaluate terminal grammars, constructing deterministic automata tables. Tokens are either shifted onto the compiler stack or reduced according to non-ambiguous context rules.",
    subject: "Compilers"
  },
  {
    title: "Complex Calculus: Euler's Form",
    description: "E, Pi and trigonometric ratios linkage physically mapped.",
    text: "Euler's formula connects exponentials to trigonometric matrices: e^(i*theta) = cos(theta) + i*sin(theta). When theta is exactly Pi, the composite expression aggregates key mathematical constants (e, i, Pi, 1, 0) into a single unified balance vector.",
    subject: "Mathematical Calculus"
  }
];

export default function SnapAnalyze({ onAddFlashcards, onNavigateToTab }: SnapAnalyzeProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [manualText, setManualText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [payloadResult, setPayloadResult] = useState<any | null>(null);
  const [injectSuccess, setInjectSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setSelectedTemplate(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFileBase64(base64);
      // set manual text helper to indicate scan started
      setManualText(`[Scanned Image Note Doc: ${file.name}]`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleChooseTemplate = (idx: number) => {
    setSelectedTemplate(idx);
    setManualText(TEMPLATES[idx].text);
    setFileName(null);
    setFileBase64(null);
    setErrorMessage(null);
  };

  const handleRunAnalysis = async () => {
    const textToAnalyze = manualText.trim();
    if (!textToAnalyze && !fileBase64) {
      setErrorMessage("Please select a sample template note, drop a node file or input notes text.");
      return;
    }

    setIsLoading(true);
    setPayloadResult(null);
    setInjectSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/snap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notesText: textToAnalyze,
          imageData: fileBase64,
          imageName: fileName || "cheatsheet.png"
        })
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve structured note breakdowns from secondary endpoint.");
      }

      const data = await response.json();
      setPayloadResult(data);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Failed to parse document. Check terminal logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInjectFlashcards = () => {
    if (!payloadResult || !payloadResult.flashcards) return;
    onAddFlashcards(payloadResult.flashcards);
    setInjectSuccess(true);
    setTimeout(() => {
      onNavigateToTab("review");
    }, 1500);
  };

  return (
    <div className="pt-20 px-4 max-w-5xl mx-auto min-h-screen pb-12">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f0eee8] mb-3">
          Snap &amp; <span className="text-[#c8f56a]">Understand</span>
        </h2>
        <p className="text-sm md:text-base text-[#8a8d99] max-w-xl mx-auto">
          Photograph handwritten blueprints, drag in diagrams, or select classic notes templates to formulate instant conceptual mappings and flashcard reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left side upload controllers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#13161c] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#f0eee8] uppercase tracking-wider font-mono">
              Note Upload Source
            </h3>

            {/* Drag & drop box */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#c8f56a] bg-[#c8f56a]/5"
                  : "border-white/10 hover:border-white/20 bg-black/10"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-[#8a8d99] mx-auto mb-3" />
              {fileName ? (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#f0eee8] block truncate">{fileName}</span>
                  <span className="text-[10px] text-[#7dd9b8]">Ready to parse document!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[#f0eee8] block">Select or Drag Note Photo</span>
                  <span className="text-[10px] text-[#8a8d99]">Supports PNG, JPEG, or scanned note logs</span>
                </div>
              )}
            </div>

            {/* Selector divider */}
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span>OR USE PRE-LOADED TEMPLATE</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            {/* Templates */}
            <div className="space-y-2">
              {TEMPLATES.map((tpl, idx) => {
                const isSel = selectedTemplate === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChooseTemplate(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs tracking-wide transition-all ${
                      isSel
                        ? "bg-[#c8f56a]/5 border-[#c8f56a]/30 text-[#f0eee8]"
                        : "bg-transparent border-white/5 text-[#8a8d99] hover:bg-white/[0.01] hover:text-[#f0eee8]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[#f0eee8] mb-1">
                      <span>{tpl.title}</span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-[#8a8d99]">
                        {tpl.subject}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed truncate">{tpl.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Textarea review */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-mono text-[#8a8d99] block">RAW NOTE CONTENT PREVIEW</label>
              <textarea
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setSelectedTemplate(null);
                }}
                placeholder="Alternative: Paste handwritten textbook contents or OCR string directly here..."
                className="w-full bg-[#1a1e27] border border-white/5 rounded-xl p-3 h-28 text-xs font-mono text-[#f0eee8] focus:outline-none focus:border-[#c8f56a]/40"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="w-full bg-[#c8f56a] text-[#07080a] font-semibold py-2.5 rounded-xl hover:scale-[1.01] transition-all text-xs flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_16px_rgba(200,245,106,0.15)] disabled:opacity-45"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing Note Scans...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#07080a]" />
                  <span>Activate Note Analysis</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right side results viewport */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {!payloadResult && !isLoading ? (
              <div className="bg-[#13161c] border border-white/5 rounded-2xl p-8 text-center h-[420px] flex flex-col items-center justify-center">
                <FileText className="w-12 h-12 text-gray-700 mb-3" />
                <h4 className="font-serif text-lg text-gray-400 font-semibold mb-1">Observation Station</h4>
                <p className="text-xs text-[#8a8d99] max-w-xs mx-auto">
                  Click "Activate Note Analysis" to see instant summary breakdowns, concept tagging, and custom-synthesized spaced repetition decks.
                </p>
              </div>
            ) : isLoading ? (
              <div className="bg-[#13161c] border border-white/5 rounded-2xl p-8 text-center h-[420px] flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#c8f56a]/5 flex items-center justify-center border border-[#c8f56a]/20 animate-pulse">
                  <Sparkles className="w-6 h-6 text-[#c8f56a] animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-[#f0eee8]">AI Parser Working</h4>
                  <p className="text-xs text-[#8a8d99] max-w-xs">
                    Executing severe concept mapping, checking definitions, and creating interactive card flash decks.
                  </p>
                </div>
                {/* Simulated telemetry loader values */}
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#c8f56a] animate-[fillBar_3s_linear_infinite]" style={{ width: "65%" }}></div>
                </div>
              </div>
            ) : (
              <div className="bg-[#13161c] border border-white/5 rounded-2xl p-6 space-y-6">
                
                {/* Result header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#7dd9b8] block mb-1">
                      Analysis Report (Structured)
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#f0eee8]">
                      Core Observations
                    </h3>
                  </div>
                  {payloadResult.isDemoMode && (
                    <span className="text-[10px] font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/15">
                      Offline Demo Mode
                    </span>
                  )}
                </div>

                {/* Summary block */}
                <div className="space-y-2">
                  <h4 className="text-xs text-[#8a8d99] font-mono uppercase tracking-wider">Note Summary</h4>
                  <p className="text-sm text-[#f0eee8] leading-relaxed bg-[#1a1e27] border border-white/5 rounded-xl p-4 whitespace-pre-wrap">
                    {payloadResult.summary}
                  </p>
                </div>

                {/* Tagged terms */}
                <div className="space-y-2">
                  <h4 className="text-xs text-[#8a8d99] font-mono uppercase tracking-wider">Identified Core Terms</h4>
                  <div className="flex flex-wrap gap-2">
                    {payloadResult.concepts.map((concept: string, i: number) => (
                      <span
                        key={i}
                        className="bg-[#c8f56a]/10 text-xs text-[#c8f56a] border border-[#c8f56a]/20 px-3 py-1 rounded-full font-medium"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Concept explainer mappings */}
                <div className="space-y-3">
                  <h4 className="text-xs text-[#8a8d99] font-mono uppercase tracking-wider">Definitions Overview</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {payloadResult.explanations.map((exp: any, i: number) => (
                      <div key={i} className="bg-black/10 border border-white/5 p-3 rounded-lg flex gap-3">
                        <span className="text-xs text-[#7dd9b8] font-mono font-bold mt-0.5">0{i+1}.</span>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#f0eee8] block">{exp.concept}</span>
                          <p className="text-xs text-[#8a8d99] leading-relaxed">{exp.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated / generated deck ready items */}
                <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-sm font-bold text-[#f0eee8] block">
                      Generated Flashcards ({payloadResult.flashcards.length} cards)
                    </span>
                    <span className="text-xs text-[#8a8d99] block">
                      Instantly index these concepts to your active Spaced Repetition engine.
                    </span>
                  </div>

                  {injectSuccess ? (
                    <div className="bg-[#7dd9b8]/15 text-[#7dd9b8] text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-[#7dd9b8]/20 animate-pulse">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Deck Injected! Reviewing...</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleInjectFlashcards}
                      className="bg-[#7dd9b8] hover:bg-[#7dd9b8]/90 text-[#07080a] font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Inject to Active Pool
                    </button>
                  )}
                </div>

              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
