import React, { useState } from 'react';
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
} from '@mui/material';
import { Menu as MenuIcon, User, LogOut } from 'lucide-react';
import ReporterSideBar from '../../Components/Reporter/ReporterSideBar';
import ReporterDashboard from '../../Components/Reporter/ReporterDashboard';
import MySubmissions from '../../Components/Reporter/MySubmissions';
import ArticleSubmissionForm from '../../Components/Reporter/ArticleSubmissionForm';
import { toast } from "sonner";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

const drawerWidth = 240;

const ReporterPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

   const handleNavigation = (path) => {
    navigate(path);
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

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    handleUserMenuClose();
    navigate('/'); // Add proper logout route
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

  const reporterName = "Sarah Johnson";

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 1
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
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
           <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                onClick={() => handleNavigation('/reporter/dashboard')}
                sx={{ 
                    fontWeight: 600,
                    cursor: 'pointer', // Add cursor pointer to indicate clickable
                    '&:hover': {
                    opacity: 0.8  // Add subtle hover effect
                    }
                }}
                >
                Reporter Portal
                </Typography>
          </Box>

          {/* Right: Submit + Avatar */}
           <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <Button
                variant="contained"
                color="black"
                onClick={() => handleNavigation('/reporter/submit')}
                sx={{
                    mr: 2,
                    backgroundColor: 'white',
                    color: 'black',
                    '&:hover': {
                    backgroundColor: '#999', // slightly lighter black on hover
                    },
                }}
              >
                Submit New Article
              </Button>
            )}

            <IconButton onClick={handleUserMenuOpen}>
              <Avatar sx={{ bgcolor: 'white', color: 'black' }}>
                {reporterName.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{ elevation: 3 }}
            >
              <MenuItem onClick={handleUserMenuClose} sx={{ gap: 1.5 }}>
                <User size={18} />
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
                <LogOut size={18} />
                <Typography variant="body2">Logout</Typography>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <ReporterSideBar
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
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          <Toolbar />
          <ReporterSideBar
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
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
          <Container maxWidth="xl" sx={{ minHeight: '100%' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Box
                sx={{
                  minWidth: { xs: '100%', sm: 900 }
                }}
              >
               <Routes>
                  <Route path="/" element={<Navigate to="/reporter/dashboard" replace />} />
                  <Route path="/dashboard" element={<ReporterDashboard />} />
                  <Route path="/submissions" element={<MySubmissions />} />
                  <Route path="/submit" element={<ArticleSubmissionForm />} />
                </Routes>

              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ReporterPanel;
