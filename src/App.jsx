import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import AudioPlayer from './Components/User/AudioPlayer';
import Home from './Pages/Home.jsx';
import UserDashboard from './Pages/User/UserDashboard';
import Footer from './Components/User/Footer';
import Header from './Components/User/Header';
import { Box } from '@mui/material';

import NewsDetail from './Pages/User/NewsDetail';
import CategoryPage from './Pages/User/CategoryPage';
import RoleBasedLogin from './Pages/RoleBasedLogin';
import ReporterPanel from './Pages/Reporter/ReporterPanel';
import AdminPanel from './Pages/Admin/AdminPanel';
import UserRegistration from './Components/Auth/UserRegistration';
import UserProfile from './Components/User/UserProfile.jsx';
import ReporterApplicationDashboard from './Pages/Reporter/ReporterApplicationDashboard';
import { useNavigate } from 'react-router-dom';
import ReporterReg from './Pages/Admin/ReporterReg';
import ReporterApplicationLogin from './Pages/Reporter/ReporterApplicationLogin';
import ReporterRegistration from './Pages/Reporter/ReporterRegistration';
import EmailVerification from './Components/Auth/EmailVerification';
import EditorPortal from './Components/Editor/EditorPortal';
import AllNews from './Pages/User/AllNews.jsx';
import CategoryNews from './Pages/User/CategoryNews.jsx'

// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role?.toLowerCase();

  // Handle reporter application routes
  if (allowedRole === 'user' && ['/reporter-application/dashboard', '/reporter-application/apply'].includes(window.location.pathname)) {
    if (!token) {
      return <Navigate to="/reporter-application" replace />;
    }
    
    // Check user roles
    switch (userRole) {
      case 'reporter':
        return <Navigate to="/reporter/dashboard" replace />;
      case 'pending-reporter':
      case 'user':
        return children;
      default:
        return <Navigate to="/reporter-application" replace />;
    }
  }

  // Regular role checking for other routes
  if (!token) {
    return <Navigate to={`/rolebasedlogin?role=${allowedRole}`} replace />;
  }

  // Allow pending-reporter to access user routes
  if (allowedRole === 'user' && (userRole === 'user' || userRole === 'pending-reporter')) {
    return children;
  }

  // Strict role checking for other routes
  if (userRole !== allowedRole) {
    return <Navigate to={`/rolebasedlogin?role=${allowedRole}`} replace />;
  }

  return children;
};

// UserLayout (unchanged)
const UserLayout = ({ children, currentNews, isPlaying, handleStopAudio, handleTogglePlay }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          py: 3,
          pb: currentNews ? 12 : 3,
        }}
      >
        {children}
      </Box>
      {currentNews && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: 'background.paper',
          }}
        >
          <AudioPlayer
            news={currentNews}
            isPlaying={isPlaying}
            onStop={handleStopAudio}
            onTogglePlay={handleTogglePlay}
          />
        </Box>
      )}
      <Footer />
    </Box>
  );
};

function App() {
  const [currentNews, setCurrentNews] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    console.log('Current audio state:', {
      currentNewsId: currentNews?.id,
      isPlaying: isPlaying,
      audioUrl: currentNews?.voice_file,
    });
  }, [currentNews, isPlaying]);

  const handlePlayAudio = (news) => {
    if (currentNews?.id === news.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentNews(news);
      setIsPlaying(true);
    }
  };

  const handleStopAudio = () => {
    setIsPlaying(false);
    setCurrentNews(null);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/rolebasedlogin" element={<RoleBasedLogin />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Protected Editor Route */}
        <Route
          path="/editor/*"
          element={
            <ProtectedRoute allowedRole="editor">
              <EditorPortal />
            </ProtectedRoute>
          }
        />

        {/* Protected Reporter Route */}
        <Route
          path="/reporter/*"
          element={
            <ProtectedRoute allowedRole="reporter">
              <ReporterPanel />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes with UserLayout */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout
                currentNews={currentNews}
                isPlaying={isPlaying}
                handleStopAudio={handleStopAudio}
                handleTogglePlay={handleTogglePlay}
              >
                <UserDashboard onPlayAudio={handlePlayAudio} currentPlayingNews={currentNews} />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/news/:id"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout
                currentNews={currentNews}
                isPlaying={isPlaying}
                handleStopAudio={handleStopAudio}
                handleTogglePlay={handleTogglePlay}
              >
                <NewsDetail onPlayAudio={handlePlayAudio} currentPlayingNews={currentNews} />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/category/:category"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout
                currentNews={currentNews}
                isPlaying={isPlaying}
                handleStopAudio={handleStopAudio}
                handleTogglePlay={handleTogglePlay}
              >
                <CategoryPage onPlayAudio={handlePlayAudio} currentPlayingNews={currentNews} />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRole="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/category/:categoryId"
          element={
            <ProtectedRoute allowedRole="user">
              <CategoryNews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/all-news"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout
                currentNews={currentNews}
                isPlaying={isPlaying}
                handleStopAudio={handleStopAudio}
                handleTogglePlay={handleTogglePlay}
              >
                <AllNews onPlayAudio={handlePlayAudio} currentPlayingNews={currentNews} />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Reporter Application Routes */}
        <Route path="/reporter-application">
          <Route index element={<ReporterApplicationLogin />} />
          <Route path="register" element={<ReporterRegistration />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <ReporterApplicationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="apply"
            element={
              <ProtectedRoute allowedRole="user">
                <ReporterReg />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
