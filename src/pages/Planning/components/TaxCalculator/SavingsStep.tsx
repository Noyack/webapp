import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import { UserState } from '../../../../types';

interface SavingsStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const SavingsStep: React.FC<SavingsStepProps> = ({ userData, updateUserData }) => {
  
  // Update savings data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSavingsChange = (field: keyof UserState, value: any) => {
    updateUserData({
      ...userData,
      [field]: value
    });
  };

  // Calculate emergency fund coverage in months
  const emergencyFundCoverage = userData.monthlyExpenses > 0 
    ? userData.emergencyFund / userData.monthlyExpenses 
    : 0;

  // Calculate savings rate
  const totalIncome = userData.incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const totalSavings = Object.values(userData.taxAdvantaged).reduce(
    (sum, account) => sum + account.contribution, 0
  );
  const savingsRate = totalIncome > 0 
    ? (totalSavings / totalIncome) * 100 
    : 0;

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Savings & Financial Health</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Monthly Expenses"
            type="number"
            value={userData.monthlyExpenses}
            onChange={(e) => handleSavingsChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Fund Balance"
            type="number"
            value={userData.emergencyFund}
            onChange={(e) => handleSavingsChange('emergencyFund', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
      
      <Box className="mt-6 p-4 bg-gray-50 rounded">
        <Typography variant="subtitle1" className="mb-2">Financial Health Indicators</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" className="flex justify-between">
              <span>Emergency Fund Coverage:</span>
              <span className="font-medium">
                {userData.monthlyExpenses > 0 
                  ? `${emergencyFundCoverage.toFixed(1)} months` 
                  : 'N/A'}
              </span>
            </Typography>
            
            {userData.monthlyExpenses > 0 && (
              <LinearProgress 
                variant="determinate" 
                value={Math.min((emergencyFundCoverage / 6) * 100, 100)} 
                className="mt-1"
                color={emergencyFundCoverage >= 3 ? "success" : "warning"}
              />
            )}
            
            <Typography variant="caption" color="textSecondary">
              Recommended: 3-6 months of expenses
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" className="flex justify-between">
              <span>Annual Savings Rate:</span>
              <span className="font-medium">
                {totalIncome > 0 
                  ? `${savingsRate.toFixed(1)}%` 
                  : 'N/A'}
              </span>
            </Typography>
            
            {totalIncome > 0 && (
              <LinearProgress 
                variant="determinate" 
                value={Math.min((savingsRate / 20) * 100, 100)} 
                className="mt-1"
                color={savingsRate >= 15 ? "success" : "warning"}
              />
            )}
            
            <Typography variant="caption" color="textSecondary">
              Recommended: 15-20% of gross income
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SavingsStep;