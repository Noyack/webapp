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
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Receipt as ExpenseIcon,
  AccountBalance as TaxIcon,
  Assessment as ResultsIcon
} from '@mui/icons-material';
import { RealHourlyWageInputs, DEFAULT_REAL_HOURLY_WAGE_INPUTS } from '../../types/realHourlyWage';
import { validateRealHourlyWageInputs } from '../../utils/realHourlyWageCalculations';

// Lazy load components for better performance
const SalaryDetailsTab = lazy(() => import('./components/RealHourlyWageCalculator/SalaryDetailsTab'));
const WorkExpensesTab = lazy(() => import('./components/RealHourlyWageCalculator/WorkExpensesTab'));
const TimeCommitmentTab = lazy(() => import('./components/RealHourlyWageCalculator/TimeCommitmentTab'));
const TaxesTab = lazy(() => import('./components/RealHourlyWageCalculator/TaxesTab'));
const ResultsTab = lazy(() => import('./components/RealHourlyWageCalculator/ResultsTab'));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const RealHourlyWageCalculator: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State hooks
  const [inputs, setInputs] = useState<RealHourlyWageInputs>(DEFAULT_REAL_HOURLY_WAGE_INPUTS);
  const [activeTab, setActiveTab] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Update inputs function
  const updateInput = <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => {
    const newInputs = {
      ...inputs,
      [field]: value
    };
    setInputs(newInputs);
  };

  // Validate inputs when they change
  useEffect(() => {
    const validation = validateRealHourlyWageInputs(inputs);
    setValidationErrors(validation.errors);
  }, [inputs]);

  // Calculate results functionality
  const calculateResults = () => {
    const validation = validateRealHourlyWageInputs(inputs);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setHasCalculated(true);
    setActiveTab(4); // Navigate to results tab
    setValidationErrors([]);
  };

  const canProceedToNext = () => {
    switch (activeTab) {
      case 0: // Salary Details
        return inputs.salary.salaryType === 'salary' 
          ? inputs.salary.annualSalary > 0 
          : (inputs.salary.hourlyRate && inputs.salary.hourlyRate > 0);
      case 1: // Work Expenses
        return true; // Can always proceed
      case 2: // Time Commitment
        return inputs.schedule.hoursPerWeek > 0 && inputs.schedule.weeksPerYear > 0;
      case 3: // Taxes
        return true; // Can always proceed
      default:
        return true;
    }
  };

  const getTabLabel = (index: number) => {
    if (isMobile) {
      switch (index) {
        case 0: return 'Salary';
        case 1: return 'Expenses';
        case 2: return 'Time';
        case 3: return 'Taxes';
        case 4: return 'Results';
        default: return '';
      }
    }
    
    switch (index) {
      case 0: return 'Salary Details';
      case 1: return 'Work Expenses';
      case 2: return 'Time Commitment';
      case 3: return 'Taxes & Benefits';
      case 4: return 'Results';
      default: return '';
    }
  };

  return (
    <Box className="real-hourly-wage-calculator bg-gray-50 min-h-screen">
      <Box className="container mx-auto p-4 max-w-7xl">
        <Typography variant={isMobile ? "h5" : "h4"} className="mb-6 text-center text-[#2E7D32] font-bold">
          Real Hourly Wage Calculator
        </Typography>
        
        <Typography variant="body1" className="mb-6 text-center text-gray-600">
          Discover your true hourly earnings by factoring in commuting time, work expenses, taxes, and preparation time. 
          See what you really make per hour of your life committed to work.
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
            aria-label="real hourly wage calculator tabs" 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            <Tab 
              label={getTabLabel(0)} 
              icon={<MoneyIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(1)} 
              icon={<ExpenseIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(2)} 
              icon={<ScheduleIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(3)} 
              icon={<TaxIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(4)} 
              icon={<ResultsIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
              disabled={!hasCalculated}
            />
          </Tabs>
        </Box>
        
        {/* Salary Details Tab */}
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <SalaryDetailsTab 
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Work Expenses Tab */}
        <Box role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Suspense fallback={<LoadingSpinner />}>
              <WorkExpensesTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Time Commitment Tab */}
        <Box role="tabpanel" hidden={activeTab !== 2}>
          {activeTab === 2 && (
            <Suspense fallback={<LoadingSpinner />}>
              <TimeCommitmentTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
        </Box>
        
        {/* Taxes Tab */}
        <Box role="tabpanel" hidden={activeTab !== 3}>
          {activeTab === 3 && (
            <Suspense fallback={<LoadingSpinner />}>
              <TaxesTab
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
            {/* Calculate button for taxes tab */}
            {activeTab === 3 && (
              <Box className={isMobile ? 'w-full' : 'min-w-[300px]'}>
                <Button
                  variant="contained"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                  onClick={calculateResults}
                  disabled={validationErrors.length > 0}
                  size={isMobile ? "large" : "medium"}
                  fullWidth={isMobile}
                >
                  {hasCalculated ? 'Recalculate Results' : 'Calculate Real Wage'}
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
                  step === activeTab ? 'bg-green-600' : 
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

export default RealHourlyWageCalculator; 