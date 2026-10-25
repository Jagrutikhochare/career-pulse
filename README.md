# AI Career & Internship Tracker

A modern, responsive, and beginner-friendly portfolio project built with **React** and **Vite** designed to help students, new graduates, and software engineers track job applications, simulate AI job fit matching, and organize career learning roadmaps.

---

## 🚀 Features (Step 1 Foundation)

1. **Dashboard (`/`)**
   - High-level pipeline metrics (Total Applications, Active Interviews, Offers, AI Match Average).
   - Recent applications list with quick status tags.
   - AI Match Spotlight preview card.
   - Upcoming interview milestones and activity timeline.

2. **Applications (`/applications`)**
   - Interactive job and internship pipeline tracker.
   - Reactive search bar (searches by role, company, location, or skill).
   - Filter pills for status (`Applied`, `Interviewing`, `Offer`, `Rejected`).
   - Filter dropdown by job type (`Internship`, `Full-time`).
   - Detailed cards with location, salary, date applied, skill tags, and recruiter notes.

3. **Add Application (`/add-application`)**
   - Controlled React form for recording new opportunities.
   - Interactive live preview card on the side updating in real-time as you type.
   - Validation and mock local state storage with success feedback banner.

4. **AI Job Match (`/job-match`)**
   - Candidate skill profile snapshot.
   - Simulated job fit percentage matching (e.g. 94%, 89%, 82%).
   - Deep dive analysis with matched skills (green) and skill gap breakdown (amber).
   - Actionable AI application tailoring recommendations.
   - Interactive "Re-run Fit Analysis" button simulation.

5. **Learning Plan (`/learning-plan`)**
   - Career target summary and overall readiness percentage tracker.
   - Targeted skill proficiencies with progress bars (Frontend, AI, Backend, Cloud).
   - Interactive weekly sprint milestones (click to toggle completed status).
   - Curated list of high-impact learning resources.

---

## 🛠️ Project Structure

```
ai-career-internship-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx      # Master layout shell with sidebar + navbar + content outlet
│   │   ├── Layout.css
│   │   ├── Navbar.jsx      # Header with mobile menu toggle & user profile chip
│   │   ├── Navbar.css
│   │   ├── Sidebar.jsx     # Desktop sidebar & mobile drawer navigation
│   │   ├── Sidebar.css
│   │   ├── MetricCard.jsx  # Reusable KPI / metric statistics card
│   │   ├── MetricCard.css
│   │   ├── StatusBadge.jsx # Color-coded status badge pill (Applied, Offer, etc.)
│   │   └── StatusBadge.css
│   ├── data/
│   │   └── mockData.js     # Realistic mock data for applications, metrics, & matches
│   ├── pages/              # The 5 primary application views
│   │   ├── Dashboard.jsx   # Overview KPIs & recent applications
│   │   ├── Dashboard.css
│   │   ├── Applications.jsx# Filterable & searchable job application pipeline
│   │   ├── Applications.css
│   │   ├── AddApplication.jsx # Form with live updating card preview
│   │   ├── AddApplication.css
│   │   ├── JobMatch.jsx    # AI job fit scoring & gap analysis
│   │   ├── JobMatch.css
│   │   ├── LearningPlan.jsx# Skills roadmap & milestone checklist
│   │   └── LearningPlan.css
│   ├── App.jsx             # React Router routing configuration
│   ├── App.css             # Root application styles
│   ├── index.css           # Global CSS variables, modern tokens, & reset
│   └── main.jsx            # React 19 entry point
├── index.html              # HTML shell with Google Fonts & metadata
├── package.json            # Scripts & project dependencies
└── vite.config.js          # Vite configuration
```

---

## 💻 How to Run the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```

---

## 🎯 What to Learn From This Step

- **Declarative Client-Side Routing**: How `react-router-dom` uses `<BrowserRouter>`, `<Routes>`, `<Route>`, and `<NavLink>` to handle multi-page navigation without reloading the page.
- **Controlled Components & Forms**: How React manages form input state using `useState` and provides instantaneous UI feedback (such as the live card preview).
- **Component Reusability**: How extracting elements like `<MetricCard>` and `<StatusBadge>` keeps code clean and avoid repeating HTML/CSS.
- **Modern Pure CSS Architecture**: Using CSS Custom Properties (Variables) for harmonious color schemes, typography, and responsive layouts without external UI framework overhead.
