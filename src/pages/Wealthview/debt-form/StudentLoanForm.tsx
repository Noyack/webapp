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
import { StudentLoan } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'

interface StudentLoanFormProps {
  studentLoans: StudentLoan[];
  onAdd: (newStudentLoan: StudentLoan) => void;
  onUpdate: (updatedStudentLoan: StudentLoan) => void;
  onRemove: (studentLoanId: string) => void;
}

const defaultStudentLoan: StudentLoan = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0,
  originalTerm: 120, // 10 years is common default for student loans
  isJoint: false,
  status: 'current',
  hasCollateral: false, // Student loans generally don't have collateral
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  // Student loan specific fields that will be stored in the extra JSON field
  loanType: 'federal',
  repaymentPlan: 'standard',
  forgivenessProgramEligible: false,
  forgivenessProgramDetails: '',
  defermentStatus: 'notAvailable',
  refinancingConsidered: false
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

const loanTypeOptions = [
  { value: 'federal', label: 'Federal' },
  { value: 'private', label: 'Private' },
  { value: 'mixed', label: 'Mixed Federal/Private' }
];

const repaymentPlanOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'incomeBased', label: 'Income-Based (IBR)' },
  { value: 'graduatedRepayment', label: 'Graduated Repayment' },
  { value: 'extendedRepayment', label: 'Extended Repayment' },
  { value: 'other', label: 'Other' }
];

const defermentStatusOptions = [
  { value: 'active', label: 'Currently in Deferment/Forbearance' },
  { value: 'available', label: 'Available but Not Using' },
  { value: 'used', label: 'Already Used' },
  { value: 'notAvailable', label: 'Not Available' }
];

function StudentLoanForm({ studentLoans, onAdd, onUpdate, onRemove }: StudentLoanFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentLoan, setCurrentStudentLoan] = useState<StudentLoan>({ 
    ...defaultStudentLoan,
    id: generateId()
  });

  // Helper function to safely format numeric values
  const formatRate = (rate: number): string => {
    const numRate = Number(rate) || 0;
    return numRate.toFixed(2);
  };

  // Safe getter for option labels
  const getOptionLabel = (options: Array<{value: string, label: string}>, value: string): string => {
    return options.find(option => option.value === value)?.label || value;
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentStudentLoan({
      ...currentStudentLoan,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentStudentLoan({
      ...currentStudentLoan,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentStudentLoan({
      ...currentStudentLoan,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentStudentLoan({
      ...currentStudentLoan,
      [name]: checked
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentStudentLoan({ 
      ...defaultStudentLoan,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(currentStudentLoan);
    } else {
      onAdd(currentStudentLoan);
    }
    resetForm();
  };

  // Edit student loan
  const handleEdit = (studentLoan: StudentLoan) => {
    setCurrentStudentLoan(studentLoan);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {studentLoans.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lender/Servicer</TableCell>
                <TableCell>Loan Type</TableCell>
                <TableCell>Current Balance</TableCell>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Repayment Plan</TableCell>
                <TableCell>Forgiveness Eligible</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.lender}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getOptionLabel(loanTypeOptions, loan.loanType)} 
                      color={loan.loanType === 'federal' ? 'primary' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(loan.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(loan.monthlyPayment)}</TableCell>
                  <TableCell>{formatRate(Number(loan.interestRate))}%</TableCell>
                  <TableCell>
                    {getOptionLabel(repaymentPlanOptions, loan.repaymentPlan)}
                  </TableCell>
                  <TableCell>
                    {loan.forgivenessProgramEligible ? (
                      <Chip label="Yes" color="success" size="small" />
                    ) : (
                      <Chip label="No" color="default" size="small" />
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
          Add Student Loan
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Student Loan' : 'Add New Student Loan'}
          </Typography>
          <Grid container spacing={3}>
            {/* Basic Student Loan Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Lender/Servicer Name"
                name="lender"
                value={currentStudentLoan.lender}
                onChange={handleTextChange}
                placeholder="e.g., Navient, Great Lakes, Sallie Mae"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  name="loanType"
                  value={currentStudentLoan.loanType}
                  onChange={handleSelectChange}
                  label="Loan Type"
                >
                  {loanTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account # (last 4 digits)"
                name="accountLast4"
                value={currentStudentLoan.accountLast4}
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
                value={currentStudentLoan.originalAmount}
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
                value={currentStudentLoan.currentBalance}
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
                value={currentStudentLoan.interestRate}
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
                value={currentStudentLoan.monthlyPayment}
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
                value={currentStudentLoan.originalTerm}
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
                value={currentStudentLoan.remainingTerm}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Student Loan Specific Information */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Repayment Plan</InputLabel>
                <Select
                  name="repaymentPlan"
                  value={currentStudentLoan.repaymentPlan}
                  onChange={handleSelectChange}
                  label="Repayment Plan"
                >
                  {repaymentPlanOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Deferment/Forbearance Status</InputLabel>
                <Select
                  name="defermentStatus"
                  value={currentStudentLoan.defermentStatus}
                  onChange={handleSelectChange}
                  label="Deferment/Forbearance Status"
                >
                  {defermentStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentStudentLoan.forgivenessProgramEligible}
                    onChange={handleSwitchChange}
                    name="forgivenessProgramEligible"
                  />
                }
                label="Eligible for Loan Forgiveness Program"
              />
            </Grid>
            
            {currentStudentLoan.forgivenessProgramEligible && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Loan Forgiveness Program Details"
                  name="forgivenessProgramDetails"
                  value={currentStudentLoan.forgivenessProgramDetails}
                  onChange={handleTextChange}
                  placeholder="e.g., Public Service Loan Forgiveness (PSLF), eligible after 10 years of payments"
                  multiline
                  rows={2}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentStudentLoan.refinancingConsidered}
                    onChange={handleSwitchChange}
                    name="refinancingConsidered"
                  />
                }
                label="Considering Refinancing"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentStudentLoan.hasCosigner}
                    onChange={handleSwitchChange}
                    name="hasCosigner"
                  />
                }
                label="Has Cosigner"
              />
            </Grid>
            
            {currentStudentLoan.hasCosigner && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cosigner Name"
                  name="cosignerName"
                  value={currentStudentLoan.cosignerName}
                  onChange={handleTextChange}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Status</InputLabel>
                <Select
                  name="status"
                  value={currentStudentLoan.status}
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
                value={currentStudentLoan.notes}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Consolidation plans, special repayment circumstances, etc."
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
                  disabled={!currentStudentLoan.lender || !currentStudentLoan.currentBalance || !currentStudentLoan.monthlyPayment}
                >
                  {isEditing ? 'Update Student Loan' : 'Add Student Loan'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default StudentLoanForm;