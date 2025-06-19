import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    InputBase,
    IconButton,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Button,
    Grid,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CardActionArea,
  } from "@mui/material";
import { useNavigate,useParams } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import NewsCard from '../../Components/User/NewsCard';
import PoliticsImage from '../../Images/Politics.jpg';
import TechnologyImage from '../../Images/Technology.jpg';  
import BusinessImage from '../../Images/Business.jpg';
import EntertainmentImage from '../../Images/Entertainment.jpg';
import { useLanguage } from '../../contexts/LanguageContext';
import HealthImage from '../../Images/Health.jpg';
import SportsImage from '../../Images/Sports.jpg';
import DummyNews from '../../DummyNews';
import { viewService } from '../../services/view.service';
import { toast } from 'sonner';

// import SportsImage from '../Images/sports.jpg';

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

const CategoryPage = ({ onPlayAudio, currentPlayingNews }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const { globalSearchQuery } = useSearch();
  const [filteredNews, setFilteredNews] = useState([]);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Fetch news data from backend
  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await viewService.getNewsByCategory(category);
        
        if (response.success && response.data && Array.isArray(response.data.data)) {
          // Transform the news data to match our frontend structure
          const transformedNews = response.data.data.map(item => {
            // Find the translation for the selected language using full language name
            const translation = item.translatedServices?.find(
              service => service.languageCode.toLowerCase() === LANGUAGE_MAP[language].toLowerCase()
            );

            return {
              id: item._id,
              title: translation?.title || item.title,
              content: translation?.translatedContent || item.content,
              summary: item.summary || '',
              category: item.category?.name || 'Uncategorized',
              date: item.createdAt,
              imageUrl: item.imageURLs?.[0] || 'https://via.placeholder.com/300x200',
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
          setError('Failed to fetch category news');
          toast.error('Failed to fetch category news');
        }
      } catch (error) {
        console.error('Error fetching category news:', error);
        setError(error.message || 'Failed to fetch category news');
        toast.error(error.message || 'Failed to fetch category news');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [category, language]);

  // Filter news items based on search query
  useEffect(() => {
    if (!globalSearchQuery) {
      setFilteredNews(newsItems);
      return;
    }

    const filtered = newsItems.filter(news => 
      news.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      news.summary?.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(globalSearchQuery.toLowerCase())
    );

    setFilteredNews(filtered);
  }, [newsItems, globalSearchQuery]);

  const handleNewsClick = (newsId) => {
    const newsItem = filteredNews.find(item => item.id === newsId);
    if (newsItem) {
      navigate(`/user/news/${newsId}`, { state: { news: newsItem } });
    }
  };

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
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>

    {/* News Grid */}
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}> {/* Add horizontal padding */}
      {filteredNews.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'gray' }}>
          No news in this category exists
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ px: 3 }}>
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
      )}
    </Box>
    
  </Container>
  );
};

export default CategoryPage;
