import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Typography,
  Avatar,
  Chip,
  alpha
} from '@mui/material';
import {
  LayoutDashboard,
  FileText,
  History
} from 'lucide-react';

const Navigation = ({ currentSection, setCurrentSection, mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, section: 'dashboard' },
    { text: 'Pending Articles', icon: <FileText size={20} />, section: 'pending' },
    { text: 'Edit History', icon: <History size={20} />, section: 'history' }
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)'
    }}>
      {/* Profile Section */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
        background: 'white'
      }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: theme.palette.primary.main,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '3px solid white'
          }}
        >
          E
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600}>
          Editor Name
        </Typography>
        <Typography variant="body2" color="text.secondary">
          editor@newsapp.com
        </Typography>
        <Chip 
          label="Editor" 
          size="small" 
          sx={{ 
            mt: 0.5,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            fontWeight: 500
          }} 
        />
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ 
        p: 2, 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
      }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ mb: 1 }}
            >
              <ListItemButton
                onClick={() => {
                  setCurrentSection(item.section);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                selected={currentSection === item.section}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiTypography-root': {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: currentSection === item.section ? theme.palette.primary.main : 'text.secondary'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: currentSection === item.section ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: 300 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 300,
            borderRight: '1px solid rgba(59, 130, 246, 0.1)'
          },
        }}
      >
        <Box sx={{ mt: '64px' }}>
          {drawer}
        </Box>
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 300,
            borderRight: '1px solid rgba(59, 130, 246, 0.1)',
            boxShadow: '1px 0 10px rgba(0, 0, 0, 0.05)'
          },
        }}
        open
      >
        <Box sx={{ mt: '64px' }}>
          {drawer}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navigation;
