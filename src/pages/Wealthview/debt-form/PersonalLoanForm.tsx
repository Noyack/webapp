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
import { PersonalLoan } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'


interface PersonalLoanFormProps {
  personalLoans: PersonalLoan[];
  onAdd: (newPersonalLoan: PersonalLoan) => void;
  onUpdate: (updatedPersonalLoan: PersonalLoan) => void;
  onRemove: (personalLoanId: string) => void;
}

const defaultPersonalLoan: PersonalLoan = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0,
  originalTerm: 36, // 3 years is common default for personal loans
  isJoint: false,
  status: 'current',
  hasCollateral: false, // Most personal loans are unsecured
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  purpose: '',
  isSecured: false
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

const purposeOptions = [
  "Debt consolidation",
  "Home improvement",
  "Major purchase",
  "Medical expenses",
  "Wedding expenses",
  "Vacation/Travel",
  "Moving/Relocation",
  "Business",
  "Education",
  "Emergency expenses",
  "Other"
];

function PersonalLoanForm({ personalLoans, onAdd, onUpdate, onRemove }: PersonalLoanFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPersonalLoan, setCurrentPersonalLoan] = useState<PersonalLoan>({ 
    ...defaultPersonalLoan,
    id: generateId()
  });

  // Helper function to safely format numeric values
  const formatRate = (rate: number): string => {
    const numRate = rate || 0;
    return numRate.toFixed(2);
  };

  // Helper function to safely format remaining term
  const formatRemainingTerm = (months: number): string => {
    const numMonths = months || 0;
    const years = Math.floor(numMonths / 12);
    const remainingMonths = numMonths % 12;
    return `${years} years, ${remainingMonths} months`;
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentPersonalLoan({
      ...currentPersonalLoan,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentPersonalLoan({
      ...currentPersonalLoan,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentPersonalLoan({
      ...currentPersonalLoan,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentPersonalLoan({
      ...currentPersonalLoan,
      [name]: checked
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentPersonalLoan({ 
      ...defaultPersonalLoan,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(currentPersonalLoan);
    } else {
      onAdd(currentPersonalLoan);
    }
    resetForm();
  };

  // Edit personal loan
  const handleEdit = (personalLoan: PersonalLoan) => {
    setCurrentPersonalLoan(personalLoan);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {personalLoans.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lender</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Current Balance</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Remaining Term</TableCell>
                <TableCell>Secured</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personalLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.lender}</TableCell>
                  <TableCell>{loan.purpose}</TableCell>
                  <TableCell>{formatCurrency(loan.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(loan.monthlyPayment)}</TableCell>
                  <TableCell>{formatRate(Number(loan.interestRate))}%</TableCell>
                  <TableCell>{formatRemainingTerm(Number(loan.remainingTerm))}</TableCell>
                  <TableCell>
                    {loan.isSecured ? (
                      <Chip label="Secured" color="primary" size="small" />
                    ) : (
                      <Chip label="Unsecured" size="small" />
                    )}
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
          Add Personal Loan
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Personal Loan' : 'Add New Personal Loan'}
          </Typography>
          <Grid container spacing={3}>
            {/* Basic Personal Loan Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Lender/Bank Name"
                name="lender"
                value={currentPersonalLoan.lender}
                onChange={handleTextChange}
                placeholder="e.g., SoFi, LendingClub, Bank of America"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account # (last 4 digits)"
                name="accountLast4"
                value={currentPersonalLoan.accountLast4}
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
                value={currentPersonalLoan.originalAmount}
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
                value={currentPersonalLoan.currentBalance}
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
                value={currentPersonalLoan.interestRate}
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
                value={currentPersonalLoan.monthlyPayment}
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
                value={currentPersonalLoan.originalTerm}
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
                value={currentPersonalLoan.remainingTerm}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Personal Loan Specific Information */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Purpose</InputLabel>
                <Select
                  name="purpose"
                  value={currentPersonalLoan.purpose}
                  onChange={handleSelectChange}
                  label="Loan Purpose"
                >
                  {purposeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentPersonalLoan.isSecured}
                    onChange={handleSwitchChange}
                    name="isSecured"
                  />
                }
                label="Secured Loan (has collateral)"
              />
            </Grid>

            {currentPersonalLoan.isSecured && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Collateral Description"
                  name="collateralDescription"
                  value={currentPersonalLoan.collateralDescription || ''}
                  onChange={handleTextChange}
                  placeholder="e.g., Certificate of Deposit, Savings Account, Vehicle"
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentPersonalLoan.isJoint}
                    onChange={handleSwitchChange}
                    name="isJoint"
                  />
                }
                label="Joint Loan (with spouse/partner)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentPersonalLoan.hasCosigner}
                    onChange={handleSwitchChange}
                    name="hasCosigner"
                  />
                }
                label="Has Cosigner"
              />
            </Grid>
            
            {currentPersonalLoan.hasCosigner && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cosigner Name"
                  name="cosignerName"
                  value={currentPersonalLoan.cosignerName}
                  onChange={handleTextChange}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Status</InputLabel>
                <Select
                  name="status"
                  value={currentPersonalLoan.status}
                  onChange={handleSelectChange}
                  label="Loan Status"
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
                value={currentPersonalLoan.notes}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Prepayment penalties, special terms, etc."
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
                  disabled={!currentPersonalLoan.lender || !currentPersonalLoan.currentBalance || !currentPersonalLoan.purpose}
                >
                  {isEditing ? 'Update Personal Loan' : 'Add Personal Loan'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default PersonalLoanForm;