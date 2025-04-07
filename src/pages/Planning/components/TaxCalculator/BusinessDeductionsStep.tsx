import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
  Alert,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { UserState, Deduction } from '../../../../types';

interface BusinessDeductionsStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const BusinessDeductionsStep: React.FC<BusinessDeductionsStepProps> = ({ userData, updateUserData }) => {
  
  // Add new business deduction
  const addBusinessDeduction = () => {
    const newId = String(userData.deductions.length + 1);
    updateUserData({
      ...userData,
      deductions: [
        ...userData.deductions,
        {
          id: newId,
          type: 'other',
          amount: 0,
          description: ''
        }
      ]
    });
  };

  // Update a business deduction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBusinessDeduction = (id: string, field: keyof Deduction, value: any) => {
    updateUserData({
      ...userData,
      deductions: userData.deductions.map(deduction => 
        deduction.id === id ? { ...deduction, [field]: value } : deduction
      )
    });
  };

  // Remove a business deduction
  const removeBusinessDeduction = (id: string) => {
    updateUserData({
      ...userData,
      deductions: userData.deductions.filter(deduction => deduction.id !== id)
    });
  };

  // Business expense types
  const businessExpenseTypes = [
    { value: 'other', label: 'Office Supplies' },
    { value: 'other', label: 'Home Office' },
    { value: 'other', label: 'Business Travel' },
    { value: 'other', label: 'Professional Services' },
    { value: 'other', label: 'Business Insurance' },
    { value: 'other', label: 'Business Vehicle' },
    { value: 'other', label: 'Other Business Expense' }
  ];

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Business Expenses & Deductions</Typography>
      
      <Alert severity="info" className="mb-4">
        Self-employed individuals can deduct business expenses from their self-employment income.
        These are separate from personal itemized deductions.
      </Alert>
      
      {userData.deductions.map((deduction) => (
        <Grid container spacing={2} key={deduction.id} className="mb-3 p-3 bg-gray-50 rounded">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Expense Type</InputLabel>
              <Select
                value={deduction.type}
                label="Expense Type"
                onChange={(e) => updateBusinessDeduction(deduction.id, 'type', e.target.value)}
              >
                {businessExpenseTypes.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Annual Amount"
              type="number"
              value={deduction.amount}
              onChange={(e) => updateBusinessDeduction(deduction.id, 'amount', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Description"
              value={deduction.description}
              onChange={(e) => updateBusinessDeduction(deduction.id, 'description', e.target.value)}
              placeholder="e.g., Subscription to design software"
            />
          </Grid>
          
          <Grid item xs={12} md={1} className="flex items-center justify-center">
            <IconButton 
              color="error" 
              onClick={() => removeBusinessDeduction(deduction.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      
      <Button
        startIcon={<AddIcon />}
        onClick={addBusinessDeduction}
        variant="outlined"
        className="mt-2"
      >
        Add Business Expense
      </Button>
      
      <Box className="mt-6 p-4 bg-gray-50 rounded">
        <Typography variant="subtitle1" className="mb-2">Self-Employment Tax Considerations</Typography>
        <Typography variant="body2">
          Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) on net self-employment income.
          However, you can deduct 50% of your self-employment tax on your tax return.
        </Typography>
      </Box>
    </Box>
  );
};

export default BusinessDeductionsStep;