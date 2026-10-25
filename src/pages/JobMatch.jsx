import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Briefcase, 
  RefreshCw, 
  Cpu,
  Plus,
  X,
  RotateCcw,
  BookOpen,
  FileText,
  Sliders,
  Check,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { PREDEFINED_SKILLS, SAMPLE_JOB_POSTINGS } from '../data/mockData';
import './JobMatch.css';

/**
 * Intelligent Client-Side Job Matching Engine
 * 
 * Scans job description text against the predefined skill dictionary,
 * compares detected requirements against the candidate's active user skills,
 * and calculates a deterministic fit score with actionable recommendations.
 */
function analyzeJobFit(jobDescription, userSkillsList) {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      matchScore: 0,
      detectedSkills: [],
      matchedSkills: [],
      missingSkills: [],
      recommendations: ['Please enter or select a job description to perform analysis.'],
      summary: 'No job description provided.'
    };
  }

  const textLower = jobDescription.toLowerCase();

  // 1. Detect required skills from the job description using predefined skill dictionary
  const detectedSkills = PREDEFINED_SKILLS.filter((skill) => {
    const sLower = skill.toLowerCase();
    // Use word boundaries or symbol checks for precise matching (avoid substring false positives)
    if (sLower === 'c' || sLower === 'r') {
      const regex = new RegExp(`\\b${sLower}\\b`, 'i');
      return regex.test(textLower);
    }
    // Check if phrase or keyword appears in description
    return textLower.includes(sLower);
  });

  // Fallback if job description has niche phrasing
  const effectiveRequirements = detectedSkills.length > 0 
    ? detectedSkills 
    : ['React', 'JavaScript', 'Problem Solving', 'Teamwork'];

  // Normalize user skills
  const userSkillsSet = new Set(userSkillsList.map((s) => s.toLowerCase().trim()));

  // 2. Identify Matched vs Missing Skills
  const matchedSkills = effectiveRequirements.filter((req) => 
    userSkillsSet.has(req.toLowerCase().trim())
  );

  const missingSkills = effectiveRequirements.filter((req) => 
    !userSkillsSet.has(req.toLowerCase().trim())
  );

  // 3. Calculate Deterministic Match Score
  const matchScore = Math.round((matchedSkills.length / Math.max(effectiveRequirements.length, 1)) * 100);

  // 4. Generate Strategic Recommendations
  const recommendations = missingSkills.length > 0
    ? missingSkills.slice(0, 4).map((skill) => {
        switch (skill.toLowerCase()) {
          case 'machine learning':
          case 'artificial intelligence':
            return `Study foundational ML algorithms (Scikit-Learn/PyTorch) and publish a classification demo.`;
          case 'power bi':
          case 'tableau':
            return `Build an interactive dashboard on ${skill} showcasing sales or user analytics.`;
          case 'sql':
            return `Practice multi-table JOINs, subqueries, and window functions on LeetCode / HackerRank.`;
          case 'fastapi':
          case 'node.js':
            return `Construct a clean RESTful CRUD API service with interactive documentation.`;
          case 'aws':
          case 'cloud':
          case 'azure':
            return `Deploy a containerized application to ${skill} or complete foundational cloud practitioner modules.`;
          case 'figma':
            return `Create a reusable UI component library in Figma following 8pt grid design systems.`;
          default:
            return `Review core ${skill} concepts and implement a practical mini-project on your GitHub portfolio.`;
        }
      })
    : ['Your profile covers 100% of the detected technical requirements for this role! Focus on polishing behavioral STAR stories and mock coding rounds.'];

  // 5. Short explanation summary
  let summary = '';
  if (matchScore >= 80) {
    summary = `Strong competitive alignment! You meet ${matchedSkills.length} of ${effectiveRequirements.length} detected competencies (${matchScore}% match). Your background in ${matchedSkills.slice(0, 3).join(', ')} strongly positions you for technical screen rounds.`;
  } else if (matchScore >= 50) {
    summary = `Moderate alignment (${matchScore}% match). You cover fundamental requirements (${matchedSkills.slice(0, 3).join(', ')}), but closing key gaps in ${missingSkills.slice(0, 2).join(' and ')} will notably elevate your interview callback rate.`;
  } else {
    summary = `Growth opportunity (${matchScore}% match). This role requires specialized tools (${missingSkills.slice(0, 3).join(', ')}) that are not yet tracked in your primary skills profile. Consider reviewing the recommended learning steps below.`;
  }

  return {
    matchScore,
    detectedSkills: effectiveRequirements,
    matchedSkills,
    missingSkills,
    recommendations,
    summary
  };
}

