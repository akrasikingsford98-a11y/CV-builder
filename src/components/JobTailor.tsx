import React, { useState } from "react";
import { CVState } from "../types";
import { 
  Sparkles, Loader2, ArrowRight, UserCheck, 
  Layers, Hammer, Terminal, ListCollapse
} from "lucide-react";

interface JobTailorProps {
  cv: CVState;
}

interface SuggestedAdjustment {
  section: string;
  changeCategory: string;
  originalReference: string;
  suggestedContent: string;
  explanation: string;
}

interface TailorResponse {
  strategicPitch: string;
  prioritizedKeywords: string[];
  suggestedAdjustments: SuggestedAdjustment[];
}

export default function JobTailor({ cv }: JobTailorProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerTailor = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a target Job Description first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/counselor/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobDescription })
      });

      if (!response.ok) {
        throw new Error("Failed to consult the AI tailor service. Please check network and env keys.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during tailoring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[85vh] font-sans">
      
      {/* Intro instruction */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 via-slate-900 to-slate-900 shadow space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded fw-bold uppercase">Resume Adaptation</div>
          <h2 className="text-sm font-semibold font-display text-slate-100 flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-blue-400" />
            Target Job Description Tailoring
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Pasting the specific job posting or internship description of your dream company. The AI Counselor will find exactly where your resume has narrative gaps and rewrite specific segments of your projects or internship lines to match recruiter keyword parameters perfectly.
        </p>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Paste Job Description / Requirements Here:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="e.g. 'We are looking for a Software Engineering Intern with experience in React, Python, and AWS Lambda. Knowledge of Kubernetes or Raft replication consensus is a strong plus...'"
            rows={5}
            className="w-full p-3 font-sans rounded bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {!loading && (
          <button
            onClick={triggerTailor}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-slate-100 font-semibold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            Adapt CV to Job Description
          </button>
        )}
      </div>

      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <div className="text-center space-y-1">
            <h4 className="text-xs font-semibold text-slate-200">Processing Narrative Fit...</h4>
            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Extracting technical requirements, comparing framework matrices, and aligning resume projects with employer keywords.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-800 text-rose-300 text-xs rounded">
          {error}
        </div>
      )}

      {/* RENDER TAILOR REPORT */}
      {result && !loading && !error && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Strategic Pitch Box */}
          <div className="p-4 border border-blue-500/20 bg-blue-950/10 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-display flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> Recruiter Strategic Positioning
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "{result.strategicPitch}"
            </p>
          </div>

          {/* High Priority Keywords Section */}
          <div className="p-4 border border-slate-700 bg-slate-800/40 rounded-xl space-y-2.5">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display flex items-center gap-1">
              <Terminal className="w-4 h-4 text-cyan-400" /> Must-Emphasize Tech Requirements
            </h3>
            <p className="text-[11px] text-slate-400">These are the critical skills explicitly called out in the job description that you should highlight prominently in your skills section or experience lines:</p>
            <div className="flex flex-wrap gap-1.5">
              {result.prioritizedKeywords.map((kw, idx) => (
                <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-950/80 border border-slate-700 text-cyan-300 rounded font-mono">
                  {kw}
                </span>
              ))}
              {result.prioritizedKeywords.length === 0 && <span className="text-xs text-slate-500">None detected. Your resume matches the job profile.</span>}
            </div>
          </div>

          {/* Suggested Adjustments Lists */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-display flex items-center gap-1.5">
              <ListCollapse className="w-4 h-4 text-purple-400" />
              Recruiter-Aligned Resume Tweaks
            </h3>
            
            <div className="space-y-3">
              {result.suggestedAdjustments.map((adj, idx) => (
                <div key={idx} className="p-4 border border-slate-700 bg-slate-800/20 rounded-xl space-y-3 hover:border-slate-600 transition-colors">
                  
                  {/* Adjustment Header Details */}
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Targeting Segment:</span>
                      <span className="text-xs text-slate-100 font-semibold font-display">{adj.section}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-1.5 py-0.5 text-[9px] bg-indigo-950 font-bold border border-indigo-800 text-indigo-300 rounded font-sans">
                        {adj.changeCategory}
                      </span>
                    </div>
                  </div>

                  {/* Original comparison */}
                  <div className="text-[11px] text-slate-400 leading-normal pl-3 border-l-2 border-slate-700">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Current Draft Reference:</span>
                    <span>"{adj.originalReference}"</span>
                  </div>

                  {/* Suggested revision */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-serif text-slate-100 leading-relaxed shadow-inner">
                    <span className="font-sans font-semibold block text-[10px] uppercase tracking-wider text-emerald-400 font-mono mb-1">Tailored AI Copy/Paste Recommendation:</span>
                    <span>{adj.suggestedContent}</span>
                  </div>

                  {/* Recruiter Rationale */}
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-400 text-[10px] font-sans uppercase tracking-wider block mb-0.5">Recruiter Rationale:</span>
                    {adj.explanation}
                  </p>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
