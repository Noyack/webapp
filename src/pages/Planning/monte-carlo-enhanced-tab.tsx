// Enhanced401kMonteCarloTab.tsx
// Add this as a new tab to your existing 401(k) calculator

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
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

// Import your new Monte Carlo engine
import { MonteCarloEngine } from '../../monte-carlo-engine/core/SimulationEngine';
import { FourOhOneKAdapter, FourOhOneKInputs, FourOhOneKResults } from '../../monte-carlo-engine/adapters/FourOhOneKAdapter';
import { SimulationProgress } from '../../monte-carlo-engine/core/types';

// Your existing 401k data interface - convert to new format
interface FourOhOneKData {
  currentAge: number;
  retirementAge: number;
  annualIncome: number;
  currentBalance: number;
  monthlyContribution: number;
  contributionPercent: number;
  employerMatch: number;
  employerMatchLimit: number;
  estimatedReturn: number;
  totalFees: number;
  includeInflation: boolean;
  inflationRate: number;
  incomeGrowthRate: number;
}

interface Enhanced401kMonteCarloTabProps {
  data: FourOhOneKData;
}

const Enhanced401kMonteCarloTab: React.FC<Enhanced401kMonteCarloTabProps> = ({ data }) => {
  const [results, setResults] = useState<FourOhOneKResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState<SimulationProgress | null>(null);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [simulationCount, setSimulationCount] = useState(5000);
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [engine] = useState(() => new MonteCarloEngine());

  // Convert your existing data to new Monte Carlo input format
  const convertToMonteCarloInputs = (data: FourOhOneKData): FourOhOneKInputs => ({
    currentAge: data.currentAge,
    timeHorizon: data.retirementAge - data.currentAge,
    retirementAge: data.retirementAge,
    annualIncome: data.annualIncome,
    currentBalance: data.currentBalance,
    monthlyContribution: data.monthlyContribution,
    employerMatch: data.employerMatch,
    employerMatchLimit: data.employerMatchLimit,
    estimatedReturn: data.estimatedReturn,
    totalFees: data.totalFees,
    includeInflation: data.includeInflation,
    inflationRate: data.inflationRate,
    incomeGrowthRate: data.incomeGrowthRate,
    simulationCount: simulationCount,
    riskProfile: 'moderate' // Default, could be made configurable
  });

  const handleRunSimulation = async () => {
    setIsCalculating(true);
    setProgress(null);
    
    try {
      const inputs = convertToMonteCarloInputs(data);
      const adapter = new FourOhOneKAdapter();
      
      const simulationResults = await engine.runSimulation(
        inputs,
        adapter,
        (progressUpdate: SimulationProgress) => {
          setProgress(progressUpdate);
        }
      );
      
      // Calculate 401k-specific metrics
      const enhancedResults = adapter.calculate401kMetrics(simulationResults, inputs);
      setResults(enhancedResults);
      
    } catch (error) {
      console.error('Monte Carlo simulation failed:', error);
    } finally {
      setIsCalculating(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    if (data.currentAge && data.retirementAge && data.currentBalance !== undefined) {
      handleRunSimulation();
    }
    
    return () => {
      engine.destroy();
    };
  }, [data.currentAge, data.retirementAge, data.currentBalance, data.monthlyContribution, simulationCount]);

  const getSuccessColor = (probability: number) => {
    if (probability >= 90) return 'success';
    if (probability >= 75) return 'warning';
    return 'error';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isCalculating) {
    return (
      <Box className="text-center p-8">
        <PsychologyIcon fontSize="large" color="primary" className="mb-4" />
        <Typography variant="h6" className="mb-4">
          Running Enhanced 401(k) Monte Carlo Analysis...
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-4">
          {progress ? (
            <>
              Phase: {progress.currentPhase} | 
              Progress: {progress.completed.toLocaleString()}/{progress.total.toLocaleString()} scenarios
              {progress.estimatedTimeRemaining && (
                <> | Est. {Math.round(progress.estimatedTimeRemaining / 1000)}s remaining</>
              )}
            </>
          ) : (
            `Simulating ${simulationCount.toLocaleString()} market scenarios with enhanced modeling`
          )}
        </Typography>
        <LinearProgress className="w-64 mx-auto" />
      </Box>
    );
  }

  if (!results) {
    return (
      <Box className="text-center p-8">
        <Button
          variant="contained"
          size="large"
          onClick={handleRunSimulation}
          startIcon={<AnalyticsIcon />}
          className="bg-blue-600 text-white"
        >
          Run Enhanced Monte Carlo Analysis
        </Button>
        <Typography variant="body2" color="textSecondary" className="mt-4">
          Advanced 401(k) analysis with market volatility, economic cycles, and crash scenarios
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Enhanced Controls */}
      <Paper elevation={1} className="p-4 mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              Simulation Scenarios: {simulationCount.toLocaleString()}
            </Typography>
            <Slider
              value={simulationCount}
              onChange={(_, value) => setSimulationCount(value as number)}
              min={1000}
              max={10000}
              step={1000}
              marks={[
                { value: 1000, label: '1K' },
                { value: 5000, label: '5K' },
                { value: 10000, label: '10K' }
              ]}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={showConfidenceBands}
                  onChange={(e) => setShowConfidenceBands(e.target.checked)}
                />
              }
              label="Show Confidence Bands"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.checked)}
                />
              }
              label="Compare vs Deterministic"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={handleRunSimulation}
              startIcon={<AnalyticsIcon />}
              fullWidth
            >
              Recalculate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Enhanced Results Overview */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-blue-600">
                {formatCurrency(results.medianOutcome)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Median Balance
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-1">
                50% chance of more
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-green-600">
                {formatCurrency(results.monthlyReplacementIncome)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Monthly Income
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-1">
                4% withdrawal rule
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className={`font-bold ${
                results.employerMatchEfficiency >= 100 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {results.employerMatchEfficiency.toFixed(0)}%
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Match Efficiency
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-1">
                Free money captured
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-red-600">
                {formatCurrency(results.feeImpact)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Fee Impact
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-1">
                Lost to fees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Analysis Alert */}
      <Alert
        severity={results.successProbability >= 85 ? 'success' : results.successProbability >= 70 ? 'warning' : 'error'}
        className="mb-6"
        icon={results.successProbability >= 85 ? <CheckCircleIcon /> : <WarningIcon />}
      >
        <Typography variant="body1">
          <strong>Market Risk Assessment:</strong> Based on {simulationCount.toLocaleString()} scenarios, 
          your 401(k) plan shows a {results.successProbability >= 85 ? 'strong' : results.successProbability >= 70 ? 'moderate' : 'concerning'} outlook.
        </Typography>
        <Typography variant="body2" className="mt-1">
          Projected balance range: {formatCurrency(results.worstCase10th)} - {formatCurrency(results.bestCase90th)} 
          (10th-90th percentile)
        </Typography>
      </Alert>

      {/* Detailed Analysis Tabs */}
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeSubTab} onChange={(_, value) => setActiveSubTab(value)}>
            <Tab label="Projection Bands" icon={<TimelineIcon />} iconPosition="start" />
            <Tab label="Risk Distribution" icon={<AnalyticsIcon />} iconPosition="start" />
            <Tab label="Scenario Analysis" icon={<CompareArrowsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Enhanced Projection Bands */}
        <Box role="tabpanel" hidden={activeSubTab !== 0} className="p-4">
          {activeSubTab === 0 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                401(k) Balance Projections with Market Volatility
              </Typography>
              <Box className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.yearlyProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(age) => `Age: ${age}`}
                    />
                    <Legend />
                    
                    {showConfidenceBands && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="percentile90"
                          stackId="1"
                          stroke="none"
                          fill="#10b981"
                          fillOpacity={0.1}
                          name="90th Percentile (Best Case)"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile75"
                          stackId="2"
                          stroke="none"
                          fill="#10b981"
                          fillOpacity={0.2}
                          name="75th Percentile"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile25"
                          stackId="3"
                          stroke="none"
                          fill="#f59e0b"
                          fillOpacity={0.3}
                          name="25th Percentile"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile10"
                          stackId="4"
                          stroke="none"
                          fill="#ef4444"
                          fillOpacity={0.2}
                          name="10th Percentile (Worst Case)"
                        />
                      </>
                    )}
                    
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="#2563eb"
                      strokeWidth={3}
                      name="Median Projection"
                      dot={false}
                    />
                    
                    <ReferenceLine x={data.retirementAge} stroke="red" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              <Alert severity="info" className="mt-4">
                <Typography variant="body2">
                  <strong>Enhanced Modeling:</strong> This analysis includes market volatility, economic cycles, 
                  potential market crashes, and sequence of returns risk. The shaded bands show the range of 
                  possible outcomes based on historical market patterns.
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>

        {/* Risk Distribution Analysis */}
        <Box role="tabpanel" hidden={activeSubTab !== 1} className="p-4">
          {activeSubTab === 1 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                Outcome Distribution & Risk Metrics
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Box className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.confidenceIntervals}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="percentile"
                          tickFormatter={(value) => `${value}th`}
                        />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <RechartsTooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Balance']}
                          labelFormatter={(percentile) => `${percentile}th Percentile`}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#3b82f6"
                          name="Final Balance"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box className="space-y-3">
                    <Box className="p-3 bg-blue-50 rounded">
                      <Typography variant="body2" className="font-semibold">
                        Market Volatility Impact
                      </Typography>
                      <Typography variant="body2">
                        Your balance could vary by ±{((results.bestCase90th - results.worstCase10th) / results.medianOutcome * 50).toFixed(0)}% 
                        due to market conditions
                      </Typography>
                    </Box>
                    <Box className="p-3 bg-green-50 rounded">
                      <Typography variant="body2" className="font-semibold">
                        Success Probability
                      </Typography>
                      <Typography variant="body2">
                        {results.successProbability.toFixed(1)}% of scenarios meet your retirement goals
                      </Typography>
                    </Box>
                    <Box className="p-3 bg-orange-50 rounded">
                      <Typography variant="body2" className="font-semibold">
                        Fee Drag
                      </Typography>
                      <Typography variant="body2">
                        {data.totalFees}% annual fees cost you {formatCurrency(results.feeImpact)} over your career
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Enhanced Scenario Analysis */}
        <Box role="tabpanel" hidden={activeSubTab !== 2} className="p-4">
          {activeSubTab === 2 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                Market Scenario Analysis
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      Economic Scenarios Tested
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2">Normal Markets (65%):</Typography>
                        <Chip label={formatCurrency(results.medianOutcome)} color="success" size="small" />
                      </Box>
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2">Bear Markets (15%):</Typography>
                        <Chip label={formatCurrency(results.worstCase10th)} color="error" size="small" />
                      </Box>
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2">Bull Markets (20%):</Typography>
                        <Chip label={formatCurrency(results.bestCase90th)} color="success" size="small" />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      Risk Factors Modeled
                    </Typography>
                    <ul className="text-sm space-y-1">
                      <li>• Market volatility and crashes</li>
                      <li>• Inflation variation</li>
                      <li>• Economic cycles (bull/bear markets)</li>
                      <li>• Fee compounding effects</li>
                      <li>• Employer match optimization</li>
                      <li>• Income growth uncertainty</li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Enhanced Recommendations */}
      <Accordion className="mt-6">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🎯 Personalized Recommendations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Based on Monte Carlo Analysis:
              </Typography>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    <strong>•</strong> {rec}
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Risk Mitigation Strategies:
              </Typography>
              <ul className="space-y-2 text-sm">
                <li><strong>•</strong> Consider target-date funds for automatic rebalancing</li>
                <li><strong>•</strong> Review fee structure annually - even 0.5% matters</li>
                <li><strong>•</strong> Increase contributions during market downturns if possible</li>
                <li><strong>•</strong> Don't panic during market volatility - stay the course</li>
                <li><strong>•</strong> Consider Roth 401(k) for tax diversification</li>
              </ul>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Enhanced401kMonteCarloTab;