/**
 * AI Job Fit Analyzer Component
 */
export default function JobMatch() {
  const { applications, userSkills, addUserSkill, removeUserSkill, resetUserSkillsToDefault } = useApplications();

  // Mode Selection: 'sample' | 'custom' | 'applications'
  const [analysisMode, setAnalysisMode] = useState('sample');
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_JOB_POSTINGS[0].id);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [customJobText, setCustomJobText] = useState(
    `Looking for an AI / Full-Stack Intern proficient in Python, React, SQL, and FastAPI.\nCandidate should have strong Git version control, REST API experience, and good Communication skills.`
  );
  const [customJobTitle, setCustomJobTitle] = useState('Custom Job Description Analysis');

  // New Skill Input state
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Active Job Description to analyze based on mode
  const currentJob = useMemo(() => {
    if (analysisMode === 'sample') {
      const sample = SAMPLE_JOB_POSTINGS.find((s) => s.id === selectedSampleId) || SAMPLE_JOB_POSTINGS[0];
      return {
        title: sample.title,
        company: sample.company,
        description: sample.description
      };
    } else if (analysisMode === 'applications') {
      const app = applications.find((a) => a.id === selectedAppId) || applications[0];
      if (!app) return { title: 'No Applications Found', company: '', description: '' };
      const skillsDesc = (app.requiredSkills || app.skills || []).join(', ');
      return {
        title: app.role,
        company: app.company,
        description: `Position: ${app.role} at ${app.company}.\nLocation: ${app.location || 'Remote'}.\nRequired Skills: ${skillsDesc}.\nNotes: ${app.notes || 'None'}`
      };
    } else {
      return {
        title: customJobTitle || 'Custom Job Description',
        company: 'Custom Listing',
        description: customJobText
      };
    }
  }, [analysisMode, selectedSampleId, selectedAppId, applications, customJobText, customJobTitle]);

  // Compute fit analysis automatically using the active job and user skills
  const analysisResult = useMemo(() => {
    return analyzeJobFit(currentJob.description, userSkills);
  }, [currentJob.description, userSkills]);

  // Simulate refresh effect
  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 400);
  };

  // Add new skill handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addUserSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  // Quick skill suggestions (predefined skills not yet in user skills)
  const availableSkillSuggestions = useMemo(() => {
    const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
    return PREDEFINED_SKILLS.filter((s) => !userSet.has(s.toLowerCase())).slice(0, 8);
  }, [userSkills]);

  return (
    <div className="job-match-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">AI Job Fit Analyzer</h1>
          <p className="page-subtitle">
            Intelligent client-side matching engine that evaluates your profile against job descriptions to identify skill matches and gaps.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleRefreshAnalysis}
          disabled={isAnalyzing}
          title="Re-run matching algorithm"
        >
          <RefreshCw size={16} className={isAnalyzing ? 'spin-animation' : ''} />
          <span>{isAnalyzing ? 'Recalculating...' : 'Refresh Fit Score'}</span>
        </button>
      </div>

      {/* ================================================================
         SECTION 1: USER SKILLS MANAGER (Stored in localStorage)
         ================================================================ */}
      <section className="card candidate-profile-card" aria-label="User Skills Profile">
        <div className="profile-card-header">
          <div className="profile-badge-title">
            <Cpu size={18} className="cpu-icon" />
            <div>
              <h3>Your Tracked Skills Profile</h3>
              <p className="profile-subtext">Saved in localStorage and used automatically in all job fit calculations</p>
            </div>
          </div>
          <div className="profile-header-actions">
            <span className="profile-status-pill">{userSkills.length} Verified Skills</span>
            <button 
              type="button" 
              className="btn-ghost reset-skills-link" 
              onClick={resetUserSkillsToDefault}
              title="Reset skills to default recommendations"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* User Skills Chips with Remove Buttons */}
        <div className="candidate-skills-list">
          {userSkills.map((skill) => (
            <span key={skill} className="skill-chip">
              <CheckCircle2 size={13} className="chip-check" />
              <span>{skill}</span>
              <button
                type="button"
                className="chip-remove-btn"
                onClick={() => removeUserSkill(skill)}
                aria-label={`Remove ${skill}`}
                title={`Remove ${skill}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        {/* Add Skill Input Form */}
        <form onSubmit={handleAddSkill} className="add-skill-form">
          <input
            type="text"
            className="add-skill-input"
            placeholder="Type a skill to add (e.g. Docker, TypeScript, PyTorch, Figma)..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm add-skill-btn">
            <Plus size={15} />
            <span>Add Skill</span>
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        {availableSkillSuggestions.length > 0 && (
          <div className="skill-suggestions-row">
            <span className="suggestions-label">Quick suggestions:</span>
            <div className="suggestions-list">
              {availableSkillSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-tag-btn"
                  onClick={() => addUserSkill(suggestion)}
                  title={`Add ${suggestion} to your profile`}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================================================================
         SECTION 2: JOB DESCRIPTION INPUT & MATCHING ENGINE
         ================================================================ */}
      <div className="job-match-layout">
        {/* Left Column: Job Description Selector / Input */}
        <section className="jobs-selection-column" aria-label="Target Opportunity Selection">
          {/* Mode Switcher Tabs */}
          <div className="match-source-tabs" role="tablist">
            <button
              type="button"
              className={`source-tab ${analysisMode === 'sample' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('sample')}
            >
              <BookOpen size={14} />
              <span>Sample Postings</span>
            </button>
            <button
              type="button"
              className={`source-tab ${analysisMode === 'applications' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('applications')}
            >
              <Briefcase size={14} />
              <span>My Tracked Apps</span>
            </button>
            <button
              type="button"
              className={`source-tab ${analysisMode === 'custom' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('custom')}
            >
              <FileText size={14} />
              <span>Paste Description</span>
            </button>
          </div>

          {/* Mode A: Curated Sample Postings */}
          {analysisMode === 'sample' && (
            <div className="match-cards-list">
              {SAMPLE_JOB_POSTINGS.map((sample) => {
                const isSelected = sample.id === selectedSampleId;
                const sampleResult = analyzeJobFit(sample.description, userSkills);

                return (
                  <div 
                    key={sample.id} 
                    className={`card match-card-summary ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedSampleId(sample.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedSampleId(sample.id); }}
                  >
                    <div className="match-card-summary-top">
                      <div>
                        <h4 className="match-job-title">{sample.title}</h4>
                        <p className="match-job-company">{sample.company}</p>
                      </div>
                      <div className="score-badge-circle">
                        <span className="score-number">{sampleResult.matchScore}%</span>
                        <span className="score-label">FIT</span>
                      </div>
                    </div>

                    <div className="mini-progress-track">
                      <div 
                        className="mini-progress-fill" 
                        style={{ width: `${sampleResult.matchScore}%` }}
                      />
                    </div>

                    <div className="match-card-summary-bottom">
                      <span className="matched-count-text">
                        {sampleResult.matchedSkills.length} of {sampleResult.detectedSkills.length} skills matched
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode B: Tracked Applications */}
          {analysisMode === 'applications' && (
            <div className="match-cards-list">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const isSelected = app.id === selectedAppId;
                  const skillsDesc = (app.requiredSkills || app.skills || []).join(', ');
                  const appResult = analyzeJobFit(skillsDesc, userSkills);

                  return (
                    <div 
                      key={app.id} 
                      className={`card match-card-summary ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedAppId(app.id)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => { if (e.key === 'Enter') setSelectedAppId(app.id); }}
                    >
                      <div className="match-card-summary-top">
                        <div>
                          <h4 className="match-job-title">{app.role}</h4>
                          <p className="match-job-company">{app.company} • {app.status}</p>
                        </div>
                        <div className="score-badge-circle">
                          <span className="score-number">{appResult.matchScore}%</span>
                          <span className="score-label">FIT</span>
                        </div>
                      </div>

                      <div className="mini-progress-track">
                        <div 
                          className="mini-progress-fill" 
                          style={{ width: `${appResult.matchScore}%` }}
                        />
                      </div>

                      <div className="match-card-summary-bottom">
                        <span className="matched-count-text">
                          {appResult.matchedSkills.length} matching skills
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-substate-box">
                  <p>No tracked applications found.</p>
                </div>
              )}
            </div>
          )}

          {/* Mode C: Custom Description Paste */}
          {analysisMode === 'custom' && (
            <div className="card custom-paste-card">
              <div className="form-group">
                <label className="form-label">Job Title / Target Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Junior Data Scientist"
                  value={customJobTitle}
                  onChange={(e) => setCustomJobTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paste Raw Job Description</label>
                <textarea
                  rows={8}
                  className="form-textarea custom-job-textarea"
                  placeholder="Paste any job posting text, qualifications, and required skills here..."
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                />
                <span className="field-helper-text">
                  The engine will automatically extract technical requirements and calculate your alignment score.
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Detailed Match Breakdown & Insights */}
        <section className="card match-detail-card" aria-label="Selected Role Deep Dive">
          <div className="detail-header-block">
            <div className="detail-company-line">
              <span className="detail-company">{currentJob.company}</span>
              <span className="meta-separator">•</span>
              <span className="detail-engine-tag">Intelligent Match Engine</span>
            </div>
            <h2 className="detail-title">{currentJob.title}</h2>
          </div>

          {/* Fit Progress Meter */}
          <div className="large-score-meter-card">
            <div className="meter-header">
              <div className="meter-label">
                <Sparkles size={18} className="meter-icon" />
                <span>Overall Job Fit Score</span>
              </div>
              <span className="meter-percentage">{analysisResult.matchScore}% Match</span>
            </div>
            <div className="progress-bar-track large-track">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${analysisResult.matchScore}%`,
                  background: analysisResult.matchScore >= 75 
                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                    : analysisResult.matchScore >= 50 
                    ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                }}
              />
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="skills-comparison-grid">
            {/* Matched Skills */}
            <div className="comparison-box matched-box">
              <div className="comparison-header">
                <CheckCircle2 size={16} className="matched-icon" />
                <h4>Matching Skills ({analysisResult.matchedSkills.length})</h4>
              </div>
              <div className="tags-flex">
                {analysisResult.matchedSkills.length > 0 ? (
                  analysisResult.matchedSkills.map((skill) => (
                    <span key={skill} className="skill-pill-matched">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="no-match-text">None of your current profile skills match yet.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="comparison-box missing-box">
              <div className="comparison-header">
                <AlertCircle size={16} className="missing-icon" />
                <h4>Missing Skills ({analysisResult.missingSkills.length})</h4>
              </div>
              <div className="tags-flex">
                {analysisResult.missingSkills.length > 0 ? (
                  analysisResult.missingSkills.map((skill) => (
                    <span key={skill} className="skill-pill-missing">
                      • {skill}
                    </span>
                  ))
                ) : (
                  <span className="all-matched-text">🎉 No skill gaps detected for this role!</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Skills & Actionable Advice */}
          <div className="ai-insight-box">
            <div className="insight-header">
              <Lightbulb size={18} className="insight-icon" />
              <h4>Strategic Learning Recommendations</h4>
            </div>
            <p className="insight-summary">{analysisResult.summary}</p>

            <div className="recommendations-container">
              <strong className="rec-heading">Targeted Preparation Steps:</strong>
              <ul className="rec-bullet-list">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="rec-bullet-item">
                    <span className="rec-bullet-dot">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical Engine Disclaimer Badge */}
          <div className="engine-disclaimer-card">
            <Sliders size={15} className="disclaimer-icon" />
            <p className="disclaimer-text">
              <strong>Transparent Local Engine:</strong> This feature utilizes a deterministic client-side matching algorithm comparing your saved skills against detected industry keywords. No external paid AI API keys or backend servers are used.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
