import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

// Import existing form components (keep them as they are)
import LiquidAssetForm from './asset-forms/LiquidAssetForm';
import InvestmentAssetForm from './asset-forms/InvestmentAssetForm';
import RetirementAssetForm from './asset-forms/RetirementAssetForm';
import RealEstateAssetForm from './asset-forms/RealEstateAssetForm';
import BusinessAssetForm from './asset-forms/BusinessAssetForm';
import PersonalPropertyAssetForm from './asset-forms/PersonalPropertyAssetForm';
import AssetAllocationForm from './asset-forms/AssetAllocationForm';
import AssetSectionWrapper from './asset-forms/AssetSectionWrapper';

import assetsService from '../../services/assets.service';
import { AssetsFormData } from '../../types/index';
import { UserContext } from '../../context/UserContext';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }: any) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AssetsAllocations() {
  const { userInfo } = useContext(UserContext);
  
  // Generate unique ID
  const generateId = () => `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Initial form state
  const [formData, setFormData] = useState<AssetsFormData>({
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
  });

  // UI states
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user assets
  useEffect(() => {
    const loadUserAssets = async () => {
      if (!userInfo?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const assets = await assetsService.getUserAssets(userInfo.id);
        setFormData(assets);
      } catch (err: any) {
        console.error('Error loading assets:', err);
        setError(err.message || 'Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAssets();
  }, [userInfo?.id]);

  // Calculate current allocation whenever assets change
  useEffect(() => {
    if (isEditing) {
      calculateCurrentAllocation();
    }
  }, [
    formData.liquidAssets,
    formData.investmentAssets,
    formData.retirementAssets,
    formData.realEstateAssets,
    formData.businessAssets,
    formData.personalPropertyAssets,
    isEditing
  ]);

  // Calculate current allocation based on asset values
  const calculateCurrentAllocation = () => {
    const totalValue = calculateTotalAssetsValue();
    if (totalValue <= 0) return;

    let stocks = 0, bonds = 0, cash = 0, realEstate = 0, alternatives = 0, other = 0;

    // Liquid assets → cash
    const liquidSum = formData.liquidAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    cash = (liquidSum / totalValue) * 100;

    // Investment assets → split by type
    formData.investmentAssets.forEach(asset => {
      const assetPercentage = (asset.currentValue / totalValue) * 100;
      if (['stock', 'etf', 'mutualFund'].includes(asset.type)) {
        stocks += assetPercentage;
      } else if (['bond', 'fixedIncome'].includes(asset.type)) {
        bonds += assetPercentage;
      } else if (['crypto', 'reit', 'commodities'].includes(asset.type)) {
        alternatives += assetPercentage;
      } else {
        other += assetPercentage;
      }
    });

    // Retirement → mixed (60% stocks, 30% bonds, 10% alternatives)
    const retirementSum = formData.retirementAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    stocks += (retirementSum / totalValue) * 60;
    bonds += (retirementSum / totalValue) * 30;
    alternatives += (retirementSum / totalValue) * 10;

    // Real estate → real estate
    const realEstateSum = formData.realEstateAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    realEstate = (realEstateSum / totalValue) * 100;

    // Business → alternatives
    const businessSum = formData.businessAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    alternatives += (businessSum / totalValue) * 100;

    // Personal property → other
    const personalPropertySum = formData.personalPropertyAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    other += (personalPropertySum / totalValue) * 100;

    const currentAllocation = {
      stocks: Math.round(stocks * 10) / 10,
      bonds: Math.round(bonds * 10) / 10,
      cash: Math.round(cash * 10) / 10,
      realEstate: Math.round(realEstate * 10) / 10,
      alternatives: Math.round(alternatives * 10) / 10,
      other: Math.round(other * 10) / 10
    };

    setFormData(prev => ({
      ...prev,
      currentAllocation
    }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total assets value
  const calculateTotalAssetsValue = (): number => {
    return [
      ...formData.liquidAssets,
      ...formData.investmentAssets,
      ...formData.retirementAssets,
      ...formData.realEstateAssets,
      ...formData.businessAssets,
      ...formData.personalPropertyAssets
    ].reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
  };

  // Add asset handlers
  const addLiquidAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      liquidAssets: [...prev.liquidAssets, asset]
    }));
  };

  const addInvestmentAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      investmentAssets: [...prev.investmentAssets, asset]
    }));
  };

  const addRetirementAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      retirementAssets: [...prev.retirementAssets, asset]
    }));
  };

  const addRealEstateAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      realEstateAssets: [...prev.realEstateAssets, asset]
    }));
  };

  const addBusinessAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      businessAssets: [...prev.businessAssets, asset]
    }));
  };

  const addPersonalPropertyAsset = (asset: any) => {
    setFormData(prev => ({
      ...prev,
      personalPropertyAssets: [...prev.personalPropertyAssets, asset]
    }));
  };

  // Remove asset handlers
  const removeLiquidAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      liquidAssets: prev.liquidAssets.filter(asset => asset.id !== id)
    }));
  };

  const removeInvestmentAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      investmentAssets: prev.investmentAssets.filter(asset => asset.id !== id)
    }));
  };

  const removeRetirementAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      retirementAssets: prev.retirementAssets.filter(asset => asset.id !== id)
    }));
  };

  const removeRealEstateAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      realEstateAssets: prev.realEstateAssets.filter(asset => asset.id !== id)
    }));
  };

  const removeBusinessAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      businessAssets: prev.businessAssets.filter(asset => asset.id !== id)
    }));
  };

  const removePersonalPropertyAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      personalPropertyAssets: prev.personalPropertyAssets.filter(asset => asset.id !== id)
    }));
  };

  // Update allocations
  const updateCurrentAllocation = (allocation: any) => {
    setFormData(prev => ({
      ...prev,
      currentAllocation: allocation
    }));
  };

  const updateTargetAllocation = (allocation: any) => {
    setFormData(prev => ({
      ...prev,
      targetAllocation: allocation
    }));
  };

  const updateLiquidityNeeds = (value: number) => {
    setFormData(prev => ({
      ...prev,
      liquidityNeeds: value
    }));
  };

  // Submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInfo?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await assetsService.saveAssetsAndAllocations(userInfo.id, formData);
      
      setIsEditing(false);
      setShowSuccess(true);
    } catch (err: any) {
      console.error('Error saving assets:', err);
      setError(err.message || 'Failed to save assets');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your assets...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Assets and Allocations
      </Typography>
      
      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Assets saved successfully!
        </Alert>
      </Snackbar>
      
      {/* Edit/View Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant={isEditing ? "outlined" : "contained"} 
          color="primary" 
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? 'Cancel' : 'Edit Assets'}
        </Button>
      </Box>

      {isEditing ? (
        // EDIT MODE
        <form onSubmit={handleSubmit}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Liquid" />
              <Tab label="Investments" />
              <Tab label="Retirement" />
              <Tab label="Real Estate" />
              <Tab label="Business" />
              <Tab label="Personal" />
              <Tab label="Allocations" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <AssetSectionWrapper
              title="Liquid Assets"
              assets={formData.liquidAssets}
              onRemove={removeLiquidAsset}
              formatCurrency={formatCurrency}
            >
              <LiquidAssetForm 
                onAdd={addLiquidAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <AssetSectionWrapper
              title="Investment Assets"
              assets={formData.investmentAssets}
              onRemove={removeInvestmentAsset}
              formatCurrency={formatCurrency}
            >
              <InvestmentAssetForm 
                onAdd={addInvestmentAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <AssetSectionWrapper
              title="Retirement Assets"
              assets={formData.retirementAssets}
              onRemove={removeRetirementAsset}
              formatCurrency={formatCurrency}
            >
              <RetirementAssetForm 
                onAdd={addRetirementAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <AssetSectionWrapper
              title="Real Estate Assets"
              assets={formData.realEstateAssets}
              onRemove={removeRealEstateAsset}
              formatCurrency={formatCurrency}
            >
              <RealEstateAssetForm 
                onAdd={addRealEstateAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <AssetSectionWrapper
              title="Business Assets"
              assets={formData.businessAssets}
              onRemove={removeBusinessAsset}
              formatCurrency={formatCurrency}
            >
              <BusinessAssetForm 
                onAdd={addBusinessAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <AssetSectionWrapper
              title="Personal Property Assets"
              assets={formData.personalPropertyAssets}
              onRemove={removePersonalPropertyAsset}
              formatCurrency={formatCurrency}
            >
              <PersonalPropertyAssetForm 
                onAdd={addPersonalPropertyAsset}
                generateId={generateId}
              />
            </AssetSectionWrapper>
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <AssetAllocationForm 
              currentAllocation={formData.currentAllocation}
              targetAllocation={formData.targetAllocation}
              liquidityNeeds={formData.liquidityNeeds}
              updateCurrentAllocation={updateCurrentAllocation}
              updateTargetAllocation={updateTargetAllocation}
              updateLiquidityNeeds={updateLiquidityNeeds}
              isReadOnly={false}
            />
          </TabPanel>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save All Changes'}
            </Button>
          </Box>
        </form>
      ) : (
        // VIEW MODE
        <div>
          {/* Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Total Assets: {formatCurrency(calculateTotalAssetsValue())}
            </Typography>
            
            {/* Current vs Target Allocation */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Allocation Summary</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Current</TableCell>
                      <TableCell>Target</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Stocks</TableCell>
                      <TableCell>{formData.currentAllocation.stocks}%</TableCell>
                      <TableCell>{formData.targetAllocation.stocks}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bonds</TableCell>
                      <TableCell>{formData.currentAllocation.bonds}%</TableCell>
                      <TableCell>{formData.targetAllocation.bonds}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cash</TableCell>
                      <TableCell>{formData.currentAllocation.cash}%</TableCell>
                      <TableCell>{formData.targetAllocation.cash}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Real Estate</TableCell>
                      <TableCell>{formData.currentAllocation.realEstate}%</TableCell>
                      <TableCell>{formData.targetAllocation.realEstate}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>

          {/* Asset Lists */}
          {formData.liquidAssets.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Liquid Assets ({formData.liquidAssets.length})</Typography>
              {formData.liquidAssets.map(asset => (
                <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                  <span>{asset.name}</span>
                  <span>{formatCurrency(asset.currentValue)}</span>
                </Box>
              ))}
            </Paper>
          )}

          {formData.investmentAssets.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Investment Assets ({formData.investmentAssets.length})</Typography>
              {formData.investmentAssets.map(asset => (
                <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                  <span>{asset.name}</span>
                  <span>{formatCurrency(asset.currentValue)}</span>
                </Box>
              ))}
            </Paper>
          )}

          {/* Show message if no assets */}
          {calculateTotalAssetsValue() === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No assets found. Click "Edit Assets" to add your first asset.
              </Typography>
            </Paper>
          )}
        </div>
      )}
    </Box>
  );
}

export default AssetsAllocations;