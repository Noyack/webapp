// tabs/TaxStrategyTab.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  FourOhOneKData, 
  EnhancedCalculations,
  formatCurrency
} from '../../../../utils/fourOhOneK';

interface TaxStrategyTabProps {
  data: FourOhOneKData;
  calculations: EnhancedCalculations;
  chartData: any[];
  updateData: (field: keyof FourOhOneKData, value: any) => void;
}

const TaxStrategyTab: React.FC<TaxStrategyTabProps> = ({
  data,
  calculations,
  chartData,
  updateData
}) => {
  // Calculate tax scenarios for comparison
  const calculateTaxScenarios = () => {
    const scenarios = [
      { name: 'All Traditional', traditional: 100, roth: 0 },
      { name: '75% Traditional', traditional: 75, roth: 25 },
      { name: '50/50 Split', traditional: 50, roth: 50 },
      { name: '25% Traditional', traditional: 25, roth: 75 },
      { name: 'All Roth', traditional: 0, roth: 100 }
    ];

    return scenarios.map(scenario => {
      const traditionalAmount = calculations.finalBalance * (scenario.traditional / 100);
      const rothAmount = calculations.finalBalance * (scenario.roth / 100);
      
      // Assume 22% current tax rate, 18% retirement tax rate
      const currentTaxSavings = (calculations.totalContributions * scenario.traditional / 100) * 0.22;
      const retirementTaxOwed = traditionalAmount * 0.18;
      const netAfterTax = rothAmount + (traditionalAmount * 0.82); // Traditional after 18% tax
      
      return {
        ...scenario,
        traditionalAmount,
        rothAmount,
        currentTaxSavings,
        retirementTaxOwed,
        netAfterTax,
        monthlyIncome: (netAfterTax * 0.04) / 12
      };
    });
  };

  const taxScenarios = calculateTaxScenarios();

  // Calculate break-even tax rate
  const calculateBreakEvenRate = () => {
    const currentTaxRate = 0.22;
    const traditionalSavings = calculations.totalContributions * currentTaxRate;
    // Break-even retirement tax rate where Traditional = Roth
    return (traditionalSavings / calculations.finalBalance) * 100;
  };

  const breakEvenRate = calculateBreakEvenRate();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>🏛️ Tax Strategy & Account Types</Typography>
      
      <Grid container spacing={4}>
        {/* Account Type Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Account Type Strategy</Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>401(k) Account Type</InputLabel>
                <Select
                  value={data.accountType}
                  label="401(k) Account Type"
                  onChange={(e) => updateData('accountType', e.target.value)}
                >
                  <MenuItem value="traditional">Traditional 401(k)</MenuItem>
                  <MenuItem value="roth">Roth 401(k)</MenuItem>
                  <MenuItem value="mixed">Mixed Strategy</MenuItem>
                </Select>
              </FormControl>

              {data.accountType === 'mixed' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Roth Percentage: {data.rothPercentage}%
                  </Typography>
                  <Slider
                    value={data.rothPercentage}
                    onChange={(_, value) => updateData('rothPercentage', value as number)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                    valueLabelFormat={(value) => `${value}%`}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">All Traditional</Typography>
                    <Typography variant="caption">All Roth</Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {data.accountType === 'traditional' ? 'Traditional 401(k) Benefits:' :
                   data.accountType === 'roth' ? 'Roth 401(k) Benefits:' :
                   'Mixed Strategy Benefits:'}
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                  {data.accountType === 'traditional' ? (
                    <>
                      <li>Immediate tax deduction</li>
                      <li>Lower current taxable income</li>
                      <li>Tax-deferred growth</li>
                      <li>Good if you expect lower tax rate in retirement</li>
                    </>
                  ) : data.accountType === 'roth' ? (
                    <>
                      <li>Tax-free withdrawals in retirement</li>
                      <li>No required minimum distributions</li>
                      <li>Tax-free growth</li>
                      <li>Good if you expect higher tax rate in retirement</li>
                    </>
                  ) : (
                    <>
                      <li>Tax diversification</li>
                      <li>Flexibility in retirement</li>
                      <li>Hedge against tax rate changes</li>
                      <li>Optimal for most situations</li>
                    </>
                  )}
                </ul>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Benefits Calculation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tax Impact Analysis</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Current Annual Tax Savings (Traditional):</strong>
                </Typography>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {formatCurrency(calculations.taxBenefits.traditionalSavings)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Assumes 22% current tax bracket
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Estimated Tax in Retirement (Traditional):</strong>
                </Typography>
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  {formatCurrency(calculations.taxBenefits.traditionalTaxOwed)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Assumes 18% retirement tax bracket
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Net Tax Advantage:</strong>
                </Typography>
                <Typography 
                  variant="h5" 
                  color={calculations.taxBenefits.netTaxAdvantage > 0 ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {formatCurrency(Math.abs(calculations.taxBenefits.netTaxAdvantage))}
                  {calculations.taxBenefits.netTaxAdvantage > 0 ? ' saved' : ' additional cost'}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Break-even Analysis:</strong> Traditional 401(k) is better if your retirement tax rate is below {breakEvenRate.toFixed(1)}%
                </Typography>
              </Alert>

              <Alert 
                severity={data.currentAge < 40 ? 'info' : 'warning'} 
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  <strong>Recommendation:</strong> {
                    data.currentAge < 40 
                      ? 'Consider Roth 401(k) for long-term tax-free growth'
                      : 'Traditional 401(k) may provide better immediate tax benefits'
                  }
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tax Strategy Comparison Chart */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tax Strategy Comparison: After-Tax Monthly Income
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxScenarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <RechartsTooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Monthly Income']}
                />
                <Bar 
                  dataKey="monthlyIncome" 
                  fill="#3b82f6"
                  name="After-Tax Monthly Income"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Comparison assumes 22% current tax rate and 18% retirement tax rate. 
            Results may vary based on actual tax rates and legislation changes.
          </Typography>
        </CardContent>
      </Card>

      {/* Detailed Tax Scenario Table */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Tax Strategy Analysis
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Strategy</TableCell>
                  <TableCell align="right">Current Tax Savings</TableCell>
                  <TableCell align="right">Retirement Tax Owed</TableCell>
                  <TableCell align="right">Net After-Tax Balance</TableCell>
                  <TableCell align="right">Monthly Income</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxScenarios.map((scenario, index) => (
                  <TableRow 
                    key={scenario.name}
                    sx={{ 
                      bgcolor: data.accountType === 'traditional' && index === 0 ? 'primary.50' :
                               data.accountType === 'roth' && index === 4 ? 'primary.50' :
                               data.accountType === 'mixed' && index === 2 ? 'primary.50' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <strong>{scenario.name}</strong>
                      {((data.accountType === 'traditional' && index === 0) ||
                        (data.accountType === 'roth' && index === 4) ||
                        (data.accountType === 'mixed' && index === 2)) && ' (current)'}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(scenario.currentTaxSavings)}</TableCell>
                    <TableCell align="right">{formatCurrency(scenario.retirementTaxOwed)}</TableCell>
                    <TableCell align="right">{formatCurrency(scenario.netAfterTax)}</TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(scenario.monthlyIncome)}</strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Tax Planning Tips */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>💡 Tax Planning Tips</Typography>
              
              <Typography variant="body2" gutterBottom><strong>Consider Traditional 401(k) if:</strong></Typography>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', marginBottom: '16px' }}>
                <li>You're in a high tax bracket now (22%+)</li>
                <li>You expect lower income in retirement</li>
                <li>You want immediate tax deductions</li>
                <li>You're over 50 and maximizing contributions</li>
              </ul>

              <Typography variant="body2" gutterBottom><strong>Consider Roth 401(k) if:</strong></Typography>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', marginBottom: '16px' }}>
                <li>You're young with decades until retirement</li>
                <li>You expect higher tax rates in the future</li>
                <li>You want tax-free growth and withdrawals</li>
                <li>You're in a lower tax bracket now</li>
              </ul>

              <Typography variant="body2" gutterBottom><strong>Mixed Strategy Benefits:</strong></Typography>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li>Tax diversification and flexibility</li>
                <li>Hedge against future tax rate changes</li>
                <li>Optimal withdrawal strategies in retirement</li>
                <li>Reduced overall tax risk</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📋 Your Tax Strategy Summary</Typography>
              
              <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Current Strategy:</strong> {
                    data.accountType === 'traditional' ? 'All Traditional 401(k)' :
                    data.accountType === 'roth' ? 'All Roth 401(k)' :
                    `Mixed (${100 - data.rothPercentage}% Traditional, ${data.rothPercentage}% Roth)`
                  }
                </Typography>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Annual Tax Impact:</strong> {
                    data.accountType === 'traditional' 
                      ? `Save ${formatCurrency(calculations.taxBenefits.traditionalSavings)} now`
                      : data.accountType === 'roth'
                      ? `Pay ${formatCurrency(calculations.taxBenefits.rothCost)} extra now for tax-free retirement`
                      : `Mixed tax impact based on allocation`
                  }
                </Typography>

                <Typography variant="body2">
                  <strong>Retirement Advantage:</strong> {
                    data.accountType === 'roth' 
                      ? 'No taxes on withdrawals'
                      : `Will owe approximately ${formatCurrency(calculations.taxBenefits.traditionalTaxOwed)} in retirement taxes`
                  }
                </Typography>
              </Box>

              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Key Insight:</strong> Your break-even retirement tax rate is {breakEvenRate.toFixed(1)}%. 
                  If you expect to be in a tax bracket lower than this in retirement, Traditional is better. 
                  If higher, Roth is better.
                </Typography>
              </Alert>

              <Typography variant="body2" gutterBottom><strong>Action Items:</strong></Typography>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li>Review your strategy annually as income changes</li>
                <li>Consider tax law changes and their impact</li>
                <li>Consult a tax professional for complex situations</li>
                <li>
                  {data.accountType === 'traditional' && data.currentAge < 35 
                    ? 'Consider adding some Roth contributions for diversification'
                    : data.accountType === 'roth' && calculations.contributionPercent > 15
                    ? 'You might benefit from some Traditional contributions for immediate tax savings'
                    : 'Your current strategy appears well-suited for your situation'
                  }
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Roth vs Traditional Comparison Chart */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Roth vs Traditional: Projected After-Tax Values Over Time
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <RechartsTooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'traditionalAfterTax' ? 'Traditional (After-Tax)' : 'Roth (Tax-Free)'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="traditionalBalance"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Traditional (After-Tax in Retirement)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rothBalance"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Roth (Tax-Free)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Traditional values shown after estimated 18% retirement tax. 
            Actual results depend on future tax rates and individual circumstances.
          </Typography>
        </CardContent>
      </Card>

      {/* Tax Law Considerations */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>⚖️ Important Tax Considerations</Typography>
        <Typography variant="body2">
          <strong>Disclaimer:</strong> This analysis is for educational purposes and uses simplified assumptions. 
          Tax laws are complex and subject to change. Consider these factors:
        </Typography>
        <ul style={{ margin: '8px 0 0 20px', fontSize: '14px' }}>
          <li>Future changes to tax rates and laws</li>
          <li>State income taxes (not included in this analysis)</li>
          <li>Required minimum distributions (RMDs) for Traditional accounts</li>
          <li>Social Security taxation at different income levels</li>
          <li>Other retirement income sources and their tax treatment</li>
        </ul>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Recommendation:</strong> Consult with a qualified tax professional or financial advisor 
          for personalized advice based on your complete financial situation.
        </Typography>
      </Alert>
    </Box>
  );
};

export default TaxStrategyTab;