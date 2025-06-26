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
      
      <Typography variant="body1" className="mb-6 text-center text-gray-600 max-w-3xl mx-auto">
        Plan for your child's education with 529 plans, tax benefits, and comprehensive savings strategies.
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
              <Typography variant="h5" fontWeight="bold">${totalCollegeCostWithExtras.toLocaleString()}</Typography>
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
              <Grid container spacing={3}>
                {/* Child & Education Info */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" />
                    Child & Education Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Child's Current Age"
                        type="number"
                        value={data.childAge}
                        onChange={(e) => updateData('childAge', parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0, max: 17 }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Years Until College"
                        type="number"
                        value={data.yearsToCollege}
                        onChange={(e) => updateData('yearsToCollege', parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1, max: 20 }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>College Type</InputLabel>
                        <Select
                          value={data.collegeType}
                          onChange={(e) => updateData('collegeType', e.target.value)}
                          label="College Type"
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

                {/* Cost Projections */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom>📊 Cost Projections</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          ${data.currentTuition.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Current Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          ${projectedTuition.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Future Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          ${totalCollegeCost.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Tuition</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                          ${totalCollegeCostWithExtras.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total with Expenses</Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Cost Breakdown */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Annual Cost Breakdown (Future)</Typography>
                    <TableContainer component={Paper} size="small">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Expense</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">4-Year Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Tuition & Fees</TableCell>
                            <TableCell align="right">${projectedTuition.toLocaleString()}</TableCell>
                            <TableCell align="right">${totalCollegeCost.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Room & Board</TableCell>
                            <TableCell align="right">${(projectedTuition * 0.2).toLocaleString()}</TableCell>
                            <TableCell align="right">${(totalCollegeCost * 0.2).toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Books & Supplies</TableCell>
                            <TableCell align="right">${(projectedTuition * 0.05).toLocaleString()}</TableCell>
                            <TableCell align="right">${(totalCollegeCost * 0.05).toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Personal Expenses</TableCell>
                            <TableCell align="right">${(projectedTuition * 0.05).toLocaleString()}</TableCell>
                            <TableCell align="right">${(totalCollegeCost * 0.05).toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow sx={{ bgcolor: 'error.50' }}>
                            <TableCell><strong>Total Annual</strong></TableCell>
                            <TableCell align="right"><strong>${(projectedTuition * 1.3).toLocaleString()}</strong></TableCell>
                            <TableCell align="right"><strong>${totalCollegeCostWithExtras.toLocaleString()}</strong></TableCell>
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
                      Conservative: 5-6%, Moderate: 7-8%, Aggressive: 9-10%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Tax Information</Typography>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.using529Plan}
                        onChange={(e) => updateData('using529Plan', e.target.checked)}
                      />
                    }
                    label="Using 529 Plan"
                    sx={{ mb: 2, display: 'block' }}
                  />

                  {data.using529Plan && (
                    <>
                      <TextField
                        fullWidth
                        label="State Tax Deduction Limit"
                        type="number"
                        value={data.stateDeduction}
                        onChange={(e) => updateData('stateDeduction', parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Annual limit for state tax deductions"
                        sx={{ mb: 2 }}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Federal Tax Bracket"
                            type="number"
                            value={data.federalTaxBracket}
                            onChange={(e) => updateData('federalTaxBracket', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="State Tax Bracket"
                            type="number"
                            value={data.stateTaxBracket}
                            onChange={(e) => updateData('stateTaxBracket', parseFloat(e.target.value) || 0)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* 529 Benefits Summary */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="success.main">
                        529 Plan Benefits Summary
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" gutterBottom>Future Balance</Typography>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            ${futureBalance.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            At college start ({data.yearsToCollege} years)
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" gutterBottom>Annual Tax Savings</Typography>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            ${annualTaxSavings.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            State deduction benefit
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" gutterBottom>Total Contributions</Typography>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            ${(data.currentBalance + (data.monthlyContribution * 12 * data.yearsToCollege)).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Over {data.yearsToCollege} years
                          </Typography>
                        </Grid>
                      </Grid>

                      {data.using529Plan && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>529 Plan Advantages:</Typography>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            <li>Tax-free growth on investments</li>
                            <li>Tax-free withdrawals for qualified education expenses</li>
                            <li>State tax deduction up to ${data.stateDeduction.toLocaleString()} annually</li>
                            <li>High contribution limits (typically $300k+ lifetime)</li>
                            <li>Flexibility to change beneficiary to family members</li>
                          </ul>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Savings Strategy Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>📈 Comprehensive Savings Strategy</Typography>
              
              <Grid container spacing={3}>
                {/* Additional Funding Sources */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Additional Funding Sources</Typography>
                  
                  <TextField
                    fullWidth
                    label="Annual Relatives' Contributions"
                    type="number"
                    value={data.relativesContribution}
                    onChange={(e) => updateData('relativesContribution', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Grandparents, family gifts"
                    sx={{ mb: 2 }}
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
                    helperText="Merit, need-based, athletic"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Student Work/Study Income"
                    type="number"
                    value={data.workStudyIncome}
                    onChange={(e) => updateData('workStudyIncome', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Part-time work, co-ops"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.considerStudentLoans}
                        onChange={(e) => updateData('considerStudentLoans', e.target.checked)}
                      />
                    }
                    label="Consider Student Loans if Needed"
                    sx={{ mb: 2, display: 'block' }}
                  />

                  {data.considerStudentLoans && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Max Loan Amount"
                          type="number"
                          value={data.maxLoanAmount}
                          onChange={(e) => updateData('maxLoanAmount', parseFloat(e.target.value) || 0)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Loan Interest Rate"
                          type="number"
                          value={data.loanInterestRate}
                          onChange={(e) => updateData('loanInterestRate', parseFloat(e.target.value) || 0)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>

                {/* Funding Summary */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Funding Summary</Typography>
                  
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Funding Source</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">% of Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>529 Plan Balance</TableCell>
                          <TableCell align="right">${futureBalance.toLocaleString()}</TableCell>
                          <TableCell align="right">{((futureBalance / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Relatives' Gifts</TableCell>
                          <TableCell align="right">${(data.relativesContribution * data.collegeDuration).toLocaleString()}</TableCell>
                          <TableCell align="right">{(((data.relativesContribution * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Scholarships</TableCell>
                          <TableCell align="right">${(data.scholarshipExpected * data.collegeDuration).toLocaleString()}</TableCell>
                          <TableCell align="right">{(((data.scholarshipExpected * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Work/Study</TableCell>
                          <TableCell align="right">${(data.workStudyIncome * data.collegeDuration).toLocaleString()}</TableCell>
                          <TableCell align="right">{(((data.workStudyIncome * data.collegeDuration) / totalCollegeCostWithExtras) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: fundingGap > 0 ? 'error.50' : 'success.50' }}>
                          <TableCell><strong>Funding Gap</strong></TableCell>
                          <TableCell align="right"><strong>${fundingGap.toLocaleString()}</strong></TableCell>
                          <TableCell align="right"><strong>{((fundingGap / totalCollegeCostWithExtras) * 100).toFixed(1)}%</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {fundingGap > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Funding Gap: ${fundingGap.toLocaleString()}</strong>
                        <br />
                        Consider increasing monthly contributions to ${(data.monthlyContribution + (fundingGap / (data.yearsToCollege * 12))).toFixed(0)} 
                        or explore additional funding sources.
                      </Typography>
                    </Alert>
                  )}
                </Grid>

                {/* Year-by-Year Projections */}
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">📅 Year-by-Year Savings Projections</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Year</TableCell>
                              <TableCell>Child Age</TableCell>
                              <TableCell align="right">Balance</TableCell>
                              <TableCell align="right">Annual Contribution</TableCell>
                              <TableCell align="right">Growth</TableCell>
                              <TableCell align="right">Tuition That Year</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {yearlyProjections.map((projection) => (
                              <TableRow key={projection.year}>
                                <TableCell>{projection.year}</TableCell>
                                <TableCell>{projection.childAge}</TableCell>
                                <TableCell align="right">${projection.balance.toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.contributions.toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.growth.toLocaleString()}</TableCell>
                                <TableCell align="right">${projection.annualTuition.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Strategies & Tips */}
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="subtitle2" gutterBottom>💡 College Savings Strategies</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Early Years (Age 0-10):</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Start with aggressive growth investments</li>
                          <li>Maximize state tax deductions</li>
                          <li>Set up automatic contributions</li>
                          <li>Encourage family gifts to 529 plan</li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom><strong>Later Years (Age 11-18):</strong></Typography>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Shift to more conservative investments</li>
                          <li>Research scholarship opportunities</li>
                          <li>Consider in-state vs. out-of-state options</li>
                          <li>Explore community college for first 2 years</li>
                        </ul>
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