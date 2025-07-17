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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { RealHourlyWageInputs, DEFAULT_TAX_RATES } from '../../../../types/realHourlyWage';
import { formatCurrency, calculateTotalTaxes } from '../../../../utils/realHourlyWageCalculations';

interface TaxesTabProps {
  inputs: RealHourlyWageInputs;
  onInputChange: <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => void;
}

// State tax rates for major states (2024)
const STATE_TAX_RATES: { [key: string]: number } = {
  'AL': 5.0, 'AK': 0.0, 'AZ': 4.5, 'AR': 5.9, 'CA': 9.3, 'CO': 4.4,
  'CT': 5.0, 'DE': 6.6, 'FL': 0.0, 'GA': 5.75, 'HI': 8.25, 'ID': 6.0,
  'IL': 4.95, 'IN': 3.23, 'IA': 6.0, 'KS': 5.7, 'KY': 5.0, 'LA': 4.25,
  'ME': 7.15, 'MD': 5.75, 'MA': 5.0, 'MI': 4.25, 'MN': 7.05, 'MS': 5.0,
  'MO': 5.3, 'MT': 6.75, 'NE': 5.84, 'NV': 0.0, 'NH': 0.0, 'NJ': 8.97,
  'NM': 5.9, 'NY': 8.0, 'NC': 4.75, 'ND': 2.9, 'OH': 3.99, 'OK': 5.0,
  'OR': 9.9, 'PA': 3.07, 'RI': 5.99, 'SC': 7.0, 'SD': 0.0, 'TN': 0.0,
  'TX': 0.0, 'UT': 4.85, 'VT': 6.0, 'VA': 5.75, 'WA': 0.0, 'WV': 6.5,
  'WI': 7.65, 'WY': 0.0
};

