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

const setupDefaultUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if default users already exist
  const adminExists = users.some(u => u.role === 'admin');
  const reporterExists = users.some(u => u.role === 'reporter');

  if (!adminExists) {
    users.push({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@newsapp.com',
      password: 'admin123', // In a real app, use hashed passwords
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }

  if (!reporterExists) {
    users.push({
      id: 'reporter-1',
      name: 'Reporter User',
      email: 'reporter@newsapp.com',
      password: 'reporter123', // In a real app, use hashed passwords
      role: 'reporter',
      createdAt: new Date().toISOString()
    });
  }

  localStorage.setItem('users', JSON.stringify(users));
};

const RoleBasedLogin = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Call setupDefaultUsers when component mounts
  React.useEffect(() => {
    setupDefaultUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Update the find condition to check both email and password
    const user = users.find(u => 
      u.email === formData.email && 
      u.password === formData.password && // In a real app, use password hashing
      u.role === role
    );

    if (user) {
      // Store authentication data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast.success('Login successful!');
      
      // Navigate based on role
      switch (role) {
        case 'user':
          navigate('/user/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'reporter':
          navigate('/reporter/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error('Invalid credentials or user role!');
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
