import axios from 'axios';

const api = axios.create({
  baseURL:  'https://api.currentnews.co.in/user-service/api/v0/user',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Updated interceptor with better error handling and logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure headers object exists
      config.headers = config.headers || {};
      // Add token with proper format
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers); // Debug log
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    if (error.response?.status === 401) {
      // Token expired or invalid, clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/rolebasedlogin';
    }
    return Promise.reject(error);
  }
);

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  contact?: string;
  interest: string[];  // Array of strings/ObjectIds
  role: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  contact?: string;
  interest?: string[];
  currentpassword?: string;
  newpassword?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  role: string;
  isVerified: boolean;
  interest: string[]; // Array of Category ObjectIds
  createdAt: string;
  updatedAt: string;
}

interface IReporter {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  articles?: any[];
}

class AuthService {
  private baseUrl = 'http://13.200.122.192:5000/user-service/api/v0/user';

  async register(userData: RegisterUserData) {
    console.log('Registering user:', userData);
    try {
      const response = await api.post('/register', userData);
      console.log("Resp",response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }) {
    console.log('Logging in user:', credentials);
    try {
      const response = await api.post('/login', credentials); // Fixed endpoint
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async logout() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Call the logout endpoint
      const response = await api.post('/logout');

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');

      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  }

  async verifyEmail(token: string) {
    const response = await api.get(`/verify?verifytoken=${token}`);
    return response.data;
  }

  async getProfile() {
    try {
      const response = await api.get('/my-profile');
       console.log('Auth test response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  }

  // New function to get user profile by ID
  async getUserProfileById(userId: string) {
    try {
      console.log('Fetching user profile by ID:', userId);
      const response = await api.get(`/user-profile/${userId}`);
      console.log(`User profile for ${userId}:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user profile for ID ${userId}:`, error.response?.data || error);
      throw error.response?.data || error;
    }
  }

  async updateProfile(data: any) {
    try {
      // Ensure we have at least one field to update
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No data provided for update');
      }

      console.log('Updating profile with data:', data);
      const response = await api.put('/update', data);
      
      if (response.data.success) {
        // Update localStorage with new user data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...response.data.data
        }));
        return response.data;
      }

      throw new Error(response.data.message || 'Update failed');
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update profile');
      }
      throw error;
    }
  }

  async getReporters() {
    try {
      const response = await api.get('/all-users');
      
      if (response.data.success) {
        // Filter users to get only reporters
        const reporters = response.data.data.filter(
          (user: any) => user.role === 'reporter'
        );
        
        return {
          success: true,
          data: reporters
        };
      }
      
      throw new Error(response.data.message || 'Failed to fetch reporters');
    } catch (error: any) {
      console.error('Get reporters error:', error);
      throw error.response?.data || error;
    }
  }

  async updateReporterStatus(userId: string, isActive: boolean) {
    try {
      const response = await api.put('/update', {
        userId,
        isActive
      });
      return response.data;
    } catch (error: any) {
      console.error('Update reporter status error:', error);
      throw error.response?.data || error;
    }
  }

  async deleteReporter(userId: string) {
    try {
      const response = await api.delete('/delete', {
        data: { userId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Delete reporter error:', error);
      throw error.response?.data || error;
    }
  }

  // Register Admin
  async registerAdmin(userData: RegisterUserData) {
    try {
      const response = await api.post('/add-admin', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // Register Editor
  async registerEditor(userData: RegisterUserData) {
    try {
      const response = await api.post('/add-editor', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // Register SuperAdmin
  async registerSuperAdmin(userData: RegisterUserData) {
    try {
      const response = await api.post('/add-superadmin', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string) {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error.response?.data || error;
    }
  }

  // Set new password (after receiving reset link)
  async setPassword(token: string, password: string) {
    try {
      const response = await api.put(`/setpassword?token=${token}`, { password });
      return response.data;
    } catch (error: any) {
      console.error('Set password error:', error);
      throw error.response?.data || error;
    }
  }
}

export const authService = new AuthService();