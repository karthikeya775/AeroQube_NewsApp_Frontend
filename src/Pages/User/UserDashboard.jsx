import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import { viewService } from "../../services/view.service";
import NewsCard from '../../Components/User/NewsCard';
import categoriesData from '../../constants/newsapp-news.categories.json';

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
  '65f2e8b7c261e6001234abcd': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abce': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abcf': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd0': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abd1': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd2': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abd3': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd4': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
  '65f2e8b7c261e6001234abd5': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
  '65f2e8b7c261e6001234abd6': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000',
};

// Build a mapping from category ID to name
const CATEGORY_ID_NAME_MAP = {};
categoriesData.forEach(cat => {
  CATEGORY_ID_NAME_MAP[cat._id.$oid] = cat.name;
});

const UserDashboard = ({ onPlayAudio, currentPlayingNews }) => {
  const { category = 'all' } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { globalSearchQuery } = useSearch();
  
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchNews = async (page = 0, limit = rowsPerPage) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // If user is authenticated and has _id, try user feed
      if (token && user && user._id) {
        try {
          const response = await viewService.getUserFeed(limit, page + 1);
          console.log("response",response)
          handleNewsResponse(response);
          return;
        } catch (error) {
          // If user feed fails, fallback to all news
          console.log('Falling back to all news:', error);
          const response = await viewService.getAllNews(limit, page + 1);
          handleNewsResponse(response);
          return;
        }
      } else {
        // If not authenticated, get all news
        const response = await viewService.getAllNews(limit, page + 1);
        handleNewsResponse(response);
        return;
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('An error occurred while fetching news');
      toast.error('An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsResponse = (response) => {
    // Support both { data: [...] } and { data: { data: [...] } }
    let articles = [];
    if (response.success) {
      if (Array.isArray(response.data)) {
        articles = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        articles = response.data.data;
      }
    }
    setTotalCount(response.totalCounts || response.data?.totalCounts || articles.length || 0);
    // Transform the news data to match our frontend structure
    const transformedNews = articles.map(item => {
      // Find the translation for the selected language using full language name
      const translation = item.translatedServices?.find(
        service => service.languageCode.toLowerCase() === LANGUAGE_MAP[language].toLowerCase()
      );

      // Use hardcoded image if available, otherwise use the original image or placeholder
      const imageUrl = NEWS_IMAGE_MAPPING[item._id] || item.imageURLs?.[0] || 'https://via.placeholder.com/300x200';

      // Map category ID to name using the mapping
      let categoryName = 'Uncategorized';
      let catId = null;
      if (item.category) {
        if (typeof item.category === 'string') {
          catId = item.category;
        } else if (item.category._id) {
          catId = item.category._id;
        } else if (item.category.$oid) {
          catId = item.category.$oid;
        }
      }
      if (catId && CATEGORY_ID_NAME_MAP[catId]) {
        categoryName = CATEGORY_ID_NAME_MAP[catId];
      }

      return {
        id: item._id,
        title: translation?.title || item.title,
        content: translation?.translatedContent || item.content,
        summary: item.summary || '',
        category: categoryName,
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
    if (!articles.length) {
      setError('Failed to fetch news');
      toast.error('Failed to fetch news');
    }
  };

  useEffect(() => {
    fetchNews(currentPage, rowsPerPage);
    // eslint-disable-next-line
  }, [language, currentPage, rowsPerPage]);

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

    const matchesCategory = category === 'all' || item.category === category;

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
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

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button onClick={() => handlePageChange(null, Math.max(currentPage - 1, 0))} disabled={currentPage === 0}>
          Previous
        </Button>
        <Typography sx={{ mx: 2, alignSelf: 'center' }}>
          Page {currentPage + 1} of {Math.ceil(totalCount / rowsPerPage) || 1}
        </Typography>
        <Button onClick={() => handlePageChange(null, currentPage + 1)} disabled={(currentPage + 1) * rowsPerPage >= totalCount}>
          Next
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>Rows per page:</Typography>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          {[5, 10, 25, 50, 100].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </Box>
    </Container>
  );
};

export default UserDashboard;
