import { FC } from 'react';
import {
  Typography,
  Slider,
  TextField,
  Grid,
  Box,
  Paper,
  InputAdornment
} from '@mui/material';
import { RentVsBuyInputs } from '../../../../types/rentVsBuy';
import { formatCurrency } from '../../../../utils/rentVsBuyCalculations';

interface RentDetailsTabProps {
  inputs: RentVsBuyInputs;
  onInputChange: <K extends keyof RentVsBuyInputs>(field: K, value: RentVsBuyInputs[K]) => void;
}

const RentDetailsTab: FC<RentDetailsTabProps> = ({ inputs, onInputChange }) => {
  
  // Helper function to handle number input with leading zero removal
  const handleNumberInputChange = (value: string, field: keyof RentVsBuyInputs) => {
    // Remove leading zeros but keep single 0 or empty string
    let cleanValue = value.replace(/^0+/, '') || '0';
    if (cleanValue === '0' && value.length > 1) {
      cleanValue = '';
    }
    
    const numericValue = cleanValue === '' ? 0 : Number(cleanValue);
    onInputChange(field, numericValue);
  };

  // Display helper - show empty string if value is 0, otherwise show the value
  const getDisplayValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  // Calculate future rent costs (rent grows, insurance stays flat)
  const currentAnnualRent = inputs.monthlyRent * 12;
  const currentAnnualInsurance = inputs.monthlyRentersInsurance * 12;
  
  // Calculate rent after 5 years: $2000 * (1.03)^5 = $2318.55/month = $27,822/year
  const rentAfter5Years = inputs.monthlyRent > 0 && inputs.annualRentIncrease > 0 ? 
    inputs.monthlyRent * Math.pow(1 + inputs.annualRentIncrease / 100, 5) * 12 : 0;
  
  // Calculate rent after 10 years: $2000 * (1.03)^10 = $2687.94/month = $32,255/year  
  const rentAfter10Years = inputs.monthlyRent > 0 && inputs.annualRentIncrease > 0 ? 
    inputs.monthlyRent * Math.pow(1 + inputs.annualRentIncrease / 100, 10) * 12 : 0;
    
  // Total = rent growth + flat insurance ($360/year)
  const totalAfter5Years = rentAfter5Years + currentAnnualInsurance;
  const totalAfter10Years = rentAfter10Years + currentAnnualInsurance;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Rent Increases & Insurance</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Annual Rent Increase ({inputs.annualRentIncrease}%)
            </Typography>
            <Slider
              value={inputs.annualRentIncrease}
              onChange={(_e, value) => onInputChange('annualRentIncrease', value as number)}
              aria-labelledby="rent-increase-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
            />
            <Typography variant="body2" className="text-gray-600">
              Historical average: 2-4% annually
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Monthly Renter's Insurance
            </Typography>
            <TextField
              value={getDisplayValue(inputs.monthlyRentersInsurance)}
              onChange={(e) => handleNumberInputChange(e.target.value, 'monthlyRentersInsurance')}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{
                min: 0,
                step: 5
              }}
            />
            <Typography variant="body2" className="text-gray-600 mt-1">
              Typical range: $15-50/month
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Rent Projections</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Current Annual Rent Cost
            </Typography>
            <Typography variant="h6" className="text-blue-600">
              {currentAnnualRent > 0 ? formatCurrency(currentAnnualRent + currentAnnualInsurance) : '$0'}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Including renter's insurance
            </Typography>
          </Box>
          
          {inputs.monthlyRent > 0 && inputs.annualRentIncrease > 0 && (
            <>
              <Box className="mb-4">
                <Typography variant="subtitle1" gutterBottom>
                  Projected Annual Rent After 5 Years
                </Typography>
                <Typography variant="h6" className="text-orange-600">
                  {formatCurrency(totalAfter5Years)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  At {inputs.annualRentIncrease}% annual rent increase (insurance stays flat)
                </Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="subtitle1" gutterBottom>
                  Projected Annual Rent After 10 Years
                </Typography>
                <Typography variant="h6" className="text-red-600">
                  {formatCurrency(totalAfter10Years)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  At {inputs.annualRentIncrease}% annual rent increase (insurance stays flat)
                </Typography>
              </Box>
            </>
          )}
          
          <Box className="p-3 bg-yellow-50 rounded">
            <Typography variant="body2" className="text-yellow-800">
              <strong>Note:</strong> Rent increases over time, while renter's insurance stays flat. 
              Mortgage payments remain fixed, making this a key factor in the rent vs. buy analysis.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RentDetailsTab;