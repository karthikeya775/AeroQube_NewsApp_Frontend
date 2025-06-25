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
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/auth.service';

const ReporterApplicationLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        const userRole = response.data.user.role?.toLowerCase();
        console.log('User role:', userRole);

        // Handle different roles
        switch (userRole) {
          case 'reporter':
            toast.error('You are already a reporter');
            navigate('/reporter/dashboard');
            break;
          
          case 'admin':
          case 'superadmin':
            toast.success('Welcome Admin!');
            navigate('/admin/dashboard');
            break;

          case 'pending-reporter':
            toast.info('Your reporter application is pending review');
            navigate('/reporter-application/dashboard');
            break;

          default:
            // Normal user - can apply to become reporter
            toast.success('Login successful!');
            navigate('/reporter-application/dashboard');
            break;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
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
              Sign in to submit your application to become a reporter
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
                disabled={loading}
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
                disabled={loading}
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
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
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
                disabled={loading}
              >
                Create Account
              </Button>
            </Box>

            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/')}
              sx={{ mt: 3, color: 'text.secondary' }}
              fullWidth={false}
              disabled={loading}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ReporterApplicationLogin;