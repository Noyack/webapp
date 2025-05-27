// src/components/EmergencyFunds/FundCoverage/FundCoverageSection.tsx
import React from 'react';
import { 
  Typography, 
  TextField,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  FormHelperText
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  calculateCoverageMonths, 
  calculateEmergencyFundTarget, 
  calculateFundingGap, 
  formatCurrency 
} from '../../../utils/emergencyFund';

interface FundCoverageSectionProps {
  monthlyEssentialExpenses: number;
  targetCoverageMonths: number;
  totalSavings: number;
  handleTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string) => (event: Event, newValue: number | number[]) => void;
}

const FundCoverageSection: React.FC<FundCoverageSectionProps> = ({
  monthlyEssentialExpenses,
  targetCoverageMonths,
  totalSavings,
  handleTextFieldChange,
  handleSliderChange
}) => {
  // Calculate metrics
  const coverageMonths = calculateCoverageMonths(totalSavings, monthlyEssentialExpenses);
  const targetAmount = calculateEmergencyFundTarget(monthlyEssentialExpenses, targetCoverageMonths);
  const fundingGap = calculateFundingGap(targetAmount, totalSavings);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="fund-coverage-content"
        id="fund-coverage-header"
      >
        <Typography variant="h5">Emergency Fund Coverage</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={0} sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Essential Expenses"
                type="number"
                name="monthlyEssentialExpenses"
                value={monthlyEssentialExpenses}
                onChange={handleTextFieldChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                helperText="Include housing, utilities, food, insurance, and minimum debt payments"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Target Emergency Fund (months of expenses)</Typography>
              <Slider
                value={targetCoverageMonths}
                onChange={handleSliderChange('targetCoverageMonths')}
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 3, label: '3' },
                  { value: 6, label: '6' },
                  { value: 9, label: '9' },
                  { value: 12, label: '12' }
                ]}
                min={1}
                max={12}
              />
              <FormHelperText>
                Typically 3-6 months is recommended; 6-12 for variable income or specialized careers
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1">Current Coverage: {coverageMonths.toFixed(1)} months</Typography>
                <Typography variant="subtitle1">Target Amount: {formatCurrency(targetAmount)}</Typography>
                <Typography variant="subtitle1">
                  Funding Gap: {formatCurrency(fundingGap)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default FundCoverageSection;