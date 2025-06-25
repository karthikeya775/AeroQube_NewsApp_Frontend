import axios, { InternalAxiosRequestConfig } from 'axios';

// Create axios instance with correct base URL
const api = axios.create({
  baseURL: 'https://api.currentnews.co.in/user-service/api/v0/application',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Simplified interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interface for reporter details
interface IReporter {
  _id: string;
  name: string;
  email: string;
  contact?: string;
}

// Update application interface to include reporter details
interface IApplication {
  _id: string;
  bio: string;
  organization?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: {
    _id: string;
    name?: string;
  };
  documents: string[];  // URLs of uploaded documents
  reporterId: IReporter;
}

export interface ICreateApplication {
  bio: string;
  organization?: string;
  documents?: File[];  // For file upload
}

export interface IApplicationResponse {
  success: boolean;
  message: string;
  data?: IApplication | IApplication[];
}

interface IVerificationData {
  status: 'accepted' | 'rejected';  // Changed from 'approved' to 'accepted'
  message: string;
  role?: 'user' | 'reporter';
}

export const applicationService = {
  // Update createApplication method to handle FormData
  createApplication: async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Just for debugging
    console.log('Sending FormData:', {
      bio: formData.get('bio'),
      organization: formData.get('organization'),
      documents: Array.from(formData.getAll('documents')).map(file =>
        file instanceof File ? { name: file.name, type: file.type, size: file.size } : file
      )
    });

    const response = await api.post('/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗Don't manually set Content-Type when using FormData
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create application');
    }

    return response.data;
  } catch (error: any) {
    console.error('Create application error:', error.response?.data || error);
    throw error.response?.data || error;
  }

},


  getMyApplications: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.get('/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Get applications response:', response.data);

      // Transform the response to include reporter details
      if (response.data?.data && Array.isArray(response.data.data)) {
        const applications = response.data.data.map(app => ({
          ...app,
          reporterDetails: {
            name: app.reporterId.name,
            email: app.reporterId.email,
            contact: app.reporterId.contact || 'N/A'
          }
        }));

        return {
          success: response.data.success,
          message: response.data.message,
          data: applications
        };
      }

      throw new Error('Invalid response format');
    } catch (error: any) {
      console.error('Get applications error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  updateApplication: async (applicationId: string, formData: FormData) => {
    try {
      const response = await api.put(`/update/${applicationId}`, formData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  verifyApplication: async (applicationId: string, verificationData: IVerificationData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.put(`/verify/${applicationId}`, verificationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Update local storage if the user's own application was accepted
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser._id === response.data.data.reporterId) {
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            role: verificationData.status === 'accepted' ? 'reporter' : 'user'
          }));
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Verify application error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  deleteApplication: async (applicationId: string) => {
    try {
      const response = await api.delete(`/${applicationId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Admin endpoints
  getAllApplications: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.get('/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Get applications error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  getPendingApplications: async () => {
    try {
      const response = await api.get('/pending');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getApplicationByStatus: async (status: string) => {
    try {
      const response = await api.get(`/by-status?status=${status}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};