import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useJobs } from './JobContext';
import { GOOGLE_MAPS_API_KEY } from './config';

export default function JobsPage() {
  const { jobs } = useJobs();
  const approvedJobs = jobs.filter((job) => job.isApproved);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Approved Job Postings
      </Typography>
      {approvedJobs.length === 0 && (
        <Typography>No job postings available yet.</Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        {approvedJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="subtitle1">{job.company}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {job.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Location: {job.location}
                </Typography>
                {job.location && GOOGLE_MAPS_API_KEY && (
                  <Box sx={{ mt: 2 }}>
                    <iframe
                      title="Job Location Map"
                      width="100%"
                      height="200"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        job.location
                      )}`}
                      allowFullScreen
                    ></iframe>
                  </Box>
                )}
                <Button
                  component={Link}
                  to={`/apply/${job.id}`}
                  sx={{ mt: 2 }}
                  variant="contained"
                  size="small"
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
}
