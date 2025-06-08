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
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';

const RoleBasedLogin = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData);
      const response = await authService.login(formData);
      console.log('Login Response:', response);

      // Check if response has the expected structure
      if (!response || !response.data) {
        toast.error('Invalid response from server');
        return;
      }

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);

      if (user.role !== role) {
        toast.error(`Invalid role. You are not authorized as ${role}`);
        return;
      }

      if (!user.isVerified) {
        toast.error('Please verify your email first');
        return;
      }

      toast.success('Login successful!');

      // Navigate based on role
      switch (user.role) {
        case 'user':
          navigate('/user/dashboard', { replace: true });
          break;
        case 'reporter':
          navigate('/reporter/dashboard', { replace: true });
          break;
        case 'editor':
          navigate('/editor/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  const getFormattedRole = () => {
    console.log(role);
    if (!role || typeof role !== 'string') return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

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
      <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={2} mb={4}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
              {role.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" component="h1">
              Welcome Back
            </Typography>
            <Typography color="text.secondary">
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Stack>
          </form>

          {role === 'user' && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box textAlign="center">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Don't have an account?
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate('/')}
        sx={{ mt: 3, color: 'text.secondary' }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default RoleBasedLogin;
