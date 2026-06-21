import { CVState } from "./types";

export const initialMockResume: CVState = {
  personalInfo: {
    name: "Alex Carter",
    email: "alex.carter@techuniversity.edu",
    phone: "+1 (555) 019-2834",
    github: "github.com/alexcarter-codes",
    linkedin: "linkedin.com/in/alex-carter-cs",
    website: "alexcarter.dev",
    location: "Austin, TX"
  },
  education: [
    {
      id: "edu-1",
      school: "Tech University of Texas",
      degree: "Bachelor of Science",
      major: "Computer Science",
      gpa: "3.84 / 4.00",
      startDate: "Aug 2023",
      endDate: "May 2027",
      coursework: "Data Structures & Algorithms, Systems Programming, Computer Networks, Database Management Systems",
      location: "Austin, TX"
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Vortex Software Systems",
      role: "Software Engineering Intern",
      location: "Dallas, TX",
      startDate: "May 2025",
      endDate: "Aug 2025",
      bullets: [
        "Designed and deployed a serverless Python pipeline on AWS Lambda and S3, reducing log ingestion processing latency by 45%.",
        "Refactored relational SQL queries by setting compound database indexes and Redis caching, slashing API response average from 210ms to 45ms.",
        "Collaborated with 4 senior developers to migrate legacy frontend containers to Next.js, boosting lighthouse web performance rating from 65 to 94."
      ],
      isCurrent: false
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Distributed Key-Value Engine",
      technologies: "Go, gRPC, Protobuf, Raft consensus, Docker",
      codeLink: "github.com/alexcarter-codes/dist-cache-go",
      bullets: [
        "Engineered a highly available key-value store in Go, utilizing the raft consensus protocol to maintain database consistency across 5 nodes.",
        "Implemented a concurrent, thread-safe LRU caching layer featuring memory-mapped shards, delivering sub-millisecond retrieval on hot data.",
        "Optimized inter-node cluster replication by substituting large JSON buffers with gRPC stream codecs, slashing network overhead by 60%."
      ]
    },
    {
      id: "proj-2",
      title: "Local Semantic Document Searcher",
      technologies: "FastAPI, PyTorch, Chromadb Vector DB, Docker",
      codeLink: "github.com/alexcarter-codes/semantic-docs",
      bullets: [
        "Devised a retrieval-augmented generation (RAG) agent utilizing sentence-transformer embeddings to run semantic search pipelines over 10,000 document sheets.",
        "Containerized FastAPI system nodes and deployed backend microservices inside AWS ECS instances, implementing standard health-check monitoring."
      ]
    }
  ],
  skills: {
    languages: "Go, Python, C++, Java, TypeScript, SQL, Bash",
    frameworks: "React, Next.js, Node.js, Express, PyTorch, FastAPI, Tailwind CSS",
    tools: "Git, Docker, Linux, AWS (S3, EC2), PostgreSQL, Redis, MongoDB, gRPC, Protobuf",
    databases: "PostgreSQL, MySQL, Redis, MongoDB"
  },
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "Dec 2024"
    }
  ]
};
