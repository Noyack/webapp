import React from 'react';
import { 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  FormControl, 
  FormControlLabel,
  Checkbox,
  Grid, 
  Box, 
  Paper, 
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { StepProps } from '../../../../types';
import { FINANCIAL_GOALS, LARGE_PURCHASES } from '../../../../constants/constant';

const GoalsPrioritiesStep: React.FC<StepProps> = ({
  goals,
  setGoals
}) => {
  // Handle changing large purchase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePurchaseChange = (index: number, field: string, value: any) => {
    const updatedPurchases = [...goals.plannedLargePurchases];
    updatedPurchases[index] = {
      ...updatedPurchases[index],
      [field]: value
    };
    setGoals({
      ...goals,
      plannedLargePurchases: updatedPurchases
    });
  };

  // Add new large purchase
  const addLargePurchase = () => {
    const newPurchase = { type: 'vehicle', timeframe: 2, estimatedAmount: 0 };
    setGoals({
      ...goals,
      plannedLargePurchases: [...goals.plannedLargePurchases, newPurchase]
    });
  };

  // Remove large purchase
  const removeLargePurchase = (index: number) => {
    const updatedPurchases = goals.plannedLargePurchases.filter((_, i) => i !== index);
    setGoals({
      ...goals,
      plannedLargePurchases: updatedPurchases
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Financial Goals</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Primary Financial Goal</Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={goals.primaryGoal}
                onChange={(e) => setGoals({...goals, primaryGoal: e.target.value as string})}
              >
                {FINANCIAL_GOALS.map(goal => (
                  <MenuItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Additional Goals</Typography>
            
            {FINANCIAL_GOALS.map(goal => (
              <FormControlLabel
                key={goal.id}
                control={
                  <Checkbox
                    checked={goals.additionalGoals.includes(goal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGoals({
                          ...goals,
                          additionalGoals: [...goals.additionalGoals, goal.id]
                        });
                      } else {
                        setGoals({
                          ...goals,
                          additionalGoals: goals.additionalGoals.filter(g => g !== goal.id)
                        });
                      }
                    }}
                    disabled={goal.id === goals.primaryGoal}
                  />
                }
                label={goal.name}
              />
            ))}
          </Box>
        </Paper>
        
        <Paper elevation={2} className="p-4 mt-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">Planned Large Purchases</Typography>
            <Button 
              variant="outlined"
              onClick={addLargePurchase}
            >
              Add Purchase
            </Button>
          </Box>
          
          {goals.plannedLargePurchases.map((purchase, index) => (
            <Box key={index} className="mb-4 p-3 border rounded">
              <Box className="flex justify-between items-center mb-2">
                <FormControl variant="outlined" size="small" style={{minWidth: 200}}>
                  <Select
                    value={purchase.type}
                    onChange={(e) => handlePurchaseChange(index, 'type', e.target.value)}
                  >
                    {LARGE_PURCHASES.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button 
                  variant="text"
                  color="error"
                  size="small"
                  onClick={() => removeLargePurchase(index)}
                >
                  Remove
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Estimated Amount"
                    value={purchase.estimatedAmount}
                    onChange={(e) => handlePurchaseChange(index, 'estimatedAmount', Number(e.target.value))}
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" gutterBottom>Timeframe (years)</Typography>
                    <Slider
                      value={purchase.timeframe}
                      onChange={(_e, value) => handlePurchaseChange(index, 'timeframe', value as number)}
                      aria-labelledby="timeframe-slider"
                      valueLabelDisplay="auto"
                      step={0.5}
                      marks={[
                        { value: 1, label: '1' },
                        { value: 5, label: '5' },
                        { value: 10, label: '10' }
                      ]}
                      min={0.5}
                      max={10}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Financial Priorities</Typography>
          <Typography variant="body2" gutterBottom>
            Rank each financial priority on a scale from 1 (low priority) to 5 (high priority)
          </Typography>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>
              Debt Reduction {goals.priorities.debtReduction}/5
            </Typography>
            <Slider
              value={goals.priorities.debtReduction}
              onChange={(_e, value) => setGoals({
                ...goals, 
                priorities: {...goals.priorities, debtReduction: value as number}
              })}
              aria-labelledby="debt-priority-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>
              Emergency Fund {goals.priorities.emergencyFund}/5
            </Typography>
            <Slider
              value={goals.priorities.emergencyFund}
              onChange={(_e, value) => setGoals({
                ...goals, 
                priorities: {...goals.priorities, emergencyFund: value as number}
              })}
              aria-labelledby="emergency-priority-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>
              Retirement Savings {goals.priorities.retirement}/5
            </Typography>
            <Slider
              value={goals.priorities.retirement}
              onChange={(_e, value) => setGoals({
                ...goals, 
                priorities: {...goals.priorities, retirement: value as number}
              })}
              aria-labelledby="retirement-priority-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>
              Short-Term Savings {goals.priorities.shortTermSavings}/5
            </Typography>
            <Slider
              value={goals.priorities.shortTermSavings}
              onChange={(_e, value) => setGoals({
                ...goals, 
                priorities: {...goals.priorities, shortTermSavings: value as number}
              })}
              aria-labelledby="short-term-priority-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>
              Long-Term Growth {goals.priorities.longTermGrowth}/5
            </Typography>
            <Slider
              value={goals.priorities.longTermGrowth}
              onChange={(_e, value) => setGoals({
                ...goals, 
                priorities: {...goals.priorities, longTermGrowth: value as number}
              })}
              aria-labelledby="long-term-priority-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GoalsPrioritiesStep;