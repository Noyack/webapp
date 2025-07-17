// tabs/AnalysisTab.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { 
  FourOhOneKData, 
  EnhancedCalculations, 
  RetirementIncome,
  NATIONAL_AVERAGES,
  formatCurrency
} from '../../../../utils/fourOhOneK';

interface AnalysisTabProps {
  data: FourOhOneKData;
  calculations: EnhancedCalculations;
  retirementIncome: RetirementIncome;
  chartData: any[];
  feeImpact: number;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({
  data,
  calculations,
  retirementIncome,
  chartData,
  feeImpact
}) => {
  const calculateFeeComparison = () => {
    const years = calculations.yearsToRetirement;
    const baseBalance = calculations.finalBalance;
    
    return [0.25, 0.5, 1.0, 1.5, 2.0].map(fee => {
      const feeImpact = (1 - Math.pow(1 - fee/100, years)) * baseBalance;
      return {
        fee,
        balance: baseBalance - feeImpact,
        lost: feeImpact,
        isCurrent: Math.abs(fee - data.totalFees) < 0.1
      };
    });
  };

  const feeComparison = calculateFeeComparison();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>📈 Advanced Financial Analysis</Typography>
      
      {/* Enhanced Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {formatCurrency(calculations.finalBalance)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Final Balance</Typography>
            <Chip 
              label={`+${((calculations.finalBalance / data.currentBalance - 1) * 100).toFixed(0)}% growth`}
              size="small"
              color="success"
              sx={{ mt: 1 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {formatCurrency(calculations.totalEmployerMatch)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Total Employer Match</Typography>
            <Typography variant="caption" display="block">Free money!</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {formatCurrency(calculations.totalGrowth)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Investment Growth</Typography>
            <Typography variant="caption" display="block">Compound interest</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="purple" fontWeight="bold">
              {formatCurrency(retirementIncome.totalMonthlyIncome)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Monthly Retirement Income</Typography>
            <Typography variant="caption" display="block">Including Social Security</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Interactive Growth Chart */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interactive 401(k) Growth Projection
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="age" 
                      label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [
                        formatCurrency(value), 
                        name === 'contributionGrowth' ? 'Your Contributions' :
                        name === 'employerMatchGrowth' ? 'Employer Match' :
                        name === 'investmentGrowth' ? 'Investment Growth' :
                        name === 'totalValue' ? 'Total Balance' : name
                      ]}
                      labelFormatter={(age) => `Age: ${age}`}
                    />
                    <Legend />
                    
                    <Area
                      type="monotone"
                      dataKey="contributionGrowth"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      name="Your Contributions"
                    />
                    <Area
                      type="monotone"
                      dataKey="employerMatchGrowth"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                      name="Employer Match"
                    />
                    <Area
                      type="monotone"
                      dataKey="investmentGrowth"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                      name="Investment Growth"
                    />
                    
                    <ReferenceLine x={data.retirementAge} stroke="red" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* National Comparison */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 National Comparison
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Your Balance vs Peers</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(calculations.nationalComparison.balancePercentile, 100)}
                  color={calculations.nationalComparison.balancePercentile > 75 ? 'success' : 
                         calculations.nationalComparison.balancePercentile > 50 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {calculations.nationalComparison.balancePercentile.toFixed(0)}th percentile for your age group
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Your Contribution Rate vs National Average</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(calculations.nationalComparison.contributionPercentile, 100)}
                  color={calculations.nationalComparison.contributionPercentile > 75 ? 'success' : 
                         calculations.nationalComparison.contributionPercentile > 50 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  You: {calculations.contributionPercent.toFixed(1)}% vs Avg: {NATIONAL_AVERAGES.contributionRate}%
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Age Group Benchmarks
              </Typography>
              <Box sx={{ fontSize: 'small' }}>
                {Object.entries(NATIONAL_AVERAGES.averageBalance).map(([ageGroup, amount]) => (
                  <Box key={ageGroup} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <span>{ageGroup}:</span>
                    <span>{formatCurrency(amount)}</span>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Retirement Income Breakdown */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>💸 Retirement Income Analysis</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Monthly 401(k) Withdrawal (4% rule)</Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {formatCurrency(retirementIncome.monthlyWithdrawal)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Monthly Social Security</Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(data.socialSecurityEstimate)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Monthly Income</Typography>
                <Typography variant="h4" color="purple" fontWeight="bold">
                  {formatCurrency(retirementIncome.totalMonthlyIncome)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Income Replacement Ratio</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {retirementIncome.replacementRatio.toFixed(0)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(retirementIncome.replacementRatio, 100)}
                  color={retirementIncome.replacementRatio >= 80 ? 'success' : 
                         retirementIncome.replacementRatio >= 60 ? 'warning' : 'error'}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                Experts recommend replacing 70-90% of pre-retirement income.
                Social Security covers {retirementIncome.socialSecurityPortion.toFixed(0)}% of your retirement income.
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
                Cost of {data.totalFees}% annual fees over {calculations.yearsToRetirement} years:
              </Typography>
              
              <Typography variant="h4" color="error.main" fontWeight="bold" gutterBottom>
                {formatCurrency(feeImpact)}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Fee Impact Comparison:
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fee Rate</TableCell>
                      <TableCell align="right">Final Balance</TableCell>
                      <TableCell align="right">Lost to Fees</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feeComparison.map(({ fee, balance, lost, isCurrent }) => (
                      <TableRow 
                        key={fee}
                        sx={{ bgcolor: isCurrent ? 'primary.50' : 'inherit' }}
                      >
                        <TableCell>
                          <strong>{fee}%</strong>
                          {isCurrent && ' (current)'}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(balance)}</TableCell>
                        <TableCell align="right" sx={{ color: 'error.main' }}>
                          {formatCurrency(lost)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> Reducing fees by just 0.5% could save you tens of thousands over your career.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics Summary */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📈 Performance Summary</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      {((calculations.finalBalance / calculations.totalContributions - 1) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Total Return on Investment</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      {((calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Employer Match Efficiency</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="info.main" fontWeight="bold">
                      {calculations.nationalComparison.balancePercentile.toFixed(0)}th
                    </Typography>
                    <Typography variant="body2">Percentile vs National Average</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="warning.main" fontWeight="bold">
                      {retirementIncome.replacementRatio.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Income Replacement Ratio</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Insights */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>💡 Key Insights from Your Analysis</Typography>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>
            Your {formatCurrency(calculations.finalBalance)} projected balance will provide{' '}
            {formatCurrency(retirementIncome.monthlyWithdrawal)} monthly income using the 4% withdrawal rule
          </li>
          <li>
            Combined with Social Security ({formatCurrency(data.socialSecurityEstimate)}/month), you'll have{' '}
            {formatCurrency(retirementIncome.totalMonthlyIncome)} total monthly income
          </li>
          <li>
            This represents {retirementIncome.replacementRatio.toFixed(0)}% of your current income -
            {retirementIncome.replacementRatio >= 70 ? ' excellent!' : ' consider increasing contributions'}
          </li>
          <li>
            You're in the {calculations.nationalComparison.balancePercentile.toFixed(0)}th percentile for your age group
            {calculations.nationalComparison.balancePercentile > 50 ? ' - above average!' : ' - room for improvement'}
          </li>
        </ul>
      </Alert>
    </Box>
  );
};

export default AnalysisTab;