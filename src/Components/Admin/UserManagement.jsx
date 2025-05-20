import React, { useState ,useEffect} from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
} from "@mui/material";
import {
  Search,
  Check,
  X,
  Eye,
  Trash2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import ReporterApplications from "../ReporterApplications";

// Sample data for reporters
const reporters = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    articles: 23,
    applicationDate: "2023-03-15",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    articles: 45,
    applicationDate: "2023-02-22",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    status: "inactive",
    articles: 12,
    applicationDate: "2023-04-10",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];


const UserManagement = ({ userRole }) => {

  const [applications, setApplications] = useState([
  { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@example.com', 
      phone: '+91 98765 43210',
      date: '2023-05-10T08:30:00Z',
      status: 'pending',
      bio: 'Experienced journalist with over 5 years covering technology and business news for major publications.',
      currentAffiliation: 'Freelance',
      documents: ['id_document.pdf', 'press_credentials.pdf'],
      avatarUrl: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      email: 'priya.s@example.com', 
      phone: '+91 87654 32109',
      date: '2023-05-09T14:20:00Z',
      status: 'approved',
      bio: 'Political correspondent with expertise in election coverage and policy analysis. Previously worked with Delhi Times.',
      currentAffiliation: 'Delhi Chronicle',
      documents: ['id_document.pdf', 'sample_work.pdf'],
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    { 
      id: 3, 
      name: 'David Wilson', 
      email: 'david.w@example.com', 
      phone: '+91 76543 21098',
      date: '2023-05-08T10:15:00Z',
      status: 'rejected',
      bio: 'Sports journalist specialized in cricket and football coverage with a focus on analytical reporting.',
      currentAffiliation: 'Sports Weekly',
      documents: ['id_document.pdf'],
      avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    { 
      id: 4, 
      name: 'Ananya Patel', 
      email: 'ananya.p@example.com', 
      phone: '+91 65432 10987',
      date: '2023-05-08T09:40:00Z',
      status: 'pending',
      bio: 'Environmental journalist covering climate change initiatives and sustainability practices across India.',
      currentAffiliation: 'Green Earth Magazine',
      documents: ['id_document.pdf', 'certificate.pdf', 'resume.pdf'],
      avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    { 
      id: 5, 
      name: 'Raj Kumar', 
      email: 'raj.k@example.com', 
      phone: '+91 54321 09876',
      date: '2023-05-07T16:50:00Z',
      status: 'pending',
      bio: 'Entertainment reporter covering Bollywood and regional cinema with extensive industry connections.',
      currentAffiliation: 'Film First',
      documents: ['id_document.pdf', 'press_pass.pdf'],
      avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
]);

 useEffect(() => {
    localStorage.setItem('reporterApplications', JSON.stringify(applications));
  }, [applications]);



  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', id: null });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
  };

  const openConfirmDialog = (type, id) => {
    setConfirmAction({ type, id });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    const { type, id } = confirmAction;
    
    if (type === 'approve') {
      toast({
        title: "Application Approved",
        description: "The reporter application has been approved",
      });
    } else if (type === 'reject') {
      toast({
        title: "Application Rejected",
        description: "The reporter application has been rejected",
      });
    } else if (type === 'delete') {
      toast({
        title: "Reporter Removed",
        description: "The reporter has been removed from the system",
      });
    } else if (type === 'deactivate') {
      toast({
        title: "Reporter Deactivated",
        description: "The reporter account has been deactivated",
      });
    } else if (type === 'activate') {
      toast({
        title: "Reporter Activated",
        description: "The reporter account has been activated",
      });
    }
    
    setConfirmDialogOpen(false);
  };

  const handleApproveApplication = (applicationId) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'approved' } 
        : app
    ));
    
    // Update localStorage
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: 'approved' } : app
    );
    localStorage.setItem('reporterApplications', JSON.stringify(updatedApplications));
  };

  const handleRejectApplication = (applicationId, reason) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected', rejectReason: reason } 
        : app
    ));
    
    // Update localStorage
    const updatedApplications = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected', rejectReason: reason } 
        : app
    );
    localStorage.setItem('reporterApplications', JSON.stringify(updatedApplications));
  };

  const filteredReporters = reporters.filter(reporter =>
    reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reporter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(application =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 , xs: 2, sm: 3, md: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Reporter Applications" />
          <Tab label="Current Reporters" />
        </Tabs>
      </Paper>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: "100%", sm: "300px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button 
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => {
            toast({
              title: "Refreshed",
              description: "User list has been refreshed",
            });
          }}
        >
          Refresh
        </Button>
      </Box>
      
      {tabValue === 0 &&
        <ReporterApplications applications={filteredApplications} userRole={userRole} onApprove={handleApproveApplication}  
      onReject={handleRejectApplication} />}
      
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reporter</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Articles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReporters.map((reporter) => (
                <TableRow key={reporter.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={reporter.avatar}
                        alt={reporter.name}
                        sx={{ mr: 2 }}
                      />
                      {reporter.name}
                    </Box>
                  </TableCell>
                  <TableCell>{reporter.email}</TableCell>
                  <TableCell>{reporter.articles}</TableCell>
                  <TableCell>
                    <Chip
                      label={reporter.status === "active" ? "Active" : "Inactive"}
                      color={reporter.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(reporter.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          toast({
                            title: "Email Sent",
                            description: `Email sent to ${reporter.name}`,
                          });
                        }}
                      >
                        <Mail size={18} />
                      </IconButton>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => handleViewDetails(reporter)}
                      >
                        View
                      </Button>
                      
                      {userRole === "admin" && (
                        <>
                          {reporter.status === "active" ? (
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => openConfirmDialog('deactivate', reporter.id)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() => openConfirmDialog('activate', reporter.id)}
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Trash2 size={16} />}
                            onClick={() => openConfirmDialog('delete', reporter.id)}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReporters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No reporters found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* View User Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {selectedUser.email}
                  </Typography>
                  <Chip
                    label={selectedUser.status === "active" ? "Active" : selectedUser.status === "inactive" ? "Inactive" : "Pending"}
                    color={
                      selectedUser.status === "active" 
                        ? "success" 
                        : selectedUser.status === "inactive" 
                        ? "default" 
                        : "warning"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              
              {selectedUser.bio && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Bio</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2">{selectedUser.bio}</Typography>
                  </Paper>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Details</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Application Date</Typography>
                    <Typography variant="body2">{new Date(selectedUser.applicationDate).toLocaleDateString()}</Typography>
                  </Box>
                  {selectedUser.articles && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="textSecondary">Articles Published</Typography>
                      <Typography variant="body2">{selectedUser.articles}</Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>
          {confirmAction.type === 'approve' && "Approve Application"}
          {confirmAction.type === 'reject' && "Reject Application"}
          {confirmAction.type === 'delete' && "Remove Reporter"}
          {confirmAction.type === 'deactivate' && "Deactivate Reporter"}
          {confirmAction.type === 'activate' && "Activate Reporter"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction.type === 'approve' && "Are you sure you want to approve this reporter application?"}
            {confirmAction.type === 'reject' && "Are you sure you want to reject this reporter application?"}
            {confirmAction.type === 'delete' && "Are you sure you want to remove this reporter from the system? This action cannot be undone."}
            {confirmAction.type === 'deactivate' && "Are you sure you want to deactivate this reporter account?"}
            {confirmAction.type === 'activate' && "Are you sure you want to activate this reporter account?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction}
            color={
              confirmAction.type === 'approve' || confirmAction.type === 'activate'
                ? 'success'
                : confirmAction.type === 'reject' || confirmAction.type === 'delete'
                ? 'error'
                : 'primary'
            }
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
