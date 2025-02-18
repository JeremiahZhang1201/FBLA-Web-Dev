// src/SubmitPostingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, TextField, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useJobs } from './JobContext';

export default function SubmitPostingPage() {
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coursesWanted, setCoursesWanted] = useState('');
  const [minGPA, setMinGPA] = useState('');
  const [intendedMajor, setIntendedMajor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && company && description && location) {
      await addJob(title, company, description, location, coursesWanted, minGPA, intendedMajor);
      alert('Job posting submitted!');
      navigate('/jobs');
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Create a Job Posting
        </Typography>
      </motion.div>
      <Card
        component={motion.div}
        sx={{ mt: 3, p: 3, borderRadius: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Job Details
            </Typography>
            <TextField
              label="Job Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Company"
              variant="outlined"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Job Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />

            <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
              Candidate Requirements
            </Typography>
            <TextField
              label="Courses Wanted/Required"
              variant="outlined"
              value={coursesWanted}
              onChange={(e) => setCoursesWanted(e.target.value)}
              fullWidth
            />
            <TextField
              label="Minimum GPA"
              variant="outlined"
              value={minGPA}
              onChange={(e) => setMinGPA(e.target.value)}
              fullWidth
            />
            <TextField
              label="Intended Major"
              variant="outlined"
              value={intendedMajor}
              onChange={(e) => setIntendedMajor(e.target.value)}
              fullWidth
            />

            <motion.div whileHover={{ scale: 1.02 }}>
              <Button variant="contained" type="submit" fullWidth sx={{ py: 1.5 }}>
                Submit Posting
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
