import { FC, useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Button
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Download as DownloadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  LocalDining as FoodIcon
} from '@mui/icons-material';
import { ChildCostInputs, YearlyCostData, LifetimeSummary } from '../../../../types/childCost';
import { calculateLifetimeCosts, formatCurrency, getStageForAge } from '../../../../utils/childCostCalculations';

interface ResultsTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const ResultsTab: FC<ResultsTabProps> = ({
  inputs,
  onInputChange
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedChildId, setSelectedChildId] = useState(inputs.selectedChild);

  const getSelectedChild = () => {
    return inputs.children.find(child => child.id === selectedChildId);
  };

  const selectedChild = getSelectedChild();
  
  const results = selectedChild ? calculateLifetimeCosts(selectedChild, inputs) : null;

  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <FoodIcon className="text-green-600" />;
      case 'housing': return <HomeIcon className="text-blue-600" />;
      case 'education': return <SchoolIcon className="text-purple-600" />;
      default: return <PersonIcon className="text-gray-600" />;
    }
  };

  const generateSummaryReport = () => {
    if (!results || !selectedChild) return;
    
    const report = {
      child: selectedChild.name,
      totalCost: results.summary.totalCost,
      categories: results.summary.byCategory,
      stages: results.summary.byStage,
      educationCost: results.summary.collegeCost + results.summary.gradSchoolCost,
      generatedAt: new Date().toLocaleDateString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `child-cost-report-${selectedChild.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!selectedChild || !results) {
    return (
      <Box className="text-center py-8">
        <PersonIcon className="text-gray-400 mb-2" style={{ fontSize: 48 }} />
        <Typography variant="h6" className="text-gray-500 mb-2">
          No Results Available
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Please select a child and ensure all required information is entered.
        </Typography>
      </Box>
    );
  }

  // Prepare chart data
  const yearlyChartData = results.results.map(year => ({
    ...year,
    ageLabel: `Age ${year.childAge}`,
    totalFormatted: formatCurrency(year.totalCost)
  }));

  const categoryChartData = Object.entries(results.summary.byCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    percentage: ((amount / results.summary.totalCost) * 100).toFixed(1)
  }));

  const stageChartData = Object.entries(results.summary.byStage)
    .filter(([_, amount]) => amount > 0)
    .map(([stage, amount]) => ({
      name: stage,
      value: amount,
      percentage: ((amount / results.summary.totalCost) * 100).toFixed(1)
    }));

  return (
    <Box>
      {/* Header with Child Selection */}
      <Box className="mb-4 flex justify-between items-center">
        <Box>
          <Typography variant="h5" className="font-bold text-[#011E5A] mb-2">
            Cost Projection Results
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Comprehensive cost analysis for raising your child
          </Typography>
        </Box>
        
        <Box className="flex items-center space-x-3">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Child</InputLabel>
            <Select
              value={selectedChildId}
              label="Select Child"
              onChange={(e) => setSelectedChildId(e.target.value as string)}
            >
              {inputs.children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={generateSummaryReport}
            size="small"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-blue-600 mb-1">
                {formatCurrency(results.summary.totalCost)}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Total Lifetime Cost
              </Typography>
              <Chip size="small" label="Birth to Independence" color="primary" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-green-600 mb-1">
                {formatCurrency(results.summary.collegeCost + results.summary.gradSchoolCost)}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Education Costs
              </Typography>
              <Chip 
                size="small" 
                label={`${((results.summary.collegeCost + results.summary.gradSchoolCost) / results.summary.totalCost * 100).toFixed(0)}% of total`} 
                color="success" 
                variant="outlined" 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-orange-600 mb-1">
                {formatCurrency(results.summary.totalCost / (selectedChild.currentAge <= 18 ? (25 - selectedChild.currentAge) : 7))}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Average Annual Cost
              </Typography>
              <Chip size="small" label="Inflation-Adjusted" color="warning" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card className="h-full">
            <CardContent className="text-center">
              <Typography variant="h4" className="font-bold text-purple-600 mb-1">
                {formatCurrency(results.summary.totalCost / 12 / (selectedChild.currentAge <= 18 ? (25 - selectedChild.currentAge) : 7))}
              </Typography>
              <Typography variant="subtitle2" className="text-gray-600 mb-2">
                Average Monthly Cost
              </Typography>
              <Chip size="small" label="Budget Planning" color="secondary" variant="outlined" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabbed Results */}
      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label="Year by Year" />
            <Tab label="By Category" />
            <Tab label="By Life Stage" />
            <Tab label="Cost Timeline" />
          </Tabs>
        </Box>

        <Box className="p-4">
          {/* Year by Year Analysis */}
          {selectedTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" className="mb-4">Annual Cost Breakdown</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="ageLabel" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={formatTooltip} />
                    <Legend />
                    <Bar dataKey="housing" stackId="a" fill="#82ca9d" name="Housing" />
                    <Bar dataKey="food" stackId="a" fill="#8884d8" name="Food" />
                    <Bar dataKey="childcare" stackId="a" fill="#ffc658" name="Childcare" />
                    <Bar dataKey="transportation" stackId="a" fill="#ff7300" name="Transportation" />
                    <Bar dataKey="healthcare" stackId="a" fill="#d53e4f" name="Healthcare" />
                    <Bar dataKey="clothing" stackId="a" fill="#66a4cd" name="Clothing" />
                    <Bar dataKey="personal" stackId="a" fill="#f781bf" name="Personal Care" />
                    <Bar dataKey="education" stackId="a" fill="#a6d854" name="Education" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    💡 <strong>Peak Cost Years:</strong> The highest costs typically occur during the teenage years 
                    (ages 15-17) due to increased food, transportation, and activity expenses, 
                    followed by college years with education costs.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* By Category */}
          {selectedTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="mb-4">Cost Distribution by Category</Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={inputs.expenseCategories[index]?.color || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="mb-4">Category Breakdown</Typography>
                <Box className="space-y-3">
                  {categoryChartData.map((category, index) => (
                    <Card key={category.name} variant="outlined">
                      <CardContent className="py-3">
                        <Box className="flex items-center justify-between">
                          <Box className="flex items-center space-x-3">
                            {getCategoryIcon(category.name)}
                            <Box>
                              <Typography variant="subtitle2" className="font-medium">
                                {category.name}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                {category.percentage}% of total
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="h6" className="font-bold">
                            {formatCurrency(category.value)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* By Life Stage */}
          {selectedTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="mb-4">Costs by Life Stage</Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={stageChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="mb-4">Stage Analysis</Typography>
                <Box className="space-y-3">
                  {stageChartData.map((stage) => (
                    <Card key={stage.name} variant="outlined">
                      <CardContent className="py-3">
                        <Box className="flex items-center justify-between">
                          <Box>
                            <Typography variant="subtitle2" className="font-medium">
                              {stage.name}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              {stage.percentage}% of total costs
                            </Typography>
                          </Box>
                          <Typography variant="h6" className="font-bold">
                            {formatCurrency(stage.value)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
                
                <Alert severity="info" className="mt-4">
                  <Typography variant="body2">
                    💡 <strong>Financial Planning Tip:</strong> Start saving early for the more expensive stages. 
                    College costs are typically the largest single expense category.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}

          {/* Cost Timeline */}
          {selectedTab === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant="h6" className="mb-4">Cost Timeline & Cumulative Expenses</Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageLabel" />
                    <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Tooltip formatter={formatTooltip} />
                    <Area 
                      type="monotone" 
                      dataKey="totalCost" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                      name="Annual Cost"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Box className="p-4 bg-blue-50 rounded-lg text-center">
                    <Typography variant="subtitle2" className="text-blue-800 mb-1">
                      Lowest Cost Year
                    </Typography>
                    <Typography variant="h6" className="text-blue-700">
                      {formatCurrency(Math.min(...results.results.map(r => r.totalCost)))}
                    </Typography>
                    <Typography variant="caption" className="text-blue-600">
                      Age {results.results.find(r => r.totalCost === Math.min(...results.results.map(r => r.totalCost)))?.childAge}
                    </Typography>
                  </Box>
                  
                  <Box className="p-4 bg-red-50 rounded-lg text-center">
                    <Typography variant="subtitle2" className="text-red-800 mb-1">
                      Highest Cost Year
                    </Typography>
                    <Typography variant="h6" className="text-red-700">
                      {formatCurrency(Math.max(...results.results.map(r => r.totalCost)))}
                    </Typography>
                    <Typography variant="caption" className="text-red-600">
                      Age {results.results.find(r => r.totalCost === Math.max(...results.results.map(r => r.totalCost)))?.childAge}
                    </Typography>
                  </Box>
                  
                  <Box className="p-4 bg-green-50 rounded-lg text-center">
                    <Typography variant="subtitle2" className="text-green-800 mb-1">
                      Cost Range
                    </Typography>
                    <Typography variant="h6" className="text-green-700">
                      {(Math.max(...results.results.map(r => r.totalCost)) / Math.min(...results.results.map(r => r.totalCost))).toFixed(1)}x
                    </Typography>
                    <Typography variant="caption" className="text-green-600">
                      Variation factor
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultsTab; 