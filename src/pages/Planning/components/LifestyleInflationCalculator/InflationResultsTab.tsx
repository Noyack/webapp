import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  MonetizationOn as MoneyIcon
} from '@mui/icons-material';
import { LifestyleInflationInputs } from '../../../../types/lifestyleInflation';
import { 
  calculateLifestyleInflationProjections,
  generateCategoryComparisons,
  formatCurrency,
  formatPercentage,
  calculateAverageInflationRate,
  getInflationSeverity
} from '../../../../utils/lifestyleInflationCalculations';

interface InflationResultsTabProps {
  inputs: LifestyleInflationInputs;
  onInputChange: <K extends keyof LifestyleInflationInputs>(field: K, value: LifestyleInflationInputs[K]) => void;
}

export default function InflationResultsTab({ inputs }: InflationResultsTabProps) {
  const [activeResultsTab, setActiveResultsTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('summary');

  // Calculate results
  const results = calculateLifestyleInflationProjections(inputs);
  const categoryComparisons = generateCategoryComparisons(
    inputs.spendingCategories,
    inputs.expectedRaises.yearsToProject,
    inputs.expectedRaises.frequency
  );
  const averageInflationRate = calculateAverageInflationRate(inputs.spendingCategories);
  const inflationSeverity = getInflationSeverity(averageInflationRate);

  // Helper functions for display
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'success';
      case 'MODERATE': return 'warning';
      case 'HIGH': return 'error';
      case 'EXTREME': return 'error';
      default: return 'default';
    }
  };

  const formatYears = (years: number) => {
    if (!isFinite(years)) return 'Never';
    return `${years.toFixed(1)} years`;
  };

  // Handle accordion changes
  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" textAlign="center">
        Lifestyle Inflation Impact Results
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Comprehensive analysis of how lifestyle inflation affects your wealth building over {inputs.expectedRaises.yearsToProject} years.
      </Typography>

      {/* Executive Summary */}
      <Accordion 
        expanded={expandedAccordion === 'summary'} 
        onChange={handleAccordionChange('summary')}
        sx={{ mb: 3 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            Executive Summary
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.main' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingDownIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {formatCurrency(results.summary.totalWealthLoss)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Wealth Loss
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.main' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WarningIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {formatPercentage(results.summary.finalSavingsRate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Final Savings Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ bgcolor: `${getSeverityColor(inflationSeverity)}.50` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon color={getSeverityColor(inflationSeverity) as any} sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {formatPercentage(averageInflationRate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Inflation Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.main' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TimelineIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    +{formatYears(results.summary.yearsToFinancialGoal.difference)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Goal Delay
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Summary Analysis */}
            <Grid item xs={12}>
              <Alert 
                severity={inflationSeverity === 'LOW' ? 'success' : inflationSeverity === 'MODERATE' ? 'warning' : 'error'}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {inflationSeverity === 'LOW' ? '✅ Good Control' : 
                   inflationSeverity === 'MODERATE' ? '⚠️ Moderate Risk' : '🚨 High Risk'} 
                  - Lifestyle Inflation Assessment
                </Typography>
                <Typography variant="body2">
                  Your average lifestyle inflation rate of {formatPercentage(averageInflationRate)} puts you in the{' '}
                  <strong>{inflationSeverity.toLowerCase()}</strong> risk category. Over {inputs.expectedRaises.yearsToProject} years, 
                  this could cost you {formatCurrency(results.summary.totalWealthLoss)} in lost wealth and delay your 
                  financial goals by {formatYears(results.summary.yearsToFinancialGoal.difference)}.
                </Typography>
              </Alert>

              {/* Income vs Spending Growth */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    📈 Income Growth
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    +{formatCurrency(results.summary.totalIncomeIncrease)} 
                    ({((results.summary.totalIncomeIncrease / inputs.currentIncome.annual) * 100).toFixed(0)}%)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Spending Growth
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    +{formatCurrency(results.summary.totalSpendingIncrease)}
                    ({((results.summary.totalSpendingIncrease / (inputs.spendingCategories.reduce((sum, cat) => sum + cat.currentMonthlyAmount * 12, 0))) * 100).toFixed(0)}%)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Detailed Analysis Tabs */}
      <Card>
        <Tabs value={activeResultsTab} onChange={(_, newValue) => setActiveResultsTab(newValue)}>
          <Tab label="Projections" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Category Analysis" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Recommendations" icon={<LightbulbIcon />} iconPosition="start" />
        </Tabs>

        <CardContent>
          {/* Projections Tab */}
          {activeResultsTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 Year-by-Year Projections
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Year</strong></TableCell>
                      <TableCell align="right"><strong>Income</strong></TableCell>
                      <TableCell align="right"><strong>Spending</strong></TableCell>
                      <TableCell align="right"><strong>Savings</strong></TableCell>
                      <TableCell align="right"><strong>Savings Rate</strong></TableCell>
                      <TableCell align="right"><strong>Shortfall</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.projections.map((projection, index) => (
                      <TableRow 
                        key={projection.year}
                        sx={{ 
                          bgcolor: index === 0 ? 'success.50' : 
                                  projection.savingsShortfall > 0 ? 'error.50' : 'inherit' 
                        }}
                      >
                        <TableCell>
                          <strong>{projection.year}</strong>
                          {index === 0 && <Chip label="Current" size="small" color="success" sx={{ ml: 1 }} />}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(projection.income)}</TableCell>
                        <TableCell align="right">{formatCurrency(projection.totalSpending)}</TableCell>
                        <TableCell align="right">
                          <Typography 
                            color={projection.actualSavings > 0 ? 'success.main' : 'error.main'}
                            fontWeight="medium"
                          >
                            {formatCurrency(projection.actualSavings)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            color={
                              projection.actualSavingsRate >= inputs.savingsGoals.targetSavingsRate ? 
                              'success.main' : 'error.main'
                            }
                            fontWeight="medium"
                          >
                            {formatPercentage(projection.actualSavingsRate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {projection.savingsShortfall > 0 ? (
                            <Typography color="error.main" fontWeight="medium">
                              -{formatCurrency(projection.savingsShortfall)}
                            </Typography>
                          ) : (
                            <CheckIcon color="success" fontSize="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Key Projections Summary */}
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'primary.50' }}>
                    <CardContent>
                      <Typography variant="subtitle2">Final Year Income</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        {formatCurrency(results.projections[results.projections.length - 1].income)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'warning.50' }}>
                    <CardContent>
                      <Typography variant="subtitle2">Final Year Spending</Typography>
                      <Typography variant="h5" color="warning.main" fontWeight="bold">
                        {formatCurrency(results.projections[results.projections.length - 1].totalSpending)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: 'success.50' }}>
                    <CardContent>
                      <Typography variant="subtitle2">Final Year Savings</Typography>
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        {formatCurrency(results.projections[results.projections.length - 1].actualSavings)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Category Analysis Tab */}
          {activeResultsTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📈 Category-by-Category Analysis
              </Typography>
              
              <Grid container spacing={2}>
                {categoryComparisons.map((comparison, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {comparison.category}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Inflation Rate: {formatPercentage(comparison.inflationRate)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(comparison.inflationRate, 100)}
                            color={
                              comparison.inflationRate < 20 ? 'success' :
                              comparison.inflationRate < 40 ? 'warning' : 'error'
                            }
                            sx={{ height: 8, borderRadius: 4, mt: 1 }}
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Year 1</Typography>
                            <Typography variant="h6">{formatCurrency(comparison.yearOne)}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Final Year</Typography>
                            <Typography variant="h6">{formatCurrency(comparison.finalYear)}</Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">Total Increase</Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                            +{formatCurrency(comparison.totalIncrease)} 
                            ({formatPercentage(comparison.percentageIncrease)})
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Category Summary */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2">💡 Category Insights</Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>
                    <strong>Highest Inflation:</strong>{' '}
                    {categoryComparisons.sort((a, b) => b.inflationRate - a.inflationRate)[0]?.category} 
                    ({formatPercentage(categoryComparisons.sort((a, b) => b.inflationRate - a.inflationRate)[0]?.inflationRate)})
                  </li>
                  <li>
                    <strong>Biggest Dollar Impact:</strong>{' '}
                    {categoryComparisons.sort((a, b) => b.totalIncrease - a.totalIncrease)[0]?.category}
                    (+{formatCurrency(categoryComparisons.sort((a, b) => b.totalIncrease - a.totalIncrease)[0]?.totalIncrease)})
                  </li>
                  <li>
                    <strong>Total Spending Increase:</strong>{' '}
                    {formatCurrency(categoryComparisons.reduce((sum, cat) => sum + cat.totalIncrease, 0))}
                  </li>
                </ul>
              </Alert>
            </Box>
          )}

          {/* Recommendations Tab */}
          {activeResultsTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                💡 Personalized Recommendations
              </Typography>
              
              {results.recommendations.map((recommendation, index) => (
                <Alert 
                  key={index} 
                  severity={
                    recommendation.includes('🚨') ? 'error' :
                    recommendation.includes('⚠️') ? 'warning' :
                    recommendation.includes('✅') ? 'success' : 'info'
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">{recommendation}</Typography>
                </Alert>
              ))}

              {/* Action Plan */}
              <Card sx={{ mt: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.main' }}>
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    🎯 Recommended Action Plan
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        📋 Immediate Actions (This Month)
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Set up automatic savings increase with next raise</li>
                        <li>Identify top 2 highest inflation categories</li>
                        <li>Create spending budgets for discretionary categories</li>
                        <li>Open separate savings accounts for goals</li>
                      </ul>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        📈 Long-term Strategies (6+ Months)
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Implement the 50% rule for all future raises</li>
                        <li>Review and adjust category inflation rates annually</li>
                        <li>Track lifestyle inflation vs wealth accumulation</li>
                        <li>Consider lifestyle inflation "budgets" per category</li>
                      </ul>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Scenario Comparison */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔄 Scenario Comparison: With vs Without Lifestyle Inflation
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        ✅ Controlled Inflation Scenario
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        If you maintain current spending levels (no lifestyle inflation):
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Additional Annual Savings:</strong> {formatCurrency(results.summary.totalSpendingIncrease / inputs.expectedRaises.yearsToProject)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Emergency Fund Timeline:</strong> {formatYears(results.summary.yearsToFinancialGoal.withoutInflation)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Wealth Preserved:</strong> {formatCurrency(results.summary.totalWealthLoss)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="error.main" gutterBottom>
                        ⚠️ Current Inflation Scenario
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        With your current lifestyle inflation rates:
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>Final Savings Rate:</strong> {formatPercentage(results.summary.finalSavingsRate)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Emergency Fund Timeline:</strong> {formatYears(results.summary.yearsToFinancialGoal.withInflation)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Wealth Loss:</strong> {formatCurrency(results.summary.totalWealthLoss)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<MoneyIcon />}
          sx={{ 
            bgcolor: 'success.main', 
            '&:hover': { bgcolor: 'success.dark' },
            px: 4, 
            py: 1.5 
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Adjust Your Strategy
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Go back to modify your inputs and see how different strategies affect your wealth building.
        </Typography>
      </Box>
    </Box>
  );
} 