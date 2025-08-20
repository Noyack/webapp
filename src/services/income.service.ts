import apiClient from './api-client';

// Define the base API URL - adjust to your actual API endpoint
// Type definition for income source as per backend schema
export interface IncomeSourceDB {
  id?: string;
  userId?: string;
  type: 'salary' | 'self_employment' | 'pension' | 'social_security' | 'investments' | 'rental' | 'other';
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';
  description?: string;
  taxStatus?: 'fully_taxable' | 'partially_taxable' | 'tax_free';
  growthRate?: number;
  createdAt?: string;
  updatedAt?: string;
  isPrimary: boolean
}

// Frontend income source model
export interface IncomeSourceFrontend {
  id?: string;
  type: string;
  name: string;
  amount: number;
  frequency: string;
  duration: string;
  taxStatus: string;
  growthRate: number;
  description?: string;
  notes: string;
  isPrimary: boolean;
  userId?: string;
}

// Mapper function to convert frontend income model to backend model
export const mapToBackendModel = (source: IncomeSourceFrontend, userId: string): IncomeSourceDB => {
  // Map the type from frontend to backend enum
  const mapType = (frontendType: string): IncomeSourceDB['type'] => {
    if (frontendType === "Secondary employment" || frontendType === "Employed") return 'salary';
    if (frontendType === "Freelance work" || frontendType === "Consulting" || frontendType === "Self-employed") return 'self_employment';
    if (frontendType === "Pension") return 'pension';
    if (frontendType === "Social Security") return 'social_security';
    if (frontendType === "Dividends" || frontendType === "Interest" || frontendType === "Capital gains") return 'investments';
    if (frontendType === "Rental property") return 'rental';
    return 'other';
  };

  // Map the frequency from frontend to backend enum
  const mapFrequency = (frontendFreq: string): IncomeSourceDB['frequency'] => {
    if (frontendFreq === "Weekly") return 'weekly';
    if (frontendFreq === "Bi-weekly") return 'biweekly';
    if (frontendFreq === "Monthly" || frontendFreq === "Bi-monthly") return 'monthly';
    if (frontendFreq === "Quarterly") return 'quarterly';
    if (frontendFreq === "Annually" || frontendFreq === "Semi-annually") return 'annual';
  };

  // Map tax status from frontend to backend enum
  const mapTaxStatus = (frontendTax: string): IncomeSourceDB['taxStatus'] => {
    if (frontendTax === "Fully taxable") return 'fully_taxable';
    if (frontendTax === "Partially taxable") return 'partially_taxable';
    if (frontendTax === "Tax-free") return 'tax_free';
    return undefined;
  };

  return {
    userId,
    type: mapType(source.type),
    name: source.name || source.type, // Use type as name if name is not provided
    amount: Number(source.amount),
    frequency: mapFrequency(source.frequency),
    description: source.notes || source.description,
    taxStatus: mapTaxStatus(source.taxStatus),
    growthRate: source.growthRate ? Number(source.growthRate) : undefined,
    isPrimary: source.isPrimary === true  // Explicitly check for true
  };
};

// Mapper function to convert backend income model to frontend model
export const mapToFrontendModel = (dbSource: IncomeSourceDB): IncomeSourceFrontend => {
  // Map the type from backend to frontend
  const mapType = (backendType: string): string => {
    if (backendType === 'salary') return "Secondary employment";
    if (backendType === 'self_employment') return "Freelance work";
    if (backendType === 'pension') return "Pension";
    if (backendType === 'social_security') return "Social Security";
    if (backendType === 'investments') return "Dividends";
    if (backendType === 'rental') return "Rental property";
    return "Other";
  };

  // Map the frequency from backend to frontend
  const mapFrequency = (backendFreq: string): string => {
    if (backendFreq === 'weekly') return "Weekly";
    if (backendFreq === 'biweekly') return "Bi-weekly";
    if (backendFreq === 'monthly') return "Monthly";
    if (backendFreq === 'quarterly') return "Quarterly";
    if (backendFreq === 'annual') return "Annually";
  };

  // Map tax status from backend to frontend
  const mapTaxStatus = (backendTax: string | undefined): string => {
    if (backendTax === 'fully_taxable') return "Fully taxable";
    if (backendTax === 'partially_taxable') return "Partially taxable";
    if (backendTax === 'tax_free') return "Tax-free";
    return "Fully taxable"; // Default
  };

  return {
    id: dbSource.id,
    type: mapType(dbSource.type),
    name: dbSource.name,
    amount: dbSource.amount,
    frequency: mapFrequency(dbSource.frequency),
    duration: "Ongoing/Indefinite", // Default since backend doesn't track this
    taxStatus: mapTaxStatus(dbSource.taxStatus),
    growthRate: dbSource.growthRate || 0,
    notes: dbSource.description || "",
    isPrimary: dbSource.isPrimary
  };
};

