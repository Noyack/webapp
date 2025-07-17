import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MortgageDebtForm from './debt-form/MortgageDebtForm';
import AutoLoanForm from './debt-form/AutoLoanForm';
import StudentLoanForm from './debt-form/StudentLoanForm';
import CreditCardDebtForm from './debt-form/CreditCardDebtForm';
import PersonalLoanForm from './debt-form/PersonalLoanForm';
import OtherDebtForm from './debt-form/OtherDebtForm';
import DebtSummary from './debt-form/DebtSummary';
import { BaseDebt, DebtProfileForm, DebtType } from '../../types';
import { formatCurrency } from '../../utils/assetsFunction';
import debtService from '../../services/debt.service';
import { UserContext } from '../../context/UserContext';

function DebtProfile() {
  // Get user info from context
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id;

  // State for the current tab
  const [currentTab, setCurrentTab] = useState<DebtType>('mortgage');
  
  // State for edit/view mode
  const [isEditing, setIsEditing] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '' as 'save' | 'cancel',
    title: '',
    message: ''
  });
  
  // Success/error message states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Initialize form data
  const [formData, setFormData] = useState<DebtProfileForm>({
    mortgages: [],
    autoLoans: [],
    studentLoans: [],
    creditCards: [],
    personalLoans: [],
    otherDebts: [],
    debtStrategy: {
      currentStrategy: 'none',
      consolidationPlans: '',
      bankruptcyHistory: false,
      debtSettlementActivities: ''
    }
  });

  // Original data to compare against for changes
  const [originalData, setOriginalData] = useState<DebtProfileForm | null>(null);

  // Load user's debt profile on component mount
  useEffect(() => {
    if (userId) {
      loadDebtProfile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Function to load debt profile from API
  const loadDebtProfile = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const profileData = await debtService.loadDebtProfile(userId);
      setFormData(profileData);
      setOriginalData(JSON.parse(JSON.stringify(profileData))); // Deep copy for comparison
      
      // Don't show success message on initial load if it's the first time
      if (snackbar.message !== '') {
        setSnackbar({
          open: true,
          message: 'Debt profile loaded successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error loading debt profile:', error);
      setSnackbar({
        open: true,
        message: 'Error loading debt profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: DebtType) => {
    setCurrentTab(newValue);
  };

  // Add a new debt item to a specific category
  const addDebtItem = <T extends BaseDebt>(category: keyof Omit<DebtProfileForm, 'debtStrategy'>, newItem: T) => {
    setFormData({
      ...formData,
      [category]: [...(formData[category] as unknown as T[]), newItem]
    });
  };

  // Remove a debt item from a specific category
  const removeDebtItem = (category: keyof Omit<DebtProfileForm, 'debtStrategy'>, itemId: string) => {
    setFormData({
      ...formData,
      [category]: (formData[category] as BaseDebt[]).filter(item => item.id !== itemId)
    });
  };

  // Update a debt item in a specific category
  const updateDebtItem = <T extends BaseDebt>(category: keyof Omit<DebtProfileForm, 'debtStrategy'>, updatedItem: T) => {
    setFormData({
      ...formData,
      [category]: (formData[category] as unknown as T[]).map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    });
  };

  // Update debt strategy information
  // const updateDebtStrategy = (strategyData: DebtProfileForm['debtStrategy']) => {
  //   setFormData({
  //     ...formData,
  //     debtStrategy: strategyData
  //   });
  // };

  // Calculate total debt
  const calculateTotalDebt = (): number => {
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    return categories.reduce((total, category) => {
      return total + (formData[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[])
        .reduce((categoryTotal, debt) => categoryTotal + Number(debt.currentBalance || 0), 0);
    }, 0);
  };

  // Calculate total monthly payments
  const calculateTotalMonthlyPayments = (): number => {
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    return categories.reduce((total, category) => {
      return total + (formData[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[])
        .reduce((categoryTotal, debt) => categoryTotal + Number(debt.monthlyPayment || 0), 0);
    }, 0);
  };

  // Check if data has changed
  const hasDataChanged = (): boolean => {
    if (!originalData) return false;
    return JSON.stringify(originalData) !== JSON.stringify(formData);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!userId) {
      setSnackbar({
        open: true,
        message: 'User ID not found. Please log in again.',
        severity: 'error'
      });
      return;
    }

    // If data hasn't changed, just exit edit mode
    if (!hasDataChanged()) {
      setIsEditing(false);
      return;
    }
    
    // Confirm before saving if there are significant changes
    if (hasDataChanged() && originalData) {
      setConfirmDialog({
        open: true,
        action: 'save',
        title: 'Save Changes?',
        message: 'Are you sure you want to save your changes to your debt profile?'
      });
      return;
    }
    
    // Otherwise proceed with saving
    await saveData();
  };

  // Function to actually save the data
  const saveData = async () => {
    if (!userId || !originalData) return;
    
    setIsLoading(true);
    try {
      // Use the improved method that only saves modified data
      await debtService.saveModifiedDebts(userId, originalData, formData);
      setIsEditing(false);
      
      // Reload the data to ensure we have the latest from the server
      await loadDebtProfile();
      
      setSnackbar({
        open: true,
        message: 'Debt profile saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving debt profile:', error);
      setSnackbar({
        open: true,
        message: 'Error saving debt profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog confirmation
  const handleDialogConfirm = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
    
    if (confirmDialog.action === 'save') {
      saveData();
    } else if (confirmDialog.action === 'cancel') {
      // Restore original data and exit edit mode
      if (originalData) {
        setFormData(JSON.parse(JSON.stringify(originalData)));
      }
      setIsEditing(false);
    }
  };

  // Handle dialog cancellation
  const handleDialogCancel = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Handle cancel button click
  const handleCancel = () => {
    // If data has changed, confirm before discarding
    if (hasDataChanged()) {
      setConfirmDialog({
        open: true,
        action: 'cancel',
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?'
      });
    } else {
      // No changes, just exit edit mode
      setIsEditing(false);
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ p: {xs:0, md:3} }}>
      <Typography variant="h4" fontSize={{xs:"24px", md:"34px"}} gutterBottom>Debt Profile</Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : isEditing ? (
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange} 
                aria-label="debt categories"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Mortgages" value="mortgage" />
                <Tab label="Auto Loans" value="auto" />
                <Tab label="Student Loans" value="student" />
                <Tab label="Credit Cards" value="creditCard" />
                <Tab label="Personal Loans" value="personal" />
                <Tab label="Other Debts" value="other" />
              </Tabs>
            </Box>

            {/* Mortgage Form */}
            {currentTab === 'mortgage' && (
              <MortgageDebtForm 
                mortgages={formData.mortgages}
                onAdd={(newMortgage) => addDebtItem('mortgages', newMortgage)}
                onUpdate={(updatedMortgage) => updateDebtItem('mortgages', updatedMortgage)}
                onRemove={(mortgageId) => removeDebtItem('mortgages', mortgageId)}
              />
            )}

            {/* Auto Loan Form */}
            {currentTab === 'auto' && (
              <AutoLoanForm 
                autoLoans={formData.autoLoans}
                onAdd={(newAutoLoan) => addDebtItem('autoLoans', newAutoLoan)}
                onUpdate={(updatedAutoLoan) => updateDebtItem('autoLoans', updatedAutoLoan)}
                onRemove={(autoLoanId) => removeDebtItem('autoLoans', autoLoanId)}
              />
            )}

            {/* Student Loan Form */}
            {currentTab === 'student' && (
              <StudentLoanForm 
                studentLoans={formData.studentLoans}
                onAdd={(newStudentLoan) => addDebtItem('studentLoans', newStudentLoan)}
                onUpdate={(updatedStudentLoan) => updateDebtItem('studentLoans', updatedStudentLoan)}
                onRemove={(studentLoanId) => removeDebtItem('studentLoans', studentLoanId)}
              />
            )}

            {/* Credit Card Form */}
            {currentTab === 'creditCard' && (
              <CreditCardDebtForm 
                creditCards={formData.creditCards}
                onAdd={(newCreditCard) => addDebtItem('creditCards', newCreditCard)}
                onUpdate={(updatedCreditCard) => updateDebtItem('creditCards', updatedCreditCard)}
                onRemove={(creditCardId) => removeDebtItem('creditCards', creditCardId)}
              />
            )}

            {/* Personal Loan Form */}
            {currentTab === 'personal' && (
              <PersonalLoanForm 
                personalLoans={formData.personalLoans}
                onAdd={(newPersonalLoan) => addDebtItem('personalLoans', newPersonalLoan)}
                onUpdate={(updatedPersonalLoan) => updateDebtItem('personalLoans', updatedPersonalLoan)}
                onRemove={(personalLoanId) => removeDebtItem('personalLoans', personalLoanId)}
              />
            )}

            {/* Other Debt Form */}
            {currentTab === 'other' && (
              <OtherDebtForm 
                otherDebts={formData.otherDebts}
                onAdd={(newOtherDebt) => addDebtItem('otherDebts', newOtherDebt)}
                onUpdate={(updatedOtherDebt) => updateDebtItem('otherDebts', updatedOtherDebt)}
                onRemove={(otherDebtId) => removeDebtItem('otherDebts', otherDebtId)}
              />
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Typography variant="h6">
              Total Debt: {formatCurrency(calculateTotalDebt())}
              <Typography component="span" variant="body1" sx={{ ml: 2 }}>
                Monthly Payments: {formatCurrency(calculateTotalMonthlyPayments())}
              </Typography>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={isLoading || !hasDataChanged()}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Save Debt Profile'}
              </Button>
            </Box>
          </Box>
        </form>
      ) : (
        <DebtSummary 
          debtProfile={formData} 
          onEdit={() => setIsEditing(true)}
          totalDebt={calculateTotalDebt()}
          totalMonthlyPayment={calculateTotalMonthlyPayments()}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleDialogCancel}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>No</Button>
          <Button onClick={handleDialogConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DebtProfile;