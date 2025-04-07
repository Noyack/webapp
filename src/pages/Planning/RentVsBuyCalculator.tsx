/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  Typography, 
  Slider, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  Grid, 
  Box, 
  Paper, 
  Tab, 
  Tabs, 
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { usStates, usHomeInsuranceRates, usPropertyTaxRates } from '../../utils/locationData';

// Interfaces
interface LocationData {
  city: string;
  state: string;
  medianHomePrice?: number;
  medianRent?: number;
  propertyTaxRate?: number;
  homeInsuranceRate?: number;
}

interface ResultData {
  year: number;
  buyingCost: number;
  rentingCost: number;
  buyingEquity: number;
  buyingNetCost: number;
}

// Define the main Calculator component
const RentVsBuyCalculator = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Input states with reasonable defaults
  const [location, setLocation] = useState<LocationData>({
    city: '',
    state: '',
  });
  
  // Basic inputs
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [annualIncome, setAnnualIncome] = useState(100000);
  
  // Home details
  const [homeInsuranceRate, setHomeInsuranceRate] = useState(0.5); // 0.5% of home value by default
  const [monthlyHOAFees, setMonthlyHOAFees] = useState(200);
  const [annualMaintenancePercent, setAnnualMaintenancePercent] = useState(1); // 1% of home value
  const [monthlyAdditionalExpenses, setMonthlyAdditionalExpenses] = useState(100);
  const [annualHomeValueIncrease, setAnnualHomeValueIncrease] = useState(3); // 3% appreciation
  
  // Rent details
  const [annualRentIncrease, setAnnualRentIncrease] = useState(3); // 3% increase
  const [monthlyRentersInsurance, setMonthlyRentersInsurance] = useState(30);
  
  // Advanced details
  const [annualInflation, setAnnualInflation] = useState(2); // 2% inflation
  const [annualReturnOnSavings, setAnnualReturnOnSavings] = useState(7); // 7% return on investments
  
  // Mortgage details
  const [mortgageTerm, setMortgageTerm] = useState(30); // 30-year fixed
  const [interestRate, setInterestRate] = useState(5.5); // 5.5% interest rate
  
  // Time period
  const [timeHorizon, setTimeHorizon] = useState(10); // 10 years
  
  // Results
  const [results, setResults] = useState<ResultData[]>([]);
  const [breakEvenYear, setBreakEvenYear] = useState<number | null>(null);
  const [summary, setSummary] = useState({
    totalBuyingCost: 0,
    totalRentingCost: 0,
    finalHomeValue: 0,
    finalEquity: 0,
    netBuyingCost: 0,
    savingsAfterTimePeriod: 0,
  });

  // Fetch state and city data
  useEffect(() => {
    if (location.state) {
      // Set property tax rate based on state
      const stateData = usPropertyTaxRates.find(s => s.stateCode === location.state);
      if (stateData) {
        setLocation(prev => ({
          ...prev,
          propertyTaxRate: stateData.propertyTaxRate,
        }));
      }

      // Set home insurance rate based on state
      const insuranceData = usHomeInsuranceRates.find(s => s.stateCode === location.state);
      if (insuranceData) {
        setHomeInsuranceRate(insuranceData.insuranceRate);
      }
      
      // In a real application, we would fetch median home price and rent data for the specific location
      // For now, we'll use estimated values based on the state
      // This would be replaced with an API call to a real estate data service
    }
  }, [location.state]);

  // Calculate results when inputs change
  useEffect(() => {
    calculateResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    monthlyRent, homePrice, downPaymentPercent, maritalStatus, annualIncome,
    homeInsuranceRate, monthlyHOAFees, annualMaintenancePercent, monthlyAdditionalExpenses,
    annualHomeValueIncrease, annualRentIncrease, monthlyRentersInsurance,
    annualInflation, annualReturnOnSavings, mortgageTerm, interestRate, timeHorizon,
    location
  ]);

  const calculateResults = () => {
    // Calculate key values
    const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
    const loanAmount = homePrice - downPaymentAmount;
    
    // Calculate monthly mortgage payment (P&I)
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    
    // Monthly mortgage payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
    const monthlyMortgagePayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // Calculate property tax (annual, based on location or default)
    const propertyTaxRate = location.propertyTaxRate || 1.1; // Default 1.1% if not provided
    const annualPropertyTax = (homePrice * propertyTaxRate) / 100;
    
    // Calculate homeowner's insurance (annual)
    const annualHomeInsurance = (homePrice * homeInsuranceRate) / 100;
    
    // Annual maintenance
    const annualMaintenance = (homePrice * annualMaintenancePercent) / 100;
    
    // Buying closing costs (estimated at 3-5% of home price)
    const buyingClosingCosts = homePrice * 0.04; // 4% estimate
    
    // Selling closing costs (typically 8-10% including agent commission)
    // const sellingClosingCosts = homePrice * 0.09; // 9% estimate
    
    // Initialize results array
    const resultsData: ResultData[] = [];
    
    // Track the mortgage balance for equity calculations
    let mortgageBalance = loanAmount;
    
    // Investment account for the difference between renting and buying upfront costs
    let investmentAccount = downPaymentAmount + buyingClosingCosts;
    
    // Track cumulative costs for both scenarios
    let cumulativeBuyingCost = buyingClosingCosts + downPaymentAmount;
    let cumulativeRentingCost = 0;
    
    // Current home value (will appreciate over time)
    let currentHomeValue = homePrice;
    
    // For each year in the time horizon, calculate costs and equity
    for (let year = 1; year <= timeHorizon; year++) {
      // BUYING SCENARIO
      
      // Annual mortgage payment (P&I)
      const annualMortgagePayment = monthlyMortgagePayment * 12;
      
      // Recalculate mortgage balance after year's payments
      const interestPaid = mortgageBalance * (interestRate / 100);
      const principalPaid = annualMortgagePayment - interestPaid;
      mortgageBalance = Math.max(0, mortgageBalance - principalPaid);
      
      // Update home value with appreciation
      currentHomeValue *= (1 + annualHomeValueIncrease / 100);
      
      // Calculate annual buying costs
      const inflationFactor = Math.pow(1 + annualInflation / 100, year - 1);
      const adjustedAnnualPropertyTax = annualPropertyTax * inflationFactor;
      const adjustedAnnualHomeInsurance = annualHomeInsurance * inflationFactor;
      const adjustedAnnualMaintenance = annualMaintenance * inflationFactor;
      const adjustedMonthlyHOA = monthlyHOAFees * inflationFactor;
      const adjustedMonthlyAdditional = monthlyAdditionalExpenses * inflationFactor;
      
      const annualBuyingCost = 
        annualMortgagePayment +
        adjustedAnnualPropertyTax +
        adjustedAnnualHomeInsurance +
        adjustedAnnualMaintenance +
        (adjustedMonthlyHOA * 12) +
        (adjustedMonthlyAdditional * 12);
      
      // Calculate equity (home value minus remaining mortgage)
      const equity = currentHomeValue - mortgageBalance;
      
      // Update cumulative buying cost
      cumulativeBuyingCost += annualBuyingCost;
      
      // Calculate net buying cost (cumulative cost minus equity)
      const netBuyingCost = cumulativeBuyingCost - equity;
      
      // RENTING SCENARIO
      
      // Calculate adjusted rent for the year
      const rentInflationFactor = Math.pow(1 + annualRentIncrease / 100, year - 1);
      const adjustedMonthlyRent = monthlyRent * rentInflationFactor;
      
      // Calculate adjusted renter's insurance
      const adjustedMonthlyRentersInsurance = monthlyRentersInsurance * inflationFactor;
      
      // Annual renting cost
      const annualRentingCost = (adjustedMonthlyRent * 12) + (adjustedMonthlyRentersInsurance * 12);
      
      // Update cumulative renting cost
      cumulativeRentingCost += annualRentingCost;
      
      // Update investment account (the money not spent on down payment and closing costs)
      // We only contribute the difference between annual costs
      const costDifference = annualBuyingCost - annualRentingCost;
      if (costDifference < 0) {
        // Buying costs less than renting, add the savings to investments
        investmentAccount *= (1 + annualReturnOnSavings / 100);
        investmentAccount -= costDifference; // costDifference is negative, so we subtract
      } else {
        // Renting costs less than buying, use some investments to cover the difference
        investmentAccount *= (1 + annualReturnOnSavings / 100);
        investmentAccount -= costDifference;
      }
      
      // Add data point to results
      resultsData.push({
        year,
        buyingCost: Math.round(cumulativeBuyingCost),
        rentingCost: Math.round(cumulativeRentingCost),
        buyingEquity: Math.round(equity),
        buyingNetCost: Math.round(netBuyingCost)
      });
    }
    
    // Calculate break-even point (when netBuyingCost < rentingCost)
    let breakEvenYearValue = null;
    for (let i = 0; i < resultsData.length; i++) {
      if (resultsData[i].buyingNetCost < resultsData[i].rentingCost) {
        breakEvenYearValue = i + 1;
        break;
      }
    }
    
    // Set break-even year
    setBreakEvenYear(breakEvenYearValue);
    
    // Set summary data
    const finalYear = resultsData[resultsData.length - 1];
    setSummary({
      totalBuyingCost: finalYear.buyingCost,
      totalRentingCost: finalYear.rentingCost,
      finalHomeValue: Math.round(currentHomeValue),
      finalEquity: finalYear.buyingEquity,
      netBuyingCost: finalYear.buyingNetCost,
      savingsAfterTimePeriod: Math.round(investmentAccount)
    });
    
    // Set results
    setResults(resultsData);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Formatter for dollar amounts
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate mortgage monthly payment for display
  const calculateMonthlyMortgage = () => {
    const loanAmount = homePrice * (1 - downPaymentPercent / 100);
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  // Tooltip formatter for chart
  const renderTooltip = (props: any) => {
    const { payload, label } = props;
    if (!payload || payload.length === 0) return null;

    return (
      <Paper className="p-4 bg-white shadow-lg">
        <Typography variant="subtitle2" className="mb-1">Year {label}</Typography>
        {payload.map((item: any, index: number) => (
          <Typography key={index} variant="body2" style={{ color: item.color }}>
            {item.name}: {formatCurrency(item.value)}
          </Typography>
        ))}
      </Paper>
    );
  };

  return (
    <Box className="rent-vs-buy-calculator p-4 bg-gray-50 rounded-lg">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Rent vs. Buy Calculator
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="calculator tabs">
          <Tab label="Basic Inputs" />
          <Tab label="Home Details" />
          <Tab label="Rent Details" />
          <Tab label="Advanced" />
          <Tab label="Results" />
        </Tabs>
      </Box>
      
      {/* Basic Inputs Tab */}
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Location & Personal Details</Typography>
                
                <Box className="mb-4">
                  <Autocomplete
                    options={usStates}
                    getOptionLabel={(option) => option.name}
                    onChange={(_event, newValue) => {
                      setLocation(prev => ({
                        ...prev,
                        state: newValue?.code || ''
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="State" 
                        variant="outlined" 
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </Box>
                
                <Box className="mb-4">
                  <TextField
                    label="City"
                    value={location.city}
                    onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Box>
                
                <Box className="mb-4">
                  <FormControl component="fieldset">
                    <Typography variant="subtitle1" className="mb-2">Marital Status</Typography>
                    <RadioGroup
                      row
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                      <FormControlLabel value="single" control={<Radio color="primary" />} label="Single" />
                      <FormControlLabel value="married" control={<Radio color="primary" />} label="Married" />
                    </RadioGroup>
                  </FormControl>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Annual Income
                  </Typography>
                  <TextField
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Rent vs. Buy Basics</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Rent
                  </Typography>
                  <TextField
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
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
                    Target Home Price
                  </Typography>
                  <TextField
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
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
                    Down Payment ({downPaymentPercent}%)
                  </Typography>
                  <Slider
                    value={downPaymentPercent}
                    onChange={(_e, value) => setDownPaymentPercent(value as number)}
                    aria-labelledby="down-payment-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={3}
                    max={50}
                  />
                  <Typography variant="body2" className="text-gray-600">
                    Down Payment Amount: {formatCurrency(homePrice * (downPaymentPercent / 100))}
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    How long do you plan to stay? ({timeHorizon} years)
                  </Typography>
                  <Slider
                    value={timeHorizon}
                    onChange={(_e, value) => setTimeHorizon(value as number)}
                    aria-labelledby="time-horizon-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={35}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Home Details Tab */}
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Mortgage Details</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Mortgage Term (Years)
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      value={mortgageTerm}
                      onChange={(e) => setMortgageTerm(Number(e.target.value))}
                    >
                      <MenuItem value={15}>15-year fixed</MenuItem>
                      <MenuItem value={20}>20-year fixed</MenuItem>
                      <MenuItem value={30}>30-year fixed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Interest Rate ({interestRate}%)
                  </Typography>
                  <Slider
                    value={interestRate}
                    onChange={(_e, value) => setInterestRate(value as number)}
                    aria-labelledby="interest-rate-slider"
                    valueLabelDisplay="auto"
                    step={0.125}
                    marks
                    min={2.5}
                    max={10}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Estimated Monthly Mortgage Payment: {formatCurrency(calculateMonthlyMortgage())}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Home Expenses</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Homeowner's Insurance Rate ({homeInsuranceRate}% of home value annually)
                  </Typography>
                  <Slider
                    value={homeInsuranceRate}
                    onChange={(_e, value) => setHomeInsuranceRate(value as number)}
                    aria-labelledby="insurance-rate-slider"
                    valueLabelDisplay="auto"
                    step={0.05}
                    marks
                    min={0.1}
                    max={1.5}
                  />
                  <Typography variant="body2" className="text-gray-600">
                    Annual Amount: {formatCurrency(homePrice * (homeInsuranceRate / 100))}
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly HOA/Condo Fees
                  </Typography>
                  <TextField
                    value={monthlyHOAFees}
                    onChange={(e) => setMonthlyHOAFees(Number(e.target.value))}
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
                    Annual Maintenance ({annualMaintenancePercent}% of home value)
                  </Typography>
                  <Slider
                    value={annualMaintenancePercent}
                    onChange={(_e, value) => setAnnualMaintenancePercent(value as number)}
                    aria-labelledby="maintenance-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    marks
                    min={0.5}
                    max={3}
                  />
                  <Typography variant="body2" className="text-gray-600">
                    Annual Amount: {formatCurrency(homePrice * (annualMaintenancePercent / 100))}
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Additional Expenses
                  </Typography>
                  <TextField
                    value={monthlyAdditionalExpenses}
                    onChange={(e) => setMonthlyAdditionalExpenses(Number(e.target.value))}
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
                    Annual Home Value Increase ({annualHomeValueIncrease}%)
                  </Typography>
                  <Slider
                    value={annualHomeValueIncrease}
                    onChange={(_e, value) => setAnnualHomeValueIncrease(value as number)}
                    aria-labelledby="home-appreciation-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={0}
                    max={10}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Rent Details Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Rent Increases & Insurance</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Annual Rent Increase ({annualRentIncrease}%)
                  </Typography>
                  <Slider
                    value={annualRentIncrease}
                    onChange={(_e, value) => setAnnualRentIncrease(value as number)}
                    aria-labelledby="rent-increase-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={0}
                    max={10}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Renter's Insurance
                  </Typography>
                  <TextField
                    value={monthlyRentersInsurance}
                    onChange={(e) => setMonthlyRentersInsurance(Number(e.target.value))}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Rent Summary</Typography>
                
                <Box className="mb-4">
                  <Typography variant="body1" gutterBottom>
                    Current Monthly Rent: {formatCurrency(monthlyRent)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Annual Rent: {formatCurrency(monthlyRent * 12)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Projected Monthly Rent in {timeHorizon} years: {formatCurrency(
                      monthlyRent * Math.pow(1 + annualRentIncrease / 100, timeHorizon)
                    )}
                  </Typography>
                </Box>
                
                <Box className="mt-4">
                  <Typography variant="subtitle1" className="mb-2">Projected Rent Costs</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={Array.from({ length: timeHorizon }, (_, i) => ({
                        year: i + 1,
                        rent: monthlyRent * 12 * Math.pow(1 + annualRentIncrease / 100, i)
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="rent" name="Annual Rent" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Advanced Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Economic Factors</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Annual General Inflation ({annualInflation}%)
                  </Typography>
                  <Slider
                    value={annualInflation}
                    onChange={(_e, value) => setAnnualInflation(value as number)}
                    aria-labelledby="inflation-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    marks
                    min={0}
                    max={10}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Annual Rate of Return on Savings ({annualReturnOnSavings}%)
                  </Typography>
                  <Slider
                    value={annualReturnOnSavings}
                    onChange={(_e, value) => setAnnualReturnOnSavings(value as number)}
                    aria-labelledby="return-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={1}
                    max={12}
                  />
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Property Tax Rate ({location.propertyTaxRate || 1.1}% of home value)
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Based on selected state. Annual amount: {formatCurrency(homePrice * ((location.propertyTaxRate || 1.1) / 100))}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Tax Considerations</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Federal Tax Bracket
                  </Typography>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      value={maritalStatus === 'single' ? 
                        getFederalTaxBracket(annualIncome, 'single') : 
                        getFederalTaxBracket(annualIncome, 'married')}
                      disabled
                    >
                      <MenuItem value={10}>10%</MenuItem>
                      <MenuItem value={12}>12%</MenuItem>
                      <MenuItem value={22}>22%</MenuItem>
                      <MenuItem value={24}>24%</MenuItem>
                      <MenuItem value={32}>32%</MenuItem>
                      <MenuItem value={35}>35%</MenuItem>
                      <MenuItem value={37}>37%</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" className="text-gray-600 mt-1">
                    Estimated based on income and filing status
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="body1" gutterBottom>
                    Mortgage Interest Deduction
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Our calculator automatically factors in the tax benefits of the mortgage interest deduction based on your tax bracket.
                  </Typography>
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="body1" gutterBottom>
                    Property Tax Deduction
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Property taxes paid on your primary residence are generally deductible up to $10,000 per year when itemizing deductions.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Results Tab */}
      <Box role="tabpanel" hidden={activeTab !== 4}>
        {activeTab === 4 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4 text-center">
                  Rent vs. Buy Comparison Over {timeHorizon} Years
                </Typography>
                
                <Box className="mb-6" height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={results}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value / 1000}k`}
                        label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={renderTooltip} />
                      <Legend />
                      <Bar dataKey="rentingCost" name="Total Renting Cost" fill="#8884d8" />
                      <Bar dataKey="buyingNetCost" name="Net Buying Cost (after equity)" fill="#82ca9d" />
                      <Bar dataKey="buyingEquity" name="Home Equity" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box className="flex flex-col items-center justify-center mb-6 p-4 bg-[#F5F7FA] rounded-lg">
                  {breakEvenYear ? (
                    <Typography variant="h5" className="mb-2 text-[#2E7D32] font-bold">
                      Buying becomes cheaper than renting after {breakEvenYear} {breakEvenYear === 1 ? 'year' : 'years'}
                    </Typography>
                  ) : (
                    <Typography variant="h5" className="mb-2 text-[#d32f2f] font-bold">
                      Renting is cheaper for the entire {timeHorizon}-year period
                    </Typography>
                  )}
                  
                  <Typography variant="subtitle1" className="text-center">
                    {breakEvenYear && breakEvenYear <= timeHorizon 
                      ? `Based on your inputs, buying a home becomes a better financial decision if you plan to stay for at least ${breakEvenYear} years.`
                      : `Based on your inputs, renting would be a better financial decision for the entire ${timeHorizon}-year period.`
                    }
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} className="p-4 bg-[#FAFBFD]">
                      <Typography variant="h6" className="mb-3 text-[#011E5A]">
                        Buying Summary (After {timeHorizon} Years)
                      </Typography>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Total cost:</span>
                          <span className="font-medium">{formatCurrency(summary.totalBuyingCost)}</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Home value:</span>
                          <span className="font-medium">{formatCurrency(summary.finalHomeValue)}</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Home equity:</span>
                          <span className="font-medium">{formatCurrency(summary.finalEquity)}</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between text-[#2E7D32]">
                          <span className="font-bold">Net cost (after equity):</span>
                          <span className="font-bold">{formatCurrency(summary.netBuyingCost)}</span>
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} className="p-4 bg-[#FAFBFD]">
                      <Typography variant="h6" className="mb-3 text-[#011E5A]">
                        Renting Summary (After {timeHorizon} Years)
                      </Typography>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Total rent paid:</span>
                          <span className="font-medium">{formatCurrency(summary.totalRentingCost)}</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Investment account balance:</span>
                          <span className="font-medium">{formatCurrency(summary.savingsAfterTimePeriod)}</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between">
                          <span>Home ownership:</span>
                          <span className="font-medium">None</span>
                        </Typography>
                      </Box>
                      <Box className="mb-2">
                        <Typography variant="body1" className="flex justify-between text-[#8884d8]">
                          <span className="font-bold">Net cost:</span>
                          <span className="font-bold">{formatCurrency(summary.totalRentingCost - summary.savingsAfterTimePeriod)}</span>
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box className="mt-6 flex justify-center">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setActiveTab(0)}
                    className="bg-[#2E7D32] text-white"
                  >
                    Adjust Inputs
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
        
        {activeTab < 4 && (
          <Button
            variant="contained"
            className="bg-[#2E7D32] text-white"
            onClick={() => setActiveTab(prev => prev + 1)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Helper function to estimate federal tax bracket based on income and filing status
function getFederalTaxBracket(income: number, filingStatus: 'single' | 'married'): number {
  if (filingStatus === 'single') {
    if (income <= 11000) return 10;
    if (income <= 44725) return 12;
    if (income <= 95375) return 22;
    if (income <= 182100) return 24;
    if (income <= 231250) return 32;
    if (income <= 578125) return 35;
    return 37;
  } else { // married filing jointly
    if (income <= 22000) return 10;
    if (income <= 89450) return 12;
    if (income <= 190750) return 22;
    if (income <= 364200) return 24;
    if (income <= 462500) return 32;
    if (income <= 693750) return 35;
    return 37;
  }
}

export default RentVsBuyCalculator;