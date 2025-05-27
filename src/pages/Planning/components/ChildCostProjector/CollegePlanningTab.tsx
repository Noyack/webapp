import { FC, useState } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  InputAdornment,
  Alert,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { ChildCostInputs } from '../../../../types/childCost';
import { formatCurrency, calculateCollegeFundProjection } from '../../../../utils/childCostCalculations';

interface CollegePlanningTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const CollegePlanningTab: FC<CollegePlanningTabProps> = ({
  inputs,
  onInputChange
}) => {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  const getSelectedChild = () => {
    return inputs.children.find(child => child.id === inputs.selectedChild);
  };

  const selectedChild = getSelectedChild();

  const projection = selectedChild && selectedChild.education.collegeType !== 'none'
    ? calculateCollegeFundProjection(selectedChild, inputs, currentSavings)
    : null;

  const calculateMonthlyWithContributions = (monthlyAmount: number) => {
    if (!selectedChild || selectedChild.education.collegeType === 'none') return null;
    
    const yearsUntilCollege = Math.max(0, 18 - selectedChild.currentAge);
    const monthsUntilCollege = yearsUntilCollege * 12;
    const monthlyReturn = inputs.household.investmentReturn / 100 / 12;
    
    // Future value of current savings
    const currentSavingsFV = currentSavings * Math.pow(1 + inputs.household.investmentReturn / 100, yearsUntilCollege);
    
    // Future value of monthly contributions
    let contributionsFV = 0;
    if (monthlyReturn > 0 && monthsUntilCollege > 0) {
      contributionsFV = monthlyAmount * (((Math.pow(1 + monthlyReturn, monthsUntilCollege) - 1) / monthlyReturn));
    } else {
      contributionsFV = monthlyAmount * monthsUntilCollege;
    }
    
    const totalProjected = currentSavingsFV + contributionsFV;
    const totalNeeded = projection?.totalCost || 0;
    
    return {
      totalProjected,
      totalNeeded,
      shortfall: Math.max(0, totalNeeded - totalProjected),
      surplus: Math.max(0, totalProjected - totalNeeded)
    };
  };

  const monthlyProjection = calculateMonthlyWithContributions(monthlyContribution);
  const fundingProgress = monthlyProjection ? (monthlyProjection.totalProjected / monthlyProjection.totalNeeded) * 100 : 0;

  const collegeSavingsTips = [
    {
      icon: <AccountBalanceIcon className="text-blue-600" />,
      title: "529 Education Savings Plan",
      description: "Tax-advantaged savings plan specifically for education expenses. Earnings grow tax-free and withdrawals for qualified expenses are tax-free."
    },
    {
      icon: <TrendingUpIcon className="text-green-600" />,
      title: "Start Early for Compound Growth",
      description: "The earlier you start, the more time your investments have to grow. Even small monthly contributions can add up significantly over time."
    },
    {
      icon: <MonetizationOnIcon className="text-purple-600" />,
      title: "Automatic Contributions",
      description: "Set up automatic monthly transfers to make saving consistent and effortless. Many plans offer age-based investment options that become more conservative as college approaches."
    },
    {
      icon: <AssessmentIcon className="text-orange-600" />,
      title: "Review and Adjust Regularly",
      description: "Review your savings progress annually and adjust contributions as your income changes or education costs are updated."
    }
  ];

  if (!selectedChild) {
    return (
      <Box className="text-center py-8">
        <SchoolIcon className="text-gray-400 mb-2" style={{ fontSize: 48 }} />
        <Typography variant="h6" className="text-gray-500 mb-2">
          No Child Selected
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Please select a child to view college planning options.
        </Typography>
      </Box>
    );
  }

  if (selectedChild.education.collegeType === 'none') {
    return (
      <Box className="text-center py-8">
        <SchoolIcon className="text-gray-400 mb-2" style={{ fontSize: 48 }} />
        <Typography variant="h6" className="text-gray-500 mb-2">
          No College Plans
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          {selectedChild.name} is not planning to attend college. Update their education plans in the Child Details tab to enable college planning.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {/* College Fund Calculator */}
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">College Fund Calculator</Typography>
          
          <Box className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Typography variant="subtitle2" className="text-blue-800 mb-1">
              Planning for: {selectedChild.name}
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              {selectedChild.education.collegeType} college • {selectedChild.education.collegeYears} years
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              College starts in {Math.max(0, 18 - selectedChild.currentAge)} years
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Current College Savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Amount currently saved in 529 plans, savings accounts, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Monthly Contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Amount you plan to save each month"
              />
            </Grid>
          </Grid>
          
          {projection && (
            <Box className="mt-4 space-y-3">
              <Box className="p-3 bg-gray-50 rounded">
                <Typography variant="subtitle2" className="mb-2">Projected College Cost (inflation-adjusted)</Typography>
                <Typography variant="h5" className="text-red-600 font-bold">
                  {formatCurrency(projection.totalCost)}
                </Typography>
              </Box>
              
              {monthlyProjection && (
                <>
                  <Box className="p-3 bg-green-50 rounded">
                    <Typography variant="subtitle2" className="mb-2">Projected Savings at College Start</Typography>
                    <Typography variant="h5" className="text-green-600 font-bold">
                      {formatCurrency(monthlyProjection.totalProjected)}
                    </Typography>
                  </Box>
                  
                  <Box className="p-3 bg-yellow-50 rounded">
                    <Typography variant="subtitle2" className="mb-2">Funding Progress</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, fundingProgress)} 
                      className="mb-2 h-3 rounded"
                      color={fundingProgress >= 100 ? "success" : fundingProgress >= 75 ? "primary" : "warning"}
                    />
                    <Typography variant="body2" className="text-gray-600">
                      {fundingProgress.toFixed(1)}% of estimated cost covered
                    </Typography>
                  </Box>
                  
                  {monthlyProjection.shortfall > 0 ? (
                    <Alert severity="warning">
                      <Typography variant="subtitle2" className="font-medium">
                        Funding Shortfall: {formatCurrency(monthlyProjection.shortfall)}
                      </Typography>
                      <Typography variant="body2">
                        Consider increasing monthly contributions by {formatCurrency((projection.monthlyRequired - monthlyContribution))} 
                        to fully fund college costs.
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert severity="success">
                      <Typography variant="subtitle2" className="font-medium">
                        Fully Funded! Surplus: {formatCurrency(monthlyProjection.surplus)}
                      </Typography>
                      <Typography variant="body2">
                        Your current savings plan will cover all projected college costs.
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </Box>
          )}
        </Paper>
      </Grid>
      
      {/* Recommendations & Insights */}
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Recommendations & Insights</Typography>
          
          {projection && (
            <Box className="mb-4">
              <Card variant="outlined" className="mb-3">
                <CardContent>
                  <Box className="flex items-center space-x-2 mb-2">
                    <MonetizationOnIcon className="text-green-600" />
                    <Typography variant="subtitle2" className="font-medium">
                      Recommended Monthly Savings
                    </Typography>
                  </Box>
                  <Typography variant="h4" className="text-green-700 font-bold">
                    {formatCurrency(projection.monthlyRequired)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    To fully fund {selectedChild.education.collegeType} college costs
                  </Typography>
                </CardContent>
              </Card>
              
              <Box className="grid grid-cols-2 gap-3 mb-4">
                <Box className="p-3 bg-blue-50 rounded text-center">
                  <Typography variant="subtitle2" className="text-blue-800 mb-1">
                    Years to Save
                  </Typography>
                  <Typography variant="h6" className="text-blue-700">
                    {Math.max(0, 18 - selectedChild.currentAge)}
                  </Typography>
                </Box>
                
                <Box className="p-3 bg-purple-50 rounded text-center">
                  <Typography variant="subtitle2" className="text-purple-800 mb-1">
                    Investment Return
                  </Typography>
                  <Typography variant="h6" className="text-purple-700">
                    {inputs.household.investmentReturn}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          <Box>
            <Typography variant="subtitle1" className="mb-3 font-medium">
              College Savings Tips
            </Typography>
            
            <List className="space-y-2">
              {collegeSavingsTips.map((tip, index) => (
                <ListItem key={index} className="bg-gray-50 rounded p-3" alignItems="flex-start">
                  <ListItemIcon className="mt-1">
                    {tip.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" className="font-medium mb-1">
                        {tip.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" className="text-gray-600">
                        {tip.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Grid>
      
      {/* Action Plan */}
      <Grid item xs={12}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Your College Savings Action Plan</Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box className="text-center p-4 border-2 border-dashed border-blue-300 rounded-lg">
                <CheckCircleIcon className="text-blue-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Step 1: Open a 529 Plan
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-3">
                  Research and open a 529 education savings plan in your state or another state with good investment options and low fees.
                </Typography>
                <Button variant="outlined" size="small" color="primary">
                  Research 529 Plans
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box className="text-center p-4 border-2 border-dashed border-green-300 rounded-lg">
                <TrendingUpIcon className="text-green-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Step 2: Set Up Auto-Investing
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-3">
                  Automate your monthly contributions to make saving effortless and consistent.
                </Typography>
                <Typography variant="body2" className="font-bold text-green-700">
                  Target: {projection ? formatCurrency(projection.monthlyRequired) : '$0'}/month
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box className="text-center p-4 border-2 border-dashed border-orange-300 rounded-lg">
                <AssessmentIcon className="text-orange-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Step 3: Review Annually
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-3">
                  Review your progress each year and adjust contributions as needed based on changing circumstances.
                </Typography>
                <Button variant="outlined" size="small" color="primary">
                  Set Reminder
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {projection && projection.monthlyRequired > (inputs.household.income * inputs.household.savingsRate / 100 / 12) && (
            <Alert severity="warning" className="mt-4">
              <Box className="flex items-center space-x-2">
                <WarningIcon />
                <Typography variant="subtitle2" className="font-medium">
                  High Savings Requirement
                </Typography>
              </Box>
              <Typography variant="body2" className="mt-1">
                The recommended monthly savings ({formatCurrency(projection.monthlyRequired)}) exceeds your 
                available savings capacity ({formatCurrency((inputs.household.income * inputs.household.savingsRate / 100) / 12)}). 
                Consider increasing your savings rate, looking into lower-cost education options, or exploring 
                scholarships and financial aid opportunities.
              </Typography>
            </Alert>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CollegePlanningTab; 