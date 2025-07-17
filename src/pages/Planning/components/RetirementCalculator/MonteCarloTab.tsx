import { FC, useState, useEffect } from 'react';
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
  Slider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
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
import { RetirementInputs, CHART_COLORS } from '../../../../types/retirement';
import { MonteCarloResults, runMonteCarloSimulation } from '../../../../utils/monteCarloSimulation';
import { formatCurrency } from '../../../../utils/retirementCalculations';

interface MonteCarloTabProps {
  inputs: RetirementInputs;
  costOfLivingIndex: number;
}

const MonteCarloTab: FC<MonteCarloTabProps> = ({ inputs, costOfLivingIndex }) => {
  const [results, setResults] = useState<MonteCarloResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [simulationCount, setSimulationCount] = useState(5000);
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);
  
  const handleRunSimulation = async () => {
    setIsCalculating(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const monteCarloResults = runMonteCarloSimulation(inputs, costOfLivingIndex, simulationCount);
      setResults(monteCarloResults);
      setIsCalculating(false);
    }, 100);
  };
  
  useEffect(() => {
    if (inputs.currentAge && inputs.retirementAge && inputs.currentSavings) {
      handleRunSimulation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.currentAge, inputs.retirementAge, inputs.currentSavings, simulationCount]);
  
  const getSuccessColor = (probability: number) => {
    if (probability >= 90) return 'success';
    if (probability >= 75) return 'warning';
    return 'error';
  };
  
  const getSuccessMessage = (probability: number) => {
    if (probability >= 95) return 'Excellent! Your plan has a very high probability of success.';
    if (probability >= 85) return 'Good! Your plan is likely to succeed, with some market risk.';
    if (probability >= 70) return 'Moderate risk. Consider increasing savings or adjusting goals.';
    if (probability >= 50) return 'High risk. Significant changes needed to your retirement plan.';
    return 'Very high risk. Major adjustments required for retirement security.';
  };
  
  if (isCalculating) {
    return (
      <Box className="text-center p-8">
        <PsychologyIcon fontSize="large" color="primary" className="mb-4" />
        <Typography variant="h6" className="mb-4">
          Running Monte Carlo Analysis...
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-4">
          Simulating {simulationCount.toLocaleString()} market scenarios
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
          Run Monte Carlo Analysis
        </Button>
        <Typography variant="body2" color="textSecondary" className="mt-4">
          Analyze your retirement plan under thousands of market scenarios
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Controls */}
      <Paper elevation={1} className="p-4 mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              Number of Simulations: {simulationCount.toLocaleString()}
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
      
      {/* Success Probability Overview */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} md={4}>
          <Card className={`h-full border-l-4 ${
            results.successProbability >= 90 ? 'border-green-500' : 
            results.successProbability >= 75 ? 'border-yellow-500' : 'border-red-500'
          }`}>
            <CardContent>
              <Box className="text-center">
                <Typography variant="h3" className={`font-bold ${
                  results.successProbability >= 90 ? 'text-green-600' : 
                  results.successProbability >= 75 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.successProbability.toFixed(1)}%
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Success Probability
                </Typography>
                <Box className="mt-2">
                  {results.successProbability >= 85 ? 
                    <CheckCircleIcon color="success" /> : 
                    <WarningIcon color="warning" />
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expected Outcomes
              </Typography>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="body2">Best Case (90th):</Typography>
                  <Typography variant="body2" className="font-semibold text-green-600">
                    {formatCurrency(results.bestCase90th)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Median:</Typography>
                  <Typography variant="body2" className="font-semibold">
                    {formatCurrency(results.medianOutcome)}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Worst Case (10th):</Typography>
                  <Typography variant="body2" className="font-semibold text-red-600">
                    {formatCurrency(results.worstCase10th)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="h-full">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Analysis
              </Typography>
              <Box className="space-y-3">
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Probability of Depletion
                  </Typography>
                  <Box className="flex items-center">
                    <LinearProgress
                      variant="determinate"
                      value={results.probabilityOfDepletion}
                      color={results.probabilityOfDepletion < 10 ? 'success' : 
                             results.probabilityOfDepletion < 25 ? 'warning' : 'error'}
                      className="flex-1 mr-2"
                    />
                    <Typography variant="body2" className="font-semibold">
                      {results.probabilityOfDepletion.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={getSuccessColor(results.successProbability) === 'success' ? 'Low Risk' :
                         getSuccessColor(results.successProbability) === 'warning' ? 'Moderate Risk' : 'High Risk'}
                  color={getSuccessColor(results.successProbability)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Alert Message */}
      <Alert
        severity={getSuccessColor(results.successProbability)}
        className="mb-6"
        icon={results.successProbability >= 85 ? <CheckCircleIcon /> : <WarningIcon />}
      >
        {getSuccessMessage(results.successProbability)}
      </Alert>
      
      {/* Detailed Analysis Tabs */}
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeSubTab} onChange={(_, value) => setActiveSubTab(value)}>
            <Tab label="Confidence Bands" icon={<TimelineIcon />} iconPosition="start" />
            <Tab label="Outcome Distribution" icon={<AnalyticsIcon />} iconPosition="start" />
            <Tab label="Success Scenarios" icon={<TrendingUpIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Confidence Bands Chart */}
        <Box role="tabpanel" hidden={activeSubTab !== 0} className="p-4">
          {activeSubTab === 0 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                Savings Projection with Confidence Bands
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
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.1}
                          name="90th Percentile"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile75"
                          stackId="2"
                          stroke="none"
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.2}
                          name="75th Percentile"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile25"
                          stackId="3"
                          stroke="none"
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.3}
                          name="25th Percentile"
                        />
                        <Area
                          type="monotone"
                          dataKey="percentile10"
                          stackId="4"
                          stroke="none"
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.1}
                          name="10th Percentile"
                        />
                      </>
                    )}
                    
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke={CHART_COLORS[0]}
                      strokeWidth={3}
                      name="Median Projection"
                      dot={false}
                    />
                    
                    <ReferenceLine x={inputs.retirementAge} stroke="red" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                Shaded areas represent confidence intervals. The median line shows the most likely outcome.
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Outcome Distribution */}
        <Box role="tabpanel" hidden={activeSubTab !== 1} className="p-4">
          {activeSubTab === 1 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                Probability Distribution of Final Balance
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
                          formatter={(value: number) => [formatCurrency(value), 'Final Balance']}
                          labelFormatter={(percentile) => `${percentile}th Percentile`}
                        />
                        <Bar 
                          dataKey="value" 
                          fill={CHART_COLORS[1]}
                          name="Final Balance"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Key Insights
                  </Typography>
                  <Box className="space-y-3">
                    <Box className="p-3 bg-blue-50 rounded">
                      <Typography variant="body2" className="font-semibold">
                        Range of Outcomes
                      </Typography>
                      <Typography variant="body2">
                        Your final balance could range from {formatCurrency(results.worstCase10th)} to {formatCurrency(results.bestCase90th)}
                      </Typography>
                    </Box>
                    <Box className="p-3 bg-green-50 rounded">
                      <Typography variant="body2" className="font-semibold">
                        Most Likely Outcome
                      </Typography>
                      <Typography variant="body2">
                        50% chance of having more than {formatCurrency(results.medianOutcome)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {/* Success Scenarios */}
        <Box role="tabpanel" hidden={activeSubTab !== 2} className="p-4">
          {activeSubTab === 2 && (
            <Box>
              <Typography variant="h6" className="mb-4">
                Scenario Analysis
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      Success Rate by Outcome
                    </Typography>
                    <Box className="space-y-2">
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2">Plans that succeed:</Typography>
                        <Chip 
                          label={`${results.successProbability.toFixed(1)}%`}
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Box className="flex justify-between items-center">
                        <Typography variant="body2">Plans that run short:</Typography>
                        <Chip 
                          label={`${results.probabilityOfDepletion.toFixed(1)}%`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} className="p-4">
                    <Typography variant="subtitle1" gutterBottom>
                      What This Means
                    </Typography>
                    <Typography variant="body2" paragraph>
                      In {Math.round(results.successProbability)} out of 100 market scenarios, 
                      your retirement plan succeeds without running out of money.
                    </Typography>
                    <Typography variant="body2">
                      The remaining {Math.round(results.probabilityOfDepletion)}% of scenarios 
                      would require plan adjustments or lifestyle changes.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MonteCarloTab; 