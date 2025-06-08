import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  alpha,
  Avatar,
  StepConnector,
  styled,
  Drawer,
  useMediaQuery,
  Menu,
  MenuItem,
  CircularProgress,
  Collapse,
  
} from '@mui/material';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  FileCheck,
  AlertCircle,
  ChevronRight,
  FileSymlink,
  FilePlus,
  History,
  Menu as MenuIcon,
  Home,
  LogOut,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import { applicationService } from '../../services/application.service';

// Custom styled components
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    marginTop: 8,
    fontWeight: 500,
  },
  '& .MuiStepLabel-label.Mui-active': {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    fontWeight: 700,
  },
}));

const DocumentItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const SidebarItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: 8,
  marginBottom: 8,
  padding: '10px 16px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.light, 0.05),
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  '& .MuiTypography-root': {
    fontWeight: active ? 600 : 500,
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  height: '100%',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  }
}));

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return <Clock size={24} />;
    case 'approved':
      return <CheckCircle size={24} />;
    case 'rejected':
      return <XCircle size={24} />;
    default:
      return <AlertCircle size={24} />;
  }
};

const ReporterApplicationDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [application, setApplication] = useState(null);
  const [pastApplications, setPastApplications] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'current', 'submit', 'past', 'profile'
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [expandedApp, setExpandedApp] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const drawerWidth = 280;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        if (response.success) {
          setUserData(response.data);
          // Update application data if exists
          if (response.data.reporterApplication) {
            setApplication(response.data.reporterApplication);
          }
          // Update past applications if any
          if (response.data.pastApplications) {
            setPastApplications(response.data.pastApplications);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update the useEffect where applications are fetched
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await applicationService.getMyApplications();
        console.log('Applications response:', response); // Debug log
        
        if (response.success) {
          // Find pending application
          const pendingApp = response.data.find(app => app.status === 'pending');
          if (pendingApp) {
            setApplication({
              ...pendingApp,
              fullName: pendingApp.reporterId.name,
              email: pendingApp.reporterId.email,
              contact: pendingApp.reporterId.contact || 'Not provided',
              phone: pendingApp.reporterId.contact || 'Not provided',
              submittedAt: pendingApp.createdAt
            });
          }

          // Filter and set past applications (all non-pending applications)
          const pastApps = response.data
            .filter(app => app.status !== 'pending')
            .map(app => ({
              ...app,
              fullName: app.reporterId.name,
              email: app.reporterId.email,
              contact: app.reporterId.contact || 'Not provided',
              phone: app.reporterId.contact || 'Not provided',
              submittedAt: app.createdAt
            }));

          console.log('Past applications:', pastApps); // Debug log
          setPastApplications(pastApps);
        }
      } catch (error) {
        console.error('Fetch applications error:', error);
        toast.error(error.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const activeStep = application ? {
    'pending': 1,
    'reviewing': 2,
    'approved': 3,
    'rejected': 3
  }[application.status] || 0 : 0;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      handleProfileMenuClose();
      
      await authService.logout();
      
      // Clear any additional state if needed
      setUserData(null);
      setApplication(null);
      setPastApplications([]);
      
      toast.success('Logged out successfully');
      navigate('/reporter-application');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate away even if there's an error
      navigate('/reporter-application');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const response = await applicationService.deleteApplication(applicationId);
      if (response.success) {
        toast.success('Application deleted successfully');
        // Refresh applications
        window.location.reload();
      }
    } catch (error) {
      console.error('Delete application error:', error);
      toast.error(error.message || 'Failed to delete application');
    }
  };

  const renderSidebar = () => (
    <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        mb: 3,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" fontWeight="bold">
          Reporter Portal
        </Typography>
      </Box>
      
      <List component="nav" sx={{ px: 1, flex: 1 }}>
        <SidebarItem 
          button 
          active={currentView === 'dashboard'} 
          onClick={() => handleViewChange('dashboard')}
        >
          <ListItemIcon>
            <Home size={20} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </SidebarItem>
        
        <SidebarItem 
          button 
          active={currentView === 'current'} 
          onClick={() => handleViewChange('current')}
        >
          <ListItemIcon>
            <FileText size={20} />
          </ListItemIcon>
          <ListItemText primary="My Application" />
          {application && (
            <Chip 
              label={application.status} 
              size="small" 
              color={getStatusColor(application.status)} 
              sx={{ ml: 1, height: 24, textTransform: 'capitalize' }} 
            />
          )}
        </SidebarItem>
        
        <SidebarItem 
          button 
          active={currentView === 'submit'} 
          onClick={() => handleViewChange('submit')}
        >
          <ListItemIcon>
            <FilePlus size={20} />
          </ListItemIcon>
          <ListItemText primary="Submit Application" />
        </SidebarItem>
        
        <SidebarItem 
          button 
          active={currentView === 'past'} 
          onClick={() => handleViewChange('past')}
        >
          <ListItemIcon>
            <History size={20} />
          </ListItemIcon>
          <ListItemText primary="Past Applications" />
          {pastApplications.length > 0 && (
            <Chip 
              label={pastApplications.length} 
              size="small" 
              color="primary" 
              sx={{ ml: 1, height: 24 }} 
            />
          )}
        </SidebarItem>
        
        <SidebarItem 
          button 
          active={currentView === 'profile'} 
          onClick={() => handleViewChange('profile')}
        >
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </SidebarItem>
      </List>
      
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`, 
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            cursor: 'pointer'
          }}
          onClick={handleProfileMenuOpen}
        >
          {userData?.name?.charAt(0) || <User size={20} />}
        </Avatar>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography 
            variant="body1" 
            fontWeight="medium" 
            sx={{ 
              textOverflow: 'ellipsis', 
              overflow: 'hidden', 
              whiteSpace: 'nowrap' 
            }}
          >
            {userData?.name || 'User'}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textOverflow: 'ellipsis', 
              overflow: 'hidden', 
              whiteSpace: 'nowrap' 
            }}
          >
            {userData?.email || 'user@example.com'}
          </Typography>
        </Box>
        <IconButton onClick={handleProfileMenuOpen}>
          <Settings size={20} />
        </IconButton>
      </Box>
      
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { 
            width: 200,
            mt: 1,
            boxShadow: theme.shadows[3],
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          handleViewChange('profile');
        }}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleLogout} 
          disabled={logoutLoading}
          sx={{ 
            gap: 2, 
            color: 'error.main',
            '&.Mui-disabled': {
              opacity: 0.7
            }
          }}
        >
          <ListItemIcon>
            <LogOut size={18} color={theme.palette.error.main} />
          </ListItemIcon>
          <Typography variant="body2" color="error">
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderDashboard = () => {
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {userData?.name || 'User'}!
          </Typography>
          <Typography color="text.secondary">
            Manage your reporter application and track its status from this dashboard.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={4} sx={{ mb: 6, width: '100%' }} justifyContent={'center'}>
          <Grid item xs={12} md={4} width={{lg:275}}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: application ? alpha(theme.palette[getStatusColor(application.status)].main, 0.1) : alpha(theme.palette.grey[500], 0.1),
                    color: application ? theme.palette[getStatusColor(application.status)].main : theme.palette.grey[500]
                  }}
                >
                  {application ? getStatusIcon(application.status) : <FileText size={30} />}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Application Status
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={application ? theme.palette[getStatusColor(application.status)].main : 'text.secondary'}>
                  {application ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Not Applied'}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ mt: 3, borderRadius: 2, textTransform: 'none', px: 3 }}
                  onClick={() => handleViewChange('current')}
                  endIcon={<ChevronRight size={16} />}
                >
                  View Details
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} md={4} width={{lg:275}}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main
                  }}
                >
                  <History size={30} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Past Applications
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {pastApplications.length}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ mt: 3, borderRadius: 2, textTransform: 'none', px: 3 }}
                  onClick={() => handleViewChange('past')}
                  endIcon={<ChevronRight size={16} />}
                  disabled={pastApplications.length === 0}
                >
                  View History
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} md={4} width={{lg:275}}>
            <StatsCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main
                  }}
                >
                  <FilePlus size={30} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  New Application
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {application && application.status === 'pending' ? 'In Progress' : 'Start Now'}
                </Typography>
                <Button 
                  variant={application && application.status === 'pending' ? "outlined" : "contained"} 
                  size="large" 
                  sx={{ mt: 3, borderRadius: 2, textTransform: 'none', px: 3 }}
                  onClick={() => handleViewChange('submit')}
                  endIcon={<ChevronRight size={16} />}
                >
                  {application && application.status === 'pending' ? 'View Status' : 'Apply Now'}
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Application Quick Status */}
        {application && (
          <Card sx={{ borderRadius: 3, mb: 4, overflow: 'hidden', width: '100%' }}>
            <Box sx={{ height: 4, bgcolor: theme.palette[getStatusColor(application.status)].main }} />
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Typography variant="h5" fontWeight="bold">Current Application Overview</Typography>
                <Chip
                  label={application.status.toUpperCase()}
                  color={getStatusColor(application.status)}
                  size="medium"
                  sx={{ fontWeight: 'medium', px: 1 }}
                />
              </Box>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <User size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Applicant:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {application.fullName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Calendar size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Submitted:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(application.submittedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => handleViewChange('current')}
                  endIcon={<ChevronRight />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5
                  }}
                >
                  View Full Application Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderCurrentApplication = () => {
    if (!application) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <Card 
            elevation={0}
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 6, 
              maxWidth: 500,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.light, 0.03),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            >
              <FileText size={40} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              No Application Found
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ mb: 4, fontSize: '1.1rem' }}>
              You haven't submitted a reporter application yet. Start your journey with us today!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleViewChange('submit')}
              endIcon={<ChevronRight />}
              sx={{ 
                borderRadius: 2, 
                py: 1.5, 
                px: 4, 
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: theme.shadows[4]
              }}
            >
              Start Application
            </Button>
          </Card>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2, maxWidth: '900px', mx: 'auto' }}>
        {/* Status Overview Card */}
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            mb: 4,
            position: 'relative'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '8px', 
              bgcolor: theme.palette[getStatusColor(application.status)].main 
            }} 
          />
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pt: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Typography variant="h4" fontWeight="bold">Application Status</Typography>
                <Chip
                  icon={getStatusIcon(application.status)}
                  label={application.status?.toUpperCase()}
                  color={getStatusColor(application.status)}
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.9rem', 
                    py: 2.5, 
                    px: 1,
                    '& .MuiChip-icon': { 
                      fontSize: '1.2rem', 
                      mr: 0.5 
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ px: { xs: 0, md: 4 }, mb: 4 }}>
                <Stepper 
                  activeStep={activeStep} 
                  connector={<StyledStepConnector />}
                  alternativeLabel
                >
                  <Step>
                    <StyledStepLabel StepIconProps={{ 
                      sx: { fontSize: '2rem', color: theme.palette.primary.main } 
                    }}>
                      Submitted
                    </StyledStepLabel>
                  </Step>
                  <Step>
                    <StyledStepLabel StepIconProps={{ 
                      sx: { fontSize: '2rem', color: theme.palette.primary.main } 
                    }}>
                      Under Review
                    </StyledStepLabel>
                  </Step>
                  <Step>
                    <StyledStepLabel StepIconProps={{ 
                      sx: { fontSize: '2rem', color: theme.palette.primary.main } 
                    }}>
                      Decision
                    </StyledStepLabel>
                  </Step>
                </Stepper>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ 
              p: 3, 
              bgcolor: alpha(theme.palette.background.default, 0.5) 
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Applicant Information
              </Typography>
              <Grid container spacing={4} justifyContent={{lg:'center', xs: 'center'}}>
                <Grid item xs={12} md={6}>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <User size={24} color={theme.palette.primary.main} /> {/* Increased icon size */}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Full Name
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5, fontSize: '1.2rem' }}>
                            {application.fullName}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Mail size={24} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Email
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5, fontSize: '1.2rem' }}>
                            {application.email}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Phone size={24} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Phone
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5, fontSize: '1.2rem' }}>
                            {application.phone}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Calendar size={24} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                            Submitted On
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5, fontSize: '1.2rem' }}>
                            {new Date(application.submittedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 3, 
            mb: 4 
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <FileSymlink size={24} color={theme.palette.primary.main} style={{ marginRight: 12 }} />
              <Typography variant="h6" fontWeight="bold">
                Submitted Documents
              </Typography>
            </Box>
            <List disablePadding>
              {application.documents?.map((doc, index) => (
                <DocumentItem key={index}>
                  <ListItemIcon>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                      }}
                    >
                      <FileCheck size={20} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography fontWeight={500}>
                        {doc.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    }
                  />
                </DocumentItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Status Message */}
        {application.status === 'approved' && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2
            }}
          >
            <CheckCircle size={24} color={theme.palette.success.main} style={{ marginTop: 4 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
                Congratulations! 🎉
              </Typography>
              <Typography variant="body1">
                Your application has been approved. Check your email for login credentials and next steps.
                You can now start contributing to our platform as a reporter.
              </Typography>
            </Box>
          </Paper>
        )}
        
        {application.status === 'rejected' && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2
            }}
          >
            <XCircle size={24} color={theme.palette.error.main} style={{ marginTop: 4 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="error.main" gutterBottom>
                Application Not Approved
              </Typography>
              <Typography variant="body1">
                Unfortunately, your application has not been approved at this time. 
                You may apply again after 30 days with updated information.
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    );
  };

  const renderSubmitApplication = () => {
    if (application && application.status === 'pending') {
      return (
        <Box sx={{ mt: 2, maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 4
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.2),
                color: theme.palette.warning.main,
                width: 70,
                height: 70,
                mb: 2
              }}
            >
              <AlertCircle size={36} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="warning.main" gutterBottom>
              Application In Progress
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mb: 2 }}>
              You already have a pending application that is currently being reviewed. 
              You can check the status in your dashboard.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              size="large"
              sx={{ mt: 2, borderRadius: 2, textTransform: 'none', px: 4 }}
              onClick={() => handleViewChange('current')}
            >
              View Current Application
            </Button>
          </Paper>
        </Box>
      );
    }

    // This would be replaced with your actual application form
    return (
      <Box sx={{ mt: 2, maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
        <Card elevation={2} sx={{ borderRadius: 3, p: 4 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3
            }}
          >
            <FilePlus size={40} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Submit New Application
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Fill out the form below to apply for a reporter position. Make sure to have all your documents ready before starting.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/reporter-application/apply')}
            endIcon={<ChevronRight />}
            sx={{ 
              borderRadius: 2, 
              py: 1.5, 
              px: 4, 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Start New Application
          </Button>
        </Card>
      </Box>
    );
  };

  // Update the renderPastApplications function to handle loading state
  const renderPastApplications = () => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!pastApplications || pastApplications.length === 0) {
    return (
      <Box sx={{ mt: 2, maxWidth: '900px', mx: 'auto' }}>
        <Card 
          elevation={0}
          sx={{ 
            p: 6, 
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.primary.light, 0.03),
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main
            }}
          >
            <History size={40} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No Past Applications
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            You haven't submitted any applications yet. Start your journey by submitting your first application.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => handleViewChange('submit')}
            endIcon={<ChevronRight />}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Submit New Application
          </Button>
        </Card>
      </Box>
    );
  }

  const toggleExpand = (appId) => {
    setExpandedApp(expandedApp === appId ? null : appId);
  };

  return (
    <Box sx={{ mt: 2, maxWidth: '1000px', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Application History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all your previous applications and their status
        </Typography>
      </Box>


      {/* Applications List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {pastApplications.map((application, index) => {
          const isExpanded = expandedApp === (application._id || application.id);
          const statusColor = application.status === 'accepted' || application.status === 'approved' ? 'success' : 'error';
          
          return (
            <Card 
              key={application._id || application.id}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`,
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Status Bar */}
              <Box 
                sx={{ 
                  height: 6, 
                  bgcolor: theme.palette[statusColor].main,
                  background: `linear-gradient(90deg, ${theme.palette[statusColor].main}, ${theme.palette[statusColor].light})`
                }} 
              />

              {/* Main Content */}
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02)
                    }
                  }}
                  onClick={() => toggleExpand(application._id || application.id)}
                >
                  <Grid container alignItems="center" spacing={3}>
                    {/* Application Info */}
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette[statusColor].main, 0.1),
                            color: theme.palette[statusColor].main,
                            width: 50,
                            height: 50
                          }}
                        >
                          {application.status === 'accepted' || application.status === 'approved' ? 
                            <CheckCircle size={24} /> : 
                            <XCircle size={24} />
                          }
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Application #{(application._id || application.id)?.substring(0, 8) || 'N/A'}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Calendar size={16} color={theme.palette.text.secondary} />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(application.submittedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <User size={16} color={theme.palette.text.secondary} />
                              <Typography variant="body2" color="text.secondary">
                                {application.fullName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Status and Actions */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Chip
                          label={application.status.toUpperCase()}
                          color={statusColor}
                          variant="filled"
                          sx={{ 
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <ChevronRight size={20} />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Expanded Details */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Divider />
                  <Box sx={{ p: 4, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                    <Grid container spacing={4}>
                      {/* Personal Information */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                          Personal Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 32, height: 32 }}>
                              <User size={16} color={theme.palette.primary.main} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Full Name</Typography>
                              <Typography variant="body1" fontWeight="medium">{application.fullName}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 32, height: 32 }}>
                              <Mail size={16} color={theme.palette.primary.main} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Email</Typography>
                              <Typography variant="body1" fontWeight="medium">{application.email}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 32, height: 32 }}>
                              <Phone size={16} color={theme.palette.primary.main} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">Phone</Typography>
                              <Typography variant="body1" fontWeight="medium">{application.phone}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Professional Details */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                          Professional Details
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Organization
                          </Typography>
                          <Chip 
                            label={application.organization || application.currentAffiliation || 'Not specified'}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Application Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {new Date(application.submittedAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Bio Section */}
                      {application.bio && (
                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                            Professional Bio
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.background.paper, 0.7),
                              border: `1px solid ${theme.palette.divider}`,
                              borderLeft: `4px solid ${theme.palette.primary.main}`
                            }}
                          >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                              {application.bio}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}

                      {/* Documents Section */}
                      {application.documents && application.documents.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                            Submitted Documents
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {application.documents.map((doc, docIndex) => (
                              <Chip
                                key={docIndex}
                                icon={<FileText size={16} />}
                                label={doc.name || doc}
                                variant="outlined"
                                sx={{ 
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}

                      {/* Admin Response */}
                      {application.message && (
                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
                            Admin Response
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              bgcolor: alpha(theme.palette[statusColor].main, 0.05),
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette[statusColor].main, 0.2)}`,
                              borderLeft: `4px solid ${theme.palette[statusColor].main}`
                            }}
                          >
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                              {application.message}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};



  const renderProfile = () => {
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Box sx={{ mt: 2, maxWidth: '900px', mx: 'auto', textAlign: 'center' }}>
        <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: theme.palette.primary.main, py: 5, position: 'relative' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                border: `4px solid white`,
                boxShadow: theme.shadows[3],
                bgcolor: theme.palette.secondary.main,
                fontSize: '3rem',
              }}
            >
              {userData?.name?.charAt(0) || <User size={50} />}
            </Avatar>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {userData?.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userData?.email || 'user@example.com'}
            </Typography>
            
            <Divider sx={{ my: 4 }} />
            
            <Grid container spacing={15} sx={{ textAlign: 'center', mb: 3 }} justifyContent={'center'}> {/* Increased spacing from 4 to 6 */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Account Type
                </Typography>
                <Typography variant="body1" fontWeight="heavy">
                  {userData?.role || 'User'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Member Since
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {userData?.createdAt ? 
                    new Date(userData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    'Not available'
                  }
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {userData?.contact || 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label={userData?.isVerified ? 'Verified' : 'Unverified'} 
                  color={userData?.isVerified ? 'success' : 'warning'} 
                  size="small"
                  sx={{ fontWeight: 'medium' }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
                onClick={() => handleViewChange('dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'submit':
        return renderSubmitApplication();
      case 'past':
        return renderPastApplications();
      case 'current':
        return renderCurrentApplication();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: alpha(theme.palette.primary.light, 0.03) }}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={0}
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'white',
          zIndex: theme.zIndex.drawer - 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'current' && 'My Application'}
            {currentView === 'submit' && 'Submit Application'}
            {currentView === 'past' && 'Past Applications'}
            {currentView === 'profile' && 'My Profile'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="profile"
            onClick={handleProfileMenuOpen}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <User size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
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
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
        >
          {renderSidebar()}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
          open
        >
          {renderSidebar()}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { md: `calc(100%- ${drawerWidth}px)` },
          mt: { xs: 8, md: 8 } // Add top margin to account for AppBar
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ReporterApplicationDashboard;
