import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Chip,
  Slider,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Savings as SavingsIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';

interface EmergencyFundData {
  // Current situation
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  
  // Target settings
  targetMonths: number;
  monthlyContribution: number;
  
  // Risk factors
  jobSecurity: number; // 1-5 scale
  dependents: number;
  hasHealthInsurance: boolean;
  hasDisabilityInsurance: boolean;
  incomeStability: 'stable' | 'variable' | 'seasonal';
  
  // Additional safety nets
  creditCardLimit: number;
  creditLineLimit: number;
  familySupport: boolean;
  otherLiquidAssets: number;
}

const EmergencyFundCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<EmergencyFundData>({
    currentBalance: 5000,
    monthlyIncome: 5000,
    monthlyExpenses: 3500,
    targetMonths: 6,
    monthlyContribution: 500,
    jobSecurity: 3,
    dependents: 0,
    hasHealthInsurance: true,
    hasDisabilityInsurance: false,
    incomeStability: 'stable',
    creditCardLimit: 10000,
    creditLineLimit: 0,
    familySupport: false,
    otherLiquidAssets: 0
  });

  // Calculations
  const targetAmount = data.monthlyExpenses * data.targetMonths;
  const currentCoverage = data.currentBalance / data.monthlyExpenses;
  const fundingGap = Math.max(0, targetAmount - data.currentBalance);
  const monthsToComplete = data.monthlyContribution > 0 ? Math.ceil(fundingGap / data.monthlyContribution) : 0;
  const totalSafetyNet = data.currentBalance + data.creditCardLimit + data.creditLineLimit + data.otherLiquidAssets;
  const totalCoverage = totalSafetyNet / data.monthlyExpenses;
  
  // Risk assessment
  const getRiskScore = () => {
    let score = 0;
    if (data.jobSecurity <= 2) score += 2;
    if (data.incomeStability !== 'stable') score += 1;
    if (data.dependents > 0) score += 1;
    if (!data.hasHealthInsurance) score += 2;
    if (!data.hasDisabilityInsurance) score += 1;
    return score;
  };

  const riskScore = getRiskScore();
  const recommendedMonths = riskScore <= 2 ? 3 : riskScore <= 4 ? 6 : 12;

  // Update data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (field: keyof EmergencyFundData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Get fund status
  const getFundStatus = () => {
    if (currentCoverage >= recommendedMonths) return { level: 'Excellent', color: 'success', message: 'Your emergency fund is well-funded!' };
    if (currentCoverage >= 3) return { level: 'Good', color: 'success', message: 'Good foundation, consider building more' };
    if (currentCoverage >= 1) return { level: 'Fair', color: 'warning', message: 'Getting started, keep building' };
    return { level: 'Needs Work', color: 'error', message: 'Priority: Build emergency fund immediately' };
  };

  const fundStatus = getFundStatus();

  // Prepare export data
  const prepareExportData = (): GenericExportData => {
    const savingsProjection = [];
    let currentAmount = data.currentBalance;
    
    for (let month = 1; month <= 24 && currentAmount < targetAmount; month++) {
      currentAmount += data.monthlyContribution;
      if (month % 6 === 0) {
        savingsProjection.push({
          month: month,
          balance: currentAmount,
          monthsCovered: currentAmount / data.monthlyExpenses,
          remainingGap: Math.max(0, targetAmount - currentAmount)
        });
      }
    }

    return {
      calculatorName: 'Emergency Fund Calculator',
      inputs: {
        currentBalance: data.currentBalance,
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        targetMonths: data.targetMonths,
        monthlyContribution: data.monthlyContribution,
        jobSecurity: data.jobSecurity,
        dependents: data.dependents,
        hasHealthInsurance: data.hasHealthInsurance,
        hasDisabilityInsurance: data.hasDisabilityInsurance,
        incomeStability: data.incomeStability,
        creditCardLimit: data.creditCardLimit,
        creditLineLimit: data.creditLineLimit,
        familySupport: data.familySupport,
        otherLiquidAssets: data.otherLiquidAssets
      },
      keyMetrics: [
        { label: 'Current Coverage', value: `${currentCoverage.toFixed(1)} months` },
        { label: 'Target Amount', value: `$${targetAmount.toLocaleString()}` },
        { label: 'Funding Gap', value: `$${fundingGap.toLocaleString()}` },
        { label: 'Months to Complete', value: `${monthsToComplete} months` },
        { label: 'Fund Status', value: fundStatus.level },
        { label: 'Recommended Months', value: `${recommendedMonths} months` },
        { label: 'Risk Score', value: `${riskScore}/7` },
        { label: 'Total Safety Net', value: `$${totalSafetyNet.toLocaleString()}` },
        { label: 'Total Coverage', value: `${totalCoverage.toFixed(1)} months` },
        { label: 'Emergency Fund as % of Income', value: `${((data.currentBalance / data.monthlyIncome) * 100).toFixed(0)}%` }
      ],
      summary: {
        currentBalance: data.currentBalance,
        targetAmount: targetAmount,
        fundingGap: fundingGap,
        currentCoverage: currentCoverage,
        monthsToComplete: monthsToComplete,
        totalSafetyNet: totalSafetyNet,
        totalCoverage: totalCoverage,
        riskScore: riskScore,
        recommendedMonths: recommendedMonths
      },
      tableData: savingsProjection,
      recommendations: [
        fundingGap > 0 ? `You need to save $${fundingGap.toLocaleString()} more to reach your ${data.targetMonths}-month goal` : 'Congratulations! You\'ve reached your emergency fund target',
        data.monthlyContribution > 0 ? `At your current savings rate of $${data.monthlyContribution}/month, you'll reach your goal in ${monthsToComplete} months` : 'Start saving monthly to build your emergency fund',
        riskScore > 4 ? 'Your risk profile suggests building a larger emergency fund (9-12 months)' : riskScore > 2 ? 'Your risk profile suggests a standard 6-month emergency fund' : 'Your stable situation allows for a smaller 3-month emergency fund',
        !data.hasHealthInsurance ? 'Priority: Get health insurance to reduce financial risk' : 'Good job having health insurance coverage',
        !data.hasDisabilityInsurance ? 'Consider disability insurance to protect your income' : '',
        data.creditCardLimit > 0 ? 'Credit cards can provide temporary relief but focus on cash savings first' : 'Consider establishing a credit line as backup emergency funding',
        'Keep your emergency fund in a high-yield savings account for easy access',
        'Review and adjust your emergency fund target annually as your expenses change'
      ].filter(rec => rec.length > 0)
    };
  };

  return (
    <Box className="emergency-fund-calculator">
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        Emergency Fund Calculator
      </Typography>
      
      <Typography variant="body1" className="mb-6 text-center text-gray-600 ">
        Build the perfect emergency fund based on your unique situation, risk factors, and financial goals.
      </Typography>

      {/* Fund Status Overview */}
      <Card sx={{ mb: 3, bgcolor: `${fundStatus.color}.50`, border: '1px solid', borderColor: `${fundStatus.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${fundStatus.color}.main`} fontWeight="bold">
                {currentCoverage.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Months Covered</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{fundStatus.level} Emergency Fund</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((currentCoverage / recommendedMonths) * 100, 100)}
                color={fundStatus.color as 'success' | 'warning' | 'error'}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">{fundStatus.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h5" fontWeight="bold">${targetAmount.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Target Amount</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab label="Fund Analysis" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Savings Strategy" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Risk Assessment" icon={<SecurityIcon />} iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Fund Analysis Tab */}
          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                {/* Current Finances */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SavingsIcon color="primary" />
                    Current Financial Situation
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Current Emergency Fund"
                        type="number"
                        value={data.currentBalance}
                        onChange={(e) => updateData('currentBalance', parseFloat(e.target.value) || 0)}
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
                        value={data.monthlyIncome}
                        onChange={(e) => updateData('monthlyIncome', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Monthly Essential Expenses"
                        type="number"
                        value={data.monthlyExpenses}
                        onChange={(e) => updateData('monthlyExpenses', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Include housing, utilities, food, insurance, debt payments"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Fund Target */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Emergency Fund Target: {data.targetMonths} months
                    </Typography>
                    <Box maxWidth={"500px"}>
                    <Slider
                      value={data.targetMonths}
                      onChange={(_, value) => updateData('targetMonths', value)}
                      min={1}
                      max={12}
                      step={0.5}
                      marks={[
                        { value: 3, label: '3 months' },
                        { value: 6, label: '6 months' },
                        { value: 9, label: '9 months' },
                        { value: 12, label: '12 months' }
                      ]}
                      valueLabelDisplay="auto"
                      />
                      </Box>
                    <Typography variant="caption" color="text.secondary">
                      Recommended: {recommendedMonths} months based on your risk profile
                    </Typography>
                  </Box>
                </Grid>

                {/* Fund Metrics */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom>📊 Fund Analysis</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${data.currentBalance.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Current Balance</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          ${targetAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Target Amount</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color={fundingGap > 0 ? 'error.main' : 'success.main'} fontWeight="bold">
                          ${fundingGap.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Funding Gap</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          {((data.currentBalance / data.monthlyIncome) * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Of Monthly Income</Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Safety Net Analysis */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Total Safety Net</Typography>
                    <TableContainer >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Source</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Months</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Emergency Fund</TableCell>
                            <TableCell align="right">${data.currentBalance.toLocaleString()}</TableCell>
                            <TableCell align="right">{currentCoverage.toFixed(1)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Credit Cards</TableCell>
                            <TableCell align="right">${data.creditCardLimit.toLocaleString()}</TableCell>
                            <TableCell align="right">{(data.creditCardLimit / data.monthlyExpenses).toFixed(1)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Credit Lines</TableCell>
                            <TableCell align="right">${data.creditLineLimit.toLocaleString()}</TableCell>
                            <TableCell align="right">{(data.creditLineLimit / data.monthlyExpenses).toFixed(1)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Other Assets</TableCell>
                            <TableCell align="right">${data.otherLiquidAssets.toLocaleString()}</TableCell>
                            <TableCell align="right">{(data.otherLiquidAssets / data.monthlyExpenses).toFixed(1)}</TableCell>
                          </TableRow>
                          <TableRow sx={{ bgcolor: 'primary.50' }}>
                            <TableCell><strong>Total Safety Net</strong></TableCell>
                            <TableCell align="right"><strong>${totalSafetyNet.toLocaleString()}</strong></TableCell>
                            <TableCell align="right"><strong>{totalCoverage.toFixed(1)}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Savings Strategy Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>💰 Emergency Fund Savings Strategy</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Monthly Contribution Plan</Typography>
                      
                      <TextField
                        fullWidth
                        label="Monthly Contribution"
                        type="number"
                        value={data.monthlyContribution}
                        onChange={(e) => updateData('monthlyContribution', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 3 }}
                      />

                      <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="info.main" gutterBottom>Timeline Projections</Typography>
                        <Typography variant="body2">
                          <strong>Time to Target:</strong> {monthsToComplete > 0 ? `${monthsToComplete} months` : 'Target achieved!'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Contribution Rate:</strong> {((data.monthlyContribution / data.monthlyIncome) * 100).toFixed(1)}% of income
                        </Typography>
                        <Typography variant="body2">
                          <strong>Annual Savings:</strong> ${(data.monthlyContribution * 12).toLocaleString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Savings Milestones</Typography>
                      
                      {[1, 3, 6, 12].map(months => {
                        const milestoneAmount = data.monthlyExpenses * months;
                        const isAchieved = data.currentBalance >= milestoneAmount;
                        const monthsToMilestone = data.monthlyContribution > 0 
                          ? Math.ceil(Math.max(0, milestoneAmount - data.currentBalance) / data.monthlyContribution)
                          : 0;

                        return (
                          <Box key={months} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {months} Month{months > 1 ? 's' : ''} Fund
                              </Typography>
                              {isAchieved ? <CheckIcon color="success" /> : <WarningIcon color="warning" />}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Target: ${milestoneAmount.toLocaleString()}
                            </Typography>
                            {!isAchieved && (
                              <Typography variant="body2" color="warning.main">
                                {monthsToMilestone} months to achieve
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Savings Tips */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>💡 Emergency Fund Building Tips</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Automate transfers to emergency fund account</li>
                          <li>Use high-yield savings account for better returns</li>
                          <li>Start with $1,000 minimum, then build gradually</li>
                          <li>Direct tax refunds and bonuses to emergency fund</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Keep emergency fund separate from checking account</li>
                          <li>Consider money market accounts for higher balances</li>
                          <li>Review and adjust target based on life changes</li>
                          <li>Don't invest emergency fund in stocks or bonds</li>
                        </ul>
                      </Grid>
                    </Grid>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Risk Assessment Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>🔍 Personal Risk Assessment</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Employment & Income</Typography>
                  
                  <Box sx={{ mb: 3 }} display={"flex"} flexDirection={"column"}>
                    <Typography variant="body2" gutterBottom>Job Security Level</Typography>
                    <Box minWidth={"280px"} maxWidth={"500px"} alignSelf={"center"}>
                      <Slider
                        value={data.jobSecurity}
                        onChange={(_, value) => updateData('jobSecurity', value)}
                        min={1}
                        max={5}
                        step={1}
                        marks={[
                          { value: 1, label: 'Very Low' },
                          { value: 3, label: 'Average' },
                          { value: 5, label: 'Very High' }
                        ]}
                        valueLabelDisplay="auto"
                        />
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Income Stability</InputLabel>
                    <Select
                      value={data.incomeStability}
                      onChange={(e) => updateData('incomeStability', e.target.value)}
                      label="Income Stability"
                    >
                      <MenuItem value="stable">Stable (salary/fixed)</MenuItem>
                      <MenuItem value="variable">Variable (commission/bonus)</MenuItem>
                      <MenuItem value="seasonal">Seasonal/Contract</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Number of Dependents"
                    type="number"
                    value={data.dependents}
                    onChange={(e) => updateData('dependents', parseInt(e.target.value) || 0)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Insurance Coverage</Typography>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.hasHealthInsurance}
                        onChange={(e) => updateData('hasHealthInsurance', e.target.checked)}
                      />
                    }
                    label="Health Insurance Coverage"
                    sx={{ mb: 1, display: 'block' }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.hasDisabilityInsurance}
                        onChange={(e) => updateData('hasDisabilityInsurance', e.target.checked)}
                      />
                    }
                    label="Disability Insurance Coverage"
                    sx={{ mb: 3, display: 'block' }}
                  />

                  <Typography variant="subtitle1" gutterBottom>Additional Safety Nets</Typography>
                  
                  <TextField
                    fullWidth
                    label="Available Credit Card Limit"
                    type="number"
                    value={data.creditCardLimit}
                    onChange={(e) => updateData('creditCardLimit', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Home Equity/Credit Line"
                    type="number"
                    value={data.creditLineLimit}
                    onChange={(e) => updateData('creditLineLimit', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Other Liquid Assets"
                    type="number"
                    value={data.otherLiquidAssets}
                    onChange={(e) => updateData('otherLiquidAssets', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Savings bonds, CDs, brokerage cash"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.familySupport}
                        onChange={(e) => updateData('familySupport', e.target.checked)}
                      />
                    }
                    label="Family financial support available"
                  />
                </Grid>

                {/* Risk Assessment Results */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: riskScore <= 2 ? 'success.50' : riskScore <= 4 ? 'warning.50' : 'error.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Risk Assessment Results
                        <Chip 
                          label={riskScore <= 2 ? 'Low Risk' : riskScore <= 4 ? 'Medium Risk' : 'High Risk'} 
                          color={riskScore <= 2 ? 'success' : riskScore <= 4 ? 'warning' : 'error'}
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Recommended Emergency Fund:</strong> {recommendedMonths} months of expenses (${(data.monthlyExpenses * recommendedMonths).toLocaleString()})
                      </Typography>

                      <Typography variant="body2">
                        Based on your risk profile, we recommend maintaining {recommendedMonths} months of essential expenses in your emergency fund.
                        {riskScore > 4 && " Your higher risk factors suggest keeping a larger emergency fund for additional security."}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Risk Factors Considered:</Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {data.jobSecurity <= 2 && <li>Lower job security</li>}
                          {data.incomeStability !== 'stable' && <li>Variable income</li>}
                          {data.dependents > 0 && <li>Financial dependents</li>}
                          {!data.hasHealthInsurance && <li>No health insurance</li>}
                          {!data.hasDisabilityInsurance && <li>No disability insurance</li>}
                        </ul>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>

        {/* Export Section */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Export Your Emergency Fund Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Download your emergency fund strategy, risk assessment, and personalized recommendations
          </Typography>
          <ExportButtons data={prepareExportData()} />
        </Box>
      </Card>
    </Box>
  );
};

export default EmergencyFundCalculator; 