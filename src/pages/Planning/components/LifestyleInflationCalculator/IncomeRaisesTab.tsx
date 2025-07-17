import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  Slider
} from '@mui/material';
import { LifestyleInflationInputs } from '../../../../types/lifestyleInflation';
import { formatCurrency, calculateIncomeProjections } from '../../../../utils/lifestyleInflationCalculations';

interface IncomeRaisesTabProps {
  inputs: LifestyleInflationInputs;
  onInputChange: <K extends keyof LifestyleInflationInputs>(field: K, value: LifestyleInflationInputs[K]) => void;
}

export default function IncomeRaisesTab({ inputs, onInputChange }: IncomeRaisesTabProps) {
  
  // Handle income changes
  const handleIncomeChange = (field: 'annual' | 'monthly') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    
    if (field === 'annual') {
      onInputChange('currentIncome', {
        annual: value,
        monthly: value / 12
      });
    } else {
      onInputChange('currentIncome', {
        annual: value * 12,
        monthly: value
      });
    }
  };

  // Handle raise expectation changes
  const handleRaiseChange = (field: keyof typeof inputs.expectedRaises) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expectedRaises', {
      ...inputs.expectedRaises,
      [field]: value
    });
  };

  // Calculate preview projections
  const incomeProjections = calculateIncomeProjections(
    inputs.currentIncome.annual,
    inputs.expectedRaises.frequency,
    inputs.expectedRaises.averagePercentage,
    Math.min(inputs.expectedRaises.yearsToProject, 10) // Limit preview to 10 years
  );

  // Calculate total raises and final income
  const totalRaises = Math.floor(inputs.expectedRaises.yearsToProject / inputs.expectedRaises.frequency);
  const finalIncome = incomeProjections[incomeProjections.length - 1]?.income || inputs.currentIncome.annual;
  const totalIncomeIncrease = finalIncome - inputs.currentIncome.annual;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Income & Raise Expectations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set your current income and expectations for future raises to project lifestyle inflation impact.
      </Typography>

      <Grid container spacing={3}>
        {/* Current Income */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Current Income
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Annual Income"
                    type="number"
                    value={inputs.currentIncome.annual || ''}
                    onChange={handleIncomeChange('annual')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Monthly Income"
                    type="number"
                    value={Math.round(inputs.currentIncome.monthly) || ''}
                    onChange={handleIncomeChange('monthly')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Income validation */}
              {inputs.currentIncome.annual > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="success.main">
                    Income Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Weekly:</Typography>
                      <Typography variant="h6">{formatCurrency(inputs.currentIncome.annual / 52)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Hourly (40hrs):</Typography>
                      <Typography variant="h6">{formatCurrency(inputs.currentIncome.annual / 2080)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Raise Expectations */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Raise Expectations
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Raise Frequency"
                    type="number"
                    value={inputs.expectedRaises.frequency || ''}
                    onChange={handleRaiseChange('frequency')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    }}
                    helperText="How often do you get raises?"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Average Raise %"
                    type="number"
                    value={inputs.expectedRaises.averagePercentage || ''}
                    onChange={handleRaiseChange('averagePercentage')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Typical raise percentage"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Years to Project"
                    type="number"
                    value={inputs.expectedRaises.yearsToProject || ''}
                    onChange={handleRaiseChange('yearsToProject')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">years</InputAdornment>,
                    }}
                    helperText="How far into the future to analyze"
                    inputProps={{ min: 5, max: 40 }}
                  />
                </Grid>
              </Grid>

              {/* Raise frequency visualization */}
              {inputs.expectedRaises.frequency > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Raise Frequency: Every {inputs.expectedRaises.frequency} year{inputs.expectedRaises.frequency > 1 ? 's' : ''}
                  </Typography>
                  <Slider
                    value={inputs.expectedRaises.frequency}
                    min={1}
                    max={5}
                    step={0.5}
                    disabled
                    sx={{ mb: 1 }}
                    color={inputs.expectedRaises.frequency <= 2 ? 'success' : 
                           inputs.expectedRaises.frequency <= 3 ? 'warning' : 'error'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {inputs.expectedRaises.frequency <= 2 ? '✅ Frequent raises' : 
                     inputs.expectedRaises.frequency <= 3 ? '⚡ Moderate frequency' : 
                     '⚠️ Infrequent raises'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Income Projection Summary */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                📊 Income Projection Summary
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatCurrency(finalIncome)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Final Income (Year {inputs.expectedRaises.yearsToProject})
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatCurrency(totalIncomeIncrease)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Increase
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {totalRaises}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Raises
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {((finalIncome / inputs.currentIncome.annual - 1) * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Income Growth
                  </Typography>
                </Grid>
              </Grid>

              {/* Income progression chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {incomeProjections
                  .filter((proj, index) => proj.raisePercentage || index === 0 || index === incomeProjections.length - 1)
                  .slice(0, 6)
                  .map((projection, index) => (
                    <Chip 
                      key={projection.year}
                      label={`Year ${projection.year}: ${formatCurrency(projection.income)}`}
                      color={projection.raisePercentage ? 'success' : 'default'}
                      size="small"
                    />
                  ))}
                {incomeProjections.length > 6 && (
                  <Chip 
                    label={`...+${incomeProjections.length - 6} more years`}
                    color="default"
                    size="small"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Assumptions */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Investment Assumptions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expected Return"
                    type="number"
                    value={inputs.investmentAssumptions.expectedReturn || ''}
                    onChange={(e) => onInputChange('investmentAssumptions', {
                      ...inputs.investmentAssumptions,
                      expectedReturn: parseFloat(e.target.value) || 0
                    })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Annual investment return"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Inflation Rate"
                    type="number"
                    value={inputs.investmentAssumptions.inflationRate || ''}
                    onChange={(e) => onInputChange('investmentAssumptions', {
                      ...inputs.investmentAssumptions,
                      inflationRate: parseFloat(e.target.value) || 0
                    })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="General price inflation"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Real return calculation */}
              {inputs.investmentAssumptions.expectedReturn > 0 && inputs.investmentAssumptions.inflationRate > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="info.main">
                    Real Return (Inflation-Adjusted)
                  </Typography>
                  <Typography variant="h6">
                    {(inputs.investmentAssumptions.expectedReturn - inputs.investmentAssumptions.inflationRate).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tips */}
        <Grid item xs={12} lg={6}>
          <Alert severity="info">
            <Typography variant="subtitle2">💡 Income Planning Tips</Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Consider industry-standard raise frequencies (2-3 years typical)</li>
              <li>Factor in promotions vs. cost-of-living increases</li>
              <li>Remember that lifestyle inflation often grows faster than income</li>
              <li>Use conservative estimates for more realistic projections</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 