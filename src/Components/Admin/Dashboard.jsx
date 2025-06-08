import { React, useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Container
} from "@mui/material";
import { 
  Users, 
  FileText, 
  Check, 
  Clock, 
  Trash2
} from "lucide-react";
import { authService } from "../../services/auth.service";
import { applicationService } from "../../services/application.service";
import { newsService } from "../../services/news.service";
import { toast } from "sonner";

const Dashboard = ({ userRole, setCurrentSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [dashboardStats, setDashboardStats] = useState({
    totalReporters: 0,
    pendingApplications: 0,
    publishedArticles: 0,
    rejectedArticles: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const publishedArticlesCount = 12; // Example value
  const rejectedArticlesCount = 3;   // Example value

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch reporters
        const reportersResponse = await authService.getReporters();
        const reporters = reportersResponse.data;
        
        // Fetch applications
        const applicationsResponse = await applicationService.getAllApplications();
        const applications = applicationsResponse.data;
        
        // Fetch news articles
        const newsResponse = await newsService.getAllNews();
        const articles = newsResponse.data;

        // Sort and get latest 3 applications
        const latestApplications = applications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map(app => ({
            id: app._id,
            name: app.reporterId?.name || 'Unknown',
            email: app.reporterId?.email || 'No email',
            date: app.createdAt,
            status: app.status,
            bio: app.bio,
            currentAffiliation: app.currentAffiliation
          }));
        setRecentApplications(latestApplications);

        // Get recent articles (last 5)
        const recentArticles = articles
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(article => ({
            id: article._id,
            title: article.title,
            status: article.status,
            submittedDate: article.createdAt,
            category: article.category?.name
          }));
        setRecentArticles(recentArticles);

        // Calculate stats
        const pendingApps = applications.filter(app => app.status === 'pending').length;
        const totalReporters = reporters.length;
        const publishedArticles = articles.filter(article => article.status === 'published').length;
        const rejectedArticles = articles.filter(article => article.status === 'rejected').length;

        // Set dashboard stats
        setDashboardStats({
          totalReporters,
          pendingApplications: pendingApps,
          publishedArticles,
          rejectedArticles
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewAllArticles = () => {
    setCurrentSection("content");
  };

  const handleViewAll = () => {
    setCurrentSection("users");
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const statsData = [
    { 
      icon: Users, 
      value: dashboardStats.totalReporters, 
      label: 'Total Reporters', 
      color: '#1976d2', 
      bgColor: '#e3f2fd' 
    },
    { 
      icon: Clock, 
      value: dashboardStats.pendingApplications, 
      label: 'Pending Applications', 
      color: '#ff9800', 
      bgColor: '#fff8e1' 
    },
    { 
      icon: FileText, 
      value: dashboardStats.publishedArticles, 
      label: 'Published Articles', 
      color: '#2e7d32', 
      bgColor: '#e8f5e9' 
    },
    { 
      icon: Trash2, 
      value: dashboardStats.rejectedArticles, 
      label: 'Rejected Articles', 
      color: '#d32f2f', 
      bgColor: '#ffebee' 
    }
  ];

  return (
    <Container 
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontWeight: 600,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Dashboard
      </Typography>

      {/* Stats Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        {statsData.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index} width={{xs: '100vw', sm: '100%', md: '23%'}}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 },
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: stat.bgColor,
                borderRadius: 3,
                height: '100%',
                minHeight: { xs: 130, sm: 150, md: 170 },
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: stat.color,
                }
              }}
            >
              <stat.icon 
                size={isMobile ? 28 : isTablet ? 32 : 36} 
                color={stat.color} 
              />
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  mt: { xs: 1.5, sm: 2 }, 
                  fontWeight: 'bold',
                  color: stat.color,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="body2"
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 500,
                  lineHeight: 1.3,
                  mt: 0.5
                }}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Content Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Recent Applications Card */}
        <Grid item xs={12} lg={6}  width={{xs: '100vw', sm: '100%', md: '75%' , lg:'50%'}}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardHeader 
              title={
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}

                  
                >
                  Recent Reporter Applications
                </Typography>
              }
              sx={{ 
                pb: { xs: 1, sm: 2 },
                px: { xs: 2, sm: 3 }
              }}
            />
            <CardContent
              sx={{
                px: { xs: 2, sm: 3 },
                pt: 0,
                pb: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
                {recentApplications.length > 0 ? (
                  recentApplications.map((application) => (
                    <Paper
                      key={application.id}
                      variant="outlined"
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: theme.shadows[2],
                          borderColor: 'primary.light'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                      >
                        {/* Left Content */}
                        <Box 
                          sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0.5,
                            flex: 1,
                            pr: { sm: 2 }
                          }}
                        >
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="600"
                            sx={{ 
                              fontSize: { xs: '0.95rem', sm: '1rem' },
                              wordBreak: 'break-word'
                            }}
                          >
                            {application.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              wordBreak: 'break-all'
                            }}
                          >
                            {application.email}
                          </Typography>
                          {application.currentAffiliation && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                              }}
                            >
                              {application.currentAffiliation}
                            </Typography>
                          )}
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                          >
                            Applied: {new Date(application.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        {/* Right Content */}
                        <Box 
                          sx={{ 
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1,
                            mt: { xs: 2, sm: 0 }
                          }}
                        >
                          <Chip
                            label={application.status.toUpperCase()}
                            color={application.status === 'pending' ? 'warning' : 
                                   application.status === 'approved' ? 'success' : 'error'}
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              fontWeight: 600
                            }}
                          />
                          {userRole === 'admin' && application.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<Check size={14} />}
                                onClick={handleViewAll}
                                sx={{ 
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  px: { xs: 1, sm: 1.5 },
                                  py: 0.5
                                }}
                              >
                                {isMobile ? 'OK' : 'Approve'}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={handleViewAll}
                                sx={{ 
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  px: { xs: 1, sm: 1.5 },
                                  py: 0.5
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: { xs: 3, sm: 4 },
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      No recent applications
                    </Typography>
                  </Box>
                )}
                
                <Button 
                  variant="text"
                  onClick={handleViewAll}
                  fullWidth
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  View All Applications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Articles Card */}
        <Grid item xs={12} lg={6} width={{xs: '100vw', sm: '100%', md: '75%' , lg:'46%'}}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardHeader 
              title={
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  Recent Articles
                </Typography>
              }
              sx={{ 
                pb: { xs: 1, sm: 2 },
                px: { xs: 2, sm: 3 }
              }}
            />
            <CardContent
              sx={{
                px: { xs: 2, sm: 3 },
                pt: 0,
                pb: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
                {recentArticles.length > 0 ? (
                  recentArticles.map((article) => (
                    <Paper
                      key={article.id}
                      variant="outlined"
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: theme.shadows[2],
                          borderColor: 'primary.light'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'stretch', sm: 'flex-start' },
                          gap: { xs: 2, sm: 3 }
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle1"
                            sx={{ 
                              fontSize: { xs: '0.95rem', sm: '1rem' },
                              fontWeight: 600,
                              mb: 1,
                              wordBreak: 'break-word',
                              lineHeight: 1.4
                            }}
                          >
                            {article.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            Status: {article.status.charAt(0).toUpperCase() + article.status.slice(1)} • 
                            {new Date(article.submittedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            gap: 1,
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                          }}
                        >
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            onClick={handleViewAllArticles}
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              px: { xs: 1, sm: 1.5 },
                              py: 0.5
                            }}
                          >
                            View
                          </Button>
                          {(userRole === 'admin' || userRole === 'editor') && article.status !== 'published' && (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="secondary"
                              onClick={handleViewAllArticles}
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                px: { xs: 1, sm: 1.5 },
                                py: 0.5
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: { xs: 3, sm: 4 },
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      No recent articles
                    </Typography>
                  </Box>
                )}
                
                <Button 
                  variant="text"
                  onClick={handleViewAllArticles}
                  fullWidth
                  sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  View All Articles
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
