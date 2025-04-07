import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Asset Form Components
import LiquidAssetForm from './asset-forms/LiquidAssetForm.tsx';
import InvestmentAssetForm from './asset-forms/InvestmentAssetForm.tsx';
import RetirementAssetForm from './asset-forms/RetirementAssetForm.tsx';
import RealEstateAssetForm from './asset-forms/RealEstateAssetForm.tsx';
import BusinessAssetForm from './asset-forms/BusinessAssetForm.tsx';
import PersonalPropertyAssetForm from './asset-forms/PersonalPropertyAssetForm.tsx';
import AssetAllocationForm from './asset-forms/AssetAllocationForm.tsx';

// Import services
import assetsService from '../../services/assets.service.ts';

// Import shared types
import { 
  AssetsFormData, 
  LiquidAsset,
  InvestmentAsset,
  RetirementAsset, 
  RealEstateAsset,
  BusinessAsset,
  PersonalPropertyAsset,
  AssetAllocation,
  liquidAssetTypes,
  investmentAssetTypes,
  retirementAssetTypes,
  realEstateAssetTypes,
  businessAssetTypes,
  personalPropertyAssetTypes
} from '../../types/index.ts';
import { UserContext } from '../../context/UserContext.tsx';


// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function AssetsAllocations() {
  // Generate unique ID
  const generateId = () => `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const {userInfo} = useContext(UserContext)
  // Initial form state
  const [formData, setFormData] = useState<AssetsFormData>({
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
  });

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Form display mode vs edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Success notification state
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user assets on component mount
  useEffect(() => {
    const loadUserAssets = async () => {
      if (userInfo?.id){

        try {
          setIsLoading(true);
          setError(null);
          const assets = await assetsService.getUserAssets(userInfo?.id);
          setFormData(assets);
        } catch (err) {
          console.error('Error loading assets:', err);
          setError('Failed to load your assets. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (userInfo?.id) {
      loadUserAssets();
    }
  }, [userInfo]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Add asset handlers
  const addLiquidAsset = (asset: LiquidAsset) => {
    setFormData({
      ...formData,
      liquidAssets: [...formData.liquidAssets, asset]
    });
  };

  const addInvestmentAsset = (asset: InvestmentAsset) => {
    setFormData({
      ...formData,
      investmentAssets: [...formData.investmentAssets, asset]
    });
  };

  const addRetirementAsset = (asset: RetirementAsset) => {
    setFormData({
      ...formData,
      retirementAssets: [...formData.retirementAssets, asset]
    });
  };

  const addRealEstateAsset = (asset: RealEstateAsset) => {
    setFormData({
      ...formData,
      realEstateAssets: [...formData.realEstateAssets, asset]
    });
  };

  const addBusinessAsset = (asset: BusinessAsset) => {
    setFormData({
      ...formData,
      businessAssets: [...formData.businessAssets, asset]
    });
  };

  const addPersonalPropertyAsset = (asset: PersonalPropertyAsset) => {
    setFormData({
      ...formData,
      personalPropertyAssets: [...formData.personalPropertyAssets, asset]
    });
  };

  // Remove asset handlers
  const removeLiquidAsset = (id: string) => {
    setFormData({
      ...formData,
      liquidAssets: formData.liquidAssets.filter(asset => asset.id !== id)
    });
  };

  const removeInvestmentAsset = (id: string) => {
    setFormData({
      ...formData,
      investmentAssets: formData.investmentAssets.filter(asset => asset.id !== id)
    });
  };

  const removeRetirementAsset = (id: string) => {
    setFormData({
      ...formData,
      retirementAssets: formData.retirementAssets.filter(asset => asset.id !== id)
    });
  };

  const removeRealEstateAsset = (id: string) => {
    setFormData({
      ...formData,
      realEstateAssets: formData.realEstateAssets.filter(asset => asset.id !== id)
    });
  };

  const removeBusinessAsset = (id: string) => {
    setFormData({
      ...formData,
      businessAssets: formData.businessAssets.filter(asset => asset.id !== id)
    });
  };

  const removePersonalPropertyAsset = (id: string) => {
    setFormData({
      ...formData,
      personalPropertyAssets: formData.personalPropertyAssets.filter(asset => asset.id !== id)
    });
  };

  // Update allocations
  const updateAllocations = (type: 'current' | 'target', allocation: AssetAllocation) => {
    if (type === 'current') {
      setFormData({
        ...formData,
        currentAllocation: allocation
      });
    } else {
      setFormData({
        ...formData,
        targetAllocation: allocation
      });
    }
  };

  // Update liquidity needs
  const updateLiquidityNeeds = (value: number) => {
    setFormData({
      ...formData,
      liquidityNeeds: value
    });
  };

  // Calculate total assets value
  const calculateTotalAssetsValue = (): number => {
    const liquidSum = formData.liquidAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const investmentSum = formData.investmentAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const retirementSum = formData.retirementAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const realEstateSum = formData.realEstateAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const businessSum = formData.businessAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const personalPropertySum = formData.personalPropertyAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return liquidSum + investmentSum + retirementSum + realEstateSum + businessSum + personalPropertySum;
  };

  // Calculate total for each asset category
  const calculateCategoryTotal = (category: keyof AssetsFormData): number => {
    if (Array.isArray(formData[category])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (formData[category] as any[]).reduce((sum, asset) => sum + asset.currentValue, 0);
    }
    return 0;
  };

  // Submit form and switch to display mode
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(userInfo?.id)
    try {
      setIsLoading(true);
      setError(null);
      
      await assetsService.saveAssetsAndAllocations(userInfo?.id, formData);
      
      setIsEditing(false);
      setShowSuccess(true);
    } catch (err) {
      console.error('Error saving assets:', err);
      setError('Failed to save your assets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle success notification close
  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  // Handle error notification close
  const handleErrorClose = () => {
    setError(null);
  };

  // If loading, show loading indicator
  if (isLoading && !isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Assets and Allocations</Typography>
      
      {/* Error notification */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success notification */}
      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          Assets and allocations saved successfully!
        </Alert>
      </Snackbar>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="asset tabs">
              <Tab label="Liquid Assets" />
              <Tab label="Investments" />
              <Tab label="Retirement" />
              <Tab label="Real Estate" />
              <Tab label="Business" />
              <Tab label="Personal Property" />
              <Tab label="Allocations" />
            </Tabs>
          </Box>
          
          {/* Liquid Assets Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>Liquid Assets</Typography>
            
            {formData.liquidAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name/Description</TableCell>
                      <TableCell>Institution</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Interest Rate</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.liquidAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {liquidAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.institution}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.interestRate ? `${asset.interestRate}%` : 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removeLiquidAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <LiquidAssetForm 
              onAdd={addLiquidAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Investment Assets Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>Investment Assets</Typography>
            
            {formData.investmentAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name/Ticker</TableCell>
                      <TableCell>Institution</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Shares/Units</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.investmentAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {investmentAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.ticker ? `${asset.name} (${asset.ticker})` : asset.name}</TableCell>
                        <TableCell>{asset.institution}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.shares || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removeInvestmentAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <InvestmentAssetForm 
              onAdd={addInvestmentAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Retirement Assets Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom>Retirement Assets</Typography>
            
            {formData.retirementAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name/Plan</TableCell>
                      <TableCell>Institution</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Contribution</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.retirementAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {retirementAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.institution}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.contributionRate ? `${asset.contributionRate}%` : 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removeRetirementAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <RetirementAssetForm 
              onAdd={addRetirementAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Real Estate Assets Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom>Real Estate Assets</Typography>
            
            {formData.realEstateAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name/Description</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Remaining Mortgage</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.realEstateAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {realEstateAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.address}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.remainingMortgage ? formatCurrency(asset.remainingMortgage) : 'None'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removeRealEstateAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <RealEstateAssetForm 
              onAdd={addRealEstateAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Business Assets Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" gutterBottom>Business Assets</Typography>
            
            {formData.businessAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name/Description</TableCell>
                      <TableCell>Ownership %</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Annual Revenue</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.businessAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {businessAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.ownershipPercentage ? `${asset.ownershipPercentage}%` : 'N/A'}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.annualRevenue ? formatCurrency(asset.annualRevenue) : 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removeBusinessAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <BusinessAssetForm 
              onAdd={addBusinessAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Personal Property Assets Tab */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h5" gutterBottom>Personal Property Assets</Typography>
            
            {formData.personalPropertyAssets.length > 0 && (
              <TableContainer sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Insured Value</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.personalPropertyAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          {personalPropertyAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                        </TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.description}</TableCell>
                        <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                        <TableCell>{asset.insuredValue ? formatCurrency(asset.insuredValue) : 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => removePersonalPropertyAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <PersonalPropertyAssetForm 
              onAdd={addPersonalPropertyAsset} 
              generateId={generateId} 
            />
          </TabPanel>

          {/* Asset Allocations Tab */}
          <TabPanel value={tabValue} index={6}>
            <AssetAllocationForm 
              currentAllocation={formData.currentAllocation}
              targetAllocation={formData.targetAllocation}
              liquidityNeeds={formData.liquidityNeeds}
              updateCurrentAllocation={(allocation) => updateAllocations('current', allocation)}
              updateTargetAllocation={(allocation) => updateAllocations('target', allocation)}
              updateLiquidityNeeds={updateLiquidityNeeds}
            />
          </TabPanel>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save Assets & Allocations'}
            </Button>
          </Box>
        </form>
      ) : (
        <div>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Assets Summary</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary">Total Assets Value: {formatCurrency(calculateTotalAssetsValue())}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Assets by Category:</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Liquid Assets:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('liquidAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('liquidAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Assets:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('investmentAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('investmentAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Retirement Assets:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('retirementAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('retirementAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Real Estate:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('realEstateAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('realEstateAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Business Assets:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('businessAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('businessAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Personal Property:</TableCell>
                        <TableCell align="right">{formatCurrency(calculateCategoryTotal('personalPropertyAssets'))}</TableCell>
                        <TableCell align="right">
                          {calculateTotalAssetsValue() > 0 
                            ? `${(calculateCategoryTotal('personalPropertyAssets') / calculateTotalAssetsValue() * 100).toFixed(1)}%` 
                            : '0%'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Paper>
          
          {/* Asset Category Accordions */}
          {formData.liquidAssets.length > 0 && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Liquid Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Interest Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.liquidAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{liquidAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.institution}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.interestRate ? `${asset.interestRate}%` : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}
          
          {/* Investment Assets Accordion */}
          {formData.investmentAssets.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Investment Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Ticker</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.investmentAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{investmentAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.institution}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.ticker || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Retirement Assets Accordion */}
          {formData.retirementAssets.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Retirement Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Institution</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Contribution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.retirementAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{retirementAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.institution}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.contributionRate ? `${asset.contributionRate}%` : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Real Estate Assets Accordion */}
          {formData.realEstateAssets.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Real Estate Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Remaining Mortgage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.realEstateAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{realEstateAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.address}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.remainingMortgage ? formatCurrency(asset.remainingMortgage) : 'None'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Business Assets Accordion */}
          {formData.businessAssets.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Business Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Ownership %</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Annual Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.businessAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{businessAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.ownershipPercentage ? `${asset.ownershipPercentage}%` : 'N/A'}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.annualRevenue ? formatCurrency(asset.annualRevenue) : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Personal Property Assets Accordion */}
          {formData.personalPropertyAssets.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Personal Property Assets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Insured Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.personalPropertyAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{personalPropertyAssetTypes.find(type => type.value === asset.type)?.label}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.description}</TableCell>
                          <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                          <TableCell>{asset.insuredValue ? formatCurrency(asset.insuredValue) : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}
          
          <Paper elevation={3} sx={{ p: 3, mb: 4, mt: 4 }}>
            <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Current Allocation</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Stocks:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.stocks}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bonds:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.bonds}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cash:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.cash}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Real Estate:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.realEstate}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Alternatives:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.alternatives}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other:</TableCell>
                        <TableCell align="right">{formData.currentAllocation.other}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Target Allocation</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Stocks:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.stocks}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bonds:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.bonds}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cash:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.cash}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Real Estate:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.realEstate}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Alternatives:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.alternatives}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other:</TableCell>
                        <TableCell align="right">{formData.targetAllocation.other}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1">Liquidity Needs: {formData.liquidityNeeds}%</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit Assets & Allocations
            </Button>
          </Box>
        </div>
      )}
    </Box>
  );
}

export default AssetsAllocations;