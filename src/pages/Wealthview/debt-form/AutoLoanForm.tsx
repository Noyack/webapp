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
  Tooltip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AutoLoan } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'

interface AutoLoanFormProps {
  autoLoans: AutoLoan[];
  onAdd: (newAutoLoan: AutoLoan) => void;
  onUpdate: (updatedAutoLoan: AutoLoan) => void;
  onRemove: (autoLoanId: string) => void;
}

const defaultAutoLoan: AutoLoan = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0,
  originalTerm: 60, // 5 years is common default for auto loans
  isJoint: false,
  status: 'current',
  hasCollateral: true, // Auto loans generally have collateral
  collateralDescription: 'Vehicle',
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  // Auto loan specific fields that will be stored in the extra JSON field
  vehicleValue: 0,
  vehicleDescription: '',
  isLease: false,
  leaseEndDate: ''
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

function AutoLoanForm({ autoLoans, onAdd, onUpdate, onRemove }: AutoLoanFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAutoLoan, setCurrentAutoLoan] = useState<AutoLoan>({ 
    ...defaultAutoLoan,
    id: generateId()
  });

  // Helper function to safely format numeric values
  const formatRate = (rate: number): string => {
    const numRate = rate || 0;
    return numRate.toFixed(2);
  };

  // Helper function to safely format LTV ratios
  const formatLTV = (ratio: number): string => {
    return ratio.toFixed(1);
  };

  // Calculate loan-to-value ratio
  const calculateLTV = (autoLoan: AutoLoan): number => {
    if (!autoLoan.vehicleValue) return 0;
    return (autoLoan.currentBalance / autoLoan.vehicleValue) * 100;
  };

  // Check if vehicle is underwater (loan balance > value)
  const isUnderwaterLoan = (autoLoan: AutoLoan): boolean => {
    return Number(autoLoan.currentBalance) > Number(autoLoan.vehicleValue);
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentAutoLoan({
      ...currentAutoLoan,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentAutoLoan({
      ...currentAutoLoan,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentAutoLoan({
      ...currentAutoLoan,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentAutoLoan({
      ...currentAutoLoan,
      [name]: checked
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentAutoLoan({ 
      ...defaultAutoLoan,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(currentAutoLoan);
    } else {
      onAdd(currentAutoLoan);
    }
    resetForm();
  };

  // Edit auto loan
  const handleEdit = (autoLoan: AutoLoan) => {
    setCurrentAutoLoan(autoLoan);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {autoLoans.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Vehicle Value</TableCell>
                <TableCell>LTV Ratio</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {autoLoans.map((loan) => {
                const ltv = calculateLTV(loan);
                const underwater = isUnderwaterLoan(loan);
                
                return (
                <TableRow key={loan.id}>
                  <TableCell>{loan.lender}</TableCell>
                  <TableCell>{loan.vehicleDescription}</TableCell>
                  <TableCell>{formatCurrency(loan.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(loan.monthlyPayment)}</TableCell>
                  <TableCell>{formatRate(Number(loan.interestRate))}%</TableCell>
                  <TableCell>
                    <Tooltip title={underwater ? "Underwater loan: Vehicle worth less than loan balance" : ""}>
                      <Typography 
                        color={underwater ? "error" : "inherit"}
                      >
                        {formatCurrency(loan.vehicleValue)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={ltv > 100 ? "Underwater loan" : ""}>
                      <Typography 
                        color={ltv > 100 ? "error" : "inherit"}
                      >
                        {formatLTV(ltv)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(loan)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onRemove(loan.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )})}
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
          Add Auto Loan
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Auto Loan' : 'Add New Auto Loan'}
          </Typography>
          <Grid container spacing={3}>
            {/* Basic Auto Loan Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Lender/Bank Name"
                name="lender"
                value={currentAutoLoan.lender}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account # (last 4 digits)"
                name="accountLast4"
                value={currentAutoLoan.accountLast4}
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
                value={currentAutoLoan.originalAmount}
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
                value={currentAutoLoan.currentBalance}
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
                value={currentAutoLoan.interestRate}
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
                value={currentAutoLoan.monthlyPayment}
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
                value={currentAutoLoan.originalTerm}
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
                value={currentAutoLoan.remainingTerm}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Auto Loan Specific Information */}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentAutoLoan.isLease}
                    onChange={handleSwitchChange}
                    name="isLease"
                  />
                }
                label="This is a vehicle lease (not a loan)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentAutoLoan.isJoint}
                    onChange={handleSwitchChange}
                    name="isJoint"
                  />
                }
                label="Joint Debt (with spouse/partner)"
              />
            </Grid>
            
            {currentAutoLoan.isLease && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lease End Date"
                  name="leaseEndDate"
                  type="date"
                  value={currentAutoLoan.leaseEndDate}
                  onChange={handleTextChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Vehicle Description"
                name="vehicleDescription"
                value={currentAutoLoan.vehicleDescription}
                onChange={handleTextChange}
                placeholder="e.g., 2020 Honda Civic EX, Blue"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Current Vehicle Value"
                name="vehicleValue"
                type="number"
                value={currentAutoLoan.vehicleValue}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
              {currentAutoLoan.vehicleValue > 0 && currentAutoLoan.currentBalance > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" 
                    color={isUnderwaterLoan(currentAutoLoan) ? "error" : "inherit"}
                  >
                    LTV Ratio: {formatLTV(calculateLTV(currentAutoLoan))}%
                    {isUnderwaterLoan(currentAutoLoan) && " (Underwater loan)"}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Status</InputLabel>
                <Select
                  name="status"
                  value={currentAutoLoan.status}
                  onChange={handleSelectChange}
                  label="Loan Status"
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
                    checked={currentAutoLoan.hasCosigner}
                    onChange={handleSwitchChange}
                    name="hasCosigner"
                  />
                }
                label="Has Cosigner"
              />
            </Grid>
            
            {currentAutoLoan.hasCosigner && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cosigner Name"
                  name="cosignerName"
                  value={currentAutoLoan.cosignerName}
                  onChange={handleTextChange}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={currentAutoLoan.notes}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Planning to pay off early, considering refinancing, etc."
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
                  disabled={!currentAutoLoan.lender || !currentAutoLoan.vehicleDescription || !currentAutoLoan.currentBalance}
                >
                  {isEditing ? 'Update Auto Loan' : 'Add Auto Loan'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default AutoLoanForm;