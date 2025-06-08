import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  HelpCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  X
} from 'lucide-react';
import AdminSidebar from '../../Components/Admin/AdminSideBar';
import Dashboard from '../../Components/Admin/Dashboard';
import UserManagement from '../../Components/Admin/UserManagement';
import ContentManagement from '../../Components/Admin/ContentManagement';
import SettingsPanel from '../../Components/Reporter/SettingsPanel';
import CategoryManagement from '../../Components/Admin/CategoryManagement';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 260;

const customColors = {
  header: {
    background: '#1E293B',
    text: '#FFFFFF',
    hover: '#334155'
  },
  sidebar: {
    background: '#FFFFFF',
    activeItem: '#F1F5F9',
    activeText: '#0F172A',
    border: '#E2E8F0'
  }
};

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();
  
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(profileAnchorEl);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    joinDate: "",
    lastLogin: "",
    permissions: ["Full Access"]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    contact: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setProfileData({
            name: response.data.name || '',
            email: response.data.email || '',
            role: response.data.role || '',
            phone: response.data.contact || 'Not provided',
            joinDate: new Date(response.data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            lastLogin: new Date(response.data.updatedAt).toLocaleString(),
            permissions: ["Full Access"]
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    console.log('AdminPanel mounted with initial section:', currentSection);
  }, []);

  useEffect(() => {
    console.log('Current section changed to:', currentSection);
  }, [currentSection]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleViewProfile = () => {
    setProfileDialogOpen(true);
    handleProfileMenuClose();
  };

  const handleEditClick = () => {
    setEditFormData({
      name: profileData.name,
      email: profileData.email,
      contact: profileData.phone
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await authService.updateProfile(editFormData);
      if (response.success) {
        setProfileData({
          ...profileData,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.contact
        });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      handleProfileMenuClose();
      toast.success('Logged out successfully');
      navigate('/rolebasedlogin?role=admin');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Logout was not clean, but you have been signed out');
      navigate('/rolebasedlogin?role=admin');
    }
  };

  const renderCurrentSection = () => {
    console.log('renderCurrentSection called with:', currentSection);
    
    switch (currentSection) {
      case "dashboard":
        console.log('Rendering Dashboard');
        return <Dashboard userRole={userRole} setCurrentSection={setCurrentSection} />;
      case "content":
        console.log('Rendering Content Management');
        return <ContentManagement userRole={userRole} />;
      case "categories":
        console.log('Rendering Category Management');
        return <CategoryManagement userRole={userRole} />;
      case "users":
        console.log('Rendering User Management');
        return <UserManagement userRole={userRole} />;
      case "settings":
        console.log('Rendering Settings');
        return <SettingsPanel userRole={userRole} />;
      default:
        console.log('Default case reached with section:', currentSection);
        return <Dashboard userRole={userRole} />;
    }
  };

  const renderProfileMenu = () => (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Typography variant="subtitle1" fontWeight="bold">{profileData.name}</Typography>
      <Typography variant="body2" color="text.secondary">{profileData.email}</Typography>
    </Box>
  );

  const renderEditableField = (icon, label, value, field) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Box sx={{ width: '100%', ml: 2 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            value={editFormData[field]}
            onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
            sx={{ mt: 1 }}
          />
        ) : (
          <Typography variant="body1">{value}</Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: customColors.header.background,
          color: customColors.header.text,
          borderBottom: `1px solid ${alpha(customColors.header.text, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    backgroundColor: alpha(customColors.header.text, 0.1)
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
              }}
            >
              News App Admin
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit" 
              sx={{ 
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: customColors.header.hover
                }
              }}
            >
              <Bell size={20} />
            </IconButton>
            
            <IconButton 
              color="inherit"
              onClick={handleProfileMenuOpen}
              aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={profileMenuOpen ? 'true' : undefined}
              sx={{ 
                ml: 1,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: customColors.header.hover
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: '#3B82F6',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                A
              </Avatar>
            </IconButton>
            
            <Menu
              id="profile-menu"
              anchorEl={profileAnchorEl}
              open={profileMenuOpen}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 2,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {renderProfileMenu()}
              <Divider />
              <MenuItem sx={{ py: 1.5 }} onClick={handleViewProfile}>
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                View My Profile
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }} onClick={() => setCurrentSection("settings")}>
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }} onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={18} color={theme.palette.error.main} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
              backgroundColor: customColors.sidebar.background,
              borderRight: `1px solid ${customColors.sidebar.border}`,
            },
          }}
        >
          <AdminSidebar
            userRole={userRole}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            closeMobileDrawer={() => setMobileOpen(false)}
          />
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${customColors.sidebar.border}`,
              backgroundColor: customColors.sidebar.background,
              boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Toolbar />
          <AdminSidebar
            userRole={userRole}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            closeMobileDrawer={() => {}}
          />
        </Drawer>
      </Box>

      {/* Main Content - Fixed for responsive dashboard */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#F8FAFC',
          overflow: 'hidden', // Prevent double scrollbars
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            // Remove fixed width constraints that were causing issues
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {renderCurrentSection()}
        </Box>
      </Box>
      
      {/* Profile Dialog - keeping existing code */}
      <Dialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">My Profile</Typography>
          <IconButton onClick={() => setProfileDialogOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, pt: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#3B82F6',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              A
            </Avatar>
            <Typography variant="h5" fontWeight="bold">{profileData.name}</Typography>
            <Typography variant="body1" color="text.secondary">{profileData.role}</Typography>
            <Chip 
              icon={<Shield size={14} />} 
              label="Verified Account" 
              color="success" 
              size="small"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {renderEditableField(
                    <Mail size={18} color={theme.palette.text.secondary} />,
                    "Email",
                    profileData.email,
                    "email"
                  )}
                  
                  {renderEditableField(
                    <User size={18} color={theme.palette.text.secondary} />,
                    "Name",
                    profileData.name,
                    "name"
                  )}
                  
                  {renderEditableField(
                    <Phone size={18} color={theme.palette.text.secondary} />,
                    "Phone",
                    profileData.phone,
                    "contact"
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar size={18} color={theme.palette.text.secondary} style={{ marginRight: 10 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Joined</Typography>
                      <Typography variant="body1">{profileData.joinDate}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Typography variant="body1">{profileData.role}</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Last Login</Typography>
                    <Typography variant="body1">{profileData.lastLogin}</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Permissions</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.permissions.map((permission, index) => (
                        <Chip 
                          key={index}
                          label={permission} 
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#3B82F6', 0.1),
                            color: '#3B82F6',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          {isEditing ? (
            <>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
                sx={{ borderRadius: 1.5, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveProfile}
                sx={{ 
                  borderRadius: 1.5, 
                  textTransform: 'none',
                  bgcolor: '#3B82F6',
                  '&:hover': {
                    bgcolor: '#2563EB'
                  }
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                onClick={() => setProfileDialogOpen(false)}
                sx={{ borderRadius: 1.5, textTransform: 'none' }}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                onClick={handleEditClick}
                sx={{ 
                  borderRadius: 1.5, 
                  textTransform: 'none',
                  bgcolor: '#3B82F6',
                  '&:hover': {
                    bgcolor: '#2563EB'
                  }
                }}
              >
                Edit Profile
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
