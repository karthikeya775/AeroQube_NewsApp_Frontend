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
  CircularProgress,
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
import { applicationService } from '../../services/application.service';
import { authService } from '../../services/auth.service';

const UserManagement = ({ userRole }) => {
  // Move all state declarations to the top
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reporters, setReporters] = useState([]);
  const [reportersLoading, setReportersLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', id: null });

  // Add useEffect to fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // Check for token before making request
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to access this feature');
          return;
        }

        const response = await applicationService.getAllApplications();
        
        if (response.success) {
          const formattedApplications = response.data.map(app => ({
            id: app._id,
            name: app.reporterId.name,
            email: app.reporterId.email,
            phone: app.reporterId.contact || 'Not provided',
            date: app.createdAt,
            status: app.status,
            bio: app.bio,
            currentAffiliation: app.organization || 'Not provided',
            documents: app.documents || [],
            avatarUrl: app.reporterId.profileImage || `https://ui-avatars.com/api/?name=${app.reporterId.name}`,
          }));
          setApplications(formattedApplications);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        if (error.statusCode === 401 || error.message.includes('Token')) {
          toast.error('Session expired. Please login again');
          // Optionally redirect to login page
          // navigate('/login');
        } else {
          toast.error(error.message || 'Failed to load applications');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Add useEffect to fetch reporters
  useEffect(() => {
    const fetchReporters = async () => {
      if (tabValue !== 1) return;
      
      try {
        setReportersLoading(true);
        const response = await authService.getReporters();
        
        if (response.success) {
          const formattedReporters = response.data.map(reporter => ({
            id: reporter._id,
            name: reporter.name,
            email: reporter.email,
            status: reporter.isActive ? 'active' : 'inactive',
            articles: reporter.articles?.length || 0,
            applicationDate: reporter.createdAt,
            avatar: reporter.profileImage || `https://ui-avatars.com/api/?name=${reporter.name}`,
            bio: reporter.bio || ''
          }));
          setReporters(formattedReporters);
        }
      } catch (error) {
        console.error('Failed to fetch reporters:', error);
        toast.error(error.message || 'Failed to load reporters');
      } finally {
        setReportersLoading(false);
      }
    };

    fetchReporters();
  }, [tabValue]);

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

  const handleConfirmAction = async () => {
    const { type, id } = confirmAction;
    try {
      if (type === 'activate' || type === 'deactivate') {
        const response = await authService.updateReporterStatus(
          id, 
          type === 'activate'
        );
        
        if (response.success) {
          setReporters(prev => prev.map(reporter => 
            reporter.id === id 
              ? { ...reporter, status: type === 'activate' ? 'active' : 'inactive' }
              : reporter
          ));
          toast.success(`Reporter ${type}d successfully`);
        }
      } else if (type === 'delete') {
        const response = await authService.deleteReporter(id);
        if (response.success) {
          setReporters(prev => prev.filter(reporter => reporter.id !== id));
          toast.success('Reporter removed successfully');
        }
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${type} reporter`);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  // Update the approve handler
  const handleApproveApplication = async (applicationId) => {
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, 'approved');
      if (response.success) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved' } 
            : app
        ));
        toast.success('Application approved successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to approve application');
    }
  };

  // Update the reject handler
  const handleRejectApplication = async (applicationId, reason) => {
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, 'rejected', reason);
      if (response.success) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected', rejectReason: reason } 
            : app
        ));
        toast.success('Application rejected successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reject application');
    }
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
      
      {tabValue === 0 && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReporterApplications 
            applications={filteredApplications} 
            userRole={userRole} 
            onApprove={handleApproveApplication}  
            onReject={handleRejectApplication} 
          />
        )
      )}
      
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
              {reportersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredReporters.length > 0 ? (
                filteredReporters.map((reporter) => (
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
                ))
              ) : (
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
