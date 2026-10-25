import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import AddApplication from './pages/AddApplication';
import JobMatch from './pages/JobMatch';
import LearningPlan from './pages/LearningPlan';

/**
 * Main Application Component
 * Sets up client-side declarative routing using React Router.
 * Wraps all 5 core portfolio pages within the consistent Layout shell
 * and provides centralized ApplicationContext state.
 */
export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          {/* Default Route: Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Page 2: Applications List */}
          <Route path="applications" element={<Applications />} />

          {/* Page 3: Track New Application Form */}
          <Route path="add-application" element={<AddApplication />} />

          {/* Page 4: AI Job Match Simulator */}
          <Route path="job-match" element={<JobMatch />} />

          {/* Page 5: Career & Learning Roadmap */}
          <Route path="learning-plan" element={<LearningPlan />} />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ApplicationProvider>
  );
}
