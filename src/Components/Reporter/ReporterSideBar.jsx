import React from "react";
import { 
  List, 
  ListItem,
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { 
  Layout,
    FileText,
    PenSquare,
  LayoutDashboard,
  FileEdit, 
  FilePlus,
  Bell,
  MessageCircle,
  Settings,
} from "lucide-react";

import {  useNavigate, useLocation} from 'react-router-dom';

const ReporterSideBar = ({ currentSection, setCurrentSection, closeMobileDrawer }) => {
   
    const navigate = useNavigate();
    const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
   
  const handleNavigation = (path) => {
    navigate(path);
    closeMobileDrawer?.();
  };

    // Define navigation items
 const navItems = [
    {
      label: 'Dashboard',
      icon: <Layout size={20} />,
      path: '/reporter/dashboard'
    },
    {
      label: 'My Submissions',
      icon: <FileText size={20} />,
      path: '/reporter/submissions'
    },
    {
      label: 'Submit Article',
      icon: <PenSquare size={20} />,
      path: '/reporter/submit'
    }
  ];
  
  const handleNavClick = (sectionId) => {
    setCurrentSection(sectionId);
    closeMobileDrawer();
  };
  
  const reporterInfo = {
    name: "Sarah Johnson",
    role: "Reporter",
    joinDate: "Member since May 2023"
  };
  
  return (
    <Box sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Reporter info */}
      <Box sx={{ px: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}
        >
          {reporterInfo.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {reporterInfo.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {reporterInfo.role}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {reporterInfo.joinDate}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
       <List>
      {navItems.map((item) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            selected={currentPath === item.path.split('/').pop()}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
    
      <Divider sx={{ mt: 2, mb: 2 }} />
      
      <Box sx={{ px: 3, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Reporter Portal v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default ReporterSideBar;