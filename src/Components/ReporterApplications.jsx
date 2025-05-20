import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  TablePagination,
  Link
} from '@mui/material';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ReporterApplications = ({ applications ,userRole,  onApprove, 
  onReject}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sample data for reporter applications
  console.log("Applications:", applications);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  
  const handleApproveApplication = (applicationId) => {
    onApprove(applicationId); // Call parent callback instead of directly modifying
    toast.success("Application approved successfully");
    handleCloseDialog();
  };
  
  const handleRejectApplication = (applicationId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    onReject(applicationId, rejectReason); // Call parent callback with reason
    toast.success("Application rejected successfully");
    handleCloseRejectDialog();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
  };
  
  const handleOpenRejectDialog = (application) => {
    setSelectedApplication(application);
    setRejectReason('');
    setOpenRejectDialog(true);
  };
  
  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
  };
  
  // const handleApproveApplication = (applicationId) => {
  //   const updatedApplications = applications.map(app => 
  //     app.id === applicationId ? { ...app, status: 'approved' } : app
  //   );
  //   setApplications(updatedApplications);
  //   toast.success("Application approved successfully");
  //   handleCloseDialog();
  // };
  
  // const handleRejectApplication = (applicationId) => {
  //   if (!rejectReason.trim()) {
  //     toast.error("Please provide a reason for rejection");
  //     return;
  //   }
    
  //   const updatedApplications = applications.map(app => 
  //     app.id === applicationId ? { ...app, status: 'rejected', rejectReason } : app
  //   );
  //   setApplications(updatedApplications);
  //   toast.success("Application rejected successfully");
  //   handleCloseRejectDialog();
  // };

  // Format relative time from ISO string
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get status variant for chip display
  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'success',
          icon: <CheckCircle size={14} />
        };
      case 'rejected':
        return {
          color: 'error',
          icon: <XCircle size={14} />
        };
      default:
        return {
          color: 'warning',
          icon: <AlertCircle size={14} />
        };
    }
  };
  
  // Displayed applications based on pagination
  const displayedApplications = applications
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Reporter Applications
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {isMobile ? (
          // Mobile card view
          <Box sx={{ p: 2 }}>
            {displayedApplications.map((application) => (
              <Card key={application.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={application.avatarUrl}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{application.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {application.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={application.status.toUpperCase()}
                      size="small"
                      color={getStatusVariant(application.status).color}
                      icon={getStatusVariant(application.status).icon}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Applied {formatRelativeTime(application.date)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {application.currentAffiliation}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Eye size={16} />}
                      fullWidth
                      onClick={() => handleViewApplication(application)}
                    >
                      View Application
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          // Desktop table view
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Current Affiliation</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedApplications.map((application) => (
                  <TableRow key={application.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={application.avatarUrl}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body1">
                            {application.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{application.email}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {application.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatRelativeTime(application.date)}
                    </TableCell>
                    <TableCell>
                      {application.currentAffiliation}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={application.status.toUpperCase()}
                        size="small"
                        color={getStatusVariant(application.status).color}
                        icon={getStatusVariant(application.status).icon}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => handleViewApplication(application)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={applications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Application Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={selectedApplication.avatarUrl}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{selectedApplication.name}</Typography>
                  <Chip
                    label={selectedApplication.status.toUpperCase()}
                    size="small"
                    color={getStatusVariant(selectedApplication.status).color}
                    icon={getStatusVariant(selectedApplication.status).icon}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <User size={18} style={{ marginRight: 8 }} />
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ ml: 3.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Mail size={16} style={{ marginRight: 8, opacity: 0.7 }} />
                      <Typography variant="body2">{selectedApplication.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone size={16} style={{ marginRight: 8, opacity: 0.7 }} />
                      <Typography variant="body2">{selectedApplication.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Calendar size={16} style={{ marginRight: 8, opacity: 0.7 }} />
                      <Typography variant="body2">
                        Applied on {new Date(selectedApplication.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Professional Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Professional Details
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Current Affiliation:</strong> {selectedApplication.currentAffiliation}
                  </Typography>
                </Grid>
                
                {/* Bio */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Professional Bio
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedApplication.bio}
                  </Typography>
                </Grid>
                
                {/* Documents */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Uploaded Documents
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedApplication.documents.map((doc, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileText size={18} style={{ marginRight: 8 }} />
                        <Link href="#" underline="hover">
                          {doc}
                        </Link>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                {/* If rejected, show reason */}
                {selectedApplication.status === 'rejected' && selectedApplication.rejectReason && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" color="error" gutterBottom>
                      Rejection Reason
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedApplication.rejectReason}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">Close</Button>
              
              {selectedApplication.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleOpenRejectDialog(selectedApplication)} 
                    color="error"
                    variant="outlined"
                    startIcon={<XCircle size={16} />}
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproveApplication(selectedApplication.id)} 
                    color="success"
                    variant="contained"
                    startIcon={<CheckCircle size={16} />}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Reject Application Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Please provide a reason for rejecting the application from <strong>{selectedApplication?.name}</strong>.
            This will be included in the notification sent to the applicant.
          </Typography>
          <TextField
            autoFocus
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={() => handleRejectApplication(selectedApplication?.id)} 
            color="error"
            variant="contained"
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReporterApplications;