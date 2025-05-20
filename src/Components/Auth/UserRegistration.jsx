import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    categories: [],
    languages: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }
      setStep(2);
    } else {
      try {
        // Create complete user data with all necessary fields
        const userData = {
          id: Date.now().toString(),
          name: formData.fullName, // Add name field
          email: formData.email,
          phone: formData.phone,
          role: 'user',
          preferences: preferences, // Add preferences
          createdAt: new Date().toISOString()
        };

        // Save to users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));

        // Set authentication data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('currentUser', JSON.stringify(userData)); // Save complete user data

        toast.success('Registration successful!');
        navigate('/user/dashboard');
      } catch (error) {
        toast.error('Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    }
  };

  if (step === 2) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2
      }}>
        <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack alignItems="center" spacing={2} mb={4}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                <UserPlus size={30} />
              </Avatar>
              <Typography variant="h4" component="h1">
                Create Account
              </Typography>
              <Typography color="text.secondary">
                Fill in your details to create an account
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box textAlign="center">
              <Typography variant="body2" sx={{ mb: 1 }}>
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/rolebasedlogin?role=user')}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.100',
      p: 2
    }}>
      <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={2} mb={4}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
              <UserPlus size={30} />
            </Avatar>
            <Typography variant="h4" component="h1">
              Create Account
            </Typography>
            <Typography color="text.secondary">
              Fill in your details to create an account
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
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
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" sx={{ mb: 1 }}>
              Already have an account?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/rolebasedlogin?role=user')}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserRegistration;