import {React,useState,useEffect} from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  Button
} from "@mui/material";
import { 
  Users, 
  FileText, 
  Check, 
  Clock, 
  Trash2
} from "lucide-react";

const Dashboard = ({ userRole, setCurrentSection  }) => {

  const [recentApplications, setRecentApplications] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]); // Add this

  useEffect(() => {
    // Get applications from localStorage
    const applications = JSON.parse(localStorage.getItem('reporterApplications') || '[]');
    const latestApplications = applications
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
      .slice(0, 3);
    setRecentApplications(latestApplications);

    // Get articles from localStorage
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const latestArticles = articles
      .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
      .slice(0, 3);
    setRecentArticles(latestArticles);
  }, []);

  const handleViewAllArticles = () => {
    setCurrentSection("content");
  };


  const handleViewAll = () => {
    setCurrentSection("users");
  };

  

  return (
    <Box
  sx={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }}
>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>

      <Box
    sx={{
      flex: 1,
      overflowY: 'auto',
      px: 3,
      pb: 3,
    }}
  >
      
      <Grid container spacing={3}>
        {/* Stats cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              width:'250px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#e3f2fd',
              height: '100%',
              borderRadius: 2,
              minHeight: 150
            }}
          >
            <Users size={32} color="#1976d2" />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>24</Typography>
            <Typography variant="body1" color="textSecondary">Total Reporters</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              width:'250px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#fff8e1',
              height: '100%',
              borderRadius: 2,
              minHeight: 150
            }}
          >
            <Clock size={32} color="#ff9800" />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>8</Typography>
            <Typography variant="body1" color="textSecondary">Pending Applications</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              width:'250px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#e8f5e9',
              height: '100%',
              borderRadius: 2,
              minHeight: 150
            }}
          >
            <FileText size={32} color="#2e7d32" />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>156</Typography>
            <Typography variant="body1" color="textSecondary">Published Articles</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              width:'250px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#ffebee',
              height: '100%',
              borderRadius: 2,
              minHeight: 150
            }}
          >
            <Trash2 size={32} color="#d32f2f" />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>12</Typography>
            <Typography variant="body1" color="textSecondary">Rejected Articles</Typography>
          </Paper>
        </Grid>
        
         <Grid container spacing={2} >
      {/* Recent Applications */}

      <Grid item xs={12} md={6} lg={6} width={{ xs: '100vw', sm: '35vw', md: '35vw', lg: '35vw' }}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardHeader title="Recent Reporter Applications" />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowX: 'auto'
          }}
        >
          {recentApplications.length > 0 ? (
            recentApplications.map((application) => (
              <Paper
                key={application.id}
                variant="outlined"
                sx={{
                  p: 2,
                  minWidth: 280,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{application.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applied on: {new Date(application.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={handleViewAll}
                  >
                    View
                  </Button>
                  {userRole === 'admin' && application.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Check size={16} />}
                        onClick={handleViewAll}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        onClick={handleViewAll}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Box>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No recent applications
            </Typography>
          )}
          <Button 
            sx={{ mt: 2 }} 
            variant="text"
            onClick={handleViewAll}
          >
            View All Applications
          </Button>
        </CardContent>
      </Card>
    </Grid>

      {/* Recent Articles */}
      {/* Recent Articles */}
<Grid item xs={12} md={6} lg={6} width={{ xs: '100vw', sm: '35vw', md: '35vw', lg: '35vw' }}>
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardHeader title="Recent Articles" />
    <CardContent
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowX: 'auto'
      }}
    >
      {recentArticles.length > 0 ? (
        recentArticles.map((article) => (
          <Paper
            key={article.id}
            variant="outlined"
            sx={{
              p: 2,
              minWidth: 280,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography variant="subtitle1">{article.title}</Typography>
              <Typography variant="body2" color="text.secondary" align="left">
                Status: {article.status.charAt(0).toUpperCase() + article.status.slice(1)} • 
                {new Date(article.submittedDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
              <Button 
                size="small" 
                variant="outlined" 
                color="primary"
                onClick={handleViewAllArticles}
              >
                View
              </Button>
              {(userRole === 'admin' || userRole === 'editor') && article.status !== 'published' && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="secondary"
                  onClick={handleViewAllArticles}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No recent articles
        </Typography>
      )}
      <Button 
        sx={{ mt: 2 }} 
        variant="text"
        onClick={handleViewAllArticles}
      >
        View All Articles
      </Button>
    </CardContent>
  </Card>
</Grid>
    </Grid>
      </Grid>
    </Box>
    </Box>
  );
};

export default Dashboard;