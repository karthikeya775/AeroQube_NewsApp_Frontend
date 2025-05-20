import { useState, useEffect } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import {
  Button, Card, CardMedia, CardContent, Typography,
  Box, Chip, IconButton, Tooltip, Divider, Avatar
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';


const categoryColors = {
  Technology: { bg: '#E3F2FD', color: '#0D47A1' },
  Health: { bg: '#F1F8E9', color: '#33691E' },
  Politics: { bg: '#FFEBEE', color: '#B71C1C' },
  Sports: { bg: '#E8F5E9', color: '#1B5E20' },
  Business: { bg: '#FFF3E0', color: '#E65100' },
  Entertainment: { bg: '#F3E5F5', color: '#4A148C' },
  World: { bg: '#E1F5FE', color: '#01579B' },
  Default: { bg: '#ECEFF1', color: '#263238' }
};

const NewsCard = ({ news, onPlayAudio, currentPlayingNews, onReadMore }) => {
  const navigate = useNavigate();

  const {
    id,
    title = 'Breaking News: AI Transforms News Consumption',
    summary = 'AI-powered platforms now offer concise news summaries with text, audio, and 3D avatars, revolutionizing how users stay informed.',
    timestamp = new Date(`${news.date}T${news.time}:00`).toISOString(),
    imageUrl = 'https://images.unsplash.com/photo-1581090700227-1e8d49c2a960?auto=format&fit=crop&w=800&q=80',
    sourceName = 'Tech Today',
    sourceUrl = 'https://example.com',
    category = 'Technology',
    voice_file
  } = news || {};

  const isCurrentlyPlaying = currentPlayingNews?.id === id;

  const hasValidVoiceFile = () => {
    if (!voice_file) return false;
    if (typeof voice_file === 'string' && voice_file.trim() !== '') return true;
    if (typeof voice_file === 'object' && voice_file.url && voice_file.url.trim() !== '') return true;
    return false;
  };

  const handleListen = (e) => {
    e.stopPropagation();
    if (onPlayAudio) {
      const updatedNews = { ...news };
      onPlayAudio(updatedNews);
    }
  };

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    } else if (id) {
      navigate(`/news/${id}`);
    }
  };

  const handleSourceClick = (e) => {
    e.stopPropagation();
    if (sourceUrl) {
      window.open(sourceUrl, '_blank');
    }
  };

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Unknown date';

  const { bg, color } = categoryColors[category] || categoryColors.Default;

  return (
    <Card
      sx={{
        width: {
          xs: '90%',
          sm: 280,
          md: 300,
          lg: 430
        },
        height: {
          xs: 'auto',
          sm: 420,
          md: 450,
          lg: 480
        },
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.12)'
        },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={handleReadMore}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          height: { xs: 140, sm: 150, md: 200 , lg: 220 },
          objectFit: 'cover'
        }}
      />

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Date, Source, Category Chips */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2  }}>
          {/* <Chip
            size="small"
            label={formattedDate}
            variant="outlined"
            icon={<AccessTimeIcon fontSize="small" />}
            sx={{ fontSize: '0.75rem', height: 24, borderRadius: 12 }}
          /> */}
           
           <Chip
            size="small"
            label={category}
            variant="filled"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              borderRadius: 12,
              backgroundColor: bg,
              color: color
            }}
          />
          
          <Chip
            size="small"
            label={sourceName}
            variant="outlined"
            icon={<LinkIcon fontSize="small" />}
            onClick={handleSourceClick}
            sx={{ fontSize: '0.75rem', height: 24, borderRadius: 12 }}
            color="primary"
          />
          {/* <Chip
            size="small"
            label={category}
            variant="filled"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              borderRadius: 12,
              backgroundColor: bg,
              color: color
            }}
          />
          {console.log({ bg, color, category })} */}
        </Box>


        <Typography variant="h6" component="h2" gutterBottom sx={{
          fontWeight: 'bold',
          fontSize: '1.1rem',
          mb: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          lineHeight: 1.3
        }}>
          {title}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{
          mb: 2,
          flexGrow: 1,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          lineHeight: 1.6
        }}>
          {summary}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
  <Typography
    variant="caption"
    color="text.secondary"
    sx={{ fontStyle: 'italic' }}
  >
    {formatDistanceToNow(new Date(formattedDate), { addSuffix: true })}
  </Typography>

  <Button
    size="small"
    variant="contained"
    color={isCurrentlyPlaying ? "secondary" : "primary"}
    startIcon={isCurrentlyPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    onClick={handleListen}
    sx={{
      borderRadius: 50,
      textTransform: 'none',
      px: 2
    }}
    disabled={!hasValidVoiceFile()}
  >
    {isCurrentlyPlaying ? "Pause" : "Listen"}
  </Button>
</Box>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
