import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  TablePagination
} from "@mui/material";
import {
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { newsService } from '../../services/news.service';
import { authService } from '../../services/auth.service';
import axios from 'axios';
import { categoryService } from '../../services/category.service';

const ContentManagement = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [aiServicedNews, setAiServicedNews] = useState([]);
  const [loadingAiService, setLoadingAiService] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationLoading, setPaginationLoading] = useState(false);

  useEffect(() => {
    fetchArticles(0, rowsPerPage);
    fetchCategories();
  }, []);

  const fetchArticles = async (page = 0, limit = rowsPerPage) => {
    try {
      setLoading(page === 0);
      setPaginationLoading(page > 0);
      
      // Calculate offset properly
      const offset = page + 1 ;
      
      // Use the calculated values, not hardcoded ones
      const response = await newsService.getAllNews({
        limit,   // Use parameter
        offset,  // Use calculated offset
      });

      console.log('Fetched articles:', response);
      console.log("response.sucess",Array.isArray(response.data))
      
      if (response.success && response.data && Array.isArray(response.data.data)) {
        setTotalCount(response.data.totalCounts || response.data.data.length);
        
        console.log('Total count:', response.totalCount);
        // Rest of your code remains the same...
        const articlesWithReporters = await Promise.all(
          response.data.data.map(async (article) => {
            try {
              let reporterName = '';
              let reporterEmail = '';
              let editorName = '';
              let editorEmail = '';
  
              if (!article.reportedBy && !article.editedBy) {
                reporterName = 'AI Service';
              } else {
                if (article.reportedBy) {
                  const reporterResponse = await authService.getUserProfileById(article.reportedBy);
                  if (reporterResponse.success) {
                    reporterName = reporterResponse.data?.name || 'Unknown Reporter';
                    reporterEmail = reporterResponse.data?.email || '';
                  }
                }
  
                if (article.editedBy) {
                  const editorResponse = await authService.getUserProfileById(article.editedBy);
                  if (editorResponse.success) {
                    editorName = editorResponse.data?.name || '';
                    editorEmail = editorResponse.data?.email || '';
                  }
                }
              }
  
              return {
                ...article,
                reporterName,
                reporterEmail,
                editorName,
                editorEmail
              };
            } catch (error) {
              console.error('Error fetching user details:', error);
              return {
                ...article,
                reporterName: (!article.reportedBy && !article.editedBy) ? 'AI Service' : 'Unknown User',
                reporterEmail: '',
                editorName: '',
                editorEmail: ''
              };
            }
          })
        );
        
        setArticles(articlesWithReporters);
      } else {
        toast.error(response.message || 'Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('An error occurred while fetching articles');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };
  

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('An error occurred while fetching categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchArticles(newPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
    fetchArticles(0, newRowsPerPage);
  };

  const handleApproveArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'published'
      });
      
      if (response.success) {
        toast.success('Article published successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error('An error occurred while publishing the article');
    }
  };

  const handleRejectArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'rejected'
      });
      
      if (response.success) {
        toast.success('Article rejected successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to reject article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      toast.error('An error occurred while rejecting the article');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      const response = await newsService.deleteNews(articleId);
      
      if (response.success) {
        toast.success('Article deleted successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('An error occurred while deleting the article');
    }
  };

  const handleEditClick = (article) => {
    setEditFormData(article);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (!editFormData) return;

      const formData = new FormData();
      formData.append('title', editFormData.title);
      formData.append('content', editFormData.content);
      formData.append('summary', editFormData.summary || '');
      formData.append('category', editFormData.category?._id || '');
      formData.append('language', editFormData.language || 'English');
      formData.append('isFake', editFormData.isFake?.toString() || 'false');
      
      if (editFormData.tags && editFormData.tags.length > 0) {
        editFormData.tags.forEach(tag => {
          formData.append('tags[]', tag);
        });
      }

      if (editFormData.location) {
        formData.append('location', editFormData.location);
      }

      const response = await newsService.editNews(editFormData._id, formData);

      if (response.success) {
        toast.success('Article updated and moved to verified section');
        setOpenEditDialog(false);
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred while updating the article');
    }
  };

  const handleVerifyArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'accepted'
      });
      
      if (response.success) {
        toast.success('Article accepted and published successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to accept article');
      }
    } catch (error) {
      console.error('Error accepting article:', error);
      toast.error('An error occurred while accepting the article');
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      const response = await newsService.publishNews(articleId);
      
      if (response.success) {
        toast.success('Article published successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error('An error occurred while publishing the article');
    }
  };

  const handleGenerateAiService = async (articleId) => {
    try {
      const response = await newsService.generateAiService(articleId);
      if (response.success) {
        toast.success('AI service generation request sent successfully');
        fetchArticles(currentPage, rowsPerPage);
      } else {
        toast.error(response.message || 'Failed to generate AI service');
      }
    } catch (error) {
      console.error('Error generating AI service:', error);
      toast.error('An error occurred while generating AI service');
    }
  };

  // Filter contents based on tab, search term, and filters
  const filterContent = () => {
    const statusFilters = ["all", "pending", "verified", "published", "rejected"];
    const currentStatusFilter = statusFilters[tabValue];

    return articles.filter((item) => {
      if (currentStatusFilter !== "all") {
        if (item.status !== currentStatusFilter) {
          return false;
        }
      }

      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.reporterName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filterCategory && item.category?.name !== filterCategory) {
        return false;
      }

      if (filterStatus && item.status !== filterStatus) {
        return false;
      }

      return true;
    });
  };

  const filteredContent = filterContent();
  
  const openActionMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(0);
    fetchArticles(0, rowsPerPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterDialogOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleFilterApply = () => {
    setOpenFilterDialog(false);
    toast({
      title: "Filters Applied",
      description: "Content list has been filtered according to your criteria",
    });
  };

  const handleFilterReset = () => {
    setFilterCategory("");
    setFilterStatus("");
    setOpenFilterDialog(false);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteClick = () => {
    closeActionMenu();
    setConfirmDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      handleDeleteArticle(selectedItem._id);
    }
    setConfirmDeleteDialog(false);
    setSelectedItem(null);
  };

  const handleStatusUpdate = (articleId, newStatus) => {
    const updatedArticles = articles.map(article => 
      article.id === articleId 
        ? { ...article, status: newStatus, date: new Date().toISOString().split('T')[0] }
        : article
    );
    setArticles(updatedArticles);
  };

  const handleViewClick = () => {
    if (selectedItem) {
      console.log('Opening dialog with:', selectedItem);
      setOpenViewDialog(true);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    closeActionMenu();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'verified':
        return 'info';
      case 'accepted':
        return 'success';
      case 'published':
        return 'primary';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const isActionAllowed = (action, itemStatus) => {
    if (action === "view") return true;
    
    if (userRole === 'editor') {
      if (action === "edit" && itemStatus === "pending") return true;
      return false;
    }
    
    if (userRole === 'admin' || userRole === 'superadmin') {
      if (action === "edit") return true;
      if (action === "delete" && itemStatus !== "published") return true;
      return true;
    }
    
    return false;
  };

  const renderAiServiceButton = (item) => {
    if ((userRole === 'admin' || userRole === 'superadmin') && item.status === 'accepted') {
      const hasAiService = aiServicedNews.some(news => news._id === item._id);
      return (
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => handleGenerateAiService(item._id)}
          disabled={hasAiService || loadingAiService}
          sx={{ ml: 1 }}
        >
          {loadingAiService ? 'Generating...' : hasAiService ? 'AI Service Generated' : 'Generate AI Service'}
        </Button>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      p: 3,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{display:"flex",justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Content Management</Typography>
        {userRole !== "reporter" ? (
          <Button variant="contained" color="primary">
            Create New Content
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            Submit New Content
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Content" />
            <Tab label="Pending" />
            <Tab label="Verified" />
            <Tab label="Published" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <TextField
          placeholder="Search content..."
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
            onClick={handleFilterDialogOpen}
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

      <TableContainer component={Paper} elevation={0} sx={{
        flex: 1,
        mt: 2,
        '& .MuiTableCell-root': {
          px: 2,
          py: 1.5
        }
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
              {(userRole === 'admin' || userRole === 'editor') && (
                <TableCell align="right">Approve/Reject</TableCell>
              )}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginationLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={userRole === 'admin' || userRole === 'editor' ? 7 : 6} 
                  align="center" 
                  sx={{ py: 3 }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading more articles...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category?.name}</TableCell>
                  <TableCell>
                    <Box>
                      {!item.reportedBy && !item.editedBy ? (
                        <Typography variant="body2" color="primary">
                          AI Service
                        </Typography>
                      ) : (
                        <>
                          {item.reportedBy && (
                            <>
                              <Typography variant="body2">
                                Reported by: {item.reporterName}
                              </Typography>
                              {item.reporterEmail && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.reporterEmail}
                                </Typography>
                              )}
                            </>
                          )}
                          {item.editedBy && (
                            <>
                              <Typography variant="body2" color="primary">
                                Edited by: {item.editorName}
                              </Typography>
                              {item.editorEmail && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.editorEmail}
                                </Typography>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  {(userRole === 'admin' || userRole === 'editor') && (
                    <TableCell align="right">
                      {item.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          {userRole === 'editor' && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                      )}
                      {item.status === 'verified' && (userRole === 'admin' || userRole === 'superadmin') && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleVerifyArticle(item._id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleRejectArticle(item._id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <IconButton 
                      onClick={(e) => openActionMenu(e, item)}
                      size="small"
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={userRole === 'admin' || userRole === 'editor' ? 7 : 6} 
                  align="center" 
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No content items found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Component */}
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Articles per page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            '& .MuiTablePagination-toolbar': {
              px: 2
            }
          }}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActionMenu}
      >
        {isActionAllowed("view", selectedItem?.status || "") && (
          <MenuItem onClick={handleViewClick} sx={{ gap: 1.5 }}>
            <Eye size={18} />
            <Typography variant="body2">View</Typography>
          </MenuItem>
        )}
        {isActionAllowed("edit", selectedItem?.status || "") && (
          <MenuItem onClick={() => handleEditClick(selectedItem)} sx={{ gap: 1.5 }}>
            <Edit size={18} />
            <Typography variant="body2">Edit</Typography>
          </MenuItem>
        )}
        {isActionAllowed("delete", selectedItem?.status || "") && (
          <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, color: "error.main" }}>
            <Trash2 size={18} />
            <Typography variant="body2">Delete</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Content</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset} color="inherit">Reset</Button>
          <Button onClick={handleFilterDialogClose}>Cancel</Button>
          <Button onClick={handleFilterApply} variant="contained" color="primary">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          Article Preview
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                  color={getStatusColor(selectedItem.status)}
                  size="small"
                />
                <Chip label={selectedItem.category?.name} size="small" />
              </Box>

              <Typography variant="h5" gutterBottom>
                {selectedItem.title}
              </Typography>

              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                By {selectedItem.reporterName} ({selectedItem.reporterEmail}) • 
                Submitted on {new Date(selectedItem.createdAt).toLocaleDateString()}
                {selectedItem.publishedDate && 
                  ` • Published on ${new Date(selectedItem.publishedDate).toLocaleDateString()}`
                }
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                Summary
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedItem.summary}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Content
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedItem.content}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedItem.tags?.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleCloseViewDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          Edit Article
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {editFormData && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
              />

              <TextField
                fullWidth
                label="Summary"
                value={editFormData.summary || ''}
                onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Content"
                value={editFormData.content}
                onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                multiline
                rows={6}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editFormData.category?._id || ''}
                  onChange={(e) => {
                    const selectedCategory = categories.find(cat => cat._id === e.target.value);
                    setEditFormData({ 
                      ...editFormData, 
                      category: selectedCategory 
                    });
                  }}
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

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={editFormData.language || 'English'}
                  onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                  label="Language"
                  required
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

              <FormControl fullWidth>
                <InputLabel>Fake News Status</InputLabel>
                <Select
                  value={editFormData.isFake?.toString() || 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, isFake: e.target.value === 'true' })}
                  label="Fake News Status"
                  required
                >
                  <MenuItem value="false">Not Fake</MenuItem>
                  <MenuItem value="true">Fake</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Location"
                value={editFormData.location || ''}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {editFormData.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      const newTags = editFormData.tags.filter((_, i) => i !== index);
                      setEditFormData({ ...editFormData, tags: newTags });
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManagement;
