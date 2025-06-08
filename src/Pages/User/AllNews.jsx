import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import { viewService } from "../../services/view.service";
import NewsCard from '../../Components/User/NewsCard';

// Language enum to full name mapping
const LANGUAGE_MAP = {
  'en': 'English',
  'hi': 'Hindi',
  'bn': 'Bengali',
  'ta': 'Tamil',
  'te': 'Telugu',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'pa': 'Punjabi',
  'as': 'Assamese',
  'or': 'Odia',
  'bho': 'Bhojpuri',
  'kok': 'Konkani',
  'mai': 'Maithili',
  'mni': 'Manipuri',
  'sa': 'Sanskrit',
  'sd': 'Sindhi',
  'ur': 'Urdu'
};

// Hardcoded image mapping for specific news articles
const NEWS_IMAGE_MAPPING = {
  '6842e0d3c88c6a7b2c7f7243': 'https://english.cdn.zeenews.com/sites/default/files/2025/06/06/1765275-sitaare.jpg?im=FitAndFill=(1200,900)',
  '6842e0d3c88c6a7b2c7f7242': 'https://english.cdn.zeenews.com/sites/default/files/2025/06/06/1765159-icar.png',
  '6842e0d3c88c6a7b2c7f7246': 'https://english.cdn.zeenews.com/sites/default/files/styles/zm_700x400/public/2025/06/06/1765236-jh234-2025-06-06t162132.525.png?im=Resize=(700,400)',
  '6842e0d3c88c6a7b2c7f7245': 'https://english.cdn.zeenews.com/sites/default/files/styles/zm_700x400/public/2025/06/06/1765273-sensexopen.jpg?im=Resize=(700,400)',
  '6841c597681b8125e51576cd': 'https://static.toiimg.com/thumb/msid-121654745,imgsize-641761,width-400,resizemode-4/121654745.jpg',
  '65f2e8b7c261e6001234abd2': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abd3': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd4': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abd5': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd6': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
};

const AllNews = ({ onPlayAudio, currentPlayingNews }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { globalSearchQuery } = useSearch();
  
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await viewService.getAllNews();
      
      if (response.success) {
        // Log all article IDs to see what we're working with
        console.log('All article IDs:', response.data.map(item => item._id));
        
        // Transform the news data to match our frontend structure
        const transformedNews = response.data.map(item => {
          // Find the translation for the selected language using full language name
          const translation = item.translatedServices?.find(
            service => service.languageCode.toLowerCase() === LANGUAGE_MAP[language].toLowerCase()
          );

          // Log each article's ID and current image
          console.log('Article ID:', item._id);
          console.log('Current image:', item.imageURLs?.[0]);
          console.log('Hardcoded image:', NEWS_IMAGE_MAPPING[item._id]);

          // Use hardcoded image if available, otherwise use the original image or placeholder
          const imageUrl = NEWS_IMAGE_MAPPING[item._id] || item.imageURLs?.[0] || 'https://via.placeholder.com/300x200';

          return {
            id: item._id,
            title: translation?.title || item.title,
            content: translation?.translatedContent || item.content,
            summary: item.summary || '',
            category: item.category?.name || 'Uncategorized',
            date: item.createdAt,
            imageUrl: imageUrl,
            voice_file: translation?.audioURL || null,
            sourceName: item.source || 'News Portal',
            sourceUrl: item.originalURL || '#',
            tags: item.tags || [],
            status: item.status,
            reporterName: item.reportedBy?.name || 'Unknown',
            reporterEmail: item.reportedBy?.email || '',
            editorName: item.editedBy?.name || '',
            editorEmail: item.editedBy?.email || '',
            isFake: item.isFake || false,
            location: item.location || '',
            language: item.language || 'en',
            originalItem: item // Store the original item for full access to translations
          };
        });
        
        setNewsItems(transformedNews);
      } else {
        setError('Failed to fetch news');
        toast.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('An error occurred while fetching news');
      toast.error('An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [language]);

  const handleNewsClick = (newsId) => {
    const newsItem = newsItems.find(item => item.id === newsId);
    navigate(`/user/news/${newsId}`, { state: { news: newsItem } });
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  // Filter news based on selected tags and search query
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = globalSearchQuery === '' || 
      item.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(globalSearchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Selected:
          </Typography>
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleTagToggle(tag)}
              color="primary"
              size="small"
            />
          ))}
          <Button
            size="small"
            onClick={clearTagFilters}
            sx={{ ml: 1 }}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* News Grid */}
      <Grid container spacing={3}>
        {filteredNews.map((news) => (
          <Grid item xs={12} sm={6} md={4} key={news.id}>
            <NewsCard 
              news={news}
              onPlayAudio={onPlayAudio}
              currentPlayingNews={currentPlayingNews}
              onReadMore={() => handleNewsClick(news.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllNews;