/**
 * CareerPulse - AI Career & Internship Tracker
 * Mock Data & Statistical Calculation Utilities
 * 
 * Provides fallback initial seed data and dynamic metrics calculation.
 * All persistent data is synchronized through centralized localStorage state.
 */

// Helper to generate dynamic dates relative to current date (YYYY-MM-DD)
export function getRelativeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

/**
 * Standard Skill Dictionary
 * Used by the client-side Intelligent Job Fit Analyzer engine.
 */
export const PREDEFINED_SKILLS = [
  'Python',
  'Java',
  'JavaScript',
  'React',
  'HTML',
  'CSS',
  'SQL',
  'Excel',
  'Power BI',
  'Tableau',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Analysis',
  'Statistics',
  'Git',
  'GitHub',
  'Node.js',
  'FastAPI',
  'REST API',
  'Figma',
  'Cloud',
  'AWS',
  'Azure',
  'Communication',
  'Problem Solving',
  'Teamwork'
];

/**
 * Default beginner user skills saved in localStorage
 */
export const DEFAULT_USER_SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'Python',
  'SQL',
  'Excel',
  'Data Analysis'
];

/**
 * Initial sample applications
 * Loaded if no existing records are found in localStorage.
 * Allowed status values: "Applied", "Shortlisted", "Interview", "Selected", "Rejected".
 */
export const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    company: "Anthropic Research",
    role: "AI / ML Engineering Intern",
    applicationDate: getRelativeDate(-14),
    deadline: getRelativeDate(3), // Due soon
    applicationLink: "https://example.com/careers/anthropic-intern",
    jobUrl: "https://example.com/careers/anthropic-intern",
    requiredSkills: ["Python", "FastAPI", "Machine Learning", "Git", "REST API"],
    skills: ["Python", "FastAPI", "Machine Learning", "Git", "REST API"],
    status: "Interview",
    location: "San Francisco, CA (Hybrid)",
    type: "Internship",
    salary: "$55 / hr",
    matchScore: 92,
    notes: "Round 2 technical coding screen scheduled. Focus on algorithm questions & FastAPI REST design."
  },
  {
    id: "app-2",
    company: "Stripe",
    role: "Frontend Developer Intern",
    applicationDate: getRelativeDate(-8),
    deadline: getRelativeDate(14), // Upcoming
    applicationLink: "https://example.com/careers/stripe-frontend",
    jobUrl: "https://example.com/careers/stripe-frontend",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git", "Figma"],
    skills: ["React", "JavaScript", "HTML", "CSS", "Git", "Figma"],
    status: "Applied",
    location: "Remote - US",
    type: "Internship",
    salary: "$50 / hr",
    matchScore: 88,
    notes: "Submitted portfolio with interactive React components via alumni referral."
  },
  {
    id: "app-3",
    company: "Scale AI",
    role: "Junior Full Stack Engineer",
    applicationDate: getRelativeDate(-25),
    deadline: getRelativeDate(-2), // Overdue / Decision passed
    applicationLink: "https://example.com/careers/scale-fullstack",
    jobUrl: "https://example.com/careers/scale-fullstack",
    requiredSkills: ["React", "Node.js", "SQL", "REST API", "GitHub"],
    skills: ["React", "Node.js", "SQL", "REST API", "GitHub"],
    status: "Selected",
    location: "New York, NY",
    type: "Full-time",
    salary: "$115,000 / yr",
    matchScore: 95,
    notes: "Official offer received! Competitive compensation with signing bonus."
  },
  {
    id: "app-4",
    company: "Datadog",
    role: "Software Engineering Intern",
    applicationDate: getRelativeDate(-18),
    deadline: getRelativeDate(2), // Due soon
    applicationLink: "https://example.com/careers/datadog-swe",
    jobUrl: "https://example.com/careers/datadog-swe",
    requiredSkills: ["Python", "Cloud", "AWS", "Git", "Problem Solving"],
    skills: ["Python", "Cloud", "AWS", "Git", "Problem Solving"],
    status: "Interview",
    location: "Boston, MA",
    type: "Internship",
    salary: "$48 / hr",
    matchScore: 84,
    notes: "Completed online assessment test with 100% test cases passing. Next round: Systems discussion."
  },
  {
    id: "app-5",
    company: "Notion",
    role: "Product Engineering Intern",
    applicationDate: getRelativeDate(-10),
    deadline: getRelativeDate(9), // Upcoming
    applicationLink: "https://example.com/careers/notion-intern",
    jobUrl: "https://example.com/careers/notion-intern",
    requiredSkills: ["React", "JavaScript", "CSS", "Figma", "Communication"],
    skills: ["React", "JavaScript", "CSS", "Figma", "Communication"],
    status: "Shortlisted",
    location: "San Francisco, CA",
    type: "Internship",
    salary: "$52 / hr",
    matchScore: 90,
    notes: "Resume cleared initial recruiter screening. Recruiter requested availability for 30-min chat."
  },
  {
    id: "app-6",
    company: "DeepMind",
    role: "Data Science & AI Intern",
    applicationDate: getRelativeDate(-5),
    deadline: getRelativeDate(18), // Upcoming
    applicationLink: "https://example.com/careers/deepmind-intern",
    jobUrl: "https://example.com/careers/deepmind-intern",
    requiredSkills: ["Python", "Machine Learning", "Data Analysis", "Statistics", "SQL"],
    skills: ["Python", "Machine Learning", "Data Analysis", "Statistics", "SQL"],
    status: "Applied",
    location: "London, UK (Remote)",
    type: "Internship",
    salary: "£42,000 pro rata",
    matchScore: 86,
    notes: "Highlighted regression and neural network academic projects on GitHub in cover letter."
  },
  {
    id: "app-7",
    company: "Linear",
    role: "Frontend Software Engineer",
    applicationDate: getRelativeDate(-12),
    deadline: getRelativeDate(5), // Due soon
    applicationLink: "https://example.com/careers/linear-frontend",
    jobUrl: "https://example.com/careers/linear-frontend",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Teamwork"],
    skills: ["React", "JavaScript", "HTML", "CSS", "Teamwork"],
    status: "Shortlisted",
    location: "Remote - Global",
    type: "Full-time",
    salary: "$130,000 / yr",
    matchScore: 93,
    notes: "Screening passed. Received link to interactive take-home code assignment."
  },
  {
    id: "app-8",
    company: "Shopify",
    role: "Web Application Developer Intern",
    applicationDate: getRelativeDate(-30),
    deadline: getRelativeDate(-10), // Overdue
    applicationLink: "https://example.com/careers/shopify-web",
    jobUrl: "https://example.com/careers/shopify-web",
    requiredSkills: ["React", "JavaScript", "REST API", "Git"],
    skills: ["React", "JavaScript", "REST API", "Git"],
    status: "Rejected",
    location: "Remote - North America",
    type: "Internship",
    salary: "$42 / hr",
    matchScore: 70,
    notes: "Position filled early due to exceptional applicant volume. Friendly feedback to re-apply next cycle."
  }
];

