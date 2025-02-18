// src/MyApplicationsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useAuth } from './FirebaseAuthContext';

const API_URL = 'http://localhost:6969';

export default function MyApplicationsPage() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      loginWithGoogle();
      return;
    }
    const fetchApplications = async () => {
      try {
        const queryString = new URLSearchParams({ userId: user.uid }).toString();
        const response = await fetch(`${API_URL}/applications?${queryString}`);
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, [isAuthenticated, user, loginWithGoogle]);

  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        My Applications
      </Typography>
      {applications.length === 0 ? (
        <Typography>No applications found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {applications.map((app) => (
            <Card key={app._id} elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {app.jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">Resume/Experience: {app.resume}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
