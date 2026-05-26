import React, { useState } from "react";
import { Network, Info, MessageSquare, Flame, BookOpen, Layers } from "lucide-react";

interface KnowledgeGraphProps {
  onSearchConcept: (concept: string) => void;
  onNavigateToTab: (tab: string, initialSub?: string) => void;
}

const GRAPH_NODES = [
  // Machine Learning Hub
  { id: "opt", name: "Gradient Descent", category: "Machine Learning Theory", val: 24, x: 200, y: 150, description: "A first-order iterative optimization algorithm for finding the local minimum of a differentiable loss function.", prerequisites: ["Partial Derivatives"], linksText: "Loss landscape, Learning Rate, SGD" },
  { id: "back", name: "Backpropagation", category: "Machine Learning Theory", val: 24, x: 140, y: 70, description: "Calculates the gradient of the loss function with respect to weights by applying the chain rule backward layer-by-layer.", prerequisites: ["Chain Rule", "Loss functions"], linksText: "Weights tuning, Error vectors" },
  { id: "reg", name: "Regularization (L1/L2)", category: "Machine Learning Theory", val: 18, x: 300, y: 80, description: "Prevents overfitting by adding weight magnitude penalties directly to the cost function.", prerequisites: ["Loss Landscape"], linksText: "Overfitting, Cost, Ridge/Lasso" },
  { id: "loss", name: "Loss Landscape", category: "Machine Learning Theory", val: 18, x: 280, y: 220, description: "A high-dimensional surface of neural network weights mapped against absolute training and validation errors.", prerequisites: ["Grad Descent"], linksText: "Local Minima, Saddle points" },

  // Compilers Hub
  { id: "front", name: "Compiler Front-End", category: "Compilers", val: 24, x: 500, y: 120, description: "The phase responsible for translating raw source codes into verified abstract syntax trees.", prerequisites: ["Lexing", "Parsing"], linksText: "LR parsing, AST synthesis" },
  { id: "parse", name: "Predictive Parse Tables", category: "Compilers", val: 20, x: 580, y: 60, description: "Deterministic lookup matrix maps current grammar stack symbols and lookahead tokens to production rules safely.", prerequisites: ["Grammars"], linksText: "LL(1), LR(1), Shift-reduce" },
  { id: "reg_alloc", name: "Register Allocation", category: "Compilers", val: 18, x: 440, y: 200, description: "Maps an arbitrary number of variables onto the CPU's limited physical registers using graph coloring heuristic.", prerequisites: ["Liveness Analysis"], linksText: "Chaitin's, Spilling vectors" },

  // Calculus Hub
  { id: "chain", name: "Mathematical Chain Rule", category: "Mathematical Calculus", val: 22, x: 120, y: 280, description: "Formulates derivatives of nested composite math functions using iterative step matrix coordinates.", prerequisites: ["Rates of Change"], linksText: "Derivative multiplication, Delta steps" },
  { id: "euler", name: "Euler's Identity", category: "Mathematical Calculus", val: 20, x: 400, y: 310, description: "The elegant equation e^(i*pi) + 1 = 0 relating e, pi, i, 1, and 0 under trigonometry coordinates.", prerequisites: ["Complex numbers"], linksText: "Polar equations, Trigonometric limits" }
];

const GRAPH_EDGES = [
  { source: "chain", target: "back" },
  { source: "back", target: "opt" },
  { source: "opt", target: "loss" },
  { source: "loss", target: "reg" },
  { source: "front", target: "parse" },
  { source: "front", target: "reg_alloc" },
  { source: "chain", target: "euler" }
];

