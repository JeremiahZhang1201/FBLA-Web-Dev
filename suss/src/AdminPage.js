import React from 'react';
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useJobs } from './JobContext';
import { useAuth0 } from '@auth0/auth0-react';
import { ADMIN_EMAILS } from './config';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const { jobs, approveJob, deleteJob } = useJobs();
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  if (!isAuthenticated || !user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography variant="h6">You must be logged in as an admin to view this page.</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Admin Panel
      </Typography>
      <Button variant="outlined" onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </Button>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}>
                  {job.company}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {job.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Location: {job.location}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!job.isApproved && (
                    <Button variant="contained" onClick={() => approveJob(job.id)}>
                      Approve
                    </Button>
                  )}
                  <Button variant="outlined" color="error" onClick={() => deleteJob(job.id)}>
                    Delete
                  </Button>
                </Box>
                {job.isApproved && (
                  <Typography variant="caption" color="green" sx={{ mt: 1 }}>
                    Approved
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
}
