// src/pages/Planning/components/401k/InvestmentDetailsTab.tsx
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
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  Security as SecurityIcon,
  MonetizationOn as MoneyIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { 
  FourOhOneKData, 
  EnhancedCalculations, 
  CONTRIBUTION_LIMITS,
  formatCurrency
} from '../../../../utils/fourOhOneK';

interface InvestmentDetailsTabProps {
  data: FourOhOneKData;
  calculations: EnhancedCalculations;
  updateData: (field: keyof FourOhOneKData, value: any) => void;
  handleInputChange: (field: keyof FourOhOneKData, value: any) => void;
}

const InvestmentDetailsTab: React.FC<InvestmentDetailsTabProps> = ({
  data,
  calculations,
  updateData,
  handleInputChange
}) => {

  // Helper function to get display value (empty string for 0, except for required fields)
  const getDisplayValue = (field: keyof FourOhOneKData, value: number): string => {
    // Ages and rates should always show a value
    if (field === 'currentAge' || field === 'retirementAge' || 
        field === 'estimatedReturn' || field === 'totalFees' || 
        field === 'inflationRate' || field === 'incomeGrowthRate') {
      return value.toString();
    }
    
    // Other numeric fields show empty string for 0
    return value === 0 ? '' : value.toString();
  };

  // Helper for handling number input changes
  const handleNumberInputChange = (field: keyof FourOhOneKData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Allow empty string (will be converted to 0)
      if (value === '') {
        handleInputChange(field, 0);
        return;
      }
      
      // Parse the number
      const numValue = field === 'currentAge' || field === 'retirementAge' 
        ? parseInt(value) 
        : parseFloat(value);
      
      // Only update if it's a valid number
      if (!isNaN(numValue)) {
        handleInputChange(field, numValue);
      }
    };
  };

  // Validation error checking
  const getValidationError = (field: keyof FourOhOneKData): string | undefined => {
    switch (field) {
      case 'currentAge':
        if (data.currentAge < 1 || data.currentAge > 120) {
          return 'Age must be between 1 and 120';
        }
        if (data.currentAge >= data.retirementAge) {
          return 'Current age must be less than retirement age';
        }
        break;
      
      case 'retirementAge':
        if (data.retirementAge <= data.currentAge) {
          return 'Retirement age must be greater than current age';
        }
        if (data.retirementAge > 120) {
          return 'Retirement age cannot exceed 120';
        }
        break;
    }
    return undefined;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Personal Information with Enhanced Validation */}
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon color="primary" />
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Your current age affects catch-up contribution eligibility (50+) and investment time horizon">
                <TextField
                  fullWidth
                  label="Current Age"
                  type="number"
                  value={getDisplayValue('currentAge', data.currentAge)}
                  onChange={handleNumberInputChange('currentAge')}
                  inputProps={{ 
                    min: 1, 
                    max: 120,
                    'aria-describedby': 'age-helper-text'
                  }}
                  sx={{ mb: 2 }}
                  error={!!getValidationError('currentAge')}
                  helperText={getValidationError('currentAge') || (data.currentAge >= 50 ? "✓ Eligible for catch-up contributions" : "Catch-up eligible at 50")}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Target retirement age affects your investment time horizon and withdrawal strategy">
                <TextField
                  fullWidth
                  label="Retirement Age"
                  type="number"
                  value={getDisplayValue('retirementAge', data.retirementAge)}
                  onChange={handleNumberInputChange('retirementAge')}
                  inputProps={{ min: data.currentAge + 1, max: 120 }}
                  sx={{ mb: 2 }}
                  error={!!getValidationError('retirementAge')}
                  helperText={getValidationError('retirementAge') || `${calculations.yearsToRetirement} years to retirement`}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Your gross annual salary before taxes and deductions">
                <TextField
                  fullWidth
                  label="Annual Income"
                  type="number"
                  value={getDisplayValue('annualIncome', data.annualIncome)}
                  onChange={handleNumberInputChange('annualIncome')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 1000 }}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Years to Retirement:</strong> {calculations.yearsToRetirement} years
            </Typography>
            <Typography variant="body2">
              <strong>Monthly Income:</strong> {formatCurrency(calculations.monthlyIncome)}
            </Typography>
          </Box>
        </Grid>

        {/* Enhanced 401(k) Details */}
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon color="primary" />
            401(k) Details
          </Typography>
          
          <Tooltip title="Your current 401(k) account balance">
            <TextField
              fullWidth
              label="Current 401(k) Balance"
              type="number"
              value={getDisplayValue('currentBalance', data.currentBalance)}
              onChange={handleNumberInputChange('currentBalance')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 1000 }}
              sx={{ mb: 2 }}
              helperText={data.currentBalance > 0 ? `${calculations.nationalComparison.balancePercentile.toFixed(0)}th percentile for your age` : 'Enter your current balance'}
            />
          </Tooltip>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Monthly contribution amount from your paycheck">
                <TextField
                  fullWidth
                  label="Monthly Contribution"
                  type="number"
                  value={getDisplayValue('monthlyContribution', data.monthlyContribution)}
                  onChange={handleNumberInputChange('monthlyContribution')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 50 }}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Percentage of annual salary contributed to 401(k)">
                <TextField
                  fullWidth
                  label="Contribution %"
                  type="number"
                  value={getDisplayValue('contributionPercent', calculations.contributionPercent)}
                  onChange={handleNumberInputChange('contributionPercent')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 100, step: 0.5 }}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
          </Grid>

          {/* Catch-up Contributions */}
          {data.currentAge >= 50 && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.includeCatchUp}
                    onChange={(e) => updateData('includeCatchUp', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Include Catch-up Contributions
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Add {formatCurrency(CONTRIBUTION_LIMITS.catchUp)} annually (age 50+)
                    </Typography>
                  </Box>
                }
              />
              {data.includeCatchUp && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  ✓ Adding {formatCurrency(calculations.catchUpContribution)} annual catch-up contribution
                </Typography>
              )}
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Employer matching percentage of your contribution">
                <TextField
                  fullWidth
                  label="Employer Match"
                  type="number"
                  value={getDisplayValue('employerMatch', data.employerMatch)}
                  onChange={handleNumberInputChange('employerMatch')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 100, step: 25 }}
                  helperText="% of your contribution"
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Maximum salary percentage your employer will match">
                <TextField
                  fullWidth
                  label="Match Limit"
                  type="number"
                  value={getDisplayValue('employerMatchLimit', data.employerMatchLimit)}
                  onChange={handleNumberInputChange('employerMatchLimit')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 25, step: 0.5 }}
                  helperText="% of salary matched"
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
          </Grid>

          {/* Employer Match Analysis */}
          {data.employerMatch > 0 && data.employerMatchLimit > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: calculations.currentEmployerMatch < calculations.maxEmployerMatch ? 'warning.50' : 'success.50', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Employer Match Analysis:</strong>
              </Typography>
              <Typography variant="body2">
                Current: {formatCurrency(calculations.currentEmployerMatch)} / Max: {formatCurrency(calculations.maxEmployerMatch)}
              </Typography>
              <Typography variant="body2" color={calculations.currentEmployerMatch < calculations.maxEmployerMatch ? 'warning.main' : 'success.main'}>
                {calculations.currentEmployerMatch < calculations.maxEmployerMatch 
                  ? `⚠️ Missing ${formatCurrency(calculations.maxEmployerMatch - calculations.currentEmployerMatch)} in free money!`
                  : '✓ Maximizing employer match'
                }
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Investment Parameters */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Investment Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Tooltip title="Expected annual return on your 401(k) investments">
                    <TextField
                      fullWidth
                      label="Expected Return"
                      type="number"
                      value={getDisplayValue('estimatedReturn', data.estimatedReturn)}
                      onChange={handleNumberInputChange('estimatedReturn')}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ min: 0, max: 50, step: 0.1 }}
                      helperText="Historical average: ~7%"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Tooltip title="Total annual fees (expense ratios + admin fees)">
                    <TextField
                      fullWidth
                      label="Total Fees"
                      type="number"
                      value={getDisplayValue('totalFees', data.totalFees)}
                      onChange={handleNumberInputChange('totalFees')}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                      helperText="Target: <1.0%"
                    />
                  </Tooltip>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Inflation & Growth Settings:</strong>
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.includeInflation}
                          onChange={(e) => updateData('includeInflation', e.target.checked)}
                        />
                      }
                      label="Include Inflation"
                    />
                  </Grid>
                  {data.includeInflation && (
                    <>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Inflation Rate"
                          type="number"
                          value={getDisplayValue('inflationRate', data.inflationRate)}
                          onChange={handleNumberInputChange('inflationRate')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          inputProps={{ min: 0, max: 10, step: 0.1 }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Income Growth"
                          type="number"
                          value={getDisplayValue('incomeGrowthRate', data.incomeGrowthRate)}
                          onChange={handleNumberInputChange('incomeGrowthRate')}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          inputProps={{ min: 0, max: 10, step: 0.1 }}
                          size="small"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvestmentDetailsTab;