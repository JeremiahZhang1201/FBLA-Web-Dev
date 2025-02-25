// src/FeatureCarousel.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  useTheme,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    title: 'Search Job Postings',
    description: 'Browse and search approved job postings tailored for SBHS students.',
  },
  {
    title: 'Submit Job Postings',
    description: 'Employers can easily submit job postings to reach top student talent.',
  },
  {
    title: 'Apply Seamlessly',
    description: 'Students enjoy a simple, user-friendly application process for their dream jobs.',
  },
  {
    title: 'Find the Perfect Fit',
    description: 'Discover opportunities that match your skills and aspirations.',
  },
  {
    title: 'Get School Support',
    description: 'Our guidance department ensures you have the resources you need.',
  },
  {
    title: 'Build Your Resume',
    description: 'Gain experience and bolster your resume for future success.',
  },
];

const CARD_COUNT = 3; // number of features to display at once

export default function FeatureCarousel() {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  // Returns the slice of features (wrapping around) for the current index
  const getVisibleFeatures = () => {
    const visible = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const featureIndex = (index + i) % features.length;
      visible.push(features[featureIndex]);
    }
    return visible;
  };

  const visibleFeatures = getVisibleFeatures();

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 1000,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: theme.palette.text.primary,
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: theme.palette.text.primary,
        }}
      >
        <ArrowForwardIos />
      </IconButton>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            {visibleFeatures.map((feat, i) => (
              <Grid item xs={12} md={4} key={`${feat.title}-${i}`}>
                <Card
                  sx={{
                    height: 300,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: '#0b5cff',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2">
                      {feat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
