import React from "react";
import { 
  List, 
  ListItem,
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography,
  Divider
} from "@mui/material";
import { 
  LayoutDashboard, 
  FileText,
  Users,
  FolderTree,
  Settings,
  FileEdit,
  MessageCircle
} from "lucide-react";

const AdminSidebar = ({ 
  userRole, 
  currentSection, 
  setCurrentSection,
  closeMobileDrawer
}) => {
  // Define navigation items based on role
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin"]
    },
    {
      id: "content",
      label: "Content Management",
      icon: <FileText size={20} />,
      roles: ["admin"]
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={20} />,
      roles: ["admin"]
    },
    
    {
      id: "settings",
      label: "System Settings",
      icon: <Settings size={20} />,
      roles: ["admin"]
    }
  ];
  
  const handleNavClick = (sectionId) => {
    setCurrentSection(sectionId);
    closeMobileDrawer();
  };
  
  // Filter items by role
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ fontWeight: 500, textTransform: "uppercase" }}
        >
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access
        </Typography>
      </Box>
      
      <List sx={{ px: 1 }}>
        {filteredItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentSection === item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{ 
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 2, mb: 2 }} />
      
      <Box sx={{ px: 3, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminSidebar;