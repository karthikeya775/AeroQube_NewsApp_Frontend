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
import { authService } from '../../services/auth.service';

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
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation - only letters, spaces, and hyphens
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = 'Name must contain only letters, spaces, or hyphens';
      isValid = false;
    } else {
      newErrors.fullName = '';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    // Then validate form fields
    if (!validateForm()) {
      toast.error('Please check the form for errors');
      return;
    }

    try {
      const userData = {
        name: formData.fullName.trim(), // Trim whitespace
        email: formData.email.trim(),
        password: formData.password,
        contact: formData.phone,
        role: 'user'
      };

      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success('Registration successful! Please login to submit your reporter application.');
        navigate('/reporter-application');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
                error={!!errors.fullName}
                helperText={errors.fullName}
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
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                margin="normal"
                required
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
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
                error={!!errors.password}
                helperText={errors.password}
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