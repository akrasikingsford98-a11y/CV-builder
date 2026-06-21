import { CVState } from "../types";
import { Mail, Phone, Github, Linkedin, Globe, MapPin } from "lucide-react";

interface ResumePreviewProps {
  cv: CVState;
}

export default function ResumePreview({ cv }: ResumePreviewProps) {
  const { personalInfo, education, experience, projects, skills, certifications } = cv;

  return (
    <div className="w-full flex justify-center py-4 bg-slate-900 border-l border-slate-800 min-h-screen overflow-y-auto">
      {/* A4 Proportionate Virtual Paper */}
      <div
        id="resume-print-area"
        className="w-full max-w-[800px] min-h-[1050px] bg-white text-black p-[40px] shadow-2xl rounded-sm font-serif leading-tight text-[12px]"
        style={{ fontFamily: "'Inter', 'Georgia', serif" }}
      >
        {/* Name and Header Details */}
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            {personalInfo.name || "YOUR NAME"}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-gray-700 font-sans">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-500 print:hidden" />
                {personalInfo.phone}
              </span>
            )}
            
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-500 print:hidden" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </span>
            )}

            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-500 print:hidden" />
                {personalInfo.location}
              </span>
            )}

            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-gray-500 print:hidden" />
                <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>
              </span>
            )}

            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-gray-500 print:hidden" />
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.github}</a>
              </span>
            )}

            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-gray-500 print:hidden" />
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
              </span>
            )}
          </div>
        </header>

        {/* EDUCATION SECTION */}
        {education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold tracking-wider text-slate-800 border-b border-gray-300 pb-0.5 mb-2 uppercase font-sans">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.school || "University"}</span>
                  <span className="font-normal text-gray-700 text-[11px] font-sans">{edu.location || "Location"}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-800 italic">
                  <span>
                    {edu.degree || "Degree"} in {edu.major || "Major"}
                    {edu.gpa && <span className="not-italic text-gray-700 font-sans"> (GPA: {edu.gpa})</span>}
                  </span>
                  <span className="font-sans text-gray-700 not-italic text-[11px]">{edu.startDate || "Start"} – {edu.endDate || "Present"}</span>
                </div>
                {edu.coursework && (
                  <div className="text-[10px] text-gray-700 mt-0.5 leading-tight font-sans">
                    <span className="font-semibold text-slate-800">Relevant Coursework:</span> {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SKILLS SECTION */}
        <section className="mb-4">
          <h2 className="text-[12px] font-bold tracking-wider text-slate-800 border-b border-gray-300 pb-0.5 mb-2 uppercase font-sans">
            Technical Skills
          </h2>
          <div className="grid gap-y-1 text-[11px] text-gray-800 font-sans">
            {skills.languages && (
              <div>
                <span className="font-bold text-slate-900">Languages:</span> {skills.languages}
              </div>
            )}
            {skills.frameworks && (
              <div>
                <span className="font-bold text-slate-900">Frameworks:</span> {skills.frameworks}
              </div>
            )}
            {skills.tools && (
              <div>
                <span className="font-bold text-slate-900">Developer Tools:</span> {skills.tools}
              </div>
            )}
            {skills.databases && (
              <div>
                <span className="font-bold text-slate-900">Databases:</span> {skills.databases}
              </div>
            )}
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold tracking-wider text-slate-800 border-b border-gray-300 pb-0.5 mb-2 uppercase font-sans">
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.company || "Company"}</span>
                  <span className="font-normal text-gray-700 text-[11px] font-sans">{exp.location || "Location"}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-800 italic mb-1">
                  <span>{exp.role || "Role"}</span>
                  <span className="font-sans text-gray-700 not-italic text-[11px]">
                    {exp.startDate || "Start"} – {exp.isCurrent ? "Present" : (exp.endDate || "End")}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-700 text-[11px] tracking-normal leading-snug">
                  {exp.bullets.map((bullet, idx) => (
                    bullet.trim() ? (
                      <li key={idx}>
                        {bullet}
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[12px] font-bold tracking-wider text-slate-800 border-b border-gray-300 pb-0.5 mb-2 uppercase font-sans">
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {proj.title || "Project Title"}
                    {proj.technologies && (
                      <span className="font-normal text-gray-700 text-[11px] font-sans"> | </span>
                    )}
                    {proj.technologies && (
                      <span className="font-sans font-normal text-[11px] text-slate-800 italic">
                        {proj.technologies}
                      </span>
                    )}
                  </span>
                  <span className="font-sans font-normal text-gray-500 text-[11px] flex gap-2">
                    {proj.codeLink && (
                      <a href={`https://${proj.codeLink}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-semibold">{proj.codeLink}</a>
                    )}
                    {proj.liveLink && (
                      <a href={`https://${proj.liveLink}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-600 font-semibold">{proj.liveLink}</a>
                    )}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-700 text-[11px] tracking-normal leading-snug mt-1">
                  {proj.bullets.map((bullet, idx) => (
                    bullet.trim() ? (
                      <li key={idx}>
                        {bullet}
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="mb-1">
            <h2 className="text-[12px] font-bold tracking-wider text-slate-800 border-b border-gray-300 pb-0.5 mb-2 uppercase font-sans">
              Certifications & Accomplishments
            </h2>
            <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-700 text-[11px] font-sans">
              {certifications.map((cert) => (
                <li key={cert.id}>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  {cert.issuer && ` – ${cert.issuer}`}
                  {cert.date && <span className="text-gray-500"> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
