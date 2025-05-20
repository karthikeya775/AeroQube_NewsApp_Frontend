import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
  FormHelperText,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Image,
  Paperclip,
  X,
  FileText,
  Send,
  Clock,
  Save,
   Bold,
  Italic,
  List,
  Link
} from 'lucide-react';
import { toast } from "sonner";

const ArticleSubmissionForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
  title: '',
  content: '',
  summary: '', // Optional field
  category: '',
  subCategory: '',
  location: '',
  tags: [],
  currentTag: '',
  coverImage: null,
  additionalImages: [],
});
  
  const [errors, setErrors] = useState({});
  const [isDraft, setIsDraft] = useState(false);
  
  // Sample categories for the dropdown
 const categorySubcategories = {
  Politics: ['National', 'International', 'Local', 'Elections'],
  Economy: ['Markets', 'Business', 'Finance', 'Trade'],
  Technology: ['AI', 'Cybersecurity', 'Innovation', 'Startups'],
  Health: ['Medical', 'Wellness', 'Research', 'Healthcare'],
  Education: ['Schools', 'Higher Education', 'Policy', 'Research'],
  Environment: ['Climate', 'Conservation', 'Energy', 'Sustainability'],
  Culture: ['Arts', 'Entertainment', 'Lifestyle', 'Food'],
  Sports: ['Football', 'Cricket', 'Olympics', 'Other Sports'],
};
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && formData.currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = formData.currentTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
        currentTag: '',
      });
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (newFiles.length > 0) {
      // In a real app, we would check file types and sizes here
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles],
      });
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  const removeFile = (fileToRemove) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== fileToRemove),
    });
  };
  
 const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }
  
  if (!formData.content.trim()) {
    newErrors.content = 'Content is required';
  } else if (formData.content.split(' ').length < 0) {
    newErrors.content = 'Content must be at least 800 words';
  } else if (formData.content.split(' ').length > 1500) {
    newErrors.content = 'Content must not exceed 1500 words';
  }
  
  if (!formData.category) {
    newErrors.category = 'Category is required';
  }

  // Only validate summary if it's not empty
  if (formData.summary && formData.summary.length > 200) {
    newErrors.summary = 'Summary must be 200 characters or less';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  
 // Update these functions
const handleSubmit = (e, submitType) => {
  e.preventDefault();
  
  if (validateForm()) {
    // Create new article data
    const articleData = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      headline: formData.title,
      category: formData.category,
      status: submitType === 'draft' ? 'draft' : 'pending', // Set status based on submitType
      submittedDate: new Date().toISOString().split('T')[0],
      publishedDate: null,
      summary: formData.summary || '',
      content: formData.content,
      tags: formData.tags,
      image: formData.coverImage ? URL.createObjectURL(formData.coverImage) : null,
      views: 0,
      author: 'Current User'
    };

    // Get existing submissions from localStorage
    const existingSubmissions = JSON.parse(localStorage.getItem('mySubmissions') || '[]');
    
    // Add new submission
    const updatedSubmissions = [...existingSubmissions, articleData];
    
    // Save to localStorage
    localStorage.setItem('mySubmissions', JSON.stringify(updatedSubmissions));

    toast({
      title: submitType === 'draft' ? "Draft Saved" : "Article Submitted",
      description: submitType === 'draft'
        ? "Your article has been saved as draft"
        : "Your article has been submitted for review",
    });

    // Reset form only if not saving as draft
    if (submitType !== 'draft') {
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: '',
        subCategory: '',
        location: '',
        tags: [],
        currentTag: '',
        coverImage: null,
        additionalImages: [],
      });
    }
  }
};

const handleSaveAsDraft = (e) => {
  e.preventDefault();
  handleSubmit(e, 'draft');
};

const handleSubmitForReview = (e) => {
  e.preventDefault();
  handleSubmit(e, 'pending');
};

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 }, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Submit New Article
        </Typography>
        
        <Stack direction="row" spacing={2}>
  <Button 
    variant="outlined" 
    startIcon={<Save size={18} />}
    onClick={handleSaveAsDraft}
  >
    Save as Draft
  </Button>
  <Button 
    variant="contained"
    startIcon={<Send size={18} />}
    onClick={handleSubmitForReview}
  >
    Submit for Review
  </Button>
