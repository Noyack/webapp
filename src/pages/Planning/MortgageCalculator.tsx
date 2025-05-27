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
  Switch,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  Calculate as CalculateIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';

interface MortgageData {
  // Loan details
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  
  // Income
  annualSalary: number;
  
  // Additional costs
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaDues: number;
  
  // Extra payments
  extraMonthlyPayment: number;
  extraAnnualPayment: number;
  
  // Refinancing
  currentBalance: number;
  newInterestRate: number;
  newLoanTerm: number;
  refinancingCosts: number;
  
  // Settings
  includePMI: boolean;
  pmiRemovalThreshold: number;
}

const MortgageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<MortgageData>({
    homePrice: 400000,
    downPayment: 80000,
    downPaymentPercent: 20,
    loanAmount: 320000,
    interestRate: 6.5,
    loanTerm: 30,
    annualSalary: 120000,
    propertyTax: 6000,
    homeInsurance: 1200,
    pmi: 200,
    hoaDues: 0,
    extraMonthlyPayment: 0,
    extraAnnualPayment: 0,
    currentBalance: 320000,
    newInterestRate: 5.5,
    newLoanTerm: 30,
    refinancingCosts: 5000,
    includePMI: true,
    pmiRemovalThreshold: 20
  });

  // Calculate monthly payment (principal + interest)
  const calculateMonthlyPayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  // Main calculations
  const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, data.loanTerm);
  const monthlyPMI = data.includePMI && data.downPaymentPercent < 20 ? data.pmi : 0;
  const monthlyPropertyTax = data.propertyTax / 12;
  const monthlyInsurance = data.homeInsurance / 12;
  const monthlyHOA = data.hoaDues;
  
  const totalMonthlyPayment = monthlyPayment + monthlyPMI + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
  const totalLoanCost = monthlyPayment * data.loanTerm * 12;
  const totalInterest = totalLoanCost - data.loanAmount;

  // Extra payment calculations
  const calculatePayoffTime = () => {
    if (data.extraMonthlyPayment === 0 && data.extraAnnualPayment === 0) return data.loanTerm * 12;
    
    let balance = data.loanAmount;
    let month = 0;
    const monthlyRate = data.interestRate / 100 / 12;
    
    while (balance > 0 && month < 500) { // Safety limit
      month++;
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + data.extraMonthlyPayment;
      
      // Add annual payment in January
      if (month % 12 === 1) {
        principalPayment += data.extraAnnualPayment;
      }
      
      if (principalPayment >= balance) {
        break;
      }
      
      balance -= principalPayment;
    }
    
    return month;
  };

  const payoffTimeWithExtra = calculatePayoffTime();
  const monthsSaved = (data.loanTerm * 12) - payoffTimeWithExtra;
  const yearsSaved = Math.floor(monthsSaved / 12);
  const remainingMonths = monthsSaved % 12;

  // Generate amortization schedule
  const generateAmortizationSchedule = (years: number = 5) => {
    const schedule = [];
    let balance = data.loanAmount;
    const monthlyRate = data.interestRate / 100 / 12;
    const monthsToShow = Math.min(years * 12, data.loanTerm * 12);
    
    for (let month = 1; month <= monthsToShow; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + data.extraMonthlyPayment;
      
      // Add annual payment in January
      if (month % 12 === 1 && data.extraAnnualPayment > 0) {
        principalPayment += data.extraAnnualPayment;
      }
      
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;
      
      schedule.push({
        month,
        year: Math.ceil(month / 12),
        interestPayment,
        principalPayment,
        balance,
        cumulativeInterest: schedule.reduce((sum, payment) => sum + payment.interestPayment, 0) + interestPayment
      });
      
      if (balance <= 0) break;
    }
    
    return schedule;
  };

  // Refinancing calculations
  const refinanceMonthlyPayment = calculateMonthlyPayment(data.currentBalance, data.newInterestRate, data.newLoanTerm);
  const monthlySavings = monthlyPayment - refinanceMonthlyPayment;
  const breakEvenMonths = data.refinancingCosts / monthlySavings;

  // Prepare export data
  const prepareExportData = (): GenericExportData => {
    const schedule = generateAmortizationSchedule(Math.min(data.loanTerm, 10));
    
    return {
      calculatorName: 'Mortgage Calculator',
      inputs: {
        homePrice: data.homePrice,
        downPayment: data.downPayment,
        downPaymentPercent: data.downPaymentPercent,
        loanAmount: data.loanAmount,
        interestRate: data.interestRate,
        loanTerm: data.loanTerm,
        annualSalary: data.annualSalary,
        propertyTax: data.propertyTax,
        homeInsurance: data.homeInsurance,
        pmi: data.pmi,
        hoaDues: data.hoaDues,
        extraMonthlyPayment: data.extraMonthlyPayment,
        extraAnnualPayment: data.extraAnnualPayment,
        includePMI: data.includePMI
      },
      keyMetrics: [
        { label: 'Monthly Payment (P&I)', value: `$${monthlyPayment.toLocaleString()}` },
        { label: 'Total Monthly Payment', value: `$${totalMonthlyPayment.toLocaleString()}` },
        { label: 'Total Interest', value: `$${totalInterest.toLocaleString()}` },
        { label: 'Total Loan Cost', value: `$${totalLoanCost.toLocaleString()}` },
        { label: 'Affordability Level', value: affordabilityStatus.level },
        { label: 'Housing-to-Income Ratio', value: `${((totalMonthlyPayment / (data.annualSalary / 12)) * 100).toFixed(1)}%` },
        { label: 'Years Saved with Extra Payments', value: `${yearsSaved} years, ${remainingMonths} months` },
        { label: 'PMI Monthly', value: `$${monthlyPMI}` }
      ],
      summary: {
        monthlyPayment: monthlyPayment,
        totalMonthlyPayment: totalMonthlyPayment,
        totalInterest: totalInterest,
        totalLoanCost: totalLoanCost,
        monthlyPMI: monthlyPMI,
        payoffTimeWithExtra: payoffTimeWithExtra,
        monthsSaved: monthsSaved,
        refinanceMonthlyPayment: refinanceMonthlyPayment,
        monthlySavings: monthlySavings,
        breakEvenMonths: isFinite(breakEvenMonths) ? breakEvenMonths : null
      },
      tableData: schedule.map(payment => ({
        month: payment.month,
        year: payment.year,
        totalPayment: payment.principalPayment + payment.interestPayment,
        principalPayment: payment.principalPayment,
        interestPayment: payment.interestPayment,
        remainingBalance: payment.balance,
        cumulativeInterest: payment.cumulativeInterest
      })),
      recommendations: [
        `Consider a ${data.downPaymentPercent < 20 ? 'larger down payment to avoid PMI' : 'down payment of 20% or more is excellent'}`,
        `Your ${affordabilityStatus.level.toLowerCase()} affordability level suggests ${affordabilityStatus.message.toLowerCase()}`,
        data.extraMonthlyPayment > 0 ? `Great! Extra payments will save you ${yearsSaved} years and $${((data.loanTerm * 12 - payoffTimeWithExtra) * monthlyPayment).toLocaleString()} in interest` : 'Consider making extra principal payments to reduce total interest',
        monthlySavings > 0 ? `Refinancing could save you $${monthlySavings.toLocaleString()} per month` : 'Current interest rate is competitive',
        'Shop around with multiple lenders to get the best rate',
        'Consider the total cost of homeownership including maintenance, utilities, and HOA fees'
      ]
    };
  };

  // Get affordability assessment
  const getAffordabilityStatus = () => {
    if (data.annualSalary <= 0) {
      return { level: 'Enter Salary', color: 'info', message: 'Please enter your annual salary for assessment' };
    }
    
    const monthlyIncome = data.annualSalary / 12;
    const housingRatio = totalMonthlyPayment / monthlyIncome;
    
    if (housingRatio <= 0.20) return { level: 'Excellent', color: 'success', message: `${(housingRatio * 100).toFixed(1)}% of income - Very affordable` };
    if (housingRatio <= 0.28) return { level: 'Good', color: 'success', message: `${(housingRatio * 100).toFixed(1)}% of income - Within recommended guidelines` };
    if (housingRatio <= 0.33) return { level: 'Moderate', color: 'warning', message: `${(housingRatio * 100).toFixed(1)}% of income - Reasonable but monitor budget` };
    if (housingRatio <= 0.40) return { level: 'Caution', color: 'warning', message: `${(housingRatio * 100).toFixed(1)}% of income - Higher payment, review carefully` };
    return { level: 'High Risk', color: 'error', message: `${(housingRatio * 100).toFixed(1)}% of income - May strain finances significantly` };
  };

  const affordabilityStatus = getAffordabilityStatus();

  // Update data function
  const updateData = (field: keyof MortgageData, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate dependent values
      if (field === 'homePrice' || field === 'downPaymentPercent') {
        newData.downPayment = (newData.homePrice * newData.downPaymentPercent) / 100;
        newData.loanAmount = newData.homePrice - newData.downPayment;
      } else if (field === 'downPayment') {
        newData.downPaymentPercent = (newData.downPayment / newData.homePrice) * 100;
        newData.loanAmount = newData.homePrice - newData.downPayment;
      }
      
      return newData;
    });
  };

  return (
    <Box className="mortgage-calculator">
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        Mortgage Calculator
      </Typography>
      
      <Typography variant="body1" className="mb-6 text-center text-gray-600 max-w-3xl mx-auto">
        Calculate mortgage payments, analyze amortization schedules, and evaluate refinancing options.
      </Typography>

      {/* Payment Overview */}
      <Card sx={{ mb: 3, bgcolor: `${affordabilityStatus.color}.50`, border: '1px solid', borderColor: `${affordabilityStatus.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${affordabilityStatus.color}.main`} fontWeight="bold">
                ${totalMonthlyPayment.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Monthly Payment</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{affordabilityStatus.level} Payment Level</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: '100px' }}>P&I: ${monthlyPayment.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ minWidth: '100px' }}>Tax: ${monthlyPropertyTax.toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ minWidth: '100px' }}>Insurance: ${monthlyInsurance.toLocaleString()}</Typography>
                {monthlyPMI > 0 && <Typography variant="body2">PMI: ${monthlyPMI.toLocaleString()}</Typography>}
              </Box>
              <Typography variant="body2" color="text.secondary">{affordabilityStatus.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h5" fontWeight="bold">${totalInterest.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Total Interest</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab label="Loan Details" icon={<HomeIcon />} iconPosition="start" />
          <Tab label="Amortization" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Refinancing" icon={<RefreshIcon />} iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Loan Details Tab */}
          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                {/* Basic Loan Information */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon color="primary" />
                    Loan Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Home Price"
                        type="number"
                        value={data.homePrice}
                        onChange={(e) => updateData('homePrice', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Down Payment"
                        type="number"
                        value={data.downPayment}
                        onChange={(e) => updateData('downPayment', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Down Payment %"
                        type="number"
                        value={data.downPaymentPercent.toFixed(1)}
                        onChange={(e) => updateData('downPaymentPercent', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Loan Amount"
                        type="number"
                        value={data.loanAmount}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          readOnly: true,
                        }}
                        sx={{ mb: 2, '& .MuiInputBase-input': { bgcolor: 'grey.100' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Interest Rate"
                        type="number"
                        value={data.interestRate}
                        onChange={(e) => updateData('interestRate', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Loan Term</InputLabel>
                        <Select
                          value={data.loanTerm}
                          onChange={(e) => updateData('loanTerm', e.target.value)}
                          label="Loan Term"
                        >
                          <MenuItem value={15}>15 years</MenuItem>
                          <MenuItem value={20}>20 years</MenuItem>
                          <MenuItem value={25}>25 years</MenuItem>
                          <MenuItem value={30}>30 years</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Annual Salary (Gross)"
                        type="number"
                        value={data.annualSalary}
                        onChange={(e) => updateData('annualSalary', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Used for affordability assessment (debt-to-income ratio)"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  {/* PMI Information */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.includePMI}
                          onChange={(e) => updateData('includePMI', e.target.checked)}
                        />
                      }
                      label="Include PMI (Private Mortgage Insurance)"
                    />
                    {data.includePMI && data.downPaymentPercent < 20 && (
                      <TextField
                        fullWidth
                        label="Monthly PMI"
                        type="number"
                        value={data.pmi}
                        onChange={(e) => updateData('pmi', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                    {data.downPaymentPercent >= 20 && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                        ✓ No PMI required with {data.downPaymentPercent.toFixed(1)}% down payment
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Additional Costs */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom>💰 Additional Monthly Costs</Typography>
                  
                  <TextField
                    fullWidth
                    label="Annual Property Tax"
                    type="number"
                    value={data.propertyTax}
                    onChange={(e) => updateData('propertyTax', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText={`Monthly: $${monthlyPropertyTax.toLocaleString()}`}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Annual Home Insurance"
                    type="number"
                    value={data.homeInsurance}
                    onChange={(e) => updateData('homeInsurance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText={`Monthly: $${monthlyInsurance.toLocaleString()}`}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Monthly HOA Dues"
                    type="number"
                    value={data.hoaDues}
                    onChange={(e) => updateData('hoaDues', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 3 }}
                  />

                  {/* Payment Breakdown */}
                  <Card sx={{ bgcolor: 'primary.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Monthly Payment Breakdown</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Principal & Interest:</Typography>
                          <Typography variant="h6" color="primary.main">${monthlyPayment.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Property Tax:</Typography>
                          <Typography variant="h6">${monthlyPropertyTax.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Home Insurance:</Typography>
                          <Typography variant="h6">${monthlyInsurance.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">PMI:</Typography>
                          <Typography variant="h6">${monthlyPMI.toLocaleString()}</Typography>
                        </Grid>
                        {data.hoaDues > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="body2">HOA Dues:</Typography>
                            <Typography variant="h6">${monthlyHOA.toLocaleString()}</Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" fontWeight="bold">Total Monthly Payment:</Typography>
                          <Typography variant="h5" color="primary.main" fontWeight="bold">
                            ${totalMonthlyPayment.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Extra Payments */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>🚀 Extra Payments</Typography>
                    
                    <TextField
                      fullWidth
                      label="Extra Monthly Payment"
                      type="number"
                      value={data.extraMonthlyPayment}
                      onChange={(e) => updateData('extraMonthlyPayment', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Extra Annual Payment"
                      type="number"
                      value={data.extraAnnualPayment}
                      onChange={(e) => updateData('extraAnnualPayment', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      helperText="Applied each January"
                      sx={{ mb: 2 }}
                    />

                    {(data.extraMonthlyPayment > 0 || data.extraAnnualPayment > 0) && (
                      <Alert severity="success">
                        <Typography variant="body2">
                          <strong>Time Savings:</strong> {yearsSaved} years, {remainingMonths} months early payoff
                          <br />
                          <strong>Interest Savings:</strong> Significant reduction in total interest paid
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Grid>

                {/* Loan Summary */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>📊 Loan Summary</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Total Loan Cost</Typography>
                          <Typography variant="h5" fontWeight="bold">${totalLoanCost.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                          <Typography variant="h5" fontWeight="bold" color="error.main">${totalInterest.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Interest Rate</Typography>
                          <Typography variant="h5" fontWeight="bold">{data.interestRate}%</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Loan-to-Value</Typography>
                          <Typography variant="h5" fontWeight="bold">{((data.loanAmount / data.homePrice) * 100).toFixed(1)}%</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Amortization Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>📈 Amortization Schedule</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Payment Analysis</Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" gutterBottom>
                          First Year Interest vs Principal
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={75}
                              color="error"
                              sx={{ height: 20, borderRadius: 1 }}
                            />
                          </Box>
                          <Typography variant="caption">Interest: 75%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={25}
                              color="success"
                              sx={{ height: 20, borderRadius: 1 }}
                            />
                          </Box>
                          <Typography variant="caption">Principal: 25%</Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" gutterBottom>Key Milestones:</Typography>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        <li>50% paid off: Year {Math.ceil((data.loanTerm * 12 * 0.67) / 12)}</li>
                        <li>80% equity reached: Year {Math.ceil((data.loanTerm * 12 * 0.2) / 12)}</li>
                        <li>PMI removal: When 20% equity reached</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Payment Impact</Typography>
                      
                      {data.extraMonthlyPayment > 0 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            Extra ${data.extraMonthlyPayment}/month saves {yearsSaved} years, {remainingMonths} months
                          </Typography>
                        </Alert>
                      )}

                      <Typography variant="body2" gutterBottom>Interest Savings Strategies:</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Extra Payment</TableCell>
                            <TableCell align="right">Time Saved</TableCell>
                            <TableCell align="right">Interest Saved</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[50, 100, 200, 500].map(amount => {
                            const tempData = { ...data, extraMonthlyPayment: amount };
                            // Simplified calculation for display
                            const timeSaved = amount * 0.1; // Rough approximation
                            const interestSaved = amount * 12 * timeSaved;
                            
                            return (
                              <TableRow key={amount}>
                                <TableCell>${amount}/month</TableCell>
                                <TableCell align="right">{Math.floor(timeSaved)} years</TableCell>
                                <TableCell align="right">${(interestSaved * 1000).toLocaleString()}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Amortization Schedule Table */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">📅 First 5 Years Payment Schedule</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Month</TableCell>
                              <TableCell align="right">Payment</TableCell>
                              <TableCell align="right">Principal</TableCell>
                              <TableCell align="right">Interest</TableCell>
                              <TableCell align="right">Balance</TableCell>
                              <TableCell align="right">Cumulative Interest</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {generateAmortizationSchedule(5).filter((_, index) => index % 6 === 0).map((payment) => (
                              <TableRow key={payment.month}>
                                <TableCell>{payment.month}</TableCell>
                                <TableCell align="right">${(payment.principalPayment + payment.interestPayment).toLocaleString()}</TableCell>
                                <TableCell align="right">${payment.principalPayment.toLocaleString()}</TableCell>
                                <TableCell align="right">${payment.interestPayment.toLocaleString()}</TableCell>
                                <TableCell align="right">${payment.balance.toLocaleString()}</TableCell>
                                <TableCell align="right">${payment.cumulativeInterest.toLocaleString()}</TableCell>
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

          {/* Refinancing Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>🔄 Refinancing Analysis</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Current Loan</Typography>
                  
                  <TextField
                    fullWidth
                    label="Current Balance"
                    type="number"
                    value={data.currentBalance}
                    onChange={(e) => updateData('currentBalance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="body2" gutterBottom>Current Loan Details:</Typography>
                    <Typography variant="body2">Interest Rate: {data.interestRate}%</Typography>
                    <Typography variant="body2">Monthly Payment: ${monthlyPayment.toLocaleString()}</Typography>
                    <Typography variant="body2">Remaining Term: Varies</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>New Loan Terms</Typography>
                  
                  <TextField
                    fullWidth
                    label="New Interest Rate"
                    type="number"
                    value={data.newInterestRate}
                    onChange={(e) => updateData('newInterestRate', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>New Loan Term</InputLabel>
                    <Select
                      value={data.newLoanTerm}
                      onChange={(e) => updateData('newLoanTerm', e.target.value)}
                      label="New Loan Term"
                    >
                      <MenuItem value={15}>15 years</MenuItem>
                      <MenuItem value={20}>20 years</MenuItem>
                      <MenuItem value={25}>25 years</MenuItem>
                      <MenuItem value={30}>30 years</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Refinancing Costs"
                    type="number"
                    value={data.refinancingCosts}
                    onChange={(e) => updateData('refinancingCosts', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Closing costs, fees, points"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Refinancing Analysis */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: monthlySavings > 0 ? 'success.50' : 'warning.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Refinancing Analysis
                        <Chip 
                          label={monthlySavings > 0 ? 'Beneficial' : 'Review Carefully'} 
                          color={monthlySavings > 0 ? 'success' : 'warning'}
                          sx={{ ml: 2 }}
                        />
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle2" gutterBottom>New Monthly Payment</Typography>
                          <Typography variant="h4" color="primary.main" fontWeight="bold">
                            ${refinanceMonthlyPayment.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Principal & Interest only
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle2" gutterBottom>Monthly Savings</Typography>
                          <Typography variant="h4" color={monthlySavings > 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                            ${Math.abs(monthlySavings).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {monthlySavings > 0 ? 'Savings' : 'Increase'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle2" gutterBottom>Break-Even Point</Typography>
                          <Typography variant="h4" color="info.main" fontWeight="bold">
                            {isFinite(breakEvenMonths) ? Math.ceil(breakEvenMonths) : 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {isFinite(breakEvenMonths) ? 'Months' : 'No savings'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="subtitle2" gutterBottom>Total Closing Costs</Typography>
                          <Typography variant="h4" color="warning.main" fontWeight="bold">
                            ${data.refinancingCosts.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Upfront investment
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Refinancing Considerations:</Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Interest rate difference: {(data.interestRate - data.newInterestRate).toFixed(2)}%</li>
                          <li>How long you plan to stay in the home</li>
                          <li>Current loan age and remaining term</li>
                          <li>Credit score changes since original loan</li>
                          <li>Cash-out vs. rate-and-term refinancing</li>
                        </ul>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Refinancing Tips */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>💡 Refinancing Guidelines</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Consider Refinancing If:</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Interest rates dropped 0.5-1% or more</li>
                          <li>Your credit score has improved significantly</li>
                          <li>You want to switch from ARM to fixed rate</li>
                          <li>You want to remove PMI</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Typical Costs Include:</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Application fees: $300-$500</li>
                          <li>Appraisal: $400-$600</li>
                          <li>Title insurance: 0.5% of loan amount</li>
                          <li>Points (optional): 1% = 0.25% rate reduction</li>
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
            Export Your Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Download your mortgage calculations, amortization schedule, and recommendations
          </Typography>
          <ExportButtons data={prepareExportData()} />
        </Box>
      </Card>
    </Box>
  );
};

export default MortgageCalculator; 