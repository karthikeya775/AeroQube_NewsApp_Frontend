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
  Paper
} from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import AdminSidebar from '../../Components/Admin/AdminSideBar';
import Dashboard from '../../Components/Admin/Dashboard';
import UserManagement from '../../Components/Admin/UserManagement';
import ContentManagement from '../../Components/Admin/ContentManagement';
import SettingsPanel from '../../Components/Reporter/SettingsPanel';

const drawerWidth = 240;

const AdminPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [userRole, setUserRole] = useState("admin");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard userRole={userRole} setCurrentSection={setCurrentSection} />;
      case "content":
        return <ContentManagement userRole={userRole} />;
      case "users":
        return <UserManagement userRole={userRole} />;
      case "settings":
        return <SettingsPanel userRole={userRole} />;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'black',
          color: 'white',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              News App Admin
            </Typography>
          </Box>

        {/* Role Switcher
          <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: { xs: 'flex-end', sm: 'flex-end', md: 'flex-end' },
  }}
>
  {["admin", "editor", "reporter"].map(role => (
    <Paper
      key={role}
      onClick={() => setUserRole(role)}
      sx={{
        px: 2,
        py: 1,
        cursor: 'pointer',
        backgroundColor: userRole === role ? 'primary.main' : 'background.paper',
        color: userRole === role ? 'primary.contrastText' : 'text.primary',
        transition: '0.3s',
        fontSize: { xs: '0.8rem', sm: '0.875rem' },
      }}
    >
      {role}
    </Paper>
  ))}
</Box> */}

        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile */}
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
          <AdminSidebar
            userRole={userRole}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            closeMobileDrawer={() => setMobileOpen(false)}
          />
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100vw', md: `calc(100vw - ${drawerWidth}px)` ,lg: `calc(100vw - ${drawerWidth}px)`},
          minHeight: '100vh',
          backgroundColor: 'background.default',
          overflowY: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {renderCurrentSection()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPanel;
