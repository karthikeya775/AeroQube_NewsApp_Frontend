import React, { useState, useEffect } from "react";
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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from "@mui/material";
import {
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { newsService } from '../../services/news.service';
import { authService } from '../../services/auth.service';
import axios from 'axios';
import { categoryService } from '../../services/category.service';

const sampleContent = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    headline: "AI Revolution in Healthcare: Transforming Patient Care",
    category: "Technology",
    author: "Jane Smith",
    status: "published",
    submittedDate: "2025-05-12",
    publishedDate: "2025-05-14",
    summary: "Exploring how artificial intelligence is revolutionizing healthcare delivery and improving patient outcomes across global healthcare systems.",
    content: "Artificial intelligence is fundamentally transforming healthcare delivery... [detailed content]",
    tags: ["Healthcare", "AI", "Technology", "Medicine"],
    image: "https://example.com/ai-healthcare.jpg",
    views: 1205
  },
  {
    id: 2,
    title: "Climate Change Effects on Global Economy",
    headline: "Economic Impact: Climate Crisis Reshapes Global Markets",
    category: "Business",
    author: "John Doe",
    status: "pending",
    submittedDate: "2025-05-13",
    publishedDate: null,
    summary: "Analysis of how climate change is impacting global markets and economic strategies worldwide.",
    content: "The global economy faces unprecedented challenges as climate change... [detailed content]",
    tags: ["Climate Change", "Economy", "Global Markets", "Sustainability"],
    image: "https://example.com/climate-economy.jpg",
    views: 0
  },
  {
    id: 3,
    title: "Breakthrough in Quantum Computing",
    headline: "Quantum Computing Milestone: New Era of Computing Begins",
    category: "Science",
    author: "Alex Johnson",
    status: "published",
    submittedDate: "2025-05-10",
    publishedDate: "2025-05-11",
    summary: "Scientists achieve major breakthrough in quantum computing, opening new possibilities for complex problem-solving.",
    content: "In a groundbreaking development, researchers have achieved... [detailed content]",
    tags: ["Quantum Computing", "Technology", "Science", "Innovation"],
    image: "https://example.com/quantum-computing.jpg",
    views: 892
  },
  {
    id: 4,
    title: "The Rise of Sustainable Fashion",
    headline: "Fashion Industry's Green Revolution Takes Center Stage",
    category: "Entertainment",
    author: "Sarah Williams",
    status: "pending",
    submittedDate: "2025-05-14",
    publishedDate: null,
    summary: "How sustainable practices are reshaping the fashion industry and influencing consumer behavior.",
    content: "The fashion industry is undergoing a major transformation... [detailed content]",
    tags: ["Fashion", "Sustainability", "Environment", "Lifestyle"],
    image: "https://example.com/sustainable-fashion.jpg",
    views: 0
  },
  {
    id: 5,
    title: "Space Tourism: The Next Frontier",
    headline: "Commercial Space Travel Opens New Chapter in Tourism",
    category: "Science",
    author: "Michael Brown",
    status: "rejected",
    submittedDate: "2025-05-08",
    publishedDate: null,
    summary: "Examining the rapidly evolving space tourism industry and its implications for future travel.",
    content: "As private companies push the boundaries of space exploration... [detailed content]",
    tags: ["Space", "Tourism", "Technology", "Innovation"],
    image: "https://example.com/space-tourism.jpg",
    views: 0
  },
  {
    id: 6,
    title: "Cybersecurity in the Age of Remote Work",
    headline: "Remote Work Revolution Sparks Cybersecurity Concerns",
    category: "Technology",
    author: "Lisa Chen",
    status: "published",
    submittedDate: "2025-05-09",
    publishedDate: "2025-05-10",
    summary: "How companies are adapting their cybersecurity strategies to protect remote workforces.",
    content: "The shift to remote work has created new challenges... [detailed content]",
    tags: ["Cybersecurity", "Remote Work", "Technology", "Business"],
    image: "https://example.com/cybersecurity.jpg",
    views: 756
  },

  {
    id: 7,
    title: "Green Architecture Gains Momentum",
    headline: "Sustainable Buildings on the Rise in Urban India",
    category: "Environment",
    author: "Arjun Mehta",
    status: "pending",
    submittedDate: "2025-05-11",
    publishedDate: null,
    summary: "Architects and developers focus on eco-friendly building practices.",
    content: "With rising environmental awareness, green design is becoming standard...",
    tags: ["Architecture", "Sustainability", "Urban", "Green Building"],
    image: "https://example.com/green-building.jpg",
    views: 312
  },
  {
    id: 8,
    title: "AI-Powered Education Tools Shape Classrooms",
    headline: "AI Revolutionizes Learning Experience for Students",
    category: "Education",
    author: "Neha Kapoor",
    status: "published",
    submittedDate: "2025-05-08",
    publishedDate: "2025-05-10",
    summary: "Schools adopt AI tools to personalize learning paths for students.",
    content: "AI is enabling teachers to better understand student strengths and weaknesses...",
    tags: ["AI", "Education", "EdTech", "Innovation"],
    image: "https://example.com/ai-education.jpg",
    views: 1345
  },
  {
    id: 9,
    title: "Monsoon Preparedness in Coastal Cities",
    headline: "Coastal Towns Brace for Intense Monsoon",
    category: "Disaster",
    author: "Rajiv Menon",
    status: "rejected",
    submittedDate: "2025-05-12",
    publishedDate: null,
    summary: "Local governments outline new measures to mitigate flooding this season.",
    content: "Sandbags, drainage system upgrades, and evacuation drills underway...",
    tags: ["Monsoon", "Disaster", "Flood", "Preparedness"],
    image: "https://example.com/monsoon-city.jpg",
    views: 0
  },
  {
    id: 10,
    title: "Rural Entrepreneurs Break Barriers",
    headline: "Micro Startups Drive Change in Villages",
    category: "Business",
    author: "Fatima Ali",
    status: "rejected",
    submittedDate: "2025-05-06",
    publishedDate: null,
    summary: "Women and youth launch innovative businesses in rural communities.",
    content: "Support programs and digital tools have empowered grassroots innovation...",
    tags: ["Entrepreneurship", "Rural", "Innovation", "Business"],
    image: "https://example.com/rural-startup.jpg",
    views: 97
  },
  {
    id: 11,
    title: "Youth in Politics: A Rising Trend",
    headline: "Young Leaders Redefine Governance",
    category: "Politics",
    author: "Sneha Roy",
    status: "published",
    submittedDate: "2025-05-03",
    publishedDate: "2025-05-05",
    summary: "An increasing number of youth are running for public office and influencing policy.",
    content: "From city councils to national forums, youth voices are growing stronger...",
    tags: ["Youth", "Politics", "Leadership", "Governance"],
    image: "https://example.com/youth-politics.jpg",
    views: 568
  },
  {
    id: 12,
    title: "Wildlife Corridor Restored in Northern India",
    headline: "Conservationists Celebrate Major Milestone for Biodiversity",
    category: "Environment",
    author: "Dr. Kavita Singh",
    status: "pending",
    submittedDate: "2025-05-13",
    publishedDate: null,
    summary: "Years of effort have led to a successful restoration of a critical wildlife route.",
    content: "The corridor will help reduce human-wildlife conflict and increase safe animal movement...",
    tags: ["Wildlife", "Conservation", "Biodiversity", "Habitat"],
    image: "https://example.com/wildlife-corridor.jpg",
    views: 411
  },
  {
    id: 13,
    title: "Digital Payments Boom in Tier-2 Cities",
    headline: "Cashless Economy Finds New Ground in Smaller Towns",
    category: "Economy",
    author: "Vikas Bhatia",
    status: "published",
    submittedDate: "2025-05-04",
    publishedDate: "2025-05-06",
    summary: "Smartphones and UPI have accelerated digital payment adoption beyond metro areas.",
    content: "Merchants and consumers are embracing cashless transactions with ease...",
    tags: ["Digital India", "UPI", "Payments", "Economy"],
    image: "https://example.com/digital-payments.jpg",
    views: 982
  },
  {
    id: 14,
    title: "Mental Health Campaigns in Colleges",
    headline: "Colleges Launch Initiatives to Support Student Mental Health",
    category: "Health",
    author: "Ananya Dutta",
    status: "pending",
    submittedDate: "2025-05-14",
    publishedDate: null,
    summary: "Workshops and helplines are being introduced to support student well-being.",
    content: "Educational institutions recognize the growing need for mental health awareness...",
    tags: ["Mental Health", "Students", "Colleges", "Support"],
    image: "https://example.com/mental-health.jpg",
    views: 0
  },
];

