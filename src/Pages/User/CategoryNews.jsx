import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { newsService } from '../../services/news.service';
import { toast } from 'sonner';

const CategoryNews = () => {
  const { categoryId } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategoryNews();
  }, [categoryId]);

  const fetchCategoryNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNewsByCategory(categoryId);
      if (response.success) {
        // The response data structure from the news service
        const newsData = response.data[0]?.news || [];
        setNews(newsData);
        
        // If we have news items, get the category name from the first item
        if (newsData.length > 0 && newsData[0].category) {
          setCategoryName(newsData[0].category.name);
        }
      } else {
        toast.error('Failed to fetch category news');
      }
    } catch (error) {
      console.error('Error fetching category news:', error);
      toast.error('Failed to fetch category news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {categoryName ? `${categoryName} News` : 'Category News'}
      </Typography>

      <Grid container spacing={3}>
        {news.length > 0 ? (
          news.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.imageURLs && item.imageURLs[0] && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageURLs[0]}
                    alt={item.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.summary || item.content.substring(0, 150) + '...'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No news articles found in this category.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoryNews; 