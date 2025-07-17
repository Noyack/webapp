import { FC } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  MonetizationOn as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { RetirementInputs, RetirementResults, CHART_COLORS } from '../../../../types/retirement';
import { formatCurrency, formatPercent } from '../../../../utils/retirementCalculations';
import ExportButtons from '../../../../components/ExportButtons';
import { GenericExportData } from '../../../../utils/exportUtils';

interface ResultsTabProps {
  inputs: RetirementInputs;
  results: RetirementResults;
  onAdjustToMeetGoal: () => void;
  onNavigateToMonteCarlo: () => void;
}

const ResultsTab: FC<ResultsTabProps> = ({ inputs, results, onAdjustToMeetGoal, onNavigateToMonteCarlo }) => {
  if (results.requiredSavings === 0) {
    return (
      <Box className="text-center p-8">
        <Typography variant="h6" color="textSecondary">
          No results to display. Please calculate your retirement plan first.
        </Typography>
      </Box>
    );
  }

  const isOnTrack = results.savingsShortfall <= 0;
  const savingsProgress = (results.projectedSavings / results.requiredSavings) * 100;

  // Prepare export data
  const prepareExportData = (): GenericExportData => {
    const totalExpenses = Object.values(inputs.monthlyExpenses).reduce((sum, expense) => sum + expense, 0);
    
    return {
      calculatorName: 'Retirement Calculator',
      inputs: {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        expectedAnnualReturn: inputs.expectedAnnualReturn,
        estimatedTaxRate: inputs.estimatedTaxRate,
        state: inputs.state,
        city: inputs.city,
        totalMonthlyExpenses: totalExpenses,
        housing: inputs.monthlyExpenses.housing,
        food: inputs.monthlyExpenses.food,
        transportation: inputs.monthlyExpenses.transportation,
        healthcare: inputs.monthlyExpenses.healthcare,
        entertainment: inputs.monthlyExpenses.entertainment,
        other: inputs.monthlyExpenses.other
      },
      keyMetrics: [
        { label: 'Retirement Status', value: isOnTrack ? 'On Track' : 'Behind' },
        { label: 'Required Savings', value: `$${results.requiredSavings.toLocaleString()}` },
        { label: 'Projected Savings', value: `$${results.projectedSavings.toLocaleString()}` },
        { label: 'Monthly Retirement Income', value: `$${results.monthlyRetirementIncome.toLocaleString()}` },
        { label: 'Savings Progress', value: `${Math.min(savingsProgress, 100).toFixed(1)}%` },
        { label: 'Years to Retirement', value: `${inputs.retirementAge - inputs.currentAge} years` },
        { label: 'Expected Annual Return', value: `${inputs.expectedAnnualReturn}%` },
        { label: 'Total Tax Impact', value: `$${results.totalTaxPaid.toLocaleString()}` },
        { label: 'Savings Shortfall', value: results.savingsShortfall > 0 ? `$${results.savingsShortfall.toLocaleString()}` : '$0' }
      ],
      summary: {
        requiredSavings: results.requiredSavings,
        projectedSavings: results.projectedSavings,
        monthlyRetirementIncome: results.monthlyRetirementIncome,
        savingsShortfall: results.savingsShortfall,
        totalTaxPaid: results.totalTaxPaid,
        isOnTrack: isOnTrack,
        savingsProgress: savingsProgress,
        yearsToRetirement: inputs.retirementAge - inputs.currentAge
      },
      recommendations: [
        isOnTrack ? 'Congratulations! You\'re on track for retirement' : `You need to save an additional $${results.savingsShortfall.toLocaleString()} to meet your retirement goals`,
        inputs.monthlyContribution < 500 ? 'Consider increasing your monthly contributions for better retirement security' : 'Good job maintaining consistent monthly contributions',
        inputs.expectedAnnualReturn > 8 ? 'Your expected return may be optimistic - consider a more conservative estimate' : 'Your expected return assumptions appear reasonable',
        results.totalTaxPaid > 50000 ? 'Consider tax-advantaged retirement accounts to reduce your tax burden' : 'Your tax planning looks reasonable',
        'Review and adjust your retirement plan annually',
        'Consider working with a financial advisor for personalized guidance',
        'Don\'t forget to account for inflation in your retirement planning'
      ]
    };
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card className={`h-full ${isOnTrack ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className={isOnTrack ? 'text-green-600' : 'text-red-600'}>
                    {isOnTrack ? <CheckCircleIcon /> : <WarningIcon />}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Retirement Status
                  </Typography>
                </Box>
                <Typography variant="h6" className={isOnTrack ? 'text-green-600' : 'text-red-600'}>
                  {isOnTrack ? 'On Track' : 'Behind'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <AccountBalanceIcon color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    Required Savings
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {formatCurrency(results.requiredSavings)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    Projected Savings
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {formatCurrency(results.projectedSavings)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <MoneyIcon color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    Monthly Income
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {formatCurrency(results.monthlyRetirementIncome)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress and Gap Analysis */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Savings Progress</Typography>
            <Box className="mb-4">
              <Box className="flex justify-between mb-2">
                <Typography variant="body2">Progress to Goal</Typography>
                <Typography variant="body2">{Math.min(savingsProgress, 100).toFixed(1)}%</Typography>
              </Box>
              <Box className="w-full bg-gray-200 rounded-full h-2">
                <Box 
                  className={`h-2 rounded-full ${isOnTrack ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(savingsProgress, 100)}%` }}
                />
              </Box>
            </Box>
            
            {!isOnTrack && (
              <Box className="p-3 bg-red-50 rounded mb-4">
                <Typography variant="subtitle2" className="text-red-700 mb-2">
                  Savings Gap: {formatCurrency(results.savingsShortfall)}
                </Typography>
                <Typography variant="body2" className="text-red-600 mb-3">
                  You're currently {formatCurrency(results.savingsShortfall)} short of your retirement goal.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={onAdjustToMeetGoal}
                  size="small"
                >
                  Adjust to Meet Goal
                </Button>
              </Box>
            )}
            
            {isOnTrack && (
              <Box className="p-3 bg-green-50 rounded">
                <Typography variant="subtitle2" className="text-green-700 mb-2">
                  Congratulations! You're on track for retirement.
                </Typography>
                <Typography variant="body2" className="text-green-600">
                  Your current savings plan should meet your retirement goals.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Key Metrics</Typography>
            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body2">Years to Retirement:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {inputs.retirementAge - inputs.currentAge}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2">Expected Return:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatPercent(inputs.expectedAnnualReturn)}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2">Monthly Contribution:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(inputs.monthlyContribution)}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2">Total Tax Impact:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(results.totalTaxPaid)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Run Simulation Section */}
      <Box className="mb-6 text-center">
        <Paper elevation={2} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <Typography variant="h6" className="mb-3 text-blue-800">
            Want to see how your plan performs under different market conditions?
          </Typography>
          <Typography variant="body1" className="mb-4 text-gray-600">
            Run a Monte Carlo simulation to analyze thousands of market scenarios and see the probability of your retirement success.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AnalyticsIcon />}
            onClick={onNavigateToMonteCarlo}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #7B1FA2 90%)',
              }
            }}
          >
            Run Monte Carlo Simulation
          </Button>
        </Paper>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={4} className="mb-6">
        {/* Savings Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Savings Growth Over Time</Typography>
            <Box className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlySavingsChart} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(age) => `Age: ${age}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stackId="1"
                    stroke={CHART_COLORS[0]}
                    fill={CHART_COLORS[0]}
                    name="Total Savings"
                  />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stackId="2"
                    stroke={CHART_COLORS[1]}
                    fill={CHART_COLORS[1]}
                    name="Total Contributions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Retirement Income Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Retirement Income Sources</Typography>
            <Box className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <Pie
                    data={[
                      { name: 'Investment Withdrawals', value: (results.projectedSavings * 0.04) / 12 },
                      { name: 'Social Security', value: inputs.socialSecurityBenefits },
                      { name: 'Other Income', value: inputs.otherIncome }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {results.retirementByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Retirement Income vs Expenses Chart */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12}>
          <Paper elevation={2} className="p-7">
            <Typography variant="h6" className="mb-4">Retirement Income vs Expenses</Typography>
            <Box className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.retirementIncomeChart} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(age) => `Age: ${age}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={3}
                    name="Monthly Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={3}
                    name="Monthly Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Expense Breakdown */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Retirement Expenses by Category</Typography>
            <Box className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.retirementByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {results.retirementByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Savings Needed by Expense</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Expense Category</TableCell>
                    <TableCell align="right">Annual Cost</TableCell>
                    <TableCell align="right">Savings Needed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.savingsNeededByExpense.map((item) => (
                    <TableRow key={item.expense}>
                      <TableCell>{item.expense}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(results.retirementByCategory.find(cat => cat.name === item.expense)?.value || 0)}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.amountNeeded)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Key Insights */}
      <Paper elevation={2} className="p-4">
        <Typography variant="h6" className="mb-4">Key Insights & Recommendations</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className="p-3 bg-blue-50 rounded">
              <Box className="flex items-start">
                <InfoIcon color="primary" className="mr-2 mt-1" />
                <Box>
                  <Typography variant="subtitle2" className="text-blue-700 mb-1">
                    Savings Rate Impact
                  </Typography>
                  <Typography variant="body2" className="text-blue-600">
                    You're saving {((inputs.monthlyContribution * 12 / inputs.currentAnnualIncome) * 100).toFixed(1)}% of your income. 
                    Financial experts recommend 10-15% for retirement.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box className="p-3 bg-green-50 rounded">
              <Box className="flex items-start">
                <TrendingUpIcon color="success" className="mr-2 mt-1" />
                <Box>
                  <Typography variant="subtitle2" className="text-green-700 mb-1">
                    Time Advantage
                  </Typography>
                  <Typography variant="body2" className="text-green-600">
                    With {inputs.retirementAge - inputs.currentAge} years until retirement, 
                    you have time for compound growth to work in your favor.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box className="p-3 bg-yellow-50 rounded">
              <Box className="flex items-start">
                <WarningIcon color="warning" className="mr-2 mt-1" />
                <Box>
                  <Typography variant="subtitle2" className="text-yellow-700 mb-1">
                    Inflation Impact
                  </Typography>
                  <Typography variant="body2" className="text-yellow-600">
                    At {inputs.expectedInflation}% inflation, your expenses will roughly 
                    {(Math.pow(1 + inputs.expectedInflation/100, inputs.retirementAge - inputs.currentAge)).toFixed(1)}x 
                    by retirement.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Export Section */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Export Your Retirement Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
          Download your retirement projections, expense breakdown, and personalized recommendations
        </Typography>
        <ExportButtons data={prepareExportData()} />
      </Box>
    </Box>
  );
};

export default ResultsTab; 