/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import {
  Typography,
  Grid,
  Box,
  Paper,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccountBalance as BankIcon,
  Home as HomeIcon,
  MonetizationOn as MoneyIcon,
  LocationOn as LocationIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { RentVsBuyInputs, ResultData, SummaryData } from '../../../../types/rentVsBuy';
import { formatCurrency, calculateTaxBenefits, calculatePMI, formatPercent, getCostOfLivingAdjustment } from '../../../../utils/rentVsBuyCalculations';
import { usStates } from '../../../../utils/locationData';
import { exportToPDF, exportToCSV, ExportData } from '../../../../utils/exportUtils';

interface ResultsTabProps {
  inputs: RentVsBuyInputs;
  results: ResultData[];
  summary: SummaryData;
  breakEvenYear: number | null;
}

const ResultsTab: FC<ResultsTabProps> = ({ inputs, results, summary, breakEvenYear }) => {
  if (results.length === 0) {
    return (
      <Box className="text-center py-12">
        <Typography variant="h6" className="mb-4">No results to display</Typography>
        <Typography variant="body1" className="text-gray-600">
          Please complete the input sections and click "Calculate Results" to see your analysis.
        </Typography>
      </Box>
    );
  }

  // Export handlers
  const handleExportPDF = () => {
    const exportData: ExportData = {
      inputs,
      results,
      summary,
      breakEvenYear
    };
    exportToPDF(exportData);
  };

  const handleExportCSV = () => {
    const exportData: ExportData = {
      inputs,
      results,
      summary,
      breakEvenYear
    };
    exportToCSV(exportData);
  };

  // Calculate enhanced financial details
  const taxBenefits = calculateTaxBenefits(
    inputs.homePrice,
    inputs.downPaymentPercent,
    inputs.interestRate,
    inputs.location.propertyTaxRate || 1.1,
    inputs.annualIncome,
    inputs.maritalStatus
  );

  const pmiInfo = calculatePMI(inputs.homePrice, inputs.downPaymentPercent);
  const isBuyingBetter = summary.netBuyingCost < summary.totalRentingCost;
  const netAdvantage = Math.abs(summary.netBuyingCost - summary.totalRentingCost);

  // Prepare data for charts
  const chartData = results.map(result => ({
    year: result.year,
    'Total Buying Cost': result.buyingCost,
    'Total Renting Cost': result.rentingCost,
    'Buying Net Cost': result.buyingNetCost,
    'Home Equity': result.buyingEquity
  }));

  // Prepare cost breakdown data
  const annualCosts = {
    mortgage: (inputs.homePrice - (inputs.homePrice * inputs.downPaymentPercent / 100)) * (inputs.interestRate / 100),
    propertyTax: inputs.homePrice * ((inputs.location.propertyTaxRate || 1.1) / 100),
    insurance: inputs.homePrice * (inputs.homeInsuranceRate / 100),
    pmi: pmiInfo.annualPMI,
    hoa: inputs.monthlyHOAFees * 12,
    maintenance: inputs.homePrice * (inputs.annualMaintenancePercent / 100),
    taxSavings: taxBenefits.annualTaxSavings
  };

  const costBreakdownData = [
    { name: 'Mortgage Interest', value: annualCosts.mortgage, color: '#1f77b4' },
    { name: 'Property Tax', value: annualCosts.propertyTax, color: '#ff7f0e' },
    { name: 'Home Insurance', value: annualCosts.insurance, color: '#2ca02c' },
    { name: 'PMI', value: annualCosts.pmi, color: '#d62728' },
    { name: 'HOA Fees', value: annualCosts.hoa, color: '#9467bd' },
    { name: 'Maintenance', value: annualCosts.maintenance, color: '#8c564b' },
  ].filter(item => item.value > 0);

  // Custom tooltip for better formatting
  const renderTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <Box className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <Typography variant="subtitle2" className="mb-1 font-semibold">
            {label ? `Year ${label}` : ''}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              style={{ color: entry.color }}
              className="font-medium"
            >
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Export Buttons */}
      <Paper elevation={1} className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h6" className="text-blue-700 mb-1">
              📊 Export Your Analysis
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Download your complete rent vs. buy analysis for future reference
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleExportPDF}
              sx={{
                bgcolor: '#dc2626',
                '&:hover': { bgcolor: '#b91c1c' },
                textTransform: 'none'
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<CsvIcon />}
              onClick={handleExportCSV}
              sx={{
                borderColor: '#059669',
                color: '#059669',
                '&:hover': { borderColor: '#047857', bgcolor: '#f0fdf4' },
                textTransform: 'none'
              }}
            >
              Download CSV
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={4}>
          <Card className={`border-l-4 ${isBuyingBetter ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className={isBuyingBetter ? 'text-green-700' : 'text-red-700'}>
                    {isBuyingBetter ? 'Buying Wins' : 'Renting Wins'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Net advantage: {formatCurrency(netAdvantage)}
                  </Typography>
                </Box>
                {isBuyingBetter ? 
                  <CheckCircleIcon className="text-green-500" fontSize="large" /> :
                  <WarningIcon className="text-red-500" fontSize="large" />
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="border-l-4 border-blue-500 bg-blue-50">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-blue-700">
                    Break-Even
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {breakEvenYear ? `Year ${breakEvenYear}` : 'Beyond time horizon'}
                  </Typography>
                </Box>
                <TrendingUpIcon className="text-blue-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="border-l-4 border-purple-500 bg-purple-50">
            <CardContent>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h6" className="text-purple-700">
                    Annual Tax Savings
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {formatCurrency(taxBenefits.annualTaxSavings)}
                  </Typography>
                </Box>
                <MoneyIcon className="text-purple-500" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Location Impact Analysis */}
      {inputs.location.state && (
        <Paper elevation={2} className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50">
          <Box className="flex items-center mb-3">
            <LocationIcon className="mr-2 text-green-600" />
            <Typography variant="h6" className="text-green-700">
              📍 Location Impact Analysis
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="space-y-2">
                <Typography variant="subtitle2" className="text-green-700 mb-2">
                  Your Location: {usStates.find(s => s.code === inputs.location.state)?.name}
                </Typography>
                
                <Box className="flex justify-between">
                  <Typography variant="body2">Cost of Living Index:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {(getCostOfLivingAdjustment(inputs.location.state) * 100).toFixed(1)}% 
                    <span className="text-gray-500 text-sm ml-1">(100% = national avg)</span>
                  </Typography>
                </Box>
                
                <Box className="flex justify-between">
                  <Typography variant="body2">Property Tax Rate:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatPercent(inputs.location.propertyTaxRate || 1.1)} 
                    <span className="text-gray-500 text-sm ml-1">vs 1.1% avg</span>
                  </Typography>
                </Box>
                
                <Box className="flex justify-between">
                  <Typography variant="body2">Home Insurance Rate:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatPercent(inputs.homeInsuranceRate)} 
                    <span className="text-gray-500 text-sm ml-1">vs 0.5% avg</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className="space-y-2">
                <Typography variant="subtitle2" className="text-green-700 mb-2">
                  Annual Cost Impact (vs National Average)
                </Typography>
                
                {(() => {
                  const nationalPropertyTax = inputs.homePrice * 0.011; // 1.1%
                  const yourPropertyTax = inputs.homePrice * ((inputs.location.propertyTaxRate || 1.1) / 100);
                  const propertyTaxDiff = yourPropertyTax - nationalPropertyTax;
                  
                  const nationalInsurance = inputs.homePrice * 0.005; // 0.5%
                  const yourInsurance = inputs.homePrice * (inputs.homeInsuranceRate / 100);
                  const insuranceDiff = yourInsurance - nationalInsurance;
                  
                  const costOfLivingMultiplier = getCostOfLivingAdjustment(inputs.location.state);
                  const nationalMaintenance = inputs.homePrice * (inputs.annualMaintenancePercent / 100);
                  const yourMaintenance = nationalMaintenance * costOfLivingMultiplier;
                  const maintenanceDiff = yourMaintenance - nationalMaintenance;
                  
                  const totalDiff = propertyTaxDiff + insuranceDiff + maintenanceDiff;
                  
                  return (
                    <>
                      <Box className="flex justify-between">
                        <Typography variant="body2">Property Tax:</Typography>
                        <Typography variant="body2" className={`font-semibold ${propertyTaxDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {propertyTaxDiff > 0 ? '+' : ''}{formatCurrency(propertyTaxDiff)}
                        </Typography>
                      </Box>
                      
                      <Box className="flex justify-between">
                        <Typography variant="body2">Home Insurance:</Typography>
                        <Typography variant="body2" className={`font-semibold ${insuranceDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {insuranceDiff > 0 ? '+' : ''}{formatCurrency(insuranceDiff)}
                        </Typography>
                      </Box>
                      
                      <Box className="flex justify-between">
                        <Typography variant="body2">Maintenance & Other:</Typography>
                        <Typography variant="body2" className={`font-semibold ${maintenanceDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {maintenanceDiff > 0 ? '+' : ''}{formatCurrency(maintenanceDiff)}
                        </Typography>
                      </Box>
                      
                      <hr className="border-green-200" />
                      
                      <Box className="flex justify-between">
                        <Typography variant="subtitle2" className="text-green-700">Total Annual Impact:</Typography>
                        <Typography variant="subtitle2" className={`font-bold ${totalDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {totalDiff > 0 ? '+' : ''}{formatCurrency(totalDiff)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" className="text-gray-600 text-sm mt-2">
                        {totalDiff > 0 
                          ? `Your location costs $${Math.abs(totalDiff).toFixed(0)} more per year than the national average.`
                          : totalDiff < 0 
                            ? `Your location saves $${Math.abs(totalDiff).toFixed(0)} per year vs the national average.`
                            : `Your location costs are close to the national average.`
                        }
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tax Benefits Detail */}
      {taxBenefits.annualTaxSavings > 0 && (
        <Paper elevation={2} className="p-4 mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
          <Typography variant="h6" className="mb-3 text-purple-700">
            🎯 Tax Benefits Breakdown
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="body2">Mortgage Interest Deduction:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(annualCosts.mortgage * taxBenefits.marginalTaxRate)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Property Tax Deduction:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(Math.min(annualCosts.propertyTax, 10000) * taxBenefits.marginalTaxRate)}
                  </Typography>
                </Box>
                <hr className="border-purple-200" />
                <Box className="flex justify-between">
                  <Typography variant="subtitle2" className="text-purple-700">Total Annual Tax Savings:</Typography>
                  <Typography variant="subtitle2" className="font-bold text-purple-700">
                    {formatCurrency(taxBenefits.annualTaxSavings)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="space-y-1">
                <Typography variant="body2">
                  <strong>Marginal Tax Rate:</strong> {formatPercent(taxBenefits.marginalTaxRate * 100)}
                </Typography>
                <Typography variant="body2">
                  <strong>Itemized Deductions:</strong> {formatCurrency(taxBenefits.itemizedDeductions)}
                </Typography>
                <Typography variant="body2">
                  <strong>Standard Deduction:</strong> {formatCurrency(taxBenefits.standardDeduction)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 text-sm mt-2">
                  Tax savings occur only when itemized deductions exceed the standard deduction.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* PMI Information */}
      {pmiInfo.pmiRequired && (
        <Paper elevation={2} className="p-4 mb-6 bg-yellow-50 border border-yellow-200">
          <Typography variant="h6" className="mb-3 text-yellow-700">
            ⚠️ Private Mortgage Insurance (PMI)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className="space-y-2">
                <Typography variant="body2">
                  <strong>Monthly PMI:</strong> {formatCurrency(pmiInfo.monthlyPMI)}
                </Typography>
                <Typography variant="body2">
                  <strong>Annual PMI:</strong> {formatCurrency(pmiInfo.annualPMI)}
                </Typography>
                <Typography variant="body2">
                  <strong>PMI over loan life:</strong> {formatCurrency(pmiInfo.annualPMI * 8)} (est.)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="text-gray-600">
                PMI will be removed when your loan balance reaches 78% of the original home value, 
                typically after 8-12 years with a 10% down payment.
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                className="mt-2"
                onClick={() => {/* Could link to PMI calculator */}}
              >
                Learn More About PMI
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Charts */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
              Cost Comparison Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={renderTooltip} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Total Renting Cost" 
                  stroke="#1f77b4"
                  strokeWidth={4}
                  dot={{ fill: '#1f77b4', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#1f77b4', strokeWidth: 2, fill: '#fff' }}
                  name="💰 Total Renting Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="Buying Net Cost" 
                  stroke="#ff7f0e"
                  strokeWidth={4}
                  dot={{ fill: '#ff7f0e', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#ff7f0e', strokeWidth: 2, fill: '#fff' }}
                  name="🏠 Buying Net Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="Home Equity" 
                  stroke="#2ca02c"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ fill: '#2ca02c', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2ca02c', strokeWidth: 2, fill: '#fff' }}
                  name="📈 Home Equity Built"
                />
              </LineChart>
            </ResponsiveContainer>
            <Box className="mt-3 p-3 bg-blue-50 rounded">
              <Typography variant="body2" className="text-blue-700 text-center">
                📊 <strong>Chart Guide:</strong> Solid lines show costs, dashed line shows equity growth. 
                Lower is better for costs, higher is better for equity.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
              Annual Homeownership Costs
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    percent > 5 ? `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={80}
                  wrapperStyle={{ 
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
            <Box className="mt-3 p-3 bg-green-50 rounded">
              <Typography variant="body2" className="text-green-700 text-center">
                💡 <strong>Total Annual:</strong> {formatCurrency(costBreakdownData.reduce((sum, item) => sum + item.value, 0))}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Final Summary */}
      <Paper elevation={2} className="p-4">
        <Typography variant="h6" className="mb-4">Financial Summary After {inputs.timeHorizon} Years</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="space-y-3">
              <Box className="flex items-center">
                <HomeIcon className="mr-2 text-blue-500" />
                <Typography variant="h6">Buying Scenario</Typography>
              </Box>
              <Box className="space-y-2 pl-8">
                <Box className="flex justify-between">
                  <Typography variant="body2">Total costs paid:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(summary.totalBuyingCost)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Home equity built:</Typography>
                  <Typography variant="body2" className="font-semibold text-green-600">
                    {formatCurrency(summary.finalEquity)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Tax savings (total):</Typography>
                  <Typography variant="body2" className="font-semibold text-purple-600">
                    {formatCurrency(taxBenefits.annualTaxSavings * inputs.timeHorizon)}
                  </Typography>
                </Box>
                <hr />
                <Box className="flex justify-between">
                  <Typography variant="subtitle2">Net cost (after selling):</Typography>
                  <Typography variant="subtitle2" className="font-bold">
                    {formatCurrency(summary.netBuyingCost)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="space-y-3">
              <Box className="flex items-center">
                <BankIcon className="mr-2 text-green-500" />
                <Typography variant="h6">Renting Scenario</Typography>
              </Box>
              <Box className="space-y-2 pl-8">
                <Box className="flex justify-between">
                  <Typography variant="body2">Total rent paid:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(summary.totalRentingCost)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Investment account value:</Typography>
                  <Typography variant="body2" className="font-semibold text-green-600">
                    {formatCurrency(summary.savingsAfterTimePeriod)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Net worth:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(summary.savingsAfterTimePeriod)}
                  </Typography>
                </Box>
                <hr />
                <Box className="flex justify-between">
                  <Typography variant="subtitle2">Total net cost:</Typography>
                  <Typography variant="subtitle2" className="font-bold">
                    {formatCurrency(summary.totalRentingCost - summary.savingsAfterTimePeriod)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Recommendation */}
        <Box className={`mt-6 p-4 rounded-lg ${isBuyingBetter ? 'bg-green-100 border border-green-300' : 'bg-blue-100 border border-blue-300'}`}>
          <Typography variant="h6" className={`mb-2 ${isBuyingBetter ? 'text-green-700' : 'text-blue-700'}`}>
            💡 Recommendation
          </Typography>
          <Typography variant="body1" className="mb-2">
            {isBuyingBetter 
              ? `Based on your inputs, buying appears to be the better financial choice, saving you approximately ${formatCurrency(netAdvantage)} over ${inputs.timeHorizon} years.`
              : `Based on your inputs, renting appears to be the better financial choice, saving you approximately ${formatCurrency(netAdvantage)} over ${inputs.timeHorizon} years.`
            }
          </Typography>
          <Typography variant="body2" className="text-gray-700">
            Consider non-financial factors like lifestyle preferences, job stability, and personal satisfaction with homeownership.
            {breakEvenYear && ` If you plan to stay longer than ${breakEvenYear} years, buying becomes more attractive.`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsTab; 