export default function KnowledgeGraph({ onSearchConcept, onNavigateToTab }: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<any>(GRAPH_NODES[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = ["All", "Machine Learning Theory", "Compilers", "Mathematical Calculus"];

  const filteredNodes = categoryFilter === "All"
    ? GRAPH_NODES
    : GRAPH_NODES.filter(n => n.category === categoryFilter);

  // Filter edges where both nodes are visible
  const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = GRAPH_EDGES.filter(e => 
    visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  return (
    <div className="pt-20 px-4 max-w-5xl mx-auto min-h-screen pb-12">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#f0eee8] mb-3">
          Explore the <span className="text-[#c8f56a]">Knowledge Graph</span>
        </h2>
        <p className="text-sm text-[#8a8d99] max-w-xl mx-auto">
          Navigate 50,000+ linked academic concepts. Click any node to reveal foundational requirements, connected subjects, and begin customized learning sessions.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-150 ${
              categoryFilter === cat
                ? "bg-[#c8f56a] border-[#c8f56a] text-[#07080a]"
                : "bg-[#13161c] border-white/5 text-[#8a8d99] hover:text-[#f0eee8] hover:bg-white/[0.01]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive SVG Canvas viewport */}
        <div className="lg:col-span-8 bg-[#13161c] border border-white/5 rounded-2xl p-4 overflow-hidden shadow-2xl relative">
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#8a8d99] bg-[#07080a]/60 px-3 py-1.5 rounded-full border border-white/5 pointer-events-none select-none">
            <Layers className="w-3.5 h-3.5 text-[#c8f56a]" />
            <span>Interactive Space Viewport</span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-[#07080a] rounded-xl overflow-hidden border border-white/5">
            <svg 
              className="w-full h-full" 
              viewBox="50 30 600 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.15)" />
                </marker>
              </defs>

              {/* Edge/Links connections with arrows showing prerequisites */}
              {filteredEdges.map((edge, i) => {
                const sourceNode = GRAPH_NODES.find(n => n.id === edge.source);
                const targetNode = GRAPH_NODES.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;
                return (
                  <line
                    key={i}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    markerEnd="url(#arrow)"
                  />
                );
              })}

              {/* Node handles */}
              {GRAPH_NODES.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isFilteredOut = categoryFilter !== "All" && node.category !== categoryFilter;
                
                // Colors based on categories
                let strokeColor = "#8a8d99";
                let fillColor = "rgba(40,45,55,0.85)";
                if (node.category === "Machine Learning Theory") {
                  strokeColor = "#b8a0f0";
                  fillColor = isSelected ? "#b8a0f0" : "rgba(184,160,240,0.15)";
                } else if (node.category === "Compilers") {
                  strokeColor = "#f0c46a";
                  fillColor = isSelected ? "#f0c46a" : "rgba(240,196,106,0.15)";
                } else if (node.category === "Mathematical Calculus") {
                  strokeColor = "#7dd9b8";
                  fillColor = isSelected ? "#7dd9b8" : "rgba(125,217,184,0.15)";
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group select-none"
                    opacity={isFilteredOut ? 0.35 : 1}
                  >
                    {/* Shadow active focus circle */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.val + 6}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "10s" }}
                      />
                    )}

                    {/* Standard node body */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.val}
                      fill={isSelected ? strokeColor : "#0d0f13"}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-200 group-hover:scale-105"
                    />

                    {/* Node title */}
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      fill={isSelected ? "#07080a" : "#f0eee8"}
                      fontSize={node.val < 20 ? "7.5px" : "8.5px"}
                      fontWeight="bold"
                      className="pointer-events-none transition-colors"
                    >
                      {node.name.split(" ").slice(-1)[0]}
                    </text>

                    {/* Small preview tag tooltip on hover */}
                    <title>{node.name} ({node.category})</title>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Hub details on right */}
        <div className="lg:col-span-4 h-full">
          {selectedNode ? (
            <div className="bg-[#13161c] border border-white/5 rounded-2xl p-5 space-y-6 flex flex-col justify-between min-h-[360px]">
              <div className="space-y-4">
                {/* Header card info */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#c8f56a] font-bold">
                    {selectedNode.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#f0eee8] mt-1">
                    {selectedNode.name}
                  </h3>
                </div>

                {/* Description */}
                <div className="space-y-1.5 p-3.5 bg-black/10 border border-white/5 rounded-xl text-xs md:text-sm text-[#8a8d99] leading-relaxed">
                  <div className="flex items-center gap-1 text-[#f0eee8] font-bold text-xs mb-1.5 font-mono uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-[#7dd9b8]" />
                    Concept Definition
                  </div>
                  <p className="text-[#f0eee8]">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Prereq chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">Prerequisites</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.prerequisites && selectedNode.prerequisites.map((p: string, i: number) => (
                      <span key={i} className="bg-white/5 text-[10px] px-2.5 py-0.5 rounded-md text-[#8a8d99] font-medium border border-white/5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Linked topics */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">Cross Connections</span>
                  <p className="text-xs text-[#8a8d99] italic">{selectedNode.linksText}</p>
                </div>
              </div>

              {/* Action buttons tightly routing dashboard */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const promptText = `Explain ${selectedNode.name} under the context of ${selectedNode.category} with helpful worked examples and mathematical details.`;
                    onSearchConcept(promptText);
                    onNavigateToTab("tutor", selectedNode.category);
                  }}
                  className="w-full bg-[#c8f56a] hover:bg-[#c8f56a]/90 text-[#07080a] font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discuss with AI Tutor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateToTab("review");
                  }}
                  className="w-full border border-white/10 hover:border-white/20 text-[#f0eee8] hover:bg-white/5 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#7dd9b8]" />
                  Launch Concept Reviews
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#13161c] border border-white/5 rounded-2xl p-5 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Network className="w-8 h-8 text-gray-700 mb-2" />
              <span className="text-sm font-semibold text-gray-400">Concept Details</span>
              <span className="text-xs text-gray-500 mt-1">Select any graph node inside viewport to explore structure details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
