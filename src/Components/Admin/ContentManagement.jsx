import React, { useState,useEffect } from "react";
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
  Select
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

  const [articles, setArticles] = useState(() => {
    // Try to get articles from localStorage first
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      return JSON.parse(savedArticles);
    }
    // If no articles in localStorage, use sample data
    return sampleContent;
  });

   useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
  }, [articles]);

  // Filter contents based on tab, search term, and filters
  const filterContent = () => {
    const statusFilters = ["all", "published", "draft", "pending", "rejected"];
    const currentStatusFilter = statusFilters[tabValue];

    return articles.filter((item) => {
      // Filter by status tab
      if (currentStatusFilter !== "all" && item.status !== currentStatusFilter) {
        return false;
      }

      // Filter by search term
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.author.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by category
      if (filterCategory && item.category !== filterCategory) {
        return false;
      }

      // Additional status filter (used when custom filtering)
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
      const updatedArticles = articles.filter(article => article.id !== selectedItem.id);
      setArticles(updatedArticles);
      toast({
        title: "Content Deleted",
        description: `"${selectedItem.title}" has been deleted`,
      });
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

const handleEditClick = () => {
  closeActionMenu();
  setEditFormData(selectedItem);
  setOpenEditDialog(true);
};

const handleEditSubmit = () => {
  const updatedArticles = articles.map(article => 
    article.id === editFormData.id ? editFormData : article
  );
  setArticles(updatedArticles);
  setOpenEditDialog(false);
  setSelectedItem(null);
  setEditFormData(null);
  toast({
    title: "Article Updated",
    description: "The article has been updated successfully",
  });
};

const handleApproveArticle = (articleId) => {
  const updatedArticles = articles.map(article => 
    article.id === articleId 
      ? { 
          ...article, 
          status: 'published', 
          publishedDate: new Date().toISOString().split('T')[0] 
        }
      : article
  );
  setArticles(updatedArticles);
  toast({
    title: "Article Approved",
    description: "The article has been published successfully",
  });
};

const handleRejectArticle = (articleId) => {
  const updatedArticles = articles.map(article => 
    article.id === articleId 
      ? { 
          ...article, 
          status: 'rejected',
          publishedDate: null
        }
      : article
  );
  setArticles(updatedArticles);
  toast({
    title: "Article Rejected",
    description: "The article has been rejected",
  });
};

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "default";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const isActionAllowed = (action, itemStatus) => {
      
      if(action === "view") return true;
      if(action === "edit" && itemStatus === "draft") return true;
      if (action === "edit" && itemStatus === "published") return false;
      if (action === "edit" && itemStatus === "pending") return true;
      if (action === "edit" && itemStatus === "rejected") return false;
      if (action === "delete" && itemStatus === "draft") return true;
      if (action === "delete" && itemStatus === "published") return false;
      if (action === "delete" && itemStatus === "pending") return true;
      if (action === "delete" && itemStatus === "rejected") return false;
      
    
  };

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
            <Tab label="Published" />
            <Tab label="Drafts" />
            <Tab label="Pending Review" />
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
    <TableCell>Author</TableCell>
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
      <TableRow key={item.id}>
        <TableCell>{item.title}</TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell>{item.author}</TableCell>
        <TableCell>
          <Chip 
            label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            color={getStatusColor(item.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(item.submittedDate).toLocaleDateString()}
        </TableCell>
        {(userRole === 'admin' || userRole === 'editor') && (
          <TableCell align="right">
            {item.status === 'pending' && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleApproveArticle(item.id)}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleRejectArticle(item.id)}
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
          <MenuItem onClick={handleEditClick} sx={{ gap: 1.5 }}>
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
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
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
          <Chip label={selectedItem.category} size="small" />
        </Box>

        <Typography variant="h5" gutterBottom>
          {selectedItem.headline}
        </Typography>

        <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
          By {selectedItem.author} • 
          Submitted on {new Date(selectedItem.submittedDate).toLocaleDateString()}
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
          label="Headline"
          value={editFormData.headline}
          onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Summary"
          value={editFormData.summary}
          onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
          multiline
          rows={3}
          required
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
            value={editFormData.category}
            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            label="Category"
          >
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {editFormData.tags.map((tag, index) => (
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