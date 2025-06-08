import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  useTheme
} from '@mui/material';
import { Users, UserCog, PenSquare, UserPlus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const roles = [
    {
      title: 'User',
      description: 'Read news articles and interact with content',
      icon: <Users size={44} />,
      role: 'user',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      bgColor: 'rgba(59,130,246,0.07)'
    },
    {
      title: 'Editor',
      description: 'Review and edit news articles before publication',
      icon: <Edit size={44} />,
      role: 'editor',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      bgColor: 'rgba(139,92,246,0.07)'
    },
    {
      title: 'Reporter',
      description: 'Create and manage news articles',
      icon: <PenSquare size={44} />,
      role: 'reporter',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      bgColor: 'rgba(16,185,129,0.07)'
    },
    {
      title: 'Admin',
      description: 'Manage content and users',
      icon: <UserCog size={44} />,
      role: 'admin',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      bgColor: 'rgba(239,68,68,0.07)'
    },
    {
      title: 'Apply as Reporter',
      description: 'Submit your application to join our news team',
      icon: <UserPlus size={44} />,
      role: 'user',
      path: '/reporter-application',
      color: '#F59E42',
      gradient: 'linear-gradient(135deg, #F59E42 0%, #FACC15 100%)',
      bgColor: 'rgba(245,158,66,0.07)'
    }
  ];

  const handleRoleSelect = (role, customPath) => {
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(`/rolebasedlogin?role=${role}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 4, md: 8 },
        background: `linear-gradient(120deg, #f0f4ff 0%, #f5f3ff 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1E293B',
              mb: 2,
              letterSpacing: '-1.5px',
              fontSize: { xs: '2.1rem', sm: '2.7rem', md: '3.2rem' },
              textShadow: '0 2px 16px rgba(59,130,246,0.08)'
            }}
          >
            📰 Welcome to NewsPortal
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#475569',
              fontWeight: 400,
              fontSize: { xs: '1.05rem', sm: '1.2rem' },
              mb: 1
            }}
          >
            Choose your role to get started
          </Typography>
        </Box>

        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={role.title}>
              <Card
                sx={{
                  minWidth: 240,
                  maxWidth: 320,
                  minHeight: 320,
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: { xs: 2.5, sm: 3.5 },
                  background: `rgba(255,255,255,0.7)`,
                  border: `1.5px solid ${role.color}25`,
                  borderRadius: '22px',
                  boxShadow: `0 8px 40px ${role.color}18, 0 1.5px 8px ${role.color}08`,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: `0 14px 48px ${role.color}32`,
                    background: `rgba(255,255,255,0.84)`
                  }
                }}
              >
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: role.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mb: 2.5,
                    boxShadow: `0 6px 18px ${role.color}60`,
                    fontSize: '2.3rem',
                    border: `3px solid #fff`,
                    mx: 'auto'
                  }}
                >
                  {role.icon}
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1E293B',
                    mb: 1,
                    fontSize: { xs: '1.2rem', sm: '1.35rem', md: '1.4rem' }
                  }}
                >
                  {role.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#475569',
                    mb: 3,
                    px: 1,
                    flexGrow: 1,
                    fontSize: { xs: '0.98rem', sm: '1.05rem' }
                  }}
                >
                  {role.description}
                </Typography>

                <Button
                  onClick={() => handleRoleSelect(role.role, role.path)}
                  variant="contained"
                  fullWidth
                  sx={{
                    background: role.gradient,
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    py: 1.3,
                    fontSize: '1.08rem',
                    letterSpacing: '0.01em',
                    boxShadow: '0 1.5px 8px rgba(30,54,120,0.06)',
                    transition: 'all 0.18s',
                    '&:hover': {
                      opacity: 0.96,
                      background: role.gradient,
                      transform: 'scale(1.04)'
                    }
                  }}
                >
                  {role.path ? '✨ Apply Now' : `🚀 Login as ${role.title}`}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 7 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: { xs: '1rem', sm: '1.08rem' },
              letterSpacing: '0.03em'
            }}
          >
            🌟 Your trusted source for news and information 🌟
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
