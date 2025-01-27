import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

// --- Material UI Imports ---
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// (Optional) For subtle animations
import { motion } from 'framer-motion';

/*********************
 * JOB CONTEXT
 *********************/
const JobContext = createContext();

function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]); // each job: {id, title, company, description, isApproved}

  // Add a new job
  const addJob = (title, company, description) => {
    const newJob = {
      id: Date.now().toString(),
      title,
      company,
      description,
      isApproved: false,
    };
    setJobs((prev) => [...prev, newJob]);
  };

  // Approve a job by id
  const approveJob = (id) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, isApproved: true } : job))
    );
  };

  // Delete a job by id
  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const value = {
    jobs,
    addJob,
    approveJob,
    deleteJob,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

function useJobs() {
  return useContext(JobContext);
}

/*********************
 * ADMIN CONTEXT
 *********************/
const AdminContext = createContext();

function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (password) => {
    // Basic check
    if (password === 'admin') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

function useAdmin() {
  return useContext(AdminContext);
}

/*********************
 * NAVIGATION BAR
 *********************/
function NavigationBar() {
  const { isAdmin } = useAdmin();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', gap: 3 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Guidance Dept
        </Typography>
        <Button component={Link} to="/submit" sx={{ color: 'white' }}>
          Submit
        </Button>
        <Button component={Link} to="/jobs" sx={{ color: 'white' }}>
          Jobs
        </Button>
        {isAdmin ? (
          <Button component={Link} to="/admin" sx={{ color: 'white' }}>
            Admin
          </Button>
        ) : (
          <Button component={Link} to="/admin-login" sx={{ color: 'white' }}>
            Admin Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

/*********************
 * HOME PAGE
 *********************/
function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Guidance Department Portal
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography variant="h6" color="text.secondary" paragraph>
          This is the ultimate platform to bridge students with amazing job opportunities from top employers.
          Our guidance department is dedicated to helping you succeed in your career goals. Explore postings,
          submit new opportunities, and take control of your future – all in one convenient place!
        </Typography>
      </motion.div>

      <motion.div
        style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button variant="contained" component={Link} to="/submit">
          Submit a Posting
        </Button>
        <Button variant="outlined" component={Link} to="/jobs">
          View Jobs
        </Button>
      </motion.div>
    </Container>
  );
}

/*********************
 * SUBMIT POSTING PAGE
 *********************/
function SubmitPostingPage() {
  const { addJob } = useJobs();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && company && description) {
      addJob(title, company, description);
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

/*********************
 * ADMIN LOGIN PAGE
 *********************/
function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Admin Login
      </Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Enter Admin Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

/*********************
 * ADMIN PAGE
 *********************/
function AdminPage() {
  const { jobs, approveJob, deleteJob } = useJobs();
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6">
          You must be logged in as admin to view this page.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin-login')}
        >
          Go to Admin Login
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Logout
      </Button>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card sx={{ p: 2 }} elevation={3}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="subtitle1">{job.company}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {job.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  {!job.isApproved && (
                    <Button
                      variant="contained"
                      onClick={() => approveJob(job.id)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </Box>
                {job.isApproved && (
                  <Typography
                    variant="caption"
                    color="green"
                    display="block"
                    sx={{ mt: 1 }}
                  >
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

/*********************
 * JOBS PAGE
 *********************/
function JobsPage() {
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

/*********************
 * APPLY PAGE
 *********************/
function ApplyPage() {
  const { jobs } = useJobs();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === jobId && j.isApproved);
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState('');

  if (!job) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Job not found or not approved.</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate('/jobs')}
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }

  const handleApply = (e) => {
    e.preventDefault();
    if (studentName && email && resume) {
      alert(`Application submitted for ${job.title}!`);
      navigate('/jobs');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h5" gutterBottom>
        Apply for {job.title}
      </Typography>
      <Card sx={{ mt: 2 }} elevation={3}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleApply}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
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
              label="Briefly Describe Your Experience or Paste Your Resume"
              variant="outlined"
              multiline
              rows={4}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            <Button variant="contained" type="submit">
              Submit Application
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

/*********************
 * MAIN APP
 *********************/
export default function App() {
  return (
    <AdminProvider>
      <JobProvider>
        <Router>
          {/* Navigation Bar at the top */}
          <NavigationBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitPostingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/apply/:jobId" element={<ApplyPage />} />
          </Routes>
        </Router>
      </JobProvider>
    </AdminProvider>
  );
}
