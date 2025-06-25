import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import { Menu as MenuIcon, User, LogOut } from 'lucide-react';
import ReporterSideBar from '../../Components/Reporter/ReporterSideBar';
import ReporterDashboard from '../../Components/Reporter/ReporterDashboard';
import MySubmissions from '../../Components/Reporter/MySubmissions';
import ArticleSubmissionForm from '../../Components/Reporter/ArticleSubmissionForm';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const drawerWidth = 240;

const ReporterPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Use auth service to get user profile
        const response = await authService.getProfile();
        if (response.success) {
          setUserData({
            name: response.data.name || 'Unknown Reporter',
            email: response.data.email || '',
            avatar: response.data.profileImage || '',
            role: response.data.role || 'reporter'
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
        // Redirect to login if authentication fails
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    // Check for token before loading data
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [navigate]);

  const handleNavigation = (section) => {
    setCurrentSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      console.log('Logout successful');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout properly');
    } finally {
      handleUserMenuClose();
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <ReporterDashboard />;
      case "submissions":
        return <MySubmissions />;
      case "submit-article":
        return <ArticleSubmissionForm />;
      default:
        return <ReporterDashboard />;
    }
  };

  // Add loading state check
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: Logo + Drawer Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              onClick={() => handleNavigation('dashboard')}
              sx={{ 
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  opacity: 0.9,
                  transform: 'scale(1.01)',
                  transition: 'all 0.2s ease'
                }
              }}
            >
              ✦ Reporter Portal
            </Typography>
          </Box>

          {/* Right: Submit + Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <Button
                variant="contained"
                onClick={() => handleNavigation('submit-article')}
                sx={{
                  mr: 2,
                  backgroundColor: '#FFFFFF',
                  color: '#1E3A8A',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#F0F7FF',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                Submit New Article
              </Button>
            )}

            <IconButton 
              onClick={handleUserMenuOpen}
              sx={{
                p: 0.5,
                border: '2px solid rgba(255, 255, 255, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Avatar 
                src={userData.avatar}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#1E3A8A',
                  fontWeight: 'bold',
                  width: 38,
                  height: 38,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                {userData.name.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{ 
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: '10px',
                  minWidth: '180px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                onClick={handleUserMenuClose} 
                sx={{ 
                  gap: 1.5, 
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#F0F7FF'
                  }
                }}
              >
                <User size={18} color="#3B82F6" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>{userData.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{userData.email}</Typography>
                </Box>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  gap: 1.5, 
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#FEF2F2'
                  }
                }}
              >
                <LogOut size={18} color="#EF4444" />
                <Typography variant="body2" fontWeight={500}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
              borderRight: '1px solid rgba(59, 130, 246, 0.1)'
            },
          }}
        >
          <ReporterSideBar
            currentSection={currentSection}
            onNavigate={handleNavigation}
            closeMobileDrawer={() => setMobileOpen(false)}
          />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(59, 130, 246, 0.1)',
              background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
              boxShadow: '1px 0 10px rgba(0, 0, 0, 0.05)'
            },
          }}
          open
        >
          <Toolbar />
          <ReporterSideBar
            currentSection={currentSection}
            onNavigate={handleNavigation}
            closeMobileDrawer={() => {}}
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100vw - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9FAFB',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #EFF6FF 2%, transparent 0%), radial-gradient(circle at 75px 75px, #EFF6FF 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <Toolbar />
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: { xs: 1, sm: 2, md: 3 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94A3B8',
          }
        }}>
          <Container maxWidth="xl" sx={{ minHeight: '100%' }}>
            <Box 
              sx={{ 
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                p: { xs: 2, sm: 3 },
                mb: 3
              }}
            >
              <Box
                sx={{
                  minWidth: { xs: '100%', sm: 900 }
                }}
              >
                {renderCurrentSection()}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ReporterPanel;
