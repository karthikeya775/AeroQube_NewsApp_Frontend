import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Chip,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit3,
  Clock,
  X
} from 'lucide-react';
import { newsService } from '../../services/news.service';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';
// Assuming you have a userService or can use authService to get user details by ID
// import { userService } from '../../services/user.service'; // Or appropriate service
import { authService } from '../../services/auth.service';

const PendingArticles = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reporterNames, setReporterNames] = useState({});
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: '',
    summary: '',
    language: 'English',
    tags: [],
    location: '',
    isFake: false
  });
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoriesResponse = await categoryService.getAllCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        } else {
          toast.error('Failed to fetch categories');
        }

        // Fetch pending articles with pagination
        const response = await newsService.getNewsByStatus({ status: 'pending', limit: rowsPerPage, offset: currentPage * rowsPerPage });
        console.log("response",response);

        if (response.success) {
          let articlesArr = [];
          if (Array.isArray(response.data?.data)) {
            articlesArr = response.data.data;
          } else if (Array.isArray(response.data)) {
            articlesArr = response.data;
          } else {
            articlesArr = [];
          }
          setTotalCount(response.total || articlesArr.length);
          setArticles(articlesArr);

          const uniqueReporterIds = [...new Set(articlesArr.map(article => article.reportedBy).filter(id => id))];
          const names = {};
          await Promise.all(uniqueReporterIds.map(async (reporterId) => {
            try {
              const userResponse = await authService.getUserProfileById(reporterId);
              if (userResponse.success && userResponse.data?.name) {
                names[reporterId] = userResponse.data.name;
              } else {
                names[reporterId] = 'Unknown Reporter';
              }
            } catch (userError) {
              console.error(`Error fetching reporter details for ID ${reporterId}:`, userError);
              names[reporterId] = 'Unknown Reporter';
            }
          }));
          setReporterNames(names);
        } else {
          toast.error(response.message || 'Failed to fetch pending articles');
          setArticles([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An error occurred while fetching data');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [currentPage, rowsPerPage]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePreviewClick = (article) => {
    setSelectedArticle(article);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setEditFormData({
      title: article.title,
      content: article.content,
      category: article.category?._id || '',
      summary: article.summary || '',
      language: article.language || 'English',
      tags: article.tags || [],
      location: article.location || '',
      isFake: Boolean(article.isFake)
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (!selectedArticle?._id) {
        toast.error('No article selected for editing');
        return;
      }
  
      // Create FormData object
      const formData = new FormData();
  
      // Add all fields to FormData
      formData.append('title', editFormData.title);
      formData.append('content', editFormData.content);
      formData.append('category', editFormData.category || selectedArticle.category?._id);
      formData.append('language', editFormData.language || 'English');
      formData.append('location', editFormData.location || '');
      formData.append('isFake', String(editFormData.isFake));
  
      if (editFormData.summary) {
        formData.append('summary', editFormData.summary);
      }
  
      // Handle tags properly - ensure it's an array of strings
      if (editFormData.tags && editFormData.tags.length > 0) {
        // If tags is already an array, use it directly
        const tagsArray = Array.isArray(editFormData.tags) ? editFormData.tags : [editFormData.tags];
        // Append each tag individually
        tagsArray.forEach(tag => {
          formData.append('tags[]', tag);
        });
      }
  
      // Log the actual values being sent
      console.log('Form data values:', {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        language: formData.get('language'),
        location: formData.get('location'),
        isFake: formData.get('isFake'),
        summary: formData.get('summary'),
        tags: Array.from(formData.getAll('tags[]'))
      });
  
      const response = await newsService.editNews(selectedArticle._id, formData);
  
      if (response.success) {
        toast.success('Article updated successfully');
        setEditDialogOpen(false);
        // Refresh the articles list
        const updatedResponse = await newsService.getNewsByStatus('pending');
        if (updatedResponse.success && Array.isArray(updatedResponse.data)) {
          const pendingArticles = updatedResponse.data.filter(article => !article.editedBy);
          setArticles(pendingArticles);
        }
      } else {
        toast.error(response.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred while updating the article');
    }
  };
  

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: { xs: 3, sm: 4 },
          fontWeight: 600,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Pending Articles
      </Typography>

      {/* Search and Filter Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <TextField
          placeholder="Search articles..."
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

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Filter size={18} />}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowUpDown size={18} />}
          >
            Sort
          </Button>
        </Box>
      </Box>

      {/* Articles Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiTableCell-root': {
            px: 2,
            py: 1.5
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.category?.name}</TableCell>
                  <TableCell>{article.reportedBy ? reporterNames[article.reportedBy] || 'Fetching...' : 'N/A'}</TableCell>
                  <TableCell>
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() !== 'Invalid Date' ? new Date(article.createdAt).toLocaleDateString() : 'N/A' : 'N/A'}
                  </TableCell>
                  <TableCell>{article.location}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewClick(article)}
                      >
                        <Eye size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(article)}
                      >
                        <Edit3 size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No pending articles found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center', display: 'inline' }}>Rows per page:</Typography>
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            {[5, 10, 25, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Box>
        <Box>
          <Button onClick={() => handlePageChange(null, Math.max(currentPage, 1))} disabled={currentPage === 0}>
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center', display: 'inline' }}>
            Page {currentPage + 1} of {Math.ceil(totalCount / rowsPerPage) || 1}
          </Typography>
          <Button onClick={() => handlePageChange(null, currentPage + 2)} disabled={(currentPage + 1) * rowsPerPage >= totalCount}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Typography variant="h6">Article Preview</Typography>
          <IconButton onClick={() => setPreviewDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedArticle && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {selectedArticle.title}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedArticle.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Edit3 size={16} />}
            onClick={() => {
              setPreviewDialogOpen(false);
              handleEditClick(selectedArticle);
            }}
          >
            Edit Article
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Typography variant="h6">Edit Article</Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              required
            />
            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={editFormData.summary}
              onChange={handleEditFormChange}
              multiline
              rows={3}
              placeholder="Enter a brief summary of the article"
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={editFormData.content}
              onChange={handleEditFormChange}
              multiline
              rows={8}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={editFormData.location}
              onChange={handleEditFormChange}
            />
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={editFormData.language}
                onChange={handleEditFormChange}
                label="Language"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
                <MenuItem value="Bengali">Bengali</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
                <MenuItem value="Telugu">Telugu</MenuItem>
                <MenuItem value="Marathi">Marathi</MenuItem>
                <MenuItem value="Gujarati">Gujarati</MenuItem>
                <MenuItem value="Kannada">Kannada</MenuItem>
                <MenuItem value="Malayalam">Malayalam</MenuItem>
                <MenuItem value="Punjabi">Punjabi</MenuItem>
                <MenuItem value="Assamese">Assamese</MenuItem>
                <MenuItem value="Bhojpuri">Bhojpuri</MenuItem>
                <MenuItem value="Konkani">Konkani</MenuItem>
                <MenuItem value="Maithili">Maithili</MenuItem>
                <MenuItem value="Manipuri">Manipuri</MenuItem>
                <MenuItem value="Odia">Odia</MenuItem>
                <MenuItem value="Sanskrit">Sanskrit</MenuItem>
                <MenuItem value="Sindhi">Sindhi</MenuItem>
                <MenuItem value="Urdu">Urdu</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  name="isFake"
                  checked={Boolean(editFormData.isFake)}
                  onChange={handleEditFormChange}
                />
                <Typography>Mark as Fake News</Typography>
              </Box>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PendingArticles; 