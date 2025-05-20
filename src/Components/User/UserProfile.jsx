import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import { Save, User } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  'Politics',
  'Sports',
  'Technology',
  'Entertainment',
  'Business',
  'Health',
  'Science',
  'Education'
];

const languages = [
  'English',
  'Hindi',
  'Spanish',
  'French'
];

const UserProfile = () => {
  const [userPreferences, setUserPreferences] = useState({
    categories: [],
    languages: [],
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: null
  });

  useEffect(() => {
    // Load user data and preferences from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    setUserData(user);
    setUserPreferences(preferences);
  }, []);

  const handleCategoryToggle = (category) => {
    setUserPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLanguageToggle = (language) => {
    setUserPreferences(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    toast.success('Preferences saved successfully!');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              {userData.name?.charAt(0) || <User />}
            </Avatar>
            <Box>
              <Typography variant="h5">{userData.name}</Typography>
              <Typography color="text.secondary">{userData.email}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            News Preferences
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Categories
          </Typography>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryToggle(category)}
                color={userPreferences.categories?.includes(category) ? "primary" : "default"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Languages
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {languages.map((language) => (
              <Chip
                key={language}
                label={language}
                onClick={() => handleLanguageToggle(language)}
                color={userPreferences.languages?.includes(language) ? "primary" : "default"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSavePreferences}
        sx={{ mt: 2 }}
      >
        Save Preferences
      </Button>
    </Box>
  );
};

export default UserProfile;