import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Skeleton,
  Divider
} from '@mui/material';
import { LayoutDashboard, FileText, Send } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';

const ReporterSideBar = ({ onNavigate, closeMobileDrawer }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/reporter/dashboard' },
    { text: 'My Submissions', icon: <FileText size={20} />, path: '/reporter/submissions' },
    { text: 'Submit Article', icon: <Send size={20} />, path: '/reporter/submit' }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Profile Section */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {loading ? (
          <>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width={150} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={120} sx={{ mx: 'auto' }} />
          </>
        ) : (
          <>
            <Avatar
              src={userProfile?.profileImage}
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '3px solid white'
              }}
            >
              {userProfile?.name?.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={600}>
              {userProfile?.name || 'Unknown Reporter'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userProfile?.email}
            </Typography>
          </>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              onNavigate(item.path);
              closeMobileDrawer?.();
            }}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ReporterSideBar;