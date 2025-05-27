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
import { CreditCard } from '../../../types';
import { generateId, formatCurrency } from '../../../utils/assetsFunction'


interface CreditCardDebtFormProps {
  creditCards: CreditCard[];
  onAdd: (newCreditCard: CreditCard) => void;
  onUpdate: (updatedCreditCard: CreditCard) => void;
  onRemove: (creditCardId: string) => void;
}

const defaultCreditCard: CreditCard = {
  id: '',
  lender: '',
  accountLast4: '',
  originalAmount: 0, // Not as relevant for credit cards
  currentBalance: 0,
  interestRate: 0,
  monthlyPayment: 0,
  remainingTerm: 0, // Not as relevant for credit cards
  originalTerm: 0, // Not as relevant for credit cards
  isJoint: false,
  status: 'current',
  hasCollateral: false, // Credit cards are typically unsecured
  hasCosigner: false,
  cosignerName: '',
  notes: '',
  // Credit card specific fields
  creditLimit: 0,
  minimumPayment: 0,
  annualFee: 0,
  rewardProgram: '',
  utilizationRatio: 0,
  balanceTransferOffersAvailable: false
};

const debtStatusOptions = [
  { value: 'current', label: 'Current' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'delinquent', label: 'Delinquent' },
  { value: 'in_collection', label: 'In Collection' },
  { value: 'default', label: 'In Default' },
  { value: 'paid_off', label: 'Paid Off' }
];

function CreditCardDebtForm({ creditCards, onAdd, onUpdate, onRemove }: CreditCardDebtFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCreditCard, setCurrentCreditCard] = useState<CreditCard>({ 
    ...defaultCreditCard,
    id: generateId()
  });

  // Helper to safely format numbers
  const formatRate = (rate: number): string => {
    const numRate = rate || 0;
    return numRate.toFixed(2);
  };

  const formatPercentage = (value: number): string => {
    const numValue = value || 0;
    return numValue.toFixed(1);
  };

  // Handle text field changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCreditCard({
      ...currentCreditCard,
      [name]: value
    });
  };

  // Handle number field changes
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numberValue = parseFloat(value) || 0;
    
    // If changing credit limit or current balance, also update the utilization ratio
    if (name === 'creditLimit' || name === 'currentBalance') {
      const updatedCard = {
        ...currentCreditCard,
        [name]: numberValue
      };
      
      // Calculate new utilization ratio if creditLimit is not zero
      if (name === 'creditLimit' && numberValue > 0) {
        updatedCard.utilizationRatio = (currentCreditCard.currentBalance / numberValue) * 100;
      } else if (name === 'currentBalance' && currentCreditCard.creditLimit > 0) {
        updatedCard.utilizationRatio = (numberValue / currentCreditCard.creditLimit) * 100;
      }
      
      setCurrentCreditCard(updatedCard);
    } else {
      setCurrentCreditCard({
        ...currentCreditCard,
        [name]: numberValue
      });
    }
  };

  // Handle select field changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setCurrentCreditCard({
      ...currentCreditCard,
      [name]: value
    });
  };

  // Handle switch changes
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCurrentCreditCard({
      ...currentCreditCard,
      [name]: checked
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentCreditCard({ 
      ...defaultCreditCard,
      id: generateId()
    });
    setIsAdding(false);
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = () => {
    // Calculate utilization ratio one more time to ensure it's correct
    const updatedCard = {
      ...currentCreditCard
    };
    
    if (updatedCard.creditLimit > 0) {
      updatedCard.utilizationRatio = (updatedCard.currentBalance / updatedCard.creditLimit) * 100;
    }
    
    if (isEditing) {
      onUpdate(updatedCard);
    } else {
      onAdd(updatedCard);
    }
    resetForm();
  };

  // Edit credit card
  const handleEdit = (creditCard: CreditCard) => {
    setCurrentCreditCard(creditCard);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <div>
      {creditCards.length > 0 && !isAdding && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Card Issuer</TableCell>
                <TableCell>Last 4</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Credit Limit</TableCell>
                <TableCell>APR</TableCell>
                <TableCell>Min Payment</TableCell>
                <TableCell>Utilization</TableCell>
                <TableCell>Annual Fee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.lender}</TableCell>
                  <TableCell>{card.accountLast4}</TableCell>
                  <TableCell>{formatCurrency(card.currentBalance)}</TableCell>
                  <TableCell>{formatCurrency(card.creditLimit)}</TableCell>
                  <TableCell>{formatRate(Number(card.interestRate))}%</TableCell>
                  <TableCell>{formatCurrency(Number(card.minimumPayment))}</TableCell>
                  <TableCell>
                    <Tooltip title={Number(card.utilizationRatio) > 30 ? "High utilization may impact credit score" : ""}>
                      <Typography 
                        color={Number(card.utilizationRatio) > 30 ? "error" : "inherit"}
                      >
                        {formatPercentage(card.utilizationRatio)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatCurrency(card.annualFee)}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(card)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onRemove(card.id)}>
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
          Add Credit Card
        </Button>
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Credit Card' : 'Add New Credit Card'}
          </Typography>
          <Grid container spacing={3}>
            {/* Basic Credit Card Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Card Issuer"
                name="lender"
                value={currentCreditCard.lender}
                onChange={handleTextChange}
                placeholder="e.g., Chase, Citi, Bank of America"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Card # (last 4 digits)"
                name="accountLast4"
                value={currentCreditCard.accountLast4}
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
                value={currentCreditCard.currentBalance}
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
                label="Credit Limit"
                name="creditLimit"
                type="number"
                value={currentCreditCard.creditLimit}
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
                label="Interest Rate (APR)"
                name="interestRate"
                type="number"
                value={currentCreditCard.interestRate}
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
                label="Minimum Monthly Payment"
                name="minimumPayment"
                type="number"
                value={currentCreditCard.minimumPayment}
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
                label="Actual Monthly Payment"
                name="monthlyPayment"
                type="number"
                value={currentCreditCard.monthlyPayment}
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
                label="Annual Fee"
                name="annualFee"
                type="number"
                value={currentCreditCard.annualFee}
                onChange={handleNumberChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            
            {/* Card-specific options */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reward Program"
                name="rewardProgram"
                value={currentCreditCard.rewardProgram}
                onChange={handleTextChange}
                placeholder="e.g., 2% cash back, travel points, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Card Status</InputLabel>
                <Select
                  name="status"
                  value={currentCreditCard.status}
                  onChange={handleSelectChange}
                  label="Card Status"
                >
                  {debtStatusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Credit utilization display */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Credit Utilization</Typography>
                <Typography 
                  variant="h6" 
                  color={currentCreditCard.utilizationRatio > 30 ? "error" : "inherit"}
                >
                  {formatPercentage(currentCreditCard.utilizationRatio)}%
                </Typography>
                {currentCreditCard.utilizationRatio > 30 && (
                  <Typography variant="caption" color="error">
                    High utilization may negatively impact your credit score
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentCreditCard.balanceTransferOffersAvailable}
                    onChange={handleSwitchChange}
                    name="balanceTransferOffersAvailable"
                  />
                }
                label="Balance Transfer Offers Available"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentCreditCard.isJoint}
                    onChange={handleSwitchChange}
                    name="isJoint"
                  />
                }
                label="Joint Account"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={currentCreditCard.notes}
                onChange={handleTextChange}
                multiline
                rows={2}
                placeholder="e.g., Promotional rate expires in July, planning to transfer balance, etc."
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
                  disabled={!currentCreditCard.lender || !currentCreditCard.creditLimit}
                >
                  {isEditing ? 'Update Credit Card' : 'Add Credit Card'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}

export default CreditCardDebtForm;