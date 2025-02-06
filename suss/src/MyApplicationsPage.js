import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function MyApplicationsPage() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      loginWithRedirect();
      return;
    }
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.sub),
      orderBy('appliedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
    });
    return () => unsubscribe();
  }, [isAuthenticated, user, loginWithRedirect]);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>
      {applications.length === 0 ? (
        <Typography>No applications found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {applications.map((app) => (
            <Card key={app.id} elevation={3}>
              <CardContent>
                <Typography variant="h6">{app.jobTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Applied on: {new Date(app.appliedAt.seconds * 1000).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Resume/Experience: {app.resume}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
