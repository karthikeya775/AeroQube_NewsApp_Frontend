import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  X,
  Briefcase,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import { applicationService } from '../services/application.service';

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
  
  // Add console.log to handlers to debug
  const handleApproveApplication = async (applicationId) => {
    try {
      if (!applicationId) {
        toast.error('Invalid application ID');
        return;
      }

      const verificationData = {
        status: 'accepted',
        message: 'Congratulations! Your application has been accepted.',
        role: 'reporter'
      };

      const response = await applicationService.verifyApplication(applicationId, verificationData);
      console.log('Approval response:', response);
      
      if (response.success) {
        // Update the selected application status
        setSelectedApplication(prev => ({
          ...prev,
          status: 'accepted'
        }));

        // Call the onApprove callback to update parent component
        if (typeof onApprove === 'function') {
          onApprove(applicationId);
        }

        toast.success('Application accepted successfully');
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Approve application error:', error);
      toast.error(error.message || 'Failed to accept application');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      if (!applicationId) {
        toast.error('Invalid application ID');
        return;
      }

      if (!rejectReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }

      const verificationData = {
        status: 'rejected',
        message: rejectReason,
        role: 'user'
      };

      const response = await applicationService.verifyApplication(applicationId, verificationData);
      console.log('Rejection response:', response);
      
      if (response.success) {
        // Update the selected application status and add reject reason
        setSelectedApplication(prev => ({
          ...prev,
          status: 'rejected',
          rejectReason: rejectReason
        }));

        // Call the onReject callback to update parent component
        if (typeof onReject === 'function') {
          onReject(applicationId);
        }

        toast.success('Application rejected successfully');
        handleCloseRejectDialog();
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Reject application error:', error);
      toast.error(error.message || 'Failed to reject application');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleViewApplication = (application) => {
    console.log('Setting selected application:', application); // Debug log
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
      case 'accepted':  // Changed from 'approved' to 'accepted'
        return {
          color: 'success',
          icon: <CheckCircle size={14} />
        };
      case 'rejected':
        return {
          color: 'error',
          icon: <XCircle size={14} />
        };
      case 'pending':   // Added pending case explicitly
        return {
          color: 'warning',
          icon: <AlertCircle size={14} />
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

  // Add at the top of your component
  useEffect(() => {
    console.log('Applications prop:', applications);
    // Validate application structure
    if (applications?.length > 0) {
      console.log('Sample application structure:', {
        id: applications[0]._id,
        status: applications[0].status,
        name: applications[0].name
      });
    }
  }, [applications]);

  // Add this useEffect to monitor status changes
  useEffect(() => {
    console.log('Selected application status:', selectedApplication?.status);
  }, [selectedApplication?.status]);

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
  PaperProps={{
    sx: {
      borderRadius: '12px',
      overflow: 'hidden'
    }
  }}
>
  {selectedApplication && (
    <>
      <Box sx={{ 
        position: 'relative', 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 4,
        px: 3
      }}>
        <IconButton 
          onClick={handleCloseDialog}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <X size={18} />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 2
        }}>
          <Avatar 
            src={selectedApplication.avatarUrl}
            sx={{ 
              width: 80, 
              height: 80,
              border: '3px solid white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          />
          <Box sx={{ 
            textAlign: { xs: 'center', sm: 'left' },
            mt: { xs: 1, sm: 0 }
          }}>
            <Typography variant="h5" fontWeight="bold">{selectedApplication.name}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
              {selectedApplication.currentAffiliation}
            </Typography>
            <Chip
              label={selectedApplication.status.toUpperCase()}
              size="small"
              color={getStatusVariant(selectedApplication.status).color}
              icon={getStatusVariant(selectedApplication.status).icon}
              sx={{ 
                fontWeight: 'bold',
                borderRadius: '8px',
                '& .MuiChip-icon': {
                  fontSize: '1rem'
                }
              }}
            />
          </Box>
        </Box>
      </Box>
      
      <DialogContent sx={{ px: 3, py: 4 }}>
        <Grid container spacing={4}>
          {/* Application Summary */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '10px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              mb: 3
            }}>
              <Box sx={{ 
                bgcolor: 'primary.light', 
                py: 1.5, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Calendar size={18} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Application Summary
                </Typography>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5,
                      bgcolor: 'background.paper',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Calendar size={20} color={theme.palette.text.secondary} style={{ marginRight: 10 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Applied On</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(selectedApplication.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5,
                      bgcolor: 'background.paper',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <FileText size={20} color={theme.palette.text.secondary} style={{ marginRight: 10 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Documents</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {selectedApplication.documents.length} Attached
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: '10px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Box sx={{ 
                bgcolor: 'info.light', 
                py: 1.5, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <User size={18} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Information
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', width: 36, height: 36 }}>
                      <Mail size={18} color={theme.palette.info.main} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email Address</Typography>
                      <Typography variant="body2" fontWeight="medium">{selectedApplication.email}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.light', width: 36, height: 36 }}>
                      <Phone size={18} color={theme.palette.info.main} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                      <Typography variant="body2" fontWeight="medium">{selectedApplication.phone}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: '10px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              height: '100%'
            }}>
              <Box sx={{ 
                bgcolor: 'success.light', 
                py: 1.5, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Briefcase size={18} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Professional Details
                </Typography>
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                      <Building size={18} color={theme.palette.success.main} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Current Affiliation</Typography>
                      <Typography variant="body2" fontWeight="medium">{selectedApplication.currentAffiliation}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Bio */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '10px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ 
                bgcolor: 'warning.light', 
                py: 1.5, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <FileText size={18} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Professional Bio
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body2" sx={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line'
                }}>
                  {selectedApplication.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Documents */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '10px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ 
                bgcolor: 'secondary.light', 
                py: 1.5, 
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <FileText size={18} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Uploaded Documents
                </Typography>
              </Box>
              <CardContent>
                <Grid container spacing={2}>
                  {selectedApplication.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          bgcolor: 'background.paper'
                        }
                      }}>
                        <Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}>
                          <FileText size={20} color={theme.palette.secondary.main} />
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {doc}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            View Document
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* If rejected, show reason */}
          {selectedApplication.status === 'rejected' && selectedApplication.rejectReason && (
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: '10px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                borderLeft: '4px solid',
                borderColor: 'error.main'
              }}>
                <Box sx={{ 
                  bgcolor: 'error.light', 
                  py: 1.5, 
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AlertCircle size={18} />
                  <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                    Rejection Reason
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="body2" sx={{ 
                    lineHeight: 1.7,
                    fontStyle: 'italic'
                  }}>
                    {selectedApplication.rejectReason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2.5, 
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Button 
          onClick={handleCloseDialog} 
          color="inherit"
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            px: 3
          }}
        >
          Close
        </Button>
        
        {/* Debug log for condition */}
        {console.log('Status check:', {
          status: selectedApplication?.status,
          isPending: selectedApplication?.status?.toLowerCase() === 'pending'
        })}
        
        {selectedApplication?.status?.toLowerCase() === 'pending' && (
          <>
            <Button 
              onClick={() => {
                console.log('Reject button clicked'); // Debug log
                handleOpenRejectDialog(selectedApplication);
              }}
              color="error"
              variant="outlined"
              startIcon={<XCircle size={16} />}
              sx={{ borderRadius: '8px', textTransform: 'none', px: 3 }}
            >
              Reject
            </Button>
            <Button 
              onClick={() => {
                console.log('Approve button clicked'); // Debug log
                // Use id instead of _id
                handleApproveApplication(selectedApplication.id);
              }}
              color="success"
              variant="contained"
              startIcon={<CheckCircle size={16} />}
              sx={{ borderRadius: '8px', textTransform: 'none', px: 3 }}
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
            onClick={() => selectedApplication?.id && handleRejectApplication(selectedApplication.id)}
            color="error"
            variant="contained"
            disabled={!selectedApplication?.id || !rejectReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReporterApplications;