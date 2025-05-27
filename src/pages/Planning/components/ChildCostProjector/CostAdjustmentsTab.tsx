import { FC } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  InputAdornment,
  Alert,
  Chip
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChildCostInputs, ExpenseCategory } from '../../../../types/childCost';
import { formatCurrency } from '../../../../utils/childCostCalculations';

interface CostAdjustmentsTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const CostAdjustmentsTab: FC<CostAdjustmentsTabProps> = ({
  inputs,
  onInputChange
}) => {
  const updateExpenseCategory = (id: string, field: keyof ExpenseCategory, value: any) => {
    const updatedCategories = inputs.expenseCategories.map(category => {
      if (category.id === id) {
        return {
          ...category,
          [field]: value
        };
      }
      return category;
    });
    
    onInputChange('expenseCategories', updatedCategories);
  };

  const getTotalPercentage = () => {
    return inputs.expenseCategories.reduce((sum, cat) => sum + cat.basePercent, 0);
  };

  const getEstimatedAnnualAmount = (category: ExpenseCategory) => {
    const baseAmount = 12980; // USDA base cost
    const locationAdjusted = baseAmount * (inputs.location.costOfLivingIndex / 100);
    return (locationAdjusted * (category.basePercent / 100));
  };

  const totalPercentage = getTotalPercentage();
  const isPercentageValid = totalPercentage >= 95 && totalPercentage <= 105;

  const chartData = inputs.expenseCategories.map(category => ({
    name: category.name,
    percentage: category.basePercent,
    amount: getEstimatedAnnualAmount(category),
    color: category.color
  }));

  return (
    <Grid container spacing={4}>
      {/* Expense Categories */}
      <Grid item xs={12} md={8}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Customize Expense Categories</Typography>
          
          {!isPercentageValid && (
            <Alert severity="warning" className="mb-4">
              Total percentage is {totalPercentage.toFixed(1)}%. 
              It should be between 95% and 105% for realistic estimates.
            </Alert>
          )}
          
          <Grid container spacing={3}>
            {inputs.expenseCategories.map((category) => (
              <Grid item xs={12} key={category.id}>
                <Paper variant="outlined" className="p-3">
                  <Box className="flex items-center justify-between mb-3">
                    <Box className="flex items-center space-x-2">
                      <Box 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: category.color }}
                      />
                      <Typography variant="subtitle1" className="font-medium">
                        {category.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${category.basePercent}%`}
                        color={category.basePercent > 0 ? "primary" : "default"}
                      />
                    </Box>
                    <Typography variant="body2" className="text-gray-600">
                      ~{formatCurrency(getEstimatedAnnualAmount(category))}/year
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" className="mb-2">
                        Percentage of Total Costs: {category.basePercent}%
                      </Typography>
                      <Slider
                        value={category.basePercent}
                        onChange={(_e, value) => updateExpenseCategory(category.id, 'basePercent', value as number)}
                        min={0}
                        max={30}
                        step={0.5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 15, label: '15%' },
                          { value: 30, label: '30%' }
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Custom Annual Amount"
                        type="number"
                        value={category.customBaseAmount || ''}
                        onChange={(e) => updateExpenseCategory(category.id, 'customBaseAmount', 
                          e.target.value ? Number(e.target.value) : undefined)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="Override percentage calculation"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={category.applyInflation}
                            onChange={(e) => updateExpenseCategory(category.id, 'applyInflation', e.target.checked)}
                          />
                        }
                        label="Inflation"
                        labelPlacement="top"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Typography variant="subtitle2" className="font-medium mb-2">
              Total Budget Allocation: {totalPercentage.toFixed(1)}%
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              The remaining {(100 - totalPercentage).toFixed(1)}% covers housing, education, 
              and miscellaneous expenses not included in these categories.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      {/* Visualization */}
      <Grid item xs={12} md={4}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Cost Distribution</Typography>
          
          {/* Pie Chart */}
          <Box className="mb-6">
            <Typography variant="subtitle2" className="mb-2">Category Breakdown</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={0}
                  paddingAngle={2}
                  dataKey="percentage"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          {/* Bar Chart */}
          <Box>
            <Typography variant="subtitle2" className="mb-2">Estimated Annual Amounts</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={80} fontSize={10} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#8884d8">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          
          <Box className="mt-4 p-3 bg-gray-50 rounded">
            <Typography variant="body2" className="text-gray-600">
              <strong>Note:</strong> These are baseline estimates that will be adjusted 
              for your child's age, location cost of living, and inflation over time.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      {/* Additional Settings */}
      <Grid item xs={12}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Financial Planning Settings</Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Investment Return Rate ({inputs.household.investmentReturn}%)
              </Typography>
              <Slider
                value={inputs.household.investmentReturn}
                onChange={(_e, value) => onInputChange('household', {
                  ...inputs.household,
                  investmentReturn: value as number
                })}
                min={3}
                max={12}
                step={0.25}
                marks={[
                  { value: 3, label: '3%' },
                  { value: 7, label: '7%' },
                  { value: 12, label: '12%' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
              <Typography variant="body2" className="text-gray-600 mt-1">
                Expected annual return on college savings investments
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Household Savings Rate ({inputs.household.savingsRate}%)
              </Typography>
              <Slider
                value={inputs.household.savingsRate}
                onChange={(_e, value) => onInputChange('household', {
                  ...inputs.household,
                  savingsRate: value as number
                })}
                min={0}
                max={30}
                step={1}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 15, label: '15%' },
                  { value: 30, label: '30%' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
              />
              <Typography variant="body2" className="text-gray-600 mt-1">
                Percentage of income available for child-related savings
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box className="p-3 bg-green-50 rounded">
                <Typography variant="subtitle2" className="text-green-800 mb-1">
                  Monthly Savings Capacity
                </Typography>
                <Typography variant="h6" className="text-green-700">
                  {formatCurrency((inputs.household.income * inputs.household.savingsRate / 100) / 12)}
                </Typography>
                <Typography variant="body2" className="text-green-600">
                  Available for child costs and education savings
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CostAdjustmentsTab; 