/**
 * Calculates dynamic summary statistics and status breakdowns
 * from the single centralized applications list.
 * 
 * @param {Array} applications - List of all application objects
 * @returns {Object} Real-time metrics, status counts, and percentages
 */
export function calculateApplicationStats(applications = []) {
  const total = applications.length;

  const applied = applications.filter(
    (app) => (app.status || '').toLowerCase() === 'applied'
  ).length;

  const shortlisted = applications.filter(
    (app) => (app.status || '').toLowerCase() === 'shortlisted'
  ).length;

  const interviews = applications.filter(
    (app) => {
      const s = (app.status || '').toLowerCase();
      return s === 'interview' || s === 'interviewing' || s === 'interviews';
    }
  ).length;

  const selected = applications.filter(
    (app) => {
      const s = (app.status || '').toLowerCase();
      return s === 'selected' || s === 'offer';
    }
  ).length;

  const rejected = applications.filter(
    (app) => (app.status || '').toLowerCase() === 'rejected'
  ).length;

  const activeTotal = applied + shortlisted + interviews;

  // Rates as integer percentages
  const rates = {
    applied: total > 0 ? Math.round((applied / total) * 100) : 0,
    shortlisted: total > 0 ? Math.round((shortlisted / total) * 100) : 0,
    interviews: total > 0 ? Math.round((interviews / total) * 100) : 0,
    selected: total > 0 ? Math.round((selected / total) * 100) : 0,
    rejected: total > 0 ? Math.round((rejected / total) * 100) : 0,
  };

  // Structured breakdown array for chart rendering
  const statusDistribution = [
    { label: 'Applied', count: applied, percentage: rates.applied, color: '#38bdf8', bgClass: 'segment-applied' },
    { label: 'Shortlisted', count: shortlisted, percentage: rates.shortlisted, color: '#a855f7', bgClass: 'segment-shortlisted' },
    { label: 'Interview', count: interviews, percentage: rates.interviews, color: '#f59e0b', bgClass: 'segment-interviews' },
    { label: 'Selected', count: selected, percentage: rates.selected, color: '#10b981', bgClass: 'segment-selected' },
    { label: 'Rejected', count: rejected, percentage: rates.rejected, color: '#ef4444', bgClass: 'segment-rejected' },
  ];

  return {
    total,
    applied,
    shortlisted,
    interviews,
    selected,
    rejected,
    activeTotal,
    rates,
    statusDistribution
  };
}

/**
 * Pre-populated sample job descriptions for Job Fit Analyzer
 */
