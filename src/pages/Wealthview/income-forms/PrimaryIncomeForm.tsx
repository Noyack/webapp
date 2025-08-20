// components/income/PrimaryIncomeForm.tsx
import React from 'react';
import { 
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Grid,
  SelectChangeEvent
} from "@mui/material";

import { 
  PrimaryIncome,
  frequencyOptions,
  stabilityOptions,
  futureChangeOptions
} from './types';

interface PrimaryIncomeFormProps {
  primaryIncome: PrimaryIncome;
  onTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (event: SelectChangeEvent) => void;
  onSliderChange: (name: string) => (_event: Event, newValue: number | number[]) => void;
}

const PrimaryIncomeForm: React.FC<PrimaryIncomeFormProps> = ({
  primaryIncome,
  onTextChange,
  onSelectChange,
  onSliderChange
}) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>Primary Income</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Gross Salary/Income"
            type="number"
            name="salary"
            value={primaryIncome.salary===0?"":primaryIncome.salary}
            onChange={onTextChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
            helperText="Enter your total annual salary amount"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Payment Frequency</InputLabel>
            <Select
              name="paymentFrequency"
              value={primaryIncome.paymentFrequency}
              onChange={onSelectChange}
              label="Payment Frequency"
            >
              {frequencyOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Income Stability</InputLabel>
            <Select
              name="stabilityType"
              value={primaryIncome.stabilityType}
              onChange={onSelectChange}
              label="Income Stability"
            >
              {stabilityOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>Expected Annual Growth Rate (%)</Typography>
          <Slider
            value={primaryIncome.annualGrowthRate}
            onChange={onSliderChange('annualGrowthRate')}
            valueLabelDisplay="auto"
            step={0.5}
            marks={[
              { value: 0, label: '0%' },
              { value: 5, label: '5%' },
              { value: 10, label: '10%' }
            ]}
            min={0}
            max={10}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Future Income Changes</InputLabel>
            <Select
              name="futureChanges"
              value={primaryIncome.futureChanges}
              onChange={onSelectChange}
              label="Future Income Changes"
            >
              {futureChangeOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {primaryIncome.futureChanges !== "No anticipated changes" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Timeframe for Change (months)"
              type="number"
              name="futureChangeTimeframe"
              value={primaryIncome.futureChangeTimeframe}
              onChange={onTextChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bonus Structure (if applicable)"
            name="bonusStructure"
            value={primaryIncome.bonusStructure}
            onChange={onTextChange}
            placeholder="e.g., Annual performance bonus, quarterly commission"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Average Annual Bonus/Commission Amount"
            type="number"
            name="averageBonus"
            onChange={onTextChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PrimaryIncomeForm;