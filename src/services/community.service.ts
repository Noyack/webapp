import apiClient from './api-client';
import { 
  Article, 
  CommunityUpdate, 
  Event, 
  Poll,
  Resource 
} from '../types';

/**
 * Service for community-related operations
 */
export class CommunityService {
  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    const response = await apiClient.get<Article[]>('/articles', { 
      params: { featured: true, limit } 
    });
    return response.data;
  }

  /**
   * Get all articles with pagination
   */
  async getArticles(params?: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<Article[]> {
    const response = await apiClient.get<Article[]>('/articles', { params });
    return response.data;
  }

  /**
   * Get article by ID
   */
  async getArticleById(articleId: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/articles/${articleId}`);
    return response.data;
  }

  /**
   * Get resources for the community
   */
  async getResources(params?: {
    type?: Resource['type'];
    limit?: number;
    offset?: number;
  }): Promise<Resource[]> {
    const response = await apiClient.get<Resource[]>('/resources', { params });
    return response.data;
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    const response = await apiClient.get<Event[]>('/events', { 
      params: { upcoming: true, limit } 
    });
    return response.data;
  }

  /**
   * Get all events with pagination and filtering
   */
  async getAllEvents(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    isVirtual?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Event[]> {
    const response = await apiClient.get<Event[]>('/events', { params });
    return response.data;
  }

  /**
   * Register for an event
   */
  async registerForEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/register`);
  }

  /**
   * Get active polls
   */
  async getActivePolls(): Promise<Poll[]> {
    const response = await apiClient.get<Poll[]>('/polls', { 
      params: { isActive: true } 
    });
    return response.data;
  }

  /**
   * Vote in a poll
   */
  async voteInPoll(pollId: string, optionId: string): Promise<Poll> {
    const response = await apiClient.post<Poll>(`/polls/${pollId}/vote`, { optionId });
    return response.data;
  }

  /**
   * Get community updates
   */
  async getCommunityUpdates(limit: number = 5): Promise<CommunityUpdate[]> {
    const response = await apiClient.get<CommunityUpdate[]>('/community-updates', { 
      params: { limit } 
    });
    return response.data;
  }

  /**
   * Send a referral invitation
   */
  async sendReferralInvitation(email: string): Promise<void> {
    await apiClient.post('/referrals/invite', { email });
  }
}

// Create a singleton instance
export const communityService = new CommunityService();

export default communityService;