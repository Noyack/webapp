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
  Info as InfoIcon,
  Person as PersonIcon,
  Tune as TuneIcon,
  School as SchoolIcon,
  AccountBalance as AccountBalanceIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { ChildCostInputs, DEFAULT_CHILD_COST_INPUTS } from '../../types/childCost';
import { validateInputs } from '../../utils/childCostCalculations';
import { usStates } from '../../utils/childCostLocationData';

// Lazy load components for better performance
const BasicInformationTab = lazy(() => import('./components/ChildCostProjector/BasicInformationTab'));
const ChildDetailsTab = lazy(() => import('./components/ChildCostProjector/ChildDetailsTab'));
const CostAdjustmentsTab = lazy(() => import('./components/ChildCostProjector/CostAdjustmentsTab'));
const EducationCostsTab = lazy(() => import('./components/ChildCostProjector/EducationCostsTab'));
const CollegePlanningTab = lazy(() => import('./components/ChildCostProjector/CollegePlanningTab'));
const AdvancedAnalyticsTab = lazy(() => import('./components/ChildCostProjector/AdvancedAnalyticsTab'));
const ResultsTab = lazy(() => import('./components/ChildCostProjector/ResultsTab'));

// Loading component
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ChildCostProjector: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State hooks
  const [inputs, setInputs] = useState<ChildCostInputs>(DEFAULT_CHILD_COST_INPUTS);
  const [activeTab, setActiveTab] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Update inputs function
  const updateInput = <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => {
    const newInputs = {
      ...inputs,
      [field]: value
    };
    
    setInputs(newInputs);
  };

  // Handle calculation type change with data migration
  useEffect(() => {
    if (inputs.calculationType === 'future') {
      // Update existing children to have birth years
      const updatedChildren = inputs.children.map(child => ({
      ...child,
        birthYear: child.birthYear || (new Date().getFullYear() - child.currentAge),
        currentAge: 0 // Reset age for future children
      }));
      
      setInputs(prev => ({
        ...prev,
        children: updatedChildren
      }));
    } else {
      // Update existing children to have current ages based on birth years
      const updatedChildren = inputs.children.map(child => {
        if (child.birthYear) {
          return {
            ...child,
            currentAge: Math.max(0, new Date().getFullYear() - child.birthYear)
          };
      }
      return child;
    });
    
      setInputs(prev => ({
      ...prev,
        children: updatedChildren
      }));
    }
  }, [inputs.calculationType]);

  // Update location data when state changes
  useEffect(() => {
    if (inputs.location.state) {
      const stateData = usStates.find(s => s.code === inputs.location.state);
      if (stateData) {
        setInputs(prev => ({
          ...prev,
          location: {
            ...prev.location,
            costOfLivingIndex: stateData.costOfLivingIndex
          }
        }));
      }
    }
  }, [inputs.location.state]);

  // Validate inputs when they change
  useEffect(() => {
    const validation = validateInputs(inputs);
    setValidationErrors(validation.errors);
  }, [inputs]);

  // Calculate results functionality
  const calculateResults = () => {
    const validation = validateInputs(inputs);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setHasCalculated(true);
    setActiveTab(6); // Navigate to results tab
    setValidationErrors([]);
  };

  const canProceedToNext = () => {
    switch (activeTab) {
      case 0: // Basic Information
        return inputs.household.income > 0 && inputs.location.state !== '';
      case 1: // Child Details
        return inputs.children.length > 0 && inputs.children.every(child => child.name.trim() !== '');
      case 2: // Cost Adjustments
        return true; // Always can proceed from cost adjustments
      case 3: // Education Costs
        return true; // Always can proceed from education costs
      case 4: // College Planning
        return true; // Always can proceed from college planning
      case 5: // Advanced Analytics
        return true; // Always can proceed from advanced analytics
      default:
        return true;
    }
  };

  const getTabLabel = (index: number) => {
    if (isMobile) {
      switch (index) {
        case 0: return 'Info';
        case 1: return 'Children';
        case 2: return 'Costs';
        case 3: return 'Education';
        case 4: return 'College';
        case 5: return 'Analytics';
        case 6: return 'Results';
        default: return '';
      }
    }
    
    switch (index) {
      case 0: return 'Basic Information';
      case 1: return 'Child Details';
      case 2: return 'Cost Adjustments';
      case 3: return 'Education Costs';
      case 4: return 'College Planning';
      case 5: return 'Advanced Analytics';
      case 6: return 'Results';
      default: return '';
    }
  };

  return (
    <Box className="child-cost-projector bg-gray-50 min-h-screen">
      <Box className="container mx-auto p-4 max-w-7xl">
        <Typography variant={isMobile ? "h5" : "h4"} className="mb-6 text-center text-[#011E5A] font-bold">
        Child Cost Projector
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
            aria-label="child cost projector tabs" 
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            <Tab 
              label={getTabLabel(0)} 
              icon={<InfoIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(1)} 
              icon={<PersonIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(2)} 
              icon={<TuneIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(3)} 
              icon={<SchoolIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(4)} 
              icon={<AccountBalanceIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(5)} 
              icon={<AnalyticsIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
            />
            <Tab 
              label={getTabLabel(6)} 
              icon={<AssessmentIcon />} 
              iconPosition={isMobile ? "top" : "start"} 
              disabled={!hasCalculated}
            />
          </Tabs>
                </Box>
        
        {/* Basic Information Tab */}
        <Box role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <Suspense fallback={<LoadingSpinner />}>
              <BasicInformationTab 
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
                  )}
                </Box>
                
        {/* Child Details Tab */}
        <Box role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
            <Suspense fallback={<LoadingSpinner />}>
              <ChildDetailsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* Cost Adjustments Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
            <Suspense fallback={<LoadingSpinner />}>
              <CostAdjustmentsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
        {/* Education Costs Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
            <Suspense fallback={<LoadingSpinner />}>
              <EducationCostsTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
        )}
      </Box>
      
      {/* College Planning Tab */}
      <Box role="tabpanel" hidden={activeTab !== 4}>
        {activeTab === 4 && (
            <Suspense fallback={<LoadingSpinner />}>
              <CollegePlanningTab
                inputs={inputs}
                onInputChange={updateInput}
              />
            </Suspense>
          )}
                </Box>
                
        {/* Advanced Analytics Tab */}
      <Box role="tabpanel" hidden={activeTab !== 5}>
        {activeTab === 5 && (
            <Suspense fallback={<LoadingSpinner />}>
              <AdvancedAnalyticsTab
                inputs={inputs}
                selectedChild={inputs.children.find(c => c.id === inputs.selectedChild) || inputs.children[0]}
              />
            </Suspense>
          )}
                  </Box>
        
        {/* Results Tab */}
        <Box role="tabpanel" hidden={activeTab !== 6}>
          {activeTab === 6 && (
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
            {/* Calculate button for college planning tab */}
            {activeTab === 5 && (
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
                      ⚠️ Please fix validation errors to calculate results.
                        </Typography>
                      </Box>
                        )}
                      </Box>
            )}
            
            {/* Next button for other tabs */}
            {activeTab < 5 && (
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
            {activeTab < 6 && hasCalculated && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                onClick={() => setActiveTab(6)}
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
            {[0, 1, 2, 3, 4, 5, 6].map((step) => (
              <Box
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === activeTab ? 'bg-blue-600' : 
                  step < activeTab || (step === 6 && hasCalculated) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChildCostProjector;