import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Trophy, 
  ArrowRight, 
  Calendar, 
  Plus, 
  Clock,
  BookmarkCheck,
  Layers,
  AlertCircle,
  FileText,
  PieChart,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { useApplications } from '../context/ApplicationContext';
import './Dashboard.css';

/**
 * Dashboard Page
 * Real-time Career & Internship tracking dashboard.
 * All metrics, status breakdowns, deadlines, and recent activities
 * are dynamically calculated from the single centralized application data store.
 */
export default function Dashboard() {
  const { applications, stats } = useApplications();

  // Sort applications by applicationDate descending for the Recent Applications section
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(a.applicationDate || a.appliedDate || 0);
        const dateB = new Date(b.applicationDate || b.appliedDate || 0);
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [applications]);

  // Extract applications with upcoming deadlines, sorted by earliest deadline
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return applications
      .filter((app) => Boolean(app.deadline))
      .map((app) => {
        const deadlineDate = new Date(app.deadline + 'T00:00:00');
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let urgencyType = 'normal';
        let label = `In ${diffDays}d`;
        let isUrgent = false;

        if (diffDays < 0) {
          urgencyType = 'passed';
          label = `${Math.abs(diffDays)}d overdue`;
        } else if (diffDays === 0) {
          urgencyType = 'urgent';
          label = 'Due Today';
          isUrgent = true;
        } else if (diffDays <= 3) {
          urgencyType = 'urgent';
          label = `Due in ${diffDays}d`;
          isUrgent = true;
        } else if (diffDays <= 7) {
          urgencyType = 'upcoming';
          label = `In ${diffDays}d`;
        }

        return {
          ...app,
          diffDays,
          urgencyType,
          urgencyLabel: label,
          isUrgent
        };
      })
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 5);
  }, [applications]);

  // Helper function to format deadline date cleanly
  const formatDeadlineDate = (dateStr) => {
    if (!dateStr) return { month: 'N/A', day: '--', full: 'No date' };
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const full = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return { month, day, full };
    } catch {
      return { month: 'DATE', day: '01', full: dateStr };
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Career Pipeline Dashboard</h1>
          <p className="page-subtitle">
            Real-time analytics and tracking for your job and internship opportunities.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add-application" className="btn btn-primary">
            <Plus size={18} />
            <span>Track Application</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards: 5 KPI Metrics */}
      <section className="metrics-grid" aria-label="Application Summary Metrics">
        <MetricCard
          title="Total Applications"
          value={stats.total}
          icon={<Briefcase size={20} />}
          subtitle={`${stats.activeTotal} active in pipeline`}
          trend="neutral"
          variant="total"
        />
        <MetricCard
          title="Applied"
          value={stats.applied}
          icon={<Clock size={20} />}
          subtitle={`${stats.rates.applied}% of pipeline`}
          trend="neutral"
          variant="applied"
        />
        <MetricCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={<BookmarkCheck size={20} />}
          subtitle={`${stats.rates.shortlisted}% screening rate`}
          trend="highlight"
          variant="shortlisted"
        />
        <MetricCard
          title="Interviews"
          value={stats.interviews}
          icon={<Users size={20} />}
          subtitle={`${stats.interviews} active candidate rounds`}
          trend="highlight"
          variant="interviews"
        />
        <MetricCard
          title="Selected"
          value={stats.selected}
          icon={<Trophy size={20} />}
          subtitle={`${stats.selected} offer / acceptance`}
          trend="highlight"
          variant="selected"
        />
      </section>

      {/* Section 1: Application Status (Funnel & Stage Breakdown Chart) */}
      <section className="card status-section-card" aria-label="Applications by Status">
        <div className="card-header">
          <div>
            <div className="section-title-with-badge">
              <h2 className="card-title">Applications by Status</h2>
              <span className="status-overview-pill">
                <Layers size={14} />
                <span>{stats.activeTotal} Active • {stats.selected} Selected • {stats.rejected} Closed</span>
              </span>
            </div>
            <p className="card-subtitle-text">
              Real-time pipeline breakdown from submission through interview rounds to offer confirmation
            </p>
          </div>
          <Link to="/applications" className="btn btn-ghost see-all-link">
            <span>View All Applications</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Visual Pipeline Stacked Progress Bar (Chart) */}
        <div className="status-funnel-container" aria-label="Status Distribution Bar Chart">
          <div className="status-funnel-bar">
            {stats.statusDistribution.map((item) => {
              if (item.count === 0) return null;
              return (
                <div 
                  key={item.label}
                  className={`funnel-segment ${item.bgClass}`} 
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Stage Cards Grid */}
        <div className="status-stages-grid">
          <div className="stage-box stage-applied">
            <div className="stage-header-row">
              <span className="stage-indicator-pill">
                <span className="stage-dot dot-applied"></span>
                <span>Applied</span>
              </span>
              <span className="stage-count-badge badge-applied">{stats.applied}</span>
            </div>
            <div className="stage-metric-row">
              <span className="stage-count">{stats.applied}</span>
              <span className="stage-rate">({stats.rates.applied}%)</span>
            </div>
            <p className="stage-desc">Submitted and awaiting screening</p>
          </div>

          <div className="stage-box stage-shortlisted">
            <div className="stage-header-row">
              <span className="stage-indicator-pill">
                <span className="stage-dot dot-shortlisted"></span>
                <span>Shortlisted</span>
              </span>
              <span className="stage-count-badge badge-shortlisted">{stats.shortlisted}</span>
            </div>
            <div className="stage-metric-row">
              <span className="stage-count">{stats.shortlisted}</span>
              <span className="stage-rate">({stats.rates.shortlisted}%)</span>
            </div>
            <p className="stage-desc">Cleared resume filter, recruiter review</p>
          </div>

          <div className="stage-box stage-interviews">
            <div className="stage-header-row">
              <span className="stage-indicator-pill">
                <span className="stage-dot dot-interviews"></span>
                <span>Interview</span>
              </span>
              <span className="stage-count-badge badge-interviews">{stats.interviews}</span>
            </div>
            <div className="stage-metric-row">
              <span className="stage-count">{stats.interviews}</span>
              <span className="stage-rate">({stats.rates.interviews}%)</span>
            </div>
            <p className="stage-desc">Technical tests &amp; live interviews</p>
          </div>

          <div className="stage-box stage-selected">
            <div className="stage-header-row">
              <span className="stage-indicator-pill">
                <span className="stage-dot dot-selected"></span>
                <span>Selected</span>
              </span>
              <span className="stage-count-badge badge-selected">{stats.selected}</span>
            </div>
            <div className="stage-metric-row">
              <span className="stage-count">{stats.selected}</span>
              <span className="stage-rate">({stats.rates.selected}%)</span>
            </div>
            <p className="stage-desc">Offers received &amp; placements confirmed</p>
          </div>

          <div className="stage-box stage-rejected">
            <div className="stage-header-row">
              <span className="stage-indicator-pill">
                <span className="stage-dot dot-rejected"></span>
                <span>Rejected</span>
              </span>
              <span className="stage-count-badge badge-rejected">{stats.rejected}</span>
            </div>
            <div className="stage-metric-row">
              <span className="stage-count">{stats.rejected}</span>
              <span className="stage-rate">({stats.rates.rejected}%)</span>
            </div>
            <p className="stage-desc">Positions closed or unselected</p>
          </div>
        </div>
      </section>

      {/* Two-Column Grid: Left: Recent Applications, Right: Upcoming Deadlines */}
      <div className="dashboard-main-grid">
        {/* Left Column: Recent Applications */}
        <section className="card recent-apps-card" aria-label="Recent Applications">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Applications</h2>
              <p className="card-subtitle-text">Latest opportunities logged into your pipeline</p>
            </div>
            <Link to="/applications" className="btn btn-ghost see-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="recent-apps-list">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="recent-app-item">
                  <div className="app-company-avatar">
                    {app.company ? app.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="app-details">
                    <h3 className="app-role-title">{app.role}</h3>
                    <div className="app-meta-row">
                      <span className="app-company-name">{app.company}</span>
                      <span className="meta-separator">•</span>
                      <span className="app-location">{app.location || 'Remote'}</span>
                      {app.type && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="type-badge-mini">{app.type}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="app-status-column">
                    <StatusBadge status={app.status} size="sm" />
                    <span className="app-date-applied">
                      <Clock size={12} />
                      {app.applicationDate || app.appliedDate}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-substate-box">
                <p>No applications logged yet.</p>
                <Link to="/add-application" className="btn btn-primary btn-sm">
                  Track Your First Application
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Upcoming Deadlines */}
        <section className="card deadlines-card" aria-label="Upcoming Deadlines">
          <div className="card-header">
            <div>
              <h2 className="card-title">Upcoming Deadlines</h2>
              <p className="card-subtitle-text">Interview dates, coding assessments &amp; offer cutoffs</p>
            </div>
            <Calendar size={18} className="calendar-header-icon" />
          </div>

          <div className="deadlines-list">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((app) => {
                const dateInfo = formatDeadlineDate(app.deadline);

                return (
                  <div key={app.id} className="deadline-item">
                    <div className="deadline-date-badge">
                      <span className="date-month">{dateInfo.month}</span>
                      <span className="date-day">{dateInfo.day}</span>
                    </div>

                    <div className="deadline-details">
                      <h3 className="deadline-role">{app.role}</h3>
                      <div className="deadline-meta">
                        <span className="deadline-company">{app.company}</span>
                        {app.notes && (
                          <p className="deadline-note-text" title={app.notes}>
                            {app.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="deadline-action-col">
                      <span className={`deadline-tag ${app.urgencyType}`}>
                        {app.isUrgent && <AlertCircle size={11} />}
                        {app.urgencyLabel}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-substate-box">
                <Calendar size={28} className="empty-icon" />
                <p>No upcoming deadlines recorded.</p>
                <Link to="/add-application" className="btn btn-secondary btn-sm">
                  Add Application with Deadline
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
