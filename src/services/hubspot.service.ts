import apiClient from './api-client';

/**
 * Service for authentication and user profile operations
 */
export class HubspotService {

  async getSummaryEvent(): Promise<any> {
    const response = await apiClient.get<any>(`hubspot/summaryevents`,);
    return response.data;
  }

   async getAllEvents(): Promise<any> {
    const response = await apiClient.get<any>(`hubspot/allevents`,);
    return response.data;
  }

}

// Create a singleton instance
export const hubspotService = new HubspotService();

export default hubspotService;
