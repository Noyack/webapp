/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import { UserState, TaxResults } from '../../types';
import { defaultUserState } from '../../constants/TaxConstants';
import { calculateTaxResults } from '../../utils/TaxCalculatorUtils';

// Step components
import CalculatorModeStep from './components/TaxCalculator/CalculatorModeStep';
import IncomeStatusStep from './components/TaxCalculator/IncomeStatusStep';
import DeductionsStep from './components/TaxCalculator/DeductionsStep';
import BusinessDeductionsStep from './components/TaxCalculator/BusinessDeductionsStep';
import InvestmentsStep from './components/TaxCalculator/InvestmentsStep';
import TaxAdvantagedStep from './components/TaxCalculator/TaxAdvantagedStep';
import SavingsStep from './components/TaxCalculator/SavingsStep';
import ResultsStep from './components/TaxCalculator/ResultStep';

const TaxOptimizationCalculator: React.FC = () => {
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<string>('basic');
  const [userData, setUserData] = useState<UserState>(defaultUserState);
  const [results, setResults] = useState<TaxResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Steps based on the active mode
  const getSteps = () => {
    const basicSteps = ['Choose Mode', 'Income & Status', 'Tax-Advantaged Accounts', 'Results'];
    const advancedSteps = ['Choose Mode', 'Income & Status', 'Deductions', 'Tax-Advantaged Accounts', 'Savings', 'Results'];
    const investorSteps = ['Choose Mode', 'Income & Status', 'Investments', 'Tax-Advantaged Accounts', 'Savings', 'Results'];
    const selfEmployedSteps = ['Choose Mode', 'Income & Status', 'Business Deductions', 'Tax-Advantaged Accounts', 'Savings', 'Results'];
    
    switch (mode) {
      case 'basic':
        return basicSteps;
      case 'advanced':
        return advancedSteps;
      case 'investor':
        return investorSteps;
      case 'self-employed':
        return selfEmployedSteps;
      default:
        return basicSteps;
    }
  };

  // Handle mode change
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setActiveStep(1); // Move to next step after selecting mode
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === getSteps().length - 2) {
      calculateResults();
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Calculate tax results
  const calculateResults = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const results = calculateTaxResults(userData);
      setResults(results);
      setIsCalculating(false);
    }, 1000);
  };

  // Update user data
  const updateUserData = (newData: UserState) => {
    setUserData(newData);
  };

  // Get step content based on active step
  const getStepContent = (stepIndex: number) => {
    const steps = getSteps();
    const stepName = steps[stepIndex];
    
    switch (stepName) {
      case 'Choose Mode':
        return <CalculatorModeStep activeMode={mode} onModeChange={handleModeChange} />;
        
      case 'Income & Status':
        return <IncomeStatusStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Deductions':
        return <DeductionsStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Business Deductions':
        return <BusinessDeductionsStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Investments':
        return <InvestmentsStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Tax-Advantaged Accounts':
        return <TaxAdvantagedStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Savings':
        return <SavingsStep userData={userData} updateUserData={updateUserData} />;
        
      case 'Results':
        return (
          <ResultsStep 
            userData={userData} 
            results={results} 
            isCalculating={isCalculating} 
            onCalculate={calculateResults} 
          />
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box className="bg-white rounded-xl shadow-sm p-4 max-w-full mx-auto">
      <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
        {getSteps().map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <div>
        {getStepContent(activeStep)}
        
        <Box className="flex justify-between mt-8">
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === getSteps().length - 1}
          >
            {activeStep === getSteps().length - 2 ? 'Calculate' : 'Next'}
          </Button>
        </Box>
      </div>
      
      {/* Disclaimer */}
      <Box className="mt-8 p-3 bg-gray-50 rounded text-gray-500">
        <Typography variant="caption">
          Disclaimer: This calculator is for illustrative purposes only and does not constitute tax advice.
          Tax laws are complex and change frequently. Please consult with a qualified tax professional for 
          personalized advice regarding your specific situation.
        </Typography>
      </Box>
    </Box>
  );
};

export default TaxOptimizationCalculator;