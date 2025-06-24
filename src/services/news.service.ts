import axios from 'axios';
// import { API_URL } from '../config';

export interface INews {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  category: {
    _id: string;
    name: string;
  };
  status: 'pending' | 'verified' | 'accepted' | 'published' | 'rejected';
  reportedBy?: {
    _id: string;
    name: string;
  };
  isSystemGenerated: boolean;
  isFake: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  serviceGeneratedAt?: Date;
  source?: string;
  originalURL?: string;
  language: string;
  editedBy?: {
    _id: string;
    name: string;
  };
  publishedBy?: {
    _id: string;
    name: string;
  };
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

export interface ICategory {
  _id: string;
  name: string;
  parent?: {
    _id: string;
    name: string;
  };
  createdAt: Date;
}

class NewsService {
  private baseUrl = `http://13.200.122.192:5000/news-service/api/v0/news`;
private maxRetries = 3;
private retryDelay = 2000; // 2 seconds

// Get all news with pagination support and retry logic
async getAllNews(params: { limit?: number; offset?: number; [key: string]: any } = {}) {
  const { limit = 100, offset = 10, ...rest } = params;
  let retries = 0;
  
  while (retries < this.maxRetries) {
    try {
      const response = await axios.get(`${this.baseUrl}/all`, {
        params: { limit, offset, ...rest },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 30000, // Increased timeout to 30 seconds
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all responses except 500s
        }
      });
      
      console.log("response", response.data);
      
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      retries++;
      
      if (retries === this.maxRetries) {
        throw this.handleError(error);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
      console.log(`Retrying request (${retries}/${this.maxRetries})...`);
    }
  }
}


  // Create news
  async createNews(newsData: Partial<INews>) {
    try {
      const response = await axios.post(this.baseUrl, newsData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update news
  async updateNews(id: string, newsData: Partial<INews>) {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, newsData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete news
  async deleteNews(id: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      const response = await axios.get(`${this.baseUrl}/categories`);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update news status
  async updateNewsStatus(id: string, status: 'pending' | 'verified' | 'accepted' | 'published' | 'rejected') {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by language
  async getNewsByLanguage(language: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) {
    try {
      const response = await axios.get(`${this.baseUrl}/language/${language}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search news
  async searchNews(query: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    language?: string;
  }) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { ...params, query }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload news with images
  async uploadNews(formData: FormData) {
    try {
      const response = await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Edit news with images
  async editNews(id: string, formData: FormData) {
    try {
      const response = await axios.put(`${this.baseUrl}/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify news
  async verifyNews(id: string, data: { status: 'accepted' | 'rejected' }) {
    try {
      const response = await axios.put(`${this.baseUrl}/verify/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Publish news
  async publishNews(id: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/publish/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by status with pagination
  async getNewsByStatus(options: {
    status?: 'pending' | 'verified' | 'accepted' | 'published' | 'rejected',
    limit?: number,
    offset?: number
  } = {}) {
    try {
      // offset=0 means first page
      const { status, limit = 10, offset = 0 } = options;
      const response = await axios.get(`${this.baseUrl}/by-status`, {
        params: { status, limit, offset },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get news by reporter with optional pagination
  async getNewsByReporter(reporterId: string, options: { limit?: number, offset?: number } = {}) {
    try {
      const params: any = {};
      if (options.limit !== undefined) params.limit = options.limit;
      if (options.offset !== undefined) params.offset = options.offset;
      const response = await axios.get(`${this.baseUrl}/reporter/${reporterId}`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get AI serviced news
  async getAiServicedNews() {
    try {
      const response = await axios.get(`${this.baseUrl}/ai-serviced`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate AI service for news
  async generateAiService(newsId: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/generate-ai-service/${newsId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler with more detailed error information
  private handleError(error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url
      });

      if (error.response.status === 500) {
        throw new Error('Server error: Database connection issue. Please try again later.');
      } else if (error.response.status === 404) {
        // Special handling for reporter not found
        if (
          error.response.data &&
          error.response.data.message &&
          error.response.data.message.toLowerCase().includes('no news found for this reporter')
        ) {
          return { success: true, data: [], total: 0 };
        }
        throw new Error('Resource not found');
      } else if (error.response.status === 401) {
        throw new Error('Unauthorized: Please login again');
      } else {
        throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No Response:', error.request);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout: Server is taking too long to respond. Please check your connection and try again.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Cannot connect to server: Please check your internet connection and try again.');
      } else {
        throw new Error('No response from server. Please check your connection and try again.');
      }
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

export const newsService = new NewsService(); 