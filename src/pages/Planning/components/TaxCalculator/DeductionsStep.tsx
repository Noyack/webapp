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
  FormControlLabel,
  Checkbox,
  Tooltip,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { UserState, Deduction } from '../../../../types';
import { deductionTypeOptions, standardDeduction } from '../../../../constants/TaxConstants';

interface DeductionsStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ userData, updateUserData }) => {
  
  // Toggle itemized deductions
  const toggleItemizedDeductions = (value: boolean) => {
    updateUserData({
      ...userData,
      useItemizedDeductions: value
    });
  };

  // Add new deduction
  const addDeduction = () => {
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

  // Update a deduction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDeduction = (id: string, field: keyof Deduction, value: any) => {
    updateUserData({
      ...userData,
      deductions: userData.deductions.map(deduction => 
        deduction.id === id ? { ...deduction, [field]: value } : deduction
      )
    });
  };

  // Remove a deduction
  const removeDeduction = (id: string) => {
    updateUserData({
      ...userData,
      deductions: userData.deductions.filter(deduction => deduction.id !== id)
    });
  };

  // Calculate total itemized deductions
  const totalItemizedDeductions = userData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Tax Deductions</Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={userData.useItemizedDeductions}
            onChange={(e) => toggleItemizedDeductions(e.target.checked)}
          />
        }
        label={
          <Box className="flex items-center">
            <Typography>Itemize deductions instead of using standard deduction</Typography>
            <Tooltip title={`Standard deduction for ${userData.filingStatus.replace('-', ' ')}: $${standardDeduction[userData.filingStatus].toLocaleString()}`}>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        }
        className="mb-4"
      />
      
      {userData.useItemizedDeductions && (
        <>
          {userData.deductions.map((deduction) => (
            <Grid container spacing={2} key={deduction.id} className="mb-3 p-3 bg-gray-50 rounded">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Deduction Type</InputLabel>
                  <Select
                    value={deduction.type}
                    label="Deduction Type"
                    onChange={(e) => updateDeduction(deduction.id, 'type', e.target.value)}
                  >
                    {deductionTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
                  onChange={(e) => updateDeduction(deduction.id, 'amount', parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => updateDeduction(deduction.id, 'description', e.target.value)}
                  placeholder="e.g., Mortgage Interest on Primary Home"
                />
              </Grid>
              
              <Grid item xs={12} md={1} className="flex items-center justify-center">
                <IconButton 
                  color="error" 
                  onClick={() => removeDeduction(deduction.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addDeduction}
            variant="outlined"
            className="mt-2"
          >
            Add Deduction
          </Button>
          
          <Box className="mt-4 p-3 bg-blue-50 rounded">
            <Typography variant="subtitle2" className="flex items-center">
              <InfoIcon fontSize="small" className="mr-1" />
              Total Itemized Deductions: ${totalItemizedDeductions.toLocaleString()}
            </Typography>
            {totalItemizedDeductions < standardDeduction[userData.filingStatus] && (
              <Typography variant="body2" color="error" className="mt-1">
                Your itemized deductions are less than the standard deduction of ${standardDeduction[userData.filingStatus].toLocaleString()}.
                You may want to use the standard deduction instead.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default DeductionsStep;