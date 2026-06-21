import React, { useState } from "react";
import { CVState, ProjectSection } from "./types";
import { initialMockResume } from "./mockResume";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import CounselorReview from "./components/CounselorReview";
import JobTailor from "./components/JobTailor";
import ProjectStarters from "./components/ProjectStarters";

import { 
  Sparkles, Printer, RotateCcw, Copy, Check, 
  FileText, Brain, UserCheck, BookOpen 
} from "lucide-react";

export default function App() {
  const [cv, setCv] = useState<CVState>({ ...initialMockResume });
  const [activeTab, setActiveTab] = useState<"editor" | "counselor" | "tailor" | "starters">("editor");
  const [hasCopiedMarkdown, setHasCopiedMarkdown] = useState(false);

  // Helper to allow inserting generated projects directly from CS Blueprints
  const handleAddProjectFromStarter = (title: string, tech: string, bullets: string[]) => {
    const newProj: ProjectSection = {
      id: `proj-${Date.now()}`,
      title,
      technologies: tech,
      bullets,
      codeLink: "",
      liveLink: ""
    };
    setCv(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    // Switch to editor so they can see it inserted
    setActiveTab("editor");
  };

  // Convert CV data back to readable Markdown for external copy paste
  const copyCVAsMarkdown = () => {
    let md = `# ${cv.personalInfo.name}\n`;
    md += `${cv.personalInfo.email} | ${cv.personalInfo.phone} | ${cv.personalInfo.location}\n`;
    if (cv.personalInfo.github) md += `GitHub: ${cv.personalInfo.github} | `;
    if (cv.personalInfo.linkedin) md += `LinkedIn: ${cv.personalInfo.linkedin} | `;
    if (cv.personalInfo.website) md += `Website: ${cv.personalInfo.website}\n`;
    md += `\n---\n\n`;

    md += `## EDUCATION\n`;
    cv.education.forEach(edu => {
      md += `### ${edu.school} (${edu.location})\n`;
      md += `* ${edu.degree} in ${edu.major} | GPA: ${edu.gpa} (${edu.startDate} - ${edu.endDate})\n`;
      if (edu.coursework) md += `* **Relevant Coursework:** ${edu.coursework}\n`;
      md += `\n`;
    });

    md += `## TECHNICAL SKILLS\n`;
    if (cv.skills.languages) md += `* **Languages:** ${cv.skills.languages}\n`;
    if (cv.skills.frameworks) md += `* **Frameworks:** ${cv.skills.frameworks}\n`;
    if (cv.skills.tools) md += `* **Developer Tools:** ${cv.skills.tools}\n`;
    if (cv.skills.databases) md += `* **Databases:** ${cv.skills.databases}\n`;
    md += `\n`;

    md += `## WORK EXPERIENCE\n`;
    cv.experience.forEach(exp => {
      md += `### ${exp.company} (${exp.location})\n`;
      md += `* **${exp.role}** | ${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}\n`;
      exp.bullets.forEach(b => {
        if (b.trim()) md += `  * ${b}\n`;
      });
      md += `\n`;
    });

    md += `## PROJECTS\n`;
    cv.projects.forEach(proj => {
      md += `### ${proj.title} | *${proj.technologies}*\n`;
      if (proj.codeLink || proj.liveLink) {
        md += `* Links: ${proj.codeLink ? `[GitHub](${proj.codeLink}) ` : ""}${proj.liveLink ? `[Live](${proj.liveLink})` : ""}\n`;
      }
      proj.bullets.forEach(b => {
        if (b.trim()) md += `  * ${b}\n`;
      });
      md += `\n`;
    });

    if (cv.certifications.length > 0) {
      md += `## CERTIFICATIONS\n`;
      cv.certifications.forEach(cert => {
        md += `* **${cert.name}** – ${cert.issuer} (${cert.date})\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setHasCopiedMarkdown(true);
    setTimeout(() => setHasCopiedMarkdown(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToMock = () => {
    if (window.confirm("Are you sure you want to reset the resume draft to our high-caliber Computer Science mock profile? This will overwrite your current changes.")) {
      setCv({ ...initialMockResume });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* GLOBAL SITE NAVBAR (HIDDEN FOR PRINT) */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="p-1 px-2.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono rounded-full font-bold uppercase tracking-wide">
              CS & SWE Edition
            </span>
            <span className="text-gray-500 select-all font-mono text-[10px]">v1.4</span>
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight text-slate-100 flex items-center justify-center md:justify-start gap-1.5 leading-none">
            <Sparkles className="w-5 h-5 text-purple-400" />
            CS Resume Builder <span className="text-slate-400 font-normal">& AI Career Counselor</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            ATS-aligned engineering templates merged with former Big-Tech recruiters helping you write impact-driven STAR accomplishments.
          </p>
        </div>

        {/* Global actions buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToMock}
            className="p-2 border border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Reload Alex Carter factory draft profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample
          </button>
          
          <button
            onClick={copyCVAsMarkdown}
            className="p-2 border border-slate-800 hover:bg-slate-800/80 text-slate-450 hover:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            {hasCopiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hasCopiedMarkdown ? "Copied!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 font-semibold rounded-lg text-xs shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            Print to PDF / Save
          </button>
        </div>
      </header>

      {/* SPLIT SCREEN BODY */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT WORKSPACE PANELS (HIDDEN FOR PRINT) */}
        <section className="w-full lg:w-[45%] xl:w-[42%] flex flex-col border-r border-slate-900 bg-slate-900/30 overflow-hidden print:hidden">
          
          {/* TAB BAR NAVIGATION */}
          <nav className="flex border-b border-slate-800 bg-slate-950 p-1 gap-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex-1 py-3 text-center rounded-md font-semibold text-[11px] uppercase tracking-wider font-display flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === "editor" 
                  ? "bg-slate-800 text-slate-100 border-b-2 border-purple-500 shadow-inner" 
                  : "text-slate-455 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === "editor" ? "text-purple-400" : ""}`} />
              <span>Resume Editor</span>
            </button>

            <button
              onClick={() => setActiveTab("counselor")}
              className={`flex-1 py-3 text-center rounded-md font-semibold text-[11px] uppercase tracking-wider font-display flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === "counselor" 
                  ? "bg-slate-800 text-slate-100 border-b-2 border-purple-500 shadow-inner" 
                  : "text-slate-455 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Brain className={`w-4 h-4 ${activeTab === "counselor" ? "text-purple-400 text-pulse" : ""}`} />
              <span>AI Counselor Review</span>
            </button>

            <button
              onClick={() => setActiveTab("tailor")}
              className={`flex-1 py-3 text-center rounded-md font-semibold text-[11px] uppercase tracking-wider font-display flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === "tailor" 
                  ? "bg-slate-800 text-slate-100 border-b-2 border-purple-500 shadow-inner" 
                  : "text-slate-455 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === "tailor" ? "text-blue-450" : ""}`} />
              <span>Tailor to JD</span>
            </button>

            <button
              onClick={() => setActiveTab("starters")}
              className={`flex-1 py-3 text-center rounded-md font-semibold text-[11px] uppercase tracking-wider font-display flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === "starters" 
                  ? "bg-slate-800 text-slate-100 border-b-2 border-purple-500 shadow-inner" 
                  : "text-slate-455 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === "starters" ? "text-rose-450" : ""}`} />
              <span>CS Blueprints</span>
            </button>
          </nav>

          {/* TAB CONTENT PANEL DISPLAY */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "editor" && <ResumeForm cv={cv} onChange={setCv} />}
            {activeTab === "counselor" && <CounselorReview cv={cv} />}
            {activeTab === "tailor" && <JobTailor cv={cv} />}
            {activeTab === "starters" && <ProjectStarters onAddProject={handleAddProjectFromStarter} />}
          </div>

        </section>

        {/* RIGHT DISPLAY VIEWPORT (THE PAPER SHEET) */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <ResumePreview cv={cv} />
        </section>

      </main>

    </div>
  );
}
