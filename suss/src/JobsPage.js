// src/JobsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useJobs } from './JobContext';
import { useAuth } from './FirebaseAuthContext';
import FilterBar from './FilterBar';

export default function JobsPage() {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isStudent, setIsStudent] = useState(false);

  // Example user data (in real usage, fetch from server or store in context)
  const [studentData, setStudentData] = useState({
    gpa: '',
    courses: [],
    preferredRoles: [],
  });

  useEffect(() => {
    // Show only approved jobs by default
    const approved = jobs.filter((j) => j.isApproved);
    setFilteredJobs(approved);

    if (user?.role === 'student') {
      setIsStudent(true);
      // If you have user details in your DB, fetch them here
      // e.g. GET /users/:firebaseUid
      // For simplicity, let's say user object already has them
      if (user.gpa || user.courses || user.preferredRoles) {
        setStudentData({
          gpa: user.gpa || '',
          courses: user.courses || [],
          preferredRoles: user.preferredRoles || [],
        });
      }
    }
  }, [jobs, user]);

  const handleFilter = ({ location, minSalary, maxSalary, myMatches }) => {
    let newList = jobs.filter((j) => j.isApproved);

    // 1) Location substring
    if (location.trim()) {
      const locLower = location.trim().toLowerCase();
      newList = newList.filter((job) =>
        job.location?.toLowerCase().includes(locLower)
      );
    }

    // 2) Salary range
    const parseNumericSalary = (salString) => {
      const match = salString.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };
    if (minSalary) {
      const minVal = parseFloat(minSalary);
      if (!isNaN(minVal)) {
        newList = newList.filter((job) => {
          const val = parseNumericSalary(job.salary || '');
          return val >= minVal;
        });
      }
    }
    if (maxSalary) {
      const maxVal = parseFloat(maxSalary);
      if (!isNaN(maxVal)) {
        newList = newList.filter((job) => {
          const val = parseNumericSalary(job.salary || '');
          return val <= maxVal;
        });
      }
    }

    // 3) My Matches
    if (myMatches && isStudent) {
      const userGpa = parseFloat(studentData.gpa) || 0;
      const userCourses = studentData.courses.map((c) => c.toLowerCase());
      const userRoles = studentData.preferredRoles.map((r) => r.toLowerCase());

      newList = newList.filter((job) => {
        let passGpa = true;
        if (job.minGPA) {
          const jobGpa = parseFloat(job.minGPA) || 0;
          passGpa = userGpa >= jobGpa;
        }

        let passCourses = true;
        if (job.coursesWanted?.length > 0) {
          const jobCoursesLower = job.coursesWanted.map((jc) => jc.toLowerCase());
          const intersection = jobCoursesLower.filter((jc) => userCourses.includes(jc));
          // for a match, we require at least 1 course in common (or your own logic)
          passCourses = intersection.length > 0;
        }

        let passRoles = true;
        if (job.rolesWanted?.length > 0) {
          const jobRolesLower = job.rolesWanted.map((jr) => jr.toLowerCase());
          const intersection = jobRolesLower.filter((jr) => userRoles.includes(jr));
          passRoles = intersection.length > 0;
        }

        return passGpa && passCourses && passRoles;
      });
    }

    setFilteredJobs(newList);
  };

  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Approved Job Postings
      </Typography>

      <FilterBar onFilter={handleFilter} />

      {filteredJobs.length === 0 && <Typography>No job postings found.</Typography>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
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
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Salary: {job.salary}
                </Typography>
                {job.rolesWanted?.length > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Roles Wanted: {job.rolesWanted.join(', ')}
                  </Typography>
                )}
                {job.coursesWanted?.length > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Courses Wanted: {job.coursesWanted.join(', ')}
                  </Typography>
                )}
                {job.minGPA && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Minimum GPA: {job.minGPA}
                  </Typography>
                )}
                {job.intendedMajor && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Intended Major: {job.intendedMajor}
                  </Typography>
                )}

                <Button
                  component={Link}
                  to={`/apply/${job._id}`}
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
