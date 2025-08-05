// src/services/ebooks.service.ts
import apiClient from './api-client';

export interface Ebook {
  id: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  path?: string;
  folder?: string;
  isReadable: boolean; // NEW: indicates if ebook can be read in-app
}

export interface EbooksResponse {
  success: boolean;
  data: Ebook[];
  total: number;
  folder?: string;
  message?: string;
  error?: string;
}

export interface EbookMetadata {
  id: string;
  name: string;
  extension: string;
  totalPages: number;
  format: 'pdf' | 'epub' | 'other';
  size: number;
  estimatedReadingTime?: number; // in minutes
}

export interface EbookMetadataResponse {
  success: boolean;
  data: EbookMetadata;
  message?: string;
  error?: string;
}

export interface PageData {
  pageNumber: number;
  totalPages: number;
  content: string; // base64 image or HTML content
  contentType: 'image' | 'html';
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageDataResponse {
  success: boolean;
  data: PageData;
  message?: string;
  error?: string;
}

/**
 * Service for ebook-related operations
 */
export class EbooksService {
  
  /**
   * Get all ebooks from the "ALL FINAL EBOOKS" folder
   */
  async getAllEbooks(): Promise<Ebook[]> {
    try {
      const response = await apiClient.get<any>('/hubspot/ebooks');
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch ebooks');
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      throw error;
    }
  }

  /**
   * Search ebooks by name
   */
  async searchEbooks(searchTerm: string): Promise<Ebook[]> {
    try {
      const response = await apiClient.get<EbooksResponse>(`/hubspot/ebooks/search?search=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to search ebooks');
    } catch (error) {
      console.error('Error searching ebooks:', error);
      throw error;
    }
  }

  /**
   * Get ebooks from a specific folder
   */
  async getEbooksByFolder(folderName: string): Promise<any> {
    try {
      const response = await apiClient.get<EbooksResponse>(`/hubspot/ebooks/folder/${encodeURIComponent(folderName)}`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch ebooks from folder');
    } catch (error) {
      console.error('Error fetching ebooks from folder:', error);
      throw error;
    }
  }

  /**
   * Get ebook metadata (page count, format info, etc.)
   */
  async getEbookMetadata(fileId: string): Promise<any> {
    try {
      const response = await apiClient.get<EbookMetadataResponse>(`/hubspot/ebooks/${fileId}/metadata`);
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to get ebook metadata');
    } catch (error) {
      console.error('Error getting ebook metadata:', error);
      throw error;
    }
  }

  /**
   * Get a specific page of an ebook
   */
  async getEbookPage(fileId: string, pageNumber: number, format: string = 'image'): Promise<any> {
    try {
      const response = await apiClient.get<PageDataResponse>(
        `/hubspot/ebooks/${fileId}/stream?page=${pageNumber}&format=${format}`
      );
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get ebook page');
    } catch (error) {
      console.error('Error getting ebook page:', error);
      throw error;
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format reading time for display
   */
  formatReadingTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min read`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h read`;
    }
    
    return `${hours}h ${remainingMinutes}m read`;
  }

  /**
   * Get file type icon emoji
   */
  getFileIcon(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'epub':
        return '📖';
      case 'mobi':
      case 'azw':
      case 'azw3':
        return '📚';
      default:
        return '📄';
    }
  }

  /**
   * Generate clean ebook details from filename
   */
  generateEbookDetails(name: string) {
    // Remove file extension and clean up the name
    const cleanName = name.replace(/\.(pdf|epub|mobi|azw3?|doc|docx)$/i, '');
    
    // Split by common separators and take the first part as title
    const parts = cleanName.split(/[-_\s]+/);
    const title = parts.slice(0, 3).join(' ');
    
    return {
      title: cleanName,
      description: `Comprehensive guide and insights on ${title.toLowerCase()}`,
      subtitle: "Expert knowledge and strategies to enhance your understanding."
    };
  }
}

// Create and export default instance
const ebooksService = new EbooksService();
export default ebooksService;