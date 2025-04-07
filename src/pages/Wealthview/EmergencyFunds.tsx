/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/EmergencyFunds/EmergencyFundsForm.tsx
// @ts-nocheck at the top of files to ignore all errors in that file


import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { EmergencyFundsForm as FormType, EmergencySavingsAccount, EmergencyFundUsage, SafetyNet } from '../../types';
import { generateId, calculateTotalSavings } from '../../utils/emergencyFund';
import CurrentSavingsSection from './emergency-form/CurrentSavingsSection';
import FundCoverageSection from './emergency-form/FundCoverageSection';
// Import other sections as they are created

const EmergencyFunds = () => {
  // Initial form state
  const [formData, setFormData] = useState<FormType>({
    // Current emergency savings
    totalEmergencySavings: 0,
    savingsAccounts: [],
    
    // Emergency fund coverage
    monthlyEssentialExpenses: 0,
    targetCoverageMonths: 6,
    
    // Emergency fund usage history
    hasUsedEmergencyFunds: false,
    usageHistory: [],
    
    // Additional safety nets
    hasLineOfCredit: false,
    creditLines: [],
    hasInsuranceCoverage: false,
    insuranceCoverage: [],
    hasFamilySupport: false,
    familySupportDetails: "",
    otherLiquidAssets: 0,
    
    // Emergency fund strategy
    monthlyContribution: 0,
    targetCompletionDate: "",
    
    // Risk assessment
    jobSecurityLevel: 3,
    healthConsiderations: "",
    majorUpcomingExpenses: "",
    dependentCount: 0
  });

  // Form display mode vs edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle text field changes
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: ["monthlyEssentialExpenses", "otherLiquidAssets", "monthlyContribution", "dependentCount"].includes(name)
        ? Number(value)
        : value
    });
  };

  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle boolean changes
  const handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const boolValue = value === 'true';
    setFormData({
      ...formData,
      [name]: boolValue
    });
  };

  // Handle slider changes
  const handleSliderChange = (name: string) => (_event: Event, newValue: number | number[]) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // Handle adding a new emergency savings account
  const addSavingsAccount = () => {
    const newAccount: EmergencySavingsAccount = {
      id: generateId(),
      accountType: "High-yield savings account",
      institution: "",
      amount: 0,
      interestRate: 0,
      liquidityPeriod: "Same day"
    };
    
    setFormData({
      ...formData,
      savingsAccounts: [...formData.savingsAccounts, newAccount]
    });
  };

  // Handle updating an emergency savings account
  const updateSavingsAccount = (id: string, updatedAccount: EmergencySavingsAccount) => {
    setFormData({
      ...formData,
      savingsAccounts: formData.savingsAccounts.map(account => 
        account.id === id ? updatedAccount : account
      )
    });
  };

  // Handle removing an emergency savings account
  const removeSavingsAccount = (id: string) => {
    setFormData({
      ...formData,
      savingsAccounts: formData.savingsAccounts.filter(account => account.id !== id)
    });
  };

  // Handle adding emergency fund usage history
  const addUsageHistory = () => {
    const newUsage: EmergencyFundUsage = {
      id: generateId(),
      date: "",
      amount: 0,
      purpose: "",
      replenishmentTime: 0
    };
    
    setFormData({
      ...formData,
      usageHistory: [...formData.usageHistory, newUsage]
    });
  };

  // Handle updating emergency fund usage history
  const updateUsageHistory = (id: string, updatedUsage: EmergencyFundUsage) => {
    setFormData({
      ...formData,
      usageHistory: formData.usageHistory.map(usage => 
        usage.id === id ? updatedUsage : usage
      )
    });
  };

  // Handle removing emergency fund usage history
  const removeUsageHistory = (id: string) => {
    setFormData({
      ...formData,
      usageHistory: formData.usageHistory.filter(usage => usage.id !== id)
    });
  };

  // Handle adding a credit line safety net
  const addCreditLine = () => {
    const newCreditLine: SafetyNet = {
      id: generateId(),
      type: "Credit card",
      details: "",
      limit: 0,
      available: 0
    };
    
    setFormData({
      ...formData,
      creditLines: [...formData.creditLines, newCreditLine]
    });
  };

  // Handle updating a credit line safety net
  const updateCreditLine = (id: string, updatedCreditLine: SafetyNet) => {
    setFormData({
      ...formData,
      creditLines: formData.creditLines.map(creditLine => 
        creditLine.id === id ? updatedCreditLine : creditLine
      )
    });
  };

  // Handle removing a credit line safety net
  const removeCreditLine = (id: string) => {
    setFormData({
      ...formData,
      creditLines: formData.creditLines.filter(creditLine => creditLine.id !== id)
    });
  };

  // Handle adding insurance coverage
  const addInsuranceCoverage = () => {
    const newInsurance: SafetyNet = {
      id: generateId(),
      type: "Health insurance",
      details: ""
    };
    
    setFormData({
      ...formData,
      insuranceCoverage: [...formData.insuranceCoverage, newInsurance]
    });
  };

  // Handle updating insurance coverage
  const updateInsuranceCoverage = (id: string, updatedInsurance: SafetyNet) => {
    setFormData({
      ...formData,
      insuranceCoverage: formData.insuranceCoverage.map(insurance => 
        insurance.id === id ? updatedInsurance : insurance
      )
    });
  };

  // Handle removing insurance coverage
  const removeInsuranceCoverage = (id: string) => {
    setFormData({
      ...formData,
      insuranceCoverage: formData.insuranceCoverage.filter(insurance => insurance.id !== id)
    });
  };

  // Submit form and switch to display mode
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Update the total emergency savings based on accounts
    setFormData({
      ...formData,
      totalEmergencySavings: calculateTotalSavings(formData.savingsAccounts)
    });
    setIsEditing(false);
    // Here you would typically save the data or pass it to parent components
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Emergency Funds</Typography>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {/* Current Savings Section */}
          <CurrentSavingsSection 
            savingsAccounts={formData.savingsAccounts}
            updateSavingsAccount={updateSavingsAccount}
            removeSavingsAccount={removeSavingsAccount}
            addSavingsAccount={addSavingsAccount}
          />
          
          {/* Emergency Fund Coverage Section */}
          <FundCoverageSection 
            monthlyEssentialExpenses={formData.monthlyEssentialExpenses}
            targetCoverageMonths={formData.targetCoverageMonths}
            totalSavings={calculateTotalSavings(formData.savingsAccounts)}
            handleTextFieldChange={handleTextFieldChange}
            handleSliderChange={handleSliderChange}
          />
          
          {/* Add other sections here as they are implemented */}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Save Emergency Fund Information
            </Button>
          </Box>
        </form>
      ) : (
        <Box>
          {/* Display summary view when not in edit mode */}
          {/* EmergencySummaryView will be implemented later */}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
              Edit Emergency Fund Information
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmergencyFunds;