// src/services/ebooks.service.ts
import apiClient from './api-client';

export interface Ebook {
  id: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  path?: string;
  folder?: string;
}

export interface EbooksResponse {
  success: boolean;
  data: Ebook[];
  total: number;
  folder?: string;
  message?: string;
  error?: string;
}

export interface EbookDownloadResponse {
  success: boolean;
  data: {
    fileId: string;
    downloadUrl: string;
  };
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
      const response = await apiClient.get<EbooksResponse>('/hubspot/ebooks');
      
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
  async getEbooksByFolder(folderName: string): Promise<Ebook[]> {
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
   * Get download URL for a specific ebook
   */
  async getEbookDownloadUrl(fileId: string): Promise<string> {
    try {
      const response = await apiClient.get<EbookDownloadResponse>(`/hubspot/ebooks/${fileId}/download`);
      
      if (response.data.success) {
        return response.data.data.downloadUrl;
      }
      
      throw new Error(response.data.message || 'Failed to get download URL');
    } catch (error) {
      console.error('Error getting ebook download URL:', error);
      throw error;
    }
  }

  /**
   * Download an ebook (opens in new tab)
   */
  async downloadEbook(fileId: string, fileName?: string): Promise<void> {
    try {
      const downloadUrl = await this.getEbookDownloadUrl(fileId);
      
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.download = fileName || 'ebook';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading ebook:', error);
      throw error;
    }
  }

  /**
   * Get ebook file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension icon/type
   */
  getFileTypeIcon(extension: string): string {
    const ext = extension.toLowerCase();
    switch (ext) {
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
}

// Create a singleton instance
export const ebooksService = new EbooksService();

export default ebooksService;