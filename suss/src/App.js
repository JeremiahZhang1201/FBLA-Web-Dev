import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './JobContext';
import NavigationBar from './NavigationBar';
import HomePage from './HomePage';
import SubmitPostingPage from './SubmitPostingPage';
import AdminPage from './AdminPage';
import JobsPage from './JobsPage';
import ApplyPage from './ApplyPage';
import MyApplicationsPage from './MyApplicationsPage';

export default function App() {
  return (
    <JobProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPostingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/apply/:jobId" element={<ApplyPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
        </Routes>
      </Router>
    </JobProvider>
  );
}
