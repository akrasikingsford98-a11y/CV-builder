export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  website: string;
  location: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa: string;
  startDate: string;
  endDate: string;
  coursework: string;
  location: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  isCurrent: boolean;
}

export interface ProjectSection {
  id: string;
  title: string;
  technologies: string;
  liveLink?: string;
  codeLink?: string;
  bullets: string[];
}

export interface TechnicalSkills {
  languages: string;
  frameworks: string;
  tools: string;
  databases: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CVState {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: WorkExperience[];
  projects: ProjectSection[];
  skills: TechnicalSkills;
  certifications: Certification[];
}

// AI Counselor Types
export interface CareerCounselorReview {
  score: number; // 0 to 100 rating
  summary: string;
  strengths: string[];
  growthPoints: string[];
  atsKeywordsAnalysis: {
    matched: string[];
    missingRecommended: string[];
  };
  sectionScores: {
    formattingAndStructure: number;
    experienceImpact: number;
    technicalDepth: number;
    projectQuality: number;
  };
}

export interface BulletOption {
  improvedBullet: string;
  whyBetter: string;
  impactVerbUsed: string;
}

export interface CommonCSStarter {
  label: string;
  role: string;
  suggestedBullets: string[];
}
