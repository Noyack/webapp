/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

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
import ExportButtons from '../../../../components/ExportButtons';
import { GenericExportData } from '../../../../utils/exportUtils';

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
  
  // Prepare export data - FIXED VERSION
  const prepareExportData = (): GenericExportData => {
    if (!results) return { calculatorName: 'Tax Optimization Calculator', inputs: {}, keyMetrics: [], recommendations: [] };
    
    // Helper function to get income by type
    const getIncomeByType = (type: string): number => {
      return userData.incomeSources
        .filter(source => source.type === type)
        .reduce((sum, source) => sum + source.amount, 0);
    };

    // Calculate total income
    const totalIncome = userData.incomeSources.reduce((sum, source) => sum + source.amount, 0);

    return {
      calculatorName: 'Tax Optimization Calculator',
      inputs: {
        totalIncome,
        w2Income: getIncomeByType('primary') + getIncomeByType('secondary'),
        selfEmploymentIncome: getIncomeByType('self-employment'),
        businessIncome: getIncomeByType('business'),
        capitalGains: getIncomeByType('capital-gains'),
        dividends: getIncomeByType('dividends'),
        rentalIncome: getIncomeByType('rental'),
        interestIncome: getIncomeByType('interest'),
        cryptoIncome: getIncomeByType('crypto'),
        otherIncome: getIncomeByType('other'),
        filingStatus: userData.filingStatus,
        state: userData.state,
        dependents: userData.dependents,
        useItemizedDeductions: userData.useItemizedDeductions,
        totalDeductions: userData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0),
        // Tax-advantaged accounts
        traditional401k: userData.taxAdvantaged['401k']?.contribution || 0,
        traditionalIRA: userData.taxAdvantaged['ira-traditional']?.contribution || 0,
        rothIRA: userData.taxAdvantaged['ira-roth']?.contribution || 0,
        hsa: userData.taxAdvantaged['hsa']?.contribution || 0,
        plan529: userData.taxAdvantaged['529']?.contribution || 0,
        // Investment values
        stocksValue: userData.stocksValue || 0,
        cryptoValue: userData.cryptoValue || 0,
        realEstateValue: userData.realEstateValue || 0,
        // Other financial info
        monthlyExpenses: userData.monthlyExpenses || 0,
        emergencyFund: userData.emergencyFund || 0,
        hasInvestments: userData.hasInvestments || false
      },
      keyMetrics: [
        { label: 'Total Income', value: `$${results.totalIncome.toLocaleString()}` },
        { label: 'Adjusted Gross Income', value: `$${results.adjustedGrossIncome.toLocaleString()}` },
        { label: 'Taxable Income', value: `$${results.taxableIncome.toLocaleString()}` },
        { label: 'Federal Tax', value: `$${Math.round(results.federalTax).toLocaleString()}` },
        { label: 'State Tax', value: `$${Math.round(results.stateTax).toLocaleString()}` },
        { label: 'FICA Tax', value: `$${Math.round(results.ficaTax).toLocaleString()}` },
        { label: 'Total Tax', value: `$${Math.round(results.totalTax).toLocaleString()}` },
        { label: 'Effective Tax Rate', value: `${results.effectiveTaxRate.toFixed(1)}%` },
        { label: 'After-Tax Income', value: `$${Math.round(results.afterTaxIncome).toLocaleString()}` },
        { label: 'Total Savings', value: `$${results.totalSavings.toLocaleString()}` },
        { label: 'Savings Rate', value: `${results.savingsRate.toFixed(1)}%` }
      ],
      summary: {
        totalIncome: results.totalIncome,
        adjustedGrossIncome: results.adjustedGrossIncome,
        taxableIncome: results.taxableIncome,
        totalTax: results.totalTax,
        effectiveTaxRate: results.effectiveTaxRate,
        afterTaxIncome: results.afterTaxIncome,
        totalSavings: results.totalSavings,
        savingsRate: results.savingsRate,
        unusedTaxSpace: results.unusedTaxSpace
      },
      tableData: [
        { category: 'Federal Tax', amount: Math.round(results.federalTax) },
        { category: 'State Tax', amount: Math.round(results.stateTax) },
        { category: 'FICA Tax', amount: Math.round(results.ficaTax) },
        ...(results.selfEmploymentTax > 0 ? [{ category: 'Self-Employment Tax', amount: Math.round(results.selfEmploymentTax) }] : [])
      ],
      recommendations: results.optimizationTips.length > 0 ? results.optimizationTips : [
        'Your tax strategy looks well optimized! Continue your current approach.',
        'Consider maximizing tax-advantaged account contributions',
        'Review your tax strategy annually as laws and circumstances change',
        'Consult with a tax professional for personalized advice'
      ]
    };
  };
  
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
                    <span>State Tax:</span>
                    <span className="font-medium">${Math.round(results.stateTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>FICA Tax:</span>
                    <span className="font-medium">${Math.round(results.ficaTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
                    <span>Total Tax:</span>
                    <span className="font-medium">${Math.round(results.totalTax).toLocaleString()}</span>
                  </Typography>
                  
                  <Typography variant="body2" className="flex justify-between my-1">
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
                            ...(results.selfEmploymentTax > 0 ? [{ name: 'Self-Employment Tax', value: Math.round(results.selfEmploymentTax) }] : [])
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Federal Tax', value: Math.round(results.federalTax) },
                            { name: 'State Tax', value: Math.round(results.stateTax) },
                            { name: 'FICA Tax', value: Math.round(results.ficaTax) },
                            ...(results.selfEmploymentTax > 0 ? [{ name: 'Self-Employment Tax', value: Math.round(results.selfEmploymentTax) }] : [])
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">30-Year Projection: Current vs Optimized Strategy</Typography>
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

          {/* Export Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Export Your Tax Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
              Download your tax calculations, optimization strategies, and personalized recommendations
            </Typography>
            <ExportButtons data={prepareExportData()} />
          </Box>
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