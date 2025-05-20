import { useState, useEffect } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate, useParams } from "react-router-dom";
import NewsCard from "../../Components/User/NewsCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useLanguage } from "../../contexts/LanguageContext";
import BusinessImage from '../../Images/Business.jpg';
import EntertainmentImage from '../../Images/Entertainment.jpg';
import HealthImage from '../../Images/Health.jpg';
import PoliticsImage from '../../Images/Politics.jpg';
import TechnologyImage from '../../Images/Technology.jpg';
import { useSearch } from "../../contexts/SearchContext";
import DummyNews from "../../DummyNews";

// import { newsApi } from "../../utils/api";

// const categories = [
//   { id: 'all', label: 'All News' },
//   { id: 'technology', label: 'Technology' },
//   { id: 'business', label: 'Business' },
//   { id: 'health', label: 'Health' },
//   { id: 'politics', label: 'Politics' },
//   { id: 'science', label: 'Science' },
//   { id: 'sports' , label:'Sports'}
// ];

const UserDashboard = ({ onPlayAudio, currentPlayingNews }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { category = 'all' } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { globalSearchQuery } = useSearch(); // Get the global search query from context
  
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newsCategories, setNewsCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      // Dummy news data with translations
    //   const dummyNews = [
    //     {
    //       _id: '1',
    //       headline: 'Global Climate Summit Reaches Historic Agreement',
    //       summary: 'World leaders have agreed on ambitious new targets to reduce carbon emissions by 2030.',
    //       content: 'In a landmark decision, representatives from 195 countries have committed to reducing carbon emissions by 50% before 2030. The agreement includes financial support for developing nations and penalties for non-compliance.',
    //       source: 'Climate News Network',
    //       url: 'https://example.com/climate-summit',
    //       category: 'Politics',
    //       date: '2025-05-08',
    //       time: '14:30',
    //       main_image: {url: PoliticsImage },
    //       appwrite_audio_url: 'https://example.com/audio/climate-en.mp3',
    //       translations: {
    //         'hi': {
    //           headline: 'Le Sommet sur le climat atteint un accord historique',
    //           summary: 'Les dirigeants mondiaux se sont mis d\'accord sur de nouveaux objectifs ambitieux pour réduire les émissions de carbone d\'ici 2030.',
    //           content: 'Dans une décision historique, les représentants de 195 pays se sont engagés à réduire les émissions de carbone de 50% avant 2030. L\'accord comprend un soutien financier aux pays en développement et des pénalités en cas de non-conformité.',
    //           appwrite_audio_url: 'https://example.com/audio/climate-fr.mp3'
    //         },
    //         'en': {
    //           headline: 'Globaler Klimagipfel erzielt historisches Abkommen',
    //           summary: 'Weltführer haben sich auf ehrgeizige neue Ziele zur Reduzierung der Kohlenstoffemissionen bis 2030 geeinigt.',
    //           content: 'In einer wegweisenden Entscheidung haben sich Vertreter aus 195 Ländern verpflichtet, die Kohlenstoffemissionen bis 2030 um 50% zu reduzieren. Das Abkommen umfasst finanzielle Unterstützung für Entwicklungsländer und Strafen bei Nichteinhaltung.',
    //           appwrite_audio_url: 'https://example.com/audio/climate-de.mp3'
    //         }
    //       }
    //     },
 
    //   ];
  
      // Process the dummy data similar to the original function
      const newsData = DummyNews.map(item => {
        // Check if there are translations for the selected language
        const translatedContent = item.translations && item.translations[language];
        
        // Use translated content if available, otherwise use the original content
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
          originalItem: item // Store the original item for full access to translations
        };
      });
      
      setNewsItems(newsData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error('Error processing news:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load news. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch news when language or refreshTimestamp changes
  useEffect(() => {
    fetchNews();
  }, [language, refreshTimestamp]);

  // Filter news items based on category, search query, source filter, and tags
  const filteredNews = newsItems.filter(news => {
    const matchesCategory = category === 'all' || news.category === category;
    const matchesSearch = globalSearchQuery === '' || 
      news.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) || 
      news.summary.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (news.tags && news.tags.some(tag => 
        tag.toLowerCase().includes(globalSearchQuery.toLowerCase())
      ));
    const matchesSource = sourceFilter === 'all' || news.sourceName === sourceFilter;
    const matchesTags = selectedTags.length === 0 || 
      (news.tags && selectedTags.every(tag => news.tags.includes(tag)));

    if (!matchesCategory) {
      console.log('Category mismatch:', {
        newsCategory: news.category,
        currentCategory: category,
        title: news.title
      });
    }
    
    return matchesCategory && matchesSearch && matchesSource && matchesTags;
  });

  // Get unique sources for filter dropdown
  const sources = [...new Set(newsItems.map(news => news.sourceName))];

  console.log('Current Playing News:', currentPlayingNews);


  const handleNewsClick = (newsId) => {
    // Find the news item by ID
    const newsItem = newsItems.find(item => item.id === newsId);
    // Navigate to the news detail page with the news item as state
    navigate(`/user/news/${newsId}`, { state: { news: newsItem } });
  };
  
  // Handle refresh by updating the timestamp
  const handleRefresh = async () => {
    try {
      // Update timestamp to trigger a re-fetch
      setRefreshTimestamp(Date.now());
      
      setSnackbar({
        open: true,
        message: 'News content refreshed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error refreshing news:', error);
      setSnackbar({
        open: true,
        message: 'Failed to refresh news. Please try again.',
        severity: 'error'
      });
    }
  };

  const formatDate = (timestamp) => {
    // If timestamp is in the format "YYYY-MM-DDTHH:MM:SS"
    if (typeof timestamp === 'string' && timestamp.includes('T')) {
      try {
        // Try to parse the date
        const date = new Date(timestamp);
        
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          // Format as DD/MM/YYYY
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          
          return `${day}/${month}/${year}`;
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
      
      // If parsing fails, try to extract date parts manually
      const datePart = timestamp.split('T')[0];
      const dateParts = datePart.split('-');
      
      if (dateParts.length === 3) {
        // Rearrange from YYYY-MM-DD to DD/MM/YYYY
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    }
    
    // If we can't parse it, just return the original
    return timestamp;
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>

      {/* News Grid */}
      {loading ? (
  <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
    <CircularProgress />
  </Box>
) : (
  <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}> {/* Add horizontal padding */}
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
  </Box>


      )}
    </Container>
  );
};

export default UserDashboard;