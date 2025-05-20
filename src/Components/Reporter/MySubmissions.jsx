import React, { useState,useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Stack,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  FileText,
  Tag,
} from 'lucide-react';
import { toast } from "sonner";

// Sample article data
const sampleArticles = [
  {
    id: 1,
    headline: "Climate Change Impact on Local Agriculture",
    title: "Climate Change Impact on Local Agriculture",
    category: "Environment",
    status: "published",
    submittedDate: "2023-05-10",
    publishedDate: "2023-05-12",
    summary: "An analysis of how climate change is affecting agricultural practices in local communities.",
    content: "Detailed analysis of climate change effects on farming practices...",
    tags: ["Climate", "Agriculture", "Local", "Environment"],
    image: "https://example.com/images/climate-change.jpg",
    imageCaption: "Local farmer examining drought-affected crops"
  },
  {
    id: 2,
    headline: "Startup Revolutionizing Online Education",
    title: "Startup Revolutionizing Online Education",
    category: "Technology",
    status: "pending",
    submittedDate: "2023-06-01",
    publishedDate: null,
    summary: "A new ed-tech startup introduces interactive AI-based learning for rural students.",
    content: "The startup aims to improve accessibility and engagement in online education...",
    tags: ["Education", "Technology", "AI", "Startup"],
    image: "https://example.com/images/edtech.jpg",
    imageCaption: "Students using tablets in a rural classroom"
  },
  {
    id: 3,
    headline: "Healthcare Access Improves in Remote Villages",
    title: "Healthcare Access Improves in Remote Villages",
    category: "Health",
    status: "published",
    submittedDate: "2023-07-15",
    publishedDate: "2023-07-18",
    summary: "Mobile clinics and telemedicine bring healthcare to underserved areas.",
    content: "Remote healthcare programs are seeing promising results...",
    tags: ["Healthcare", "Remote", "Telemedicine", "Villages"],
    image: "https://example.com/images/mobile-health.jpg",
    imageCaption: "Mobile health unit parked near a village center"
  },
  {
    id: 4,
    headline: "Local Artist Gains Global Recognition",
    title: "Local Artist Gains Global Recognition",
    category: "Culture",
    status: "published",
    submittedDate: "2023-08-05",
    publishedDate: "2023-08-07",
    summary: "A painter from a small town gets featured in a global art exhibition.",
    content: "His artwork reflects traditional themes through a modern lens...",
    tags: ["Art", "Culture", "Exhibition", "Recognition"],
    image: "https://example.com/images/artist.jpg",
    imageCaption: "The artist standing next to his featured painting"
  },
  {
    id: 5,
    headline: "Major Breakthrough in Renewable Energy Storage",
    title: "Major Breakthrough in Renewable Energy Storage",
    category: "Science",
    status: "published",
    submittedDate: "2023-09-12",
    publishedDate: "2023-09-14",
    summary: "Scientists develop a low-cost battery that could transform energy grids.",
    content: "The new technology offers long-duration energy storage at reduced costs...",
    tags: ["Energy", "Renewables", "Battery", "Innovation"],
    image: "https://example.com/images/battery-tech.jpg",
    imageCaption: "Prototype battery storage units in a lab"
  },
  {
    id: 6,
    headline: "Water Scarcity Looms in Urban Centers",
    title: "Water Scarcity Looms in Urban Centers",
    category: "Environment",
    status: "pending",
    submittedDate: "2023-10-02",
    publishedDate: null,
    summary: "Urban water demand exceeds supply amid climate stress and infrastructure delays.",
    content: "Cities are grappling with outdated water systems and rising demand...",
    tags: ["Water", "Urban", "Environment", "Crisis"],
    image: "https://example.com/images/water-scarcity.jpg",
    imageCaption: "People lining up at a public water tap"
  },
  {
    id: 7,
    headline: "Women-Led Businesses Drive Local Economy",
    title: "Women-Led Businesses Drive Local Economy",
    category: "Business",
    status: "pending",
    submittedDate: "2023-11-10",
    publishedDate: null,
    summary: "Entrepreneurship among women is fueling growth in regional markets.",
    content: "Access to microloans and mentorship has helped many women succeed...",
    tags: ["Women", "Entrepreneurship", "Business", "Local"],
    image: "https://example.com/images/women-business.jpg",
    imageCaption: "A women-led shop bustling with customers"
  },
  {
    id: 8,
    headline: "Floods Displace Thousands in Coastal Areas",
    title: "Floods Displace Thousands in Coastal Areas",
    category: "Disaster",
    status: "rejected",
    submittedDate: "2023-12-01",
    publishedDate: null,
    summary: "Torrential rains cause severe flooding in low-lying coastal districts.",
    content: "Emergency services are working around the clock to evacuate residents...",
    tags: ["Flood", "Disaster", "Coastal", "Evacuation"],
    image: "https://example.com/images/flood.jpg",
    imageCaption: "A rescue boat navigating through flooded streets"
  },
  {
    id: 9,
    headline: "Electric Vehicles Adoption Surges in Metro Cities",
    title: "Electric Vehicles Adoption Surges in Metro Cities",
    category: "Technology",
    status: "rejected",
    submittedDate: "2024-01-15",
    publishedDate: null,
    summary: "EV sales hit a new high as cities push for clean mobility.",
    content: "Incentives and infrastructure are fueling the shift toward electric vehicles...",
    tags: ["EV", "Mobility", "Technology", "Sustainability"],
    image: "https://example.com/images/electric-vehicle.jpg",
    imageCaption: "Charging station crowded with EVs"
  },
  {
    id: 10,
    headline: "Revival of Indigenous Languages Through Education",
    title: "Revival of Indigenous Languages Through Education",
    category: "Education",
    status: "draft",
    submittedDate: "2024-02-22",
    publishedDate: null,
    summary: "Schools integrate indigenous languages into the curriculum to preserve heritage.",
    content: "This initiative is seen as a way to maintain linguistic and cultural diversity...",
    tags: ["Language", "Education", "Culture", "Indigenous"],
    image: "https://example.com/images/language-class.jpg",
    imageCaption: "Children learning traditional script in a classroom"
  }
];


