import { useState, useEffect, FC, Suspense, lazy } from 'react';
import { 
  Typography, 
  Box,
  Tabs,
  Tab,
  Button,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { RentVsBuyInputs, DEFAULT_RENT_VS_BUY_INPUTS, ResultData, SummaryData } from '../../types/rentVsBuy';
import { calculateRentVsBuy, validateInputs } from '../../utils/rentVsBuyCalculations';
import { usPropertyTaxRates, usHomeInsuranceRates } from '../../utils/locationData';

// Lazy load components for better performance
const BasicInputsTab = lazy(() => import('./components/RentVsBuyCalculator/BasicInputsTab'));
const HomeDetailsTab = lazy(() => import('./components/RentVsBuyCalculator/HomeDetailsTab'));
const RentDetailsTab = lazy(() => import('./components/RentVsBuyCalculator/RentDetailsTab'));
const AdvancedTab = lazy(() => import('./components/RentVsBuyCalculator/AdvancedTab'));
const ResultsTab = lazy(() => import('./components/RentVsBuyCalculator/ResultsTab'));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const RentVsBuyCalculator: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State hooks
  const [inputs, setInputs] = useState<RentVsBuyInputs>(DEFAULT_RENT_VS_BUY_INPUTS);
  const [results, setResults] = useState<ResultData[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalBuyingCost: 0,
    totalRentingCost: 0,
    finalHomeValue: 0,
    finalEquity: 0,
    netBuyingCost: 0,
    savingsAfterTimePeriod: 0
  });
  const [breakEvenYear, setBreakEvenYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Update inputs function with validation
  const updateInput = <K extends keyof RentVsBuyInputs>(field: K, value: RentVsBuyInputs[K]) => {
    const newInputs = {
      ...inputs,
      [field]: value
    };
    
    setInputs(newInputs);
  };

  // Update location-based data when state changes
  useEffect(() => {
    if (inputs.location.state) {
      // Set property tax rate based on state
      const stateData = usPropertyTaxRates.find(s => s.stateCode === inputs.location.state);
      const insuranceData = usHomeInsuranceRates.find(s => s.stateCode === inputs.location.state);
      
      if (stateData || insuranceData) {
        setInputs(prev => ({
          ...prev,
          location: {
            ...prev.location,
            propertyTaxRate: stateData?.propertyTaxRate || prev.location.propertyTaxRate,
          },
          homeInsuranceRate: insuranceData?.insuranceRate || prev.homeInsuranceRate,
        }));
      }
    }
  }, [inputs.location.state]);

  // Run validation when inputs change (including from location updates)
  useEffect(() => {
    const validation = validateInputs(inputs);
    setValidationErrors(validation.errors);
  }, [inputs]);

  // Calculate results
  const calculateResults = () => {
    const validation = validateInputs(inputs);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      const calculationResults = calculateRentVsBuy(inputs);
      setResults(calculationResults.results);
      setSummary(calculationResults.summary);
      setBreakEvenYear(calculationResults.breakEvenYear);
      setHasCalculated(true);
      setActiveTab(4); // Navigate to results tab
      setValidationErrors([]);
    } catch (error) {
      console.error('Calculation error:', error);
      setValidationErrors(['An error occurred during calculation. Please check your inputs and try again.']);
    }
  };

  // Auto-calculate when inputs change (after initial calculation)
  useEffect(() => {
    if (hasCalculated && validationErrors.length === 0) {
      const validation = validateInputs(inputs);
      if (validation.isValid) {
        try {
          const calculationResults = calculateRentVsBuy(inputs);
          setResults(calculationResults.results);
          setSummary(calculationResults.summary);
          setBreakEvenYear(calculationResults.breakEvenYear);
        } catch (error) {
          console.error('Auto-calculation error:', error);
        }
      }
    }
  }, [inputs, hasCalculated, validationErrors.length]);

  const canProceedToNext = () => {
    switch (activeTab) {
      case 0: // Basic inputs
        return inputs.annualIncome > 0 && inputs.monthlyRent > 0 && inputs.homePrice > 0;
      case 1: // Home details
        return inputs.interestRate > 0 && inputs.homeInsuranceRate > 0;
      case 2: // Rent details
        return inputs.monthlyRentersInsurance >= 0;
      case 3: // Advanced
        return true;
      default:
        return true;
    }
  };

  const getTabLabel = (index: number) => {
    if (isMobile) {
      switch (index) {
        case 0: return 'Basics';
        case 1: return 'Home';
        case 2: return 'Rent';
        case 3: return 'Advanced';
        case 4: return 'Results';
        default: return '';
      }
    }
    
    switch (index) {
      case 0: return 'Basic Inputs';
      case 1: return 'Home Details';
      case 2: return 'Rent Details';
      case 3: return 'Advanced';
      case 4: return 'Results';
      default: return '';
    }
  };

  return (
    <Box className="rent-vs-buy-calculator bg-gray-50 min-h-screen">
      <Box className="container mx-auto p-4 max-w-7xl">
        <Typography variant={isMobile ? "h5" : "h4"} className="mb-6 text-center text-[#011E5A] font-bold">
        Rent vs. Buy Calculator
      </Typography>
        
        {/* Global validation errors */}
        {validationErrors.length > 0 && activeTab !== 0 && (
          <Alert severity="error" className="mb-4">
            <Typography variant="subtitle2" className="mb-2">Please fix the following issues:</Typography>
            <ul className="pl-4">
              {validationErrors.slice(0, 3).map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
              {validationErrors.length > 3 && (
                <li className="text-sm">...and {validationErrors.length - 3} more issues</li>
              )}
            </ul>
          </Alert>
        )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="rent vs buy calculator tabs" 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            <Tab 
              label={getTabLabel(0)} 
              icon={<HomeIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(1)} 
              icon={<LocationIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(2)} 
              icon={<ReceiptIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(3)} 
              icon={<SettingsIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(4)} 
              icon={<AssessmentIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
              disabled={!hasCalculated}
            />
        </Tabs>
      </Box>
      
      {/* Basic Inputs Tab */}
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <BasicInputsTab 
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Home Details Tab */}
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
            <Suspense fallback={<LoadingSpinner />}>
              <HomeDetailsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Rent Details Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
            <Suspense fallback={<LoadingSpinner />}>
              <RentDetailsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Advanced Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
            <Suspense fallback={<LoadingSpinner />}>
              <AdvancedTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Results Tab */}
      <Box role="tabpanel" hidden={activeTab !== 4}>
        {activeTab === 4 && (
            <Suspense fallback={<LoadingSpinner />}>
              <ResultsTab
                inputs={inputs}
                results={results}
                summary={summary}
                breakEvenYear={breakEvenYear}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Navigation buttons */}
        <Box className={`mt-6 flex ${isMobile ? 'flex-col space-y-3' : 'flex-row justify-between items-center'}`}>
        <Button
          variant="outlined"
          disabled={activeTab === 0}
          onClick={() => setActiveTab(prev => prev - 1)}
            size={isMobile ? "large" : "medium"}
            fullWidth={isMobile}
        >
          Previous
        </Button>
        
          <Box className={isMobile ? 'space-y-2' : 'space-x-2'}>
            {/* Calculate button for advanced tab */}
            {activeTab === 3 && (
              <Box className={isMobile ? 'w-full' : 'min-w-[300px]'}>
                <Button
                  variant="contained"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  onClick={calculateResults}
                  disabled={validationErrors.length > 0}
                  size={isMobile ? "large" : "medium"}
                  fullWidth={isMobile}
                >
                  {hasCalculated ? 'Recalculate Results' : 'Calculate Results'}
                </Button>
                
                {/* Helpful note when button is disabled */}
                {validationErrors.length > 0 && (
                  <Box className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-center">
                    <Typography variant="body2" className="text-red-600">
                      ⚠️ Please review your inputs as some values exceed recommended financial guidelines.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Next button for other tabs */}
            {activeTab < 3 && (
          <Button
            variant="contained"
                className="bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
            onClick={() => setActiveTab(prev => prev + 1)}
                disabled={!canProceedToNext()}
                size={isMobile ? "large" : "medium"}
                fullWidth={isMobile}
          >
            Next
          </Button>
            )}
            
            {/* View Results button if already calculated */}
            {activeTab < 4 && hasCalculated && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setActiveTab(4)}
                size={isMobile ? "large" : "medium"}
                fullWidth={isMobile}
              >
                View Results
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Progress indicator for mobile */}
        {isMobile && (
          <Box className="mt-4 flex justify-center space-x-2">
            {[0, 1, 2, 3, 4].map((step) => (
              <Box
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === activeTab ? 'bg-blue-600' : 
                  step < activeTab || (step === 4 && hasCalculated) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RentVsBuyCalculator;