export default function TaxesTab({ inputs, onInputChange }: TaxesTabProps) {
  
  // Handle tax rate changes
  const handleTaxChange = (field: keyof typeof inputs.taxes) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('taxes', {
      ...inputs.taxes,
      [field]: value
    });
  };

  // Handle benefits changes
  const handleBenefitsChange = (field: keyof typeof inputs.benefits) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('benefits', {
      ...inputs.benefits,
      [field]: value
    });
  };

  // Handle state selection
  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const state = event.target.value;
    const stateTaxRate = STATE_TAX_RATES[state] || 0;
    
    onInputChange('location', {
      ...inputs.location,
      state
    });
    
    onInputChange('taxes', {
      ...inputs.taxes,
      stateTaxRate
    });
  };

  // Calculate totals
  const grossAnnualSalary = inputs.salary.salaryType === 'salary' 
    ? inputs.salary.annualSalary
    : (inputs.salary.hourlyRate || 0) * inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear;

  const totalTaxes = calculateTotalTaxes(grossAnnualSalary, inputs.taxes);
  const netAnnualIncome = grossAnnualSalary - totalTaxes;
  const totalBenefitValue = inputs.benefits.healthInsurance * 12 + 
                           inputs.benefits.retirement401k * 12 + 
                           inputs.benefits.otherBenefits * 12;

  // Calculate individual tax components
  const federalTax = grossAnnualSalary * (inputs.taxes.federalTaxRate / 100);
  const stateTax = grossAnnualSalary * (inputs.taxes.stateTaxRate / 100);
  const socialSecurity = Math.min(grossAnnualSalary * (inputs.taxes.socialSecurityRate / 100), 9932.40);
  const medicare = grossAnnualSalary * (inputs.taxes.medicareRate / 100);
  const otherTaxes = grossAnnualSalary * ((inputs.taxes.stateDisabilityRate + inputs.taxes.unemploymentRate) / 100);

  const effectiveTaxRate = (totalTaxes / grossAnnualSalary) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Taxes & Benefits Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure your tax rates and benefits to calculate your net take-home income accurately.
      </Typography>

      <Grid container spacing={3}>
        {/* Federal & State Taxes */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏛️ Federal & State Taxes
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>State</InputLabel>
                <Select
                  value={inputs.location.state}
                  onChange={handleStateChange}
                  label="State"
                >
                  {Object.entries(STATE_TAX_RATES).map(([state, rate]) => (
                    <MenuItem key={state} value={state}>
                      {state} {rate === 0 ? '(No State Tax)' : `(${rate}%)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Federal Tax Rate"
                    type="number"
                    value={inputs.taxes.federalTaxRate || ''}
                    onChange={handleTaxChange('federalTaxRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Your marginal rate (22% typical)"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State Tax Rate"
                    type="number"
                    value={inputs.taxes.stateTaxRate || ''}
                    onChange={handleTaxChange('stateTaxRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Auto-filled by state"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Tax breakdown preview */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error.main">
                  Tax Impact (Annual)
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Federal:</Typography>
                    <Typography variant="h6">{formatCurrency(federalTax)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">State:</Typography>
                    <Typography variant="h6">{formatCurrency(stateTax)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payroll Taxes */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Payroll Taxes (2024 Rates)
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Social Security"
                    type="number"
                    value={inputs.taxes.socialSecurityRate || ''}
                    onChange={handleTaxChange('socialSecurityRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="6.2% standard rate"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medicare"
                    type="number"
                    value={inputs.taxes.medicareRate || ''}
                    onChange={handleTaxChange('medicareRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="1.45% standard rate"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State Disability"
                    type="number"
                    value={inputs.taxes.stateDisabilityRate || ''}
                    onChange={handleTaxChange('stateDisabilityRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Varies by state"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unemployment"
                    type="number"
                    value={inputs.taxes.unemploymentRate || ''}
                    onChange={handleTaxChange('unemploymentRate')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    helperText="Usually employer-paid"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {/* Payroll tax impact */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="warning.main">
                  Payroll Taxes (Annual)
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Social Security:</Typography>
                    <Typography variant="h6">{formatCurrency(socialSecurity)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Medicare:</Typography>
                    <Typography variant="h6">{formatCurrency(medicare)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Benefits */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💼 Employee Benefits
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Health Insurance Premium"
                    type="number"
                    value={inputs.benefits.healthInsurance || ''}
                    onChange={handleBenefitsChange('healthInsurance')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Monthly employee portion"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="401k Contribution"
                    type="number"
                    value={inputs.benefits.retirement401k || ''}
                    onChange={handleBenefitsChange('retirement401k')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Monthly contribution"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Paid Time Off"
                    type="number"
                    value={inputs.benefits.paidTimeOff || ''}
                    onChange={handleBenefitsChange('paidTimeOff')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">days</InputAdornment>,
                    }}
                    helperText="Annual vacation days"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sick Days"
                    type="number"
                    value={inputs.benefits.sickDays || ''}
                    onChange={handleBenefitsChange('sickDays')}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">days</InputAdornment>,
                    }}
                    helperText="Annual sick days"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Other Benefits Value"
                    type="number"
                    value={inputs.benefits.otherBenefits || ''}
                    onChange={handleBenefitsChange('otherBenefits')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Monthly value of dental, vision, etc."
                  />
                </Grid>
              </Grid>

              {/* Benefits value summary */}
              {totalBenefitValue > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="success.main">
                    Benefits Value (Annual)
                  </Typography>
                  <Typography variant="h6">{formatCurrency(totalBenefitValue)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total compensation add-on
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Summary */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧮 Tax Calculation Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Effective Tax Rate: {effectiveTaxRate.toFixed(1)}%</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box 
                    sx={{ 
                      width: `${Math.min(effectiveTaxRate, 100)}%`, 
                      height: 8, 
                      bgcolor: effectiveTaxRate > 30 ? 'error.main' : effectiveTaxRate > 20 ? 'warning.main' : 'success.main',
                      borderRadius: 1 
                    }} 
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {effectiveTaxRate > 30 ? 'High' : effectiveTaxRate > 20 ? 'Moderate' : 'Low'} tax burden
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Gross Income:</Typography>
                  <Typography variant="h6">{formatCurrency(grossAnnualSalary)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Total Taxes:</Typography>
                  <Typography variant="h6" color="error.main">{formatCurrency(totalTaxes)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Net Income:</Typography>
                  <Typography variant="h6" color="success.main">{formatCurrency(netAnnualIncome)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Take-Home %:</Typography>
                  <Typography variant="h6">{((netAnnualIncome / grossAnnualSalary) * 100).toFixed(1)}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Summary */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                💰 Complete Tax & Benefits Summary
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatCurrency(netAnnualIncome)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Net Annual Income
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatCurrency(totalTaxes)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Taxes
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatCurrency(totalBenefitValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Benefits Value
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {effectiveTaxRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Effective Tax Rate
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Federal: ${formatCurrency(federalTax)}`} 
                  color="error" 
                  size="small" 
                />
                <Chip 
                  label={`State: ${formatCurrency(stateTax)}`} 
                  color="warning" 
                  size="small" 
                />
                <Chip 
                  label={`Payroll: ${formatCurrency(socialSecurity + medicare + otherTaxes)}`} 
                  color="info" 
                  size="small" 
                />
                <Chip 
                  label={`${inputs.location.state || 'State'} Resident`} 
                  color="default" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Tips */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="subtitle2">💡 Tax Optimization Tips</Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Maximize 401k contributions to reduce taxable income (2024 limit: $23,000)</li>
              <li>Use HSA if available - triple tax advantage (2024 limit: $4,150 individual)</li>
              <li>Consider pre-tax benefits like transit passes and dependent care</li>
              <li>Track work-related expenses for potential deductions</li>
              <li>Review withholdings annually to avoid large refunds or payments</li>
              <li>Consider state tax implications if considering relocation</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 