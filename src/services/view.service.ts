import axios from 'axios';

export interface INews {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  category: {
    _id: string;
    name: string;
  };
  status: string;
  reportedBy?: string;
  editedBy?: string;
  isSystemGenerated: boolean;
  isFake: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  serviceGeneratedAt?: Date;
  source?: string;
  originalURL?: string;
  language: string;
  imageURLs?: string[];
  tags?: string[];
  location?: string;
  translatedServices?: {
    translatedContent: string;
    title: string;
    audioURL?: string;
    languageCode: string;
  }[];
}

class ViewService {
  private baseUrl = `http://localhost:3000/news-service/api/v0/view`;

  // Get all news with language support
  async getAllNews() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${this.baseUrl}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by category
  async getNewsByCategory(categoryId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/category/${categoryId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserFeed() {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!user._id) {
        throw new Error('User details not found');
      }
  
      const response = await axios.get(`${this.baseUrl}/feed`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Clear user data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw this.handleError(error);
    }
  }
  
  

  // Get latest news
  async getLatestNews() {
    try {
      const response = await axios.get(`${this.baseUrl}/latest`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by ID
  async getNewsById(newsId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${newsId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by tag
  async getNewsByTag(tag: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/tag/${tag}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search news
  async searchNews(query: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { q: query },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by reporter
  async getNewsByReporter(reporterId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/reporter/${reporterId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by source
  async getNewsBySource(source: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/source/${source}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler with more detailed error information
  private handleError(error: any) {
    console.error('Error Response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      if (error.response.status === 500) {
        throw new Error('Server error: Please try again later');
      } else if (error.response.status === 404) {
        throw new Error('Resource not found');
      } else if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again');
      } else {
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection and try again.');
    } else {
      // Something happened in setting up the request
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

export const viewService = new ViewService(); 