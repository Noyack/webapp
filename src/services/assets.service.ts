// assets.service.ts - Simple and working service
import apiClient from './api-client';
import { AssetsFormData } from '../types';

export const assetsService = {
  // Get all user data
  async getUserAssets(userId: string): Promise<AssetsFormData> {
    try {
      const response:any = await apiClient.get(`/v1/users/${userId}/assets`);
      const { assets = [], allocations = [] } = response.data;

      // Initialize empty form data
      const formData: AssetsFormData = {
        liquidAssets: [],
        investmentAssets: [],
        retirementAssets: [],
        realEstateAssets: [],
        businessAssets: [],
        personalPropertyAssets: [],
        currentAllocation: {
          stocks: 0, bonds: 0, cash: 0, realEstate: 0, alternatives: 0, other: 0
        },
        targetAllocation: {
          stocks: 0, bonds: 0, cash: 0, realEstate: 0, alternatives: 0, other: 0
        },
        liquidityNeeds: 10
      };

      // Organize assets by type
      assets.forEach((asset: any) => {
        const fullAsset = {
          id: asset.id,
          name: asset.name,
          institution: asset.institution || '',
          currentValue: Number(asset.currentValue),
          notes: asset.notes || '',
          // Spread any additional data from assetData JSON field
          ...(asset.assetData || {})
        };

        // Convert string numbers to actual numbers for specific fields
        const numericFields = ['interestRate', 'shares', 'purchasePrice', 'ownershipPercentage', 'remainingMortgage'];
        numericFields.forEach(field => {
          if (fullAsset[field] && typeof fullAsset[field] === 'string') {
            fullAsset[field] = Number(fullAsset[field]);
          }
        });

        switch (asset.assetType) {
          case 'liquid':
            formData.liquidAssets.push(fullAsset);
            break;
          case 'investment':
            formData.investmentAssets.push(fullAsset);
            break;
          case 'retirement':
            formData.retirementAssets.push(fullAsset);
            break;
          case 'real_estate':
            formData.realEstateAssets.push(fullAsset);
            break;
          case 'business':
            formData.businessAssets.push(fullAsset);
            break;
          case 'personal_property':
            formData.personalPropertyAssets.push(fullAsset);
            break;
        }
      });

      // Organize allocations
      allocations.forEach((allocation: any) => {
        const allocationData = {
          stocks: Number(allocation.stocks) || 0,
          bonds: Number(allocation.bonds) || 0,
          cash: Number(allocation.cash) || 0,
          realEstate: Number(allocation.realEstate) || 0,
          alternatives: Number(allocation.alternatives) || 0,
          other: Number(allocation.other) || 0
        };

        if (allocation.allocationType === 'current') {
          formData.currentAllocation = allocationData;
          if (allocation.liquidityNeeds) {
            formData.liquidityNeeds = Number(allocation.liquidityNeeds);
          }
        } else if (allocation.allocationType === 'target') {
          formData.targetAllocation = allocationData;
        }
      });

      return formData;
    } catch (error) {
      console.error('Error loading assets:', error);
      throw new Error('Failed to load assets. Please try again.');
    }
  },

  // Save all data
  async saveAssetsAndAllocations(userId: string, data: AssetsFormData): Promise<void> {
    try {
      // Flatten all assets
      const allAssets: any[] = [];
      
      const assetTypes = [
        { assets: data.liquidAssets, type: 'liquid' },
        { assets: data.investmentAssets, type: 'investment' },
        { assets: data.retirementAssets, type: 'retirement' },
        { assets: data.realEstateAssets, type: 'real_estate' },
        { assets: data.businessAssets, type: 'business' },
        { assets: data.personalPropertyAssets, type: 'personal_property' }
      ];

      assetTypes.forEach(({ assets, type }) => {
        assets.forEach(asset => {
          allAssets.push({
            ...asset,
            assetType: type
          });
        });
      });

      const payload = {
        assets: allAssets,
        currentAllocation: data.currentAllocation,
        targetAllocation: data.targetAllocation,
        liquidityNeeds: data.liquidityNeeds
      };

      await apiClient.post(`/v1/users/${userId}/assets-and-allocations`, payload);
    } catch (error) {
      console.error('Error saving assets:', error);
      throw new Error('Failed to save assets. Please try again.');
    }
  }
};

export default assetsService;