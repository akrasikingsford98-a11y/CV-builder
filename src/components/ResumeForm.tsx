import React, { useState } from "react";
import { CVState, WorkExperience, ProjectSection, Education, Certification } from "../types";
import { 
  User, School, Cpu, Briefcase, Code, Award, 
  Plus, Trash2, ChevronDown, ChevronUp, Sparkles, 
  Check, ArrowRight, Loader2, RefreshCw
} from "lucide-react";

interface ResumeFormProps {
  cv: CVState;
  onChange: (cv: CVState) => void;
}

export default function ResumeForm({ cv, onChange }: ResumeFormProps) {
  const [openSection, setOpenSection] = useState<string>("personal");
  
  // States for bullet-point AI optimization
  const [activeOptimizer, setActiveOptimizer] = useState<{
    sectionType: "experience" | "projects";
    itemId: string;
    bulletIndex: number;
    originalText: string;
  } | null>(null);

  const [optimizerSuggestions, setOptimizerSuggestions] = useState<Array<{
    improvedBullet: string;
    whyBetter: string;
    impactVerbUsed: string;
  }>>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizerError, setOptimizerError] = useState("");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // State handlers
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value
      }
    });
  };

  const updateSkills = (field: string, value: string) => {
    onChange({
      ...cv,
      skills: {
        ...cv.skills,
        [field]: value
      }
    });
  };

  // Education Helpers
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const nextEdu = [...cv.education];
    nextEdu[index] = { ...nextEdu[index], [field]: value };
    onChange({ ...cv, education: nextEdu });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: "",
      degree: "",
      major: "",
      gpa: "",
      startDate: "",
      endDate: "",
      coursework: "",
      location: ""
    };
    onChange({ ...cv, education: [...cv.education, newEdu] });
    setOpenSection("education");
  };

  const removeEducation = (id: string) => {
    onChange({ ...cv, education: cv.education.filter(e => e.id !== id) });
  };

  // Experience Helpers
  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: any) => {
    const nextExp = [...cv.experience];
    nextExp[index] = { ...nextExp[index], [field]: value };
    onChange({ ...cv, experience: nextExp });
  };

  const handleExperienceBulletChange = (expIndex: number, bulletIdx: number, value: string) => {
    const nextExp = [...cv.experience];
    const nextBullets = [...nextExp[expIndex].bullets];
    nextBullets[bulletIdx] = value;
    nextExp[expIndex].bullets = nextBullets;
    onChange({ ...cv, experience: nextExp });
  };

  const addExperienceBullet = (expIndex: number) => {
    const nextExp = [...cv.experience];
    nextExp[expIndex].bullets = [...nextExp[expIndex].bullets, ""];
    onChange({ ...cv, experience: nextExp });
  };

  const removeExperienceBullet = (expIndex: number, bulletIdx: number) => {
    const nextExp = [...cv.experience];
    nextExp[expIndex].bullets = nextExp[expIndex].bullets.filter((_, i) => i !== bulletIdx);
    onChange({ ...cv, experience: nextExp });
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: ["", ""],
      isCurrent: false
    };
    onChange({ ...cv, experience: [...cv.experience, newExp] });
    setOpenSection("experience");
  };

  const removeExperience = (id: string) => {
    onChange({ ...cv, experience: cv.experience.filter(e => e.id !== id) });
  };

  // Project Helpers
  const handleProjectChange = (index: number, field: keyof ProjectSection, value: string) => {
    const nextProj = [...cv.projects];
    nextProj[index] = { ...nextProj[index], [field]: value };
    onChange({ ...cv, projects: nextProj });
  };

  const handleProjectBulletChange = (projIndex: number, bulletIdx: number, value: string) => {
    const nextProj = [...cv.projects];
    const nextBullets = [...nextProj[projIndex].bullets];
    nextBullets[bulletIdx] = value;
    nextProj[projIndex].bullets = nextBullets;
    onChange({ ...cv, projects: nextProj });
  };

  const addProjectBullet = (projIndex: number) => {
    const nextProj = [...cv.projects];
    nextProj[projIndex].bullets = [...nextProj[projIndex].bullets, ""];
    onChange({ ...cv, projects: nextProj });
  };

  const removeProjectBullet = (projIndex: number, bulletIdx: number) => {
    const nextProj = [...cv.projects];
    nextProj[projIndex].bullets = nextProj[projIndex].bullets.filter((_, i) => i !== bulletIdx);
    onChange({ ...cv, projects: nextProj });
  };

  const addProject = () => {
    const newProj: ProjectSection = {
      id: `proj-${Date.now()}`,
      title: "",
      technologies: "",
      bullets: ["", ""],
      codeLink: "",
      liveLink: ""
    };
    onChange({ ...cv, projects: [...cv.projects, newProj] });
    setOpenSection("projects");
  };

  const removeProject = (id: string) => {
    onChange({ ...cv, projects: cv.projects.filter(p => p.id !== id) });
  };

  // Certification Helpers
  const handleCertChange = (index: number, field: keyof Certification, value: string) => {
    const nextCerts = [...cv.certifications];
    nextCerts[index] = { ...nextCerts[index], [field]: value };
    onChange({ ...cv, certifications: nextCerts });
  };

  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: ""
    };
    onChange({ ...cv, certifications: [...cv.certifications, newCert] });
    setOpenSection("certifications");
  };

  const removeCert = (id: string) => {
    onChange({ ...cv, certifications: cv.certifications.filter(c => c.id !== id) });
  };

  // Trigger Single Bullet Optimization
  const triggerOptimizeBullet = async (
    sectionType: "experience" | "projects",
    itemId: string,
    bulletIndex: number,
    text: string,
    contextInfo: string
  ) => {
    if (!text.trim()) {
      setOptimizerError("Please write a draft bullet point first before optimizing.");
      return;
    }

    setActiveOptimizer({ sectionType, itemId, bulletIndex, originalText: text });
    setIsOptimizing(true);
    setOptimizerError("");
    setOptimizerSuggestions([]);

    try {
      const response = await fetch("/api/counselor/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: text, context: contextInfo })
      });

      if (!response.ok) {
        throw new Error("Failed to consult the AI Career Counselor. Please check your network or credentials.");
      }

      const data = await response.json();
      if (data.suggestions) {
        setOptimizerSuggestions(data.suggestions);
      } else {
        throw new Error("No suggestions returned.");
      }
    } catch (err: any) {
      setOptimizerError(err.message || "An error occurred.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyBulletOptimization = (selectedBullet: string) => {
    if (!activeOptimizer) return;
    
    const { sectionType, itemId, bulletIndex } = activeOptimizer;
    
    if (sectionType === "experience") {
      const nextExp = [...cv.experience];
      const matchIdx = nextExp.findIndex(e => e.id === itemId);
      if (matchIdx !== -1) {
        const nextBullets = [...nextExp[matchIdx].bullets];
        nextBullets[bulletIndex] = selectedBullet;
        nextExp[matchIdx].bullets = nextBullets;
        onChange({ ...cv, experience: nextExp });
      }
    } else {
      const nextProj = [...cv.projects];
      const matchIdx = nextProj.findIndex(p => p.id === itemId);
      if (matchIdx !== -1) {
        const nextBullets = [...nextProj[matchIdx].bullets];
        nextBullets[bulletIndex] = selectedBullet;
        nextProj[matchIdx].bullets = nextBullets;
        onChange({ ...cv, projects: nextProj });
      }
    }

    setActiveOptimizer(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[85vh]">
      {/* 1. PERSONAL INFORMATION ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("personal")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <User className="w-4 h-4 text-purple-400" />
            <span>Personal Information</span>
          </div>
          {openSection === "personal" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "personal" && (
          <div className="p-4 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/30">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={cv.personalInfo.name}
                onChange={(e) => updatePersonalInfo("name", e.target.value)}
                placeholder="Alex Carter"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Email address</label>
              <input
                type="email"
                value={cv.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="email@domain.edu"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={cv.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="+1 (555) 555-5555"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={cv.personalInfo.location || ""}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="City, ST"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">GitHub (profile URL or path)</label>
              <input
                type="text"
                value={cv.personalInfo.github}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
                placeholder="github.com/profile"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">LinkedIn (profile URL or path)</label>
              <input
                type="text"
                value={cv.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                placeholder="linkedin.com/in/profile"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Personal Portfolio / Website Link</label>
              <input
                type="text"
                value={cv.personalInfo.website}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
                placeholder="website.dev"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. EDUCATION ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <School className="w-4 h-4 text-emerald-400" />
            <span>Education</span>
          </div>
          {openSection === "education" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "education" && (
          <div className="p-4 border-t border-slate-700 space-y-4 bg-slate-900/30">
            {cv.education.map((edu, idx) => (
              <div key={edu.id} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded relative space-y-3">
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove Education Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">School / University</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleEducationChange(idx, "location", e.target.value)}
                      placeholder="e.g. Palo Alto, CA"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Degree Type</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                      placeholder="e.g. Bachelor of Science (B.S.)"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Major / Discipline</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => handleEducationChange(idx, "major", e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">GPA / Scale</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)}
                      placeholder="e.g. 3.90 / 4.00"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(idx, "startDate", e.target.value)}
                        placeholder="Aug 2023"
                        className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(idx, "endDate", e.target.value)}
                        placeholder="May 2027"
                        className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Relevant Coursework (comma separated)</label>
                    <textarea
                      value={edu.coursework}
                      onChange={(e) => handleEducationChange(idx, "coursework", e.target.value)}
                      placeholder="Data Structures, Algorithms, Compilers, Distributed Systems..."
                      rows={2}
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2 flex items-center justify-center gap-1 border border-dashed border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 font-medium text-xs rounded transition-all"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* 3. TECHNICAL SKILLS ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Technical Skills</span>
          </div>
          {openSection === "skills" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "skills" && (
          <div className="p-4 border-t border-slate-700 gap-3 grid grid-cols-1 bg-slate-900/30">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">Programming Languages</label>
              <input
                type="text"
                value={cv.skills.languages}
                onChange={(e) => updateSkills("languages", e.target.value)}
                placeholder="Python, Rust, C++, Java, JavaScript, SQL"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">Developer Frameworks</label>
              <input
                type="text"
                value={cv.skills.frameworks}
                onChange={(e) => updateSkills("frameworks", e.target.value)}
                placeholder="React, Next.js, FastAPI, Node.js, PyTorch"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">Tools & Platforms</label>
              <input
                type="text"
                value={cv.skills.tools}
                onChange={(e) => updateSkills("tools", e.target.value)}
                placeholder="Git, Docker, Kubernetes, Linux, AWS, Gitlab CI/CD"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">Databases / Key-Value Stores</label>
              <input
                type="text"
                value={cv.skills.databases}
                onChange={(e) => updateSkills("databases", e.target.value)}
                placeholder="PostgreSQL, Redis, MongoDB, DynamoDB"
                className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. WORK EXPERIENCE ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Work Experience</span>
          </div>
          {openSection === "experience" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "experience" && (
          <div className="p-4 border-t border-slate-700 space-y-4 bg-slate-900/30 font-sans">
            {cv.experience.map((exp, expIdx) => (
              <div key={exp.id} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded relative space-y-3">
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(expIdx, "company", e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Role / Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(expIdx, "role", e.target.value)}
                      placeholder="e.g. Software Engineer Intern"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(expIdx, "location", e.target.value)}
                      placeholder="e.g. Mountain View, CA or Remote"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(expIdx, "startDate", e.target.value)}
                        placeholder="May 2025"
                        className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        disabled={exp.isCurrent}
                        value={exp.isCurrent ? "Present" : exp.endDate}
                        onChange={(e) => handleExperienceChange(expIdx, "endDate", e.target.value)}
                        placeholder="Aug 2025"
                        className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.isCurrent}
                      onChange={(e) => handleExperienceChange(expIdx, "isCurrent", e.target.checked)}
                      className="w-4 h-4 text-blue-500 rounded bg-slate-700 border-slate-600 focus:ring-0"
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-300 pointer-events-none selective">I currently work here</label>
                  </div>

                  {/* Bullet accomplishments */}
                  <div className="md:col-span-2 pt-2 border-t border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-blue-300 font-semibold select-all">Engineering Contributions & Accomplishments (Bullets)</span>
                      <button
                        type="button"
                        onClick={() => addExperienceBullet(expIdx)}
                        className="text-[10px] py-1 px-2 border border-slate-700 hover:bg-slate-700 text-blue-400 rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    <div className="space-y-3">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-slate-500 mt-2 font-mono">#{bulletIdx + 1}</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => handleExperienceBulletChange(expIdx, bulletIdx, e.target.value)}
                              placeholder="Wrote code to query databases..."
                              className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                              rows={2}
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                                className="p-1 border border-slate-700 hover:bg-rose-900/30 text-rose-400 rounded"
                                title="Delete Bullet"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => triggerOptimizeBullet("experience", exp.id, bulletIdx, bullet, `Intern at ${exp.company} as ${exp.role}`)}
                                className="p-1 border border-slate-700 hover:bg-purple-900/30 text-purple-400 rounded"
                                title="Optimize bullet with AI counselor (STAR formula)"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-2 flex items-center justify-center gap-1 border border-dashed border-blue-500/50 hover:bg-blue-500/10 text-blue-400 font-medium text-xs rounded transition-all"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* 5. SOFTWARE PROJECTS ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <Code className="w-4 h-4 text-purple-400" />
            <span>Software & Engineering Projects</span>
          </div>
          {openSection === "projects" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "projects" && (
          <div className="p-4 border-t border-slate-700 space-y-4 bg-slate-900/30 font-sans">
            {cv.projects.map((proj, projIdx) => (
              <div key={proj.id} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded relative space-y-3">
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(projIdx, "title", e.target.value)}
                      placeholder="e.g. Distributed Key-Value Engine"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Technologies Used (e.g. Go, docker)</label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => handleProjectChange(projIdx, "technologies", e.target.value)}
                      placeholder="e.g. React, Docker, Redis"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">GitHub / Code Link (path)</label>
                    <input
                      type="text"
                      value={proj.codeLink || ""}
                      onChange={(e) => handleProjectChange(projIdx, "codeLink", e.target.value)}
                      placeholder="github.com/myaccount/project"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Live Demo / Website Link (path)</label>
                    <input
                      type="text"
                      value={proj.liveLink || ""}
                      onChange={(e) => handleProjectChange(projIdx, "liveLink", e.target.value)}
                      placeholder="project-live.com"
                      className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>

                  {/* Bullets */}
                  <div className="md:col-span-2 pt-2 border-t border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold select-all">Project Bullets (Architecture, Concurrency & Metrics)</span>
                      <button
                        type="button"
                        onClick={() => addProjectBullet(projIdx)}
                        className="text-[10px] py-1 px-2 border border-slate-700 hover:bg-slate-700 text-purple-400 rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    <div className="space-y-3">
                      {proj.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-slate-500 mt-2 font-mono">#{bulletIdx + 1}</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => handleProjectBulletChange(projIdx, bulletIdx, e.target.value)}
                              placeholder="Describe structural accomplishments..."
                              className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                              rows={2}
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => removeProjectBullet(projIdx, bulletIdx)}
                                className="p-1 border border-slate-700 hover:bg-rose-900/30 text-rose-400 rounded"
                                title="Delete Bullet"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => triggerOptimizeBullet("projects", proj.id, bulletIdx, bullet, `CS Project: ${proj.title} using ${proj.technologies}`)}
                                className="p-1 border border-slate-700 hover:bg-purple-900/30 text-purple-400 rounded"
                                title="Optimize bullet with AI counselor (STAR formula)"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full py-2 flex items-center justify-center gap-1 border border-dashed border-purple-500/50 hover:bg-purple-500/10 text-purple-400 font-medium text-xs rounded transition-all"
            >
              <Plus className="w-4 h-4" /> Add Software Project
            </button>
          </div>
        )}
      </div>

      {/* 6. CERTIFICATIONS ACCORDION */}
      <div className="border border-slate-700 rounded-lg bg-slate-800/60 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("certifications")}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-100 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-display text-sm tracking-wide">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Certifications & Leadership</span>
          </div>
          {openSection === "certifications" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === "certifications" && (
          <div className="p-4 border-t border-slate-700 space-y-4 bg-slate-900/30 font-sans">
            {cv.certifications.map((cert, index) => (
              <div key={cert.id} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded relative grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => removeCert(cert.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Credential / Award Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleCertChange(index, "name", e.target.value)}
                    placeholder="e.g. AWS Solutions Architect Associate"
                    className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Issuer / Company</label>
                  <input
                    type="text"
                    value={cert.issuer || ""}
                    onChange={(e) => handleCertChange(index, "issuer", e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={cert.date || ""}
                    onChange={(e) => handleCertChange(index, "date", e.target.value)}
                    placeholder="e.g. Dec 2024"
                    className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addCert}
              className="w-full py-2 flex items-center justify-center gap-1 border border-dashed border-amber-500/50 hover:bg-amber-500/10 text-amber-400 font-medium text-xs rounded transition-all"
            >
              <Plus className="w-4 h-4" /> Add Certification / Award
            </button>
          </div>
        )}
      </div>

      {/* FLOATING ACTIVE BULLET OPTIMIZER BOX */}
      {activeOptimizer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold font-display text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  AI Counselor XYZ Bullet Optimizer
                </h3>
                <p className="text-[11px] text-slate-400">Transforming shallow descriptions into Google-style STAR bullet points</p>
              </div>
              <button
                onClick={() => setActiveOptimizer(null)}
                className="text-slate-400 hover:text-slate-100 text-xs border border-slate-700 px-2 py-0.5 rounded transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded">
              <label className="block text-[9px] uppercase font-semibold text-slate-500 tracking-wider mb-1">Your Draft Bullet</label>
              <p className="text-xs text-slate-200 italic">"{activeOptimizer.originalText}"</p>
            </div>

            {isOptimizing && (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400 text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <p className="animate-pulse">Counselor is reviewing phrasing, calculating metrics, and matching algorithms...</p>
              </div>
            )}

            {optimizerError && (
              <div className="p-3 bg-rose-950/30 border border-rose-800 text-rose-300 text-xs rounded">
                {optimizerError}
                <button 
                  onClick={() => triggerOptimizeBullet(activeOptimizer.sectionType, activeOptimizer.itemId, activeOptimizer.bulletIndex, activeOptimizer.originalText, "")} 
                  className="mt-2 text-[10px] font-semibold text-rose-200 flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Consulting Counselor
                </button>
              </div>
            )}

            {!isOptimizing && !optimizerError && optimizerSuggestions.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Select customized suggestion to apply:</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {optimizerSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx}
                      onClick={() => applyBulletOptimization(suggestion.improvedBullet)}
                      className="group p-3 border border-slate-800 hover:border-purple-500 hover:bg-purple-950/10 rounded-lg cursor-pointer transition-all space-y-2 relative"
                    >
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded-full font-bold select-none">
                          XYZ-Style #{idx + 1}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          Verb: {suggestion.impactVerbUsed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-100 group-hover:text-purple-200 font-serif leading-relaxed">
                        {suggestion.improvedBullet}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        <span className="font-semibold text-slate-300">Why it works:</span> {suggestion.whyBetter}
                      </p>
                      
                      <div className="absolute right-2 bottom-2 text-[10px] text-purple-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Click to Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
