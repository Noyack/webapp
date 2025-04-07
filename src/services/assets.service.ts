/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import apiClient from './api-client';
import {
  LiquidAsset,
  InvestmentAsset,
  RetirementAsset,
  RealEstateAsset,
  BusinessAsset,
  PersonalPropertyAsset,
  AssetAllocation,
  AssetsFormData
} from '../types';

// Backend Asset Model
export interface AssetDB {
  id?: string;
  userId?: string;
  assetType: 'liquid' | 'investment' | 'retirement' | 'real_estate' | 'business' | 'personal_property';
  name: string;
  institution?: string;
  currentValue: number;
  createdAt?: string;
  updatedAt?: string;
  details?: AssetDetailDB[];
}

// Backend Asset Detail Model
export interface AssetDetailDB {
  id?: string;
  assetId: string;
  detailKey: string;
  detailValue: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend Asset Allocation Model
export interface AssetAllocationDB {
  id?: string;
  userId?: string;
  allocationType: 'current' | 'target';
  stocks: number;
  bonds: number;
  cash: number;
  realEstate: number;
  alternatives: number;
  other: number;
  liquidityNeeds?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to convert any asset to AssetDB
const mapAssetToBackendModel = (
  asset: LiquidAsset | InvestmentAsset | RetirementAsset | RealEstateAsset | BusinessAsset | PersonalPropertyAsset,
  assetType: AssetDB['assetType'],
  userId: string
): { asset: AssetDB, details: AssetDetailDB[] } => {
  // Create base asset
  const assetDB: AssetDB = {
    id: asset.id,
    userId,
    assetType,
    name: asset.name,
    institution: asset.institution || '',
    currentValue: Number(asset.currentValue)
  };

  // Create details array for all properties except the base ones
  const excludedKeys = ['id', 'userId', 'name', 'institution', 'currentValue', 'assetType'];
  const details: AssetDetailDB[] = [];

  for (const [key, value] of Object.entries(asset)) {
    if (!excludedKeys.includes(key) && value !== undefined && value !== null && value !== '') {
      details.push({
        assetId: asset.id || '', // This will be replaced when the asset is created
        detailKey: key,
        detailValue: typeof value === 'object' ? JSON.stringify(value) : String(value)
      });
    }
  }

  return { asset: assetDB, details };
};

// Map backend asset model to frontend models
const mapToFrontendAsset = (assetDB: AssetDB, details: AssetDetailDB[]) => {
  // Create a base asset with common properties
  const baseAsset = {
    id: assetDB.id || '',
    name: assetDB.name,
    institution: assetDB.institution || '',
    currentValue: Number(assetDB.currentValue),
    notes: ''
  };

  // Convert details to a map for easy access
  const detailsMap = new Map<string, string>();
  details.forEach(detail => {
    detailsMap.set(detail.detailKey, detail.detailValue);
  });

  // Helper to get a typed detail value
  const getDetailValue = <T>(key: string, defaultValue: T): T => {
    const value = detailsMap.get(key);
    if (value === undefined) return defaultValue;
    
    if (typeof defaultValue === 'number') {
      return Number(value) as unknown as T;
    } else if (typeof defaultValue === 'boolean') {
      return (value === 'true') as unknown as T;
    }
    return value as unknown as T;
  };

  // Based on asset type, create the specific asset
  switch (assetDB.assetType) {
    case 'liquid': {
      const asset: LiquidAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', 'checking'),
        interestRate: getDetailValue<number>('interestRate', 0),
        maturityDate: getDetailValue<string>('maturityDate', '')
      };
      return asset;
    }
    case 'investment': {
      const asset: InvestmentAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', 'stock'),
        ticker: getDetailValue<string>('ticker', ''),
        shares: getDetailValue<number>('shares', 0),
        purchasePrice: getDetailValue<number>('purchasePrice', 0),
        expenseRatio: getDetailValue<number>('expenseRatio', 0),
        yield: getDetailValue<number>('yield', 0),
        maturityDate: getDetailValue<string>('maturityDate', '')
      };
      return asset;
    }
    case 'retirement': {
      const asset: RetirementAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', '401k'),
        contributionRate: getDetailValue<number>('contributionRate', 0),
        employerMatch: getDetailValue<number>('employerMatch', 0),
        estimatedMonthlyBenefit: getDetailValue<number>('estimatedMonthlyBenefit', 0),
        payoutTerms: getDetailValue<string>('payoutTerms', '')
      };
      return asset;
    }
    case 'real_estate': {
      const asset: RealEstateAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', 'primaryResidence'),
        address: getDetailValue<string>('address', ''),
        purchasePrice: getDetailValue<number>('purchasePrice', 0),
        remainingMortgage: getDetailValue<number>('remainingMortgage', 0),
        rentalIncome: getDetailValue<number>('rentalIncome', 0),
        propertyTaxes: getDetailValue<number>('propertyTaxes', 0),
        insuranceCost: getDetailValue<number>('insuranceCost', 0)
      };
      return asset;
    }
    case 'business': {
      const asset: BusinessAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', 'businessOwnership'),
        ownershipPercentage: getDetailValue<number>('ownershipPercentage', 0),
        annualRevenue: getDetailValue<number>('annualRevenue', 0),
        annualProfit: getDetailValue<number>('annualProfit', 0)
      };
      return asset;
    }
    case 'personal_property': {
      const asset: PersonalPropertyAsset = {
        ...baseAsset,
        type: getDetailValue<string>('type', 'vehicle'),
        description: getDetailValue<string>('description', ''),
        purchasePrice: getDetailValue<number>('purchasePrice', 0),
        insuredValue: getDetailValue<number>('insuredValue', 0)
      };
      return asset;
    }
    default:
      return baseAsset;
  }
};

