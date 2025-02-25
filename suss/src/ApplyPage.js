// src/ApplyPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, TextField, Button, Box } from '@mui/material';
import { useJobs } from './JobContext';
import { useAuth } from './FirebaseAuthContext';

const API_URL = 'http://localhost:6969'; // or your actual server

export default function ApplyPage() {
  const { jobs } = useJobs();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const job = jobs.find((j) => j._id === jobId && j.isApproved);
  const [studentName, setStudentName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null); // file upload

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
    navigate('/signup');
    return null;
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (studentName && email && (resumeText || resumeFile)) {
      try {
        const formData = new FormData();
        formData.append('jobId', job._id);
        formData.append('jobTitle', job.title);
        formData.append('userId', user.uid);
        formData.append('userName', studentName);
        formData.append('email', email);
        formData.append('resume', resumeText);
        if (resumeFile) {
          formData.append('resumeFile', resumeFile);
        }

        await fetch(`${API_URL}/applications`, {
          method: 'POST',
          body: formData,
        });

        alert(`Application submitted for ${job.title}!`);
        navigate('/jobs');
      } catch (error) {
        console.error('Error submitting application: ', error);
        alert('Error submitting application.');
      }
    } else {
      alert('Please fill out all required fields (name, email, and resume).');
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
              label="Additional Experience / Cover Letter"
              variant="outlined"
              multiline
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Upload Resume (PDF, DOC, etc.)
            </Typography>
            <Button variant="outlined" component="label">
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {resumeFile && <Typography>Selected File: {resumeFile.name}</Typography>}

            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Submit Application
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
