import React, { useState } from "react";
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  Network, 
  RotateCw, 
  LineChart, 
  FileText,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export default function Navbar({ currentTab, onChangeTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { id: "explore", label: "Explore Home", icon: BookOpen },
    { id: "tutor", label: "AI Tutor", icon: MessageSquare },
    { id: "snap", label: "Snap & Understand", icon: FileText },
    { id: "graph", label: "Knowledge Graph", icon: Network },
    { id: "review", label: "Review Decks", icon: RotateCw },
    { id: "leaderboard", label: "Retention Forecast", icon: LineChart },
  ];

  const handleLinkClick = (tabId: string) => {
    onChangeTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between bg-[#07080a]/85 backdrop-blur-md border-b border-white/5 transition-all">
      
      {/* Brand logo */}
      <div 
        onClick={() => handleLinkClick("explore")} 
        className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-[#c8f56a]/15 border border-[#c8f56a]/30 flex items-center justify-center text-[#c8f56a]">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="font-serif text-xl font-bold tracking-tight text-[#f0eee8]">
          Edu<span className="text-[#c8f56a] group-hover:opacity-80 transition-opacity">Verse</span>
        </span>
      </div>

      {/* Nav List links for Desktop */}
      <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentTab === link.id;
          return (
            <li key={link.id}>
              <button
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? "text-[#c8f56a] bg-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    : "text-[#8a8d99] hover:text-[#f0eee8] hover:bg-white/[0.01]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Actions and mobile toggles */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleLinkClick("tutor")}
          className="bg-[#c8f56a] hover:bg-[#c8f56a]/90 text-[#07080a] font-medium px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(200,245,106,0.15)]"
        >
          <span className="hidden sm:inline">Talk to AI Tutor</span>
          <span className="sm:hidden">Tutor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-gray-300 hover:text-[#f0eee8] active:scale-90 transition-all font-mono"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#c8f56a]" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE EXPANDED DROPDOWN NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 z-40 bg-[#0c0d12] border-b border-white/10 shadow-2xl p-4 lg:hidden"
          >
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase text-gray-500 block px-3">
                Main Menu navigation
              </span>
              <ul className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentTab === link.id;
                  return (
                    <li key={link.id}>
                      <button
                        onClick={() => handleLinkClick(link.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "text-[#c8f56a] bg-[#c8f56a]/10 border border-[#c8f56a]/20"
                            : "text-[#8a8d99] hover:text-[#f0eee8] bg-black/10 hover:bg-black/20"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
