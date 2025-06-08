import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Collapse
} from '@mui/material';
import { Edit, Delete, Plus, FolderTree, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { categoryService } from '../../services/category.service';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    parent: ''
  });
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      console.log("Fetched Categories : ", response);
      
      if (response.success) {
        // Only get parent categories (categories without a parent)
        const parentCategories = response.data.filter(category => !category.parent);
        setCategories(parentCategories);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('An error occurred while fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditMode(true);
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        parent: category.parent || ''
      });
    } else {
      setEditMode(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        parent: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      parent: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const categoryData = {
        name: formData.name,
        ...(formData.parent && { parent: formData.parent })
      };

      if (editMode) {
        const response = await categoryService.updateCategory(selectedCategory._id, categoryData);
        if (response.success) {
          toast.success('Category update request sent');
          setTimeout(() => {
            fetchCategories();
          }, 1000);
        }
      } else {
        const response = await categoryService.createCategory(categoryData);
        if (response.success) {
          toast.success('Category creation request sent');
          setTimeout(() => {
            fetchCategories();
          }, 1000);
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await categoryService.deleteCategory(categoryId);
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const renderCategoryRow = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <React.Fragment key={category._id}>
        <TableRow>
          <TableCell>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              pl: level * 4
            }}>
              {hasChildren && (
                <IconButton 
                  size="small" 
                  onClick={() => handleToggleExpand(category._id)}
                  sx={{ p: 0.5 }}
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </IconButton>
              )}
              <FolderTree size={18} />
              {category.name}
            </Box>
          </TableCell>
          <TableCell>
            {category.parent ? (
              <Chip 
                label={categories.find(c => c._id === category.parent)?.name || 'Unknown'} 
                size="small" 
                variant="outlined"
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            )}
          </TableCell>
          <TableCell>
            {new Date(category.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell align="right">
            <IconButton 
              size="small" 
              onClick={() => handleOpenDialog(category)}
              sx={{ mr: 1 }}
            >
              <Edit size={18} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(category._id)}
              color="error"
            >
              <Delete size={18} />
            </IconButton>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && (
          <TableRow>
            <TableCell colSpan={4} sx={{ p: 0 }}>
              <Collapse in={isExpanded}>
                <Box sx={{ pl: 4 }}>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableBody>
                        {category.children.map(child => 
                          renderCategoryRow(child, level + 1)
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Category Management</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
        >
          Add New Category
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => renderCategoryRow(category))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={formData.parent}
                label="Parent Category"
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {categories
                  .filter(category => !editMode || category._id !== selectedCategory?._id)
                  .map((category) => (
                    <MenuItem 
                      key={category._id} 
                      value={category._id}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement; 