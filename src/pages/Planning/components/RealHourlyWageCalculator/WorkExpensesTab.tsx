import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { RealHourlyWageInputs } from '../../../../types/realHourlyWage';
import { formatCurrency, calculateJobExpenses } from '../../../../utils/realHourlyWageCalculations';

interface WorkExpensesTabProps {
  inputs: RealHourlyWageInputs;
  onInputChange: <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => void;
}

export default function WorkExpensesTab({ inputs, onInputChange }: WorkExpensesTabProps) {
  
  // Handle commuting expense changes
  const handleCommutingChange = (field: keyof typeof inputs.expenses.commuting) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expenses', {
      ...inputs.expenses,
      commuting: {
        ...inputs.expenses.commuting,
        [field]: value
      }
    });
  };

  // Handle work-related expense changes
  const handleWorkRelatedChange = (field: keyof typeof inputs.expenses.workRelated) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expenses', {
      ...inputs.expenses,
      workRelated: {
        ...inputs.expenses.workRelated,
        [field]: value
      }
    });
  };

  // Calculate totals for preview
  const totalAnnualExpenses = calculateJobExpenses(inputs.expenses, inputs.schedule);
  const workDaysPerYear = (inputs.schedule.hoursPerWeek / 8) * inputs.schedule.weeksPerYear;
  const totalWorkHours = inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear;
  
  // Calculate daily and hourly impacts
  const dailyExpenses = totalAnnualExpenses / workDaysPerYear;
  const hourlyExpenseImpact = totalAnnualExpenses / totalWorkHours;

  // Calculate individual category totals
  const commutingTotal = (inputs.expenses.commuting.dailyTransportCost + 
                         inputs.expenses.commuting.vehicleWearAndTear) * workDaysPerYear +
                        inputs.expenses.commuting.parkingCosts * workDaysPerYear +
                        inputs.expenses.commuting.monthlyTransportPass * 12;

  const workRelatedTotal = inputs.expenses.workRelated.annualClothing +
                          inputs.expenses.workRelated.dailyMeals * workDaysPerYear +
                          inputs.expenses.workRelated.equipment +
                          inputs.expenses.workRelated.training +
                          inputs.expenses.workRelated.childcare * 12 +
                          inputs.expenses.workRelated.professionalDues;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Work-Related Expenses
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track all expenses that reduce your real hourly wage. These costs are directly tied to your job.
      </Typography>

      <Grid container spacing={3}>
        {/* Commuting Expenses */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚗 Commuting Expenses
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Daily Transport Cost"
                    type="number"
                    value={inputs.expenses.commuting.dailyTransportCost || ''}
                    onChange={handleCommutingChange('dailyTransportCost')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Gas, tolls, bus fare per day"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Wear & Tear"
                    type="number"
                    value={inputs.expenses.commuting.vehicleWearAndTear || ''}
                    onChange={handleCommutingChange('vehicleWearAndTear')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Maintenance, depreciation per day"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Daily Parking Costs"
                    type="number"
                    value={inputs.expenses.commuting.parkingCosts || ''}
                    onChange={handleCommutingChange('parkingCosts')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Parking fees per day"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Transit Pass"
                    type="number"
                    value={inputs.expenses.commuting.monthlyTransportPass || ''}
                    onChange={handleCommutingChange('monthlyTransportPass')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Bus/train pass cost"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Commuting summary */}
              {commutingTotal > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="info.main">
                    Commuting Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Annual Cost:</Typography>
                      <Typography variant="h6">{formatCurrency(commutingTotal)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Daily Cost:</Typography>
                      <Typography variant="h6">{formatCurrency(commutingTotal / workDaysPerYear)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Work-Related Expenses */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💼 Work-Related Costs
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Clothing"
                    type="number"
                    value={inputs.expenses.workRelated.annualClothing || ''}
                    onChange={handleWorkRelatedChange('annualClothing')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Work clothes, uniforms"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Daily Meals"
                    type="number"
                    value={inputs.expenses.workRelated.dailyMeals || ''}
                    onChange={handleWorkRelatedChange('dailyMeals')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Lunch, coffee, snacks"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Equipment & Software"
                    type="number"
                    value={inputs.expenses.workRelated.equipment || ''}
                    onChange={handleWorkRelatedChange('equipment')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Annual equipment costs"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Training & Certification"
                    type="number"
                    value={inputs.expenses.workRelated.training || ''}
                    onChange={handleWorkRelatedChange('training')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Annual training costs"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Childcare"
                    type="number"
                    value={inputs.expenses.workRelated.childcare || ''}
                    onChange={handleWorkRelatedChange('childcare')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Work-related childcare"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Professional Dues"
                    type="number"
                    value={inputs.expenses.workRelated.professionalDues || ''}
                    onChange={handleWorkRelatedChange('professionalDues')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Licenses, memberships"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Work-related summary */}
              {workRelatedTotal > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="warning.main">
                    Work Costs Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Annual Cost:</Typography>
                      <Typography variant="h6">{formatCurrency(workRelatedTotal)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Daily Cost:</Typography>
                      <Typography variant="h6">{formatCurrency(workRelatedTotal / workDaysPerYear)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expense Summary */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                💰 Total Work Expense Impact
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {formatCurrency(totalAnnualExpenses)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Annual Expenses
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatCurrency(dailyExpenses)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Cost
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatCurrency(hourlyExpenseImpact)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Per Hour Impact
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {((totalAnnualExpenses / (inputs.salary.annualSalary || 1)) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of Gross Salary
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Commuting: ${formatCurrency(commutingTotal)}`} 
                  color="info" 
                  size="small" 
                />
                <Chip 
                  label={`Work Costs: ${formatCurrency(workRelatedTotal)}`} 
                  color="warning" 
                  size="small" 
                />
                <Chip 
                  label={`${workDaysPerYear} work days/year`} 
                  color="default" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Helpful Tips */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="subtitle2">💡 Expense Tracking Tips</Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Use the IRS standard mileage rate (65.5¢/mile for 2023) for vehicle expenses</li>
              <li>Include uniform dry cleaning and safety equipment costs</li>
              <li>Count only meals purchased because you're at work (not regular meals)</li>
              <li>Professional development that's required for your job counts as an expense</li>
              <li>Don't forget licenses, certifications, and professional memberships</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 