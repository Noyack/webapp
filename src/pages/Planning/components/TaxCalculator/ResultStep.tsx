/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Calculate as CalculateIcon
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
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UserState, TaxResults } from '../../../../types';

interface ResultsStepProps {
  userData: UserState;
  results: TaxResults | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  userData, 
  results, 
  isCalculating, 
  onCalculate 
}) => {
  
  return (
    <Box className="p-4">
      {isCalculating ? (
        <Box className="flex flex-col items-center justify-center py-12">
          <CircularProgress />
          <Typography variant="h6" className="mt-4">Calculating your tax optimization results...</Typography>
        </Box>
      ) : results ? (
        <>
          <Typography variant="h5" className="mb-6 text-center">
            Tax & Savings Analysis Results
          </Typography>
          
          <Grid container spacing={4}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography variant="h6" className="mb-3 flex items-center">
                    <AccountBalanceIcon className="mr-2" />
                    Tax Summary
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Total Income:</span>
                    <span className="font-medium">${results.totalIncome.toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Adjusted Gross Income:</span>
                    <span className="font-medium">${results.adjustedGrossIncome.toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Taxable Income:</span>
                    <span className="font-medium">${results.taxableIncome.toLocaleString()}</span>
                  </Typography>
                  
                  <Divider className="my-2" />
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Federal Tax:</span>
                    <span className="font-medium">${Math.round(results.federalTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>State Tax ({userData.state}):</span>
                    <span className="font-medium">${Math.round(results.stateTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>FICA Tax:</span>
                    <span className="font-medium">${Math.round(results.ficaTax).toLocaleString()}</span>
                  </Typography>
                  
                  {results.selfEmploymentTax > 0 && (
                    <Typography variant="body2" className="flex justify-between my-1">
                      <span>Self-Employment Tax:</span>
                      <span className="font-medium">${Math.round(results.selfEmploymentTax).toLocaleString()}</span>
                    </Typography>
                  )}
                  
                  <Divider className="my-2" />
                  
                  <Typography variant="subtitle1" className="flex justify-between mt-2 font-medium">
                    <span>Total Tax:</span>
                    <span className="text-red-600">${Math.round(results.totalTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between mt-1">
                    <span>Effective Tax Rate:</span>
                    <span className="font-medium">{results.effectiveTaxRate.toFixed(1)}%</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between mt-1">
                    <span>After-Tax Income:</span>
                    <span className="font-medium">${Math.round(results.afterTaxIncome).toLocaleString()}</span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography variant="h6" className="mb-3 flex items-center">
                    <SavingsIcon className="mr-2" />
                    Savings Analysis
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Total Annual Savings:</span>
                    <span className="font-medium">${results.totalSavings.toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Savings Rate:</span>
                    <span className="font-medium">{results.savingsRate.toFixed(1)}%</span>
                  </Typography>
                  
                  <Divider className="my-2" />
                  
                  <Typography variant="subtitle2" className="mt-2">Unused Tax-Advantaged Space</Typography>
                  
                  {Object.entries(results.unusedTaxSpace).map(([key, value]) => (
                    value > 0 && (
                      <Typography key={key} variant="body2" className="flex justify-between my-1">
                        <span>{key === '401k' ? '401(k)' : key.replace('-', ' ').toUpperCase()}:</span>
                        <span className="font-medium">${value.toLocaleString()}</span>
                      </Typography>
                    )
                  ))}
                  
                  <Box className="mt-3 p-2 bg-blue-50 rounded">
                    <Typography variant="body2">
                      By maximizing your tax-advantaged contributions, you could save approximately an additional ${Math.round(results.unusedTaxSpace['401k'] * 0.22).toLocaleString()} in taxes this year.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography variant="h6" className="mb-3 flex items-center">
                    <AssignmentTurnedInIcon className="mr-2" />
                    Optimization Tips
                  </Typography>
                  
                  {results.optimizationTips.length > 0 ? (
                    <ul className="pl-5 list-disc">
                      {results.optimizationTips.map((tip, index) => (
                        <li key={index} className="my-2">
                          <Typography variant="body2">{tip}</Typography>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body2">
                      Your tax strategy looks well optimized! Continue your current approach.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">Tax Breakdown</Typography>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Federal Tax', value: Math.round(results.federalTax) },
                            { name: 'State Tax', value: Math.round(results.stateTax) },
                            { name: 'FICA Tax', value: Math.round(results.ficaTax) },
                            ...(results.selfEmploymentTax > 0 ? [{ name: 'Self-Employment Tax', value: Math.round(results.selfEmploymentTax) }] : []),
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                          <Cell fill="#FFBB28" />
                          <Cell fill="#FF8042" />
                        </Pie>
                        <RechartsTooltip formatter={(value: any) => `${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">Federal Tax Brackets</Typography>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.taxByBracket}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bracket" />
                        <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                        <RechartsTooltip formatter={(value: any) => `${value.toLocaleString()}`} />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">30-Year Projection: Current vs. Optimized Strategy</Typography>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.projectedSavings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <RechartsTooltip formatter={(value: any) => `${value.toLocaleString()}`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="currentStrategy"
                          name="Current Strategy"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="optimizedStrategy"
                          name="Optimized Strategy"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Box className="mt-4 p-3 bg-gray-50 rounded">
                    <Typography variant="body2">
                      By optimizing your tax strategy, you could accumulate approximately $
                      {results.projectedSavings.length > 0 && (
                        (
                          results.projectedSavings[results.projectedSavings.length - 1].optimizedStrategy -
                          results.projectedSavings[results.projectedSavings.length - 1].currentStrategy
                        ).toLocaleString()
                      )}
                      {' '}more over 30 years.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <Box className="flex flex-col items-center justify-center py-12">
          <Typography variant="h6" className="mb-4">Ready to see your tax optimization results?</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalculateIcon />}
            onClick={onCalculate}
            size="large"
          >
            Calculate Results
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResultsStep;