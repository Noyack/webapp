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
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Savings as SavingsIcon,
  Assessment as ResultsIcon
} from '@mui/icons-material';
import { LifestyleInflationInputs, DEFAULT_LIFESTYLE_INFLATION_INPUTS } from '../../types/lifestyleInflation';
import { validateLifestyleInflationInputs } from '../../utils/lifestyleInflationCalculations';

// Lazy load components for better performance
const IncomeRaisesTab = lazy(() => import('./components/LifestyleInflationCalculator/IncomeRaisesTab'));
const SpendingCategoriesTab = lazy(() => import('./components/LifestyleInflationCalculator/SpendingCategoriesTab'));
const SavingsGoalsTab = lazy(() => import('./components/LifestyleInflationCalculator/SavingsGoalsTab'));
const InflationResultsTab = lazy(() => import('./components/LifestyleInflationCalculator/InflationResultsTab'));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const LifestyleInflationCalculator: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State hooks
  const [inputs, setInputs] = useState<LifestyleInflationInputs>(DEFAULT_LIFESTYLE_INFLATION_INPUTS);
  const [activeTab, setActiveTab] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Update inputs function
  const updateInput = <K extends keyof LifestyleInflationInputs>(field: K, value: LifestyleInflationInputs[K]) => {
    const newInputs = {
      ...inputs,
      [field]: value
    };
    setInputs(newInputs);
  };

  // Validate inputs when they change
  useEffect(() => {
    const validation = validateLifestyleInflationInputs(inputs);
    setValidationErrors(validation.errors);
  }, [inputs]);

  // Calculate results functionality
  const calculateResults = () => {
    const validation = validateLifestyleInflationInputs(inputs);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setHasCalculated(true);
    setActiveTab(3); // Navigate to results tab
    setValidationErrors([]);
  };

  const canProceedToNext = () => {
    switch (activeTab) {
      case 0: // Income & Raises
        return inputs.currentIncome.annual > 0 && 
               inputs.expectedRaises.frequency > 0 &&
               inputs.expectedRaises.averagePercentage > 0;
      case 1: // Spending Categories
        return inputs.spendingCategories.length > 0 &&
               inputs.spendingCategories.every(cat => cat.currentMonthlyAmount >= 0);
      case 2: // Savings Goals
        return inputs.savingsGoals.currentSavingsRate >= 0 &&
               inputs.savingsGoals.targetSavingsRate >= 0;
      default:
        return true;
    }
  };

  const getTabLabel = (index: number) => {
    if (isMobile) {
      switch (index) {
        case 0: return 'Income';
        case 1: return 'Spending';
        case 2: return 'Savings';
        case 3: return 'Results';
        default: return '';
      }
    }
    
    switch (index) {
      case 0: return 'Income & Raises';
      case 1: return 'Spending Categories';
      case 2: return 'Savings Goals';
      case 3: return 'Results';
      default: return '';
    }
  };

  return (
    <Box className="lifestyle-inflation-calculator bg-gray-50 min-h-screen">
      <Box className="container mx-auto p-4 max-w-7xl">
        <Typography variant={isMobile ? "h5" : "h4"} className="mb-6 text-center text-[#1976D2] font-bold">
          Lifestyle Inflation Impact Calculator
        </Typography>
        
        <Typography variant="body1" className="mb-6 text-center text-gray-600">
          Discover how your spending automatically increases with income raises and the compound effect this has on your wealth building. 
          See the true cost of lifestyle inflation over time.
        </Typography>
        
        {/* Global validation errors */}
        {validationErrors.length > 0 && activeTab !== 0 && (
          <Alert severity="error" className="mb-4">
            <Typography variant="subtitle2" className="mb-2">Please address these issues:</Typography>
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
            aria-label="lifestyle inflation calculator tabs" 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            <Tab 
              label={getTabLabel(0)} 
              icon={<TrendingUpIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(1)} 
              icon={<CategoryIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(2)} 
              icon={<SavingsIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(3)} 
              icon={<ResultsIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
              disabled={!hasCalculated}
            />
          </Tabs>
        </Box>
        
        {/* Income & Raises Tab */}
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <IncomeRaisesTab 
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Spending Categories Tab */}
        <Box role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Suspense fallback={<LoadingSpinner />}>
              <SpendingCategoriesTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Savings Goals Tab */}
        <Box role="tabpanel" hidden={activeTab !== 2}>
          {activeTab === 2 && (
            <Suspense fallback={<LoadingSpinner />}>
              <SavingsGoalsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Results Tab */}
        <Box role="tabpanel" hidden={activeTab !== 3}>
          {activeTab === 3 && (
            <Suspense fallback={<LoadingSpinner />}>
              <InflationResultsTab
                inputs={inputs}
                onInputChange={updateInput}
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
            {/* Calculate button for savings goals tab */}
            {activeTab === 2 && (
              <Box className={isMobile ? 'w-full' : 'min-w-[300px]'}>
                <Button
                  variant="contained"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  onClick={calculateResults}
                  disabled={validationErrors.length > 0}
                  size={isMobile ? "large" : "medium"}
                  fullWidth={isMobile}
                >
                  {hasCalculated ? 'Recalculate Impact' : 'Calculate Lifestyle Impact'}
                </Button>
                
                {/* Helpful note when button is disabled */}
                {validationErrors.length > 0 && (
                  <Box className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-center">
                    <Typography variant="body2" className="text-red-600">
                      ⚠️ Please fix validation errors to calculate results.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Next button for other tabs */}
            {activeTab < 2 && (
              <Button
                variant="contained"
                className="bg-[#1976D2] text-white hover:bg-[#115293]"
                onClick={() => setActiveTab(prev => prev + 1)}
                disabled={!canProceedToNext()}
                size={isMobile ? "large" : "medium"}
                fullWidth={isMobile}
              >
                Next
              </Button>
            )}
            
            {/* View Results button if already calculated */}
            {activeTab < 3 && hasCalculated && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setActiveTab(3)}
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
            {[0, 1, 2, 3].map((step) => (
              <Box
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === activeTab ? 'bg-blue-600' : 
                  step < activeTab || (step === 3 && hasCalculated) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LifestyleInflationCalculator; 