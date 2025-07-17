import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  Divider,
  Chip,
  Slider
} from '@mui/material';
import { RealHourlyWageInputs } from '../../../../types/realHourlyWage';
import { calculateTotalTimeCommitment, formatHours } from '../../../../utils/realHourlyWageCalculations';

interface TimeCommitmentTabProps {
  inputs: RealHourlyWageInputs;
  onInputChange: <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => void;
}

export default function TimeCommitmentTab({ inputs, onInputChange }: TimeCommitmentTabProps) {
  
  // Handle commuting time changes
  const handleCommutingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expenses', {
      ...inputs.expenses,
      commuting: {
        ...inputs.expenses.commuting,
        dailyCommutingTime: value
      }
    });
  };

  // Handle preparation time changes
  const handleDailyPrepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expenses', {
      ...inputs.expenses,
      preparation: {
        ...inputs.expenses.preparation,
        dailyPrepTime: value
      }
    });
  };

  const handleWeeklyPrepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('expenses', {
      ...inputs.expenses,
      preparation: {
        ...inputs.expenses.preparation,
        weeklyPrepTime: value
      }
    });
  };

  // Handle unpaid breaks change
  const handleUnpaidBreaksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('schedule', {
      ...inputs.schedule,
      unpaidBreaks: value
    });
  };

  // Calculate time breakdowns
  const workDaysPerYear = (inputs.schedule.hoursPerWeek / 8) * inputs.schedule.weeksPerYear;
  const totalTimeCommitment = calculateTotalTimeCommitment(inputs.expenses, inputs.schedule);
  const paidWorkHours = inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear;
  const overtimeHours = inputs.schedule.overtimeHours * inputs.schedule.weeksPerYear;
  
  // Calculate individual time components (annual hours)
  const commutingHours = (inputs.expenses.commuting.dailyCommutingTime / 60) * workDaysPerYear;
  const unpaidBreakHours = (inputs.schedule.unpaidBreaks / 60) * workDaysPerYear;
  const dailyPrepHours = (inputs.expenses.preparation.dailyPrepTime / 60) * workDaysPerYear;
  const weeklyPrepHours = inputs.expenses.preparation.weeklyPrepTime * inputs.schedule.weeksPerYear;
  
  // Calculate percentages
  const unpaidTimePercentage = ((totalTimeCommitment - paidWorkHours - overtimeHours) / totalTimeCommitment) * 100;
  
  // Time efficiency calculation
  const timeEfficiency = (paidWorkHours / totalTimeCommitment) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Time Commitment Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Calculate all time spent related to your job beyond paid hours. This affects your real hourly wage.
      </Typography>

      <Grid container spacing={3}>
        {/* Commuting Time */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚗 Commuting Time
              </Typography>
              
              <TextField
                fullWidth
                label="Daily Commuting Time"
                type="number"
                value={inputs.expenses.commuting.dailyCommutingTime || ''}
                onChange={handleCommutingTimeChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                helperText="Round trip commute time per day"
                sx={{ mb: 3 }}
              />

              {/* Visual representation of commute time */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Commute Time Visualization (daily)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ width: '80px' }}>
                    0 min
                  </Typography>
                  <Slider
                    value={inputs.expenses.commuting.dailyCommutingTime}
                    max={240}
                    step={5}
                    disabled
                    sx={{ mx: 2, flex: 1 }}
                  />
                  <Typography variant="caption" sx={{ width: '80px', textAlign: 'right' }}>
                    240 min
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {inputs.expenses.commuting.dailyCommutingTime > 120 ? 
                    '⚠️ Long commute significantly impacts work-life balance' :
                    inputs.expenses.commuting.dailyCommutingTime > 60 ?
                    '⚡ Moderate commute time' :
                    '✅ Short commute time'
                  }
                </Typography>
              </Box>

              {/* Commuting impact summary */}
              {commutingHours > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="info.main">
                    Commuting Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Annual Hours:</Typography>
                      <Typography variant="h6">{formatHours(commutingHours)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Weekly Hours:</Typography>
                      <Typography variant="h6">{formatHours(commutingHours / inputs.schedule.weeksPerYear)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Preparation Time */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⏰ Preparation Time
              </Typography>
              
              <TextField
                fullWidth
                label="Daily Preparation Time"
                type="number"
                value={inputs.expenses.preparation.dailyPrepTime || ''}
                onChange={handleDailyPrepChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                helperText="Getting ready, reviewing work materials"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Weekly Preparation Time"
                type="number"
                value={inputs.expenses.preparation.weeklyPrepTime || ''}
                onChange={handleWeeklyPrepChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
                helperText="Weekend planning, meal prep for work"
                sx={{ mb: 2 }}
              />

              {/* Preparation impact summary */}
              {(dailyPrepHours + weeklyPrepHours) > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="warning.main">
                    Preparation Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Daily Prep:</Typography>
                      <Typography variant="h6">{formatHours(dailyPrepHours / workDaysPerYear)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Weekly Prep:</Typography>
                      <Typography variant="h6">{formatHours(inputs.expenses.preparation.weeklyPrepTime)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Unpaid Work Time */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🍽️ Unpaid Work Time
              </Typography>
              
              <TextField
                fullWidth
                label="Unpaid Breaks per Day"
                type="number"
                value={inputs.schedule.unpaidBreaks || ''}
                onChange={handleUnpaidBreaksChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                helperText="Lunch breaks, unpaid break time"
                sx={{ mb: 2 }}
              />

              {/* Break time impact */}
              {unpaidBreakHours > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="error.main">
                    Unpaid Time Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Annual Hours:</Typography>
                      <Typography variant="h6">{formatHours(unpaidBreakHours)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Daily Hours:</Typography>
                      <Typography variant="h6">{formatHours(inputs.schedule.unpaidBreaks / 60)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Time Efficiency Overview */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Time Efficiency
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Paid Time Efficiency: {timeEfficiency.toFixed(1)}%
                </Typography>
                <Slider
                  value={timeEfficiency}
                  max={100}
                  disabled
                  sx={{ mb: 1 }}
                  color={timeEfficiency > 70 ? 'success' : timeEfficiency > 50 ? 'warning' : 'error'}
                />
                <Typography variant="caption" color="text.secondary">
                  {timeEfficiency > 70 ? '✅ High efficiency' : 
                   timeEfficiency > 50 ? '⚡ Moderate efficiency' : 
                   '⚠️ Low efficiency - lots of unpaid time'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Paid Hours/Year:</Typography>
                  <Typography variant="h6">{formatHours(paidWorkHours)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Total Commitment:</Typography>
                  <Typography variant="h6">{formatHours(totalTimeCommitment)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Time Summary */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                ⏱️ Total Time Commitment Summary
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatHours(totalTimeCommitment)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Annual Hours
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {formatHours(totalTimeCommitment / inputs.schedule.weeksPerYear)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekly Hours
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {unpaidTimePercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unpaid Time
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3} textAlign="center">
                  <Typography variant="h5" color="text.primary">
                    {(totalTimeCommitment / 2080 * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    vs Standard Year
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`Paid Work: ${formatHours(paidWorkHours)}`} 
                  color="success" 
                  size="small" 
                />
                {overtimeHours > 0 && (
                  <Chip 
                    label={`Overtime: ${formatHours(overtimeHours)}`} 
                    color="warning" 
                    size="small" 
                  />
                )}
                <Chip 
                  label={`Commuting: ${formatHours(commutingHours)}`} 
                  color="info" 
                  size="small" 
                />
                <Chip 
                  label={`Preparation: ${formatHours(dailyPrepHours + weeklyPrepHours)}`} 
                  color="default" 
                  size="small" 
                />
                {unpaidBreakHours > 0 && (
                  <Chip 
                    label={`Unpaid Breaks: ${formatHours(unpaidBreakHours)}`} 
                    color="error" 
                    size="small" 
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Optimization Tips */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="subtitle2">💡 Time Optimization Tips</Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Consider remote work to eliminate commute time completely</li>
              <li>Prepare work clothes and meals in batches to reduce daily prep time</li>
              <li>Negotiate paid lunch breaks if currently unpaid</li>
              <li>Use commute time productively (audiobooks, podcasts, calls if passenger)</li>
              <li>Consider flexible hours to avoid rush hour traffic</li>
              <li>Look into carpooling or public transport to make commute time more useful</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 