// Map allocation from frontend to backend
const mapAllocationToBackendModel = (
  allocation: AssetAllocation,
  allocationType: 'current' | 'target',
  userId: string
): AssetAllocationDB => {
  return {
    userId,
    allocationType,
    stocks: Number(allocation.stocks),
    bonds: Number(allocation.bonds),
    cash: Number(allocation.cash),
    realEstate: Number(allocation.realEstate),
    alternatives: Number(allocation.alternatives),
    other: Number(allocation.other)
  };
};

// Map allocation from backend to frontend
const mapAllocationToFrontendModel = (allocationDB: AssetAllocationDB): AssetAllocation => {
  return {
    stocks: Number(allocationDB.stocks),
    bonds: Number(allocationDB.bonds),
    cash: Number(allocationDB.cash),
    realEstate: Number(allocationDB.realEstate),
    alternatives: Number(allocationDB.alternatives),
    other: Number(allocationDB.other)
  };
};

// The main service for interacting with the API
export const assetsService = {
  // Get all assets for a user
  async getUserAssets(userId: string): Promise<AssetsFormData> {
    try {
      // Get assets
      const assetsResponse = await apiClient.get(`/v1/users/${userId}/assets`);
      const assets = assetsResponse.data as AssetDB[];

      // Get asset details
      const detailsResponse = await apiClient.get(`/v1/users/${userId}/asset-details`);
      const details = detailsResponse.data as AssetDetailDB[];

      // Group details by asset id
      const detailsByAssetId = new Map<string, AssetDetailDB[]>();
      details.forEach(detail => {
        if (!detailsByAssetId.has(detail.assetId)) {
          detailsByAssetId.set(detail.assetId, []);
        }
        detailsByAssetId.get(detail.assetId)?.push(detail);
      });

      // Initialize result with empty arrays
      const result: AssetsFormData = {
        liquidAssets: [],
        investmentAssets: [],
        retirementAssets: [],
        realEstateAssets: [],
        businessAssets: [],
        personalPropertyAssets: [],
        currentAllocation: {
          stocks: 0,
          bonds: 0,
          cash: 0,
          realEstate: 0,
          alternatives: 0,
          other: 0
        },
        targetAllocation: {
          stocks: 0,
          bonds: 0,
          cash: 0,
          realEstate: 0,
          alternatives: 0,
          other: 0
        },
        liquidityNeeds: 10
      };

      // Map assets to their respective arrays
      assets.forEach(asset => {
        const assetDetails = detailsByAssetId.get(asset.id || '') || [];
        const frontendAsset = mapToFrontendAsset(asset, assetDetails);

        switch (asset.assetType) {
          case 'liquid':
            result.liquidAssets.push(frontendAsset as LiquidAsset);
            break;
          case 'investment':
            result.investmentAssets.push(frontendAsset as InvestmentAsset);
            break;
          case 'retirement':
            result.retirementAssets.push(frontendAsset as RetirementAsset);
            break;
          case 'real_estate':
            result.realEstateAssets.push(frontendAsset as RealEstateAsset);
            break;
          case 'business':
            result.businessAssets.push(frontendAsset as BusinessAsset);
            break;
          case 'personal_property':
            result.personalPropertyAssets.push(frontendAsset as PersonalPropertyAsset);
            break;
        }
      });

      // Get allocations
      const allocationsResponse = await apiClient.get(`/v1/users/${userId}/asset-allocations`);
      const allocations = allocationsResponse.data as AssetAllocationDB[];

      // Map allocations
      allocations.forEach(allocation => {
        if (allocation.allocationType === 'current') {
          result.currentAllocation = mapAllocationToFrontendModel(allocation);
        } else if (allocation.allocationType === 'target') {
          result.targetAllocation = mapAllocationToFrontendModel(allocation);
        }

        // Set liquidity needs if available
        if (allocation.liquidityNeeds !== undefined && allocation.allocationType === 'current') {
          result.liquidityNeeds = Number(allocation.liquidityNeeds);
        }
      });

      return result;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  // Create a new asset
  async createAsset(userId: string, asset: LiquidAsset | InvestmentAsset | RetirementAsset | RealEstateAsset | BusinessAsset | PersonalPropertyAsset, assetType: AssetDB['assetType']): Promise<string> {
    try {
      const { asset: assetDB, details } = mapAssetToBackendModel(asset, assetType, userId);
      
      // Create asset
      const response = await apiClient.post(`/v1/users/${userId}/assets`, assetDB);
      const createdAsset = response.data as AssetDB;
      
      // Create details if any
      if (details.length > 0) {
        const detailsWithAssetId = details.map(detail => ({
          ...detail,
          assetId: createdAsset.id || ''
        }));
        await apiClient.post(`/v1/users/${userId}/asset-details/batch`, detailsWithAssetId);
      }
      
      return createdAsset.id || '';
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  // Update an existing asset
  async updateAsset(
    assetId: string, 
    asset: LiquidAsset | InvestmentAsset | RetirementAsset | RealEstateAsset | BusinessAsset | PersonalPropertyAsset, 
    assetType: AssetDB['assetType']
  ): Promise<void> {
    try {
      const userId = ''; // We don't need userId for updates
      const { asset: assetDB, details } = mapAssetToBackendModel(asset, assetType, userId);
      
      // Remove id from update data
      delete assetDB.id;
      delete assetDB.userId;
      
      // Update asset
      await apiClient.patch(`/v1/assets/${assetId}`, assetDB);
      
      // Delete existing details
      await apiClient.delete(`/v1/assets/${assetId}/details`);
      
      // Create new details if any
      if (details.length > 0) {
        const detailsWithAssetId = details.map(detail => ({
          ...detail,
          assetId
        }));
        await apiClient.post(`/v1/assets/${assetId}/details/batch`, detailsWithAssetId);
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  // Delete an asset
  async deleteAsset(assetId: string): Promise<void> {
    try {
      await apiClient.delete(`/v1/assets/${assetId}`);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  // Save allocations
  async saveAllocations(
    userId: string, 
    currentAllocation: AssetAllocation, 
    targetAllocation: AssetAllocation, 
    liquidityNeeds: number
  ): Promise<void> {
    try {
      // Map allocations to backend model
      const current = mapAllocationToBackendModel(currentAllocation, 'current', userId);
      const target = mapAllocationToBackendModel(targetAllocation, 'target', userId);
      
      // Add liquidity needs to current allocation
      current.liquidityNeeds = liquidityNeeds;
      
      // Check if allocations already exist
      const allocationsResponse = await apiClient.get(`/v1/users/${userId}/asset-allocations`);
      const existingAllocations = allocationsResponse.data as AssetAllocationDB[];
      
      const currentExists = existingAllocations.some(a => a.allocationType === 'current');
      const targetExists = existingAllocations.some(a => a.allocationType === 'target');
      
      // Save or update current allocation
      if (currentExists) {
        const currentId = existingAllocations.find(a => a.allocationType === 'current')?.id;
        if (currentId) {
          await apiClient.patch(`/v1/asset-allocations/${currentId}`, current);
        }
      } else {
        await apiClient.post(`/v1/users/${userId}/asset-allocations`, current);
      }
      
      // Save or update target allocation
      if (targetExists) {
        const targetId = existingAllocations.find(a => a.allocationType === 'target')?.id;
        if (targetId) {
          await apiClient.patch(`/v1/asset-allocations/${targetId}`, target);
        }
      } else {
        await apiClient.post(`/v1/users/${userId}/asset-allocations`, target);
      }
    } catch (error) {
      console.error('Error saving allocations:', error);
      throw error;
    }
  },

  // Save complete assets and allocations data
  async saveAssetsAndAllocations(userId: string, data: AssetsFormData): Promise<void> {
    try {
      // First, save all assets
      
      // 1. Get existing assets to know what to update/delete
      const existingAssetsResponse = await apiClient.get(`/v1/users/${userId}/assets`);
      const existingAssets = existingAssetsResponse.data as AssetDB[];
      
      // Create sets of existing asset IDs by type
      const existingIds = {
        liquid: new Set(existingAssets.filter(a => a.assetType === 'liquid').map(a => a.id)),
        investment: new Set(existingAssets.filter(a => a.assetType === 'investment').map(a => a.id)),
        retirement: new Set(existingAssets.filter(a => a.assetType === 'retirement').map(a => a.id)),
        real_estate: new Set(existingAssets.filter(a => a.assetType === 'real_estate').map(a => a.id)),
        business: new Set(existingAssets.filter(a => a.assetType === 'business').map(a => a.id)),
        personal_property: new Set(existingAssets.filter(a => a.assetType === 'personal_property').map(a => a.id))
      };
      
      // 2. Process each asset type
      
      // Liquid assets
      const liquidPromises = data.liquidAssets.map(async (asset) => {
        if (asset.id && existingIds.liquid.has(asset.id)) {
          // Update
          existingIds.liquid.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'liquid');
        } else {
          // Create
          return this.createAsset(userId, asset, 'liquid');
        }
      });
      
      // Investment assets
      const investmentPromises = data.investmentAssets.map(async (asset) => {
        if (asset.id && existingIds.investment.has(asset.id)) {
          // Update
          existingIds.investment.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'investment');
        } else {
          // Create
          return this.createAsset(userId, asset, 'investment');
        }
      });
      
      // Retirement assets
      const retirementPromises = data.retirementAssets.map(async (asset) => {
        if (asset.id && existingIds.retirement.has(asset.id)) {
          // Update
          existingIds.retirement.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'retirement');
        } else {
          // Create
          return this.createAsset(userId, asset, 'retirement');
        }
      });
      
      // Real estate assets
      const realEstatePromises = data.realEstateAssets.map(async (asset) => {
        if (asset.id && existingIds.real_estate.has(asset.id)) {
          // Update
          existingIds.real_estate.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'real_estate');
        } else {
          // Create
          return this.createAsset(userId, asset, 'real_estate');
        }
      });
      
      // Business assets
      const businessPromises = data.businessAssets.map(async (asset) => {
        if (asset.id && existingIds.business.has(asset.id)) {
          // Update
          existingIds.business.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'business');
        } else {
          // Create
          return this.createAsset(userId, asset, 'business');
        }
      });
      
      // Personal property assets
      const personalPropertyPromises = data.personalPropertyAssets.map(async (asset) => {
        if (asset.id && existingIds.personal_property.has(asset.id)) {
          // Update
          existingIds.personal_property.delete(asset.id);
          return this.updateAsset(asset.id, asset, 'personal_property');
        } else {
          // Create
          return this.createAsset(userId, asset, 'personal_property');
        }
      });
      
      // 3. Wait for all assets to be created/updated
      await Promise.all([
        ...liquidPromises,
        ...investmentPromises,
        ...retirementPromises,
        ...realEstatePromises,
        ...businessPromises,
        ...personalPropertyPromises
      ]);
      
      // 4. Delete assets that were not included
      const deletePromises = [
        ...Array.from(existingIds.liquid),
        ...Array.from(existingIds.investment),
        ...Array.from(existingIds.retirement),
        ...Array.from(existingIds.real_estate),
        ...Array.from(existingIds.business),
        ...Array.from(existingIds.personal_property)
      ].map(id => this.deleteAsset(id));
      
      await Promise.all(deletePromises);
      
      // 5. Save allocations
      await this.saveAllocations(
        userId, 
        data.currentAllocation, 
        data.targetAllocation, 
        data.liquidityNeeds
      );
      
    } catch (error) {
      console.error('Error saving assets and allocations:', error);
      throw error;
    }
  }
};

export default assetsService;