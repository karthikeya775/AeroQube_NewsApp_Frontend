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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
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
  const [formError, setFormError] = useState('');

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (isAuthenticated === 'true' && token && user.role) {
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
        case 'superadmin':
          navigate('/superadmin-portal', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous error
    try {
      const response = await authService.login(formData);

      // Check for error in response
      if (!response || !response.data) {
        const msg = 'Invalid response from server';
        setFormError(msg);
        toast.error(msg);
        return;
      }
      if (response.success === false || response.status === 'error') {
        const msg = response.message || 'Login failed. Please check your credentials.';
        setFormError(msg);
        toast.error(msg);
        return;
      }

      const { token, user } = response.data;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);

      if (user.role !== role) {
        const msg = `Invalid role. You are not authorized as ${role}`;
        setFormError(msg);
        toast.error(msg);
        return;
      }

      if (!user.isVerified) {
        const msg = 'Please verify your email first';
        setFormError(msg);
        toast.error(msg);
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
        case 'superadmin':
          navigate('/superadmin-portal', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials.';
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getFormattedRole = () => {
    console.log(role);
    if (!role || typeof role !== 'string') return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
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
                {formError && (
                  <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>
                    {formError}
                  </Typography>
                )}
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

                <Box textAlign="right" sx={{ mt: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setForgotOpen(true)}
                    sx={{ textTransform: 'none', color: 'primary.main' }}
                  >
                    Forgot Password?
                  </Button>
                </Box>

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

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => { setForgotOpen(false); setForgotMsg(''); setForgotError(''); setForgotEmail(''); }}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your email address. We'll send you a link to reset your password.
          </Typography>
          {forgotMsg && <Alert severity="success" sx={{ mb: 2 }}>{forgotMsg}</Alert>}
          {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            disabled={forgotLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setForgotOpen(false); setForgotMsg(''); setForgotError(''); setForgotEmail(''); }} disabled={forgotLoading}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setForgotMsg(''); setForgotError('');
              if (!forgotEmail) { setForgotError('Please enter your email.'); return; }
              setForgotLoading(true);
              try {
                await authService.forgotPassword(forgotEmail);
                setForgotMsg('Password reset link sent! Please check your email.');
              } catch (err) {
                setForgotError(err?.message || 'Failed to send reset link.');
              } finally {
                setForgotLoading(false);
              }
            }}
            disabled={forgotLoading}
            variant="contained"
          >
            {forgotLoading ? <CircularProgress size={22} /> : 'Send Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoleBasedLogin;
