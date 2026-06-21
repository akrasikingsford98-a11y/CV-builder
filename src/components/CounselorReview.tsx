import React, { useState } from "react";
import { CVState, CareerCounselorReview } from "../types";
import { 
  Sparkles, Loader2, Play, CircleAlert, CheckCircle, 
  ChevronRight, ArrowUpRight, Award, ShieldAlert, Cpu, Layers, FileSpreadsheet
} from "lucide-react";

interface CounselorReviewProps {
  cv: CVState;
}

export default function CounselorReview({ cv }: CounselorReviewProps) {
  const [review, setReview] = useState<CareerCounselorReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerReview = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/counselor/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Counselor service. Please confirm connection/secrets are established.");
      }

      const data = await response.json();
      setReview(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Score badge helper
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500 bg-emerald-950/20";
    if (score >= 75) return "text-amber-400 border-amber-500 bg-amber-950/20";
    return "text-rose-400 border-rose-500 bg-rose-950/20";
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[85vh] font-sans">
      {/* Intro Header */}
      <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-900 shadow space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono rounded fw-bold uppercase">AI Service</div>
          <h2 className="text-sm font-semibold font-display text-slate-100 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Career Counselor Review Engine
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ask the Former Big-Tech Technical Recruiter model to perform an exhaustive, multi-dimensional audit of your computer science resume. It checks ATS parsing compatibility, Google XYZ-formula compliance, language density, and architectural depth.
        </p>

        {!loading && (
          <button
            onClick={triggerReview}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 font-semibold text-xs rounded-lg shadow-md hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Evaluate My Draft Resume
          </button>
        )}
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <div className="text-center space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Analyzing Experience Context...</h4>
            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Running ATS syntax matchers, verifying active verbs, drafting optimized growth points, and scanning for missing specialized framework declarations.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-start gap-2.5">
          <CircleAlert className="w-4 h-4 text-rose-450 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Analysis Interrupted</p>
            <p>{error}</p>
            <button
              onClick={triggerReview}
              className="mt-2 text-[10px] underline hover:text-rose-100 font-semibold flex items-center gap-1"
            >
              Retry Interview
            </button>
          </div>
        </div>
      )}

      {/* RENDER COMPLETED REVIEW */}
      {review && !loading && !error && (
        <div className="space-y-4 animate-fade-in">
          {/* Main Score Card & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Score Ring Display */}
            <div className={`border p-4 rounded-xl flex flex-col items-center justify-center text-center ${getScoreColor(review.score)}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-2 font-display">ATS Quality Rank</span>
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* SVG Ring Background */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * review.score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="text-3xl font-extrabold tracking-tighter">{review.score}</span>
              </div>
              <span className="text-[11px] font-sans font-medium mt-3">
                {review.score >= 90 ? "Excellent Profile Structure" : review.score >= 75 ? "Competitive CV (Growth potential)" : "Needs Polish"}
              </span>
            </div>

            {/* Counselor Overview Narrative */}
            <div className="md:col-span-3 border border-slate-700 bg-slate-800/40 p-4 rounded-xl space-y-2 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Counselor Strategic Assessment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{review.summary}"
              </p>
            </div>
          </div>

          {/* Granular Section Sliders */}
          <div className="p-4 border border-slate-700 bg-slate-800/40 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display">Granular Metrics Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Structure & Formatting</span>
                  <span className="font-mono text-slate-100 font-bold">{review.sectionScores.formattingAndStructure}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full" style={{ width: `${review.sectionScores.formattingAndStructure}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-emerald-400" /> Accomplishment Impact (XYZ)</span>
                  <span className="font-mono text-slate-100 font-bold">{review.sectionScores.experienceImpact}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${review.sectionScores.experienceImpact}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> CS Technical Specificity</span>
                  <span className="font-mono text-slate-100 font-bold">{review.sectionScores.technicalDepth}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: `${review.sectionScores.technicalDepth}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyan-400" /> Architectures & Project Rigor</span>
                  <span className="font-mono text-slate-100 font-bold">{review.sectionScores.projectQuality}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${review.sectionScores.projectQuality}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Strengths and Growth Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths Card */}
            <div className="p-4 border border-emerald-500/20 bg-slate-800/20 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-display flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Strong Aspects
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 leading-normal">
                {review.strengths.map((str, idx) => (
                  <li key={idx} className="flex gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas Card */}
            <div className="p-4 border border-amber-500/20 bg-slate-800/20 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-display flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 animate-bounce" /> Areas of Optimization
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 leading-normal">
                {review.growthPoints.map((gp, idx) => (
                  <li key={idx} className="flex gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{gp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ATS Keyword Badging Analysis */}
          <div className="p-4 border border-slate-700 bg-slate-800/40 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display">ATS Keyword Matches</h3>
            
            <div className="space-y-3">
              <div>
                <span className="block text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-1.5">Detected Tech Terms on draft ({review.atsKeywordsAnalysis.matched.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {review.atsKeywordsAnalysis.matched.map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 rounded font-mono">
                      {kw}
                    </span>
                  ))}
                  {review.atsKeywordsAnalysis.matched.length === 0 && <span className="text-xs text-slate-500 font-mono">No strong skills categorized. Add programming languages to your resume.</span>}
                </div>
              </div>

              <div>
                <span className="block text-[10px] text-amber-400 uppercase tracking-wider font-semibold mb-1.5">Missing Recommended CS Terms ({review.atsKeywordsAnalysis.missingRecommended.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {review.atsKeywordsAnalysis.missingRecommended.map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-amber-950/50 border border-amber-800/50 text-amber-300 rounded font-mono">
                      + {kw}
                    </span>
                  ))}
                  {review.atsKeywordsAnalysis.missingRecommended.length === 0 && <span className="text-xs text-slate-500 font-mono">None! High keyword coverage.</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
