import { useState, useEffect, FC, Suspense, lazy } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  LocalGroceryStore as ExpensesIcon,
  AccountBalance as AccountBalanceIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { RetirementInputs, RetirementResults, DEFAULT_INPUTS, EMPTY_RESULTS } from '../../types/retirement';
import { calculateRetirement, calculateAdditionalContribution } from '../../utils/retirementCalculations';
import { cityData, costOfLivingByState, taxRatesByState } from '../../utils/locationData';

// Lazy load components for better performance
const BasicInfoTab = lazy(() => import('./components/RetirementCalculator/BasicInfoTab'));
const LocationTab = lazy(() => import('./components/RetirementCalculator/LocationTab'));
const ExpensesTab = lazy(() => import('./components/RetirementCalculator/ExpensesTab'));
const ResultsTab = lazy(() => import('./components/RetirementCalculator/ResultsTab'));
const MonteCarloTab = lazy(() => import('./components/RetirementCalculator/MonteCarloTab'));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const RetirementCalculator: FC = () => {
  // State hooks
  const [inputs, setInputs] = useState<RetirementInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<RetirementResults>(EMPTY_RESULTS);
  const [activeTab, setActiveTab] = useState(0);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [costOfLivingIndex, setCostOfLivingIndex] = useState<number>(100);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Update inputs
  const updateInput = <K extends keyof RetirementInputs>(field: K, value: RetirementInputs[K]) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update expense fields
  const updateExpense = (expenseType: keyof RetirementInputs['monthlyExpenses'], value: number) => {
    setInputs(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [expenseType]: value
      }
    }));
  };
  
  // Update available cities when state changes
  useEffect(() => {
    if (inputs.state) {
      const cities = cityData
        [inputs.state]
        .map(city => city.name);
      
      setAvailableCities(cities);
      
      // Set default city if current city is not in the list
      if (cities.length > 0 && !cities.includes(inputs.city)) {
        updateInput('city', cities[0]);
      }
      
      // Update cost of living index
      const stateCol = costOfLivingByState.find(item => item.state === inputs.state);
      if (stateCol) {
        setCostOfLivingIndex(stateCol.index);
      } else {
        setCostOfLivingIndex(100); // National average
      }
      
      // Update tax rate based on state
      const stateTax = taxRatesByState.find(item => item.state === inputs.state);
      if (stateTax) {
        updateInput('estimatedTaxRate', stateTax.effectiveTaxRate);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.state]);
  
  // Calculate retirement results
  const handleCalculateRetirement = () => {
    const calculatedResults = calculateRetirement(inputs, costOfLivingIndex);
    setResults(calculatedResults);
    setActiveTab(3); // Switch to results tab (now at index 3)
  };
  
  // Adjust savings contribution to meet goal
  const adjustToMeetGoal = () => {
    if (results.savingsShortfall <= 0) return;

    const additionalMonthlyRequired = calculateAdditionalContribution(
      results.savingsShortfall,
      inputs.currentAge,
      inputs.retirementAge,
      inputs.expectedAnnualReturn
    );

    updateInput('monthlyContribution', 
               Math.ceil(inputs.monthlyContribution + additionalMonthlyRequired));
    
    // Recalculate with new contribution
    handleCalculateRetirement();
  };
  
  // Navigate to Monte Carlo simulation
  const navigateToMonteCarlo = () => {
    setActiveTab(4); // Navigate to Monte Carlo tab
  };
  
  return (
    <Box className="retirement-calculator p-4 bg-gray-50 rounded-lg">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Advanced Retirement Calculator
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="retirement calculator tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="Basic Info" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Location" icon={<LocationIcon />} iconPosition="start" />
          <Tab label="Expenses" icon={<ExpensesIcon />} iconPosition="start" />
          <Tab label="Results" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Monte Carlo" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Basic Info Tab */}
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Suspense fallback={<LoadingSpinner />}>
            <BasicInfoTab 
              inputs={inputs}
              onInputChange={updateInput}
                  />
          </Suspense>
        )}
      </Box>
      
      {/* Location Tab */}
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner />}>
            <LocationTab
              inputs={inputs}
              onInputChange={updateInput}
              availableCities={availableCities}
              costOfLivingIndex={costOfLivingIndex}
            />
          </Suspense>
        )}
      </Box>
      
      {/* Expenses Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
          <Suspense fallback={<LoadingSpinner />}>
            <ExpensesTab
              inputs={inputs}
              onExpenseChange={updateExpense}
              onCalculate={handleCalculateRetirement}
            />
          </Suspense>
        )}
      </Box>
      
      {/* Results Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
          <Suspense fallback={<LoadingSpinner />}>
            <ResultsTab
              inputs={inputs}
              results={results}
              onAdjustToMeetGoal={adjustToMeetGoal}
              onNavigateToMonteCarlo={navigateToMonteCarlo}
            />
          </Suspense>
        )}
                </Box>
                
      {/* Monte Carlo Tab */}
      <Box role="tabpanel" hidden={activeTab !== 4}>
        {activeTab === 4 && (
          <Suspense fallback={<LoadingSpinner />}>
            <MonteCarloTab
              inputs={inputs}
              costOfLivingIndex={costOfLivingIndex}
            />
          </Suspense>
        )}
      </Box>
      
      {/* Navigation buttons */}
      <Box className="mt-4 flex justify-between">
        <Button
          variant="outlined"
          disabled={activeTab === 0}
          onClick={() => setActiveTab(prev => prev - 1)}
        >
          Previous
        </Button>
        
        {activeTab < 4 && (
          <Button
            variant="contained"
            className="bg-[#2E7D32] text-white"
            onClick={() => activeTab === 2 ? handleCalculateRetirement() : setActiveTab(prev => prev + 1)}
          >
            {activeTab === 2 ? 'Calculate Results' : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default RetirementCalculator;