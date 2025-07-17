// tabs/OptimizationTab.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
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
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { 
  FourOhOneKData, 
  EnhancedCalculations, 
  RetirementIncome,
  CONTRIBUTION_LIMITS,
  formatCurrency
} from '../../../../utils/fourOhOneK';

interface OptimizationTabProps {
  data: FourOhOneKData;
  calculations: EnhancedCalculations;
  retirementIncome: RetirementIncome;
  recommendations: string[];
}

const OptimizationTab: React.FC<OptimizationTabProps> = ({
  data,
  calculations,
  retirementIncome,
  recommendations
}) => {
  // Calculate contribution rate scenarios
  const contributionScenarios = [6, 10, 12, 15, 18, 20].map(rate => {
    const monthlyContrib = (data.annualIncome * rate / 100) / 12;
    const annualContrib = monthlyContrib * 12;
    const catchUpBonus = data.currentAge >= 50 ? CONTRIBUTION_LIMITS.catchUp : 0;
    const totalAnnual = annualContrib + (data.includeCatchUp ? catchUpBonus : 0);
    
    // Simplified projection calculation
    const years = calculations.yearsToRetirement;
    const netReturn = (data.estimatedReturn - data.totalFees) / 100;
    const projectedBalance = data.currentBalance * Math.pow(1 + netReturn, years) + 
      (totalAnnual * years * (1 + netReturn));
    
    const monthlyIncome = (projectedBalance * 0.04) / 12;
    const difference = projectedBalance - calculations.finalBalance;
    
    return {
      rate,
      monthlyContrib,
      annualContrib: totalAnnual,
      projectedBalance,
      monthlyIncome,
      difference,
      isCurrent: Math.abs(rate - calculations.contributionPercent) < 1,
      replacementRatio: (monthlyIncome * 12) / data.annualIncome * 100
    };
  });

  // Priority action items with severity
  const getActionItems = () => {
    const items = [];
    
    // Critical: Not getting employer match
    if (calculations.currentEmployerMatch < calculations.maxEmployerMatch) {
      items.push({
        severity: 'error' as const,
        priority: 1,
        title: 'Maximize Employer Match',
        description: `Increase contribution to ${data.employerMatchLimit}% to get full employer match`,
        impact: formatCurrency(calculations.maxEmployerMatch - calculations.currentEmployerMatch),
        timeframe: 'Immediate'
      });
    }
    
    // High: High fees
    if (data.totalFees > 1.5) {
      items.push({
        severity: 'warning' as const,
        priority: 2,
        title: 'Reduce Investment Fees',
        description: `Current ${data.totalFees}% fees are high - review fund choices`,
        impact: 'Tens of thousands over career',
        timeframe: 'Next review cycle'
      });
    }
    
    // Medium: Low contribution rate
    if (calculations.contributionPercent < 15) {
      items.push({
        severity: 'warning' as const,
        priority: 3,
        title: 'Increase Contribution Rate',
        description: `Current ${calculations.contributionPercent.toFixed(1)}% is below optimal 15%+`,
        impact: `${formatCurrency((contributionScenarios.find(s => s.rate === 15)?.difference || 0))} more at retirement`,
        timeframe: 'Gradually over 1-2 years'
      });
    }
    
    // Catch-up eligible
    if (data.currentAge >= 50 && !data.includeCatchUp) {
      items.push({
        severity: 'info' as const,
        priority: 4,
        title: 'Enable Catch-up Contributions',
        description: 'You can contribute an additional $7,500 annually',
        impact: formatCurrency(CONTRIBUTION_LIMITS.catchUp),
        timeframe: 'Next payroll update'
      });
    }
    
    // Low income replacement
    if (retirementIncome.replacementRatio < 70) {
      items.push({
        severity: 'warning' as const,
        priority: 2,
        title: 'Insufficient Retirement Income',
        description: `Projected ${retirementIncome.replacementRatio.toFixed(0)}% replacement may not be adequate`,
        impact: 'Lifestyle adjustments needed',
        timeframe: 'Long-term planning'
      });
    }
    
    return items.sort((a, b) => a.priority - b.priority);
  };

  const actionItems = getActionItems();

  // Calculate optimization score
  const getOptimizationScore = () => {
    let score = 0;
    let maxScore = 0;
    
    // Employer match (30 points)
    maxScore += 30;
    score += (calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 30;
    
    // Contribution rate (25 points)
    maxScore += 25;
    const targetRate = data.currentAge >= 50 ? 20 : 15;
    score += Math.min(calculations.contributionPercent / targetRate, 1) * 25;
    
    // Fees (20 points)
    maxScore += 20;
    score += data.totalFees <= 1 ? 20 : data.totalFees <= 1.5 ? 15 : 10;
    
    // Income replacement (15 points)
    maxScore += 15;
    score += Math.min(retirementIncome.replacementRatio / 80, 1) * 15;
    
    // Catch-up usage (10 points if eligible)
    if (data.currentAge >= 50) {
      maxScore += 10;
      score += data.includeCatchUp ? 10 : 0;
    }
    
    return {
      score: Math.round(score),
      maxScore,
      percentage: Math.round((score / maxScore) * 100)
    };
  };

  const optimizationScore = getOptimizationScore();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>🎯 Advanced 401(k) Optimization</Typography>
      
      {/* Optimization Score Dashboard */}
      <Card sx={{ mb: 4, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>📊 Your 401(k) Optimization Score</Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h2" color="primary.main" fontWeight="bold">
                {optimizationScore.percentage}
              </Typography>
              <Typography variant="h6">/ 100</Typography>
              <Typography variant="body2" color="text.secondary">Optimization Score</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <LinearProgress
                variant="determinate"
                value={optimizationScore.percentage}
                color={optimizationScore.percentage >= 80 ? 'success' : 
                       optimizationScore.percentage >= 60 ? 'warning' : 'error'}
                sx={{ height: 12, borderRadius: 6, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {optimizationScore.percentage >= 80 ? 'Excellent! Your 401(k) strategy is well-optimized.' :
                 optimizationScore.percentage >= 60 ? 'Good progress. Some areas for improvement.' :
                 'Significant optimization opportunities available.'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" gutterBottom>Score Breakdown:</Typography>
              <Typography variant="caption" display="block">
                • Employer Match: {Math.min(30, Math.round((calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 30))}/30
              </Typography>
              <Typography variant="caption" display="block">
                • Contribution Rate: {Math.min(25, Math.round(Math.min(calculations.contributionPercent / (data.currentAge >= 50 ? 20 : 15), 1) * 25))}/25
              </Typography>
              <Typography variant="caption" display="block">
                • Fees: {data.totalFees <= 1 ? 20 : data.totalFees <= 1.5 ? 15 : 10}/20
              </Typography>
              <Typography variant="caption" display="block">
                • Income Replacement: {Math.min(15, Math.round(Math.min(retirementIncome.replacementRatio / 80, 1) * 15))}/15
              </Typography>
              {data.currentAge >= 50 && (
                <Typography variant="caption" display="block">
                  • Catch-up: {data.includeCatchUp ? 10 : 0}/10
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        {/* Priority Action Items */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🚨 Priority Action Items</Typography>
              
              {actionItems.length === 0 ? (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  <Typography variant="body2">
                    <strong>Excellent!</strong> No critical action items found. Your 401(k) strategy is well-optimized.
                  </Typography>
                </Alert>
              ) : (
                <Box>
                  {actionItems.map((item, index) => (
                    <Alert 
                      key={index}
                      severity={item.severity}
                      icon={item.severity === 'error' ? <ErrorIcon /> : <WarningIcon />}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        <strong>#{item.priority}: {item.title}</strong>
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Impact: ${item.impact}`} size="small" />
                        <Chip label={`Timeline: ${item.timeframe}`} size="small" variant="outlined" />
                      </Box>
                    </Alert>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Contribution Rate Impact */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📈 Contribution Rate Impact</Typography>
              
              <Typography variant="body2" gutterBottom>
                Impact of different contribution rates on your retirement:
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rate</TableCell>
                      <TableCell align="right">Monthly</TableCell>
                      <TableCell align="right">Final Balance</TableCell>
                      <TableCell align="right">Difference</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contributionScenarios.map((scenario) => (
                      <TableRow 
                        key={scenario.rate}
                        sx={{ 
                          bgcolor: scenario.isCurrent ? 'primary.50' : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <strong>{scenario.rate}%</strong>
                            {scenario.isCurrent && <Chip label="current" size="small" />}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(scenario.monthlyContrib)}</TableCell>
                        <TableCell align="right">{formatCurrency(scenario.projectedBalance)}</TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color={scenario.difference > 0 ? 'success.main' : scenario.difference < 0 ? 'error.main' : 'text.secondary'}
                            fontWeight={scenario.difference !== 0 ? 'bold' : 'normal'}
                          >
                            {scenario.difference > 0 ? '+' : ''}{formatCurrency(scenario.difference)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> Increasing your contribution by just 1% annually can significantly boost your retirement savings.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics Dashboard */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📊 Performance Metrics Dashboard</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      {((calculations.finalBalance / calculations.totalContributions - 1) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Total Return</Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs {(data.estimatedReturn - data.totalFees).toFixed(1)}% annual
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      {((calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Match Efficiency</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(calculations.currentEmployerMatch)} captured
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="info.main" fontWeight="bold">
                      {calculations.nationalComparison.balancePercentile.toFixed(0)}th
                    </Typography>
                    <Typography variant="body2">Percentile vs Peers</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {calculations.nationalComparison.balancePercentile > 50 ? 'Above' : 'Below'} average
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                    <Typography variant="h5" color="warning.main" fontWeight="bold">
                      {retirementIncome.replacementRatio.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2">Income Replacement</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: 70-90%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Recommendations */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">💡 Detailed Optimization Recommendations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom color="error.main">
                    <strong>Immediate Actions (Next 30 Days):</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {calculations.currentEmployerMatch < calculations.maxEmployerMatch && (
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Increase contribution to {data.employerMatchLimit}% to maximize employer match</strong>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Impact: {formatCurrency(calculations.maxEmployerMatch - calculations.currentEmployerMatch)}/year in free money
                        </Typography>
                      </li>
                    )}
                    {data.totalFees > 1.5 && (
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Review and reduce investment fees (current: {data.totalFees}%)</strong>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Impact: Potentially tens of thousands over your career
                        </Typography>
                      </li>
                    )}
                    {data.currentAge >= 50 && !data.includeCatchUp && (
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Enable catch-up contributions</strong>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Impact: Additional {formatCurrency(CONTRIBUTION_LIMITS.catchUp)} annually
                        </Typography>
                      </li>
                    )}
                  </ul>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom color="success.main">
                    <strong>Long-term Strategies (Next 6-12 Months):</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {calculations.contributionPercent < 15 && (
                      <li style={{ marginBottom: '8px' }}>
                        Gradually increase contribution rate to 15%+
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Consider 1% increase annually until you reach target
                        </Typography>
                      </li>
                    )}
                    <li style={{ marginBottom: '8px' }}>
                      Review investment allocation annually
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Ensure age-appropriate risk level and diversification
                      </Typography>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Consider Roth 401(k) for tax diversification
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Especially beneficial if you're young or expect higher future tax rates
                      </Typography>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Set up automatic contribution increases
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Many plans offer automatic escalation with salary raises
                      </Typography>
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>🎯 Advanced Optimization Strategies</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom><strong>Maximize Tax Benefits:</strong></Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Always contribute enough to get full employer match</li>
                      <li>Use catch-up contributions if 50+ for extra tax savings</li>
                      <li>Consider Roth vs Traditional based on current vs future tax rates</li>
                      <li>Time large contributions to maximize tax deductions</li>
                    </ul>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom><strong>Investment Optimization:</strong></Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Choose lowest-cost index funds when available</li>
                      <li>Maintain age-appropriate asset allocation</li>
                      <li>Rebalance portfolio annually or when significantly off-target</li>
                      <li>Don't panic sell during market downturns - stay the course</li>
                    </ul>
                  </Grid>
                </Grid>
              </Alert>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Personalized Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>🎯 Your Personalized Recommendations</Typography>
              
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                Based on your current situation (Age {data.currentAge}, {formatCurrency(data.annualIncome)} income, 
                {calculations.contributionPercent.toFixed(1)}% contribution rate):
              </Typography>

              {recommendations.length > 0 ? (
                <Grid container spacing={2}>
                  {recommendations.map((rec, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'primary.main', 
                        borderRadius: 1,
                        bgcolor: 'primary.50'
                      }}>
                        <Typography variant="body2">
                          <strong>#{index + 1}:</strong> {rec}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="success">
                  <Typography variant="body2">
                    Great job! Your 401(k) strategy is well-optimized. Continue monitoring and adjusting as your situation changes.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Age-Specific Advice */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📅 Age-Specific Optimization Tips</Typography>
              
              <Grid container spacing={3}>
                {/* Current Age Group Advice */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    For Your Age Group ({data.currentAge >= 50 ? '50+' : data.currentAge >= 40 ? '40s' : data.currentAge >= 30 ? '30s' : '20s'}):
                  </Typography>
                  
                  {data.currentAge < 30 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li><strong>Time is your superpower:</strong> Even small contributions compound dramatically</li>
                      <li><strong>Take more risk:</strong> You can weather market volatility</li>
                      <li><strong>Start with employer match:</strong> Then gradually increase to 15%+</li>
                      <li><strong>Consider Roth:</strong> You're likely in a lower tax bracket now</li>
                      <li><strong>Automate increases:</strong> Set up 1% annual bumps</li>
                    </ul>
                  ) : data.currentAge < 40 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li><strong>Peak earning potential:</strong> Aim for 15-20% contribution rate</li>
                      <li><strong>Balance growth and stability:</strong> Still time for aggressive investing</li>
                      <li><strong>Maximize employer benefits:</strong> Don't leave money on the table</li>
                      <li><strong>Tax diversification:</strong> Consider mix of Traditional and Roth</li>
                      <li><strong>Review annually:</strong> Adjust with salary increases</li>
                    </ul>
                  ) : data.currentAge < 50 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li><strong>Crunch time:</strong> 15-20% should be minimum target</li>
                      <li><strong>Reduce risk gradually:</strong> Start shifting to more conservative allocation</li>
                      <li><strong>Maximize contributions:</strong> Peak earning years - save aggressively</li>
                      <li><strong>Plan for catch-up:</strong> Prepare for age 50+ contribution limits</li>
                      <li><strong>Consider professional help:</strong> Financial advisor for complex planning</li>
                    </ul>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li><strong>Use catch-up contributions:</strong> Extra $7,500 annually available</li>
                      <li><strong>Conservative shift:</strong> Reduce risk as retirement approaches</li>
                      <li><strong>Maximize everything:</strong> Last chance for aggressive saving</li>
                      <li><strong>Withdrawal planning:</strong> Start thinking about retirement income strategy</li>
                      <li><strong>Healthcare planning:</strong> Consider HSA and healthcare costs</li>
                    </ul>
                  )}
                </Grid>

                {/* General Optimization Principles */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Universal Optimization Principles:
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom><strong>The 401(k) Hierarchy:</strong></Typography>
                    <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li>Contribute enough to get full employer match (free money)</li>
                      <li>Pay off high-interest debt (credit cards, etc.)</li>
                      <li>Build emergency fund (3-6 months expenses)</li>
                      <li>Increase 401(k) to 15%+ of income</li>
                      <li>Consider IRA contributions for additional tax advantages</li>
                      <li>Maximize 401(k) to annual limits if possible</li>
                    </ol>
                  </Box>

                  <Box>
                    <Typography variant="body2" gutterBottom><strong>Key Success Factors:</strong></Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      <li><strong>Start early:</strong> Time is more powerful than amount</li>
                      <li><strong>Be consistent:</strong> Regular contributions beat timing the market</li>
                      <li><strong>Increase gradually:</strong> 1% annual increases are manageable</li>
                      <li><strong>Control costs:</strong> Every 0.5% in fees matters long-term</li>
                      <li><strong>Stay disciplined:</strong> Don't cash out when changing jobs</li>
                      <li><strong>Review regularly:</strong> Annual check-ups keep you on track</li>
                    </ul>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Plan Summary */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>✅ Your 30-60-90 Day Action Plan</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="error.main">
                    <strong>Next 30 Days:</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {calculations.currentEmployerMatch < calculations.maxEmployerMatch && (
                      <li>Contact HR to increase contribution to {data.employerMatchLimit}%</li>
                    )}
                    {data.currentAge >= 50 && !data.includeCatchUp && (
                      <li>Enable catch-up contributions</li>
                    )}
                    <li>Review current investment fund expense ratios</li>
                    <li>Set calendar reminder for annual review</li>
                  </ul>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="warning.main">
                    <strong>Next 60 Days:</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {data.totalFees > 1.5 && (
                      <li>Research lower-cost fund options in your plan</li>
                    )}
                    {calculations.contributionPercent < 15 && (
                      <li>Plan gradual increase to 15% contribution rate</li>
                    )}
                    <li>Review beneficiary designations</li>
                    <li>Consider Roth vs Traditional allocation</li>
                  </ul>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    <strong>Next 90 Days:</strong>
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    <li>Set up automatic annual contribution increases</li>
                    <li>Rebalance portfolio if needed</li>
                    <li>Calculate total retirement savings across all accounts</li>
                    <li>Consider consulting with financial advisor</li>
                  </ul>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Remember:</strong> Small improvements compound over time. Even a 1% increase in your contribution rate 
                  can add tens of thousands to your retirement balance. The key is to start today and stay consistent.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OptimizationTab;