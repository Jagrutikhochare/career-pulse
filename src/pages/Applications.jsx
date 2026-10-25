import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Briefcase,
  FileText,
  ArrowUpDown,
  Clock,
  AlertCircle,
  LayoutGrid,
  List,
  Trash2,
  Edit3,
  Eye,
  X,
  CheckCircle,
  Save,
  Building2,
  Link as LinkIcon
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useApplications } from '../context/ApplicationContext';
import './Applications.css';

/**
 * Format ISO date string into a friendly, readable format (e.g., "Feb 12, 2025")
 */
function formatDate(dateStr) {
  if (!dateStr) return 'No date set';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate deadline urgency tag based on days remaining from current date
 */
function getDeadlineInfo(deadlineStr) {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineStr + 'T00:00:00');
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}d overdue`, className: 'deadline-passed' };
  } else if (diffDays === 0) {
    return { label: 'Due Today', className: 'deadline-urgent' };
  } else if (diffDays <= 3) {
    return { label: `Due in ${diffDays}d`, className: 'deadline-urgent' };
  } else if (diffDays <= 7) {
    return { label: `In ${diffDays}d`, className: 'deadline-warning' };
  } else {
    return { label: `In ${diffDays}d`, className: 'deadline-normal' };
  }
}

/**
 * Applications Page
 * Complete, responsive application-management interface.
 * Supports Search, Status Filtering, Multi-attribute Sorting,
 * Full Application Details View, Edit Modal, and Delete with Confirmation.
 */
export default function Applications() {
  const { applications, updateApplication, deleteApplication } = useApplications();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('applied-desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [detailsApp, setDetailsApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const statusOptions = ['ALL', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  // Handle ESC key to close open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDetailsApp(null);
        setEditingApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show transient toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Calculate live counts for each status tab
  const statusCounts = useMemo(() => {
    const counts = { ALL: applications.length, Applied: 0, Shortlisted: 0, Interview: 0, Selected: 0, Rejected: 0 };
    applications.forEach((app) => {
      const s = (app.status || '').toLowerCase();
      if (s === 'applied') counts.Applied++;
      else if (s === 'shortlisted') counts.Shortlisted++;
      else if (s === 'interview' || s === 'interviewing' || s === 'interviews') counts.Interview++;
      else if (s === 'selected' || s === 'offer') counts.Selected++;
      else if (s === 'rejected') counts.Rejected++;
    });
    return counts;
  }, [applications]);

  // Filter applications based on Search, Status, and Job Type
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 1. Status Filter
      const appStatus = (app.status || '').toLowerCase();
      const filterStatus = selectedStatus.toLowerCase();

      let matchesStatus = selectedStatus === 'ALL';
      if (!matchesStatus) {
        if (filterStatus === 'selected') {
          matchesStatus = appStatus === 'selected' || appStatus === 'offer';
        } else if (filterStatus === 'interview') {
          matchesStatus = appStatus === 'interview' || appStatus === 'interviewing' || appStatus === 'interviews';
        } else {
          matchesStatus = appStatus === filterStatus;
        }
      }

      // 2. Job Type Filter
      const matchesType = 
        selectedType === 'ALL' || 
        (app.type || '').toLowerCase() === selectedType.toLowerCase();

      // 3. Search Query Filter across Role, Company, Location, Skills, and Notes
      const q = searchQuery.toLowerCase().trim();
      const skillsArray = app.requiredSkills || app.skills || [];
      const matchesQuery = 
        !q ||
        (app.role && app.role.toLowerCase().includes(q)) ||
        (app.company && app.company.toLowerCase().includes(q)) ||
        (app.location && app.location.toLowerCase().includes(q)) ||
        (app.notes && app.notes.toLowerCase().includes(q)) ||
        skillsArray.some((skill) => skill.toLowerCase().includes(q));

      return matchesStatus && matchesType && matchesQuery;
    });
  }, [applications, searchQuery, selectedStatus, selectedType]);

  // Sort the filtered applications
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      const dateA = new Date(a.applicationDate || a.appliedDate || 0);
      const dateB = new Date(b.applicationDate || b.appliedDate || 0);

      switch (sortBy) {
        case 'applied-desc':
          return dateB - dateA;
        case 'applied-asc':
          return dateA - dateB;
        case 'deadline-asc': {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        }
        case 'company-asc':
          return (a.company || '').localeCompare(b.company || '');
        case 'company-desc':
          return (b.company || '').localeCompare(a.company || '');
        case 'role-asc':
          return (a.role || '').localeCompare(b.role || '');
        case 'match-desc':
          return (b.matchScore || 0) - (a.matchScore || 0);
        default:
          return 0;
      }
    });
  }, [filteredApplications, sortBy]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedType('ALL');
    setSortBy('applied-desc');
  };

  const isFiltered = searchQuery !== '' || selectedStatus !== 'ALL' || selectedType !== 'ALL' || sortBy !== 'applied-desc';

  // Handle Delete with Confirmation
  const handleDelete = (app) => {
    const confirmed = window.confirm(`Are you sure you want to delete the application for "${app.role}" at ${app.company}?`);
    if (confirmed) {
      deleteApplication(app.id);
      showToast(`Deleted application for ${app.company}`);
      if (detailsApp?.id === app.id) setDetailsApp(null);
      if (editingApp?.id === app.id) setEditingApp(null);
    }
  };

  // Open Edit Modal with Pre-filled Form
  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setEditFormData({
      company: app.company || '',
      role: app.role || '',
      applicationDate: app.applicationDate || app.appliedDate || '',
      deadline: app.deadline || '',
      applicationLink: app.applicationLink || app.jobUrl || '',
      skillsInput: (app.requiredSkills || app.skills || []).join(', '),
      status: app.status || 'Applied',
      location: app.location || '',
      type: app.type || 'Internship',
      salary: app.salary || '',
      notes: app.notes || ''
    });
    setEditErrors({});
  };

  // Validate and Save Edit Form
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!editFormData.company.trim()) errors.company = 'Company name is required.';
    if (!editFormData.role.trim()) errors.role = 'Job role is required.';
    if (!editFormData.applicationDate) errors.applicationDate = 'Application date is required.';

    if (editFormData.applicationLink && editFormData.applicationLink.trim()) {
      try {
        const u = new URL(editFormData.applicationLink.trim());
        if (!['http:', 'https:'].includes(u.protocol)) {
          errors.applicationLink = 'Link must start with http:// or https://';
        }
      } catch {
        errors.applicationLink = 'Please provide a valid URL.';
      }
    }

    if (editFormData.deadline && editFormData.applicationDate) {
      if (new Date(editFormData.deadline) < new Date(editFormData.applicationDate)) {
        errors.deadline = 'Deadline cannot precede application date.';
      }
    }

    const skills = editFormData.skillsInput
      ? editFormData.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (skills.length === 0) {
      errors.skillsInput = 'Please provide at least one required skill tag.';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    updateApplication(editingApp.id, {
      company: editFormData.company.trim(),
      role: editFormData.role.trim(),
      applicationDate: editFormData.applicationDate,
      appliedDate: editFormData.applicationDate,
      deadline: editFormData.deadline || null,
      applicationLink: editFormData.applicationLink.trim(),
      jobUrl: editFormData.applicationLink.trim(),
      requiredSkills: skills,
      skills: skills,
      status: editFormData.status,
      location: editFormData.location.trim() || 'Remote',
      type: editFormData.type,
      salary: editFormData.salary.trim() || 'Not specified',
      notes: editFormData.notes.trim()
    });

    showToast(`Updated "${editFormData.role}" at ${editFormData.company}`);
    setEditingApp(null);
  };

  return (
    <div className="applications-page animate-fade-in">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-notification-banner animate-fade-in">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Application Pipeline</h1>
          <p className="page-subtitle">
            Manage, filter, sort, and edit all your tracked career and internship opportunities.
          </p>
        </div>
        <Link to="/add-application" className="btn btn-primary add-app-header-btn">
          <Plus size={18} />
          <span>Add Application</span>
        </Link>
      </div>

      {/* Main Filter & Control Toolbar */}
      <div className="card filter-toolbar-card">
        {/* Row 1: Search Bar */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            id="app-search-input"
            type="text"
            className="search-input"
            placeholder="Search by company, role, location, or required skill (e.g. React, Python, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search text"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Row 2: Status Pills */}
        <div className="status-pills-row">
          <div className="status-pills-group" role="tablist" aria-label="Filter by Status">
            {statusOptions.map((status) => {
              const count = statusCounts[status] || 0;
              return (
                <button
                  key={status}
                  type="button"
                  className={`filter-pill ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                  role="tab"
                  aria-selected={selectedStatus === status}
                >
                  <span>{status === 'ALL' ? 'All Applications' : status}</span>
                  <span className="pill-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Secondary Controls (Sorting, Job Type, and View Switcher) */}
        <div className="controls-row">
          <div className="filter-selects-group">
            {/* Sorting Dropdown */}
            <div className="control-field">
              <label htmlFor="sort-by-select" className="control-label">
                <ArrowUpDown size={14} />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-by-select"
                className="control-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="applied-desc">Date Applied (Newest)</option>
                <option value="applied-asc">Date Applied (Oldest)</option>
                <option value="deadline-asc">Deadline (Soonest)</option>
                <option value="company-asc">Company (A - Z)</option>
                <option value="company-desc">Company (Z - A)</option>
                <option value="role-asc">Role Title (A - Z)</option>
                <option value="match-desc">Match Score (Highest)</option>
              </select>
            </div>

            {/* Job Type Dropdown */}
            <div className="control-field">
              <label htmlFor="job-type-filter" className="control-label">
                <Briefcase size={14} />
                <span>Type:</span>
              </label>
              <select
                id="job-type-filter"
                className="control-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="Internship">Internship Only</option>
                <option value="Full-time">Full-time Only</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle: Grid vs. Table */}
          <div className="view-mode-toggle" aria-label="View Mode">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
              aria-label="Grid Card View"
            >
              <LayoutGrid size={16} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Compact Table View"
              aria-label="Compact Table View"
            >
              <List size={16} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Reset Toolbar */}
      <div className="results-summary-row">
        <span className="results-count">
          Showing <strong>{sortedApplications.length}</strong> of <strong>{applications.length}</strong> applications
          {selectedStatus !== 'ALL' && ` in "${selectedStatus}"`}
        </span>
        {isFiltered && (
          <button 
            type="button" 
            className="btn-ghost reset-link-btn" 
            onClick={handleResetFilters}
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Main Applications Content Display */}
      {sortedApplications.length > 0 ? (
        viewMode === 'grid' ? (
          /* ================================================================
             CARD GRID VIEW
             ================================================================ */
          <div className="applications-grid">
            {sortedApplications.map((app) => {
              const deadlineUrgency = getDeadlineInfo(app.deadline);
              const skillsList = app.requiredSkills || app.skills || [];
              const link = app.applicationLink || app.jobUrl;

              return (
                <article key={app.id} className="card application-item-card">
                  {/* Card Header: Company, Role & Status */}
                  <div className="app-card-top">
                    <div className="company-info-block">
                      <div className="company-logo-pill">
                        {app.company ? app.company.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="company-titles">
                        <span className="company-name-text">{app.company}</span>
                        <h2 className="role-title-text">{app.role}</h2>
                      </div>
                    </div>
                    <div className="card-status-wrapper">
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  </div>

                  {/* Key Metadata Grid: Application Date, Deadline, Location, Type */}
                  <div className="app-metadata-grid">
                    {/* Application Date */}
                    <div className="meta-item">
                      <Clock size={15} className="meta-icon" />
                      <div>
                        <span className="meta-label">Applied:</span>
                        <strong className="meta-value">{formatDate(app.applicationDate || app.appliedDate)}</strong>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="meta-item">
                      <Calendar size={15} className="meta-icon" />
                      <div>
                        <span className="meta-label">Deadline:</span>
                        <strong className="meta-value">
                          {app.deadline ? formatDate(app.deadline) : 'No deadline'}
                        </strong>
                        {deadlineUrgency && (
                          <span className={`deadline-mini-tag ${deadlineUrgency.className}`}>
                            {deadlineUrgency.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="meta-item">
                      <MapPin size={15} className="meta-icon" />
                      <div>
                        <span className="meta-label">Location:</span>
                        <span className="meta-value">{app.location || 'Remote'}</span>
                      </div>
                    </div>

                    {/* Job Type & Compensation */}
                    <div className="meta-item">
                      <Briefcase size={15} className="meta-icon" />
                      <div>
                        <span className="meta-label">Type & Pay:</span>
                        <span className="meta-value">
                          {app.type || 'Internship'}
                          {app.salary && ` • ${app.salary}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills Section */}
                  <div className="skills-section">
                    <span className="skills-heading">Required Skills:</span>
                    <div className="app-skills-row">
                      {skillsList.length > 0 ? (
                        skillsList.map((skill) => (
                          <span 
                            key={skill} 
                            className="tag tag-accent clickable-skill-tag"
                            onClick={() => setSearchQuery(skill)}
                            title={`Click to filter by ${skill}`}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="no-skills-text">General Software Engineering</span>
                      )}
                    </div>
                  </div>

                  {/* Notes Preview */}
                  {app.notes && (
                    <div className="app-notes-preview">
                      <FileText size={14} className="notes-icon" />
                      <p className="notes-text">{app.notes}</p>
                    </div>
                  )}

                  {/* Card Footer: View Details, Edit, Delete, Link */}
                  <div className="app-card-footer">
                    <div className="footer-left">
                      <button
                        type="button"
                        className="btn btn-secondary btn-ghost action-mini-btn"
                        onClick={() => setDetailsApp(app)}
                        title="View Full Details"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-ghost action-mini-btn"
                        onClick={() => handleOpenEdit(app)}
                        title="Edit Application"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="footer-right">
                      {link && (
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-secondary btn-ghost job-link-btn"
                          title="Open original job posting"
                        >
                          <span>Posting</span>
                          <ExternalLink size={13} />
                        </a>
                      )}

                      <button
                        type="button"
                        className="delete-app-btn"
                        onClick={() => handleDelete(app)}
                        title="Delete application"
                        aria-label={`Delete ${app.role}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ================================================================
             COMPACT TABLE VIEW
             ================================================================ */
          <div className="card table-container-card">
            <div className="table-responsive">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company &amp; Role</th>
                    <th>Status</th>
                    <th>Application Date</th>
                    <th>Deadline</th>
                    <th>Required Skills</th>
                    <th className="th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApplications.map((app) => {
                    const deadlineUrgency = getDeadlineInfo(app.deadline);
                    const skillsList = app.requiredSkills || app.skills || [];
                    const link = app.applicationLink || app.jobUrl;

                    return (
                      <tr key={app.id} className="table-row">
                        {/* Company & Role */}
                        <td className="td-company-role">
                          <div className="table-company-cell">
                            <div className="table-avatar">
                              {app.company ? app.company.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <div className="table-role-title">{app.role}</div>
                              <div className="table-company-sub">
                                <span>{app.company}</span>
                                {app.type && <span className="type-badge-mini">{app.type}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="td-status">
                          <StatusBadge status={app.status} size="sm" />
                        </td>

                        {/* Application Date */}
                        <td className="td-date">
                          <div className="date-cell">
                            <Clock size={13} className="text-muted-icon" />
                            <span>{formatDate(app.applicationDate || app.appliedDate)}</span>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="td-deadline">
                          <div className="deadline-cell">
                            <Calendar size={13} className="text-muted-icon" />
                            <span>{app.deadline ? formatDate(app.deadline) : 'None'}</span>
                            {deadlineUrgency && (
                              <span className={`deadline-mini-tag ${deadlineUrgency.className}`}>
                                {deadlineUrgency.label}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Required Skills */}
                        <td className="td-skills">
                          <div className="table-skills-list">
                            {skillsList.slice(0, 3).map((skill) => (
                              <span 
                                key={skill} 
                                className="tag tag-accent table-tag clickable-skill-tag"
                                onClick={() => setSearchQuery(skill)}
                                title={`Click to filter by ${skill}`}
                              >
                                {skill}
                              </span>
                            ))}
                            {skillsList.length > 3 && (
                              <span className="skills-more-badge">+{skillsList.length - 3}</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="td-actions">
                          <div className="table-actions-cell">
                            <button
                              type="button"
                              className="table-icon-btn"
                              onClick={() => setDetailsApp(app)}
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              className="table-icon-btn"
                              onClick={() => handleOpenEdit(app)}
                              title="Edit Application"
                            >
                              <Edit3 size={15} />
                            </button>
                            {link && (
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="table-icon-btn"
                                title="Open Job Link"
                              >
                                <ExternalLink size={15} />
                              </a>
                            )}
                            <button
                              type="button"
                              className="table-icon-btn delete-btn"
                              onClick={() => handleDelete(app)}
                              title="Delete application"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="card empty-state-card">
          <div className="empty-state-icon">
            <Search size={36} />
          </div>
          <h3 className="empty-state-title">No applications found</h3>
          <p className="empty-state-desc">
            {searchQuery 
              ? `No tracked opportunities matched "${searchQuery}" with the current filters.`
              : 'You have no applications in this view.'}
          </p>
          <div className="empty-state-actions">
            {isFiltered ? (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            ) : null}
            <Link to="/add-application" className="btn btn-primary">
              <Plus size={16} />
              <span>Track New Application</span>
            </Link>
          </div>
        </div>
      )}

      {/* ================================================================
         DETAILS MODAL
         ================================================================ */}
      {detailsApp && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setDetailsApp(null)}>
          <div className="modal-card details-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-titles">
                <span className="modal-company-name">{detailsApp.company}</span>
                <h2 className="modal-title">{detailsApp.role}</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setDetailsApp(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="details-status-row">
                <span className="details-label">Pipeline Status:</span>
                <StatusBadge status={detailsApp.status} />
              </div>

              <div className="details-meta-grid">
                <div className="details-meta-box">
                  <Clock size={16} className="details-meta-icon" />
                  <div>
                    <span className="details-meta-heading">Application Date</span>
                    <strong className="details-meta-text">
                      {formatDate(detailsApp.applicationDate || detailsApp.appliedDate)}
                    </strong>
                  </div>
                </div>

                <div className="details-meta-box">
                  <Calendar size={16} className="details-meta-icon" />
                  <div>
                    <span className="details-meta-heading">Deadline</span>
                    <strong className="details-meta-text">
                      {detailsApp.deadline ? formatDate(detailsApp.deadline) : 'None'}
                    </strong>
                  </div>
                </div>

                <div className="details-meta-box">
                  <MapPin size={16} className="details-meta-icon" />
                  <div>
                    <span className="details-meta-heading">Location</span>
                    <strong className="details-meta-text">
                      {detailsApp.location || 'Remote'}
                    </strong>
                  </div>
                </div>

                <div className="details-meta-box">
                  <DollarSign size={16} className="details-meta-icon" />
                  <div>
                    <span className="details-meta-heading">Compensation</span>
                    <strong className="details-meta-text">
                      {detailsApp.salary || 'Not specified'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="details-section">
                <span className="details-section-title">Required Skills</span>
                <div className="details-skills-wrap">
                  {(detailsApp.requiredSkills || detailsApp.skills || []).map((s) => (
                    <span key={s} className="tag tag-accent">{s}</span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {detailsApp.notes && (
                <div className="details-section">
                  <span className="details-section-title">Preparation Notes &amp; Activity</span>
                  <div className="details-notes-content">
                    <p>{detailsApp.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-footer-left">
                {(detailsApp.applicationLink || detailsApp.jobUrl) && (
                  <a
                    href={detailsApp.applicationLink || detailsApp.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <span>Open Application</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const target = detailsApp;
                    setDetailsApp(null);
                    handleOpenEdit(target);
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDetailsApp(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
         EDIT APPLICATION MODAL
         ================================================================ */}
      {editingApp && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setEditingApp(null)}>
          <div className="modal-card edit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-titles">
                <span className="modal-company-name">Edit Application</span>
                <h2 className="modal-title">{editingApp.role} at {editingApp.company}</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setEditingApp(null)}
                aria-label="Close edit"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body modal-scrollable">
                {/* Row 1: Company and Role */}
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Company Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${editErrors.company ? 'input-error' : ''}`}
                      value={editFormData.company}
                      onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      required
                    />
                    {editErrors.company && <span className="field-error-text">{editErrors.company}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Job Role <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${editErrors.role ? 'input-error' : ''}`}
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      required
                    />
                    {editErrors.role && <span className="field-error-text">{editErrors.role}</span>}
                  </div>
                </div>

                {/* Row 2: Status and Location */}
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Status <span className="required-star">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / Work Model</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      placeholder="e.g. Remote, San Francisco, CA"
                    />
                  </div>
                </div>

                {/* Row 3: Application Date and Deadline */}
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Application Date <span className="required-star">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input ${editErrors.applicationDate ? 'input-error' : ''}`}
                      value={editFormData.applicationDate}
                      onChange={(e) => setEditFormData({ ...editFormData, applicationDate: e.target.value })}
                      required
                    />
                    {editErrors.applicationDate && (
                      <span className="field-error-text">{editErrors.applicationDate}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className={`form-input ${editErrors.deadline ? 'input-error' : ''}`}
                      value={editFormData.deadline}
                      onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                    />
                    {editErrors.deadline && (
                      <span className="field-error-text">{editErrors.deadline}</span>
                    )}
                  </div>
                </div>

                {/* Row 4: Link and Salary */}
                <div className="modal-form-row">
                  <div className="form-group">
                    <label className="form-label">Application Link</label>
                    <input
                      type="url"
                      className={`form-input ${editErrors.applicationLink ? 'input-error' : ''}`}
                      value={editFormData.applicationLink}
                      onChange={(e) => setEditFormData({ ...editFormData, applicationLink: e.target.value })}
                      placeholder="https://company.com/job/123"
                    />
                    {editErrors.applicationLink && (
                      <span className="field-error-text">{editErrors.applicationLink}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pay / Stipend</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editFormData.salary}
                      onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                      placeholder="e.g. $45/hr"
                    />
                  </div>
                </div>

                {/* Row 5: Required Skills */}
                <div className="form-group">
                  <label className="form-label">
                    Required Skills (Comma-separated) <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${editErrors.skillsInput ? 'input-error' : ''}`}
                    value={editFormData.skillsInput}
                    onChange={(e) => setEditFormData({ ...editFormData, skillsInput: e.target.value })}
                    placeholder="e.g. React, Python, SQL, Git"
                    required
                  />
                  {editErrors.skillsInput && (
                    <span className="field-error-text">{editErrors.skillsInput}</span>
                  )}
                </div>

                {/* Row 6: Notes */}
                <div className="form-group">
                  <label className="form-label">Notes &amp; Recruiter Contacts</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    placeholder="Referral names, preparation topics, questions asked, etc."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingApp(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
