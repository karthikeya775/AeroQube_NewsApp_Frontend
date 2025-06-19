import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, TextField, Button, Paper, Snackbar, Alert,
  AppBar, Toolbar, Avatar, Menu, MenuItem, IconButton, Divider, Card,
  CardContent, Grid, Chip, Container, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  AccountCircle, Logout, Settings, PersonAdd, AdminPanelSettings, 
  Edit, SupervisorAccount, Menu as MenuIcon
} from '@mui/icons-material';
import { authService } from '../services/auth.service';

const roles = [
  { 
    label: 'Admin', 
    value: 'admin',
    icon: <AdminPanelSettings />,
    color: '#2196f3'
  },
  { 
    label: 'Editor', 
    value: 'editor',
    icon: <Edit />,
    color: '#ff9800'
  },
  { 
    label: 'Super Admin', 
    value: 'superadmin',
    icon: <SupervisorAccount />,
    color: '#f44336'
  },
];

const SuperAdminPortal = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile.success) {
          setUserProfile(profile.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setForm({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const role = roles[tab].value;
      let res;
      if (role === 'admin') {
        res = await authService.registerAdmin({ ...form, role });
      } else if (role === 'editor') {
        res = await authService.registerEditor({ ...form, role });
      } else if (role === 'superadmin') {
        res = await authService.registerSuperAdmin({ ...form, role });
      }
      if (res.success) {
        setSnackbar({ 
          open: true, 
          message: `${roles[tab].label} registered successfully!`, 
          severity: 'success' 
        });
        setForm({ name: '', email: '', password: '' });
      } else {
        setSnackbar({ 
          open: true, 
          message: res.message || 'Registration failed', 
          severity: 'error' 
        });
      }
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Registration failed', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA';
  };

  const handleViewProfile = () => {
    setEditFormData({
      name: userProfile?.name || '',
      email: userProfile?.email || ''
    });
    setProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    setEditFormData({
      name: userProfile?.name || '',
      email: userProfile?.email || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await authService.updateProfile(editFormData);
      if (response.success) {
        setUserProfile({ ...userProfile, ...response.data });
        setIsEditing(false);
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side - Portal title */}
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Super Admin Portal
          </Typography>
          
          {/* Right side - User info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label="Super Admin" 
              color="primary" 
              size="small" 
              variant="outlined"
            />
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2' }}>
                {getInitials(userProfile?.name || 'Admin User')}
              </Avatar>
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {userProfile?.name || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userProfile?.email || 'admin@example.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleViewProfile}>
          <AccountCircle sx={{ mr: 1.5 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Settings sx={{ mr: 1.5 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <Logout sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Welcome Section */}
        <Paper 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            mb: 4, 
            textAlign: 'center',
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage system users and permissions
          </Typography>
        </Paper>

        {/* Registration Form */}
        <Paper sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAdd sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
              Register New User
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create accounts with specific roles and permissions
            </Typography>
          </Box>

          {/* Role Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: { xs: 60, sm: 72 }
                }
              }}
            >
              {roles.map((role, idx) => (
                <Tab 
                  key={role.value} 
                  label={
                    <Stack alignItems="center" spacing={0.5}>
                      {role.icon}
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {role.label}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Selected Role Info */}
          <Card 
            sx={{ 
              mb: 4, 
              bgcolor: `${roles[tab].color}08`,
              border: `1px solid ${roles[tab].color}30`
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ color: roles[tab].color }}>
                  {roles[tab].icon}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {roles[tab].label} Registration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creating a new {roles[tab].label.toLowerCase()} account
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                variant="outlined"
                helperText="Minimum 8 characters"
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  bgcolor: roles[tab].color,
                  '&:hover': {
                    bgcolor: roles[tab].color,
                    opacity: 0.9
                  }
                }}
              >
                {loading ? 'Creating Account...' : `Register ${roles[tab].label}`}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Profile Dialog */}
      <Dialog 
        open={profileDialogOpen} 
        onClose={() => { setProfileDialogOpen(false); setIsEditing(false); }}
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
          borderBottom: `1px solid #e0e0e0`,
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">My Profile</Typography>
          <IconButton onClick={() => { setProfileDialogOpen(false); setIsEditing(false); }}>
            <Logout size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, pt: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#1976d2',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              {getInitials(userProfile?.name || 'Super Admin')}
            </Avatar>
            {isEditing ? (
              <TextField
                fullWidth
                label="Name"
                value={editFormData.name}
                onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                sx={{ mb: 1, mt: 1, maxWidth: 300 }}
              />
            ) : (
              <Typography variant="h5" fontWeight="bold">{userProfile?.name}</Typography>
            )}
            {isEditing ? (
              <TextField
                fullWidth
                label="Email"
                value={editFormData.email}
                onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                sx={{ mb: 1, mt: 1, maxWidth: 300 }}
              />
            ) : (
              <Typography variant="body1" color="text.secondary">{userProfile?.email}</Typography>
            )}
            <Typography variant="body1" color="text.secondary">{userProfile?.role}</Typography>
            <Chip 
              icon={<SupervisorAccount sx={{ fontSize: 16 }} />} 
              label="Verified Super Admin" 
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
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editFormData.email}
                      onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      sx={{ mb: 1, mt: 1, maxWidth: 300 }}
                    />
                  ) : (
                    <Typography variant="body1">{userProfile?.email}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Name</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      sx={{ mb: 1, mt: 1, maxWidth: 300 }}
                    />
                  ) : (
                    <Typography variant="body1">{userProfile?.name}</Typography>
                  )}
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
                  <Typography variant="body2" color="text.secondary">Role</Typography>
                  <Typography variant="body1">{userProfile?.role}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Joined</Typography>
                  <Typography variant="body1">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : ''}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid #e0e0e0` }}>
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
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0'
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
                onClick={() => { setProfileDialogOpen(false); setIsEditing(false); }}
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
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0'
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

export default SuperAdminPortal;
