import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle,
  Eye,
  PlusCircle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useApplications } from '../context/ApplicationContext';
import './AddApplication.css';

/**
 * AddApplication Page
 * Full-featured application entry form with strict validation,
 * centralized React Context integration, localStorage persistence,
 * and an interactive live preview card.
 */
export default function AddApplication() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();

  // Controlled form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    skillsInput: '',
    status: 'Applied',
    location: '',
    type: 'Internship',
    salary: '',
    notes: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastSubmittedApp, setLastSubmittedApp] = useState(null);

  // Handle generic input change and clear field-specific error
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Convert comma-separated string to an array of clean skill tags
  const parsedSkills = formData.skillsInput
    ? formData.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  /**
   * Validate all form inputs
   * Returns an object of errors. If empty, form is valid.
   */
  const validateForm = () => {
    const newErrors = {};

    // 1. Company Name validation (Required, min 2 chars)
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required.';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters.';
    }

    // 2. Job Role validation (Required, min 2 chars)
    if (!formData.role.trim()) {
      newErrors.role = 'Job role is required.';
    } else if (formData.role.trim().length < 2) {
      newErrors.role = 'Job role must be at least 2 characters.';
    }

    // 3. Application Date validation (Required, valid date)
    if (!formData.appliedDate) {
      newErrors.appliedDate = 'Application date is required.';
    } else if (isNaN(new Date(formData.appliedDate).getTime())) {
      newErrors.appliedDate = 'Please select a valid application date.';
    }

    // 4. Deadline validation (Optional, but if given, must be valid & not before appliedDate)
    if (formData.deadline) {
      if (isNaN(new Date(formData.deadline).getTime())) {
        newErrors.deadline = 'Please enter a valid deadline date.';
      } else if (formData.appliedDate) {
        const applied = new Date(formData.appliedDate);
        const deadline = new Date(formData.deadline);
        if (deadline < applied) {
          newErrors.deadline = 'Deadline cannot be earlier than the application date.';
        }
      }
    }

    // 5. Application Link validation (Optional, but if given, must be valid URL)
    if (formData.jobUrl.trim()) {
      try {
        const parsedUrl = new URL(formData.jobUrl.trim());
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          newErrors.jobUrl = 'Application link must start with http:// or https://';
        }
      } catch {
        newErrors.jobUrl = 'Please enter a valid URL (e.g., https://company.com/careers/job-id).';
      }
    }

    // 6. Required Skills validation (Required, at least 1 skill)
    if (!formData.skillsInput.trim()) {
      newErrors.skillsInput = 'Please provide at least one required skill.';
    } else if (parsedSkills.length === 0) {
      newErrors.skillsInput = 'Please enter at least one valid skill tag separated by commas.';
    }

    // 7. Status validation (Required, must be one of allowed options)
    const allowedStatuses = ['Applied', 'Shortlisted', 'Interview', 'Interviewing', 'Selected', 'Rejected'];
    if (!formData.status || !allowedStatuses.includes(formData.status)) {
      newErrors.status = 'Please select a valid pipeline status.';
    }

    return newErrors;
  };

  /**
   * Form Submit Handler
   * 1. Validates all inputs
   * 2. Adds application to centralized state
   * 3. Syncs to localStorage automatically via ApplicationContext
   * 4. Updates Applications page and Dashboard stats
   * 5. Redirects to Applications page
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const formValidationErrors = validateForm();
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      // Scroll to top of form or first error
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Create sanitized application payload
    const newApplicationPayload = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      jobUrl: formData.jobUrl.trim(),
      applicationLink: formData.jobUrl.trim(),
      appliedDate: formData.appliedDate,
      applicationDate: formData.appliedDate,
      deadline: formData.deadline || null,
      skills: parsedSkills,
      requiredSkills: parsedSkills,
      status: formData.status === 'Interviewing' ? 'Interview' : formData.status,
      location: formData.location.trim() || 'Remote',
      type: formData.type || 'Internship',
      salary: formData.salary.trim() || 'Not specified',
      notes: formData.notes.trim() || ''
    };

    // Save to centralized store (and localStorage)
    const savedApp = addApplication(newApplicationPayload);

    setLastSubmittedApp(savedApp);
    setSubmittedSuccess(true);
    setErrors({});

    // Redirect to Applications page after successful submission
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  // Reset form to track another application
  const handleReset = () => {
    setFormData({
      company: '',
      role: '',
      jobUrl: '',
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: '',
      skillsInput: '',
      status: 'Applied',
      location: '',
      type: 'Internship',
      salary: '',
      notes: ''
    });
    setErrors({});
    setSubmittedSuccess(false);
    setLastSubmittedApp(null);
  };

  return (
    <div className="add-application-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Track New Application</h1>
          <p className="page-subtitle">
            Add a new job or internship opportunity with deadline reminders and required skills.
          </p>
        </div>
        <Link to="/applications" className="btn btn-secondary">
          Cancel &amp; Return
        </Link>
      </div>

      {/* Success Notification Alert */}
      {submittedSuccess && lastSubmittedApp && (
        <div className="card success-banner-card animate-fade-in" role="status">
          <div className="success-banner-content">
            <CheckCircle size={32} className="success-icon" />
            <div>
              <h3 className="success-title">Application Saved to Pipeline!</h3>
              <p className="success-message">
                Successfully recorded <strong>{lastSubmittedApp.role}</strong> at <strong>{lastSubmittedApp.company}</strong> with status <strong>"{lastSubmittedApp.status}"</strong>.
              </p>
              <span className="success-subtext">
                ✓ Saved to localStorage • Applications page &amp; Dashboard metrics updated.
              </span>
            </div>
          </div>
          <div className="success-banner-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Track Another
            </button>
            <Link to="/applications" className="btn btn-primary">
              <span>View in Applications</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Form on Left, Live Preview on Right */}
      <div className="add-app-grid">
        {/* Form Column */}
        <section className="card form-container-card" aria-label="Add Application Form">
          <form onSubmit={handleSubmit} className="application-form" noValidate>
            {/* General Validation Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="form-error-alert animate-fade-in" role="alert">
                <AlertCircle size={18} className="error-alert-icon" />
                <div>
                  <strong>Please fix the errors below before saving:</strong>
                  <ul className="error-list">
                    {Object.values(errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Field 1 & 2: Company Name and Job Role */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="company-input" className="form-label">
                  Company Name <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Building2 size={17} className="field-icon" />
                  <input
                    id="company-input"
                    name="company"
                    type="text"
                    className={`form-input ${errors.company ? 'input-error' : ''}`}
                    placeholder="e.g. Anthropic, Google, Stripe"
                    value={formData.company}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? 'company-error' : undefined}
                    required
                  />
                </div>
                {errors.company && (
                  <span id="company-error" className="field-error-text">
                    {errors.company}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role-input" className="form-label">
                  Job Role / Title <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Briefcase size={17} className="field-icon" />
                  <input
                    id="role-input"
                    name="role"
                    type="text"
                    className={`form-input ${errors.role ? 'input-error' : ''}`}
                    placeholder="e.g. Software Engineer Intern"
                    value={formData.role}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.role)}
                    aria-describedby={errors.role ? 'role-error' : undefined}
                    required
                  />
                </div>
                {errors.role && (
                  <span id="role-error" className="field-error-text">
                    {errors.role}
                  </span>
                )}
              </div>
            </div>

            {/* Field 3 & 4: Application Link and Status */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="jobUrl-input" className="form-label">
                  Application Link / Job URL
                </label>
                <div className="input-with-icon">
                  <LinkIcon size={17} className="field-icon" />
                  <input
                    id="jobUrl-input"
                    name="jobUrl"
                    type="url"
                    className={`form-input ${errors.jobUrl ? 'input-error' : ''}`}
                    placeholder="https://example.com/careers/listing"
                    value={formData.jobUrl}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.jobUrl)}
                    aria-describedby={errors.jobUrl ? 'jobUrl-error' : undefined}
                  />
                </div>
                {errors.jobUrl ? (
                  <span id="jobUrl-error" className="field-error-text">
                    {errors.jobUrl}
                  </span>
                ) : (
                  <span className="field-helper-text">
                    Direct link to the job posting or submission confirmation.
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status-select" className="form-label">
                  Pipeline Status <span className="required-star">*</span>
                </label>
                <select
                  id="status-select"
                  name="status"
                  className={`form-select ${errors.status ? 'input-error' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.status)}
                  required
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.status && (
                  <span className="field-error-text">{errors.status}</span>
                )}
              </div>
            </div>

            {/* Field 5 & 6: Application Date and Deadline */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="appliedDate-input" className="form-label">
                  Application Date <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Clock size={17} className="field-icon" />
                  <input
                    id="appliedDate-input"
                    name="appliedDate"
                    type="date"
                    className={`form-input ${errors.appliedDate ? 'input-error' : ''}`}
                    value={formData.appliedDate}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.appliedDate)}
                    aria-describedby={errors.appliedDate ? 'appliedDate-error' : undefined}
                    required
                  />
                </div>
                {errors.appliedDate && (
                  <span id="appliedDate-error" className="field-error-text">
                    {errors.appliedDate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="deadline-input" className="form-label">
                  Deadline (Optional)
                </label>
                <div className="input-with-icon">
                  <Calendar size={17} className="field-icon" />
                  <input
                    id="deadline-input"
                    name="deadline"
                    type="date"
                    className={`form-input ${errors.deadline ? 'input-error' : ''}`}
                    value={formData.deadline}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.deadline)}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                  />
                </div>
                {errors.deadline ? (
                  <span id="deadline-error" className="field-error-text">
                    {errors.deadline}
                  </span>
                ) : (
                  <span className="field-helper-text">
                    Testing deadline, interview date, or decision cutoff.
                  </span>
                )}
              </div>
            </div>

            {/* Field 7: Required Skills */}
            <div className="form-group">
              <label htmlFor="skills-input" className="form-label">
                Required Skills <span className="required-star">*</span>
              </label>
              <input
                id="skills-input"
                name="skillsInput"
                type="text"
                className={`form-input ${errors.skillsInput ? 'input-error' : ''}`}
                placeholder="e.g. React, TypeScript, Python, FastAPI, Docker"
                value={formData.skillsInput}
                onChange={handleChange}
                aria-invalid={Boolean(errors.skillsInput)}
                aria-describedby={errors.skillsInput ? 'skills-error' : undefined}
                required
              />
              {errors.skillsInput ? (
                <span id="skills-error" className="field-error-text">
                  {errors.skillsInput}
                </span>
              ) : (
                <span className="field-helper-text">
                  Enter skill keywords separated by commas (e.g. React, JavaScript, Node.js).
                </span>
              )}
            </div>

            {/* Optional Additional Metadata: Location, Opportunity Type, Salary */}
            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="location-input" className="form-label">
                  Location / Work Model
                </label>
                <div className="input-with-icon">
                  <MapPin size={17} className="field-icon" />
                  <input
                    id="location-input"
                    name="location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Remote, San Francisco, CA"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="type-select" className="form-label">
                  Opportunity Type
                </label>
                <select
                  id="type-select"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary-input" className="form-label">
                  Pay / Stipend
                </label>
                <div className="input-with-icon">
                  <DollarSign size={17} className="field-icon" />
                  <input
                    id="salary-input"
                    name="salary"
                    type="text"
                    className="form-input"
                    placeholder="e.g. $45/hr or $110k"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Notes Field */}
            <div className="form-group">
              <label htmlFor="notes-textarea" className="form-label">
                Preparation Notes &amp; Contacts
              </label>
              <textarea
                id="notes-textarea"
                name="notes"
                rows={3}
                className="form-textarea"
                placeholder="Referral name, recruiter contact, specific round focus areas, etc."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Form Submit Button */}
            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary form-submit-btn">
                <PlusCircle size={18} />
                <span>Save Application to Pipeline</span>
              </button>
            </div>
          </form>
        </section>

        {/* Live Preview Card Column */}
        <aside className="preview-column" aria-label="Application Card Live Preview">
          <div className="preview-sticky-wrapper">
            <div className="preview-header-label">
              <Eye size={16} />
              <span>Live Application Card Preview</span>
            </div>

            <article className="card preview-card-box">
              <div className="app-card-top">
                <div className="company-info-block">
                  <div className="company-logo-pill">
                    {formData.company ? formData.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="company-name-text">
                      {formData.company || 'Company Name'}
                    </h3>
                    <h2 className="role-title-text">
                      {formData.role || 'Job / Role Title'}
                    </h2>
                  </div>
                </div>
                <StatusBadge status={formData.status} />
              </div>

              <div className="app-metadata-grid">
                <div className="meta-item">
                  <MapPin size={15} className="meta-icon" />
                  <span>{formData.location || 'Location Not Specified'}</span>
                </div>
                <div className="meta-item">
                  <Briefcase size={15} className="meta-icon" />
                  <span className="type-tag">{formData.type}</span>
                </div>
                <div className="meta-item">
                  <DollarSign size={15} className="meta-icon" />
                  <span>{formData.salary || 'Salary Disclosed Later'}</span>
                </div>
                <div className="meta-item">
                  <Clock size={15} className="meta-icon" />
                  <span>Applied: {formData.appliedDate || 'Today'}</span>
                </div>
                {formData.deadline && (
                  <div className="meta-item preview-deadline-item">
                    <Calendar size={15} className="meta-icon" />
                    <span>Deadline: {formData.deadline}</span>
                  </div>
                )}
              </div>

              {/* Skills Badges Preview */}
              <div className="skills-preview-group">
                <span className="skills-preview-label">Required Skills:</span>
                <div className="app-skills-row">
                  {parsedSkills.length > 0 ? (
                    parsedSkills.map((s, idx) => (
                      <span key={idx} className="tag tag-accent">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="skills-placeholder-hint">Type skills above to preview badges...</span>
                  )}
                </div>
              </div>

              {/* Notes Preview */}
              {formData.notes && (
                <div className="app-notes-preview">
                  <FileText size={14} className="notes-icon" />
                  <p className="notes-text">{formData.notes}</p>
                </div>
              )}

              <div className="preview-info-box">
                <span className="preview-info-title">Real-time Reactive Preview</span>
                <p className="preview-info-desc">
                  This card updates synchronously as you fill out the fields. When saved, it persists to localStorage and immediately updates your Pipeline and Dashboard.
                </p>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </div>
  );
}
