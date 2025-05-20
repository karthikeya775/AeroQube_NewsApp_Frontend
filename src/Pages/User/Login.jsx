import React from 'react';
import { TextField, Button, Typography, Link as MuiLink, Box, styled } from '@mui/material';
import '../Styles/LoginPage.css'

// Styled components
const StyledTextField = styled(TextField)({
  backgroundColor: '#ffffff',
  borderRadius: 10,
  input: {
    padding: '12px',
  },
});

const LoginButton = styled(Button)({
  backgroundColor: '#fca311',
  color: 'white',
  borderRadius: 25,
  fontWeight: 'bold',
  padding: '10px',
  '&:hover': {
    backgroundColor: '#e59500',
  },
});

const handleSubmit = (event) => {
  event.preventDefault();
  // Logic here
  console.log("Form submitted");
};

const Login = () => {
  return (
    <Box className="login-page" sx={{ display: 'flex', height: '100vh' }}>
      {/* Left side with image */}
      <Box className="login-right" sx={{ width: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-in-6809425-5605276.png"
            alt="Analytics Illustration"
            style={{ maxWidth: '80%', height: 'auto' }}
          />
        </Box>
      </Box>

      {/* Right side with form */}
      <Box className="login-left" sx={{ width: '50%', backgroundColor: '#14213d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <Box className="login-box" sx={{ width: '75%', maxWidth: 400 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Hello!
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Welcome back!
          </Typography>
          <Typography sx={{ mb: 4 }}>
            Let's Login to Your Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography sx={{ mb: 1 }}>
              Username
            </Typography>
            <StyledTextField
              required
              fullWidth
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              sx={{ mb: 3 }}
            />

            <Typography sx={{ mb: 1 }}>
              Password
            </Typography>
            <StyledTextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />

            <LoginButton type="submit" fullWidth variant="contained">
              LOGIN
            </LoginButton>
          </Box>

          <Typography sx={{ mt: 2 }}>
            Don't have an account?
            <MuiLink href="#" sx={{ ml: 1, color: '#ffffff', textDecoration: 'underline' }}>
              Sign In now
            </MuiLink>
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 8,
            fontSize: '0.875rem',
          }}>
            <MuiLink href="#" sx={{ color: '#ffffff' }}>
              Privacy Policy
            </MuiLink>
            <MuiLink href="#" sx={{ color: '#ffffff' }}>
              Cookies Settings
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
