import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import {
  FileText,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  User,
  Calendar,
  TrendingUp,
  Send,
  X
} from "lucide-react";
import { newsService } from '../../services/news.service';
import { authService } from '../../services/auth.service';
import { toast } from 'sonner';

const Dashboard = ({ currentSection, setCurrentSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [editorId, setEditorId] = useState(null);
  
  const [dashboardStats, setDashboardStats] = useState({
    pendingArticles: 0,
    editedToday: 0,
    approvedToday: 0,
    totalEdited: 0
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState({
    title: '',
    content: '',
    summary: ''
  });

  useEffect(() => {
    const fetchEditorProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          console.log("Editor ID:", response.data._id);
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
      fetchDashboardData();
    }
  }, [editorId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get editor profile first
      const editorResponse = await authService.getProfile();
      if (!editorResponse.success || !editorResponse.data) {
        toast.error('Failed to fetch editor profile');
        return;
      }
      const currentEditorId = editorResponse.data._id;
      
      // Fetch pending articles
      const pendingResponse = await newsService.getNewsByStatus('pending');
      // Fetch verified articles
      const verifiedResponse = await newsService.getNewsByStatus('verified');
      // Fetch accepted articles
      const acceptedResponse = await newsService.getNewsByStatus('accepted');
      // Fetch published articles
      const publishedResponse = await newsService.getNewsByStatus('published');
      
      if (pendingResponse.success && verifiedResponse.success && acceptedResponse.success && publishedResponse.success) {
        const pendingArticles = pendingResponse.data || [];
        const verifiedArticles = verifiedResponse.data || [];
        const acceptedArticles = acceptedResponse.data || [];
        const publishedArticles = publishedResponse.data || [];

        // Calculate dashboard stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
          // Count only articles that are pending and not yet edited
          pendingArticles: pendingArticles.filter(article => !article.editedBy).length,
          // Count verified articles edited today by this editor
          editedToday: verifiedArticles.filter(article => 
            article.editedBy === currentEditorId && new Date(article.updatedAt) >= today
          ).length,
          // Count accepted articles that were verified by this editor
          approvedToday: acceptedArticles.filter(article => 
            article.editedBy === currentEditorId && new Date(article.updatedAt) >= today
          ).length,
          // Count total verified articles edited by this editor
          totalEdited: verifiedArticles.filter(article => article.editedBy === currentEditorId).length
        };

        // Get recent articles sorted by creation time
        const recent = [...pendingArticles, ...verifiedArticles, ...acceptedArticles, ...publishedArticles]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setDashboardStats(stats);
        setRecentArticles(recent);
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('An error occurred while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    setCurrentSection("pending");
  };

  const handlePreviewClick = (article) => {
    setSelectedArticle(article);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setEditedContent({
      title: article.title,
      content: article.content,
      summary: article.summary || ''
    });
    setEditDialogOpen(true);
  };

  const handleSubmitEdit = async () => {
    try {
      if (!selectedArticle) return;

      const response = await newsService.editNews(selectedArticle._id, {
        title: editedContent.title,
        content: editedContent.content,
        summary: editedContent.summary
      });

      if (response.success) {
        toast.success('Article updated successfully');
        setEditDialogOpen(false);
        fetchDashboardData(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred while updating the article');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';  // Yellow - Needs editing
      case 'verified':
        return 'info';     // Blue - Edited by editor
      case 'accepted':
        return 'success';  // Green - Approved by admin
      case 'published':
        return 'primary';  // Purple - Successfully published
      case 'rejected':
        return 'error';    // Red - Rejected
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
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
        backgroundColor: '#F8FAFC',
        py: { xs: 3, sm: 4 },
        px: { xs: 0 },
      }}
    >
      {/* Header */}
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontWeight: 600,
          textAlign: 'left',
        }}
      >
        Editor Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} width={{sx:'100%',md:250}}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <FileText size={24} color={theme.palette.warning.main} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {dashboardStats.pendingArticles}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Pending Articles
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} width={{sx:'100%',md:250}}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <Edit3 size={24} color={theme.palette.success.main} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {dashboardStats.editedToday}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Edited Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} width={{sx:'100%',md:250}}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <CheckCircle size={24} color={theme.palette.info.main} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {dashboardStats.approvedToday}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Approved Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3} width={{sx:'100%',md:250}}>
          <Card 
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <TrendingUp size={24} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {dashboardStats.totalEdited}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Edited
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Articles */}
      <Card 
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Clock size={20} />
            Recent Articles
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentArticles.map((article) => (
              <Paper
                key={article._id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {article.title}
                  </Typography>
                  {!article.editedBy && article.status === 'pending' && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit3 size={16} />}
                      onClick={() => handleEditClick(article)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {article.category?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </Typography>
                  {article.editedBy && (
                    <Chip 
                      label="Edited" 
                      size="small" 
                      color="info"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #E2E8F0',
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">
            Article Preview
          </Typography>
          <IconButton onClick={() => setPreviewDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedArticle && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1E293B' }}>
                {selectedArticle.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#3B82F6' }}>
                  {selectedArticle.reportedBy?.name?.charAt(0) || 'R'}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedArticle.reportedBy?.name || 'Reporter'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selectedArticle.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button 
            onClick={() => setPreviewDialogOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit3 size={16} />}
            onClick={() => {
              setPreviewDialogOpen(false);
              handleEditClick(selectedArticle);
            }}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #E2E8F0',
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">
            Edit Article
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Article Title"
              fullWidth
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Summary"
              fullWidth
              multiline
              rows={3}
              value={editedContent.summary}
              onChange={(e) => setEditedContent({ ...editedContent, summary: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Article Content"
              fullWidth
              multiline
              rows={12}
              value={editedContent.content}
              onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Send size={16} />}
            onClick={handleSubmitEdit}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Submit to Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
