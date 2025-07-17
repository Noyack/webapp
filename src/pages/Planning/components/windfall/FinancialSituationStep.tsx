import React from 'react';
import { 
  Typography, 
  Slider, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  FormControlLabel,
  Checkbox,
  Grid, 
  Box, 
  Paper, 
  Button,
  InputAdornment,
  Alert,
} from '@mui/material';
import { StepProps } from '../../../../types';
import { DEBT_TYPES, INVESTMENT_VEHICLES } from '../../../../constants/constant';
import { formatCurrency } from '../../../../utils/windfall';

const FinancialSituationStep: React.FC<StepProps> = ({
  financialSituation,
  setFinancialSituation,
//   personalInfo
}) => {
  // Handle changing debts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDebtChange = (index: number, field: string, value: any) => {
    const updatedDebts = [...financialSituation.debts];
    updatedDebts[index] = {
      ...updatedDebts[index],
      [field]: value
    };
    setFinancialSituation({
      ...financialSituation,
      debts: updatedDebts
    });
  };

  // Add new debt
  const addDebt = () => {
    const newDebt = { type: 'creditCard', balance: 0, interestRate: 18.0, minimumPayment: 0 };
    setFinancialSituation({
      ...financialSituation,
      debts: [...financialSituation.debts, newDebt]
    });
  };

  // Remove debt
  const removeDebt = (index: number) => {
    const updatedDebts = financialSituation.debts.filter((_, i) => i !== index);
    setFinancialSituation({
      ...financialSituation,
      debts: updatedDebts
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Emergency Fund & Savings</Typography>
          
          <Box className="mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={financialSituation.hasEmergencyFund}
                  onChange={(e) => setFinancialSituation({
                    ...financialSituation, 
                    hasEmergencyFund: e.target.checked
                  })}
                />
              }
              label="I have an emergency fund"
            />
          </Box>
          
          {financialSituation.hasEmergencyFund && (
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>Current Emergency Fund Balance</Typography>
              <TextField
                value={financialSituation.emergencyFund}
                onChange={(e) => setFinancialSituation({
                  ...financialSituation, 
                  emergencyFund: Number(e.target.value)
                })}
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              
              <Box className="mt-2">
                <Typography variant="subtitle1" gutterBottom>Months of Expenses Covered</Typography>
                <Slider
                  value={financialSituation.monthsOfExpenses}
                  onChange={(_e, value) => setFinancialSituation({
                    ...financialSituation, 
                    monthsOfExpenses: value as number
                  })}
                  aria-labelledby="months-slider"
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 3, label: '3' },
                    { value: 6, label: '6' },
                    { value: 12, label: '12' }
                  ]}
                  min={0}
                  max={12}
                />
                
                <Alert 
                  severity={financialSituation.monthsOfExpenses >= 3 ? "success" : "warning"}
                  className="mt-2"
                >
                  {financialSituation.monthsOfExpenses >= 6 
                    ? "You have a strong emergency fund!" 
                    : financialSituation.monthsOfExpenses >= 3
                      ? "You have a good start on your emergency fund."
                      : "Consider building your emergency fund to at least 3-6 months of expenses."}
                </Alert>
              </Box>
            </Box>
          )}
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Current Retirement Savings</Typography>
            <TextField
              value={financialSituation.retirementSavings}
              onChange={(e) => setFinancialSituation({
                ...financialSituation, 
                retirementSavings: Number(e.target.value)
              })}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </Paper>
        
        <Paper elevation={2} className="p-4 mt-4">
          <Typography variant="h6" gutterBottom>Existing Investments</Typography>
          
          {financialSituation.existingInvestments.map((investment, index) => (
            <Box key={index} className="mb-4">
              <FormControl fullWidth variant="outlined" className="mb-2">
                <InputLabel id={`investment-type-label-${index}`}>Investment Type</InputLabel>
                <Select
                  labelId={`investment-type-label-${index}`}
                  value={investment.vehicle}
                  onChange={(e) => {
                    const updatedInvestments = [...financialSituation.existingInvestments];
                    updatedInvestments[index] = {
                      ...updatedInvestments[index],
                      vehicle: e.target.value as string
                    };
                    setFinancialSituation({
                      ...financialSituation,
                      existingInvestments: updatedInvestments
                    });
                  }}
                  label="Investment Type"
                >
                  {INVESTMENT_VEHICLES.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box className="flex gap-2">
                <TextField
                  value={investment.balance}
                  onChange={(e) => {
                    const updatedInvestments = [...financialSituation.existingInvestments];
                    updatedInvestments[index] = {
                      ...updatedInvestments[index],
                      balance: Number(e.target.value)
                    };
                    setFinancialSituation({
                      ...financialSituation,
                      existingInvestments: updatedInvestments
                    });
                  }}
                  type="number"
                  variant="outlined"
                  fullWidth
                  label="Current Balance"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                
                <Button 
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const updatedInvestments = financialSituation.existingInvestments.filter(
                      (_, i) => i !== index
                    );
                    setFinancialSituation({
                      ...financialSituation,
                      existingInvestments: updatedInvestments
                    });
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
          
          <Button 
            variant="outlined"
            onClick={() => {
              setFinancialSituation({
                ...financialSituation,
                existingInvestments: [
                  ...financialSituation.existingInvestments,
                  { vehicle: 'taxableAccount', balance: 0 }
                ]
              });
            }}
          >
            Add Investment Account
          </Button>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">Current Debts</Typography>
            <Button 
              variant="outlined"
              onClick={addDebt}
            >
              Add Debt
            </Button>
          </Box>
          
          {financialSituation.debts.length === 0 ? (
            <Alert severity="success">You have no debts! That's excellent financial health.</Alert>
          ) : (
            financialSituation.debts.map((debt, index) => (
              <Paper 
                key={index} 
                elevation={1} 
                className="p-3 mb-3"
                sx={{borderLeft: `4px solid ${
                  debt.interestRate > 10 ? '#f44336' : 
                  debt.interestRate > 5 ? '#ff9800' : '#4caf50'
                }`}}
              >
                <Box className="flex justify-between items-center mb-2">
                  <FormControl variant="outlined" size="small" style={{minWidth: 150}}>
                    <Select
                      value={debt.type}
                      onChange={(e) => handleDebtChange(index, 'type', e.target.value)}
                    >
                      {DEBT_TYPES.map(type => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => removeDebt(index)}
                  >
                    Remove
                  </Button>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Balance"
                      value={debt.balance}
                      onChange={(e) => handleDebtChange(index, 'balance', Number(e.target.value))}
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Interest Rate"
                      value={debt.interestRate}
                      onChange={(e) => handleDebtChange(index, 'interestRate', Number(e.target.value))}
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Monthly Payment"
                      value={debt.minimumPayment}
                      onChange={(e) => handleDebtChange(index, 'minimumPayment', Number(e.target.value))}
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
                
                {debt.interestRate > 10 && (
                  <Typography variant="body2" color="error" className="mt-2">
                    High interest debt - consider prioritizing payoff
                  </Typography>
                )}
              </Paper>
            ))
          )}
          
          {financialSituation.debts.length > 0 && (
            <Box className="mt-4">
              <Typography variant="subtitle1" gutterBottom>Debt Summary</Typography>
              <Box className="p-3 bg-gray-50 rounded">
                <Typography variant="body1">
                  Total Debt: {formatCurrency(financialSituation.debts.reduce((sum, debt) => sum + debt.balance, 0))}
                </Typography>
                <Typography variant="body1">
                  Average Interest Rate: {
                    (financialSituation.debts.reduce((sum, debt) => sum + debt.interestRate * debt.balance, 0) / 
                    financialSituation.debts.reduce((sum, debt) => sum + debt.balance, 0)).toFixed(2)
                  }%
                </Typography>
                <Typography variant="body1">
                  Monthly Payments: {formatCurrency(financialSituation.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancialSituationStep;