import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return <Clock size={24} />;
    case 'approved':
      return <CheckCircle size={24} />;
    case 'rejected':
      return <XCircle size={24} />;
    default:
      return <AlertCircle size={24} />;
  }
};

const ReporterApplicationDashboard = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('reporterApplications') || '[]');
    const userApplication = applications.find(app => app.email === currentUser.email);
    setApplication(userApplication);
  }, [currentUser.email]);

  const activeStep = application ? {
    'pending': 1,
    'reviewing': 2,
    'approved': 3,
    'rejected': 3
  }[application.status] || 0 : 0;

  const renderApplicationStatus = () => {
    if (!application) {
      return (
        <Card sx={{ textAlign: 'center', py: 6, px: 4 }}>
          <FileText size={48} style={{ marginBottom: 16, color: '#666' }} />
          <Typography variant="h5" gutterBottom>
            No Application Found
          </Typography>
          <Typography color="text.secondary" paragraph>
            You haven't submitted a reporter application yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/reporter-application/apply')}
          >
            Start Application
          </Button>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Status Overview Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Application Status</Typography>
                <Chip
                  icon={getStatusIcon(application.status)}
                  label={application.status?.toUpperCase()}
                  color={getStatusColor(application.status)}
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
              
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                <Step>
                  <StepLabel>Submitted</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Under Review</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Decision</StepLabel>
                </Step>
              </Stepper>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <User size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Full Name"
                        secondary={application.fullName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Mail size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email"
                        secondary={application.email}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Phone size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone"
                        secondary={application.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Calendar size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Submitted On"
                        secondary={new Date(application.submittedAt).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submitted Documents
              </Typography>
              <List>
                {application.documents?.map((doc, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <FileCheck size={20} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={doc.name}
                      secondary={`Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Message */}
        {application.status === 'approved' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Congratulations! 🎉
              </Typography>
              <Typography>
                Your application has been approved. Check your email for login credentials and next steps.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6">Reporter Application Portal</Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderApplicationStatus()}
      </Container>
    </>
  );
};

export default ReporterApplicationDashboard;