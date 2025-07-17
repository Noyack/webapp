import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { RealHourlyWageInputs } from '../../../../types/realHourlyWage';
import {
  calculateRealHourlyWage,
  calculateExpenseBreakdown,
  calculateTimeBreakdown,
  generateWageComparisons,
  formatCurrency,
  formatHours
} from '../../../../utils/realHourlyWageCalculations';

interface ResultsTabProps {
  inputs: RealHourlyWageInputs;
  onInputChange: <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => void;
}

export default function ResultsTab({ inputs }: ResultsTabProps) {
  
  // Calculate all results
  const calculation = useMemo(() => calculateRealHourlyWage(inputs), [inputs]);
  const expenseBreakdown = useMemo(() => calculateExpenseBreakdown(inputs.expenses, inputs.schedule), [inputs]);
  const timeBreakdown = useMemo(() => calculateTimeBreakdown(inputs.expenses, inputs.schedule), [inputs]);
  const wageComparisons = useMemo(() => generateWageComparisons(inputs), [inputs]);

  // Chart colors
  const COLORS = ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'];
  
  // Prepare data for charts
  const wageComparisonData = [
    { name: 'Gross Hourly', value: calculation.grossHourlyWage, color: '#FF6B6B' },
    { name: 'Net Hourly', value: calculation.netHourlyWage, color: '#4ECDC4' },
    { name: 'Real Hourly', value: calculation.realHourlyWage, color: '#2E7D32' }
  ];

  const expenseChartData = expenseBreakdown.map((item, index) => ({
    name: item.subcategory,
    value: item.annualCost,
    color: COLORS[index % COLORS.length]
  }));

  const timeChartData = timeBreakdown.map((item, index) => ({
    name: item.category,
    value: item.hoursPerYear,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length]
  }));

  // Determine wage category
  const getWageCategory = (wage: number) => {
    if (wage < 15) return { label: 'Below Living Wage', color: 'error', severity: 'error' as const };
    if (wage < 25) return { label: 'Moderate Wage', color: 'warning', severity: 'warning' as const };
    if (wage < 40) return { label: 'Good Wage', color: 'info', severity: 'info' as const };
    return { label: 'Excellent Wage', color: 'success', severity: 'success' as const };
  };

  const wageCategory = getWageCategory(calculation.realHourlyWage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" textAlign="center">
        Your Real Hourly Wage Results
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Here's what you actually earn per hour when factoring in all costs and time commitments
      </Typography>

      <Grid container spacing={3}>
        {/* Main Results Card */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4} textAlign="center">
                  <Typography variant="h2" color="primary" fontWeight="bold">
                    {formatCurrency(calculation.realHourlyWage)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Real Hourly Wage
                  </Typography>
                  <Chip 
                    label={wageCategory.label} 
                    color={wageCategory.color}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3} textAlign="center">
                      <Typography variant="h5" color="text.primary">
                        {formatCurrency(calculation.grossHourlyWage)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gross Hourly
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                      <Typography variant="h5" color="text.primary">
                        {formatCurrency(calculation.netHourlyWage)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Hourly
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                      <Typography variant="h5" color="text.primary">
                        {formatCurrency(calculation.totalAnnualExpenses)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Annual Expenses
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                      <Typography variant="h5" color="text.primary">
                        {formatHours(calculation.totalTimeCommitment)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Time/Year
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Wage Comparison Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Wage Comparison Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wageComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#2E7D32" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              
              <Alert severity={wageCategory.severity} sx={{ mt: 2 }}>
                Your real hourly wage is <strong>{((calculation.realHourlyWage / calculation.grossHourlyWage) * 100).toFixed(1)}%</strong> of your gross wage. 
                This accounts for taxes, expenses, and additional time commitments.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Breakdown Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⏰ Time Commitment Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                    >
                      {timeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatHours(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Breakdown */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💸 Work-Related Expenses
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Expense Category</TableCell>
                      <TableCell align="right">Annual Cost</TableCell>
                      <TableCell align="right">Hourly Impact</TableCell>
                      <TableCell align="right">% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseBreakdown.slice(0, 8).map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>{expense.subcategory}</TableCell>
                        <TableCell align="right">{formatCurrency(expense.annualCost)}</TableCell>
                        <TableCell align="right">{formatCurrency(expense.hourlyImpact)}</TableCell>
                        <TableCell align="right">{expense.percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Scenario Comparisons */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Scenario Comparisons
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Scenario</TableCell>
                      <TableCell align="right">Real Hourly Wage</TableCell>
                      <TableCell align="right">Annual Net</TableCell>
                      <TableCell align="right">Time (hrs/year)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wageComparisons.map((comparison, index) => (
                      <TableRow key={index} sx={{ bgcolor: index === 0 ? 'action.selected' : 'inherit' }}>
                        <TableCell>
                          {comparison.scenario}
                          {index === 0 && <Chip label="Current" size="small" sx={{ ml: 1 }} />}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(comparison.realHourlyWage)}
                          {index > 0 && (
                            <Typography variant="caption" display="block" color={
                              comparison.realHourlyWage > wageComparisons[0].realHourlyWage ? 'success.main' : 'error.main'
                            }>
                              {comparison.realHourlyWage > wageComparisons[0].realHourlyWage ? '+' : ''}
                              {formatCurrency(comparison.realHourlyWage - wageComparisons[0].realHourlyWage)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(comparison.netAnnualIncome)}</TableCell>
                        <TableCell align="right">{comparison.timeCommitment.toFixed(0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Key Insights & Recommendations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">Biggest Impact</Typography>
                    <Typography variant="body2">
                      {expenseBreakdown[0]?.subcategory} costs you {formatCurrency(expenseBreakdown[0]?.hourlyImpact || 0)} per hour worked.
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="warning">
                    <Typography variant="subtitle2">Time Cost</Typography>
                    <Typography variant="body2">
                      {calculation.timeImpact.toFixed(1)}% of your time commitment is unpaid (commuting, prep, breaks).
                    </Typography>
                  </Alert>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="success">
                    <Typography variant="subtitle2">Improvement Potential</Typography>
                    <Typography variant="body2">
                      Remote work could increase your real wage to{' '}
                      {formatCurrency(wageComparisons.find(c => c.scenario === 'Remote Work')?.realHourlyWage || 0)}.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" gutterBottom>
                🎯 Action Steps to Increase Your Real Hourly Wage:
              </Typography>
              <Box component="ol" sx={{ pl: 3 }}>
                <li>
                  <Typography variant="body2">
                    <strong>Reduce Commute:</strong> Consider remote work, moving closer, or carpooling to save{' '}
                    {formatCurrency((expenseBreakdown.find(e => e.category === 'Commuting')?.hourlyImpact || 0))} per hour.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Optimize Work Expenses:</strong> Review meal costs, clothing budget, and equipment purchases.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Negotiate Salary:</strong> A 10% raise would increase your real wage to{' '}
                    {formatCurrency(calculation.realHourlyWage * 1.1)}.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Tax Optimization:</strong> Consider tax-advantaged benefits and deductions.
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 