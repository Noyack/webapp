// tabs/InvestmentDetailsTab.tsx
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
                  value={data.currentAge}
                  onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value) || 0)}
                  inputProps={{ 
                    min: 18, 
                    max: 75,
                    'aria-describedby': 'age-helper-text'
                  }}
                  sx={{ mb: 2 }}
                  helperText={data.currentAge >= 50 ? "✓ Eligible for catch-up contributions" : "Catch-up eligible at 50"}
                  id="age-helper-text"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Target retirement age affects your investment time horizon and withdrawal strategy">
                <TextField
                  fullWidth
                  label="Retirement Age"
                  type="number"
                  value={data.retirementAge}
                  onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value) || 65)}
                  inputProps={{ min: 50, max: 75 }}
                  sx={{ mb: 2 }}
                  helperText={`${calculations.yearsToRetirement} years to retirement`}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Your gross annual salary before taxes and deductions">
                <TextField
                  fullWidth
                  label="Annual Income"
                  type="number"
                  value={data.annualIncome}
                  onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value) || 0)}
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
              value={data.currentBalance}
              onChange={(e) => handleInputChange('currentBalance', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 1000 }}
              sx={{ mb: 2 }}
              helperText={`${calculations.nationalComparison.balancePercentile.toFixed(0)}th percentile for your age`}
            />
          </Tooltip>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Monthly contribution amount from your paycheck">
                <TextField
                  fullWidth
                  label="Monthly Contribution"
                  type="number"
                  value={data.monthlyContribution}
                  onChange={(e) => handleInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
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
                  value={calculations.contributionPercent.toFixed(2)}
                  onChange={(e) => handleInputChange('contributionPercent', parseFloat(e.target.value) || 0)}
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
                  value={data.employerMatch}
                  onChange={(e) => handleInputChange('employerMatch', parseFloat(e.target.value) || 0)}
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
              <Tooltip title="Maximum salary percentage that qualifies for employer match">
                <TextField
                  fullWidth
                  label="Match Limit"
                  type="number"
                  value={data.employerMatchLimit}
                  onChange={(e) => handleInputChange('employerMatchLimit', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">% of salary</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 25, step: 0.5 }}
                  helperText="Maximum matched"
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Expected annual investment return before fees">
                <TextField
                  fullWidth
                  label="Estimated Rate of Return"
                  type="number"
                  value={data.estimatedReturn}
                  onChange={(e) => handleInputChange('estimatedReturn', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 15, step: 0.5 }}
                  sx={{ mb: 2 }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Annual fees charged by your 401(k) plan and investment funds">
                <TextField
                  fullWidth
                  label="Total 401(k) Fees"
                  type="number"
                  value={data.totalFees}
                  onChange={(e) => handleInputChange('totalFees', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 5, step: 0.25 }}
                  sx={{ mb: 2 }}
                  helperText={data.totalFees > 1.5 ? "High fees - consider lower-cost options" : "Reasonable fee level"}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>

        {/* Enhanced Employer Match Analysis */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: calculations.currentEmployerMatch >= calculations.maxEmployerMatch ? 'success.50' : 'warning.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>💰 Enhanced Employer Match Analysis</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Monthly Match</Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {formatCurrency(calculations.monthlyEmployerMatch)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Annual Match</Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {formatCurrency(calculations.currentEmployerMatch)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Maximum Possible</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(calculations.maxEmployerMatch)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">Match Efficiency</Typography>
                  <Typography variant="h5" color={calculations.currentEmployerMatch >= calculations.maxEmployerMatch ? 'success.main' : 'warning.main'} fontWeight="bold">
                    {((calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 100).toFixed(0)}%
                  </Typography>
                </Grid>
              </Grid>
              
              {calculations.currentEmployerMatch < calculations.maxEmployerMatch && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Missing Free Money!</strong> You're leaving {formatCurrency(calculations.maxEmployerMatch - calculations.currentEmployerMatch)} per year on the table.
                    <br />
                    Increase your contribution to {data.employerMatchLimit}% to maximize employer match.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">⚙️ Advanced Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.includeInflation}
                        onChange={(e) => updateData('includeInflation', e.target.checked)}
                      />
                    }
                    label="Include Inflation/Income Growth"
                  />
                </Grid>
                {data.includeInflation && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Inflation Rate"
                        type="number"
                        value={data.inflationRate}
                        onChange={(e) => updateData('inflationRate', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: 10, step: 0.25 }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Income Growth Rate"
                        type="number"
                        value={data.incomeGrowthRate}
                        onChange={(e) => updateData('incomeGrowthRate', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ min: 0, max: 10, step: 0.25 }}
                        size="small"
                      />
                    </Grid>
                  </>
                )}
                
                {/* Risk Profile Selection */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Risk Profile</InputLabel>
                    <Select
                      value={data.riskProfile}
                      label="Risk Profile"
                      onChange={(e) => updateData('riskProfile', e.target.value)}
                    >
                      <MenuItem value="conservative">Conservative</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="aggressive">Aggressive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Social Security Estimate */}
                <Grid item xs={12} md={4}>
                  <Tooltip title="Estimated monthly Social Security benefits at retirement">
                    <TextField
                      fullWidth
                      label="Social Security Estimate"
                      type="number"
                      value={data.socialSecurityEstimate}
                      onChange={(e) => updateData('socialSecurityEstimate', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">/month</InputAdornment>
                      }}
                      inputProps={{ min: 0, step: 100 }}
                      size="small"
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvestmentDetailsTab;