/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { UserState, IncomeSource } from '../../../../types';
import { incomeTypeOptions, stateTaxRates } from '../../../../constants/TaxConstants';

interface IncomeStatusStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const IncomeStatusStep: React.FC<IncomeStatusStepProps> = ({ userData, updateUserData }) => {
  
  // Add new income source
  const addIncomeSource = () => {
    const newId = String(userData.incomeSources.length + 1);
    updateUserData({
      ...userData,
      incomeSources: [
        ...userData.incomeSources,
        {
          id: newId,
          type: 'primary',
          amount: 0,
          description: ''
        }
      ]
    });
  };

  // Update an income source
  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: any) => {
    updateUserData({
      ...userData,
      incomeSources: userData.incomeSources.map(source => 
        source.id === id ? { ...source, [field]: value } : source
      )
    });
  };

  // Remove an income source
  const removeIncomeSource = (id: string) => {
    if (userData.incomeSources.length > 1) {
      updateUserData({
        ...userData,
        incomeSources: userData.incomeSources.filter(source => source.id !== id)
      });
    }
  };

  // Update filing status or state
  const handleFieldChange = (field: keyof UserState, value: any) => {
    updateUserData({
      ...userData,
      [field]: value
    });
  };

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Income & Filing Status</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filing Status</InputLabel>
            <Select
              value={userData.filingStatus}
              label="Filing Status"
              onChange={(e) => handleFieldChange('filingStatus', e.target.value)}
            >
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="married-joint">Married Filing Jointly</MenuItem>
              <MenuItem value="married-separate">Married Filing Separately</MenuItem>
              <MenuItem value="head-of-household">Head of Household</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              value={userData.state}
              label="State"
              onChange={(e) => handleFieldChange('state', e.target.value as string)}
            >
              {Object.keys(stateTaxRates).map((stateCode) => (
                <MenuItem key={stateCode} value={stateCode}>
                  {stateCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Dependents"
            value={userData.dependents}
            onChange={(e) => handleFieldChange('dependents', parseInt(e.target.value) || 0)}
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </Grid>
      </Grid>
      
      <Typography variant="h6" className="mt-6 mb-3">Income Sources</Typography>
      
      {userData.incomeSources.map((source) => (
        <Grid container spacing={2} key={source.id} className="mb-3 p-3 bg-gray-50 rounded">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Income Type</InputLabel>
              <Select
                value={source.type}
                label="Income Type"
                onChange={(e) => updateIncomeSource(source.id, 'type', e.target.value)}
              >
                {incomeTypeOptions.map((option) => (
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
              value={source.amount}
              onChange={(e) => updateIncomeSource(source.id, 'amount', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Description"
              value={source.description}
              onChange={(e) => updateIncomeSource(source.id, 'description', e.target.value)}
              placeholder="e.g., Job at Company ABC"
            />
          </Grid>
          
          <Grid item xs={12} md={1} className="flex items-center justify-center">
            <IconButton 
              color="error" 
              onClick={() => removeIncomeSource(source.id)}
              disabled={userData.incomeSources.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      
      <Button
        startIcon={<AddIcon />}
        onClick={addIncomeSource}
        variant="outlined"
        className="mt-2"
      >
        Add Income Source
      </Button>
    </Box>
  );
};

export default IncomeStatusStep;