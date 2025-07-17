/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

// Import types
import { 
  Windfall, 
  PersonalInfo, 
  FinancialSituation, 
  Goals, 
  InvestmentPreferences,
  OptimizationResults,
  TaxImplications
} from '../../types';

// Import step components
import BasicInformationStep from './components/windfall/BasicInformationStep';
import FinancialSituationStep from './components/windfall/FinancialSituationStep';
import GoalsPrioritiesStep from './components/windfall/GoalsPrioritiesStep';
import InvestmentPreferencesStep from './components/windfall/InvestmentPreferencesStep';
import ResultsStep from './components/windfall/ResultsStep';

// Import optimization logic
import { calculateOptimization } from './components/windfall/optimization';

const WindfallOptimizer: React.FC = () => {
  // State to track current step
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Financial Situation', 'Goals & Priorities', 'Investment Preferences', 'Results'];

  // Windfall details
  const [windfall, setWindfall] = useState<Windfall>({
    amount: 100000,
    source: 'inheritance',
    taxable: false
  });

  // Personal information
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: 35,
    taxBracket: 22,
    income: 75000,
    monthlyExpenses: 3500,
    timeHorizon: 'medium' // short, medium, long
  });

  // Financial situation
  const [financialSituation, setFinancialSituation] = useState<FinancialSituation>({
    emergencyFund: 10000,
    retirementSavings: 50000,
    hasEmergencyFund: true,
    monthsOfExpenses: 3,
    debts: [
      { type: 'creditCard', balance: 5000, interestRate: 18.0, minimumPayment: 150 },
      { type: 'studentLoan', balance: 20000, interestRate: 4.5, minimumPayment: 250 }
    ],
    existingInvestments: [
      { vehicle: 'roth401k', balance: 40000 },
      { vehicle: 'taxableAccount', balance: 15000 }
    ]
  });

  // Goals and priorities
  const [goals, setGoals] = useState<Goals>({
    primaryGoal: 'retirement',
    additionalGoals: ['debtFreedom', 'education'],
    plannedLargePurchases: [
      { type: 'vehicle', timeframe: 2, estimatedAmount: 30000 }
    ],
    priorities: {
      debtReduction: 4,
      emergencyFund: 5,
      retirement: 4,
      shortTermSavings: 3,
      longTermGrowth: 3
    }
  });

  // Investment preferences
  const [investmentPrefs, setInvestmentPrefs] = useState<InvestmentPreferences>({
    riskTolerance: 'moderate',
    customAllocation: {
        stocks: 60,
        bonds: 30,
        cash: 10,
        alternatives: 0,
        realEstate: 0,
        other: 0
    },
    preferredVehicles: ['roth401k', 'rothIRA', 'taxableAccount'],
    excludedSectors: ['tobacco', 'gambling'],
    esgFocus: false,
    feeSensitivity: 'moderate',
    managementPreference: 'passive'
  });

  // Optimization results
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResults>({
    recommendations: [],
    allocationByCategory: {
      debtPayoff: 0,
      emergencyFund: 0,
      retirement: 0,
      shortTermGoals: 0,
      longTermInvestment: 0,
      education: 0,
      charity: 0,
      reserve: 0
    },
    projections: [],
    debtPayoffPlan: {}
  });

  // Tax implications
  const [taxImplications, setTaxImplications] = useState<TaxImplications>({
    estimatedTaxImpact: 0,
    taxSavingStrategies: []
  });

  // Effect to calculate optimization when inputs change
  useEffect(() => {
    if (activeStep === 4) {
      // Clone the state objects to ensure consistent calculations
      const windfallCopy = JSON.parse(JSON.stringify(windfall));
      const personalInfoCopy = JSON.parse(JSON.stringify(personalInfo));
      const financialSituationCopy = JSON.parse(JSON.stringify(financialSituation));
      const goalsCopy = JSON.parse(JSON.stringify(goals));
      const investmentPrefsCopy = JSON.parse(JSON.stringify(investmentPrefs));
      
      // Run calculation with the cloned data
      const { optimizationResults: results, taxImplications: taxes } = calculateOptimization(
        windfallCopy,
        personalInfoCopy,
        financialSituationCopy,
        goalsCopy,
        investmentPrefsCopy
      );
      
      // Update state once with final results
      setOptimizationResults(results);
      setTaxImplications(taxes);
    }
  }, [activeStep]);
  
  // Handle next button
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back button
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle reset
  const handleReset = () => {
    setActiveStep(0);
  };

  // Render step content
  const getStepContent = (step: number) => {
    const stepProps = {
      windfall,
      setWindfall,
      personalInfo,
      setPersonalInfo,
      financialSituation,
      setFinancialSituation,
      goals,
      setGoals,
      investmentPrefs,
      setInvestmentPrefs,
      optimizationResults,
      taxImplications
    };

    switch (step) {
      case 0:
        return <BasicInformationStep setStep={function (_step: number): void {
            throw new Error('Function not implemented.');
        } } {...stepProps} />;
      case 1:
        return <FinancialSituationStep setStep={function (_step: number): void {
            throw new Error('Function not implemented.');
        } } {...stepProps} />;
      case 2:
        return <GoalsPrioritiesStep setStep={function (_step: number): void {
            throw new Error('Function not implemented.');
        } } {...stepProps} />;
      case 3:
        return <InvestmentPreferencesStep setStep={function (_step: number): void {
            throw new Error('Function not implemented.');
        } } {...stepProps} />;
      case 4:
        return <ResultsStep setStep={function (_step: number): void {
            throw new Error('Function not implemented.');
        } } {...stepProps} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box className="inheritance-optimizer p-4 bg-gray-50 rounded-lg">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Inheritance/Windfall Optimizer
      </Typography>
      
      <Stepper activeStep={activeStep} className="mb-6">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {getStepContent(activeStep)}
      
      <Box className="mt-4 flex justify-between">
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Previous
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleReset}
            className="bg-[#2E7D32] text-white"
          >
            Start Over
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            className="bg-[#2E7D32] text-white"
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WindfallOptimizer;