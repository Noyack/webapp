import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  MonetizationOn as MoneyIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
//   Help as HelpIcon,
  Settings as SettingsIcon,
  LocationOn as LocationIcon,
  MedicalServices as HealthcareIcon,
  LocalGroceryStore as ExpensesIcon,
//   School as EducationIcon,
  EmojiTransportation as TransportationIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Import location data
import { usStates, cityData, costOfLivingByState, taxRatesByState } from '../..//utils/locationData';

// Types
interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  expectedInflation: number;
  currentAnnualIncome: number;
  desiredIncomeReplacement: number;
  socialSecurityBenefits: number;
  otherIncome: number;
  state: string;
  city: string;
  monthlyExpenses: {
    housing: number;
    utilities: number;
    food: number;
    transportation: number;
    healthcare: number;
    entertainment: number;
    other: number;
  };
  estimatedTaxRate: number;
}

interface RetirementResults {
  requiredSavings: number;
  projectedSavings: number;
  monthlyRetirementIncome: number;
  savingsShortfall: number;
  yearlySavingsChart: Array<{
    age: number;
    savings: number;
    contributions: number;
    interest: number;
    yearsInRetirement: number;
    realMonthlyReturn: number;
    totalExpenses: number;
  }>;
  retirementIncomeChart: Array<{
    age: number;
    income: number;
    expenses: number;
    savings: number;
  }>;
  retirementByCategory: Array<{
    name: string;
    value: number;
  }>;
  savingsNeededByExpense: Array<{
    expense: string;
    amountNeeded: number;
  }>;
  totalTaxPaid: number;
  totalExpenses: number
}

// Define some constant values
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// Default values
const DEFAULT_INPUTS: RetirementInputs = {
  currentAge: 35,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 100000,
  monthlyContribution: 1000,
  expectedAnnualReturn: 7,
  expectedInflation: 2.5,
  currentAnnualIncome: 80000,
  desiredIncomeReplacement: 80,
  socialSecurityBenefits: 1800,
  otherIncome: 0,
  state: 'CA',
  city: 'Los Angeles',
  monthlyExpenses: {
    housing: 2000,
    utilities: 200,
    food: 600,
    transportation: 400,
    healthcare: 500,
    entertainment: 300,
    other: 500
  },
  estimatedTaxRate: 20
};

// Default empty results
const EMPTY_RESULTS: RetirementResults = {
  requiredSavings: 0,
  projectedSavings: 0,
  monthlyRetirementIncome: 0,
  savingsShortfall: 0,
  yearlySavingsChart: [],
  retirementIncomeChart: [],
  retirementByCategory: [],
  savingsNeededByExpense: [],
  totalTaxPaid: 0,
  totalExpenses:0
};

