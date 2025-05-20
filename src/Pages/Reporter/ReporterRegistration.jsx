import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReporterRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const applicants = JSON.parse(localStorage.getItem('reporterApplicants') || '[]');
      
      // Check if email already exists
      if (applicants.some(a => a.email === formData.email)) {
        toast.error('Email already registered!');
        return;
      }

      // Create new applicant
      const newApplicant = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'applicant',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      applicants.push(newApplicant);
      localStorage.setItem('reporterApplicants', JSON.stringify(applicants));

      toast.success('Registration successful! Please login.');
      navigate('/reporter-application');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center' }}>
        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Create Account
            </Typography>
            <Typography color="text.secondary" align="center" paragraph>
              Register to apply as a reporter
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                margin="normal"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
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
                label="Phone Number"
                name="phone"
                margin="normal"
                required
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                required
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
              >
                Register
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />
            
            <Box textAlign="center">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/reporter-application')}
                fullWidth
              >
                Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ReporterRegistration;