const MySubmissions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
   const [articles, setArticles] = useState(() => {
    const savedArticles = JSON.parse(localStorage.getItem('mySubmissions') || '[]');
    return savedArticles.length > 0 ? savedArticles : sampleArticles; // Fallback to sample data if empty
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
const [editFormData, setEditFormData] = useState({
  headline: '',
  summary: '',
  content: '',
  category: '',
  tags: [],
  image: '',
  imageCaption: ''
});

useEffect(() => {
    const handleStorageChange = () => {
      const savedArticles = JSON.parse(localStorage.getItem('mySubmissions') || '[]');
      setArticles(savedArticles.length > 0 ? savedArticles : sampleArticles);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const openActionMenu = (event, article) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(article);
  };
  
  const closeActionMenu = () => {
    setAnchorEl(null);
  };
  
  const handleViewArticle = () => {
    setOpenViewDialog(true);
    closeActionMenu();
  };
  
 const handleEditArticle = () => {
  setEditFormData({
    headline: selectedArticle.headline,
    summary: selectedArticle.summary,
    content: selectedArticle.content,
    category: selectedArticle.category,
    tags: selectedArticle.tags || [],
    image: selectedArticle.image,
    imageCaption: selectedArticle.imageCaption
  });
  setOpenEditDialog(true);
  closeActionMenu();
  setOpenViewDialog(false);
};

// Add these handler functions
const handleEditFormChange = (e) => {
  setEditFormData({
    ...editFormData,
    [e.target.name]: e.target.value
  });
};

const handleTagAdd = (newTag) => {
  if (newTag && !editFormData.tags.includes(newTag)) {
    setEditFormData({
      ...editFormData,
      tags: [...editFormData.tags, newTag]
    });
  }
};

const handleTagDelete = (tagToDelete) => {
  setEditFormData({
    ...editFormData,
    tags: editFormData.tags.filter(tag => tag !== tagToDelete)
  });
};

const handleEditSubmit = () => {
  const updatedArticle = {
    ...selectedArticle,
    headline: editFormData.headline,
    title: editFormData.headline, // Update title to match headline
    summary: editFormData.summary,
    content: editFormData.content,
    category: editFormData.category,
    tags: editFormData.tags,
    status: "pending", // Change status to pending
    submittedDate: new Date().toISOString().split('T')[0], // Update submission date
    publishedDate: null // Reset published date
  };

  // Update the articles array with the new article
  setArticles(prevArticles => 
    prevArticles.map(article => 
      article.id === selectedArticle.id ? updatedArticle : article
    )
  );

  // Show success message
  toast({
    title: "Article Updated",
    description: `Article "${editFormData.headline}" has been submitted for review`,
  });

  // Close the dialog
  setOpenEditDialog(false);
  // Clear selected article
  setSelectedArticle(null);
};
  
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    closeActionMenu();
  };
  
  const handleConfirmDelete = () => {
  // Remove article from state
  const updatedArticles = articles.filter(article => article.id !== selectedArticle.id);
  setArticles(updatedArticles);
  
  // Update localStorage
  localStorage.setItem('mySubmissions', JSON.stringify(updatedArticles));

  toast({
    title: "Article Deleted",
    description: `Article "${selectedArticle.title}" has been deleted`,
  });
  
  setOpenDeleteDialog(false);
  setSelectedArticle(null);
};
  
  // Filter articles based on search and tab selection
  const filterArticles = () => {
  const statusFilters = ["all", "published", "pending", "draft", "rejected"];
  const currentStatusFilter = statusFilters[tabValue];
  
  return articles.filter(article => {
    // Filter by status tab
    if (currentStatusFilter !== "all" && article.status !== currentStatusFilter) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm &&
      !article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !article.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
};
  
  const filteredArticles = filterArticles();
  
  // Helper function to get status chip color
  const getStatusColor = (status) => {
  switch (status) {
    case "published":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    case "draft":
      return "info";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "published":
      return <Check size={16} />;
    case "pending":
      return <Clock size={16} />;
    case "rejected":
      return <AlertTriangle size={16} />;
    case "draft":
      return <FileText size={16} />;
    default:
      return null;
  }
};
  
  // Render table view for larger screens
  const renderTableView = () => (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submitted Date</TableCell>
            <TableCell>Published Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(article.status)}
                    label={article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    color={getStatusColor(article.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(article.submittedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {article.publishedDate 
                    ? new Date(article.publishedDate).toLocaleDateString() 
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={(e) => openActionMenu(e, article)}
                    size="small"
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  No articles found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
 const renderCardView = () => (
  <Stack spacing={2}>
    {filteredArticles.length > 0 ? (
      filteredArticles.map((article) => (
        <Card key={article.id} variant="outlined">
          <Box sx={{ overflowX: 'auto' }}>
            <CardContent sx={{ minWidth: 500 /* adjust as needed */ }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {article.title}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <IconButton
                    onClick={(e) => openActionMenu(e, article)}
                    size="small"
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <Chip
                  icon={getStatusIcon(article.status)}
                  label={article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  color={getStatusColor(article.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {article.category}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
                {article.summary.substring(0, 100)}...
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Submitted: {new Date(article.submittedDate).toLocaleDateString()}
                </Typography>
                {article.publishedDate && (
                  <Typography variant="caption" color="textSecondary">
                    Published: {new Date(article.publishedDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Box>
        </Card>
      ))
    ) : (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="textSecondary">
          No articles found
        </Typography>
      </Box>
    )}
  </Stack>
);

  
  return (
    <Box>
      <Typography variant="h4"  sx={{  mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        My Submissions
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
        <TextField
          placeholder="Search articles..."
          variant="outlined"
          size="small"
          fullWidth={isMobile}
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: '100%', sm: '300px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<FileText size={18} />}
          onSub
        >
          Submit New Article
        </Button> */}
      </Box>
      
      <Paper elevation={0} sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Articles" />
          <Tab label="Published" />
          <Tab label="Pending" />
          <Tab label="Drafts"  />
          <Tab label="Rejected" />
        </Tabs>
      </Paper>
      
      {/* Responsive view toggle */}
      {isMobile || isTablet ? renderCardView() : renderTableView()}
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActionMenu}
        PaperProps={{ elevation: 3 }}
      >
        <MenuItem onClick={handleViewArticle} sx={{ gap: 1.5 }}>
          <Eye size={18} />
          <Typography variant="body2">View</Typography>
        </MenuItem>
        
        {selectedArticle?.status !== "published" && (
          <MenuItem onClick={handleEditArticle} sx={{ gap: 1.5 }}>
            <Edit size={18} />
            <Typography variant="body2">Edit</Typography>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, color: 'error.main' }}>
          <Trash2 size={18} />
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>
      
     {selectedArticle && (
  <Dialog
    open={openViewDialog}
    onClose={() => setOpenViewDialog(false)}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: { minHeight: '80vh' }
    }}
  >
    <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
      Article Preview
    </DialogTitle>
    <DialogContent dividers sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Status and Category Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={getStatusIcon(selectedArticle.status)}
              label={selectedArticle.status.charAt(0).toUpperCase() + selectedArticle.status.slice(1)}
              color={getStatusColor(selectedArticle.status)}
              size="small"
            />
            <Chip label={selectedArticle.category} size="small" />
          </Box>
        </Grid>

        {/* Headline Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {selectedArticle.headline}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            Submitted on {new Date(selectedArticle.submittedDate).toLocaleDateString()}
            {selectedArticle.publishedDate && 
              ` • Published on ${new Date(selectedArticle.publishedDate).toLocaleDateString()}`
            }
          </Typography>
        </Grid>

        {/* Image Section */}
        {/* {selectedArticle.image && (
          <Grid item xs={12}>
            <Box sx={{ 
              width: '100%', 
              height: 300, 
              position: 'relative',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.imageCaption || selectedArticle.headline}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            {selectedArticle.imageCaption && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                {selectedArticle.imageCaption}
              </Typography>
            )}
          </Grid>
        )} */}

        {/* Summary Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedArticle.summary}
          </Typography>
        </Grid>

        {/* Content Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Content
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedArticle.content}
          </Typography>
        </Grid>

        {/* Tags Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {selectedArticle.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Feedback Section */}
        {selectedArticle.feedback && (
          <Grid item xs={12}>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'error.light', 
              borderRadius: 1,
              border: 1,
              borderColor: 'error.main' 
            }}>
              <Typography variant="subtitle2" color="error.dark">
                Editor Feedback:
              </Typography>
              <Typography variant="body2" color="error.dark">
                {selectedArticle.feedback}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </DialogContent>
    <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Button onClick={() => setOpenViewDialog(false)}>
        Close
      </Button>
      {selectedArticle.status !== "published" && (
        <Button 
          onClick={handleEditArticle} 
          color="primary"
          variant="contained"
        >
          Edit Article
        </Button>
      )}
    </DialogActions>

  </Dialog> 
)}


{/* Edit Dialog with improved design */}
<Dialog
  open={openEditDialog}
  onClose={() => setOpenEditDialog(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      minHeight: '80vh',
      borderRadius: 2,
      background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }
  }}
>
  <DialogTitle 
    sx={{ 
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      background: 'linear-gradient(45deg, #2196F3, #1976D2)',
      color: 'white',
      py: 2,
      '& .MuiTypography-root': {
        fontSize: '1.5rem',
        fontWeight: 600
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Edit size={24} />
      Edit Article
    </Box>
  </DialogTitle>

<DialogContent 
  dividers 
  sx={{ 
    p: 4,
    backgroundColor: '#fafafa',
    '& .MuiTextField-root': {
      backgroundColor: '#ffffff',
      borderRadius: 1,
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: '#2196F3',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#1976D2',
        }
      }
    }
  }}
>
  <Grid container spacing={3}>
    {/* Article Details Section */}
    <Grid item xs={12}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#1976D2', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileText size={20} />
          Article Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Headline"
              name="headline"
              value={editFormData.headline}
              onChange={handleEditFormChange}
              required
              sx={{ 
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976D2'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={editFormData.summary}
              onChange={handleEditFormChange}
              multiline
              rows={3}
              required
              helperText="Brief overview of your article"
              sx={{ 
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976D2'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={editFormData.content}
              onChange={handleEditFormChange}
              multiline
              rows={8}
              required
              helperText="Main content of your article"
              sx={{ 
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976D2'
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>

    {/* Category & Tags Section */}
    <Grid item xs={12}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#1976D2', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tag size={20} />
          Categories & Tags
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: '#1976D2' } }}>
                Category
              </InputLabel>
              <Select
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                required
                sx={{
                  backgroundColor: '#ffffff',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976D2'
                  }
                }}
              >
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Politics">Politics</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Health">Health</MenuItem>
                <MenuItem value="Environment">Environment</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Culture">Culture</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Add Tag"
              placeholder="Press Enter to add tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd(e.target.value);
                  e.target.value = '';
                }
              }}
              helperText="Press Enter to add multiple tags"
              sx={{ 
                backgroundColor: '#ffffff',
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976D2'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              p: 2, 
              borderRadius: 1,
              backgroundColor: editFormData.tags.length ? '#f5f5f5' : 'transparent'
            }}>
              {editFormData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                  size="small"
                  sx={{
                    background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                    color: '#1976D2',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #bbdefb, #90caf9)'
                    }
                  }}
                />
              ))}
              {editFormData.tags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </Grid>
</DialogContent>

  <DialogActions 
    sx={{ 
      p: 3, 
      borderTop: '1px solid rgba(0,0,0,0.1)',
      background: '#f8f9fa',
      gap: 2
    }}
  >
    <Button 
      onClick={() => setOpenEditDialog(false)}
      sx={{
        color: '#666',
        '&:hover': {
          background: '#f1f3f4'
        }
      }}
    >
      Cancel
    </Button>
    <Button 
      onClick={handleEditSubmit}
      variant="contained"
      sx={{
        background: 'linear-gradient(45deg, #2196F3, #1976D2)',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2, #1565C0)'
        }
      }}
    >
      Update Article
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
};

export default MySubmissions;