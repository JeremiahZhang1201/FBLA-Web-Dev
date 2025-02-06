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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && company && description && location) {
      await addJob(title, company, description, location);
      alert('Job posting submitted!');
      navigate('/jobs');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Submit a New Job Posting
        </Typography>
      </motion.div>
      <Card
        component={motion.div}
        sx={{ mt: 2, p: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Job Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Company"
              variant="outlined"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            />
            <TextField
              label="Job Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
            <TextField
              label="Job Location (e.g., address or city)"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
            <motion.div whileHover={{ scale: 1.01 }}>
              <Button variant="contained" type="submit" fullWidth>
                Submit
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
