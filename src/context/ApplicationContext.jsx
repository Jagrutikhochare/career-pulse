import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_APPLICATIONS, 
  DEFAULT_USER_SKILLS, 
  DEFAULT_ROADMAP_STAGES, 
  calculateApplicationStats 
} from '../data/mockData';

const ApplicationContext = createContext(null);

const STORAGE_KEYS = {
  APPLICATIONS: 'careerpulse_applications',
  USER_SKILLS: 'careerpulse_user_skills',
  ROADMAP_STAGES: 'careerpulse_roadmap_stages'
};

/**
 * Safely read stored item from localStorage with fallback
 */
function getStoredItem(key, fallbackValue) {
  if (typeof window === 'undefined') return fallbackValue;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
  }
  return fallbackValue;
}

/**
 * Normalizes application object to ensure consistent field names across components
 */
function normalizeApplication(app) {
  const skillsArray = Array.isArray(app.requiredSkills)
    ? app.requiredSkills
    : Array.isArray(app.skills)
    ? app.skills
    : app.skillsInput
    ? app.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
    : ['React', 'JavaScript'];

  // Normalize status to one of: 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'
  let normalizedStatus = 'Applied';
  const rawStatus = (app.status || '').toLowerCase();
  if (rawStatus === 'shortlisted') normalizedStatus = 'Shortlisted';
  else if (rawStatus === 'interview' || rawStatus === 'interviewing' || rawStatus === 'interviews') normalizedStatus = 'Interview';
  else if (rawStatus === 'selected' || rawStatus === 'offer') normalizedStatus = 'Selected';
  else if (rawStatus === 'rejected') normalizedStatus = 'Rejected';

  const link = app.applicationLink || app.jobUrl || '';
  const dateApplied = app.applicationDate || app.appliedDate || new Date().toISOString().split('T')[0];

  return {
    id: app.id || `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    company: app.company || 'Unknown Company',
    role: app.role || 'Software Engineer',
    applicationDate: dateApplied,
    appliedDate: dateApplied, // Backward-compatibility alias
    deadline: app.deadline || null,
    applicationLink: link,
    jobUrl: link, // Backward-compatibility alias
    requiredSkills: skillsArray,
    skills: skillsArray, // Backward-compatibility alias
    status: normalizedStatus,
    notes: app.notes || '',
    location: app.location || 'Remote',
    type: app.type || 'Internship',
    salary: app.salary || 'Not specified',
    matchScore: typeof app.matchScore === 'number' ? app.matchScore : 88
  };
}

/**
 * ApplicationProvider
 * Centralized single source of truth for:
 * 1. Internship & Job Applications
 * 2. User Skills
 * 3. Learning Roadmap Milestones
 * All state is automatically persisted to browser localStorage.
 */
export function ApplicationProvider({ children }) {
  // 1. Applications state (loaded from localStorage or initialized with realistic samples)
  const [applications, setApplications] = useState(() => {
    const raw = getStoredItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    return raw.map(normalizeApplication);
  });

  // 2. User Skills state (stored in localStorage)
  const [userSkills, setUserSkills] = useState(() => {
    return getStoredItem(STORAGE_KEYS.USER_SKILLS, DEFAULT_USER_SKILLS);
  });

  // 3. Roadmap Stages state (stored in localStorage)
  const [roadmapStages, setRoadmapStages] = useState(() => {
    return getStoredItem(STORAGE_KEYS.ROADMAP_STAGES, DEFAULT_ROADMAP_STAGES);
  });

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save applications to localStorage:', e);
    }
  }, [applications]);

  // Sync userSkills to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(userSkills));
    } catch (e) {
      console.warn('Failed to save userSkills to localStorage:', e);
    }
  }, [userSkills]);

  // Sync roadmapStages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROADMAP_STAGES, JSON.stringify(roadmapStages));
    } catch (e) {
      console.warn('Failed to save roadmapStages to localStorage:', e);
    }
  }, [roadmapStages]);

  // Dynamically calculate summary statistics and funnel distribution
  const stats = useMemo(() => {
    return calculateApplicationStats(applications);
  }, [applications]);

  // Add a new application
  const addApplication = (rawNewApp) => {
    const formatted = normalizeApplication(rawNewApp);
    setApplications((prev) => [formatted, ...prev]);
    return formatted;
  };

  // Update an existing application
  const updateApplication = (id, updatedFields) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return normalizeApplication({ ...app, ...updatedFields });
        }
        return app;
      })
    );
  };

  // Delete an application
  const deleteApplication = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // User Skills Management
  const addUserSkill = (skillName) => {
    const clean = skillName.trim();
    if (!clean) return;
    setUserSkills((prev) => {
      if (prev.some((s) => s.toLowerCase() === clean.toLowerCase())) {
        return prev; // Avoid duplicate
      }
      return [...prev, clean];
    });
  };

  const removeUserSkill = (skillToRemove) => {
    setUserSkills((prev) => prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const resetUserSkillsToDefault = () => {
    setUserSkills(DEFAULT_USER_SKILLS);
  };

  // Roadmap milestone toggle
  const toggleRoadmapMilestone = (milestoneId) => {
    setRoadmapStages((prevStages) =>
      prevStages.map((stage) => ({
        ...stage,
        milestones: stage.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        )
      }))
    );
  };

  // Reset all application data to default mock records
  const resetToDefaultData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.USER_SKILLS);
      localStorage.removeItem(STORAGE_KEYS.ROADMAP_STAGES);
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
    setApplications(INITIAL_APPLICATIONS.map(normalizeApplication));
    setUserSkills(DEFAULT_USER_SKILLS);
    setRoadmapStages(DEFAULT_ROADMAP_STAGES);
  };

  const value = {
    // Application Data & CRUD
    applications,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
    resetToDefaultData,

    // User Skills
    userSkills,
    addUserSkill,
    removeUserSkill,
    resetUserSkillsToDefault,

    // Career Roadmap
    roadmapStages,
    toggleRoadmapMilestone
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

/**
 * Custom hook to consume the centralized application data and statistics
 */
export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