// Functions to interact with the API
export const incomeService = {
  // Get all income sources for a user
  async getUserIncomeSources(userId: string): Promise<IncomeSourceFrontend[]> {
    try {
      const response = await apiClient.get(`/v1/users/${userId}/income-sources`);
      const incomeSources = response?.data as IncomeSourceDB[];
      return incomeSources.map((source: IncomeSourceDB) => mapToFrontendModel(source));
    } catch (error) {
      console.error('Error fetching income sources:', error);
      throw error;
    }
  },

  // Get a specific income source
  async getIncomeSource(id: string): Promise<IncomeSourceFrontend> {
    try {
      const response = await apiClient.get(`v1/income-sources/${id}`);
      return mapToFrontendModel(response.data as IncomeSourceDB);
    } catch (error) {
      console.error('Error fetching income source:', error);
      throw error;
    }
  },

  // Create a new income source
  async createIncomeSource(userId: string, incomeSource: IncomeSourceFrontend): Promise<IncomeSourceDB> {
    try {
      const mappedData = mapToBackendModel(incomeSource, userId);
      const response = await apiClient.post(`/v1/users/:userId/income-sources`, mappedData);
      return response.data as IncomeSourceDB;
    } catch (error) {
      console.error('Error creating income source:', error);
      throw error;
    }
  },

  // Update an existing income source
  async updateIncomeSource(id: string, incomeSource: IncomeSourceFrontend): Promise<IncomeSourceDB> {
    try {
      // We need the userId from somewhere for the mapping
      // For now we'll get it from the incomeSource itself if it exists
      const userId = incomeSource.userId || '';
      const mappedData = mapToBackendModel(incomeSource, userId);
      // Remove id and userId from the update data
      delete mappedData.id;
      delete mappedData.userId;
      
      const response = await apiClient.patch(`/v1/income-sources/${id}`, mappedData);
      return response.data as IncomeSourceDB;
    } catch (error) {
      console.error('Error updating income source:', error);
      throw error;
    }
  },

  // Delete an income source
  async deleteIncomeSource(id: string): Promise<unknown> {
    try {
      const response = await apiClient.delete(`/v1/income-sources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting income source:', error);
      throw error;
    }
  },

  // Save primary income - special case handling
  async savePrimaryIncome(userId: string, primaryIncome: IncomeSourceFrontend): Promise<{ success: boolean }> {
    try {
      // First, check if user already has a primary income
      const allSources = await this.getUserIncomeSources(userId);
      const primarySource = allSources.find((s: IncomeSourceFrontend) => s.isPrimary);
      
      // Ensure isPrimary is explicitly set to true
      const primaryIncomeData = {
        ...primaryIncome,
        isPrimary: true
      };
      
      if (primarySource?.id) {
        // Update existing primary income
        // We need to keep the id for the update
        primaryIncomeData.id = primarySource.id;
        await this.updateIncomeSource(primarySource.id, primaryIncomeData);
      } else {
        // Create new primary income
        await this.createIncomeSource(userId, primaryIncomeData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving primary income:', error);
      throw error;
    }
  }
};

export default incomeService;