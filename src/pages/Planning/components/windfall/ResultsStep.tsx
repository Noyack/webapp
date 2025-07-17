import React from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { StepProps } from '../../../../types';
import { DEBT_TYPES } from '../../../../constants/constant';
import { formatCurrency, getCategoryColor } from '../../../../utils/windfall';

const ResultsStep: React.FC<StepProps> = ({
  optimizationResults,
  taxImplications,
  windfall
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h4" className="mb-4 text-center">
            Optimal Allocation Strategy
          </Typography>
          
          <Box className="flex flex-col items-center justify-center mb-6 p-4 bg-[#F5F7FA] rounded-lg">
            <Typography variant="h5" className="mb-2 text-[#2E7D32] font-bold">
              {formatCurrency(windfall.amount)}
            </Typography>
            <Typography variant="subtitle1" className="text-center">
              Optimized based on your financial situation, goals, and preferences
            </Typography>
          </Box>
          
          <Box height={300} className="mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={optimizationResults.recommendations.map(rec => ({
                    name: rec.category,
                    value: rec.amount
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={70}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {optimizationResults.recommendations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Typography variant="h6" className="mb-3">Detailed Recommendations</Typography>
          
          {optimizationResults.recommendations.map((recommendation, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box className="flex justify-between items-center w-full pr-4">
                  <Typography
                    variant="subtitle1"
                    style={{color: getCategoryColor(recommendation.category)}}
                  >
                    {recommendation.category}
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(recommendation.amount)}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Action:</strong> {recommendation.action}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Rationale:</strong> {recommendation.rationale}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Recommended Vehicle:</strong> {recommendation.vehicle}
                  </Typography>
                  
                  {recommendation.allocation && (
                    <Box className="mt-2">
                      <Typography variant="body2" gutterBottom>
                        <strong>Asset Allocation:</strong>
                      </Typography>
                      <Box height={120} width={200}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Stocks', value: recommendation.allocation.stocks },
                                { name: 'Bonds', value: recommendation.allocation.bonds },
                                { name: 'Cash', value: recommendation.allocation.cash },
                                { name: 'Alternatives', value: recommendation.allocation.alternatives || 0 }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={50}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell key="stocks" fill="#0088FE" />
                              <Cell key="bonds" fill="#00C49F" />
                              <Cell key="cash" fill="#FFBB28" />
                              <Cell key="alternatives" fill="#FF8042" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Growth Projections</Typography>
          
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={optimizationResults.projections}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="conservativeValue" 
                  name="Conservative" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.1} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Expected" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="aggressiveValue" 
                  name="Aggressive" 
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>Projected Growth Potential</Typography>
            <Box className="grid grid-cols-3 gap-4">
              <Box className="p-2 text-center border rounded">
                <Typography variant="body2" color="textSecondary">10 Years</Typography>
                <Typography variant="h6">
                  {formatCurrency(optimizationResults.projections[2]?.value || 0)}
                </Typography>
              </Box>
              <Box className="p-2 text-center border rounded">
                <Typography variant="body2" color="textSecondary">20 Years</Typography>
                <Typography variant="h6">
                  {formatCurrency(optimizationResults.projections[4]?.value || 0)}
                </Typography>
              </Box>
              <Box className="p-2 text-center border rounded">
                <Typography variant="body2" color="textSecondary">30 Years</Typography>
                <Typography variant="h6">
                  {formatCurrency(optimizationResults.projections[6]?.value || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Tax Considerations</Typography>
          
          {windfall.taxable && (
            <Alert severity="warning" className="mb-4">
              Your {windfall.source} may be subject to taxes. Estimated tax impact: {formatCurrency(taxImplications.estimatedTaxImpact)}
            </Alert>
          )}
          
          <Typography variant="subtitle1" gutterBottom>Tax Optimization Strategies</Typography>
          
          {taxImplications.taxSavingStrategies.map((strategy, index) => (
            <Box key={index} className="mb-3 p-3 border rounded">
              <Typography variant="subtitle2">{strategy.strategy}</Typography>
              <Typography variant="body2">{strategy.description}</Typography>
              {typeof strategy.potentialSavings === 'number' && (
                <Typography variant="body2" className="mt-1">
                  Potential tax savings: {formatCurrency(strategy.potentialSavings)}
                </Typography>
              )}
            </Box>
          ))}
          
          <Box className="mt-4">
            <Alert severity="info">
              Tax laws are complex and subject to change. Consider consulting with a tax professional for personalized advice.
            </Alert>
          </Box>
        </Paper>
        
        {Object.keys(optimizationResults.debtPayoffPlan).length > 0 && (
          <Paper elevation={2} className="p-4 mt-4">
            <Typography variant="h6" className="mb-4">Debt Payoff Impact</Typography>
            
            {Object.entries(optimizationResults.debtPayoffPlan).map(([debtType, plan], index) => (
              <Box key={index} className="mb-3 p-3 border rounded">
                <Typography variant="subtitle2">
                  {DEBT_TYPES.find(d => d.id === debtType)?.name || debtType}
                </Typography>
                <Box className="grid grid-cols-2 gap-2 mt-2">
                  <Typography variant="body2">Original balance: {formatCurrency(plan.originalBalance)}</Typography>
                  <Typography variant="body2">Amount paid: {formatCurrency(plan.amountPaid)}</Typography>
                  <Typography variant="body2">Remaining: {formatCurrency(plan.remainingBalance)}</Typography>
                  <Typography variant="body2" className="text-green-600">
                    Interest saved: {formatCurrency(plan.interestSaved)}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            <Box className="mt-3 p-3 bg-green-50 rounded">
              <Typography variant="subtitle1">Total Interest Saved</Typography>
              <Typography variant="h6" className="text-green-600">
                {formatCurrency(
                  Object.values(optimizationResults.debtPayoffPlan)
                    .reduce((sum, plan) => sum + plan.interestSaved, 0)
                )}
              </Typography>
            </Box>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default ResultsStep;