export const SAMPLE_JOB_POSTINGS = [
  {
    id: "sample-1",
    title: "AI & Full-Stack Engineering Intern",
    company: "Cohere AI",
    description: `We are looking for an ambitious AI Engineering Intern to join our developer platform team.
In this role, you will build responsive web applications using React, JavaScript, and HTML/CSS, and connect them with backend microservices using Python and FastAPI.
Required skills and experience:
- Strong foundations in Python and JavaScript/React.
- Familiarity with REST API integration and Git/GitHub version control.
- Knowledge of Machine Learning fundamentals and Artificial Intelligence APIs.
- Excellent Communication, Teamwork, and Problem Solving abilities.`
  },
  {
    id: "sample-2",
    title: "Junior Data Analyst",
    company: "FinTech Global",
    description: `We are hiring a Junior Data Analyst to help build internal analytics dashboards and customer insights.
Responsibilities:
- Write and optimize SQL queries to retrieve records from relational databases.
- Perform Data Analysis and Statistics to uncover behavioral trends.
- Build clean visual reporting dashboards using Excel, Power BI, or Tableau.
- Collaborate with engineering and product teams using Git, Python, and clear Communication skills.`
  },
  {
    id: "sample-3",
    title: "Frontend Developer (UI/UX Engineering)",
    company: "Vercel Ecosystem",
    description: `Join our design systems engineering team building high-performance web interfaces.
Requirements:
- Mastery of modern JavaScript, React, HTML, and CSS.
- Familiarity with Figma component workflows and responsive web design.
- Experience with Node.js and REST APIs.
- Passion for web accessibility, performance, and cross-functional Teamwork.`
  },
  {
    id: "sample-4",
    title: "Cloud & DevOps Engineering Intern",
    company: "CloudScale Systems",
    description: `Looking for an enthusiastic intern passionate about Cloud infrastructure and software automation.
Requirements:
- Basic experience with Cloud platforms such as AWS or Azure.
- Scripting knowledge in Python or Java.
- Familiarity with Git, GitHub workflows, and REST API testing.
- Strong Problem Solving and analytical skills.`
  }
];

/**
 * 5-Stage Career Roadmap Milestones
 */
export const DEFAULT_ROADMAP_STAGES = [
  {
    id: "stage-1",
    stageName: "Stage 1: Beginner Fundamentals",
    description: "Build strong core programming foundations and computational thinking.",
    milestones: [
      { id: "m-1-1", title: "HTML & Semantic Markup", desc: "Master semantic tags, forms, and accessibility best practices", completed: true },
      { id: "m-1-2", title: "CSS & Responsive Layouts", desc: "Flexbox, CSS Grid, media queries, and design tokens", completed: true },
      { id: "m-1-3", title: "JavaScript Core Syntax", desc: "Variables, functions, arrays, objects, and ES6+ methods", completed: true }
    ]
  },
  {
    id: "stage-2",
    stageName: "Stage 2: Technical Foundations",
    description: "Learn essential development tools, data modeling, and scripting.",
    milestones: [
      { id: "m-2-1", title: "Git & GitHub Version Control", desc: "Branching, pull requests, resolving conflicts, and commits", completed: true },
      { id: "m-2-2", title: "Python Programming Basics", desc: "Functions, data structures, scripting, and basic automation", completed: true },
      { id: "m-2-3", title: "SQL & Relational Databases", desc: "SELECT queries, JOINs, aggregations, and database schemas", completed: false }
    ]
  },
  {
    id: "stage-3",
    stageName: "Stage 3: Practical Frameworks",
    description: "Develop hands-on competence with modern industry frameworks.",
    milestones: [
      { id: "m-3-1", title: "React Component Architecture", desc: "State management, Hooks, components, and props", completed: true },
      { id: "m-3-2", title: "REST APIs & Asynchronous JS", desc: "Fetch, async/await, API error handling, and JSON parsing", completed: false },
      { id: "m-3-3", title: "FastAPI / Node.js Backends", desc: "Simple CRUD server endpoints and routing", completed: false }
    ]
  },
  {
    id: "stage-4",
    stageName: "Stage 4: Portfolio Projects",
    description: "Build, polish, and deploy full applications to showcase to recruiters.",
    milestones: [
      { id: "m-4-1", title: "Career Tracker Application", desc: "Interactive portfolio application with state & client-side filtering", completed: true },
      { id: "m-4-2", title: "Data / AI Showcase Project", desc: "Implement intelligent feature or dataset analysis", completed: false },
      { id: "m-4-3", title: "Live Cloud Deployment", desc: "Deploy frontend and shareable demo link on GitHub Pages / Vercel", completed: false }
    ]
  },
  {
    id: "stage-5",
    stageName: "Stage 5: Internship Ready",
    description: "Prepare for candidate evaluations, interviews, and applications.",
    milestones: [
      { id: "m-5-1", title: "Technical Resume Tailoring", desc: "Highlight verifiable skills and live project links", completed: false },
      { id: "m-5-2", title: "Behavioral & Technical Mock Prep", desc: "STAR method answers and core coding problem solving", completed: false },
      { id: "m-5-3", title: "Active Applications Pipeline", desc: "Submit and track at least 10 targeted internship opportunities", completed: true }
    ]
  }
];
