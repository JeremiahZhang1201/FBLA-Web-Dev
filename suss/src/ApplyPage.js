// src/ApplyPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, TextField, Button, Box } from '@mui/material';
import { useJobs } from './JobContext';
import { useAuth } from './FirebaseAuthContext';

const API_URL = 'http://localhost:6969'; // or fallback if needed

export default function ApplyPage() {
  const { jobs } = useJobs();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithGoogle } = useAuth();

  const job = jobs.find((j) => j._id === jobId && j.isApproved);
  const [studentName, setStudentName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [resume, setResume] = useState('');

  if (!job) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography>Job not found or not approved.</Typography>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </Container>
    );
  }

  if (!isAuthenticated) {
    loginWithGoogle();
    return null;
  }

  const handleApply = async (e) => {
    e.preventDefault();
    if (studentName && email && resume) {
      try {
        await fetch(`${API_URL}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job._id,
            jobTitle: job.title,
            userId: user.uid,
            userName: studentName,
            email,
            resume,
            appliedAt: new Date(),
          }),
        });
        alert(`Application submitted for ${job.title}!`);
        navigate('/jobs');
      } catch (error) {
        console.error('Error submitting application: ', error);
        alert('Error submitting application.');
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Apply for {job.title}
      </Typography>
      <Card sx={{ mt: 3, borderRadius: 2 }} elevation={3}>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleApply} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Your Name"
              variant="outlined"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <TextField
              label="Your Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Experience/Resume"
              variant="outlined"
              multiline
              rows={4}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Submit Application
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
