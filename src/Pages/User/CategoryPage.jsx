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

// import SportsImage from '../Images/sports.jpg';


      const CategoryPage = ({ onPlayAudio, currentPlayingNews }) => {
        const [newsItems, setNewsItems] = useState([]);
        const { category } = useParams();
        const { globalSearchQuery } = useSearch();
        const [filteredNews, setFilteredNews] = useState([]);
        const navigate = useNavigate();
        const { language } = useLanguage();
      
        // Fetch news data and set it when language changes
        useEffect(() => {
          const newsData = DummyNews.map(item => {
            const translatedContent = item.translations && item.translations[language];
            
            const title = translatedContent ? translatedContent.headline : item.headline;
            const summary = translatedContent ? translatedContent.summary : item.summary;
            const content = translatedContent ? translatedContent.content : item.content;
            const audioUrl = translatedContent && translatedContent.appwrite_audio_url 
              ? translatedContent.appwrite_audio_url
              : item.appwrite_audio_url;
            
            return {
              id: item._id,
              title: title || '',
              summary: summary || '',
              sourceName: item.source || 'Unknown Source',
              sourceUrl: item.url || '#',
              category: item.category || 'general',
              date: item.date || '',
              time: item.time || '',
              imageUrl: item.main_image?.url || (item.images && item.images.length > 0 ? item.images[0].url : ''),
              voice_file: audioUrl || null,
              content: content || '',
              originalItem: item
            };
          });
      
          setNewsItems(newsData);
        }, [language]); // Run effect when language changes
      
        // Filter news items based on category and search query
        useEffect(() => {
          const newsInCategory = newsItems.filter(news => {
            const matchesCategory = (news.category || '').toLowerCase() === (category || '').toLowerCase();
            const matchesSearch = !globalSearchQuery || 
              news.headline.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
              news.summary.toLowerCase().includes(globalSearchQuery.toLowerCase());
      
            return matchesCategory && matchesSearch;
          });
      
          setFilteredNews(newsInCategory);
        }, [newsItems, category, globalSearchQuery]); // Re-run if newsItems, category, or search query
     
  const handleNewsClick = (newsId) => {
    // Find the news item by ID
    const newsItem =filteredNews.find(item => item._id === newsId);
    console.log("hey i am in handle click: ",newsItem);
    // Navigate to the news detail page with the news item as state
    navigate(`/user/news/${newsItem.id}`, { state: { news: newsItem } });
  };

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
                key={news._id}
                news={news}
                onPlayAudio={onPlayAudio}
                currentPlayingNews={currentPlayingNews}
                onReadMore={() => handleNewsClick(news._id)}
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
