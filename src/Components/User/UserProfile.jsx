import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  Camera,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/auth.service';
import { categoryService } from '../../services/category.service';

const UserProfile = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    role: '',
    joinedDate: '',
    isVerified: false,
    interest: [], // Always store as IDs
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  // Password states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [editInterests, setEditInterests] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditedData({ ...userData });
    }
  }, [userData]);

  // Map interest IDs to category objects for display
  useEffect(() => {
    if (userData.interest && categories.length > 0) {
      const selectedCats = categories.filter(cat => userData.interest.includes(cat._id));
      setSelectedCategories(selectedCats);
    }
  }, [userData.interest, categories]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      if (response.data) {
        setUserData({
          ...response.data,
          joinedDate: new Date(response.data.createdAt).toLocaleDateString(),
          interest: response.data.interest || []
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleUpdate = async () => {
    try {
      // Always send interests as IDs
      const changedData = {
        ...editedData,
        interest: selectedCategories.map(cat => cat._id)
      };
      const response = await authService.updateProfile(changedData);

      if (response.success) {
        setUserData(prev => ({
          ...prev,
          ...response.data,
          interest: changedData.interest
        }));
        toast.success('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        toast.error('Both current and new passwords are required');
        return;
      }
      const response = await authService.updateProfile({
        currentpassword: passwordData.currentPassword,
        newpassword: passwordData.newPassword
      });

      if (response.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: ''
        });
        setShowCurrentPassword(false);
        setShowNewPassword(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };

  const handleInterestsUpdate = async () => {
    try {
      const currentInterestIds = userData.interest || [];
      const newInterestIds = selectedCategories.map(cat => cat._id);

      if (JSON.stringify(currentInterestIds) !== JSON.stringify(newInterestIds)) {
        const updateData = {
          ...userData,
          interest: newInterestIds
        };
        const response = await authService.updateProfile(updateData);

        if (response.success) {
          setUserData(prev => ({
            ...prev,
            interest: newInterestIds
          }));
          toast.success('Interests updated successfully');
          setEditInterests(false);
        }
      } else {
        toast.info('No changes to save');
        setEditInterests(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update interests');
    }
  };

  const renderField = (field, label, icon, type = 'text') => (
    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
        {label}
      </Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        justifyContent: 'center'
      }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        {editMode ? (
          <TextField
            fullWidth
            size="small"
            type={type}
            value={editedData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              maxWidth: '300px'
            }}
          />
        ) : (
          <Typography sx={{ textAlign: 'center' }}>
            {userData[field] || 'Not provided'}
          </Typography>
        )}
      </Box>
      <Divider sx={{ mt: 2, width: '100%' }} />
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: alpha(theme.palette.primary.light, 0.05)
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: alpha(theme.palette.primary.light, 0.05),
      pt: 2,
      pb: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Profile Header */}
      <Box
        sx={{
          height: '200px',
          width: '100%',
          bgcolor: 'primary.main',
          borderRadius: { xs: '0 0 24px 24px', md: '0 0 50px 50px' },
          position: 'relative',
          mb: 10,
          boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.3)}`
        }}
      >
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            position: 'absolute',
            bottom: '-60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  border: `5px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[3],
                  fontSize: '3.5rem',
                  bgcolor: theme.palette.secondary.main,
                }}
              >
                {userData.name?.charAt(0) || <User size={60} />}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[2],
                  '&:hover': { bgcolor: 'background.paper' }
                }}
              >
                <Camera size={20} />
              </IconButton>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center'
            }}>
              <Chip
                label={userData.role?.toUpperCase()}
                color="secondary"
                sx={{
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  px: 1
                }}
              />
              <Chip
                icon={<Calendar size={16} />}
                label={`Joined ${userData.joinedDate}`}
                variant="outlined"
                sx={{ borderRadius: '12px' }}
              />
              <Chip
                icon={userData.isVerified ? <Shield size={16} /> : null}
                label={userData.isVerified ? 'Verified Account' : 'Unverified Account'}
                color={userData.isVerified ? 'success' : 'warning'}
                variant="outlined"
                sx={{ borderRadius: '12px' }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, textAlign: 'center', mt: 6 }}>
          {userData.name || 'Your Name'}
        </Typography>

        {/* Profile Details Card */}
        <Card sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          mb: 4,
          width: '100%',
          maxWidth: '600px',
          mt: 4
        }}>
          <Box sx={{
            bgcolor: 'primary.light',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <User size={20} />
            <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
            <IconButton
              size="small"
              onClick={() => setEditMode(!editMode)}
              sx={{
                ml: 1,
                color: 'primary.main',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.9)
                }
              }}
            >
              <Edit2 size={16} />
            </IconButton>
          </Box>
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {renderField('name', 'Full Name', <User size={20} />)}
            {renderField('email', 'Email Address', <Mail size={20} />, 'email')}
            {renderField('contact', 'Contact Number', <Phone size={20} />, 'tel')}

            {editMode && (
              <Button
                variant="contained"
                startIcon={<Save size={16} />}
                onClick={handleUpdate}
                sx={{
                  mt: 2,
                  borderRadius: '12px',
                  minWidth: '150px',
                  boxShadow: theme.shadows[2]
                }}
              >
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Interests Card */}
        <Card sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          mb: 4,
          width: '100%',
          maxWidth: '600px'
        }}>
          <Box sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Tag size={20} color={theme.palette.secondary.main} />
            <Typography variant="h6" fontWeight="bold" color="secondary.main">News Interests</Typography>
            <IconButton
              size="small"
              onClick={() => setEditInterests(!editInterests)}
              sx={{
                ml: 1,
                color: 'secondary.main',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.9)
                }
              }}
            >
              <Edit2 size={16} />
            </IconButton>
          </Box>
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {editInterests ? (
              <>
                <Autocomplete
                  multiple
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategories}
                  onChange={(event, newValue) => {
                    setSelectedCategories(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select categories"
                      sx={{
                        width: '100%',
                        maxWidth: '400px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        sx={{ m: 0.5, borderRadius: '8px' }}
                      />
                    ))
                  }
                />
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 3,
                  justifyContent: 'center'
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditInterests(false);
                      setSelectedCategories(categories.filter(cat => userData.interest.includes(cat._id)));
                    }}
                    sx={{
                      borderRadius: '12px',
                      minWidth: '100px'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleInterestsUpdate}
                    startIcon={<Save size={16} />}
                    sx={{
                      borderRadius: '12px',
                      minWidth: '100px'
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
                maxWidth: '400px'
              }}>
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((category, index) => (
                    <Chip
                      key={category._id || `category-${index}`}
                      label={category.name}
                      sx={{
                        borderRadius: '8px',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main'
                      }}
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No interests selected
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Password Update Card */}
        <Card sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          mb: 4,
          width: '100%',
          maxWidth: '600px'
        }}>
          <Box sx={{
            bgcolor: alpha(theme.palette.primary.dark, 0.1),
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Lock size={20} color={theme.palette.primary.dark} />
            <Typography variant="h6" fontWeight="bold" color="primary.dark">Update Password</Typography>
          </Box>
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 3, width: '100%', maxWidth: '350px' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                Current Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3, width: '100%', maxWidth: '350px' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                New Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordUpdate}
              sx={{
                mt: 2,
                borderRadius: '12px',
                minWidth: '200px',
                boxShadow: theme.shadows[2]
              }}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '600px'
        }}>
          <Box sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Shield size={20} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight="bold" color="success.main">Account Status</Typography>
          </Box>
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              bgcolor: userData.isVerified
                ? alpha(theme.palette.success.main, 0.05)
                : alpha(theme.palette.warning.main, 0.05),
              borderRadius: '12px',
              border: `1px solid ${userData.isVerified
                ? alpha(theme.palette.success.main, 0.2)
                : alpha(theme.palette.warning.main, 0.2)}`,
              width: '100%',
              justifyContent: 'center'
            }}>
              {userData.isVerified ? (
                <Shield size={24} color={theme.palette.success.main} />
              ) : (
                <Shield size={24} color={theme.palette.warning.main} />
              )}
              <Box sx={{ textAlign: 'center' }}>
                <Typography fontWeight="bold" color={userData.isVerified ? 'success.main' : 'warning.main'}>
                  {userData.isVerified ? 'Verified Account' : 'Unverified Account'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.isVerified
                    ? 'Your account is fully verified and secure.'
                    : 'Please verify your account for full access.'}
                </Typography>
              </Box>
            </Box>
            {!userData.isVerified && (
              <Button
                variant="contained"
                color="warning"
                sx={{ mt: 2, borderRadius: '12px', width: '50%' }}
              >
                Verify Now
              </Button>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UserProfile;
