import React, { useState } from 'react';
import { 
  Typography, 
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
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



// Helper function to create a unique ID

// Helper function to format currency


function DebtProfile() {
  // State for the current tab
  const [currentTab, setCurrentTab] = useState<DebtType>('mortgage');
  
  // State for edit/view mode
  const [isEditing, setIsEditing] = useState(false);
  
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
//   const updateDebtStrategy = (strategyData: DebtProfileForm['debtStrategy']) => {
//     setFormData({
//       ...formData,
//       debtStrategy: strategyData
//     });
//   };

  // Calculate total debt
  const calculateTotalDebt = (): number => {
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    return categories.reduce((total, category) => {
      return total + (formData[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[])
        .reduce((categoryTotal, debt) => categoryTotal + debt.currentBalance, 0);
    }, 0);
  };

  // Calculate total monthly payments
  const calculateTotalMonthlyPayments = (): number => {
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    return categories.reduce((total, category) => {
      return total + (formData[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[])
        .reduce((categoryTotal, debt) => categoryTotal + debt.monthlyPayment, 0);
    }, 0);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
    // Here you would typically save the data or pass it to parent components
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Debt Profile</Typography>
      
      {isEditing ? (
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
            <Button type="submit" variant="contained" color="primary" size="large">
              Save Debt Profile
            </Button>
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
    </Box>
  );
}

export default DebtProfile;