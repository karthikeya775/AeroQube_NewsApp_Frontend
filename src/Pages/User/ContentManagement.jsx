import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import { RefreshIcon } from '@mui/icons-material';
import { newsService } from '../../services/newsService';

const ContentManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsService.getAllNews();
      
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to fetch articles');
        toast.error('Failed to fetch articles. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error.message || 'Failed to fetch articles');
      toast.error(error.message || 'Failed to fetch articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={handleRetry}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    // ... rest of the render code ...
  );
};

export default ContentManagement; 