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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  MonetizationOn as MoneyIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';

interface FourOhOneKData {
  // Personal details
  currentAge: number;
  retirementAge: number;
  annualIncome: number;
  
  // Investment details
  currentBalance: number;
  monthlyContribution: number;
  contributionPercent: number;
  employerMatch: number;
  employerMatchLimit: number;
  estimatedReturn: number;
  totalFees: number;
  
  // Settings
  includeInflation: boolean;
  inflationRate: number;
  incomeGrowthRate: number;
}

const FourOhOneKCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<FourOhOneKData>({
    currentAge: 30,
    retirementAge: 65,
    annualIncome: 75000,
    currentBalance: 25000,
    monthlyContribution: 500,
    contributionPercent: 8,
    employerMatch: 50,
    employerMatchLimit: 6,
    estimatedReturn: 7,
    totalFees: 1,
    includeInflation: true,
    inflationRate: 3,
    incomeGrowthRate: 3
  });

  // Calculate derived values
  const yearsToRetirement = data.retirementAge - data.currentAge;
  const monthlyIncome = data.annualIncome / 12;
  const contributionPercent = (data.monthlyContribution * 12) / data.annualIncome * 100;
  
  // Employer match calculations
  const maxEmployerMatch = (data.annualIncome * data.employerMatchLimit / 100) * (data.employerMatch / 100);
  const currentEmployerMatch = Math.min(
    (data.monthlyContribution * 12) * (data.employerMatch / 100),
    maxEmployerMatch
  );
  const monthlyEmployerMatch = currentEmployerMatch / 12;
  
  // Investment projections
  const calculateFutureValue = () => {
    let balance = data.currentBalance;
    let yearlyContribution = data.monthlyContribution * 12;
    let yearlyEmployerMatch = currentEmployerMatch;
    const netReturn = (data.estimatedReturn - data.totalFees) / 100;
    
    const projections = [];
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Apply growth to existing balance
      balance = balance * (1 + netReturn);
      
      // Add contributions and employer match
      const totalYearlyContribution = yearlyContribution + yearlyEmployerMatch;
      balance += totalYearlyContribution;
      
      // Calculate age and cumulative contributions
      const age = data.currentAge + year;
      const cumulativeContributions = data.currentBalance + (yearlyContribution * year);
      const cumulativeEmployerMatch = yearlyEmployerMatch * year;
      const totalGrowth = balance - cumulativeContributions - cumulativeEmployerMatch;
      
      projections.push({
        year,
        age,
        balance,
        yearlyContribution,
        yearlyEmployerMatch,
        cumulativeContributions,
        cumulativeEmployerMatch,
        totalGrowth
      });
      
      // Apply income growth for next year
      if (data.includeInflation) {
        yearlyContribution *= (1 + data.incomeGrowthRate / 100);
        yearlyEmployerMatch *= (1 + data.incomeGrowthRate / 100);
      }
    }
    
    return projections;
  };

  const projections = calculateFutureValue();
  const finalBalance = projections.length > 0 ? projections[projections.length - 1].balance : data.currentBalance;
  const totalContributions = projections.length > 0 ? projections[projections.length - 1].cumulativeContributions : 0;
  const totalEmployerMatch = projections.length > 0 ? projections[projections.length - 1].cumulativeEmployerMatch : 0;
  const totalGrowth = finalBalance - totalContributions - totalEmployerMatch;

  // Fee impact calculation
  const calculateFeeImpact = () => {
    const withoutFees = calculateFutureValueWithFees(0);
    const withFees = finalBalance;
    return withoutFees - withFees;
  };

  const calculateFutureValueWithFees = (feeRate: number) => {
    let balance = data.currentBalance;
    let yearlyContribution = data.monthlyContribution * 12;
    const netReturn = (data.estimatedReturn - feeRate) / 100;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      balance = balance * (1 + netReturn);
      balance += yearlyContribution + currentEmployerMatch;
      
      if (data.includeInflation) {
        yearlyContribution *= (1 + data.incomeGrowthRate / 100);
      }
    }
    
    return balance;
  };

  const feeImpact = calculateFeeImpact();

  // Update data function
  const updateData = (field: keyof FourOhOneKData, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate dependent values
      if (field === 'monthlyContribution' || field === 'annualIncome') {
        newData.contributionPercent = (newData.monthlyContribution * 12) / newData.annualIncome * 100;
      } else if (field === 'contributionPercent') {
        newData.monthlyContribution = (newData.annualIncome * newData.contributionPercent / 100) / 12;
      }
      
      return newData;
    });
  };

  // Get savings assessment
  const getSavingsAssessment = () => {
    const contributionRate = contributionPercent;
    if (contributionRate >= 15) return { level: 'Excellent', color: 'success', message: 'On track for comfortable retirement' };
    if (contributionRate >= 10) return { level: 'Good', color: 'success', message: 'Good savings rate, consider increasing' };
    if (contributionRate >= 6) return { level: 'Fair', color: 'warning', message: 'Meeting employer match, room for improvement' };
    if (contributionRate >= 3) return { level: 'Needs Improvement', color: 'warning', message: 'Below recommended savings rate' };
    return { level: 'Critical', color: 'error', message: 'Significantly under-saving for retirement' };
  };

  const savingsAssessment = getSavingsAssessment();

  // Calculate replacement income
  const replacementIncome = (finalBalance * 0.04) / 12; // 4% rule
  const replacementRatio = (replacementIncome * 12) / data.annualIncome * 100;

  // Prepare export data
  const prepareExportData = (): GenericExportData => {
    const yearlyProjections = projections.filter((_, index) => index % 5 === 4 || index === projections.length - 1);
    
    return {
      calculatorName: '401(k) Calculator',
      inputs: {
        currentAge: data.currentAge,
        retirementAge: data.retirementAge,
        annualIncome: data.annualIncome,
        currentBalance: data.currentBalance,
        monthlyContribution: data.monthlyContribution,
        contributionPercent: contributionPercent,
        employerMatch: data.employerMatch,
        employerMatchLimit: data.employerMatchLimit,
        estimatedReturn: data.estimatedReturn,
        totalFees: data.totalFees,
        includeInflation: data.includeInflation,
        inflationRate: data.inflationRate,
        incomeGrowthRate: data.incomeGrowthRate
      },
      keyMetrics: [
        { label: 'Final 401(k) Balance', value: `$${finalBalance.toLocaleString()}` },
        { label: 'Monthly Replacement Income', value: `$${replacementIncome.toLocaleString()}` },
        { label: 'Income Replacement Ratio', value: `${replacementRatio.toFixed(1)}%` },
        { label: 'Contribution Rate', value: `${contributionPercent.toFixed(1)}%` },
        { label: 'Savings Assessment', value: savingsAssessment.level },
        { label: 'Years to Retirement', value: `${yearsToRetirement} years` },
        { label: 'Total Employer Match', value: `$${totalEmployerMatch.toLocaleString()}` },
        { label: 'Total Growth', value: `$${totalGrowth.toLocaleString()}` },
        { label: 'Fee Impact', value: `$${feeImpact.toLocaleString()}` },
        { label: 'Monthly Employer Match', value: `$${monthlyEmployerMatch.toLocaleString()}` }
      ],
      summary: {
        finalBalance: finalBalance,
        totalContributions: totalContributions,
        totalEmployerMatch: totalEmployerMatch,
        totalGrowth: totalGrowth,
        feeImpact: feeImpact,
        replacementIncome: replacementIncome,
        replacementRatio: replacementRatio,
        yearsToRetirement: yearsToRetirement,
        currentEmployerMatch: currentEmployerMatch
      },
      tableData: yearlyProjections.map(projection => ({
        year: projection.year,
        age: projection.age,
        balance: projection.balance,
        yearlyContribution: projection.yearlyContribution,
        yearlyEmployerMatch: projection.yearlyEmployerMatch,
        totalGrowth: projection.totalGrowth
      })),
      recommendations: [
        contributionPercent < 15 ? 'Consider increasing your contribution rate to at least 15% for optimal retirement savings' : 'Excellent contribution rate! You\'re on track for a comfortable retirement',
        currentEmployerMatch < maxEmployerMatch ? `You're missing out on $${(maxEmployerMatch - currentEmployerMatch).toLocaleString()} in free employer matching annually. Consider increasing contributions to ${data.employerMatchLimit}%` : 'Great! You\'re maximizing your employer match',
        data.totalFees > 1.5 ? 'Consider reviewing your fund choices - high fees can significantly impact long-term growth' : 'Your fee level is reasonable',
        replacementRatio < 70 ? 'Your projected retirement income may not be sufficient. Consider increasing contributions or working longer' : 'Good job! Your projected income replacement looks solid',
        data.currentAge < 50 ? 'Starting early gives you a huge advantage with compound growth. Stay consistent!' : 'It\'s never too late to save. Consider catch-up contributions if you\'re over 50',
        'Diversify your investments and consider increasing contributions with salary raises'
      ]
    };
  };

  return (
    <Box className="401k-calculator">
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        401(k) Calculator
      </Typography>
      
      <Typography variant="body1" className="mb-6 text-center text-gray-600 max-w-3xl mx-auto">
        Plan your 401(k) contributions, maximize employer matching, and project your retirement savings.
      </Typography>

      {/* Savings Overview */}
      <Card sx={{ mb: 3, bgcolor: `${savingsAssessment.color}.50`, border: '1px solid', borderColor: `${savingsAssessment.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${savingsAssessment.color}.main`} fontWeight="bold">
                {contributionPercent.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Contribution Rate</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{savingsAssessment.level} Savings Rate</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((contributionPercent / 15) * 100, 100)}
                color={savingsAssessment.color as 'success' | 'warning' | 'error'}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">{savingsAssessment.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h5" fontWeight="bold">${finalBalance.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Projected Balance</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab label="Investment Details" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Projections" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Optimization" icon={<AssessmentIcon />} iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Investment Details Tab */}
          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" />
                    Personal Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Current Age"
                        type="number"
                        value={data.currentAge}
                        onChange={(e) => updateData('currentAge', parseInt(e.target.value) || 0)}
                        inputProps={{ min: 18, max: 70 }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Retirement Age"
                        type="number"
                        value={data.retirementAge}
                        onChange={(e) => updateData('retirementAge', parseInt(e.target.value) || 65)}
                        inputProps={{ min: 50, max: 75 }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Annual Income"
                        type="number"
                        value={data.annualIncome}
                        onChange={(e) => updateData('annualIncome', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Years to Retirement:</strong> {yearsToRetirement} years
                    </Typography>
                    <Typography variant="body2">
                      <strong>Monthly Income:</strong> ${monthlyIncome.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                {/* Investment Details */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="primary" />
                    401(k) Details
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Current 401(k) Balance"
                    type="number"
                    value={data.currentBalance}
                    onChange={(e) => updateData('currentBalance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Monthly Contribution"
                        type="number"
                        value={data.monthlyContribution}
                        onChange={(e) => updateData('monthlyContribution', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contribution %"
                        type="number"
                        value={contributionPercent.toFixed(1)}
                        onChange={(e) => updateData('contributionPercent', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employer Match"
                        type="number"
                        value={data.employerMatch}
                        onChange={(e) => updateData('employerMatch', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        helperText="% of your contribution"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Match Limit"
                        type="number"
                        value={data.employerMatchLimit}
                        onChange={(e) => updateData('employerMatchLimit', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">% of salary</InputAdornment>,
                        }}
                        helperText="Maximum matched"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estimated Rate of Return"
                        type="number"
                        value={data.estimatedReturn}
                        onChange={(e) => updateData('estimatedReturn', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Total 401(k) Fees"
                        type="number"
                        value={data.totalFees}
                        onChange={(e) => updateData('totalFees', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Current Match Analysis */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'success.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💰 Employer Match Analysis</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Monthly Match</Typography>
                          <Typography variant="h5" color="success.main" fontWeight="bold">
                            ${monthlyEmployerMatch.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Annual Match</Typography>
                          <Typography variant="h5" color="success.main" fontWeight="bold">
                            ${currentEmployerMatch.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Maximum Possible</Typography>
                          <Typography variant="h5" fontWeight="bold">
                            ${maxEmployerMatch.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Match Efficiency</Typography>
                          <Typography variant="h5" color={currentEmployerMatch >= maxEmployerMatch ? 'success.main' : 'warning.main'} fontWeight="bold">
                            {((currentEmployerMatch / maxEmployerMatch) * 100).toFixed(0)}%
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {currentEmployerMatch < maxEmployerMatch && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Missing Free Money!</strong> You're leaving ${(maxEmployerMatch - currentEmployerMatch).toLocaleString()} per year on the table.
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
                                size="small"
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Projections Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>📈 Retirement Projections</Typography>
              
              <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${finalBalance.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Final Balance</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          ${totalEmployerMatch.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Employer Match</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="info.main" fontWeight="bold">
                          ${totalGrowth.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Investment Growth</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          ${feeImpact.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Fee Impact</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Retirement Income Analysis */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💸 Retirement Income Analysis</Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Monthly Retirement Income (4% rule)</Typography>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${replacementIncome.toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Income Replacement Ratio</Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {replacementRatio.toFixed(0)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(replacementRatio, 100)}
                          color={replacementRatio >= 80 ? 'success' : replacementRatio >= 60 ? 'warning' : 'error'}
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Financial experts recommend replacing 70-90% of pre-retirement income.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Fee Impact Analysis */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💸 Fee Impact Analysis</Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        Cost of {data.totalFees}% annual fees over {yearsToRetirement} years:
                      </Typography>
                      
                      <Typography variant="h4" color="error.main" fontWeight="bold" gutterBottom>
                        ${feeImpact.toLocaleString()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Fee Impact Scenarios:
                      </Typography>

                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Fee Rate</TableCell>
                            <TableCell align="right">Final Balance</TableCell>
                            <TableCell align="right">Lost to Fees</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[0.25, 0.5, 1.0, 1.5, 2.0].map(fee => {
                            const balance = calculateFutureValueWithFees(fee);
                            const lost = calculateFutureValueWithFees(0) - balance;
                            return (
                              <TableRow key={fee}>
                                <TableCell>{fee}%</TableCell>
                                <TableCell align="right">${balance.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ color: 'error.main' }}>
                                  ${lost.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Year-by-Year Projections */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">📅 Year-by-Year Projections</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Age</TableCell>
                              <TableCell align="right">Balance</TableCell>
                              <TableCell align="right">Your Contribution</TableCell>
                              <TableCell align="right">Employer Match</TableCell>
                              <TableCell align="right">Growth</TableCell>
                              <TableCell align="right">Total Growth</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {projections.filter((_, index) => index % 5 === 0 || index === projections.length - 1).map((projection) => (
                              <TableRow key={projection.year}>
                                <TableCell>{projection.age}</TableCell>
                                <TableCell align="right">${projection.balance.toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.yearlyContribution.toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.yearlyEmployerMatch.toLocaleString()}</TableCell>
                                <TableCell align="right">${(projection.balance - (projection.year === 1 ? data.currentBalance : projections[projection.year - 2]?.balance || 0) - projection.yearlyContribution - projection.yearlyEmployerMatch).toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.totalGrowth.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Optimization Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>🎯 401(k) Optimization Strategies</Typography>
              
              <Grid container spacing={3}>
                {/* Contribution Optimization */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💡 Contribution Strategies</Typography>
                      
                      <Alert severity={currentEmployerMatch >= maxEmployerMatch ? 'success' : 'warning'} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Priority #1: Maximize Employer Match</strong>
                          <br />
                          {currentEmployerMatch >= maxEmployerMatch 
                            ? "✅ You're maximizing your employer match!"
                            : `❌ Contribute ${data.employerMatchLimit}% to get full ${data.employerMatch}% match`
                          }
                        </Typography>
                      </Alert>

                      <Typography variant="body2" gutterBottom><strong>Recommended Contribution Levels:</strong></Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Minimum:</strong> {data.employerMatchLimit}% (get full match)</li>
                        <li><strong>Good:</strong> 10-12% (solid retirement savings)</li>
                        <li><strong>Excellent:</strong> 15%+ (on track for comfortable retirement)</li>
                        <li><strong>Maximum (2024):</strong> $23,000 annually</li>
                        <li><strong>Age 50+ Catch-up:</strong> Additional $7,500</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Savings Rate Impact */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>📊 Savings Rate Impact</Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        Impact of different contribution rates:
                      </Typography>

                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Rate</TableCell>
                            <TableCell align="right">Monthly</TableCell>
                            <TableCell align="right">Final Balance</TableCell>
                            <TableCell align="right">Monthly Income</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[6, 10, 15, 20].map(rate => {
                            const monthlyContrib = (data.annualIncome * rate / 100) / 12;
                            const tempData = { ...data, monthlyContribution: monthlyContrib };
                            // Simplified calculation for comparison
                            const finalBal = data.currentBalance * Math.pow(1.06, yearsToRetirement) + 
                              (monthlyContrib * 12 * yearsToRetirement * 1.5);
                            const monthlyIncome = (finalBal * 0.04) / 12;
                            
                            return (
                              <TableRow key={rate}>
                                <TableCell>{rate}%</TableCell>
                                <TableCell align="right">${monthlyContrib.toLocaleString()}</TableCell>
                                <TableCell align="right">${finalBal.toLocaleString()}</TableCell>
                                <TableCell align="right">${monthlyIncome.toLocaleString()}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Tax Benefits */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💰 Tax Benefits</Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Current Annual Tax Savings:</strong>
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" color="success.main" fontWeight="bold">
                          ${((data.monthlyContribution * 12) * 0.22).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Estimated at 22% tax bracket
                        </Typography>
                      </Box>

                      <Typography variant="body2" gutterBottom><strong>Tax Advantages:</strong></Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Contributions reduce current taxable income</li>
                        <li>Tax-deferred growth (no taxes on gains)</li>
                        <li>Potential for lower tax bracket in retirement</li>
                        <li>Employer match is "free money"</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Action Items */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>🎯 Action Items</Typography>
                      
                      <Typography variant="body2" gutterBottom><strong>Immediate Actions:</strong></Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {currentEmployerMatch < maxEmployerMatch && (
                          <li style={{ color: '#f57c00' }}>
                            <strong>Increase contribution to {data.employerMatchLimit}% to maximize match</strong>
                          </li>
                        )}
                        {data.totalFees > 1 && (
                          <li style={{ color: '#f57c00' }}>
                            <strong>Review and reduce fees (current: {data.totalFees}%)</strong>
                          </li>
                        )}
                        {contributionPercent < 10 && (
                          <li>Consider increasing contribution rate to 10-15%</li>
                        )}
                        <li>Review investment allocation annually</li>
                        <li>Consider Roth 401(k) options if available</li>
                        <li>Don't cash out when changing jobs</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Tips */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>💡 401(k) Optimization Tips</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Maximize Your Benefits:</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Always contribute enough to get full employer match</li>
                          <li>Increase contributions by 1% annually</li>
                          <li>Use catch-up contributions if age 50+</li>
                          <li>Consider Roth 401(k) for tax diversification</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Investment Strategy:</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Choose low-cost index funds when possible</li>
                          <li>Maintain appropriate risk level for your age</li>
                          <li>Rebalance portfolio annually</li>
                          <li>Don't panic during market downturns</li>
                        </ul>
                      </Grid>
                    </Grid>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>

        {/* Export Section */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Export Your 401(k) Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Download your retirement projections, contribution strategies, and personalized recommendations
          </Typography>
          <ExportButtons data={prepareExportData()} />
        </Box>
      </Card>
    </Box>
  );
};

export default FourOhOneKCalculator; 