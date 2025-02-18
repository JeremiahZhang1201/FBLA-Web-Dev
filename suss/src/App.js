// src/App.js
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#666666' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default function App() {
  return (
    <JobProvider>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </JobProvider>
  );
}
