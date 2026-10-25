import React, { useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Code, 
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Compass,
  Trophy
} from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import './LearningPlan.css';

/**
 * Career & Skill Development Roadmap
 * 
 * Tracks technical competencies across a 5-stage career roadmap:
 * Beginner → Foundation → Practice → Projects → Internship Ready
 * Milestones can be checked off and are persisted in localStorage.
 */
export default function LearningPlan() {
  const { userSkills, roadmapStages, toggleRoadmapMilestone } = useApplications();

  // Calculate dynamic overall completion rate
  const { totalMilestones, completedMilestones, overallPercentage } = useMemo(() => {
    let total = 0;
    let completed = 0;
    roadmapStages.forEach((stage) => {
      stage.milestones.forEach((m) => {
        total++;
        if (m.completed) completed++;
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      totalMilestones: total,
      completedMilestones: completed,
      overallPercentage: percentage
    };
  }, [roadmapStages]);

  // Derive skills to improve based on user's current profile
  const recommendedSkillsToLearn = useMemo(() => {
    const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
    const roadmapSkillSuggestions = [
      { name: 'FastAPI / Node.js', category: 'Backend & APIs', reason: 'Connect frontend interfaces with performant REST endpoints' },
      { name: 'SQL & Database Indexing', category: 'Data Architecture', reason: 'Required by 80%+ of full-stack and data engineering positions' },
      { name: 'Machine Learning Basics', category: 'AI Foundations', reason: 'Understand regression, classification, and AI API integrations' },
      { name: 'Cloud & Containerization (Docker/AWS)', category: 'DevOps & Deployment', reason: 'Crucial for shipping production-ready portfolio prototypes' }
    ];

    return roadmapSkillSuggestions.filter((item) => {
      const parts = item.name.toLowerCase().split(/[\s/()]+/);
      return !parts.some((part) => userSet.has(part));
    });
  }, [userSkills]);

  return (
    <div className="learning-plan-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Career &amp; Skill Roadmap</h1>
          <p className="page-subtitle">
            Progressive 5-stage preparation path from programming fundamentals to landing your first software engineering internship.
          </p>
        </div>
      </div>

      {/* Top Roadmap Progress Banner */}
      <section className="card roadmap-banner-card" aria-label="Roadmap Progress Summary">
        <div className="banner-left">
          <div className="goal-icon-box">
            <Target size={28} />
          </div>
          <div>
            <span className="goal-pre-label">PRIMARY CAREER TARGET</span>
            <h2 className="goal-title">Junior Full-Stack &amp; AI Software Engineer</h2>
            <div className="goal-meta-row">
              <span className="goal-date">
                <Calendar size={14} />
                <span>Target Readiness: Active Application Cycle</span>
              </span>
              <span className="meta-separator">•</span>
              <span className="milestones-completed-text">
                {completedMilestones} of {totalMilestones} Milestones Completed
              </span>
            </div>
          </div>
        </div>

        <div className="banner-right">
          <div className="progress-stat-block">
            <span className="progress-number">{overallPercentage}%</span>
            <span className="progress-label">Roadmap Mastery</span>
          </div>
          <div className="banner-progress-track">
            <div 
              className="banner-progress-fill" 
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* 5-Stage Career Path Visual Pipeline */}
      <section className="card path-pipeline-card" aria-label="5-Stage Roadmap Pipeline">
        <div className="pipeline-header">
          <span className="pipeline-title">STRUCTURED PREPARATION JOURNEY</span>
          <span className="pipeline-desc">Click any milestone checkbox below to save progress directly to localStorage</span>
        </div>

        <div className="stages-flow-row">
          {roadmapStages.map((stage, idx) => {
            const stageCompleted = stage.milestones.filter((m) => m.completed).length;
            const isAllDone = stageCompleted === stage.milestones.length;

            return (
              <React.Fragment key={stage.id}>
                <div className={`stage-step-chip ${isAllDone ? 'step-completed' : stageCompleted > 0 ? 'step-in-progress' : ''}`}>
                  <div className="step-circle">
                    {isAllDone ? <CheckCircle2 size={16} /> : <span>{idx + 1}</span>}
                  </div>
                  <div className="step-info">
                    <span className="step-name">{stage.stageName.split(':')[1]?.trim() || stage.stageName}</span>
                    <span className="step-fraction">{stageCompleted}/{stage.milestones.length} done</span>
                  </div>
                </div>
                {idx < roadmapStages.length - 1 && (
                  <div className="step-connector-arrow">
                    <ArrowRight size={16} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="learning-grid">
        {/* Left Column: Interactive Stages & Milestones */}
        <section className="card milestones-column-card" aria-label="Roadmap Stages & Tasks">
          <div className="card-header">
            <div>
              <h2 className="card-title">Preparation Stages &amp; Tasks</h2>
              <p className="card-subtitle-text">Interactive milestones for hands-on skill development</p>
            </div>
            <Layers size={20} className="header-icon-muted" />
          </div>

          <div className="stages-list">
            {roadmapStages.map((stage) => {
              const stageCompletedCount = stage.milestones.filter((m) => m.completed).length;

              return (
                <div key={stage.id} className="stage-accordion-block">
                  <div className="stage-block-header">
                    <div>
                      <h3 className="stage-block-title">{stage.stageName}</h3>
                      <p className="stage-block-desc">{stage.description}</p>
                    </div>
                    <span className="stage-progress-badge">
                      {stageCompletedCount} / {stage.milestones.length} Done
                    </span>
                  </div>

                  <div className="milestones-checklist">
                    {stage.milestones.map((milestone) => (
                      <div 
                        key={milestone.id} 
                        className={`milestone-item-row ${milestone.completed ? 'completed' : ''}`}
                        onClick={() => toggleRoadmapMilestone(milestone.id)}
                        role="checkbox"
                        aria-checked={milestone.completed}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') toggleRoadmapMilestone(milestone.id); }}
                      >
                        <div className="milestone-checkbox-icon">
                          {milestone.completed ? (
                            <CheckCircle2 size={19} className="check-done" />
                          ) : (
                            <Circle size={19} className="check-todo" />
                          )}
                        </div>
                        <div className="milestone-text-content">
                          <strong className="milestone-title">{milestone.title}</strong>
                          <p className="milestone-desc">{milestone.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Verified Skills & Recommended Improvement Areas */}
        <aside className="learning-sidebar-column">
          {/* Current Verified Skills Card */}
          <section className="card verified-skills-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Your Current Skills</h3>
                <p className="card-subtitle-text">From your saved user profile</p>
              </div>
              <Compass size={18} className="header-icon-muted" />
            </div>

            <div className="verified-skills-wrap">
              {userSkills.map((skill) => (
                <span key={skill} className="skill-verified-tag">
                  <CheckCircle size={13} className="verified-check" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Recommended Skills to Improve Card */}
          <section className="card skills-to-improve-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Skills to Improve</h3>
                <p className="card-subtitle-text">Recommended learning priorities</p>
              </div>
              <Lightbulb size={18} className="header-icon-muted" />
            </div>

            <div className="improve-skills-list">
              {recommendedSkillsToLearn.map((item) => (
                <div key={item.name} className="improve-skill-item">
                  <div className="improve-skill-top">
                    <strong className="improve-skill-name">{item.name}</strong>
                    <span className="improve-skill-cat">{item.category}</span>
                  </div>
                  <p className="improve-skill-reason">{item.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio Tip Callout */}
          <section className="card portfolio-tip-card">
            <div className="tip-header">
              <Trophy size={18} className="tip-icon" />
              <h4>Student Portfolio Strategy</h4>
            </div>
            <p className="tip-text">
              Recruiters value demonstrable project evidence over generic skill claims. Build and deploy end-to-end features with clear documentation on your GitHub repository.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
