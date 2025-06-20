import axios from 'axios';

export interface ICategory {
  _id: string;
  name: string;
  parent?: {
    _id: string;
    name: string;
  };
  createdAt: Date;
}

class CategoryService {
  private baseUrl = `https://aeroqube-news-service.onrender.com/news-service/api/v0/category`;

  // Create new category
  async createCategory(categoryData: { name: string; parent?: string }) {
    try {
      const response = await axios.post(`${this.baseUrl}/create`, categoryData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all parent categories
  async getParentCategories() {
    try {
      const response = await axios.get(`${this.baseUrl}/parent`, {
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
      const response = await axios.get(`${this.baseUrl}/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get subcategories for a parent category
  async getSubcategories(parentId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/subcategories/${parentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up request');
    }
  }
}

export const categoryService = new CategoryService(); 