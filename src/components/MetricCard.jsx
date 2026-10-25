import React from 'react';
import './MetricCard.css';

/**
 * MetricCard Component
 * Displays a single key summary performance metric on the Dashboard.
 * 
 * @param {string} title - Label for the metric
 * @param {string|number} value - Main numerical stat to display
 * @param {React.ReactNode} icon - Icon element to display in the badge
 * @param {string} subtitle - Contextual trend or information
 * @param {string} trend - Optional trend indicator ("up" | "neutral" | "highlight")
 * @param {string} variant - Optional color theme ("default" | "applied" | "shortlisted" | "interviews" | "selected")
 */
export default function MetricCard({ title, value, icon, subtitle, trend = 'neutral', variant = 'default' }) {
  return (
    <div className={`metric-card trend-${trend} variant-${variant}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className="metric-icon-wrapper">
          {icon}
        </div>
      </div>
      <div className="metric-body">
        <div className="metric-value">{value}</div>
        {subtitle && (
          <p className="metric-subtitle">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
