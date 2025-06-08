import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('verifytoken');
        if (!token) {
          setStatus('error');
          return;
        }

        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      {status === 'verifying' && (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
        </>
      )}
      {status === 'success' && (
        <Alert severity="success">
          Email verified successfully! Redirecting to login...
        </Alert>
      )}
      {status === 'error' && (
        <Alert severity="error">
          Failed to verify email. Please try again or contact support.
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification;