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
  Checkbox
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  LocalAtm as TaxIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface CollegeSavingsData {
  // Child information
  childAge: number;
  yearsToCollege: number;
  
  // Education costs
  currentTuition: number;
  educationInflationRate: number;
  collegeDuration: number;
  collegeType: 'public-instate' | 'public-outstate' | 'private' | 'community';
  
  // Current savings
  currentBalance: number;
  monthlyContribution: number;
  expectedReturn: number;
  
  // 529 Plan details
  using529Plan: boolean;
  statePlan: string;
  stateDeduction: number;
  federalTaxBracket: number;
  stateTaxBracket: number;
  
  // Additional funding
  relativesContribution: number;
  scholarshipExpected: number;
  workStudyIncome: number;
  
  // Alternative funding
  considerStudentLoans: boolean;
  maxLoanAmount: number;
  loanInterestRate: number;
}

const CollegeSavingsCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<CollegeSavingsData>({
    childAge: 5,
    yearsToCollege: 13,
    currentTuition: 11011,
    educationInflationRate: 5,
    collegeDuration: 4,
    collegeType: 'public-instate',
    currentBalance: 10000,
    monthlyContribution: 300,
    expectedReturn: 7,
    using529Plan: true,
    statePlan: 'state-plan',
    stateDeduction: 5000,
    federalTaxBracket: 22,
    stateTaxBracket: 5,
    relativesContribution: 1000,
    scholarshipExpected: 5000,
    workStudyIncome: 3000,
    considerStudentLoans: true,
    maxLoanAmount: 30000,
    loanInterestRate: 5.5
  });

  // College cost presets
  const collegeTypeData = {
    'public-instate': { avgCost: 11011, label: 'Public In-State' },
    'public-outstate': { avgCost: 24513, label: 'Public Out-of-State' },
    'private': { avgCost: 43505, label: 'Private College' },
    'community': { avgCost: 6500, label: 'Community College' }
  };

  // Helper function to format currency with exactly 2 decimal places
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculations
  const projectedTuition = data.currentTuition * Math.pow(1 + data.educationInflationRate / 100, data.yearsToCollege);
  const totalCollegeCost = projectedTuition * data.collegeDuration;
  const totalCollegeCostWithExtras = totalCollegeCost * 1.3; // Add 30% for room, board, books, etc.

  // 529 Plan calculations
  const futureBalance = data.currentBalance * Math.pow(1 + data.expectedReturn / 100, data.yearsToCollege) +
    (data.monthlyContribution * 12) * ((Math.pow(1 + data.expectedReturn / 100, data.yearsToCollege) - 1) / (data.expectedReturn / 100));
  
  const annualTaxSavings = data.using529Plan ? 
    (Math.min(data.monthlyContribution * 12, data.stateDeduction) * (data.stateTaxBracket / 100)) : 0;
  
  const fundingGap = Math.max(0, totalCollegeCostWithExtras - futureBalance - 
    (data.relativesContribution * data.collegeDuration) - 
    (data.scholarshipExpected * data.collegeDuration) - 
    (data.workStudyIncome * data.collegeDuration));
  
  const savingsProgress = (futureBalance / totalCollegeCostWithExtras) * 100;
  
  // Update data
  const updateData = (field: keyof CollegeSavingsData, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate years to college when child age changes
      if (field === 'childAge') {
        newData.yearsToCollege = Math.max(1, 18 - value);
      }
      
      // Auto-set tuition based on college type
      if (field === 'collegeType') {
        newData.currentTuition = collegeTypeData[value as keyof typeof collegeTypeData].avgCost;
      }
      
      return newData;
    });
  };

  // Get funding status
  const getFundingStatus = () => {
    if (savingsProgress >= 100) return { level: 'Excellent', color: 'success', message: 'Fully funded for college!' };
    if (savingsProgress >= 75) return { level: 'Good', color: 'success', message: 'Well on track to meet goals' };
    if (savingsProgress >= 50) return { level: 'Fair', color: 'warning', message: 'Making progress, increase if possible' };
    if (savingsProgress >= 25) return { level: 'Needs Work', color: 'warning', message: 'Consider increasing contributions' };
    return { level: 'Critical', color: 'error', message: 'Significant funding gap exists' };
  };

  const fundingStatus = getFundingStatus();

  // Calculate year-by-year projections
  const getYearlyProjections = () => {
    const projections = [];
    let balance = data.currentBalance;
    
    for (let year = 1; year <= data.yearsToCollege; year++) {
      balance = balance * (1 + data.expectedReturn / 100) + (data.monthlyContribution * 12);
      const tuitionThatYear = data.currentTuition * Math.pow(1 + data.educationInflationRate / 100, year);
      
      projections.push({
        year,
        childAge: data.childAge + year,
        balance,
        annualTuition: tuitionThatYear,
        contributions: data.monthlyContribution * 12,
        growth: balance - (year === 1 ? data.currentBalance : projections[year - 2].balance) - (data.monthlyContribution * 12)
      });
    }
    
    return projections;
  };

  const yearlyProjections = getYearlyProjections();

  return (
    <Box className="college-savings-calculator">
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        College Savings Calculator
      </Typography>
      
      {/* FIXED: Centered description text */}
      <Typography variant="body1" className="mb-6 text-center text-gray-600">
        Plan for your child's education with 529 plans, tax benefits, and comprehensive strategies.
      </Typography>

      {/* Funding Status Overview */}
      <Card sx={{ mb: 3, bgcolor: `${fundingStatus.color}.50`, border: '1px solid', borderColor: `${fundingStatus.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${fundingStatus.color}.main`} fontWeight="bold">
                {savingsProgress.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Funding Progress</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{fundingStatus.level} College Savings</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(savingsProgress, 100)}
                color={fundingStatus.color as 'success' | 'warning' | 'error'}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">{fundingStatus.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              {/* FIXED: Projected Total Cost to 2 decimal places */}
              <Typography variant="h5" fontWeight="bold">${formatCurrency(totalCollegeCostWithExtras)}</Typography>
              <Typography variant="body2" color="text.secondary">Projected Total Cost</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <Tab label="Education Costs" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="529 Plan Analysis" icon={<TaxIcon />} iconPosition="start" />
          <Tab label="Savings Strategy" icon={<TimelineIcon />} iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Education Costs Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>🎓 Education Cost Planning</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Child & College Information</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Child's Current Age"
                        type="number"
                        value={data.childAge}
                        onChange={(e) => updateData('childAge', parseInt(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">years</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Years Until College"
                        type="number"
                        value={data.yearsToCollege}
                        onChange={(e) => updateData('yearsToCollege', parseInt(e.target.value) || 0)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">years</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>College Type</InputLabel>
                        <Select
                          value={data.collegeType}
                          label="College Type"
                          onChange={(e) => updateData('collegeType', e.target.value)}
                        >
                          <MenuItem value="community">Community College (2-year)</MenuItem>
                          <MenuItem value="public-instate">Public In-State (4-year)</MenuItem>
                          <MenuItem value="public-outstate">Public Out-of-State (4-year)</MenuItem>
                          <MenuItem value="private">Private College (4-year)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Current Annual Tuition"
                        type="number"
                        value={data.currentTuition}
                        onChange={(e) => updateData('currentTuition', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="College Duration"
                        type="number"
                        value={data.collegeDuration}
                        onChange={(e) => updateData('collegeDuration', parseInt(e.target.value) || 4)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">years</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Education Inflation */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Education Inflation Rate: {data.educationInflationRate}%
                    </Typography>
                    <Slider
                      value={data.educationInflationRate}
                      onChange={(_, value) => updateData('educationInflationRate', value)}
                      min={2}
                      max={8}
                      step={0.1}
                      marks={[
                        { value: 3, label: '3%' },
                        { value: 5, label: '5%' },
                        { value: 7, label: '7%' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Historical average: 5-6% annually
                    </Typography>
                  </Box>
                </Grid>

                {/* Cost Projections - FIXED: All dollar amounts to 2 decimal places */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom>📊 Cost Projections</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${formatCurrency(data.currentTuition)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Current Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          ${formatCurrency(projectedTuition)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Future Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          ${formatCurrency(totalCollegeCost)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          ${formatCurrency(totalCollegeCostWithExtras)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total with Extras</Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Annual Cost Breakdown - FIXED: All dollar amounts to 2 decimal places */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Annual Cost Breakdown (Future)</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell><strong>Expense Type</strong></TableCell>
                            <TableCell align="right"><strong>Annual Cost</strong></TableCell>
                            <TableCell align="right"><strong>Total (4 years)</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Tuition & Fees</TableCell>
                            <TableCell align="right">${formatCurrency(projectedTuition)}</TableCell>
                            <TableCell align="right">${formatCurrency(totalCollegeCost)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Room & Board</TableCell>
                            <TableCell align="right">${formatCurrency(projectedTuition * 0.15)}</TableCell>
                            <TableCell align="right">${formatCurrency(totalCollegeCost * 0.15)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Books & Supplies</TableCell>
                            <TableCell align="right">${formatCurrency(projectedTuition * 0.05)}</TableCell>
                            <TableCell align="right">${formatCurrency(totalCollegeCost * 0.05)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Transportation</TableCell>
                            <TableCell align="right">${formatCurrency(projectedTuition * 0.05)}</TableCell>
                            <TableCell align="right">${formatCurrency(totalCollegeCost * 0.05)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Personal Expenses</TableCell>
                            <TableCell align="right">${formatCurrency(projectedTuition * 0.05)}</TableCell>
                            <TableCell align="right">${formatCurrency(totalCollegeCost * 0.05)}</TableCell>
                          </TableRow>
                          <TableRow sx={{ bgcolor: 'error.50' }}>
                            <TableCell><strong>Total Annual</strong></TableCell>
                            <TableCell align="right"><strong>${formatCurrency(projectedTuition * 1.3)}</strong></TableCell>
                            <TableCell align="right"><strong>${formatCurrency(totalCollegeCostWithExtras)}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>

                {/* College Type Information */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>💡 2024 Average College Costs by Type</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(collegeTypeData).map(([key, value]) => (
                        <Grid item xs={12} sm={6} md={3} key={key}>
                          <Typography variant="body2">
                            <strong>{value.label}:</strong> ${value.avgCost.toLocaleString()}/year
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Note: Costs include tuition, fees, room, and board. Private colleges and out-of-state public schools typically cost more.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* 529 Plan Analysis Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>💰 529 Plan & Tax Benefits Analysis</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Current Savings & Contributions</Typography>
                  
                  <TextField
                    fullWidth
                    label="Current 529 Balance"
                    type="number"
                    value={data.currentBalance}
                    onChange={(e) => updateData('currentBalance', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                  />

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

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Expected Annual Return: {data.expectedReturn}%
                    </Typography>
                    <Slider
                      value={data.expectedReturn}
                      onChange={(_, value) => updateData('expectedReturn', value)}
                      min={3}
                      max={12}
                      step={0.1}
                      marks={[
                        { value: 5, label: '5%' },
                        { value: 7, label: '7%' },
                        { value: 10, label: '10%' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Historical stock market average: 7-10% annually
                    </Typography>
                  </Box>
                </Grid>

                {/* 529 Plan Benefits Summary - FIXED: Future Balance to 2 decimal places */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>529 Plan Benefits Summary</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold" textAlign="center">
                          ${formatCurrency(futureBalance)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          Future Balance at College Start
                        </Typography>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold">
                          ${formatCurrency(annualTaxSavings)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Annual Tax Savings</Typography>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="warning.main" fontWeight="bold">
                          ${formatCurrency(fundingGap)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Remaining Gap</Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Tax Benefits */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Tax Benefits</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={data.using529Plan}
                          onChange={(e) => updateData('using529Plan', e.target.checked)}
                        />
                      }
                      label="Using 529 Plan for tax benefits"
                    />
                    
                    {data.using529Plan && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State Tax Deduction Limit"
                            type="number"
                            value={data.stateDeduction}
                            onChange={(e) => updateData('stateDeduction', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State Tax Rate"
                            type="number"
                            value={data.stateTaxBracket}
                            onChange={(e) => updateData('stateTaxBracket', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Savings Strategy Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>🎯 Comprehensive Savings Strategy</Typography>
              
              <Grid container spacing={3}>
                {/* Additional Funding Sources */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Additional Funding Sources</Typography>
                  
                  <TextField
                    fullWidth
                    label="Annual Family/Relatives Contribution"
                    type="number"
                    value={data.relativesContribution}
                    onChange={(e) => updateData('relativesContribution', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                    helperText="Expected annual gifts from grandparents, relatives, etc."
                  />

                  <TextField
                    fullWidth
                    label="Expected Annual Scholarships"
                    type="number"
                    value={data.scholarshipExpected}
                    onChange={(e) => updateData('scholarshipExpected', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                    helperText="Merit, need-based, or athletic scholarships"
                  />

                  <TextField
                    fullWidth
                    label="Annual Work-Study Income"
                    type="number"
                    value={data.workStudyIncome}
                    onChange={(e) => updateData('workStudyIncome', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 2 }}
                    helperText="Expected earnings from part-time work during college"
                  />
                </Grid>

                {/* Funding Summary - FIXED: All dollar amounts to 2 decimal places */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Funding Summary</Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell><strong>Funding Source</strong></TableCell>
                          <TableCell align="right"><strong>Total Amount</strong></TableCell>
                          <TableCell align="right"><strong>% of Need</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>529 Plan Savings</TableCell>
                          <TableCell align="right">${formatCurrency(futureBalance)}</TableCell>
                          <TableCell align="right">{((futureBalance / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Family Contributions</TableCell>
                          <TableCell align="right">${formatCurrency(data.relativesContribution * data.collegeDuration)}</TableCell>
                          <TableCell align="right">{(((data.relativesContribution * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Scholarships</TableCell>
                          <TableCell align="right">${formatCurrency(data.scholarshipExpected * data.collegeDuration)}</TableCell>
                          <TableCell align="right">{(((data.scholarshipExpected * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Work-Study</TableCell>
                          <TableCell align="right">${formatCurrency(data.workStudyIncome * data.collegeDuration)}</TableCell>
                          <TableCell align="right">{(((data.workStudyIncome * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: fundingGap > 0 ? 'warning.50' : 'success.50' }}>
                          <TableCell><strong>Funding Gap</strong></TableCell>
                          <TableCell align="right"><strong>${formatCurrency(fundingGap)}</strong></TableCell>
                          <TableCell align="right"><strong>{((fundingGap / totalCollegeCostWithExtras) * 100).toFixed(1)}%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Action Items */}
                  {fundingGap > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        💡 Recommendations to Close ${formatCurrency(fundingGap)} Gap:
                      </Typography>
                      <Typography variant="body2">
                        • Increase monthly contributions by ${formatCurrency((fundingGap / (data.yearsToCollege * 12)) * 1.2)}
                      </Typography>
                      <Typography variant="body2">
                        • Consider more aggressive scholarship pursuit
                      </Typography>
                      <Typography variant="body2">
                        • Explore work-study and summer job opportunities
                      </Typography>
                    </Alert>
                  )}
                </Grid>

                {/* Student Loans */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">💳 Student Loan Planning</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={data.considerStudentLoans}
                                onChange={(e) => updateData('considerStudentLoans', e.target.checked)}
                              />
                            }
                            label="Consider student loans if needed"
                          />
                          
                          {data.considerStudentLoans && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                fullWidth
                                label="Maximum Loan Amount"
                                type="number"
                                value={data.maxLoanAmount}
                                onChange={(e) => updateData('maxLoanAmount', parseFloat(e.target.value) || 0)}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ mb: 2 }}
                              />
                              
                              <TextField
                                fullWidth
                                label="Expected Interest Rate"
                                type="number"
                                value={data.loanInterestRate}
                                onChange={(e) => updateData('loanInterestRate', parseFloat(e.target.value) || 0)}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Box>
                          )}
                        </Grid>
                        
                        {data.considerStudentLoans && (
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>Loan Impact Analysis</Typography>
                            <Typography variant="body2" gutterBottom>
                              Monthly payment (10-year term): ${formatCurrency((data.maxLoanAmount * (data.loanInterestRate/100/12) * Math.pow(1 + data.loanInterestRate/100/12, 120)) / (Math.pow(1 + data.loanInterestRate/100/12, 120) - 1))}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Total interest paid: ${formatCurrency((data.maxLoanAmount * (data.loanInterestRate/100/12) * Math.pow(1 + data.loanInterestRate/100/12, 120)) / (Math.pow(1 + data.loanInterestRate/100/12, 120) - 1) * 120 - data.maxLoanAmount)}
                            </Typography>
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <Typography variant="body2">
                                Federal student loans typically offer better terms than private loans
                              </Typography>
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Year-by-Year Projections */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">📈 Year-by-Year Savings Projections</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                              <TableCell><strong>Year</strong></TableCell>
                              <TableCell><strong>Child Age</strong></TableCell>
                              <TableCell align="right"><strong>Annual Contribution</strong></TableCell>
                              <TableCell align="right"><strong>Investment Growth</strong></TableCell>
                              <TableCell align="right"><strong>Balance</strong></TableCell>
                              <TableCell align="right"><strong>College Cost That Year</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {yearlyProjections.map((projection) => (
                              <TableRow key={projection.year}>
                                <TableCell>{projection.year}</TableCell>
                                <TableCell>{projection.childAge}</TableCell>
                                <TableCell align="right">${formatCurrency(projection.contributions)}</TableCell>
                                <TableCell align="right">${formatCurrency(projection.growth)}</TableCell>
                                <TableCell align="right">${formatCurrency(projection.balance)}</TableCell>
                                <TableCell align="right">${formatCurrency(projection.annualTuition * 1.3)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>

              {/* Key Tips */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="subtitle2" gutterBottom>🎯 Key College Savings Tips</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2">• Start early - compound growth is powerful</Typography>
                        <Typography variant="body2">• Automate contributions to stay consistent</Typography>
                        <Typography variant="body2">• Take advantage of 529 tax benefits</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2">• Review and adjust annually</Typography>
                        <Typography variant="body2">• Consider age-based investment options</Typography>
                        <Typography variant="body2">• Don't forget about scholarships and grants</Typography>
                      </Grid>
                    </Grid>
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollegeSavingsCalculator;