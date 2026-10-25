import React from 'react';
import './StatusBadge.css';

/**
 * StatusBadge Component
 * Displays a color-coded status badge for job applications.
 * 
 * @param {string} status - "Applied" | "Interviewing" | "Offer" | "Rejected"
 * @param {string} size - "sm" | "md" (default "md")
 */
export default function StatusBadge({ status, size = 'md' }) {
  // Normalize the status string to match CSS class names
  const normalizedStatus = status ? status.toLowerCase() : 'applied';

  return (
    <span className={`status-badge status-${normalizedStatus} size-${size}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  );
}
