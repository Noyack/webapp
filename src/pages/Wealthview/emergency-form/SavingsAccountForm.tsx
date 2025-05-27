// src/components/EmergencyFunds/CurrentSavings/SavingsAccountForm.tsx
import React from 'react';
import { 
  Typography, 
  TextField,
  FormControl, 
  InputLabel, 
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  SelectChangeEvent
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { EmergencySavingsAccount, ACCOUNT_TYPE_OPTIONS, LIQUIDITY_PERIOD_OPTIONS } from '../../../types';

interface SavingsAccountFormProps {
  account: EmergencySavingsAccount;
  onChange: (updatedAccount: EmergencySavingsAccount) => void;
  onDelete: () => void;
}

const SavingsAccountForm: React.FC<SavingsAccountFormProps> = ({ account, onChange, onDelete }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange({
      ...account,
      [name]: name === "amount" || name === "interestRate" ? Number(value) : value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    onChange({
      ...account,
      [name]: value
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="accountType"
              value={account.accountType}
              onChange={handleSelectChange}
              label="Account Type"
            >
              {ACCOUNT_TYPE_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Financial Institution"
            name="institution"
            value={account.institution}
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            name="amount"
            value={account.amount}
            onChange={handleTextChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Interest Rate"
            type="number"
            name="interestRate"
            value={account.interestRate}
            onChange={handleTextChange}
            InputProps={{ 
              inputProps: { min: 0, step: 0.01, max: 100 },
              endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Accessibility</InputLabel>
            <Select
              name="liquidityPeriod"
              value={account.liquidityPeriod}
              onChange={handleSelectChange}
              label="Accessibility"
            >
              {LIQUIDITY_PERIOD_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Remove Account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SavingsAccountForm;