const ContentManagement = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [aiServicedNews, setAiServicedNews] = useState([]);
  const [loadingAiService, setLoadingAiService] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews();
      
      if (response.success && Array.isArray(response.data)) {
        // Fetch reporter/editor details for each article
        const articlesWithReporters = await Promise.all(
          response.data.map(async (article) => {
            try {
              let reporterName = '';
              let reporterEmail = '';
              let editorName = '';
              let editorEmail = '';

              // If both reporter and editor are null, it's AI Service
              if (!article.reportedBy && !article.editedBy) {
                reporterName = 'AI Service';
              } else {
                // Fetch reporter details if exists
                if (article.reportedBy) {
                  const reporterResponse = await authService.getUserProfileById(article.reportedBy);
                  if (reporterResponse.success) {
                    reporterName = reporterResponse.data?.name || 'Unknown Reporter';
                    reporterEmail = reporterResponse.data?.email || '';
                  }
                }

                // Fetch editor details if exists
                if (article.editedBy) {
                  const editorResponse = await authService.getUserProfileById(article.editedBy);
                  if (editorResponse.success) {
                    editorName = editorResponse.data?.name || '';
                    editorEmail = editorResponse.data?.email || '';
                  }
                }
              }

              return {
                ...article,
                reporterName,
                reporterEmail,
                editorName,
                editorEmail
              };
            } catch (error) {
              console.error('Error fetching user details:', error);
              return {
                ...article,
                reporterName: (!article.reportedBy && !article.editedBy) ? 'AI Service' : 'Unknown User',
                reporterEmail: '',
                editorName: '',
                editorEmail: ''
              };
            }
          })
        );
        
        setArticles(articlesWithReporters);
      } else {
        toast.error(response.message || 'Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('An error occurred while fetching articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('An error occurred while fetching categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // const fetchAiServicedNews = async () => {
  //   try {
  //     setLoadingAiService(true);
  //     const response = await newsService.getAiServicedNews();
  //     if (response.success) {
  //       setAiServicedNews(response.data);
  //     } else {
  //       toast.error('Failed to fetch AI serviced news');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching AI serviced news:', error);
  //     toast.error('An error occurred while fetching AI serviced news');
  //   } finally {
  //     setLoadingAiService(false);
  //   }
  // };

  const handleApproveArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'published'
      });
      
      if (response.success) {
        toast.success('Article published successfully');
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error('An error occurred while publishing the article');
    }
  };

  const handleRejectArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'rejected'
      });
      
      if (response.success) {
        toast.success('Article rejected successfully');
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to reject article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      toast.error('An error occurred while rejecting the article');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      const response = await newsService.deleteNews(articleId);
      
      if (response.success) {
        toast.success('Article deleted successfully');
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('An error occurred while deleting the article');
    }
  };

  const handleEditClick = (article) => {
    setEditFormData(article);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (!editFormData) return;

      const formData = new FormData();
      formData.append('title', editFormData.title);
      formData.append('content', editFormData.content);
      formData.append('summary', editFormData.summary || '');
      formData.append('category', editFormData.category?._id || '');
      formData.append('language', editFormData.language || 'English'); // Default to English
      formData.append('isFake', editFormData.isFake?.toString() || 'false');
      
      // Append tags if they exist
      if (editFormData.tags && editFormData.tags.length > 0) {
        editFormData.tags.forEach(tag => {
          formData.append('tags[]', tag);
        });
      }

      // Append location if it exists
      if (editFormData.location) {
        formData.append('location', editFormData.location);
      }

      const response = await newsService.editNews(editFormData._id, formData);

      if (response.success) {
        toast.success('Article updated and moved to verified section');
        setOpenEditDialog(false);
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('An error occurred while updating the article');
    }
  };

  const handleVerifyArticle = async (articleId) => {
    try {
      const response = await newsService.verifyNews(articleId, {
        status: 'accepted'
      });
      
      if (response.success) {
        toast.success('Article accepted and published successfully');
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to accept article');
      }
    } catch (error) {
      console.error('Error accepting article:', error);
      toast.error('An error occurred while accepting the article');
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      const response = await newsService.publishNews(articleId);
      
      if (response.success) {
        toast.success('Article published successfully');
        fetchArticles(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      toast.error('An error occurred while publishing the article');
    }
  };

  const handleGenerateAiService = async (articleId) => {
    try {
      const response = await newsService.generateAiService(articleId);
      if (response.success) {
        toast.success('AI service generation request sent successfully');
        // Refresh both articles and AI serviced news
        await Promise.all([
          fetchArticles(),
          fetchAiServicedNews()
        ]);
      } else {
        toast.error(response.message || 'Failed to generate AI service');
      }
    } catch (error) {
      console.error('Error generating AI service:', error);
      toast.error('An error occurred while generating AI service');
    }
  };

  // Filter contents based on tab, search term, and filters
  const filterContent = () => {
    const statusFilters = ["all", "pending", "verified", "published", "rejected"];
    const currentStatusFilter = statusFilters[tabValue];

    return articles.filter((item) => {
      // Filter by status tab
      if (currentStatusFilter !== "all") {
        if (item.status !== currentStatusFilter) {
          return false;
        }
      }

      // Filter by search term
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.reporterName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by category
      if (filterCategory && item.category?.name !== filterCategory) {
        return false;
      }

      // Additional status filter
      if (filterStatus && item.status !== filterStatus) {
        return false;
      }

      return true;
    });
  };

  const filteredContent = filterContent();
  
  const openActionMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const closeActionMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterDialogOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleFilterApply = () => {
    setOpenFilterDialog(false);
    toast({
      title: "Filters Applied",
      description: "Content list has been filtered according to your criteria",
    });
  };

  const handleFilterReset = () => {
    setFilterCategory("");
    setFilterStatus("");
    setOpenFilterDialog(false);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteClick = () => {
    closeActionMenu();
    setConfirmDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      handleDeleteArticle(selectedItem._id);
    }
    setConfirmDeleteDialog(false);
    setSelectedItem(null);
  };

   const handleStatusUpdate = (articleId, newStatus) => {
    const updatedArticles = articles.map(article => 
      article.id === articleId 
        ? { ...article, status: newStatus, date: new Date().toISOString().split('T')[0] }
        : article
    );
    setArticles(updatedArticles);
  };

 const handleViewClick = () => {
  if (selectedItem) {
    console.log('Opening dialog with:', selectedItem);
    setOpenViewDialog(true);
    // Don't close the menu yet to keep the selectedItem
  }
};

// Add separate function to close dialog
const handleCloseViewDialog = () => {
  setOpenViewDialog(false);
  closeActionMenu(); // Now close menu after dialog closes
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

const isActionAllowed = (action, itemStatus) => {
  if (action === "view") return true;
  
  // Editor actions
  if (userRole === 'editor') {
    if (action === "edit" && itemStatus === "pending") return true;
    return false;
  }
  
  // Admin actions
  if (userRole === 'admin' || userRole === 'superadmin') {
    if (action === "edit") return true;
    if (action === "delete" && itemStatus !== "published") return true;
    return true;
  }
  
  return false;
};

// Add AI Service button to the table actions
const renderAiServiceButton = (item) => {
  if ((userRole === 'admin' || userRole === 'superadmin') && item.status === 'accepted') {
    const hasAiService = aiServicedNews.some(news => news._id === item._id);
    return (
      <Button
        size="small"
        variant="outlined"
        color="secondary"
        onClick={() => handleGenerateAiService(item._id)}
        disabled={hasAiService || loadingAiService}
        sx={{ ml: 1 }}
      >
        {loadingAiService ? 'Generating...' : hasAiService ? 'AI Service Generated' : 'Generate AI Service'}
      </Button>
    );
  }
  return null;
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
    <Box sx={{ 
      height: '100vh',
      p: 3,
      // backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{display:"flex",justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Content Management</Typography>
        {userRole !== "reporter" ? (
          <Button variant="contained" color="primary">
            Create New Content
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            Submit New Content
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Content" />
            <Tab label="Pending" />
            <Tab label="Verified" />
            <Tab label="Published" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <TextField
          placeholder="Search content..."
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
            onClick={handleFilterDialogOpen}
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

      <TableContainer component={Paper} elevation={0} sx={{
       flex: 1, // This will make it take remaining space
       mt: 2,
       '& .MuiTableCell-root': {
         px: 2,
         py: 1.5
       }
      }}>
        <Table stickyHeader>
       
<TableHead>
  <TableRow>
    <TableCell>Title</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Reporter</TableCell>
    <TableCell>Status</TableCell>
    <TableCell>Submitted Date</TableCell>
    {(userRole === 'admin' || userRole === 'editor') && (
      <TableCell align="right">Approve/Reject</TableCell>
    )}
    <TableCell align="right">Actions</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {filteredContent.length > 0 ? (
    filteredContent.map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.title}</TableCell>
        <TableCell>{item.category?.name}</TableCell>
        <TableCell>
          <Box>
            {!item.reportedBy && !item.editedBy ? (
              <Typography variant="body2" color="primary">
                AI Service
              </Typography>
            ) : (
              <>
                {item.reportedBy && (
                  <>
                    <Typography variant="body2">
                      Reported by: {item.reporterName}
                    </Typography>
                    {item.reporterEmail && (
                      <Typography variant="caption" color="text.secondary">
                        {item.reporterEmail}
                      </Typography>
                    )}
                  </>
                )}
                {item.editedBy && (
                  <>
                    <Typography variant="body2" color="primary">
                      Edited by: {item.editorName}
                    </Typography>
                    {item.editorEmail && (
                      <Typography variant="caption" color="text.secondary">
                        {item.editorEmail}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <Chip 
            label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            color={getStatusColor(item.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(item.createdAt).toLocaleDateString()}
        </TableCell>
        {(userRole === 'admin' || userRole === 'editor') && (
          <TableCell align="right">
            {item.status === 'pending' && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {userRole === 'editor' && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            )}
            {item.status === 'verified' && (userRole === 'admin' || userRole === 'superadmin') && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleVerifyArticle(item._id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRejectArticle(item._id)}
                >
                  Reject
                </Button>
              </Box>
            )}
          </TableCell>
        )}
        <TableCell align="right">
          <IconButton 
            onClick={(e) => openActionMenu(e, item)}
            size="small"
          >
            <MoreVertical size={18} />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell 
        colSpan={userRole === 'admin' || userRole === 'editor' ? 7 : 6} 
        align="center" 
        sx={{ py: 3 }}
      >
        <Typography variant="body1" color="textSecondary">
          No content items found
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeActionMenu}
      >
        {isActionAllowed("view", selectedItem?.status || "") && (
          <MenuItem onClick={handleViewClick} sx={{ gap: 1.5 }}>
            <Eye size={18} />
            <Typography variant="body2">View</Typography>
          </MenuItem>
        )}
        {isActionAllowed("edit", selectedItem?.status || "") && (
          <MenuItem onClick={() => handleEditClick(selectedItem)} sx={{ gap: 1.5 }}>
            <Edit size={18} />
            <Typography variant="body2">Edit</Typography>
          </MenuItem>
        )}
        {isActionAllowed("delete", selectedItem?.status || "") && (
          <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, color: "error.main" }}>
            <Trash2 size={18} />
            <Typography variant="body2">Delete</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Content</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset} color="inherit">Reset</Button>
          <Button onClick={handleFilterDialogClose}>Cancel</Button>
          <Button onClick={handleFilterApply} variant="contained" color="primary">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
<Dialog
  open={openViewDialog}
  onClose={() => setOpenViewDialog(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ 
    borderBottom: 1, 
    borderColor: 'divider',
    bgcolor: 'primary.main',
    color: 'white'
  }}>
    Article Preview
  </DialogTitle>
  <DialogContent dividers sx={{ p: 3 }}>
    {selectedItem && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
            color={getStatusColor(selectedItem.status)}
            size="small"
          />
          <Chip label={selectedItem.category?.name} size="small" />
        </Box>

        <Typography variant="h5" gutterBottom>
          {selectedItem.title}
        </Typography>

        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
          By {selectedItem.reporterName} ({selectedItem.reporterEmail}) • 
          Submitted on {new Date(selectedItem.createdAt).toLocaleDateString()}
          {selectedItem.publishedDate && 
            ` • Published on ${new Date(selectedItem.publishedDate).toLocaleDateString()}`
          }
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
          Summary
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedItem.summary}
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Content
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedItem.content}
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Tags
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {selectedItem.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
    <Button onClick={() => setOpenViewDialog(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>

{/* Edit Dialog */}
<Dialog
  open={openEditDialog}
  onClose={() => setOpenEditDialog(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ 
    borderBottom: 1, 
    borderColor: 'divider',
    bgcolor: 'primary.main',
    color: 'white'
  }}>
    Edit Article
  </DialogTitle>
  <DialogContent dividers sx={{ p: 3 }}>
    {editFormData && (
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={editFormData.title}
          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Summary"
          value={editFormData.summary || ''}
          onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
          multiline
          rows={3}
        />

        <TextField
          fullWidth
          label="Content"
          value={editFormData.content}
          onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
          multiline
          rows={6}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={editFormData.category?._id || ''}
            onChange={(e) => {
              const selectedCategory = categories.find(cat => cat._id === e.target.value);
              setEditFormData({ 
                ...editFormData, 
                category: selectedCategory 
              });
            }}
            label="Category"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={editFormData.language || 'English'}
            onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
            label="Language"
            required
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="Bengali">Bengali</MenuItem>
            <MenuItem value="Tamil">Tamil</MenuItem>
            <MenuItem value="Telugu">Telugu</MenuItem>
            <MenuItem value="Marathi">Marathi</MenuItem>
            <MenuItem value="Gujarati">Gujarati</MenuItem>
            <MenuItem value="Kannada">Kannada</MenuItem>
            <MenuItem value="Malayalam">Malayalam</MenuItem>
            <MenuItem value="Punjabi">Punjabi</MenuItem>
            <MenuItem value="Assamese">Assamese</MenuItem>
            <MenuItem value="Bhojpuri">Bhojpuri</MenuItem>
            <MenuItem value="Konkani">Konkani</MenuItem>
            <MenuItem value="Maithili">Maithili</MenuItem>
            <MenuItem value="Manipuri">Manipuri</MenuItem>
            <MenuItem value="Odia">Odia</MenuItem>
            <MenuItem value="Sanskrit">Sanskrit</MenuItem>
            <MenuItem value="Sindhi">Sindhi</MenuItem>
            <MenuItem value="Urdu">Urdu</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Fake News Status</InputLabel>
          <Select
            value={editFormData.isFake?.toString() || 'false'}
            onChange={(e) => setEditFormData({ ...editFormData, isFake: e.target.value === 'true' })}
            label="Fake News Status"
            required
          >
            <MenuItem value="false">Not Fake</MenuItem>
            <MenuItem value="true">Fake</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Location"
          value={editFormData.location || ''}
          onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {editFormData.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => {
                const newTags = editFormData.tags.filter((_, i) => i !== index);
                setEditFormData({ ...editFormData, tags: newTags });
              }}
            />
          ))}
        </Box>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
    <Button onClick={() => setOpenEditDialog(false)}>
      Cancel
    </Button>
    <Button onClick={handleEditSubmit} variant="contained" color="primary">
      Save Changes
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default ContentManagement;