/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/EmergencyFunds/EmergencyFundsForm.tsx
// @ts-nocheck at the top of files to ignore all errors in that file

import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  SelectChangeEvent,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { EmergencyFundsForm as FormType, EmergencySavingsAccount, EmergencyFundUsage, SafetyNet } from '../../types';
import { generateId, calculateTotalSavings } from '../../utils/emergencyFund';
import CurrentSavingsSection from './emergency-form/CurrentSavingsSection';
import FundCoverageSection from './emergency-form/FundCoverageSection';
import emergencyFundService from '../../services/emergencyFund.service';
import { UserContext } from '../../context/UserContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import apiClient from '../../services/api-client';
// Import other sections as they are created

const EmergencyFunds = () => {
  const { getToken } = useAuth();
  const { userInfo } = useContext(UserContext);
  
  // Capture userId once and never change it (prevents Clerk refresh issues)
  const userIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Set userId only once when component mounts
  if (!userIdRef.current &&  userInfo?.id) {
    userIdRef.current = userInfo?.id;
  }

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSavings, setIsSavingSavings] = useState(false);
  const [isSavingCoverage, setIsSavingCoverage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Delete-specific states
  const [isDeletingAccount, setIsDeletingAccount] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    accountId: string;
    accountName: string;
  } | null>(null);

  // Original data from backend (for change tracking)
  const [originalData, setOriginalData] = useState<FormType | null>(null);

  // Current form data
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

  // Section editing states
  const [isEditingSavings, setIsEditingSavings] = useState(false);
  const [isEditingCoverage, setIsEditingCoverage] = useState(false);

  // Helper function to get auth token
  const getAuthToken = async () => {
    try {
      const token = await getToken({ template: "noyack" });
      if (token) {
        emergencyFundService.setAuthToken(token);
        apiClient.setAuthToken(token);
      }
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Load data once when component mounts - NO DEPENDENCIES TO PREVENT CLERK REFRESHES
  useEffect(() => {
    const loadData = async () => {
      // Only load if we have a userId and haven't loaded yet
      if (!userIdRef.current || hasLoadedRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get auth token
        await getAuthToken();

        const data = await emergencyFundService.getEmergencyFund(userIdRef.current);
        setFormData(data);
        setOriginalData(JSON.parse(JSON.stringify(data)));
        setError(null);
        hasLoadedRef.current = true;
      } catch (error: unknown) {
        console.error('Error loading emergency fund data:', error);
        setError('Failed to load emergency fund data. Using default values.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // NO DEPENDENCIES - load once and never again

  // Utility function to check if savings section has changes
  const hasSavingsChanges = () => {
    if (!originalData) return false;
    
    // Check if savings accounts have changed
    const currentSavingsJson = JSON.stringify(formData.savingsAccounts.sort((a, b) => a.id.localeCompare(b.id)));
    const originalSavingsJson = JSON.stringify(originalData.savingsAccounts.sort((a, b) => a.id.localeCompare(b.id)));
    
    return currentSavingsJson !== originalSavingsJson;
  };

  // Utility function to check if coverage section has changes
  const hasCoverageChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.monthlyEssentialExpenses !== originalData.monthlyEssentialExpenses ||
      formData.targetCoverageMonths !== originalData.targetCoverageMonths
    );
  };

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
      id: `temp-${Date.now()}`, // Use temporary ID for new accounts
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

  // Handle removing an emergency savings account with immediate delete
  const removeSavingsAccount = (id: string) => {
    const account = formData.savingsAccounts.find(acc => acc.id === id);
    if (!account) return;

    // Show confirmation dialog for existing accounts (not temp accounts)
    if (!id.startsWith('temp-')) {
      setDeleteConfirmation({
        open: true,
        accountId: id,
        accountName: `${account.accountType} at ${account.institution || 'Unknown'}`
      });
    } else {
      // For temporary accounts, just remove from state
      setFormData({
        ...formData,
        savingsAccounts: formData.savingsAccounts.filter(account => account.id !== id)
      });
    }
  };

  // Handle confirmed deletion
  const handleConfirmedDelete = async (accountId: string) => {
    if (!userIdRef.current) {
      setError('Unable to delete: missing user data');
      return;
    }

    try {
      setIsDeletingAccount(accountId);
      setError(null);

      // Get fresh auth token
      await getAuthToken();

      // Delete from backend immediately
      const deleteResponse = await apiClient.delete(`/v1/emergency-savings-account/${accountId}`);

      // Remove from local state
      const updatedSavingsAccounts = formData.savingsAccounts.filter(account => account.id !== accountId);
      
      // Calculate new total from remaining accounts
      const newTotal = calculateTotalSavings(updatedSavingsAccounts);
      
      // Update form data with new accounts and total
      setFormData(prevData => ({
        ...prevData,
        savingsAccounts: updatedSavingsAccounts,
        totalEmergencySavings: newTotal
      }));

      // Update original data as well to prevent change detection issues
      setOriginalData(prevData => {
        if (!prevData) return prevData;
        const updatedOriginalAccounts = prevData.savingsAccounts.filter(account => account.id !== accountId);
        return {
          ...prevData,
          savingsAccounts: updatedOriginalAccounts,
          totalEmergencySavings: calculateTotalSavings(updatedOriginalAccounts)
        };
      });

      setSuccessMessage('Account deleted successfully!');
      setDeleteConfirmation(null);
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      setError(errorMessage);
    } finally {
      setIsDeletingAccount(null);
    }
  };

  // Save current emergency savings section only
  const handleSaveSavings = async () => {
    if (!userIdRef.current || !originalData) {
      setError('Unable to save: missing user data');
      return;
    }

    if (!hasSavingsChanges()) {
      setSuccessMessage('No changes to save in current savings section');
      return;
    }

    try {
      setIsSavingSavings(true);
      setError(null);

      // Get fresh auth token for saving
      await getAuthToken();

      // Create updated form data with recalculated total
      const updatedTotalSavings = calculateTotalSavings(formData.savingsAccounts);
      const updatedFormData = { ...formData, totalEmergencySavings: updatedTotalSavings };

      // Save using the full save method since we need to handle savings accounts
      await emergencyFundService.saveEmergencyFund(userIdRef.current, updatedFormData);
      
      // Update both form data and original data
      setFormData(updatedFormData);
      setOriginalData(JSON.parse(JSON.stringify(updatedFormData)));
      setIsEditingSavings(false);
      setSuccessMessage('Current emergency savings saved successfully!');
    } catch (error: unknown) {
      console.error('Error saving emergency savings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save emergency savings';
      setError(errorMessage);
    } finally {
      setIsSavingSavings(false);
    }
  };

  // Save emergency fund coverage section only
  const handleSaveCoverage = async () => {
    if (!userIdRef.current || !originalData) {
      setError('Unable to save: missing user data');
      return;
    }

    if (!hasCoverageChanges()) {
      setSuccessMessage('No changes to save in coverage section');
      return;
    }

    try {
      setIsSavingCoverage(true);
      setError(null);

      // Get fresh auth token for saving
      await getAuthToken();

      // Use partial update for coverage fields only
      await emergencyFundService.updateEmergencyFundPartial(
        userIdRef.current, 
        originalData, 
        formData, 
        ['monthlyEssentialExpenses', 'targetCoverageMonths']
      );
      
      // Update original data with current form data
      setOriginalData(JSON.parse(JSON.stringify(formData)));
      setIsEditingCoverage(false);
      setSuccessMessage('Emergency fund coverage saved successfully!');
    } catch (error: unknown) {
      console.error('Error saving coverage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save coverage information';
      setError(errorMessage);
    } finally {
      setIsSavingCoverage(false);
    }
  };

  // Cancel savings section editing
  const handleCancelSavingsEdit = () => {
    if (!originalData) return;
    
    // Restore original savings data
    setFormData({
      ...formData,
      savingsAccounts: [...originalData.savingsAccounts],
      totalEmergencySavings: originalData.totalEmergencySavings
    });
    setIsEditingSavings(false);
  };

  // Cancel coverage section editing
  const handleCancelCoverageEdit = () => {
    if (!originalData) return;
    
    // Restore original coverage data
    setFormData({
      ...formData,
      monthlyEssentialExpenses: originalData.monthlyEssentialExpenses,
      targetCoverageMonths: originalData.targetCoverageMonths
    });
    setIsEditingCoverage(false);
  };

  // Close error/success messages
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading emergency fund data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontSize={{xs:"24px", md:"34px"}} gutterBottom>Emergency Funds</Typography>
      
      {/* Current Savings Section */}
      <Box sx={{ mb: 4 }}>
        {isEditingSavings ? (
          <Box>
            <CurrentSavingsSection 
              savingsAccounts={formData.savingsAccounts}
              updateSavingsAccount={updateSavingsAccount}
              removeSavingsAccount={removeSavingsAccount}
              addSavingsAccount={addSavingsAccount}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="large"
                onClick={handleCancelSavingsEdit}
                disabled={isSavingSavings}
              >
                Close
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleSaveSavings}
                disabled={isSavingSavings || !hasSavingsChanges()}
              >
                {isSavingSavings ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Current Savings'
                )}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* Display current savings summary */}
            <Typography variant="h6" gutterBottom>Current Emergency Savings</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Total Emergency Savings: ${formData.totalEmergencySavings.toLocaleString()}
            </Typography>
            
            {formData.savingsAccounts.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Savings Accounts:</Typography>
                {formData.savingsAccounts.map((account, index) => (
                  <Typography key={account.id} variant="body2" sx={{ ml: 2 }}>
                    {index + 1}. {account.accountType} at {account.institution || 'N/A'}: ${account.amount.toLocaleString()}
                  </Typography>
                ))}
              </Box>
            )}
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setIsEditingSavings(true)}
              sx={{ mb: 2 }}
            >
              Edit Current Savings
            </Button>
          </Box>
        )}
      </Box>

      {/* Emergency Fund Coverage Section */}
      <Box sx={{ mb: 4 }}>
        {isEditingCoverage ? (
          <Box>
            <FundCoverageSection 
              monthlyEssentialExpenses={formData.monthlyEssentialExpenses}
              targetCoverageMonths={formData.targetCoverageMonths}
              totalSavings={calculateTotalSavings(formData.savingsAccounts)}
              handleTextFieldChange={handleTextFieldChange}
              handleSliderChange={handleSliderChange}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="large"
                onClick={handleCancelCoverageEdit}
                disabled={isSavingCoverage}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleSaveCoverage}
                disabled={isSavingCoverage || !hasCoverageChanges()}
              >
                {isSavingCoverage ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Coverage Settings'
                )}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* Display coverage summary */}
            <Typography variant="h6" gutterBottom>Emergency Fund Coverage</Typography>
            <Typography variant="body1">
              Monthly Essential Expenses: ${formData.monthlyEssentialExpenses.toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Target Coverage: {formData.targetCoverageMonths} months
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Current Coverage: {formData.monthlyEssentialExpenses > 0 
                ? (formData.totalEmergencySavings / formData.monthlyEssentialExpenses).toFixed(1) 
                : '0'} months
            </Typography>
            
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setIsEditingCoverage(true)}
            >
              Edit Coverage Settings
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <Dialog
          open={deleteConfirmation.open}
          onClose={() => setDeleteConfirmation(null)}
          aria-labelledby="delete-account-dialog-title"
        >
          <DialogTitle id="delete-account-dialog-title">
            Confirm Account Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete "{deleteConfirmation.accountName}"? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteConfirmation(null)}
              disabled={isDeletingAccount === deleteConfirmation.accountId}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleConfirmedDelete(deleteConfirmation.accountId)}
              color="error"
              variant="contained"
              disabled={isDeletingAccount === deleteConfirmation.accountId}
            >
              {isDeletingAccount === deleteConfirmation.accountId ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar 
        open={!!error || !!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmergencyFunds;