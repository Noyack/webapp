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
  Slider,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Savings as SavingsIcon,
  AccountBalance as EmergencyIcon,
  TrendingUp as GrowthIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { LifestyleInflationInputs } from '../../../../types/lifestyleInflation';
import { formatCurrency, formatPercentage } from '../../../../utils/lifestyleInflationCalculations';

interface SavingsGoalsTabProps {
  inputs: LifestyleInflationInputs;
  onInputChange: <K extends keyof LifestyleInflationInputs>(field: K, value: LifestyleInflationInputs[K]) => void;
}

export default function SavingsGoalsTab({ inputs, onInputChange }: SavingsGoalsTabProps) {
  
  // Calculate current savings metrics
  const currentMonthlySavings = inputs.currentIncome.monthly * (inputs.savingsGoals.currentSavingsRate / 100);
  const targetMonthlySavings = inputs.currentIncome.monthly * (inputs.savingsGoals.targetSavingsRate / 100);
  const monthsToEmergencyFund = inputs.savingsGoals.emergencyFund / currentMonthlySavings;
  
  // Calculate total spending to validate savings rates
  const totalMonthlySpending = inputs.spendingCategories.reduce(
    (sum, cat) => sum + cat.currentMonthlyAmount, 0
  );
  const spendingRatio = totalMonthlySpending / inputs.currentIncome.monthly;
  const maxPossibleSavingsRate = (1 - spendingRatio) * 100;

  // Handle savings goals changes
  const handleSavingsGoalChange = (field: keyof typeof inputs.savingsGoals) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('savingsGoals', {
      ...inputs.savingsGoals,
      [field]: value
    });
  };

  // Handle slider changes
  const handleSliderChange = (field: keyof typeof inputs.savingsGoals) => (
    _event: Event,
    newValue: number | number[]
  ) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    onInputChange('savingsGoals', {
      ...inputs.savingsGoals,
      [field]: value
    });
  };

  // Get savings rate assessment
  const getSavingsRateAssessment = (rate: number) => {
    if (rate < 10) return { level: 'Low', color: 'error', message: 'Consider increasing your savings rate for better financial security' };
    if (rate < 15) return { level: 'Fair', color: 'warning', message: 'Good start! Try to increase gradually' };
    if (rate < 20) return { level: 'Good', color: 'success', message: 'Solid savings rate for building wealth' };
    return { level: 'Excellent', color: 'success', message: 'Outstanding savings discipline!' };
  };

  const currentAssessment = getSavingsRateAssessment(inputs.savingsGoals.currentSavingsRate);
  const targetAssessment = getSavingsRateAssessment(inputs.savingsGoals.targetSavingsRate);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Savings Goals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your current and target savings rates to see how lifestyle inflation affects your goals.
      </Typography>

      {/* Validation Alerts */}
      {spendingRatio > 1 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">⚠️ Spending Exceeds Income</Typography>
          <Typography variant="body2">
            Your spending categories total {formatPercentage(spendingRatio * 100)} of your income. 
            Please reduce spending or increase income before setting savings goals.
          </Typography>
        </Alert>
      )}

      {inputs.savingsGoals.targetSavingsRate > maxPossibleSavingsRate && maxPossibleSavingsRate > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">🎯 Ambitious Savings Target</Typography>
          <Typography variant="body2">
            Your target savings rate of {formatPercentage(inputs.savingsGoals.targetSavingsRate)} exceeds what's possible 
            with current spending ({formatPercentage(maxPossibleSavingsRate)} max). 
            Consider reducing spending categories first.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Current Savings Rate */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SavingsIcon color="primary" />
                Current Savings Rate
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Savings Rate: {formatPercentage(inputs.savingsGoals.currentSavingsRate)}
                </Typography>
                <Slider
                  value={inputs.savingsGoals.currentSavingsRate}
                  onChange={handleSliderChange('currentSavingsRate')}
                  min={0}
                  max={50}
                  step={0.5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 10, label: '10%' },
                    { value: 20, label: '20%' },
                    { value: 30, label: '30%' },
                    { value: 50, label: '50%' }
                  ]}
                  color={currentAssessment.color as 'error' | 'warning' | 'success'}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Savings Rate"
                    type="number"
                    value={inputs.savingsGoals.currentSavingsRate}
                    onChange={handleSavingsGoalChange('currentSavingsRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    size="small"
                    sx={{ width: '120px' }}
                  />
                  <Chip 
                    label={currentAssessment.level}
                    color={currentAssessment.color as 'error' | 'warning' | 'success'}
                    icon={currentAssessment.color === 'error' ? <WarningIcon /> : <GrowthIcon />}
                  />
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Monthly Savings Impact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Monthly Savings</Typography>
                    <Typography variant="h6">{formatCurrency(currentMonthlySavings)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Annual Savings</Typography>
                    <Typography variant="h6">{formatCurrency(currentMonthlySavings * 12)}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {currentAssessment.message}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Target Savings Rate */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GrowthIcon color="success" />
                Target Savings Rate
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target Savings Rate: {formatPercentage(inputs.savingsGoals.targetSavingsRate)}
                </Typography>
                <Slider
                  value={inputs.savingsGoals.targetSavingsRate}
                  onChange={handleSliderChange('targetSavingsRate')}
                  min={0}
                  max={50}
                  step={0.5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 10, label: '10%' },
                    { value: 20, label: '20%' },
                    { value: 30, label: '30%' },
                    { value: 50, label: '50%' }
                  ]}
                  color={targetAssessment.color as 'error' | 'warning' | 'success'}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextField
                    label="Target Rate"
                    type="number"
                    value={inputs.savingsGoals.targetSavingsRate}
                    onChange={handleSavingsGoalChange('targetSavingsRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    size="small"
                    sx={{ width: '120px' }}
                  />
                  <Chip 
                    label={targetAssessment.level}
                    color={targetAssessment.color as 'error' | 'warning' | 'success'}
                    icon={<GrowthIcon />}
                  />
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Target Monthly Savings
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Monthly Target</Typography>
                    <Typography variant="h6">{formatCurrency(targetMonthlySavings)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Annual Target</Typography>
                    <Typography variant="h6">{formatCurrency(targetMonthlySavings * 12)}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {targetAssessment.message}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Fund Goal */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmergencyIcon color="warning" />
                Emergency Fund Goal
              </Typography>

              <TextField
                fullWidth
                label="Emergency Fund Target"
                type="number"
                value={inputs.savingsGoals.emergencyFund}
                onChange={handleSavingsGoalChange('emergencyFund')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Recommended: 3-6 months of expenses"
                sx={{ mb: 3 }}
              />

              {/* Emergency fund progress */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Time to Emergency Fund Goal
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  {isFinite(monthsToEmergencyFund) ? 
                    `${Math.ceil(monthsToEmergencyFund)} months` : 
                    'Increase savings rate'
                  }
                </Typography>
                {isFinite(monthsToEmergencyFund) && (
                  <Typography variant="body2" color="text.secondary">
                    {Math.ceil(monthsToEmergencyFund / 12)} years at current savings rate
                  </Typography>
                )}
              </Box>

              {/* Emergency fund recommendations */}
              <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                  Emergency Fund Guidelines
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      💡 <strong>3 months:</strong> Stable job, dual income
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      💡 <strong>6 months:</strong> Single income, variable income
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      💡 <strong>12 months:</strong> Self-employed, high-risk job
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Savings Gap Analysis */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Savings Gap Analysis
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current vs Target Savings Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((inputs.savingsGoals.currentSavingsRate / inputs.savingsGoals.targetSavingsRate) * 100, 100)}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  color={inputs.savingsGoals.currentSavingsRate >= inputs.savingsGoals.targetSavingsRate ? 'success' : 'primary'}
                />
                <Typography variant="body2" color="text.secondary">
                  {inputs.savingsGoals.currentSavingsRate >= inputs.savingsGoals.targetSavingsRate 
                    ? '✅ Target achieved!' 
                    : `${(inputs.savingsGoals.targetSavingsRate - inputs.savingsGoals.currentSavingsRate).toFixed(1)}% gap to close`
                  }
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Gap</Typography>
                  <Typography variant="h6" color={targetMonthlySavings > currentMonthlySavings ? 'error.main' : 'success.main'}>
                    {formatCurrency(Math.abs(targetMonthlySavings - currentMonthlySavings))}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Annual Gap</Typography>
                  <Typography variant="h6" color={targetMonthlySavings > currentMonthlySavings ? 'error.main' : 'success.main'}>
                    {formatCurrency(Math.abs(targetMonthlySavings - currentMonthlySavings) * 12)}
                  </Typography>
                </Grid>
              </Grid>

              {targetMonthlySavings > currentMonthlySavings && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>To reach your target:</strong> Increase monthly savings by{' '}
                    {formatCurrency(targetMonthlySavings - currentMonthlySavings)} or reduce spending by the same amount.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Savings Strategies */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                💡 Savings Strategies to Combat Lifestyle Inflation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    🏦 Automation Strategies
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Set up automatic transfers on payday</li>
                    <li>Increase 401(k) contribution with each raise</li>
                    <li>Use separate savings accounts for different goals</li>
                    <li>Automate the "50% of raise" rule</li>
                  </ul>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Monitoring & Control
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Track spending changes after each raise</li>
                    <li>Set lifestyle inflation budgets per category</li>
                    <li>Review and adjust savings goals annually</li>
                    <li>Celebrate savings milestones, not spending</li>
                  </ul>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tips */}
        <Grid item xs={12}>
          <Alert severity="success">
            <Typography variant="subtitle2">🎯 Savings Rate Benchmarks</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2"><strong>Emergency Only:</strong> 5-10%</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2"><strong>Basic Security:</strong> 10-15%</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2"><strong>Wealth Building:</strong> 15-25%</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2"><strong>Early Retirement:</strong> 25-50%</Typography>
              </Grid>
            </Grid>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 