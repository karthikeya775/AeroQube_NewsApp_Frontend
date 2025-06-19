import React , {useState,useEffect} from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { 
  FileText, 
  Check, 
  AlertTriangle,
  Clock,
  BarChart,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { newsService } from '../../services/news.service'; // Assuming newsService exists
import { authService } from '../../services/auth.service'; // Assuming authService exists to get user info

const ReporterDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [articles, setArticles] = useState([]); // State to hold fetched articles
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

 const [articleStats, setArticleStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    rejected: 0,
    approvalRate: 0
  });
  
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  // Add useEffect to fetch and calculate stats
  useEffect(() => {
    const fetchReporterNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming user ID is available from authService or localStorage
        const userProfileResponse = await authService.getProfile(); // Get user profile

        if (!userProfileResponse.success || !userProfileResponse.data || !userProfileResponse.data._id) {
          setError('User not logged in or user ID not found.');
          setLoading(false);
          toast.error('User not logged in or user ID not found.');
          return;
        }

        const reporterId = userProfileResponse.data._id; // Use the user ID from the profile
        console.log("reporterId",reporterId);

        const newsResponse = await newsService.getNewsByReporter(reporterId, { limit: rowsPerPage, offset: currentPage * rowsPerPage + 1 });
        console.log("newsResponse",newsResponse);

        let submissions = [];
        if (newsResponse.success) {
          if (Array.isArray(newsResponse.data?.data)) {
            submissions = newsResponse.data.data;
          } else if (Array.isArray(newsResponse.data)) {
            submissions = newsResponse.data;
          } else {
            submissions = [];
          }
          setTotalCount(newsResponse.total || submissions.length);
          setArticles(submissions); // Update articles state with fetched data

          // Calculate stats based on fetched data
          const stats = {
            total: newsResponse.total || submissions.length,
            published: submissions.filter(article => article.status === 'published').length,
            pending: submissions.filter(article => article.status === 'pending').length,
            rejected: submissions.filter(article => article.status === 'rejected').length
          };

          // Calculate approval rate
          const totalReviewed = stats.published + stats.rejected;
          stats.approvalRate = totalReviewed > 0
            ? Math.round((stats.published / totalReviewed) * 100)
            : 0;

          setArticleStats(stats);

          // Get recent submissions (last 3) based on fetched data
          const recent = submissions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt
            .slice(0, 3)
            .map(article => ({
              id: article._id, // Use _id from backend
              title: article.title,
              date: article.createdAt, // Use createdAt from backend
              status: article.status
            }));

          setRecentSubmissions(recent);

        } else {
          setError(newsResponse.message || 'Failed to fetch articles.');
          toast.error(newsResponse.message || 'Failed to fetch articles.');
        }
      } catch (err) {
        console.error('Error fetching reporter news:', err);
        setError('An error occurred while fetching articles.');
        toast.error('An error occurred while fetching articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchReporterNews();

  }, [currentPage, rowsPerPage]); // Refetch on page/rows change

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Calculate performance metrics based on fetched data
  const calculatePerformanceMetrics = () => {
    // Use the 'articles' state which now holds backend data
    const submissions = articles;

    // Average word count
    const avgWordCount = submissions.length > 0
      ? Math.round(submissions.reduce((acc, curr) =>
          acc + (curr.content?.split(' ').filter(word => word.trim() !== '').length || 0), 0) // Add optional chaining and fallback for content
        / submissions.length)
      : 0;

    // Monthly articles (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyCount = submissions.filter(
      article => article.createdAt && new Date(article.createdAt) > thirtyDaysAgo // Use createdAt and check if it exists
    ).length;

    return {
      avgWordCount: `${avgWordCount} words`,
      monthlyArticles: monthlyCount
    };
  };

  const metrics = calculatePerformanceMetrics();

  
  // Mock data for recent submissions
//   const recentSubmissions = [
//     { 
//       id: 1, 
//       title: "Climate Change Impact on Local Agriculture", 
//       date: "2023-05-10", 
//       status: "published" 
//     },
//     { 
//       id: 2, 
//       title: "New Tech Startups in Rural Areas", 
//       date: "2023-05-08", 
//       status: "pending" 
//     },
//     { 
//       id: 3, 
//       title: "Analysis of Recent Economic Policies", 
//       date: "2023-05-05", 
//       status: "rejected" 
//     },
//   ];
  
  // Helper function to render status indicator
  const renderStatusIndicator = (status) => {
    if (status === "published") {
      return <Check size={16} color="#4caf50" />;
    } else if (status === "pending") {
      return <Clock size={16} color="#ff9800" />;
    } else {
      return <AlertTriangle size={16} color="#f44336" />;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Reporter Dashboard
      </Typography>
      
      {loading && <Typography>Loading articles...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading && !error && (
        <>
        <Grid container spacing={3}>
          {/* Stats cards */}
          <Grid item xs={12} sm={6} md={3} width= { {xs:'100%', md:'250px' ,lg:'250px'}}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: '#e3f2fd',
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <FileText size={isMobile ? 24 : 32} color="#1976d2" />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {articleStats.total}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Submissions
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}  width= { {xs:'100%', md:'250px' ,lg:'250px'}}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: '#e8f5e9',
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Check size={isMobile ? 24 : 32} color="#2e7d32" />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {articleStats.published}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Published Articles
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}  width= { {xs:'100%', md:'250px' ,lg:'250px'}}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: '#fff8e1',
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Clock size={isMobile ? 24 : 32} color="#ff9800" />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {articleStats.pending}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Pending Review
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}  width= { {xs:'100%', md:'250px' ,lg:'250px'}}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: '#ffebee',
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <AlertTriangle size={isMobile ? 24 : 32} color="#d32f2f" />
              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {articleStats.rejected}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Rejected Articles
              </Typography>
            </Paper>
          </Grid>
          
          {/* Monthly performance */}
          <Grid item xs={12} md={8}  width= { {xs:'100%', md:'550px' ,lg:'550px'}}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChart size={24} sx={{ mr: 1 }} />
                    <Typography variant="h6">Monthly Performance</Typography>
                  </Box>
                  <Button variant="text" color="primary">View Details</Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Approval Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={articleStats.approvalRate} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {articleStats.approvalRate}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Your approval rate is above average compared to other reporters
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1" sx={{ fontWeight: 550, mb: 2 }}>
                      Performance Metrics
                  </Typography>
                  <Grid container spacing={5}>
                      <Grid item xs={6} md={3}>
                      <Box>
                          <Typography variant="caption" color="textSecondary">
                          Avg. Word Count
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {metrics.avgWordCount}
                          </Typography>
                      </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                      <Box>
                          <Typography variant="caption" color="textSecondary">
                          Approval Rate
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {articleStats.approvalRate}%
                          </Typography>
                      </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                      <Box>
                          <Typography variant="caption" color="textSecondary">
                          Pending Review
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {articleStats.pending}
                          </Typography>
                      </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                      <Box>
                          <Typography variant="caption" color="textSecondary">
                          Monthly Articles
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {metrics.monthlyArticles}
                          </Typography>
                      </Box>
                      </Grid>
                  </Grid>
                  </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent submissions */}
          <Grid item xs={12} md={4}  width= { {xs:'100%', md:'100%' ,lg:'500px'}}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Recent Submissions</Typography>
                  <Button variant="text" color="primary" onClick={() => {navigate('/reporter/submissions')}}>
                    View All
                  </Button>
                </Box>
                <Divider />
                <List>
                  {recentSubmissions.map((submission) => (
                    <React.Fragment key={submission.id}>
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ px: 0, py: 1.5 }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {renderStatusIndicator(submission.status)}
                              <Typography 
                                variant="body1" 
                                sx={{ ml: 1, fontWeight: 500 }}
                              >
                                {submission.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography 
                              variant="body2" 
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              {submission.date ? new Date(submission.date).toLocaleDateString() !== 'Invalid Date' ? new Date(submission.date).toLocaleDateString() : 'N/A' : 'N/A'} {/* Add date validation */}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => {navigate('/reporter/submit')}}
                >
                  Submit New Article
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Guidelines */}
          {/* <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Submission Guidelines Reminder
                </Typography>
                <Typography variant="body2" paragraph>
                  1. All submissions must include proper citations and sources for factual claims.
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Articles should be 800-1500 words unless specified otherwise by your editor.
                </Typography>
                <Typography variant="body2" paragraph>
                  3. Include at least one high-quality relevant image with proper attribution.
                </Typography>
                <Typography variant="body2">
                  4. Check our style guide for formatting requirements and preferred language usage.
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
        </>
      )}
    </Box>
  );
};

export default ReporterDashboard;