import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Checkbox, 
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  User, 
  Mail, 
  Phone, 
  FileText as FileTextIcon, 
  Image, 
  Shield as ShieldIcon, 
  Check 
} from 'lucide-react';

// Form validation schema
const reporterFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }),
  currentAffiliation: z.string().optional(),
  pastWork: z.string().optional(),
  profileImage: z.any().optional(),
  idDocument: z.any().refine(val => val?.length > 0, "ID document is required"),
  certificateDocument: z.any().optional(),
  agreementTerms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms' }),
});

const steps = ['Personal Information', 'Professional Background', 'Documentation', 'Terms & Submit'];

const ReporterRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(reporterFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      bio: '',
      currentAffiliation: '',
      pastWork: '',
      agreementTerms: false,
    }
  });
  
  const watchFiles = {
    profileImage: watch("profileImage"),
    idDocument: watch("idDocument"),
    certificateDocument: watch("certificateDocument"),
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data) => {
    try {
      const applications = JSON.parse(localStorage.getItem('reporterApplications') || '[]');
      
      const newApplication = {
        id: `APP-${Date.now()}`,
        ...data,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        email: JSON.parse(localStorage.getItem('currentUser')).email
      };

      applications.push(newApplication);
      localStorage.setItem('reporterApplications', JSON.stringify(applications));

      toast.success('Application submitted successfully!');
      navigate('/reporter-application/dashboard');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Application submission error:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: `2px dashed ${theme.palette.primary.main}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {profilePreview ? (
                    <Avatar 
                      src={profilePreview} 
                      sx={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <User size={48} color={theme.palette.primary.main} />
                  )}
                </Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Image size={16} />}
                  sx={{ mb: 2 }}
                >
                  Upload Photo
                  <Controller
                    name="profileImage"
                    control={control}
                    render={({ field }) => (
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleProfileImageChange(e);
                        }}
                      />
                    )}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" align="center">
                  Optional: This photo may appear with your published articles
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          variant="outlined"
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                          InputProps={{
                            startAdornment: <User size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          variant="outlined"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: <Mail size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          variant="outlined"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          InputProps={{
                            startAdornment: <Phone size={18} color={theme.palette.text.secondary} style={{ marginRight: 8 }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Professional Bio"
                    variant="outlined"
                    error={!!errors.bio}
                    helperText={errors.bio?.message || "Tell us about your journalistic background and expertise (minimum 50 characters)"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="currentAffiliation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Current Affiliation"
                    variant="outlined"
                    placeholder="Current publication, news outlet, etc. (Optional)"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="pastWork"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Past Work Experience"
                    variant="outlined"
                    placeholder="Previous publications, organizations, etc. (Optional)"
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Required Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please upload the necessary documents to verify your identity and credentials
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileTextIcon size={24} color={theme.palette.primary.main} />
                  <Typography variant="subtitle1" sx={{ ml: 2 }}>
                    Identification Document
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please provide a government-issued ID (passport, driver's license, etc.)
                </Typography>
                <Controller
                  name="idDocument"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<Upload size={16} />}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Upload ID Document
                        <input
                          hidden
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </Button>
                      {errors.idDocument && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {errors.idDocument.message}
                        </Typography>
                      )}
                      {watchFiles.idDocument?.[0] && (
                        <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <Check size={16} style={{ marginRight: 4 }} /> 
                          {watchFiles.idDocument[0].name}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShieldIcon size={24} color={theme.palette.primary.main} />
                  <Typography variant="subtitle1" sx={{ ml: 2 }}>
                    Professional Credentials (Optional)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Press pass, letter from publication, or professional certification
                </Typography>
                <Controller
                  name="certificateDocument"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<Upload size={16} />}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Upload Credentials
                        <input
                          hidden
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </Button>
                      {watchFiles.certificateDocument?.[0] && (
                        <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <Check size={16} style={{ marginRight: 4 }} />
                          {watchFiles.certificateDocument[0].name}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Paper>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Terms & Conditions
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 3,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              <Typography variant="body2" paragraph>
                By becoming a reporter for our platform, you agree to adhere to the following principles:
              </Typography>
              <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
                <li>I will report factual news and verify all information before submitting content.</li>
                <li>I will maintain journalistic integrity and avoid conflicts of interest.</li>
                <li>I will respect privacy and confidentiality where appropriate.</li>
                <li>I will be transparent about my sources and methods.</li>
                <li>I understand my submissions may be reviewed by editors before publication.</li>
                <li>I accept that the platform has final editorial discretion on all content.</li>
              </Typography>
            </Paper>
            <Controller
              name="agreementTerms"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      color="primary"
                    />
                  }
                  label="I agree to the terms and conditions"
                />
              )}
            />
            {errors.agreementTerms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {errors.agreementTerms.message}
              </Typography>
            )}
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          my: 8, 
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Become a Reporter
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our network of trusted journalists and share your perspective with the world
          </Typography>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ 
                    px: 4,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)'
                  }}
                >
                  Submit Application
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    px: 4,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ReporterRegistration;