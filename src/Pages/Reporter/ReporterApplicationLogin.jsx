import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReporterApplicationLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get applicants from localStorage
    const applicants = JSON.parse(localStorage.getItem('reporterApplicants') || '[]');
    const applicant = applicants.find(a => a.email === formData.email);

    if (applicant && applicant.password === formData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'applicant');
      localStorage.setItem('currentUser', JSON.stringify(applicant));
      
      toast.success('Login successful!');
      navigate('/reporter-application/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 4
      }}>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Reporter Application Portal
            </Typography>
            <Typography color="text.secondary" align="center" paragraph>
              Sign in to check your application status or submit a new application
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                margin="normal"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                margin="normal"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
              >
                Sign In
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />
            
            <Box textAlign="center">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Don't have an account yet?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/reporter-application/register')}
                fullWidth
              >
                Create Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ReporterApplicationLogin;