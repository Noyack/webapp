import apiClient from './api-client';

/**
 * Service for authentication and user profile operations
 */
export interface SupportTicketData {
  userId: string;
  email: string;
  category: string;
  subcategory?: string;
  // priority: 'low' | 'medium' | 'high' | 'urgent';
  priority: string
  status: 'open' | 'in_progress' | 'closed' | 'pending';
  subject: string;
  description: string;
  timestamp: string;
}

export interface TicketResponse {
  success: boolean;
  ticketId?: string;
  message: string;
  data?: {
    hubspotId: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  };
}

export class HubspotService {

  async getSummaryEvent(): Promise<any> {
    const response = await apiClient.get<any>(`hubspot/summaryevents`,);
    return response.data;
  }

   async getAllEvents(): Promise<any> {
    const response = await apiClient.get<any>(`hubspot/allevents`,);
    return response.data;
  }
  async createSupportTicket(ticketData: SupportTicketData): Promise<TicketResponse> {
    const response = await apiClient.post<TicketResponse>('hubspot/tickets', ticketData);
    return response.data;
  }

  /**
   * Get support tickets for a user by email
   */
  async getUserSupportTickets(email: string): Promise<any> {
    const response = await apiClient.get<any>(`hubspot/tickets?email=${encodeURIComponent(email)}`);
    return response.data;
  }

  /**
   * Update a support ticket status
   */
  async updateTicketStatus(ticketId: string, status: string, notes?: string): Promise<any> {
    const response = await apiClient.patch<any>(`hubspot/tickets/${ticketId}`, {
      status,
      notes
    });
    return response.data;
  }

}

// Create a singleton instance
export const hubspotService = new HubspotService();

export default hubspotService;
