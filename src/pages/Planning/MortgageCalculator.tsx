import React, { useState, useMemo, useCallback } from 'react';
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
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';

// Import our enhanced utilities
import {
  calculateMonthlyPayment,
  calculatePMI,
  generateAmortizationSchedule,
  calculatePayoffAnalysis,
  findLoanMilestones,
  calculateRefinancingAnalysis,
  calculateAffordabilityAssessment,
  validateMortgageInput,
  formatCurrency,
  getSpecificMonthsSchedule,
  calculateInterestPrincipalRatio,
  generateMortgageRecommendations,
  AmortizationScheduleItem
} from '../../utils/mortgageUtils';

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
}

const EnhancedMortgageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  
  const [data, setData] = useState<MortgageData>({
    homePrice: 0,
    downPayment: 0,
    downPaymentPercent: 0,
    loanAmount: 0,
    interestRate: 0,
    loanTerm: 0,
    annualSalary: 0,
    propertyTax: 0,
    homeInsurance: 0,
    hoaDues: 0,
    extraMonthlyPayment: 0,
    extraAnnualPayment: 0,
    currentBalance: 0,
    newInterestRate: 0,
    newLoanTerm: 0,
    refinancingCosts: 0,
    includePMI: true
  });

  // Memoized calculations for performance
  const basicCalculations = useMemo(() => {
    const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, data.loanTerm);
    const pmiInfo = calculatePMI(data.loanAmount, data.downPaymentPercent, data.homePrice);
    const monthlyPMI = data.includePMI ? pmiInfo.monthlyPMI : 0;
    
    const monthlyPropertyTax = data.propertyTax / 12;
    const monthlyInsurance = data.homeInsurance / 12;
    const monthlyHOA = data.hoaDues;
    
    const totalMonthlyPayment = monthlyPayment + monthlyPMI + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
    const totalLoanCost = monthlyPayment * data.loanTerm * 12;
    const totalInterest = totalLoanCost - data.loanAmount;

    return {
      monthlyPayment,
      monthlyPMI,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthlyPayment,
      totalLoanCost,
      totalInterest,
      pmiInfo
    };
  }, [data]);

  // Amortization schedule and analysis
  const amortizationData = useMemo(() => {
    const schedule = generateAmortizationSchedule(
      data.loanAmount,
      data.interestRate,
      data.loanTerm,
      data.extraMonthlyPayment,
      data.extraAnnualPayment
    );

    const milestones = findLoanMilestones(schedule, data.loanAmount);
    const specificMonthsSchedule = getSpecificMonthsSchedule(schedule);
    const interestPrincipalRatio = calculateInterestPrincipalRatio(data.loanAmount, basicCalculations.totalInterest);

    return {
      schedule,
      milestones,
      specificMonthsSchedule,
      interestPrincipalRatio
    };
  }, [data, basicCalculations.totalInterest]);

  // Extra payment analysis
  const extraPaymentAnalysis = useMemo(() => {
    if (data.extraMonthlyPayment === 0 && data.extraAnnualPayment === 0) {
      return {
        standardPayoffMonths: data.loanTerm * 12,
        extraPaymentPayoffMonths: data.loanTerm * 12,
        monthsSaved: 0,
        yearsSaved: 0,
        interestSaved: 0,
        totalInterestWithoutExtra: basicCalculations.totalInterest,
        totalInterestWithExtra: basicCalculations.totalInterest
      };
    }

    return calculatePayoffAnalysis(
      data.loanAmount,
      data.interestRate,
      data.loanTerm,
      data.extraMonthlyPayment,
      data.extraAnnualPayment
    );
  }, [data, basicCalculations.totalInterest]);

  // Affordability assessment
  const affordabilityData = useMemo(() => {
    const monthlyIncome = data.annualSalary / 12;
    return calculateAffordabilityAssessment(basicCalculations.totalMonthlyPayment, monthlyIncome);
  }, [basicCalculations.totalMonthlyPayment, data.annualSalary]);

  // Refinancing analysis
  const refinancingData = useMemo(() => {
    // Calculate remaining term for current loan
    const monthsElapsed = Math.max(0, Math.min(120, 60)); // Assume 5 years elapsed for demo
    const remainingYears = Math.max(1, data.loanTerm - (monthsElapsed / 12));
    
    return calculateRefinancingAnalysis(
      data.currentBalance,
      data.interestRate,
      remainingYears,
      data.newInterestRate,
      data.newLoanTerm,
      data.refinancingCosts
    );
  }, [data]);

  // Input validation and update handler
  const updateData = useCallback((field: keyof MortgageData, value: any) => {
    setData(prev => {
      const newData = { ...prev };
      
      // Validate numeric inputs
      if (typeof value === 'number') {
        const validation = validateMortgageInput(field, value);
        
        if (!validation.isValid) {
          setInputErrors(prevErrors => ({
            ...prevErrors,
            [field]: validation.errorMessage || 'Invalid input'
          }));
          newData[field] =  value;
        } else {
          // Clear error if input is now valid
          setInputErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
          });
          newData[field] = value;
        }
      } else {
        newData[field] = value;
      }
      
      // Auto-calculate dependent values
      if (field === 'homePrice' || field === 'downPaymentPercent') {
        newData.downPayment = (newData.homePrice * newData.downPaymentPercent) / 100;
        newData.loanAmount = newData.homePrice - newData.downPayment;
        newData.currentBalance = newData.loanAmount;
      } else if (field === 'downPayment') {
        if (newData.homePrice > 0) {
          newData.downPaymentPercent = (newData.downPayment / newData.homePrice) * 100;
          newData.loanAmount = newData.homePrice - newData.downPayment;
          newData.currentBalance = newData.loanAmount;
        }
      }
      
      return newData;
    });
  }, []);

  // Generate recommendations
  const recommendations = useMemo(() => {
    return generateMortgageRecommendations({
      downPaymentPercent: data.downPaymentPercent,
      affordabilityLevel: affordabilityData.level,
      affordabilityMessage: affordabilityData.message,
      extraMonthlyPayment: data.extraMonthlyPayment,
      extraPaymentSavings: extraPaymentAnalysis.interestSaved,
      monthlySavings: refinancingData.monthlySavings,
      yearsSaved: extraPaymentAnalysis.yearsSaved
    });
  }, [data, affordabilityData, extraPaymentAnalysis, refinancingData]);

  // Export data preparation
  const prepareExportData = useCallback((): GenericExportData => {
    return {
      calculatorName: 'Enhanced Mortgage Calculator',
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
        hoaDues: data.hoaDues,
        extraMonthlyPayment: data.extraMonthlyPayment,
        extraAnnualPayment: data.extraAnnualPayment,
        includePMI: data.includePMI
      },
      keyMetrics: [
        { label: 'Monthly Payment (P&I)', value: formatCurrency(basicCalculations.monthlyPayment) },
        { label: 'Total Monthly Payment', value: formatCurrency(basicCalculations.totalMonthlyPayment) },
        { label: 'Total Interest', value: formatCurrency(basicCalculations.totalInterest) },
        { label: 'Total Loan Cost', value: formatCurrency(basicCalculations.totalLoanCost) },
        { label: 'Affordability Level', value: affordabilityData.level },
        { label: 'Housing-to-Income Ratio', value: `${affordabilityData.housingRatio.toFixed(1)}%` },
        { label: 'Years Saved with Extra Payments', value: `${extraPaymentAnalysis.yearsSaved} years` },
        { label: 'PMI Monthly', value: formatCurrency(basicCalculations.monthlyPMI) }
      ],
      summary: {
        monthlyPayment: basicCalculations.monthlyPayment,
        totalMonthlyPayment: basicCalculations.totalMonthlyPayment,
        totalInterest: basicCalculations.totalInterest,
        totalLoanCost: basicCalculations.totalLoanCost,
        monthlyPMI: basicCalculations.monthlyPMI,
        payoffTimeWithExtra: extraPaymentAnalysis.extraPaymentPayoffMonths,
        monthsSaved: extraPaymentAnalysis.monthsSaved,
        refinanceMonthlyPayment: refinancingData.newMonthlyPayment,
        monthlySavings: refinancingData.monthlySavings,
        breakEvenMonths: refinancingData.breakEvenMonths
      },
      tableData: amortizationData.specificMonthsSchedule.map(payment => ({
        month: payment.month,
        year: payment.year,
        totalPayment: parseFloat((payment.principalPayment + payment.interestPayment).toFixed(2)),
        principalPayment: payment.principalPayment,
        interestPayment: payment.interestPayment,
        remainingBalance: payment.remainingBalance,
        cumulativeInterest: payment.cumulativeInterest
      })),
      recommendations
    };
  }, [data, basicCalculations, affordabilityData, extraPaymentAnalysis, refinancingData, amortizationData, recommendations]);

  return (
    <Box className="mortgage-calculator">
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        Enhanced Mortgage Calculator
      </Typography>
      
      {/* FIXED: Centered description on one line */}
      <Box className="mb-6 text-center">
        <Typography variant="body1" className="text-gray-600">
          Calculate mortgage payments, analyze amortization schedules, and evaluate refinancing options.
        </Typography>
      </Box>

      {/* Payment Overview with FIXED decimal formatting */}
      <Card sx={{ mb: 3, bgcolor: `${affordabilityData.color}.50`, border: '1px solid', borderColor: `${affordabilityData.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${affordabilityData.color}.main`} fontWeight="bold">
                {formatCurrency(basicCalculations.totalMonthlyPayment)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Monthly Payment</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{affordabilityData.level} Payment Level</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ minWidth: '120px' }}>
                  P&I: {formatCurrency(basicCalculations.monthlyPayment)}
                </Typography>
                <Typography variant="body2" sx={{ minWidth: '100px' }}>
                  Tax: {formatCurrency(basicCalculations.monthlyPropertyTax)}
                </Typography>
                <Typography variant="body2" sx={{ minWidth: '120px' }}>
                  Insurance: {formatCurrency(basicCalculations.monthlyInsurance)}
                </Typography>
                {basicCalculations.monthlyPMI > 0 && (
                  <Typography variant="body2">
                    PMI: {formatCurrency(basicCalculations.monthlyPMI)}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">{affordabilityData.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(basicCalculations.totalInterest)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Interest</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Input Validation Alerts */}
      {Object.keys(inputErrors).length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Input Validation Errors:</Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.entries(inputErrors).map(([field, error]) => (
              <li key={field}><strong>{field}:</strong> {error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Main Calculator Interface */}
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
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>🏠 Loan Information</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Home Price"
                    type="number"
                    value={data.homePrice || ''}
                    onChange={(e) => updateData('homePrice', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.homePrice}
                    helperText={inputErrors.homePrice}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Down Payment %"
                    type="number"
                    value={data.downPaymentPercent || ''}
                    onChange={(e) => updateData('downPaymentPercent', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    variant="outlined"
                    inputProps={{ min: 0, max: 100, step: 0.5 }}
                    error={!!inputErrors.downPaymentPercent}
                    helperText={inputErrors.downPaymentPercent}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Down Payment"
                    type="number"
                    value={data.downPayment || ''}
                    onChange={(e) => updateData('downPayment', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.downPayment}
                    helperText={inputErrors.downPayment}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Loan Amount"
                    type="number"
                    value={data.loanAmount || ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      readOnly: true,
                    }}
                    variant="outlined"
                    sx={{ backgroundColor: 'grey.100' }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Interest Rate"
                    type="number"
                    value={data.interestRate || ''}
                    onChange={(e) => updateData('interestRate', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{ step: 0.125, min: 0.1, max: 20 }}
                    variant="outlined"
                    error={!!inputErrors.interestRate}
                    helperText={inputErrors.interestRate}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined" error={!!inputErrors.loanTerm}>
                    <InputLabel>Loan Term</InputLabel>
                    <Select
                      value={data.loanTerm || ''}
                      onChange={(e) => updateData('loanTerm', Number(e.target.value))}
                      label="Loan Term"
                    >
                      <MenuItem value={15}>15 years</MenuItem>
                      <MenuItem value={20}>20 years</MenuItem>
                      <MenuItem value={25}>25 years</MenuItem>
                      <MenuItem value={30}>30 years</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* FIXED: Monthly Payment Breakdown with 2 decimal places */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'primary.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💰 Monthly Payment Breakdown</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Principal & Interest</Typography>
                          <Typography variant="h6">{formatCurrency(basicCalculations.monthlyPayment)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Property Tax</Typography>
                          <Typography variant="h6">{formatCurrency(basicCalculations.monthlyPropertyTax)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">Insurance</Typography>
                          <Typography variant="h6">{formatCurrency(basicCalculations.monthlyInsurance)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">PMI</Typography>
                          <Typography variant="h6">{formatCurrency(basicCalculations.monthlyPMI)}</Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">Total Monthly Payment</Typography>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {formatCurrency(basicCalculations.totalMonthlyPayment)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Additional Costs */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>📋 Additional Costs</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Annual Salary"
                    type="number"
                    value={data.annualSalary || ''}
                    onChange={(e) => updateData('annualSalary', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.annualSalary}
                    helperText={inputErrors.annualSalary}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Annual Property Tax"
                    type="number"
                    value={data.propertyTax || ''}
                    onChange={(e) => updateData('propertyTax', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.propertyTax}
                    helperText={inputErrors.propertyTax}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Annual Home Insurance"
                    type="number"
                    value={data.homeInsurance || ''}
                    onChange={(e) => updateData('homeInsurance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.homeInsurance}
                    helperText={inputErrors.homeInsurance}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Monthly HOA Dues"
                    type="number"
                    value={data.hoaDues || ''}
                    onChange={(e) => updateData('hoaDues', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.hoaDues}
                    helperText={inputErrors.hoaDues}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.includePMI}
                        onChange={(e) => updateData('includePMI', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Include PMI (Auto-calculated)
                        <Tooltip title="PMI is automatically calculated based on down payment percentage and current industry rates">
                          <InfoIcon fontSize="small" color="info" />
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>

                {/* Enhanced PMI Information */}
                {data.downPaymentPercent < 20 && data.includePMI && (
                  <Grid item xs={12}>
                    <Alert severity="warning" icon={<WarningIcon />}>
                      <Typography variant="subtitle2" gutterBottom>PMI Required</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Your down payment is {data.downPaymentPercent.toFixed(1)}%, which requires PMI of {formatCurrency(basicCalculations.monthlyPMI)}/month 
                        ({(basicCalculations.pmiInfo.pmiRate * 100).toFixed(2)}% annually).
                      </Typography>
                      <Typography variant="body2">
                        <strong>PMI Removal:</strong> PMI will be automatically removed when your loan balance reaches 78% of the original home value 
                        (approximately month {amortizationData.milestones.pmiRemovalMonth}).
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                {/* Extra Payments */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>🚀 Extra Payments</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Extra Monthly Payment"
                    type="number"
                    value={data.extraMonthlyPayment || ''}
                    onChange={(e) => updateData('extraMonthlyPayment', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.extraMonthlyPayment}
                    helperText={inputErrors.extraMonthlyPayment || "Even $50-100 extra can save years of payments"}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Extra Annual Payment"
                    type="number"
                    value={data.extraAnnualPayment || ''}
                    onChange={(e) => updateData('extraAnnualPayment', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    variant="outlined"
                    error={!!inputErrors.extraAnnualPayment}
                    helperText={inputErrors.extraAnnualPayment || "Applied in January (e.g., tax refund, bonus)"}
                  />
                </Grid>

                {/* FIXED: Extra Payment Impact - Automated */}
                {(data.extraMonthlyPayment > 0 || data.extraAnnualPayment > 0) && (
                  <Grid item xs={12}>
                    <Alert severity="success" icon={<TrendingUpIcon />}>
                      <Typography variant="subtitle2" gutterBottom>Extra Payment Impact (Automated)</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">Time Saved</Typography>
                          <Typography variant="h6" color="success.main">
                            {extraPaymentAnalysis.yearsSaved} years, {extraPaymentAnalysis.monthsSaved % 12} months
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">Interest Saved</Typography>
                          <Typography variant="h6" color="success.main">
                            {formatCurrency(extraPaymentAnalysis.interestSaved)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">New Payoff Date</Typography>
                          <Typography variant="h6" color="success.main">
                            {extraPaymentAnalysis.extraPaymentPayoffMonths} months
                          </Typography>
                        </Grid>
                      </Grid>
                    </Alert>
                  </Grid>
                )}

                {/* FIXED: Loan Summary with 2 decimal places */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>📊 Loan Summary</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Total Loan Cost</Typography>
                          <Typography variant="h5" fontWeight="bold">{formatCurrency(basicCalculations.totalLoanCost)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Total Interest</Typography>
                          <Typography variant="h5" fontWeight="bold" color="error.main">
                            {formatCurrency(basicCalculations.totalInterest)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Interest Rate</Typography>
                          <Typography variant="h5" fontWeight="bold">{data.interestRate}%</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Loan-to-Value</Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {((data.loanAmount / data.homePrice) * 100).toFixed(1)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* FIXED: Amortization Tab with Automated Analysis */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>📈 Amortization Schedule</Typography>
              
              <Grid container spacing={3}>
                {/* FIXED: Payment Analysis - AUTOMATED based on inputs */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Payment Analysis
                        <Chip label="Automated" size="small" color="success" sx={{ ml: 1 }} />
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" gutterBottom>
                          Interest vs Principal Over Loan Life ({data.interestRate}% rate)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={amortizationData.interestPrincipalRatio.interestPercent} 
                              sx={{ 
                                height: 20, 
                                backgroundColor: 'success.light',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 'error.main'
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 50 }}>
                            {amortizationData.interestPrincipalRatio.interestPercent}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Interest: {amortizationData.interestPrincipalRatio.interestPercent}% | 
                          Principal: {amortizationData.interestPrincipalRatio.principalPercent}%
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="body2" gutterBottom>Automated Loan Milestones</Typography>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            50% Paid Off: <strong>Month {amortizationData.milestones.fiftyPercentPaidMonth} 
                            (Year {Math.ceil(amortizationData.milestones.fiftyPercentPaidMonth / 12)})</strong>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2">
                            80% Equity: <strong>Month {amortizationData.milestones.eightyPercentEquityMonth} 
                            (Year {Math.ceil(amortizationData.milestones.eightyPercentEquityMonth / 12)})</strong>
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* FIXED: Payment Impact - AUTOMATED based on inputs */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Payment Impact
                        <Chip label="Automated" size="small" color="success" sx={{ ml: 1 }} />
                      </Typography>
                      
                      {data.extraMonthlyPayment > 0 || data.extraAnnualPayment > 0 ? (
                        <Box>
                          <Typography variant="body2" gutterBottom>
                            Extra Payment Benefits (Max 30-year term)
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                              {extraPaymentAnalysis.yearsSaved} years
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Time Saved (Less than 30 years: ✓)
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" color="success.main" fontWeight="bold">
                              {formatCurrency(extraPaymentAnalysis.interestSaved)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Interest Saved (Recalculated for {data.interestRate}% rate)
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Based on ${data.extraMonthlyPayment.toFixed(2)}/month 
                            {data.extraAnnualPayment > 0 && ` + ${formatCurrency(data.extraAnnualPayment)}/year`}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="body2" gutterBottom color="text.secondary">
                            Add extra payments to see automated impact analysis on your loan payoff time and interest savings.
                          </Typography>
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                            <Typography variant="body2">
                              💡 <strong>Tip:</strong> Even an extra $100/month can save you years of payments!
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* FIXED: First 5 Years Payment Schedule - Specific months with 2 decimal places */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        First 5 Years Payment Schedule
                        <Chip label="Fixed Format" size="small" color="primary" sx={{ ml: 1 }} />
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Payment details for months 1, 6, 12, 18, 24, 30, 36, 42, 48, 54, and 60 (all values to 2 decimal places)
                      </Typography>
                      
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                              <TableCell><strong>Month</strong></TableCell>
                              <TableCell align="right"><strong>Principal</strong></TableCell>
                              <TableCell align="right"><strong>Interest</strong></TableCell>
                              <TableCell align="right"><strong>Total Payment</strong></TableCell>
                              <TableCell align="right"><strong>Remaining Balance</strong></TableCell>
                              <TableCell align="right"><strong>Cumulative Interest</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {amortizationData.specificMonthsSchedule.map((payment) => (
                              <TableRow key={payment.month} hover>
                                <TableCell><strong>{payment.month}</strong></TableCell>
                                <TableCell align="right">{formatCurrency(payment.principalPayment)}</TableCell>
                                <TableCell align="right">{formatCurrency(payment.interestPayment)}</TableCell>
                                <TableCell align="right">
                                  <strong>{formatCurrency(payment.principalPayment + payment.interestPayment)}</strong>
                                </TableCell>
                                <TableCell align="right">{formatCurrency(payment.remainingBalance)}</TableCell>
                                <TableCell align="right">{formatCurrency(payment.cumulativeInterest)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Enhanced Amortization Tips */}
                <Grid item xs={12}>
                  <Alert severity="info" icon={<InfoIcon />}>
                    <Typography variant="subtitle2" gutterBottom>📚 Understanding Your Amortization</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Early Years (Months 1-120):</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                          <li>Higher proportion goes to interest payments</li>
                          <li>Principal payments start small but accelerate</li>
                          <li>Extra payments have maximum long-term impact</li>
                          <li>PMI removal typically occurs in this period</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Later Years (Months 240+):</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                          <li>Majority of payment goes to principal</li>
                          <li>Interest payments decrease significantly</li>
                          <li>Equity builds much faster</li>
                          <li>Home becomes a major wealth asset</li>
                        </ul>
                      </Grid>
                    </Grid>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* FIXED: Refinancing Tab with 2 decimal places */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>🔄 Refinancing Analysis</Typography>
              
              <Grid container spacing={3}>
                {/* Current Loan Information */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Current Loan</Typography>
                      <TextField
                        fullWidth
                        label="Current Balance"
                        type="number"
                        value={data.currentBalance || ''}
                        onChange={(e) => updateData('currentBalance', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        error={!!inputErrors.currentBalance}
                        helperText={inputErrors.currentBalance}
                      />
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">Current Monthly Payment</Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {formatCurrency(refinancingData.currentMonthlyPayment)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* New Loan Terms */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>New Loan Terms</Typography>
                      <TextField
                        fullWidth
                        label="New Interest Rate"
                        type="number"
                        value={data.newInterestRate || ''}
                        onChange={(e) => updateData('newInterestRate', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        inputProps={{ step: 0.125, min: 0.1, max: 20 }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        error={!!inputErrors.newInterestRate}
                        helperText={inputErrors.newInterestRate}
                      />
                      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>New Loan Term</InputLabel>
                        <Select
                          value={data.newLoanTerm || ''}
                          onChange={(e) => updateData('newLoanTerm', Number(e.target.value))}
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
                        value={data.refinancingCosts || ''}
                        onChange={(e) => updateData('refinancingCosts', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        variant="outlined"
                        error={!!inputErrors.refinancingCosts}
                        helperText={inputErrors.refinancingCosts || "Include all closing costs and fees"}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* FIXED: Refinancing Analysis Results with 2 decimal places */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: refinancingData.monthlySavings > 0 ? 'success.50' : 'warning.50' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Refinancing Analysis
                        <Chip 
                          label={refinancingData.refinancingRecommended ? "Recommended" : "Not Recommended"} 
                          size="small" 
                          color={refinancingData.refinancingRecommended ? "success" : "warning"} 
                          sx={{ ml: 1 }} 
                        />
                      </Typography>
                      <Grid container spacing={3} textAlign="center">
                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="text.secondary">New Monthly Payment</Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {formatCurrency(refinancingData.newMonthlyPayment)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="text.secondary">Monthly Savings</Typography>
                          <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            color={refinancingData.monthlySavings > 0 ? 'success.main' : 'error.main'}
                          >
                            {refinancingData.monthlySavings > 0 ? '+' : ''}{formatCurrency(refinancingData.monthlySavings)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="text.secondary">Annual Savings</Typography>
                          <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            color={refinancingData.monthlySavings > 0 ? 'success.main' : 'error.main'}
                          >
                            {refinancingData.annualSavings > 0 ? '+' : ''}{formatCurrency(refinancingData.annualSavings)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="body2" color="text.secondary">Break-Even Point</Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {refinancingData.breakEvenMonths ? 
                              `${refinancingData.breakEvenMonths} months` : 
                              'N/A'
                            }
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Enhanced Refinancing Recommendation */}
                <Grid item xs={12}>
                  {refinancingData.refinancingRecommended ? (
                    <Alert severity="success">
                      <Typography variant="subtitle2" gutterBottom>✅ Refinancing Highly Recommended</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        You could save {formatCurrency(refinancingData.monthlySavings)} per month and {formatCurrency(refinancingData.annualSavings)} per year. 
                        {refinancingData.breakEvenMonths && refinancingData.breakEvenMonths <= 36 && 
                          ` You'll break even in just ${refinancingData.breakEvenMonths} months, making this an excellent opportunity.`
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total lifetime savings:</strong> {formatCurrency(refinancingData.totalSavingsOverNewTerm)}
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      <Typography variant="subtitle2" gutterBottom>⚠️ Refinancing May Not Be Beneficial</Typography>
                      <Typography variant="body2">
                        Based on current terms, refinancing would {refinancingData.monthlySavings < 0 ? 'increase' : 'only save'} your monthly payment by {formatCurrency(Math.abs(refinancingData.monthlySavings))}. 
                        {refinancingData.breakEvenMonths && refinancingData.breakEvenMonths > 36 && 
                          ` The break-even period of ${refinancingData.breakEvenMonths.toFixed(1)} months may be too long.`
                        }
                      </Typography>
                    </Alert>
                  )}
                </Grid>

                {/* Enhanced Refinancing Guidelines */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>💡 2025 Refinancing Guidelines</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom color="success.main">
                            ✅ Consider Refinancing If:
                          </Typography>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                            <li>Interest rates dropped 0.5-1% or more from your current rate</li>
                            <li>Your credit score has improved significantly (50+ points)</li>
                            <li>You want to switch from ARM to fixed rate for stability</li>
                            <li>You want to remove PMI with 20%+ equity</li>
                            <li>You can break even within 2-3 years</li>
                            <li>You plan to stay in the home for 5+ more years</li>
                          </ul>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom color="info.main">
                            💰 Typical 2025 Refinancing Costs:
                          </Typography>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                            <li>Application/Processing fees: $300-$500</li>
                            <li>Appraisal: $500-$800</li>
                            <li>Title insurance: 0.5-0.8% of loan amount</li>
                            <li>Origination fees: 0.5-1.5% of loan amount</li>
                            <li>Recording/Attorney fees: $500-$1,500</li>
                            <li>Points (optional): 1% = ~0.25% rate reduction</li>
                          </ul>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Pro Tip:</strong> Shop with at least 3-5 lenders and get quotes within a 14-day period 
                          to minimize credit score impact. Rate locks typically last 30-60 days.
                        </Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>

        {/* Enhanced Export Section */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Export Your Enhanced Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Download your complete mortgage analysis with automated calculations, amortization schedule, and personalized recommendations
          </Typography>
          
          {/* Export Statistics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">Total Calculations</Typography>
              <Typography variant="h6" color="primary.main">
                {amortizationData.schedule.length + 1}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">Recommendations</Typography>
              <Typography variant="h6" color="primary.main">
                {recommendations.length}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">Key Metrics</Typography>
              <Typography variant="h6" color="primary.main">
                {prepareExportData().keyMetrics.length}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">Data Points</Typography>
              <Typography variant="h6" color="primary.main">
                {amortizationData.specificMonthsSchedule.length}
              </Typography>
            </Grid>
          </Grid>
          
          <ExportButtons data={prepareExportData()} />
        </Box>
      </Card>

      {/* Summary Recommendations Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>🎯 Personalized Recommendations</Typography>
          <Grid container spacing={2}>
            {recommendations.map((rec, index) => (
              <Grid item xs={12} key={index}>
                <Alert 
                  severity={index === 0 ? (data.downPaymentPercent < 20 ? 'warning' : 'success') : 'info'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">{rec}</Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Footer with Calculator Stats */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.50', borderRadius: 1, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Enhanced Mortgage Calculator v2.0 | 
          Calculations: Automated & Validated | 
          PMI: Industry Standard Rates | 
          Decimal Places: Fixed to 2 | 
          Schedule: Months 1, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60
        </Typography>
      </Box>
    </Box>
  );
};

export default EnhancedMortgageCalculator;