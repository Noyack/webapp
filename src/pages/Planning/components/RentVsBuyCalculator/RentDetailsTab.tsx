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
  
  // Calculate future rent costs
  const currentAnnualRent = inputs.monthlyRent * 12;
  const rentAfter5Years = inputs.monthlyRent * Math.pow(1 + inputs.annualRentIncrease / 100, 5) * 12;
  const rentAfter10Years = inputs.monthlyRent * Math.pow(1 + inputs.annualRentIncrease / 100, 10) * 12;

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
              value={inputs.monthlyRentersInsurance}
              onChange={(e) => onInputChange('monthlyRentersInsurance', Number(e.target.value))}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
              {formatCurrency(currentAnnualRent + inputs.monthlyRentersInsurance * 12)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Including renter's insurance
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Projected Annual Rent After 5 Years
            </Typography>
            <Typography variant="h6" className="text-orange-600">
              {formatCurrency(rentAfter5Years + inputs.monthlyRentersInsurance * 12)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              At {inputs.annualRentIncrease}% annual increase
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Projected Annual Rent After 10 Years
            </Typography>
            <Typography variant="h6" className="text-red-600">
              {formatCurrency(rentAfter10Years + inputs.monthlyRentersInsurance * 12)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              At {inputs.annualRentIncrease}% annual increase
            </Typography>
          </Box>
          
          <Box className="p-3 bg-yellow-50 rounded">
            <Typography variant="body2" className="text-yellow-800">
              <strong>Note:</strong> Rent typically increases over time, while mortgage payments remain fixed. 
              This is a key factor in the rent vs. buy analysis.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RentDetailsTab; 