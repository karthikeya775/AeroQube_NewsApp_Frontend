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
  Avatar,
  Stack,
  Divider,
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
  DialogActions
} from '@mui/material';
import {
  Calendar,
  User,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit3,
  X
} from 'lucide-react';
import { newsService } from '../../services/news.service';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';

const EditHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editorId, setEditorId] = useState(null);

  useEffect(() => {
    const fetchEditorProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          console.log("response.data._id",response.data._id);
          setEditorId(response.data._id);
        }
      } catch (error) {
        console.error('Error fetching editor profile:', error);
        toast.error('Failed to fetch editor profile');
      }
    };

    fetchEditorProfile();
  }, []);

  useEffect(() => {
    if (editorId) {
      fetchEditedArticles();
    }
  }, [editorId]);

  const fetchEditedArticles = async () => {
    try {
      setLoading(true);
      // Fetch only verified articles
      const response = await newsService.getNewsByStatus('verified');
      
      if (response.success) {
        console.log("allArticles", response.data);
        console.log("Editor ID:", editorId);
        
        // Filter articles that have been edited by this editor
        const editedArticles = response.data.filter(article => {
          console.log("Article:", article.title, "editedBy:", article.editedBy);
          return article.editedBy && article.editedBy === editorId;
        });
        
        setArticles(editedArticles);
      } else {
        toast.error('Failed to fetch edited articles');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching edited articles:', error);
      toast.error('An error occurred while fetching edited articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePreviewClick = (article) => {
    setSelectedArticle(article);
    setPreviewDialogOpen(true);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'published':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

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
        Edit History
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
              <TableCell>Status</TableCell>
              <TableCell>Edited Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.category?.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      color={getStatusColor(article.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton 
                        size="small"
                        onClick={() => handlePreviewClick(article)}
                      >
                        <Eye size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  align="center" 
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="textSecondary">
                    No edited articles found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditHistory;
