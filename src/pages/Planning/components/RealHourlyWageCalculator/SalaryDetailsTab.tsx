import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Alert,
  Chip
} from '@mui/material';
import { RealHourlyWageInputs } from '../../../../types/realHourlyWage';
import { formatCurrency } from '../../../../utils/realHourlyWageCalculations';

interface SalaryDetailsTabProps {
  inputs: RealHourlyWageInputs;
  onInputChange: <K extends keyof RealHourlyWageInputs>(field: K, value: RealHourlyWageInputs[K]) => void;
}

export default function SalaryDetailsTab({ inputs, onInputChange }: SalaryDetailsTabProps) {
  
  const handleSalaryTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const salaryType = event.target.value as 'salary' | 'hourly';
    onInputChange('salary', {
      ...inputs.salary,
      salaryType
    });
  };

  const handleSalaryAmountChange = (field: 'annualSalary' | 'hourlyRate') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('salary', {
      ...inputs.salary,
      [field]: value
    });
  };

  const handleScheduleChange = (field: keyof typeof inputs.schedule) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onInputChange('schedule', {
      ...inputs.schedule,
      [field]: value
    });
  };

  // Calculate some quick stats for display
  const annualSalary = inputs.salary.salaryType === 'salary' 
    ? inputs.salary.annualSalary
    : (inputs.salary.hourlyRate || 0) * inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear;

  const grossHourlyWage = inputs.schedule.hoursPerWeek > 0 && inputs.schedule.weeksPerYear > 0
    ? annualSalary / (inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Salary & Schedule Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your salary information and work schedule to calculate your base hourly wage
      </Typography>

      <Grid container spacing={3}>
        {/* Salary Information */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Salary Information
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Salary Type</FormLabel>
                <RadioGroup
                  value={inputs.salary.salaryType}
                  onChange={handleSalaryTypeChange}
                  row
                >
                  <FormControlLabel value="salary" control={<Radio />} label="Annual Salary" />
                  <FormControlLabel value="hourly" control={<Radio />} label="Hourly Rate" />
                </RadioGroup>
              </FormControl>

              {inputs.salary.salaryType === 'salary' ? (
                <TextField
                  fullWidth
                  label="Annual Salary"
                  type="number"
                  value={inputs.salary.annualSalary || ''}
                  onChange={handleSalaryAmountChange('annualSalary')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Hourly Rate"
                  type="number"
                  value={inputs.salary.hourlyRate || ''}
                  onChange={handleSalaryAmountChange('hourlyRate')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              {/* Quick calculation preview */}
              {annualSalary > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Quick Preview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Annual Salary:</Typography>
                      <Typography variant="h6">{formatCurrency(annualSalary)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Gross Hourly:</Typography>
                      <Typography variant="h6">{formatCurrency(grossHourlyWage)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Work Schedule */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Work Schedule
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hours per Week"
                    type="number"
                    value={inputs.schedule.hoursPerWeek || ''}
                    onChange={handleScheduleChange('hoursPerWeek')}
                    inputProps={{ min: 1, max: 80 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weeks per Year"
                    type="number"
                    value={inputs.schedule.weeksPerYear || ''}
                    onChange={handleScheduleChange('weeksPerYear')}
                    inputProps={{ min: 1, max: 52 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Overtime Hours/Week"
                    type="number"
                    value={inputs.schedule.overtimeHours || ''}
                    onChange={handleScheduleChange('overtimeHours')}
                    inputProps={{ min: 0 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Overtime Multiplier"
                    type="number"
                    value={inputs.schedule.overtimeMultiplier || ''}
                    onChange={handleScheduleChange('overtimeMultiplier')}
                    inputProps={{ min: 1, step: 0.1 }}
                    sx={{ mb: 2 }}
                    helperText="1.5 for time-and-a-half"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Unpaid Break Time (minutes/day)"
                    type="number"
                    value={inputs.schedule.unpaidBreaks || ''}
                    onChange={handleScheduleChange('unpaidBreaks')}
                    inputProps={{ min: 0 }}
                    helperText="Lunch breaks, unpaid time"
                  />
                </Grid>
              </Grid>

              {/* Schedule summary */}
              {inputs.schedule.hoursPerWeek > 0 && inputs.schedule.weeksPerYear > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="success.main">
                    Schedule Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip 
                      label={`${inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear} annual hours`} 
                      size="small" 
                      color="primary" 
                    />
                    <Chip 
                      label={`${52 - inputs.schedule.weeksPerYear} weeks off`} 
                      size="small" 
                      color="secondary" 
                    />
                    {inputs.schedule.overtimeHours > 0 && (
                      <Chip 
                        label={`${inputs.schedule.overtimeHours * inputs.schedule.weeksPerYear} OT hours`} 
                        size="small" 
                        color="warning" 
                      />
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Location Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📍 Location
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={inputs.location.state}
                    onChange={(e) => onInputChange('location', {
                      ...inputs.location,
                      state: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={inputs.location.city}
                    onChange={(e) => onInputChange('location', {
                      ...inputs.location,
                      city: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Cost of Living Index"
                    type="number"
                    value={inputs.location.costOfLivingIndex || ''}
                    onChange={(e) => onInputChange('location', {
                      ...inputs.location,
                      costOfLivingIndex: parseFloat(e.target.value) || 100
                    })}
                    helperText="100 = national average"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Helpful Information */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="subtitle2">💡 Tips for Accurate Calculations</Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Include all regular income sources in your salary</li>
              <li>Count actual working weeks (subtract vacation, sick days)</li>
              <li>Include mandatory unpaid breaks in your schedule</li>
              <li>Overtime rates are typically 1.5x for hours over 40/week</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
} 