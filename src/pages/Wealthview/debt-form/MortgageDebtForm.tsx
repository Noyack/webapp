import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormControlLabel,
  Switch,
  Button,
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Mortgage } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'


interface MortgageDebtFormProps {
  mortgages: Mortgage[];
  onAdd: (newMortgage: Mortgage) => void;
  onUpdate: (updatedMortgage: Mortgage) => void;
  onRemove: (mortgageId: string) => void;
}

const defaultMortgage: Mortgage = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0,
  originalTerm: 360, // 30 years is common default
  isJoint: false,
  status: 'current',
  hasCollateral: true, // Mortgages generally have collateral
  collateralDescription: 'Property',
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  // Mortgage specific fields that will be stored in the extra JSON field
  propertyValue: 0,
  mortgageType: 'conventional',
  propertyAddress: '',
  isVariableRate: false,
  rateAdjustmentDetails: '',
  refinancePlans: ''
};

const mortgageTypeOptions = [
  { value: 'conventional', label: 'Conventional' },
  { value: 'fha', label: 'FHA' },
  { value: 'va', label: 'VA' },
  { value: 'interestOnly', label: 'Interest-Only' },
  { value: 'adjustableRate', label: 'Adjustable Rate (ARM)' },
  { value: 'other', label: 'Other' }
];

const debtStatusOptions = [
  { value: 'current', label: 'Current' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'in_grace_period', label: 'In Grace' },
  { value: 'delinquent', label: 'Delinquent' },
  { value: 'in_collection', label: 'In Collection' },
  { value: 'default', label: 'In Default' },
  { value: 'paid_off', label: 'Paid Off' }
];

function MortgageDebtForm({ mortgages, onAdd, onUpdate, onRemove }: MortgageDebtFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMortgage, setCurrentMortgage] = useState<Mortgage>({ 
    ...defaultMortgage,
    id: generateId()
  });

  // Helper function to safely format numeric values
  const formatRate = (rate: number): string => {
    const numRate = Number(rate) || 0;
    return numRate.toFixed(2);
  };

  // Helper function to calculate remaining term display
  const formatRemainingTerm = (months: number): string => {
    const numMonths = Number(months) || 0;
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths % 12;
    return `${years} years, ${remainingMonths} months`;
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentMortgage({
      ...currentMortgage,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentMortgage({
      ...currentMortgage,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentMortgage({
      ...currentMortgage,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentMortgage({
      ...currentMortgage,
      [name]: checked
    });
  };

  // Calculate loan-to-value ratio
  const calculateLTV = (mortgage: Mortgage): number => {
    if (!mortgage.propertyValue) return 0;
    return (mortgage.currentBalance / mortgage.propertyValue) * 100;
  };

  // Format LTV as a string with one decimal place
  const formatLTV = (ltv: number): string => {
    return ltv.toFixed(1);
  };

  // Reset form
  const resetForm = () => {
    setCurrentMortgage({ 
      ...defaultMortgage,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(currentMortgage);
    } else {
      onAdd(currentMortgage);
    }
    resetForm();
  };

  // Edit mortgage
  const handleEdit = (mortgage: Mortgage) => {
    setCurrentMortgage(mortgage);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {mortgages.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lender</TableCell>
                <TableCell>Property Address</TableCell>
                <TableCell>Current Balance</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Remaining Term</TableCell>
                <TableCell>LTV Ratio</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mortgages.map((mortgage) => (
                <TableRow key={mortgage.id}>
                  <TableCell>{mortgage.lender}</TableCell>
                  <TableCell>{mortgage.propertyAddress}</TableCell>
                  <TableCell>{formatCurrency(mortgage.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(mortgage.monthlyPayment)}</TableCell>
                  <TableCell>{formatRate(Number(mortgage.interestRate))}%</TableCell>
                  <TableCell>{formatRemainingTerm(mortgage.remainingTerm)}</TableCell>
                  <TableCell>{formatLTV(calculateLTV(mortgage))}%</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(mortgage)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onRemove(mortgage.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isAdding ? (
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={() => setIsAdding(true)}
          sx={{ mb: 2 }}
        >
          Add Mortgage
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Mortgage' : 'Add New Mortgage'}
          </Typography>
          <Grid container spacing={3}>
            {/* Basic Mortgage Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Lender/Bank Name"
                name="lender"
                value={currentMortgage.lender}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account # (last 4 digits)"
                name="accountLast4"
                value={currentMortgage.accountLast4}
                onChange={handleTextChange}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Original Loan Amount"
                name="originalAmount"
                type="number"
                value={currentMortgage.originalAmount}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Current Balance"
                name="currentBalance"
                type="number"
                value={currentMortgage.currentBalance}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Interest Rate"
                name="interestRate"
                type="number"
                value={currentMortgage.interestRate}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Monthly Payment"
                name="monthlyPayment"
                type="number"
                value={currentMortgage.monthlyPayment}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Original Term (months)"
                name="originalTerm"
                type="number"
                value={currentMortgage.originalTerm}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Remaining Term (months)"
                name="remainingTerm"
                type="number"
                value={currentMortgage.remainingTerm}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Mortgage Specific Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Current Property Value"
                name="propertyValue"
                type="number"
                value={currentMortgage.propertyValue}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Mortgage Type</InputLabel>
                <Select
                  name="mortgageType"
                  value={currentMortgage.mortgageType}
                  onChange={handleSelectChange}
                  label="Mortgage Type"
                >
                  {mortgageTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Property Address"
                name="propertyAddress"
                value={currentMortgage.propertyAddress}
                onChange={handleTextChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentMortgage.isVariableRate}
                    onChange={handleSwitchChange}
                    name="isVariableRate"
                  />
                }
                label="Variable Interest Rate"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentMortgage.isJoint}
                    onChange={handleSwitchChange}
                    name="isJoint"
                  />
                }
                label="Joint Debt (with spouse/partner)"
              />
            </Grid>
            
            {currentMortgage.isVariableRate && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rate Adjustment Details"
                  name="rateAdjustmentDetails"
                  value={currentMortgage.rateAdjustmentDetails}
                  onChange={handleTextChange}
                  placeholder="e.g., Adjusts annually, capped at 8%"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Debt Status</InputLabel>
                <Select
                  name="status"
                  value={currentMortgage.status}
                  onChange={handleSelectChange}
                  label="Debt Status"
                >
                  {debtStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentMortgage.hasCosigner}
                    onChange={handleSwitchChange}
                    name="hasCosigner"
                  />
                }
                label="Has Cosigner"
              />
            </Grid>
            
            {currentMortgage.hasCosigner && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cosigner Name"
                  name="cosignerName"
                  value={currentMortgage.cosignerName}
                  onChange={handleTextChange}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Refinancing Plans or Goals"
                name="refinancePlans"
                value={currentMortgage.refinancePlans}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Planning to refinance in 2 years if rates drop below 4%"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={currentMortgage.notes}
                onChange={handleTextChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                  disabled={!currentMortgage.lender || !currentMortgage.currentBalance || !currentMortgage.monthlyPayment}
                >
                  {isEditing ? 'Update Mortgage' : 'Add Mortgage'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default MortgageDebtForm;