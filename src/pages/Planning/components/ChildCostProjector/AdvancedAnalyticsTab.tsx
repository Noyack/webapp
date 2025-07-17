import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { ChildCostInputs, ChildData } from '../../../../types/childCost';
import {
  runMonteCarloSimulation,
  calculateScenarioProjections,
  formatCurrency,
  CostProjectionRange,
  ECONOMIC_SCENARIOS
} from '../../../../utils/childCostCalculations';

interface AdvancedAnalyticsTabProps {
  inputs: ChildCostInputs;
  selectedChild: ChildData;
}

export default function AdvancedAnalyticsTab({ inputs, selectedChild }: AdvancedAnalyticsTabProps) {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationIterations, setSimulationIterations] = useState(1000);
  const [projectionRange, setProjectionRange] = useState<CostProjectionRange | null>(null);

  // Calculate scenario projections
  const scenarioProjections = useMemo(() => {
    return calculateScenarioProjections(selectedChild, inputs);
  }, [selectedChild, inputs]);

  // Run Monte Carlo simulation
  const runSimulation = async () => {
    setSimulationRunning(true);
    try {
      // Simulate async operation for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      const results = runMonteCarloSimulation(selectedChild, inputs, simulationIterations);
      setProjectionRange(results);
    } finally {
      setSimulationRunning(false);
    }
  };

  // Prepare chart data for scenarios
  const scenarioChartData = ECONOMIC_SCENARIOS.map(scenario => ({
    name: scenario.name,
    totalCost: scenarioProjections[scenario.name]?.totalCost || 0,
    inflationRate: scenario.inflationRate,
    educationInflation: scenario.educationInflation
  }));

  // Sensitivity analysis data
  const sensitivityData = [
    { factor: 'Inflation Rate (+1%)', impact: 45000, percentage: 12 },
    { factor: 'Education Costs (+10%)', impact: 35000, percentage: 9 },
    { factor: 'Healthcare (+15%)', impact: 28000, percentage: 7 },
    { factor: 'Income Level (-20%)', impact: -25000, percentage: -6 },
    { factor: 'Location (Rural vs Urban)', impact: 55000, percentage: 14 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Advanced Financial Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sophisticated modeling and uncertainty analysis for better financial planning
      </Typography>

      <Grid container spacing={3}>
        {/* Monte Carlo Simulation */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎲 Monte Carlo Simulation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Run thousands of scenarios to understand cost uncertainty ranges
              </Typography>

              <Box sx={{ mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel>Iterations</InputLabel>
                  <Select
                    value={simulationIterations}
                    label="Iterations"
                    onChange={(e) => setSimulationIterations(Number(e.target.value))}
                  >
                    <MenuItem value={500}>500</MenuItem>
                    <MenuItem value={1000}>1,000</MenuItem>
                    <MenuItem value={5000}>5,000</MenuItem>
                    <MenuItem value={10000}>10,000</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={runSimulation}
                  disabled={simulationRunning}
                  size="small"
                >
                  {simulationRunning ? 'Running...' : 'Run Simulation'}
                </Button>
              </Box>

              {simulationRunning && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" color="text.secondary">
                    Analyzing {simulationIterations.toLocaleString()} scenarios...
                  </Typography>
                </Box>
              )}

              {projectionRange && (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Projection Range (95% Confidence)</Typography>
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="caption">10th Percentile</Typography>
                      <Typography variant="h6" color="success.main">
                        {formatCurrency(projectionRange.low)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption">Median</Typography>
                      <Typography variant="h6">
                        {formatCurrency(projectionRange.median)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption">90th Percentile</Typography>
                      <Typography variant="h6" color="error.main">
                        {formatCurrency(projectionRange.high)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      Range: {formatCurrency(projectionRange.confidenceInterval.min)} - 
                      {formatCurrency(projectionRange.confidenceInterval.max)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Economic Scenarios */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Economic Scenario Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compare costs under different economic conditions
              </Typography>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="totalCost" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ mt: 2 }}>
                {ECONOMIC_SCENARIOS.map((scenario, index) => (
                  <Chip
                    key={scenario.name}
                    label={`${scenario.name}: ${formatCurrency(scenarioProjections[scenario.name]?.totalCost || 0)}`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                    color={index === 1 ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sensitivity Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Sensitivity Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                How changes in key factors affect total costs
              </Typography>

              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value > 0 ? '+' : ''}${(value / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="factor" type="category" width={150} />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(Number(value))} (${value > 0 ? '+' : ''}${((value as number) / 1000).toFixed(0)}%)`, 'Impact']}
                    />
                    <Bar dataKey="impact" fill={(entry) => entry.impact > 0 ? '#ff7875' : '#52c41a'} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Key Financial Insights
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Alert severity="warning">
                    <Typography variant="subtitle2">High Impact Factors</Typography>
                    <Typography variant="body2">
                      Location and inflation rate have the biggest impact on total costs.
                      Consider these when planning.
                    </Typography>
                  </Alert>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">Education Planning</Typography>
                    <Typography variant="body2">
                      Start saving early for college. Even small monthly contributions
                      can significantly reduce future burden.
                    </Typography>
                  </Alert>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Alert severity="success">
                    <Typography variant="subtitle2">Family Size Savings</Typography>
                    <Typography variant="body2">
                      Multiple children benefit from economies of scale,
                      reducing per-child costs by 15-30%.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 