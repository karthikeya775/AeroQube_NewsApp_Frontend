import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  TablePagination,
  LinearProgress,
  DialogContentText,
} from '@mui/material';
import {
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Info,
  Play,
  Plus,
  ChevronDown,
  Edit2,
  Clock,
  Trash2,
  RefreshCw,
  FileText,
  Shield,
  Settings as SettingsIcon,
  Globe,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
     <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      style={{
        height: '100%',
        overflow: 'auto'
      }}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsPanel = ({ userRole }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  
  // News sources state
  const [sources, setSources] = useState([
    { 
      id: 1, 
      name: 'BBC News',
      url: 'https://www.bbc.com/news',
      feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
      language: 'English',
      country: 'Global',
      interval: 30,
      active: true,
      lastScraped: new Date(Date.now() - 10 * 60000).toISOString(),
      lastStatus: 'success',
      newArticles: 5,
    },
    { 
      id: 2, 
      name: 'The Hindu',
      url: 'https://www.thehindu.com/',
      feedUrl: 'https://www.thehindu.com/rss/feed/',
      language: 'English',
      country: 'India',
      interval: 60,
      active: true,
      lastScraped: new Date(Date.now() - 55 * 60000).toISOString(),
      lastStatus: 'success',
      newArticles: 8,
    },
    { 
      id: 3, 
      name: 'Times of India',
      url: 'https://timesofindia.indiatimes.com/',
      feedUrl: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
      language: 'English',
      country: 'India',
      interval: 45,
      active: true,
      lastScraped: new Date(Date.now() - 20 * 60000).toISOString(),
      lastStatus: 'error',
      errorMessage: 'Connection timeout',
      newArticles: 0,
    },
    { 
      id: 4, 
      name: 'NDTV',
      url: 'https://www.ndtv.com/',
      feedUrl: 'https://feeds.feedburner.com/ndtvnews-india-news',
      language: 'English',
      country: 'India',
      interval: 30,
      active: true,
      lastScraped: new Date(Date.now() - 15 * 60000).toISOString(),
      lastStatus: 'success',
      newArticles: 3,
    },
    { 
      id: 5, 
      name: 'Aaj Tak',
      url: 'https://www.aajtak.in/',
      feedUrl: 'https://www.aajtak.in/rss/home',
      language: 'Hindi',
      country: 'India',
      interval: 60,
      active: false,
      lastScraped: new Date(Date.now() - 240 * 60000).toISOString(),
      lastStatus: 'success',
      newArticles: 12,
    },
  ]);

  // Source logs data (for demo)
  const sourceLogs = {
    1: [
      { timestamp: new Date(Date.now() - 10 * 60000).toISOString(), status: 'success', message: '5 new articles fetched', details: 'Processed 24 items, found 5 new' },
      { timestamp: new Date(Date.now() - 40 * 60000).toISOString(), status: 'success', message: '3 new articles fetched', details: 'Processed 24 items, found 3 new' },
      { timestamp: new Date(Date.now() - 70 * 60000).toISOString(), status: 'success', message: '0 new articles fetched', details: 'Processed 24 items, no changes' },
      { timestamp: new Date(Date.now() - 100 * 60000).toISOString(), status: 'success', message: '7 new articles fetched', details: 'Processed 25 items, found 7 new' },
      { timestamp: new Date(Date.now() - 130 * 60000).toISOString(), status: 'error', message: 'Connection timeout', details: 'Request timed out after 30 seconds' },
    ],
    2: [
      { timestamp: new Date(Date.now() - 55 * 60000).toISOString(), status: 'success', message: '8 new articles fetched', details: 'Processed 32 items, found 8 new' },
      { timestamp: new Date(Date.now() - 115 * 60000).toISOString(), status: 'success', message: '4 new articles fetched', details: 'Processed 30 items, found 4 new' },
      { timestamp: new Date(Date.now() - 175 * 60000).toISOString(), status: 'success', message: '2 new articles fetched', details: 'Processed 30 items, found 2 new' },
    ],
    3: [
      { timestamp: new Date(Date.now() - 20 * 60000).toISOString(), status: 'error', message: 'Connection timeout', details: 'Request timed out after 30 seconds' },
      { timestamp: new Date(Date.now() - 65 * 60000).toISOString(), status: 'success', message: '6 new articles fetched', details: 'Processed 28 items, found 6 new' },
      { timestamp: new Date(Date.now() - 110 * 60000).toISOString(), status: 'success', message: '3 new articles fetched', details: 'Processed 28 items, found 3 new' },
    ],
    4: [
      { timestamp: new Date(Date.now() - 15 * 60000).toISOString(), status: 'success', message: '3 new articles fetched', details: 'Processed 18 items, found 3 new' },
      { timestamp: new Date(Date.now() - 45 * 60000).toISOString(), status: 'success', message: '0 new articles fetched', details: 'Processed 18 items, no changes' },
      { timestamp: new Date(Date.now() - 75 * 60000).toISOString(), status: 'success', message: '5 new articles fetched', details: 'Processed 18 items, found 5 new' },
    ],
    5: [
      { timestamp: new Date(Date.now() - 240 * 60000).toISOString(), status: 'success', message: '12 new articles fetched', details: 'Processed 42 items, found 12 new' },
      { timestamp: new Date(Date.now() - 300 * 60000).toISOString(), status: 'success', message: '8 new articles fetched', details: 'Processed 40 items, found 8 new' },
    ],
  };

  // State for various dialogs
  const [openSourceDialog, setOpenSourceDialog] = useState(false);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [selectedLogsSource, setSelectedLogsSource] = useState(null);
  const [scraping, setScraping] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Form data for adding/editing a source
  const [sourceFormData, setSourceFormData] = useState({
    name: '',
    url: '',
    feedUrl: '',
    language: 'English',
    country: 'India',
    interval: 30,
    active: true,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Source dialog handlers
  const handleOpenSourceDialog = (source = null) => {
    if (source) {
      setCurrentSource(source);
      setSourceFormData({
        name: source.name,
        url: source.url,
        feedUrl: source.feedUrl,
        language: source.language,
        country: source.country,
        interval: source.interval,
        active: source.active,
      });
      setIsAddingSource(false);
    } else {
      setCurrentSource(null);
      setSourceFormData({
        name: '',
        url: '',
        feedUrl: '',
        language: 'English',
        country: 'India',
        interval: 30,
        active: true,
      });
      setIsAddingSource(true);
    }
    setOpenSourceDialog(true);
  };

  const handleCloseSourceDialog = () => {
    setOpenSourceDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSourceFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setSourceFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSource = () => {
    if (!sourceFormData.name || !sourceFormData.url) {
      toast.error("Name and URL are required fields");
      return;
    }
    
    if (currentSource) {
      // Update existing source
      const updatedSources = sources.map(src => 
        src.id === currentSource.id ? { ...src, ...sourceFormData } : src
      );
      setSources(updatedSources);
      toast.success("Source updated successfully");
    } else {
      // Add new source
      const newSource = {
        id: sources.length + 1,
        ...sourceFormData,
        lastScraped: null,
        lastStatus: null,
      };
      setSources([...sources, newSource]);
      toast.success("New source added successfully");
    }
    
    handleCloseSourceDialog();
  };

  // Delete dialog handlers
  const handleOpenDeleteDialog = (source) => {
    setCurrentSource(source);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteSource = () => {
    const updatedSources = sources.filter(src => src.id !== currentSource.id);
    setSources(updatedSources);
    toast.success("Source deleted successfully");
    handleCloseDeleteDialog();
  };

  // Logs dialog handlers
  const handleOpenLogsDialog = (source) => {
    setSelectedLogsSource(source);
    setOpenLogsDialog(true);
  };

  const handleCloseLogsDialog = () => {
    setOpenLogsDialog(false);
  };

  // Handle scrape now action
  const handleScrapeNow = (sourceId) => {
    setScraping(prev => ({ ...prev, [sourceId]: true }));
    
    // Simulate scraping
    setTimeout(() => {
      const updatedSources = sources.map(src => {
        if (src.id === sourceId) {
          const success = Math.random() > 0.2; // 80% chance of success
          const newArticles = success ? Math.floor(Math.random() * 5) : 0;
          
          return {
            ...src,
            lastScraped: new Date().toISOString(),
            lastStatus: success ? 'success' : 'error',
            errorMessage: success ? null : 'Random error occurred',
            newArticles
          };
        }
        return src;
      });
      
      setSources(updatedSources);
      setScraping(prev => ({ ...prev, [sourceId]: false }));
      
      const source = updatedSources.find(src => src.id === sourceId);
      if (source.lastStatus === 'success') {
        toast.success(`${source.name} scraped successfully. Found ${source.newArticles} new articles.`);
      } else {
        toast.error(`Failed to scrape ${source.name}: ${source.errorMessage}`);
      }
    }, 2000); // Simulate a 2-second scrape operation
  };

  // Helper to format time interval
  const formatInterval = (minutes) => {
    return minutes < 60 ? `${minutes} min` : `${minutes/60} hr`;
  };

  // Helper to format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 60 * 24) return `${Math.floor(diffMinutes / 60)} hr ago`;
    return `${Math.floor(diffMinutes / (60 * 24))} days ago`;
  };

  // Slice sources for pagination
  const displayedSources = sources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
     <Box sx={{ 
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Typography variant="h5" component="h1" gutterBottom>
        System Settings
      </Typography>
      
      <Paper sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* News Sources Tab */}
         <TabPanel value={tabValue} index={0} sx={{ 
          flex: 1,
          overflow: 'auto',
          height: '100%'
        }}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                News Sources & Scraping Configuration
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Manage news sources and configure scraping settings
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenSourceDialog()}
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              Add News Source
            </Button>
          </Box>
          
          {isMobile ? (
            // Mobile view - cards
            <Box>
              {displayedSources.map((source) => (
                <Card key={source.id} sx={{ mb: 2, borderLeft: source.active ? `4px solid ${theme.palette.primary.main}` : `4px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle1" component="div">
                        {source.name}
                        <Chip
                          label={source.active ? "Active" : "Inactive"}
                          size="small"
                          color={source.active ? "primary" : "default"}
                          sx={{ ml: 1, fontWeight: 'normal', fontSize: '0.75rem' }}
                        />
                      </Typography>
                      <Chip
                        label={`Every ${formatInterval(source.interval)}`}
                        size="small"
                        icon={<Clock size={14} />}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      {source.url}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                      Language: {source.language} | Country: {source.country}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip
                        icon={source.lastStatus === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        label={
                          <>
                            Last scrape: {formatRelativeTime(source.lastScraped)}
                            {source.lastStatus === 'success' && source.newArticles > 0 && 
                              ` • ${source.newArticles} new`
                            }
                          </>
                        }
                        size="small"
                        color={source.lastStatus === 'success' ? "success" : "error"}
                        variant={source.lastStatus === 'success' ? "filled" : "filled"}
                      />
                    </Box>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<RefreshCw size={16} />}
                        onClick={() => handleScrapeNow(source.id)}
                        disabled={scraping[source.id]}
                        variant="outlined"
                      >
                        {scraping[source.id] ? 'Scraping...' : 'Scrape Now'}
                      </Button>
                      
                      <IconButton size="small" onClick={() => handleOpenLogsDialog(source)} color="primary">
                        <Eye size={18} />
                      </IconButton>
                      
                      <IconButton size="small" onClick={() => handleOpenSourceDialog(source)} color="primary">
                        <Edit2 size={18} />
                      </IconButton>
                      
                      <IconButton size="small" onClick={() => handleOpenDeleteDialog(source)} color="error">
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                    
                    {scraping[source.id] && (
                      <LinearProgress sx={{ mt: 2 }} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop view - table
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Interval</TableCell>
                    <TableCell>Last Scraped</TableCell>
                    <TableCell>Last Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedSources.map((source) => (
                    <TableRow key={source.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1">
                            {source.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {source.language} • {source.country}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={source.active ? "Active" : "Inactive"}
                          size="small"
                          color={source.active ? "primary" : "default"}
                          variant={source.active ? "filled" : "outlined"}
                          sx={{ fontWeight: 'normal' }}
                        />
                      </TableCell>
                      <TableCell>
                        Every {formatInterval(source.interval)}
                      </TableCell>
                      <TableCell>
                        {source.lastScraped ? (
                          formatRelativeTime(source.lastScraped)
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Never
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {source.lastStatus && (
                          <Chip
                            icon={source.lastStatus === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                            label={
                              source.lastStatus === 'success' 
                                ? `Success (${source.newArticles} new)` 
                                : `Error: ${source.errorMessage}`
                            }
                            size="small"
                            color={source.lastStatus === 'success' ? "success" : "error"}
                            variant="filled"
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {scraping[source.id] ? (
                            <Chip
                              label="Scraping..."
                              size="small"
                              icon={<RefreshCw size={14} className="animate-spin" />}
                              color="primary"
                            />
                          ) : (
                            <Button
                              size="small"
                              startIcon={<RefreshCw size={16} />}
                              onClick={() => handleScrapeNow(source.id)}
                              variant="outlined"
                            >
                              Scrape Now
                            </Button>
                          )}
                          
                          <Tooltip title="View Logs">
                            <IconButton size="small" onClick={() => handleOpenLogsDialog(source)} color="primary">
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit Source">
                            <IconButton size="small" onClick={() => handleOpenSourceDialog(source)} color="primary">
                              <Edit2 size={18} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete Source">
                            <IconButton size="small" onClick={() => handleOpenDeleteDialog(source)} color="error">
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sources.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>
        
      </Paper>

      {/* Add/Edit Source Dialog */}
      <Dialog 
        open={openSourceDialog} 
        onClose={handleCloseSourceDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isAddingSource ? 'Add News Source' : 'Edit News Source'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Source Name"
                fullWidth
                required
                value={sourceFormData.name}
                onChange={handleInputChange}
                placeholder="e.g. BBC News, The Hindu"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="url"
                label="Website URL"
                fullWidth
                required
                value={sourceFormData.url}
                onChange={handleInputChange}
                placeholder="e.g. https://www.bbc.com/news"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="feedUrl"
                label="RSS Feed URL (if available)"
                fullWidth
                value={sourceFormData.feedUrl}
                onChange={handleInputChange}
                placeholder="e.g. https://feeds.bbci.co.uk/news/rss.xml"
                helperText="Leave blank if no RSS feed is available"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  name="language"
                  value={sourceFormData.language}
                  label="Language"
                  onChange={handleInputChange}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Tamil">Tamil</MenuItem>
                  <MenuItem value="Telugu">Telugu</MenuItem>
                  <MenuItem value="Malayalam">Malayalam</MenuItem>
                  <MenuItem value="Kannada">Kannada</MenuItem>
                  <MenuItem value="Bengali">Bengali</MenuItem>
                  <MenuItem value="Marathi">Marathi</MenuItem>
                  <MenuItem value="Gujarati">Gujarati</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="country-label">Country/Region</InputLabel>
                <Select
                  labelId="country-label"
                  name="country"
                  value={sourceFormData.country}
                  label="Country/Region"
                  onChange={handleInputChange}
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="Global">Global</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                  <MenuItem value="Middle East">Middle East</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="interval-label">Scrape Interval</InputLabel>
                <Select
                  labelId="interval-label"
                  name="interval"
                  value={sourceFormData.interval}
                  label="Scrape Interval"
                  onChange={handleInputChange}
                >
                  <MenuItem value={15}>Every 15 minutes</MenuItem>
                  <MenuItem value={30}>Every 30 minutes</MenuItem>
                  <MenuItem value={45}>Every 45 minutes</MenuItem>
                  <MenuItem value={60}>Every 1 hour</MenuItem>
                  <MenuItem value={120}>Every 2 hours</MenuItem>
                  <MenuItem value={180}>Every 3 hours</MenuItem>
                  <MenuItem value={360}>Every 6 hours</MenuItem>
                  <MenuItem value={720}>Every 12 hours</MenuItem>
                  <MenuItem value={1440}>Every 24 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch 
                    name="active"
                    checked={sourceFormData.active}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Active"
              />
              <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                {sourceFormData.active 
                  ? "This source will be regularly scraped" 
                  : "This source will not be scraped"
                }
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSourceDialog} color="inherit">Cancel</Button>
          <Button onClick={handleSaveSource} variant="contained" color="primary">
            {isAddingSource ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete News Source
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete <strong>{currentSource?.name}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteSource} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Source Logs Dialog */}
      <Dialog
        open={openLogsDialog}
        onClose={handleCloseLogsDialog}
        aria-labelledby="logs-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="logs-dialog-title">
          Scraping Logs: {selectedLogsSource?.name}
        </DialogTitle>
        <DialogContent>
          {selectedLogsSource && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourceLogs[selectedLogsSource.id]?.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={log.status === 'success' ? "success" : "error"}
                          icon={log.status === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        />
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogsDialog} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPanel;