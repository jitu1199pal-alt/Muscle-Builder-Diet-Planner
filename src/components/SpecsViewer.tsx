import React, { useState } from "react";
import { SPECS_DATA, SpecPart } from "../specsData";
import { BookOpen, Copy, CheckCircle, Search, Terminal, ArrowRight, Smartphone, Sparkles, Code, Volume } from "lucide-react";

export default function SpecsViewer() {
  const [selectedPart, setSelectedPart] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const activePart = SPECS_DATA.find((p) => p.number === selectedPart) || SPECS_DATA[0];

  const filteredParts = SPECS_DATA.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "emerald": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "blue": return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case "purple": return "bg-purple-500/15 text-purple-400 border-purple-500/20";
      case "yellow": return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "pink": return "bg-pink-500/15 text-pink-400 border-pink-500/20";
      case "indigo": return "bg-indigo-500/15 text-indigo-400 border-indigo-500/20";
      case "cyan": return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
      case "rose": return "bg-rose-500/15 text-rose-400 border-rose-500/20";
      default: return "bg-gray-500/15 text-gray-400 border-gray-500/20";
    }
  };

  // Convert simple markdown elements for premium rendering in specs
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("#### ")) {
        return <h5 key={index} className="text-sm font-semibold text-gray-200 mt-4 mb-2 font-display">{line.replace("#### ", "")}</h5>;
      }
      if (line.startsWith("### ")) {
        return <h4 key={index} className="text-base font-semibold text-brand-primary mt-6 mb-3 font-display border-b border-gray-800/60 pb-1">{line.replace("### ", "")}</h4>;
      }
      // Bullet points
      if (line.startsWith("- ")) {
        const itemText = line.replace("- ", "");
        // Highlight inline code
        if (itemText.includes("`")) {
          const parts = itemText.split("`");
          return (
            <li key={index} className="ml-4 list-disc text-sm text-gray-300 mb-1.5 leading-relaxed">
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <code key={pIdx} className="bg-brand-card/80 text-brand-secondary px-1 py-0.5 rounded text-xs font-mono">{p}</code> : p)}
            </li>
          );
        }
        return <li key={index} className="ml-4 list-disc text-sm text-gray-300 mb-1.5 leading-relaxed">{itemText}</li>;
      }
      // Number lists
      if (/^\d+\.\s/.test(line)) {
        return <p key={index} className="text-sm text-gray-300 mb-2 leading-relaxed font-semibold mt-3 text-brand-secondary">{line}</p>;
      }
      // Code blocks start-end
      if (line.trim() === "```" || line.trim().startsWith("```")) {
        return null; // Strip raw tick bounds, parent containers handle styling
      }
      // Fallback
      return <p key={index} className="text-sm text-gray-300 mb-2 leading-relaxed">{line}</p>;
    });
  };

  // Extract raw code snippets for copy button
  const extractCode = (markdown: string) => {
    const codeRegex = /```[\s\S]*?```/g;
    const matches = markdown.match(codeRegex);
    if (matches && matches.length > 0) {
      return matches[0].replace(/```yaml|```json|```/g, "").trim();
    }
    return markdown;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="specs-view-container">
      {/* LEFT SIDEBAR: PART INDICES */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-brand-card border border-gray-800 rounded-xl p-4">
          <h3 className="text-base font-semibold text-gray-200 mb-3 font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-primary" /> Roadmap Spec Index
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            The full 8-part mobile execution framework that maps directly to launch-ready play stores.
          </p>

          {/* Search bar */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#07090e] border border-gray-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
          </div>

          {/* Part indicators */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredParts.map((part) => (
              <button
                key={part.number}
                onClick={() => setSelectedPart(part.number)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-3 ${
                  selectedPart === part.number
                    ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                    : "bg-[#07090e]/60 border-gray-800/60 text-gray-400 hover:bg-[#07090e]/90 hover:border-gray-700 hover:text-gray-300"
                }`}
              >
                <div className={`w-6 h-6 rounded-md font-mono text-xs font-semibold flex items-center justify-center shrink-0 ${
                  selectedPart === part.number
                    ? "bg-brand-primary text-brand-bg scale-105"
                    : "bg-gray-800 text-gray-400"
                }`}>
                  0{part.number}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{part.title}</div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{part.summary}</div>
                </div>
              </button>
            ))}

            {filteredParts.length === 0 && (
              <div className="text-center py-6 text-xs text-gray-500">
                No matching specs found.
              </div>
            )}
          </div>
        </div>

        {/* COMPREHENSIVE STATS CARD */}
        <div className="bg-gradient-to-br from-brand-card to-brand-sidebar border border-brand-primary/20 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2 text-brand-primary font-semibold mb-1">
            <Smartphone className="w-4 h-4" /> Flutter Target Compatibility
          </div>
          <div className="text-gray-300 mt-2 space-y-1.5">
            <div className="flex justify-between border-b border-gray-800/80 pb-1">
              <span className="text-gray-400">Target Framework:</span>
              <span className="font-semibold text-gray-200">Flutter SDK 3.22+</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/80 pb-1">
              <span className="text-gray-400">Build Engine:</span>
              <span className="font-semibold text-gray-200">Dart 3.4 (Nullable)</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/80 pb-1">
              <span className="text-gray-400">Build Variants:</span>
              <span className="font-semibold text-gray-200">Android AAB, iOS XC</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-400">Layout System:</span>
              <span className="font-semibold text-brand-secondary">Adaptive Scaffold</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: SELECTED ROADMAP SPEC DETAILS */}
      <div className="lg:col-span-8">
        <div className="bg-brand-card border border-gray-800 rounded-xl p-5 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-wide border rounded-full uppercase ${getBadgeColor(activePart.color)}`}>
                  {activePart.badge}
                </span>
                <span className="text-xs text-mono text-gray-500 font-mono">Part 0{activePart.number} of 08</span>
              </div>
              <h2 className="text-xl font-bold font-display text-gray-100">{activePart.title}</h2>
              <p className="text-xs text-gray-400">{activePart.summary}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyText(SPECS_DATA.find(p => p.number === selectedPart)?.content || "")}
                className="bg-[#07090e] border border-gray-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-brand-primary" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Raw spec
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Document Area */}
          <div className="space-y-4 prose prose-invert max-w-none text-gray-300">
            {renderMarkdown(activePart.content)}
          </div>

          {/* Special Visualizations based on Selected Part */}
          {activePart.number === 3 && (
            <div className="mt-6 bg-[#07090e] border border-gray-800 rounded-lg p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary mb-3">
                <Terminal className="w-3.5 h-3.5" /> Quick Scaffold Terminal Command
              </div>
              <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded font-mono text-[11px] text-amber-500">
                <span className="truncate">mkdir -p lib/{`{core/{theme,constants,utils},data,models,providers,services,screens/{splash,onboarding,user_details,goal_selection,focus_selection,generate_plan,dashboard,workout,diet,progress,settings},widgets,ads}`}</span>
                <button
                  type="button"
                  onClick={() => handleCopyText("mkdir -p lib/{core/{theme,constants,utils},data,models,providers,services,screens/{splash,onboarding,user_details,goal_selection,focus_selection,generate_plan,dashboard,workout,diet,progress,settings},widgets,ads}")}
                  className="text-gray-500 hover:text-gray-300 p-1 shrink-0 ml-2 shadow-sm"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {activePart.number === 4 && (
            <div className="mt-6 bg-[#07090e] border border-brand-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary" /> Active Spec Formulas Calculator
              </div>
              <p className="text-[11px] text-gray-400 mb-3">
                See these exact exact math rules run in real time on our customized workout profile page to see consistent results.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-brand-card border border-gray-800/80 p-2.5 rounded-lg">
                  <div className="text-gray-500 text-[10px]">MEN BMR</div>
                  <code className="text-xs text-brand-primary font-mono block mt-1">10W + 6.25H - 5A + 5</code>
                </div>
                <div className="bg-brand-card border border-gray-800/80 p-2.5 rounded-lg">
                  <div className="text-gray-500 text-[10px]">WOMEN BMR</div>
                  <code className="text-xs text-brand-primary font-mono block mt-1">10W + 6.25H - 5A - 161</code>
                </div>
              </div>
            </div>
          )}

          {/* Navigation between steps */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-800/60 mt-6">
            <button
              onClick={() => setSelectedPart(prev => Math.max(prev - 1, 1))}
              disabled={selectedPart === 1}
              className="text-xs font-semibold text-gray-400 hover:text-white hover:underline disabled:opacity-30 disabled:hover:no-underline flex items-center gap-1 transition"
            >
              ← Previous Part
            </button>
            <span className="text-xs text-gray-500">Spec Guide {selectedPart}/8</span>
            <button
              onClick={() => setSelectedPart(prev => Math.min(prev + 1, SPECS_DATA.length))}
              disabled={selectedPart === SPECS_DATA.length}
              className="text-xs font-semibold text-brand-primary hover:text-brand-primary/80 hover:underline disabled:opacity-30 disabled:hover:no-underline flex items-center gap-1 transition"
            >
              Next Part →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
