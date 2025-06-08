import React, { useState, useEffect } from "react";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  useTheme, 
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
  Chip,
  alpha,
  Fade,
  Backdrop
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Edit3,
  Sun,
  Moon
} from "lucide-react";
import Navigation from "./Navigation";
import Dashboard from "./Dashboard";
import PendingArticles from "./PendingArticles";
import EditHistory from "./EditHistory";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const drawerWidth = 300; // Keep consistent with Navigation component

const EditorPortal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Editor Name",
    email: "editor@newsapp.com",
    role: "Editor",
    avatar: null
  });

  const profileMenuOpen = Boolean(profileAnchorEl);
  const notificationMenuOpen = Boolean(notificationAnchorEl);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUserProfile({
          name: response.data.name || 'Editor',
          email: response.data.email || '',
          role: response.data.role || 'Editor',
          avatar: response.data.avatar || null
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/rolebasedlogin?role=editor');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
    handleProfileMenuClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'pending':
        return <PendingArticles />;
      case 'history':
        return <EditHistory />;
      default:
        return <Dashboard />;
    }
  };

  const notifications = [
    { id: 1, title: "New article submitted", time: "2 min ago", type: "info" },
    { id: 2, title: "Article approved by admin", time: "1 hour ago", type: "success" },
    { id: 3, title: "Deadline reminder", time: "3 hours ago", type: "warning" }
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
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
              ✦ Editor Portal
            </Typography>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Current Section Indicator */}
            <Chip
              label={currentSection === 'dashboard' ? 'Dashboard' : currentSection === 'pending' ? 'Pending Articles' : 'Edit History'}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                display: { xs: 'none', md: 'flex' }
              }}
            />

            {/* Dark Mode Toggle */}
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>

            {/* Notifications */}
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={3} color="error" variant="dot">
                <Bell size={18} />
              </Badge>
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                borderRadius: 2,
                border: '2px solid transparent',
                '&:hover': {
                  borderColor: 'white'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {userProfile.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={notificationMenuOpen}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 3,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            '& .MuiMenuItem-root': {
              borderRadius: 1.5,
              mx: 1,
              my: 0.5
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {notifications.length} new notifications
          </Typography>
        </Box>
        
        {notifications.map((notification) => (
          <MenuItem key={notification.id} sx={{ py: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {notification.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider sx={{ mx: 1 }} />
        <MenuItem sx={{ justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 500 }}>
          View All Notifications
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 3,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            '& .MuiMenuItem-root': {
              borderRadius: 1.5,
              mx: 1,
              my: 0.5
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Profile Header */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userProfile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userProfile.email}
              </Typography>
              <Chip 
                label={userProfile.role} 
                size="small" 
                sx={{ 
                  mt: 0.5,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 500
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          View Profile
        </MenuItem>
        
        <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <Divider sx={{ mx: 1 }} />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <LogOut size={18} color="currentColor" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Navigation Sidebar */}
      <Navigation 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Mobile Backdrop */}
      {isMobile && (
        <Backdrop
          open={mobileOpen}
          onClick={() => setMobileOpen(false)}
          sx={{ 
            zIndex: theme.zIndex.drawer - 1,
            bgcolor: 'rgba(0, 0, 0, 0.3)'
          }}
        />
      )}

      {/* FIXED Main Content Area - Removed Gap */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // Fixed width calculation - no extra space
          width: { 
            xs: '100%', // Full width on mobile
            // md: `calc(100vw - ${drawerWidth}px)` // Exact remaining width on desktop
          },
          // Exact margin to push content next to sidebar
          ml: { 
            xs: 0, // No margin on mobile
            // md: `${drawerWidth}px` // Exact sidebar width
          },
          mt: { xs: '56px', sm: '64px' }, // Account for AppBar height
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          bgcolor: '#F8FAFC',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'auto',
          // Remove any padding that creates gaps
          p: 0
        }}
      >
        {/* Content wrapper with minimal padding */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: `100%` },
            height: '100%',
            // Minimal padding to avoid gaps
            p: { xs: 1, sm: 2 },
            boxSizing: 'border-box'
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default EditorPortal;