</Stack>
      </Box>
      
      <Grid container spacing={3}>
        {/* Main form section */}
<Grid item xs={12} md={8} sx={{ width: { xs: '100vw', sm: '50vw', md: '50vw', lg: '50vw' } }}>
  <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 } }}>
    <TextField
      fullWidth
      label="Article Title"
      name="title"
      value={formData.title}
      onChange={handleChange}
      margin="normal"
      required
      error={!!errors.title}
      helperText={errors.title}
    />

    <TextField
      fullWidth
      label="Summary (Optional)"
      name="summary"
      value={formData.summary}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={2}
      placeholder="Write a brief summary of your article (max 200 characters)"
      error={!!errors.summary}
      helperText={errors.summary || `${formData.summary.length}/200 characters`}
    />
    
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Cover Image
      </Typography>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          mb: 2,
          position: 'relative',
          height: formData.coverImage ? '200px' : 'auto'
        }}
      >
        {formData.coverImage ? (
          <>
            <img
              src={URL.createObjectURL(formData.coverImage)}
              alt="Cover"
              style={{
                maxHeight: '180px',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'background.paper'
              }}
              onClick={() => setFormData({...formData, coverImage: null})}
            >
              <X size={18} />
            </IconButton>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              id="cover-image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({...formData, coverImage: e.target.files[0]});
                }
              }}
            />
            <label htmlFor="cover-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Image size={18} />}
              >
                Upload Cover Image
              </Button>
            </label>
          </>
        )}
      </Box>
    </Box>

    {/* Rich Text Editor-like content field */}
    <Box sx={{ mt: 3, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <Bold size={18} />
          </IconButton>
          <IconButton size="small">
            <Italic size={18} />
          </IconButton>
          <IconButton size="small">
            <List size={18} />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton size="small">
            <Link size={18} />
          </IconButton>
        </Stack>
      </Box>
      <TextField
        fullWidth
        name="content"
        value={formData.content}
        onChange={handleChange}
        multiline
        rows={15}
        placeholder="Write your article here..."
        error={!!errors.content}
        helperText={errors.content || `${formData.content.split(' ').filter(word => word.trim() !== '').length} words`}
        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
      />
    </Box>
  </Paper>
</Grid>
        
        {/* Sidebar section */}
<Grid item xs={12} md={4}>
  <Stack spacing={3}>
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Category and Subcategory */}
      <FormControl 
        fullWidth 
        margin="normal"
        error={!!errors.category}
      >
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="Category"
          required
        >
          {Object.keys(categorySubcategories).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {errors.category && (
          <FormHelperText>{errors.category}</FormHelperText>
        )}
      </FormControl>

      {formData.category && (
        <FormControl 
          fullWidth 
          margin="normal"
        >
          <InputLabel>Subcategory</InputLabel>
          <Select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            label="Subcategory"
          >
            {categorySubcategories[formData.category].map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Location field */}
      <TextField
        fullWidth
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
        placeholder="e.g., New Delhi, India"
      />

      {/* Tags section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Tags
        </Typography>
        <TextField
          fullWidth
          placeholder="Add tags..."
          name="currentTag"
          value={formData.currentTag}
          onChange={handleChange}
          onKeyDown={handleTagKeyDown}
          size="small"
          helperText="Press Enter to add a tag"
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {formData.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => removeTag(tag)}
              size="small"
            />
          ))}
        </Box>
      </Box>
    </Paper>
            
            {/* Guidelines card */}
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FileText size={20} color={theme.palette.primary.main} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Submission Guidelines
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" paragraph>
                  • Articles should be 800-1500 words
                </Typography>
                <Typography variant="body2" paragraph>
                  • Include proper citations for all facts
                </Typography>
                <Typography variant="body2" paragraph>
                  • Add at least one relevant image
                </Typography>
                <Typography variant="body2">
                  • Follow our style guide for formatting
                </Typography>
              </CardContent>
            </Card>
            
            {/* Status card */}
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Clock size={20} color={theme.palette.warning.main} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Review Process
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Alert severity="info" sx={{ mb: 2 }}>
                  Articles typically take 1-2 days to review
                </Alert>
                <Typography variant="body2">
                  After submission, your article will be reviewed by our editorial team.
                  You'll receive a notification when the status changes.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArticleSubmissionForm;