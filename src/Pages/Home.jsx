import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid
} from '@mui/material';
import { Users, UserCog, PenSquare, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'User',
      description: 'Read news articles and interact with content',
      icon: <Users size={40} />,
      role: 'user',
      color: '#2196f3'
    },
    {
      title: 'Reporter',
      description: 'Create and manage news articles',
      icon: <PenSquare size={40} />,
      role: 'reporter',
      color: '#4caf50'
    },
    {
      title: 'Admin',
      description: 'Manage content and users',
      icon: <UserCog size={40} />,
      role: 'admin',
      color: '#f44336'
    },
    {
      title: 'Apply as Reporter',
      description: 'Submit your application to join our news team',
      icon: <UserPlus size={40} />,
      role: 'applicant',
      path: '/reporter-application',
      color: '#9c27b0'
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
    <Container maxWidth="lg">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Welcome to NewsPortal
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom textAlign="center" sx={{ mb: 6 }}>
          Select your role to continue
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={3} key={role.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4
                }}>
                  <Box sx={{ color: role.color, mb: 2 }}>
                    {role.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {role.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                    {role.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => handleRoleSelect(role.role, role.path)}
                    sx={{ 
                      mt: 'auto',
                      bgcolor: role.color,
                      '&:hover': {
                        bgcolor: role.color,
                        opacity: 0.9
                      }
                    }}
                  >
                    {role.path ? 'Apply Now' : `Login as ${role.title}`}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;