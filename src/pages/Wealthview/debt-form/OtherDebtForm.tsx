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
  Chip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { OtherDebt } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'

interface OtherDebtFormProps {
  otherDebts: OtherDebt[];
  onAdd: (newOtherDebt: OtherDebt) => void;
  onUpdate: (updatedOtherDebt: OtherDebt) => void;
  onRemove: (otherDebtId: string) => void;
}

const defaultOtherDebt: OtherDebt = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0,
  originalTerm: 12, // 1 year default, but varies widely
  isJoint: false,
  status: 'current',
  hasCollateral: false,
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  debtType: 'other',
  specificType: '',
  paymentPlan: '',
  specialTerms: ''
};

const debtStatusOptions = [
  { value: 'current', label: 'Current' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'in_grace_period', label: 'In Grace' },
  { value: 'delinquent', label: 'Delinquent' },
  { value: 'in_collection', label: 'In Collection' },
  { value: 'default', label: 'In Default' },
  { value: 'paid_off', label: 'Paid Off' }
];

const debtTypeOptions = [
  { value: 'homeEquity', label: 'Home Equity Loan/HELOC' },
  { value: 'business', label: 'Business Loan' },
  { value: 'family', label: 'Family/Private Loan' },
  { value: 'medical', label: 'Medical Debt' },
  { value: 'tax', label: 'Tax Debt' },
  { value: 'other', label: 'Other' }
];

function OtherDebtForm({ otherDebts, onAdd, onUpdate, onRemove }: OtherDebtFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOtherDebt, setCurrentOtherDebt] = useState<OtherDebt>({ 
    ...defaultOtherDebt,
    id: generateId()
  });

  // Helper function to safely format numeric values
  const formatRate = (rate: number): string => {
    const numRate = rate || 0;
    return numRate.toFixed(2);
  };

  // Get custom label based on debt type
  const getLenderLabel = (debtType: string): string => {
    switch (debtType) {
      case 'family': return 'Lender (Person/Family Member)';
      case 'medical': return 'Medical Provider/Collection Agency';
      case 'tax': return 'Tax Authority (IRS, State, etc.)';
      case 'business': return 'Business Lender/Bank';
      case 'homeEquity': return 'HELOC/Home Equity Lender';
      default: return 'Lender/Creditor';
    }
  };

  // Helper to safely get option label
  const getOptionLabel = (options: Array<{value: string, label: string}>, value: string): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentOtherDebt({
      ...currentOtherDebt,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentOtherDebt({
      ...currentOtherDebt,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentOtherDebt({
      ...currentOtherDebt,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentOtherDebt({
      ...currentOtherDebt,
      [name]: checked
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentOtherDebt({ 
      ...defaultOtherDebt,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(currentOtherDebt);
    } else {
      onAdd(currentOtherDebt);
    }
    resetForm();
  };

  // Edit other debt
  const handleEdit = (otherDebt: OtherDebt) => {
    setCurrentOtherDebt(otherDebt);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {otherDebts.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Lender/Creditor</TableCell>
                <TableCell>Current Balance</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Collateral</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {otherDebts.map((debt) => (
                <TableRow key={debt.id}>
                  <TableCell>
                    <Chip 
                      label={getOptionLabel(debtTypeOptions, debt.debtType)} 
                      color="primary" 
                      size="small"
                    />
                    {debt.debtType === 'other' && debt.specificType && (
                      <Typography variant="caption" display="block">
                        {debt.specificType}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{debt.lender}</TableCell>
                  <TableCell>{formatCurrency(debt.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(debt.monthlyPayment)}</TableCell>
                  <TableCell>{Number(debt.interestRate) > 0 ? `${formatRate(Number(debt.interestRate))}%` : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={debt.status.charAt(0).toUpperCase() + debt.status.slice(1).replace(/([A-Z])/g, ' $1')} 
                      color={
                        debt.status === 'current' ? 'success' : 
                        debt.status === 'past_due' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{debt.hasCollateral ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(debt)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onRemove(debt.id)}>
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
          Add Other Debt
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Other Debt' : 'Add New Debt'}
          </Typography>
          <Grid container spacing={3}>
            {/* Debt Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Debt Type</InputLabel>
                <Select
                  name="debtType"
                  value={currentOtherDebt.debtType}
                  onChange={handleSelectChange}
                  label="Debt Type"
                >
                  {debtTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {currentOtherDebt.debtType === 'other' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specify Debt Type"
                  name="specificType"
                  value={currentOtherDebt.specificType}
                  onChange={handleTextChange}
                  placeholder="e.g., Payday loan, Legal settlement, etc."
                />
              </Grid>
            )}

            {/* Basic Debt Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label={getLenderLabel(currentOtherDebt.debtType)}
                name="lender"
                value={currentOtherDebt.lender}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account # (last 4 digits)"
                name="accountLast4"
                value={currentOtherDebt.accountLast4}
                onChange={handleTextChange}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Current Balance"
                name="currentBalance"
                type="number"
                value={currentOtherDebt.currentBalance}
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
                label="Monthly Payment"
                name="monthlyPayment"
                type="number"
                value={currentOtherDebt.monthlyPayment}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            
            {/* Interest rate might not apply to all debt types */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interest Rate (if applicable)"
                name="interestRate"
                type="number"
                value={currentOtherDebt.interestRate}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>
                }}
              />
            </Grid>
            
            {/* Term information might not apply to all debt types */}
            {(currentOtherDebt.debtType !== 'medical' && currentOtherDebt.debtType !== 'tax') && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Original Term (months)"
                    name="originalTerm"
                    type="number"
                    value={currentOtherDebt.originalTerm}
                    onChange={handleNumberChange}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </>
            )}

            {/* Payment Plan - especially relevant for tax and medical debt */}
            {(currentOtherDebt.debtType === 'medical' || currentOtherDebt.debtType === 'tax') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Plan Details"
                  name="paymentPlan"
                  value={currentOtherDebt.paymentPlan}
                  onChange={handleTextChange}
                  multiline
                  rows={2}
                  placeholder="e.g., IRS installment agreement, Hospital payment plan terms"
                />
              </Grid>
            )}
            
            {/* Special terms for different debt types */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Terms or Conditions"
                name="specialTerms"
                value={currentOtherDebt.specialTerms}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Draw period ends in 2026 (for HELOC), Penalties for late payment"
              />
            </Grid>

            {/* Common debt attributes */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentOtherDebt.hasCollateral}
                    onChange={handleSwitchChange}
                    name="hasCollateral"
                  />
                }
                label="Has Collateral"
              />
            </Grid>
            
            {currentOtherDebt.hasCollateral && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Collateral Description"
                  name="collateralDescription"
                  value={currentOtherDebt.collateralDescription || ''}
                  onChange={handleTextChange}
                  placeholder="e.g., Home equity, Business assets, etc."
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentOtherDebt.isJoint}
                    onChange={handleSwitchChange}
                    name="isJoint"
                  />
                }
                label="Joint Debt"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentOtherDebt.hasCosigner}
                    onChange={handleSwitchChange}
                    name="hasCosigner"
                  />
                }
                label="Has Cosigner"
              />
            </Grid>
            
            {currentOtherDebt.hasCosigner && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cosigner Name"
                  name="cosignerName"
                  value={currentOtherDebt.cosignerName}
                  onChange={handleTextChange}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Debt Status</InputLabel>
                <Select
                  name="status"
                  value={currentOtherDebt.status}
                  onChange={handleSelectChange}
                  label="Debt Status"
                >
                  {debtStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={currentOtherDebt.notes}
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
                  disabled={!currentOtherDebt.lender || !currentOtherDebt.currentBalance}
                >
                  {isEditing ? 'Update Debt' : 'Add Debt'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default OtherDebtForm;