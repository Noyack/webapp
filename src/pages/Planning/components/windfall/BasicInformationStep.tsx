import React from 'react';
import { 
  Typography, 
  Slider, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Grid, 
  Box, 
  Paper, 
  InputAdornment,
} from '@mui/material';
import { StepProps } from '../../../../types';

const BasicInformationStep: React.FC<StepProps> = ({
  windfall,
  setWindfall,
  personalInfo,
  setPersonalInfo
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Windfall Details</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Windfall Amount</Typography>
            <TextField
              value={windfall.amount}
              onChange={(e) => setWindfall({...windfall, amount: Number(e.target.value)})}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Source of Windfall</Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={windfall.source}
                onChange={(e) => setWindfall({...windfall, source: e.target.value as string})}
              >
                <MenuItem value="inheritance">Inheritance</MenuItem>
                <MenuItem value="bonus">Work Bonus</MenuItem>
                <MenuItem value="gift">Gift</MenuItem>
                <MenuItem value="lottery">Lottery/Gambling</MenuItem>
                <MenuItem value="settlement">Legal Settlement</MenuItem>
                <MenuItem value="businessSale">Business Sale</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box className="mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={windfall.taxable}
                  onChange={(e) => setWindfall({...windfall, taxable: e.target.checked})}
                />
              }
              label="This windfall is subject to taxes"
            />
            {windfall.taxable && (
              <Typography variant="body2" color="textSecondary">
                Consider consulting a tax professional to understand the tax implications.
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Your Age</Typography>
            <Slider
              value={personalInfo.age}
              onChange={(_e, value) => setPersonalInfo({...personalInfo, age: value as number})}
              aria-labelledby="age-slider"
              valueLabelDisplay="auto"
              step={1}
              marks={[
                { value: 20, label: '20' },
                { value: 40, label: '40' },
                { value: 60, label: '60' },
                { value: 80, label: '80' }
              ]}
              min={18}
              max={85}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Federal Tax Bracket ({personalInfo.taxBracket}%)
            </Typography>
            <Slider
              value={personalInfo.taxBracket}
              onChange={(_e, value) => setPersonalInfo({...personalInfo, taxBracket: value as number})}
              aria-labelledby="tax-bracket-slider"
              valueLabelDisplay="auto"
              step={null}
              marks={[
                { value: 10, label: '10%' },
                { value: 12, label: '12%' },
                { value: 22, label: '22%' },
                { value: 24, label: '24%' },
                { value: 32, label: '32%' },
                { value: 35, label: '35%' },
                { value: 37, label: '37%' }
              ]}
              min={10}
              max={37}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Annual Income</Typography>
            <TextField
              value={personalInfo.income}
              onChange={(e) => setPersonalInfo({...personalInfo, income: Number(e.target.value)})}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Monthly Expenses</Typography>
            <TextField
              value={personalInfo.monthlyExpenses}
              onChange={(e) => setPersonalInfo({...personalInfo, monthlyExpenses: Number(e.target.value)})}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Investment Time Horizon</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={personalInfo.timeHorizon}
                onChange={(e) => setPersonalInfo({...personalInfo, timeHorizon: e.target.value})}
              >
                <FormControlLabel 
                  value="short" 
                  control={<Radio />} 
                  label="Short (0-5 years)" 
                />
                <FormControlLabel 
                  value="medium" 
                  control={<Radio />} 
                  label="Medium (5-10 years)" 
                />
                <FormControlLabel 
                  value="long" 
                  control={<Radio />} 
                  label="Long (10+ years)" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BasicInformationStep;