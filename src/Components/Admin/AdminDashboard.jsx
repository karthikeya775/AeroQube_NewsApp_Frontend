import CategoryManagement from './CategoryManagement';

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, component: <Dashboard /> },
  { text: 'Content Management', icon: <FileText size={20} />, component: <ContentManagement /> },
  { text: 'Category Management', icon: <FolderTree size={20} />, component: <CategoryManagement /> },
  { text: 'User Management', icon: <Users size={20} />, component: <UserManagement /> },
  { text: 'Settings', icon: <Settings size={20} />, component: <Settings /> }
]; 