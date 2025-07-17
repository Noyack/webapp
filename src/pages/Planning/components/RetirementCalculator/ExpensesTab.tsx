import { FC } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import {
  MonetizationOn as MoneyIcon,
  Home as HomeIcon,
  MedicalServices as HealthcareIcon,
  LocalGroceryStore as ExpensesIcon,
  EmojiTransportation as TransportationIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { RetirementInputs, CHART_COLORS } from '../../../../types/retirement';
import { formatCurrency, getTotalMonthlyExpenses } from '../../../../utils/retirementCalculations';

interface ExpensesTabProps {
  inputs: RetirementInputs;
  onExpenseChange: (expenseType: keyof RetirementInputs['monthlyExpenses'], value: number) => void;
  onCalculate: () => void;
}

const ExpensesTab: FC<ExpensesTabProps> = ({ inputs, onExpenseChange, onCalculate }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Monthly Expenses</Typography>
          
          <Box className="flex items-center mb-4">
            <HomeIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Housing</Typography>
            <TextField
              value={inputs.monthlyExpenses.housing}
              onChange={(e) => onExpenseChange('housing', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <HealthcareIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Healthcare</Typography>
            <TextField
              value={inputs.monthlyExpenses.healthcare}
              onChange={(e) => onExpenseChange('healthcare', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <ExpensesIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Food</Typography>
            <TextField
              value={inputs.monthlyExpenses.food}
              onChange={(e) => onExpenseChange('food', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <TransportationIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Transportation</Typography>
            <TextField
              value={inputs.monthlyExpenses.transportation}
              onChange={(e) => onExpenseChange('transportation', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <MoneyIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Utilities</Typography>
            <TextField
              value={inputs.monthlyExpenses.utilities}
              onChange={(e) => onExpenseChange('utilities', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <TrendingUpIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Entertainment</Typography>
            <TextField
              value={inputs.monthlyExpenses.entertainment}
              onChange={(e) => onExpenseChange('entertainment', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="flex items-center mb-4">
            <SettingsIcon color="primary" className="mr-2" />
            <Typography variant="subtitle1" className="mr-4 w-32">Other</Typography>
            <TextField
              value={inputs.monthlyExpenses.other}
              onChange={(e) => onExpenseChange('other', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="p-3 bg-gray-100 rounded mt-6 flex justify-between">
            <Typography variant="subtitle1">Total Monthly Expenses:</Typography>
            <Typography variant="h6">{formatCurrency(getTotalMonthlyExpenses(inputs.monthlyExpenses))}</Typography>
          </Box>
          
          <Box className="p-3 bg-gray-100 rounded mt-2 flex justify-between">
            <Typography variant="subtitle1">Total Annual Expenses:</Typography>
            <Typography variant="h6">{formatCurrency(getTotalMonthlyExpenses(inputs.monthlyExpenses) * 12)}</Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={5}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Expense Profile</Typography>
          
          <Box className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(inputs.monthlyExpenses).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {
                    Object.entries(inputs.monthlyExpenses).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))
                  }
                </Pie>
                <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Box className="mb-4 p-3 bg-blue-50 rounded">
            <Typography variant="subtitle1" gutterBottom>
              How Expenses Change in Retirement
            </Typography>
            <Typography variant="body2" paragraph>
              Some expenses typically decrease in retirement:
            </Typography>
            <ul className="list-disc pl-5 mb-3">
              <li>Transportation costs (less commuting)</li>
              <li>Work-related expenses</li>
              <li>Mortgage payments (if paid off)</li>
            </ul>
            <Typography variant="body2" paragraph>
              While others often increase:
            </Typography>
            <ul className="list-disc pl-5">
              <li>Healthcare (increases by 50-100%)</li>
              <li>Travel and leisure</li>
              <li>Hobbies and entertainment</li>
            </ul>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onCalculate}
            fullWidth
            className="bg-[#2E7D32]"
          >
            Calculate Retirement Plan
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExpensesTab; 