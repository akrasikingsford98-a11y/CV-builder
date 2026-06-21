import React, { useState } from "react";
import { 
  Plus, Loader2, Sparkles, Copy, Check, Terminal, 
  ChevronRight, ArrowRight, BookOpen, Layers
} from "lucide-react";

interface ProjectStartersProps {
  onAddProject: (title: string, tech: string, bullets: string[]) => void;
}

export default function ProjectStarters({ onAddProject }: ProjectStartersProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    recommendedTechStack: string;
    suggestedBullets: string[];
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasCopiedAll, setHasCopiedAll] = useState(false);
  const [error, setError] = useState("");

  const sampleTopics = [
    { label: "Distributed Raft Store", query: "Distributed Key-Value consensus store using Raft" },
    { label: "PyTorch Image Classifier", query: "Computer Vision / Image classification neural network in PyTorch" },
    { label: "Collaborative WebSocket Canvas", query: "Realtime Multi-user editor canvas using WebSockets and Redis shards" },
    { label: "Custom Compiler / Interpreter", query: "Full compiler or virtual machine with abstract syntax trees and LLVM" },
    { label: "Linux Kernel Thread Scheduler", query: "Kernel level thread scheduler or memory allocator simulation under C" }
  ];

  const generateStarter = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setTopic(searchTopic);

    try {
      const response = await fetch("/api/counselor/generate-starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchTopic })
      });

      if (!response.ok) {
        throw new Error("Failed to contact template generator. Please check credentials.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const formatted = result.suggestedBullets.map(b => `• ${b}`).join("\n");
    navigator.clipboard.writeText(formatted);
    setHasCopiedAll(true);
    setTimeout(() => setHasCopiedAll(false), 2000);
  };

  const handleInjectProject = () => {
    if (!result) return;
    onAddProject(
      topic.split(" ").slice(0, 3).join(" ") || "CS System Project",
      result.recommendedTechStack,
      result.suggestedBullets
    );
    // Reset state after injection
    setResult(null);
    setTopic("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[85vh] font-sans">
      
      {/* Intro block */}
      <div className="p-4 rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-900 shadow space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-450 text-[10px] font-mono rounded fw-bold uppercase">Precomposed Blueprints</div>
          <h2 className="text-sm font-semibold font-display text-slate-100 flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-rose-450" />
            CS Starter Project Generator
          </h2>
        </div>
        <p className="text-xs text-slate-305 leading-relaxed">
          Struggling to draft impressive resume entries for your complex projects? Select a common computer science topic below, or type your custom system. The Counselor will output 4 incredibly robust, tech-dense XYZ experience lines that demonstrate high engineering capability.
        </p>

        {/* Custom Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type your own topic: e.g. Docker container scanner, DNS server..."
            className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && generateStarter(topic)}
          />
          <button
            onClick={() => generateStarter(topic)}
            disabled={loading}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-slate-100 text-xs font-semibold rounded shrink-0 transition-colors"
          >
            Generate
          </button>
        </div>

        {/* Quick select buttons */}
        <div className="space-y-1.5 Pt-2">
          <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Pick Templates:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleTopics.map((st, idx) => (
              <button
                key={idx}
                onClick={() => generateStarter(st.query)}
                disabled={loading}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-705 rounded transition-all flex items-center gap-0.5 font-sans"
              >
                <ChevronRight className="w-3 h-3 text-rose-450" />
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <div className="text-center space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Writing Systems Achievements...</h4>
            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Thinking through design patterns, calculating concurrent performance thresholds, and phrasing high-impact academic achievements.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-800 text-rose-300 text-xs rounded">
          {error}
        </div>
      )}

      {/* RESULT PANEL */}
      {result && !loading && !error && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="p-4 border border-rose-500/20 bg-rose-950/10 rounded-xl space-y-4">
            
            {/* Action buttons */}
            <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-rose-900/30">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-405 tracking-wider block">Generated Topic:</span>
                <span className="text-xs text-slate-100 font-semibold font-display italic">"{topic}"</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyAll}
                  className="px-2.5 py-1 text-[11px] border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded flex items-center gap-1 transition-colors"
                >
                  {hasCopiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedAll ? "All Copied!" : "Copy All Bullets"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleInjectProject}
                  className="px-2.5 py-1 text-[11px] bg-rose-600 hover:bg-rose-500 text-slate-100 font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert to My Resume</span>
                </button>
              </div>
            </div>

            {/* Recommended stack */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 font-mono">
                <Terminal className="w-3.5 h-3.5 text-rose-450" />
                Recommended Technologies:
              </span>
              <p className="text-xs text-slate-200 bg-slate-950 p-2 border border-slate-800 rounded font-mono font-semibold">
                {result.recommendedTechStack}
              </p>
            </div>

            {/* Generated Bullets List */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                Suggested XYZ Bullet Points:
              </span>
              
              <div className="space-y-2">
                {result.suggestedBullets.map((bullet, idx) => (
                  <div key={idx} className="group p-3 border border-slate-800 bg-slate-900/30 hover:border-rose-900/40 rounded-lg relative space-y-1 transition-all">
                    <p className="text-xs text-slate-100 font-serif leading-relaxed pr-6">
                      {bullet}
                    </p>
                    
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bullet, idx)}
                      className="absolute right-2 top-2 p-1 border border-slate-850 hover:bg-slate-800 text-slate-405 group-hover:text-slate-100 rounded transition-all"
                      title="Copy Individual Bullet"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-405" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Friendly guidance */}
            <p className="text-[11px] text-slate-400 leading-normal bg-slate-950/40 p-3 rounded border border-slate-800/60">
              <span className="font-semibold text-slate-300">💡 Pro-tip:</span> Don't just paste these bullets wholesale—replace the placeholder numbers and technologies with your actual findings during development to pass recruiter phone technical interviews!
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