const RetirementCalculator = () => {
  // State hooks
  const [inputs, setInputs] = useState<RetirementInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<RetirementResults>(EMPTY_RESULTS);
  const [activeTab, setActiveTab] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [costOfLivingIndex, setCostOfLivingIndex] = useState<number>(100);
  
  // Helper function for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Helper function for formatting percentages
  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`;
  };
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Update inputs
  const updateInput = <K extends keyof RetirementInputs>(field: K, value: RetirementInputs[K]) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update expense fields
  const updateExpense = (expenseType: keyof RetirementInputs['monthlyExpenses'], value: number) => {
    setInputs(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [expenseType]: value
      }
    }));
  };
  
  // Calculate total monthly expenses
  const getTotalMonthlyExpenses = () => {
    const { housing, utilities, food, transportation, healthcare, entertainment, other } = inputs.monthlyExpenses;
    return housing + utilities + food + transportation + healthcare + entertainment + other;
  };
  
  // Update available cities when state changes
  useEffect(() => {
    if (inputs.state) {
      const cities = cityData
        .filter(city => city.state === inputs.state)
        .map(city => city.name);
      
      setAvailableCities(cities);
      
      // Set default city if current city is not in the list
      if (cities.length > 0 && !cities.includes(inputs.city)) {
        updateInput('city', cities[0]);
      }
      
      // Update cost of living index
      const stateCol = costOfLivingByState.find(item => item.state === inputs.state);
      if (stateCol) {
        setCostOfLivingIndex(stateCol.index);
      } else {
        setCostOfLivingIndex(100); // National average
      }
      
      // Update tax rate based on state
      const stateTax = taxRatesByState.find(item => item.state === inputs.state);
      if (stateTax) {
        updateInput('estimatedTaxRate', stateTax.effectiveTaxRate);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.state]);
  
  // Calculate retirement results
  const calculateRetirement = () => {
    // Get input values
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      expectedAnnualReturn,
      expectedInflation,
      currentAnnualIncome,
      desiredIncomeReplacement,
      socialSecurityBenefits,
      otherIncome,
      monthlyExpenses,
      estimatedTaxRate
    } = inputs;
    
    // Calculate real rate of return (after inflation)
    const realAnnualReturn = ((1 + expectedAnnualReturn / 100) / (1 + expectedInflation / 100) - 1) * 100;
    const realMonthlyReturn = Math.pow(1 + realAnnualReturn / 100, 1 / 12) - 1;
    
    // Calculate savings needed at retirement
    // const yearsInRetirement = lifeExpectancy - retirementAge;
    const inflationAdjustedIncome = currentAnnualIncome * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
    const desiredRetirementIncome = inflationAdjustedIncome * (desiredIncomeReplacement / 100);
    const socialSecurityAnnual = socialSecurityBenefits * 12 * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
    const otherIncomeAnnual = otherIncome * 12 * Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
    const annualIncomeNeeded = desiredRetirementIncome - socialSecurityAnnual - otherIncomeAnnual;
    
    // Adjust for cost of living in selected location
    const colAdjustedIncomeNeeded = annualIncomeNeeded * (costOfLivingIndex / 100);
    
    // Calculate total savings needed using the 4% rule
    // The 4% rule means you can withdraw 4% of your savings in the first year, then adjust for inflation
    const requiredSavings = Math.max(0, colAdjustedIncomeNeeded / 0.04);
    
    // Calculate taxes
    const totalTaxPaid = colAdjustedIncomeNeeded * (estimatedTaxRate / 100);
    
    // Project savings growth until retirement
    const yearlySavingsChart = [];
    let currentSavingsValue = currentSavings;
    let totalContributions = 0;
    
    for (let age = currentAge; age <= lifeExpectancy; age++) {
    //   const yearsSinceStart = age - currentAge;
      
      // Stop adding contributions once retirement age is reached
      const contributionsThisYear = age < retirementAge ? monthlyContribution * 12 : 0;
      
      // Project total expenses with inflation
      const totalExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => 
        sum + expense * 12 * Math.pow(1 + expectedInflation / 100, age - currentAge), 0);
      
      // Add contributions and calculate interest
      if (age < retirementAge) {
        totalContributions += contributionsThisYear;
        
        // We'll simplify by adding the full year's contributions at once and calculating interest
        // In reality, contributions would be monthly and interest would be compounded
        const interestEarned = currentSavingsValue * (expectedAnnualReturn / 100);
        currentSavingsValue = currentSavingsValue + interestEarned + contributionsThisYear;
      } else {
        // In retirement, we withdraw money
        const withdrawalAmount = colAdjustedIncomeNeeded / 12 * 
                               Math.pow(1 + expectedInflation / 100, age - retirementAge);
        const yearlyWithdrawal = withdrawalAmount * 12;
        const interestEarned = Math.max(0, currentSavingsValue * (expectedAnnualReturn / 100));
        currentSavingsValue = Math.max(0, currentSavingsValue + interestEarned - yearlyWithdrawal);
      }
      
      yearlySavingsChart.push({
        age,
        savings: currentSavingsValue,
        contributions: totalContributions,
        interest: currentSavingsValue - totalContributions - currentSavings,
        yearsInRetirement: age - retirementAge,
        realMonthlyReturn: realMonthlyReturn,
        totalExpenses: totalExpenses
      });
    }
    
    // Get projected savings at retirement age
    const projectedSavingsObj = yearlySavingsChart.find(item => item.age === retirementAge);
    const projectedSavings = projectedSavingsObj ? projectedSavingsObj.savings : 0;
    
    // Calculate monthly retirement income
    const sustainableMonthlyWithdrawal = (projectedSavings * 0.04) / 12;
    const monthlyRetirementIncome = sustainableMonthlyWithdrawal + socialSecurityBenefits + otherIncome;
    
    // Calculate shortfall (if any)
    const savingsShortfall = Math.max(0, requiredSavings - projectedSavings);
    
    // Create retirement income chart
    const retirementIncomeChart = [];
    
    // Calculate projected monthly expenses in retirement
    const inflationMultiplier = Math.pow(1 + expectedInflation / 100, retirementAge - currentAge);
    const projectedMonthlyExpenses = {
      housing: monthlyExpenses.housing * inflationMultiplier,
      utilities: monthlyExpenses.utilities * inflationMultiplier,
      food: monthlyExpenses.food * inflationMultiplier,
      transportation: monthlyExpenses.transportation * inflationMultiplier,
      healthcare: monthlyExpenses.healthcare * inflationMultiplier * 1.5, // Healthcare typically increases faster
      entertainment: monthlyExpenses.entertainment * inflationMultiplier,
      other: monthlyExpenses.other * inflationMultiplier
    };
    
    const totalMonthlyExpenses = Object.values(projectedMonthlyExpenses).reduce((sum, value) => sum + value, 0);
    
    for (let age = retirementAge; age <= lifeExpectancy; age++) {
      const yearsIntoRetirement = age - retirementAge;
      
      // Adjust for inflation each year
      const yearlyInflation = Math.pow(1 + expectedInflation / 100, yearsIntoRetirement);
      const incomeThisYear = monthlyRetirementIncome * yearlyInflation;
      const expensesThisYear = totalMonthlyExpenses * yearlyInflation;
      
      // Get savings from the savings chart
      const savingsObj = yearlySavingsChart.find(item => item.age === age);
      const savingsThisYear = savingsObj ? savingsObj.savings : 0;
      
      retirementIncomeChart.push({
        age,
        income: incomeThisYear,
        expenses: expensesThisYear,
        savings: savingsThisYear
      });
    }
    
    // Create retirement by category chart
    const totalExpenses = Object.values(projectedMonthlyExpenses).reduce((sum, val) => sum + val, 0) * 12;
    const retirementByCategory = [
      { name: 'Housing', value: projectedMonthlyExpenses.housing * 12 },
      { name: 'Healthcare', value: projectedMonthlyExpenses.healthcare * 12 },
      { name: 'Food', value: projectedMonthlyExpenses.food * 12 },
      { name: 'Transportation', value: projectedMonthlyExpenses.transportation * 12 },
      { name: 'Utilities', value: projectedMonthlyExpenses.utilities * 12 },
      { name: 'Entertainment', value: projectedMonthlyExpenses.entertainment * 12 },
      { name: 'Other', value: projectedMonthlyExpenses.other * 12 }
    ];
    
    // Calculate savings needed for each expense category
    const savingsNeededByExpense = [
      { expense: 'Housing', amountNeeded: (projectedMonthlyExpenses.housing * 12) / 0.04 },
      { expense: 'Healthcare', amountNeeded: (projectedMonthlyExpenses.healthcare * 12) / 0.04 },
      { expense: 'Food', amountNeeded: (projectedMonthlyExpenses.food * 12) / 0.04 },
      { expense: 'Transportation', amountNeeded: (projectedMonthlyExpenses.transportation * 12) / 0.04 },
      { expense: 'Utilities', amountNeeded: (projectedMonthlyExpenses.utilities * 12) / 0.04 },
      { expense: 'Entertainment', amountNeeded: (projectedMonthlyExpenses.entertainment * 12) / 0.04 },
      { expense: 'Other', amountNeeded: (projectedMonthlyExpenses.other * 12) / 0.04 }
    ];
    
    // Update results
    setResults({
      requiredSavings,
      projectedSavings,
      monthlyRetirementIncome,
      savingsShortfall,
      yearlySavingsChart,
      retirementIncomeChart,
      retirementByCategory,
      savingsNeededByExpense,
      totalTaxPaid,
      totalExpenses
    });
    
    // Switch to results tab
    setActiveTab(3);
  };
  
  // Adjust savings contribution to meet goal
  const adjustToMeetGoal = () => {
    if (results.savingsShortfall <= 0) {
      // Already meeting the goal
      return;
    }
    
    const { currentAge, retirementAge, expectedAnnualReturn } = inputs;
    const yearsToRetirement = retirementAge - currentAge;
    
    // Calculate required additional monthly contribution to meet the goal
    // Using future value of annuity formula: FV = PMT * ((1 + r)^n - 1) / r
    const monthlyRate = expectedAnnualReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    
    // PMT = FV * r / ((1 + r)^n - 1)
    const additionalMonthlyRequired = results.savingsShortfall * 
      (monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1));
    
    // Update the monthly contribution
    updateInput('monthlyContribution', 
               Math.ceil(inputs.monthlyContribution + additionalMonthlyRequired));
    
    // Recalculate with new contribution
    calculateRetirement();
  };
  
  return (
    <Box className="retirement-calculator p-4 bg-gray-50 rounded-lg">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Retirement Calculator
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="retirement calculator tabs">
          <Tab label="Basic Info" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Location" icon={<LocationIcon />} iconPosition="start" />
          <Tab label="Expenses" icon={<ExpensesIcon />} iconPosition="start" />
          <Tab label="Results" icon={<AccountBalanceIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Basic Info Tab */}
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Personal Information</Typography>
                
                <Box className="mb-4">
                  <Typography gutterBottom>Current Age: {inputs.currentAge}</Typography>
                  <Slider
                    value={inputs.currentAge}
                    onChange={(_e, val) => updateInput('currentAge', val as number)}
                    min={18}
                    max={80}
                    marks={[
                      { value: 18, label: '18' },
                      { value: 50, label: '50' },
                      { value: 80, label: '80' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography gutterBottom>Retirement Age: {inputs.retirementAge}</Typography>
                  <Slider
                    value={inputs.retirementAge}
                    onChange={(_e, val) => updateInput('retirementAge', val as number)}
                    min={Math.max(inputs.currentAge + 1, 50)}
                    max={90}
                    marks={[
                      { value: 55, label: '55' },
                      { value: 65, label: '65' },
                      { value: 75, label: '75' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography gutterBottom>Life Expectancy: {inputs.lifeExpectancy}</Typography>
                  <Slider
                    value={inputs.lifeExpectancy}
                    onChange={(_e, val) => updateInput('lifeExpectancy', val as number)}
                    min={Math.max(inputs.retirementAge + 1, 70)}
                    max={100}
                    marks={[
                      { value: 75, label: '75' },
                      { value: 85, label: '85' },
                      { value: 95, label: '95' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Current Annual Income
                  </Typography>
                  <TextField
                    value={inputs.currentAnnualIncome}
                    onChange={(e) => updateInput('currentAnnualIncome', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography gutterBottom>
                    Income Replacement Percentage: {inputs.desiredIncomeReplacement}%
                  </Typography>
                  <Tooltip title="The percentage of your current income you'll need in retirement">
                    <Slider
                      value={inputs.desiredIncomeReplacement}
                      onChange={(_e, val) => updateInput('desiredIncomeReplacement', val as number)}
                      min={50}
                      max={100}
                      marks={[
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                        { value: 100, label: '100%' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Savings & Investments</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Current Retirement Savings
                  </Typography>
                  <TextField
                    value={inputs.currentSavings}
                    onChange={(e) => updateInput('currentSavings', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Contribution
                  </Typography>
                  <TextField
                    value={inputs.monthlyContribution}
                    onChange={(e) => updateInput('monthlyContribution', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography gutterBottom>
                    Expected Annual Return: {inputs.expectedAnnualReturn}%
                  </Typography>
                  <Slider
                    value={inputs.expectedAnnualReturn}
                    onChange={(_e, val) => updateInput('expectedAnnualReturn', val as number)}
                    min={1}
                    max={12}
                    step={0.5}
                    marks={[
                      { value: 4, label: '4%' },
                      { value: 7, label: '7%' },
                      { value: 10, label: '10%' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography gutterBottom>
                    Expected Inflation Rate: {inputs.expectedInflation}%
                  </Typography>
                  <Slider
                    value={inputs.expectedInflation}
                    onChange={(_e, val) => updateInput('expectedInflation', val as number)}
                    min={1}
                    max={5}
                    step={0.5}
                    marks={[
                      { value: 1.5, label: '1.5%' },
                      { value: 2.5, label: '2.5%' },
                      { value: 4, label: '4%' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Divider className="my-4" />
                
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="h6">Additional Income</Typography>
                  <IconButton
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    color="primary"
                    size="small"
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Estimated Monthly Social Security
                  </Typography>
                  <TextField
                    value={inputs.socialSecurityBenefits}
                    onChange={(e) => updateInput('socialSecurityBenefits', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                {showAdvanced && (
                  <Box className="mb-4">
                    <Typography variant="subtitle1" gutterBottom>
                      Other Monthly Income (pension, etc.)
                    </Typography>
                    <TextField
                      value={inputs.otherIncome}
                      onChange={(e) => updateInput('otherIncome', Number(e.target.value) || 0)}
                      type="number"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Location Tab */}
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Current Location</Typography>
                
                <Box className="mb-4">
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                      value={inputs.state}
                      onChange={(e) => updateInput('state', e.target.value)}
                      label="State"
                    >
                      {usStates.map(state => (
                        <MenuItem key={state.code} value={state.code}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box className="mb-4">
                  <Autocomplete
                    value={inputs.city}
                    onChange={(_event, newValue) => {
                      if (newValue) updateInput('city', newValue);
                    }}
                    options={availableCities}
                    renderInput={(params) => (
                      <TextField {...params} label="City" variant="outlined" />
                    )}
                  />
                </Box>
                
                <Box className="mb-4 p-3 bg-blue-50 rounded">
                  <Typography variant="subtitle1" gutterBottom className="flex items-center">
                    <LocationIcon className="mr-2" color="primary" />
                    Cost of Living Index: {costOfLivingIndex}
                  </Typography>
                  <Typography variant="body2">
                    {costOfLivingIndex > 100 
                      ? `Living in ${inputs.city}, ${inputs.state} is ${(costOfLivingIndex - 100).toFixed(1)}% more expensive than the national average.`
                      : costOfLivingIndex < 100
                        ? `Living in ${inputs.city}, ${inputs.state} is ${(100 - costOfLivingIndex).toFixed(1)}% less expensive than the national average.`
                        : `Living in ${inputs.city}, ${inputs.state} is at the national average cost.`
                    }
                  </Typography>
                </Box>
                
                <Box className="mb-4 p-3 bg-blue-50 rounded">
                  <Typography variant="subtitle1" gutterBottom className="flex items-center">
                    <MoneyIcon className="mr-2" color="primary" />
                    Estimated Tax Rate: {formatPercent(inputs.estimatedTaxRate)}
                  </Typography>
                  <Typography variant="body2">
                    This includes state and local taxes based on your location and income level.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Retirement Location</Typography>
                
                <Box className="p-4 mb-4 bg-gray-50 rounded">
                  <Typography variant="body1" paragraph>
                    Are you planning to relocate for retirement? Different locations can have significantly different costs of living, which impacts how much you'll need to save.
                  </Typography>
                  
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="mb-2">
                      Potential Retirement Locations (Cost of Living Index):
                    </Typography>
                    <Grid container spacing={1}>
                      {[
                        { state: 'FL', city: 'Tampa', index: 100.1 },
                        { state: 'AZ', city: 'Phoenix', index: 102.3 },
                        { state: 'NC', city: 'Raleigh', index: 95.8 },
                        { state: 'CO', city: 'Denver', index: 115.7 },
                        { state: 'TX', city: 'Austin', index: 106.6 },
                        { state: 'NV', city: 'Las Vegas', index: 97.2 },
                        { state: 'TN', city: 'Nashville', index: 96.5 },
                      ].map(location => (
                        <Grid item key={`${location.state}-${location.city}`}>
                          <Chip 
                            label={`${location.city}, ${location.state} (${location.index})`}
                            color={location.index < 100 ? "success" : "default"}
                            variant="outlined"
                            onClick={() => {
                              updateInput('state', location.state);
                              updateInput('city', location.city);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" className="mb-2">Location Impact on Retirement</Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Expense</TableCell>
                          <TableCell align="right">National Avg.</TableCell>
                          <TableCell align="right">Your Location</TableCell>
                          <TableCell align="right">Difference</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Housing</TableCell>
                          <TableCell align="right">$1,500</TableCell>
                          <TableCell align="right">{formatCurrency(1500 * costOfLivingIndex / 100)}</TableCell>
                          <TableCell align="right" className={costOfLivingIndex > 100 ? "text-red-500" : "text-green-500"}>
                            {costOfLivingIndex > 100 ? "+" : ""}{((costOfLivingIndex - 100) / 100 * 1500).toFixed(0)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Healthcare</TableCell>
                          <TableCell align="right">$550</TableCell>
                          <TableCell align="right">{formatCurrency(550 * costOfLivingIndex / 100)}</TableCell>
                          <TableCell align="right" className={costOfLivingIndex > 100 ? "text-red-500" : "text-green-500"}>
                            {costOfLivingIndex > 100 ? "+" : ""}{((costOfLivingIndex - 100) / 100 * 550).toFixed(0)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Food</TableCell>
                          <TableCell align="right">$400</TableCell>
                          <TableCell align="right">{formatCurrency(400 * costOfLivingIndex / 100)}</TableCell>
                          <TableCell align="right" className={costOfLivingIndex > 100 ? "text-red-500" : "text-green-500"}>
                            {costOfLivingIndex > 100 ? "+" : ""}{((costOfLivingIndex - 100) / 100 * 400).toFixed(0)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transportation</TableCell>
                          <TableCell align="right">$350</TableCell>
                          <TableCell align="right">{formatCurrency(350 * costOfLivingIndex / 100)}</TableCell>
                          <TableCell align="right" className={costOfLivingIndex > 100 ? "text-red-500" : "text-green-500"}>
                            {costOfLivingIndex > 100 ? "+" : ""}{((costOfLivingIndex - 100) / 100 * 350).toFixed(0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box className="p-3 bg-yellow-50 rounded">
                  <Typography variant="subtitle2" gutterBottom className="flex items-center">
                    <HealthcareIcon className="mr-2" color="error" />
                    Healthcare Costs in Retirement
                  </Typography>
                  <Typography variant="body2">
                    Healthcare costs typically rise faster than general inflation in retirement. The average retired couple age 65 may need approximately $300,000 saved (after tax) to cover healthcare expenses in retirement.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Expenses Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Monthly Expenses</Typography>
                
                <Box className="flex items-center mb-4">
                  <HomeIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Housing</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.housing}
                    onChange={(e) => updateExpense('housing', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <HealthcareIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Healthcare</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.healthcare}
                    onChange={(e) => updateExpense('healthcare', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <ExpensesIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Food</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.food}
                    onChange={(e) => updateExpense('food', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <TransportationIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Transportation</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.transportation}
                    onChange={(e) => updateExpense('transportation', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <MoneyIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Utilities</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.utilities}
                    onChange={(e) => updateExpense('utilities', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <TrendingUpIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Entertainment</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.entertainment}
                    onChange={(e) => updateExpense('entertainment', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="flex items-center mb-4">
                  <SettingsIcon color="primary" className="mr-2" />
                  <Typography variant="subtitle1" className="mr-4">Other</Typography>
                  <TextField
                    value={inputs.monthlyExpenses.other}
                    onChange={(e) => updateExpense('other', Number(e.target.value) || 0)}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box className="p-3 bg-gray-100 rounded mt-6 flex justify-between">
                  <Typography variant="subtitle1">Total Monthly Expenses:</Typography>
                  <Typography variant="h6">{formatCurrency(getTotalMonthlyExpenses())}</Typography>
                </Box>
                
                <Box className="p-3 bg-gray-100 rounded mt-2 flex justify-between">
                  <Typography variant="subtitle1">Total Annual Expenses:</Typography>
                  <Typography variant="h6">{formatCurrency(getTotalMonthlyExpenses() * 12)}</Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Expense Profile</Typography>
                
                <Box className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(inputs.monthlyExpenses).map(([key, value]) => ({
                          name: key.charAt(0).toUpperCase() + key.slice(1),
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {
                          Object.entries(inputs.monthlyExpenses).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))
                        }
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box className="mb-4 p-3 bg-blue-50 rounded">
                  <Typography variant="subtitle1" gutterBottom>
                    How Expenses Change in Retirement
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Some expenses typically decrease in retirement:
                  </Typography>
                  <ul className="list-disc pl-5 mb-3">
                    <li>Transportation costs (less commuting)</li>
                    <li>Work-related expenses</li>
                    <li>Mortgage payments (if paid off)</li>
                  </ul>
                  <Typography variant="body2" paragraph>
                    While others often increase:
                  </Typography>
                  <ul className="list-disc pl-5">
                    <li>Healthcare (increases by 50-100%)</li>
                    <li>Travel and leisure</li>
                    <li>Hobbies and entertainment</li>
                  </ul>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={calculateRetirement}
                  fullWidth
                  className="bg-[#2E7D32]"
                >
                  Calculate Retirement Plan
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Results Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={2} className="p-4 mb-4">
                <Typography variant="h6" className="mb-4">Retirement Summary</Typography>
                
                <Grid container spacing={4} className="mb-6">
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <AccountBalanceIcon color="primary" className="mr-2" />
                          <Typography variant="h6">Required Savings</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(results.requiredSavings)}
                        </Typography>
                        <Typography className="text-gray-600 mt-1">
                          For retirement at age {inputs.retirementAge}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <TrendingUpIcon color="primary" className="mr-2" />
                          <Typography variant="h6">Projected Savings</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(results.projectedSavings)}
                        </Typography>
                        <Typography className="text-gray-600 mt-1">
                          By age {inputs.retirementAge}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <MoneyIcon color="primary" className="mr-2" />
                          <Typography variant="h6">Monthly Income</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(results.monthlyRetirementIncome)}
                        </Typography>
                        <Typography className="text-gray-600 mt-1">
                          Sustainable income in retirement
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className={`h-full ${results.savingsShortfall > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <MoneyIcon color={results.savingsShortfall > 0 ? "error" : "success"} className="mr-2" />
                          <Typography variant="h6">
                            {results.savingsShortfall > 0 ? 'Savings Gap' : 'Savings Surplus'}
                          </Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(results.savingsShortfall > 0 ? results.savingsShortfall : results.projectedSavings - results.requiredSavings)}
                        </Typography>
                        <Typography className={`mt-1 ${results.savingsShortfall > 0 ? 'text-red-700' : 'text-green-700'}`}>
                          {results.savingsShortfall > 0 
                            ? 'Additional savings needed' 
                            : 'Extra savings available'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                    <CardContent>
                        <Box className="flex items-center mb-2">
                        <ExpensesIcon color="primary" className="mr-2" />
                        <Typography variant="h6">Total Annual Expenses</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                        {formatCurrency(results.totalExpenses)}
                        </Typography>
                        <Typography className="text-gray-600 mt-1">
                        Projected annual expenses at retirement
                        </Typography>
                    </CardContent>
                    </Card>
                    </Grid>
                    </Grid>
                
                {results.savingsShortfall > 0 && (
                  <Box className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <Typography variant="subtitle1" className="mb-2 font-bold">
                      How to Close Your Retirement Gap:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box className="p-3 bg-white rounded">
                          <Typography variant="subtitle2" gutterBottom>
                            Increase Monthly Savings
                          </Typography>
                          <Typography variant="body2">
                            Adding {formatCurrency(Math.ceil(results.savingsShortfall / ((inputs.retirementAge - inputs.currentAge) * 12)))} monthly to your current contribution would close the gap.
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={adjustToMeetGoal}
                            className="mt-2"
                          >
                            Apply This Change
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box className="p-3 bg-white rounded">
                          <Typography variant="subtitle2" gutterBottom>
                            Delay Retirement
                          </Typography>
                          <Typography variant="body2">
                            Working an additional {Math.ceil(results.savingsShortfall / (inputs.monthlyContribution * 12 + (results.projectedSavings * (inputs.expectedAnnualReturn / 100))))} years could eliminate the shortfall.
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => updateInput('retirementAge', inputs.retirementAge + Math.ceil(results.savingsShortfall / (inputs.monthlyContribution * 12 + (results.projectedSavings * (inputs.expectedAnnualReturn / 100)))))}
                            className="mt-2"
                          >
                            Apply This Change
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box className="p-3 bg-white rounded">
                          <Typography variant="subtitle2" gutterBottom>
                            Adjust Retirement Lifestyle
                          </Typography>
                          <Typography variant="body2">
                            Reducing your income replacement to {Math.max(50, Math.floor(inputs.desiredIncomeReplacement * (1 - results.savingsShortfall / results.requiredSavings)))}% could make your savings sufficient.
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => updateInput('desiredIncomeReplacement', Math.max(50, Math.floor(inputs.desiredIncomeReplacement * (1 - results.savingsShortfall / results.requiredSavings))))}
                            className="mt-2"
                          >
                            Apply This Change
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                <Box className="mb-6">
                  <Typography variant="h6" className="mb-3">Retirement Savings Growth</Typography>
                  <Box className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={results.yearlySavingsChart}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)} 
                          labelFormatter={(label) => `Age: ${label}`}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="savings" 
                          name="Total Savings" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="contributions" 
                          name="Contributions" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="interest" 
                          name="Interest Earned" 
                          stroke="#ffc658" 
                          fill="#ffc658" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className="mb-3">Retirement Income vs. Expenses</Typography>
                    <Box className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={results.retirementIncomeChart}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis 
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          />
                          <RechartsTooltip 
                            formatter={(value: number) => formatCurrency(value)} 
                            labelFormatter={(label) => `Age: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="income" 
                            name="Monthly Income" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="expenses" 
                            name="Monthly Expenses" 
                            stroke="#ff7300" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" className="mb-3">Retirement Expense Breakdown</Typography>
                    <Box className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={results.retirementByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {results.retirementByCategory.map((_entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box className="mt-6 text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveTab(0)}
                    className="mx-2 bg-[#2E7D32]"
                  >
                    Adjust Inputs
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={calculateRetirement}
                    className="mx-2"
                  >
                    Recalculate
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Navigation buttons */}
      <Box className="mt-4 flex justify-between">
        <Button
          variant="outlined"
          disabled={activeTab === 0}
          onClick={() => setActiveTab(prev => prev - 1)}
        >
          Previous
        </Button>
        
        {activeTab < 3 && (
          <Button
            variant="contained"
            className="bg-[#2E7D32] text-white"
            onClick={() => activeTab === 2 ? calculateRetirement() : setActiveTab(prev => prev + 1)}
          >
            {activeTab === 2 ? 'Calculate Results' : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default RetirementCalculator;