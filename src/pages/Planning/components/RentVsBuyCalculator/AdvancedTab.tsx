import { FC } from 'react';
import {
  Typography,
  Slider,
  Grid,
  Box,
  Paper
} from '@mui/material';
import { RentVsBuyInputs } from '../../../../types/rentVsBuy';

interface AdvancedTabProps {
  inputs: RentVsBuyInputs;
  onInputChange: <K extends keyof RentVsBuyInputs>(field: K, value: RentVsBuyInputs[K]) => void;
}

const AdvancedTab: FC<AdvancedTabProps> = ({ inputs, onInputChange }) => {
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Economic Assumptions</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Annual Inflation Rate ({inputs.annualInflation}%)
            </Typography>
            <Slider
              value={inputs.annualInflation}
              onChange={(_e, value) => onInputChange('annualInflation', value as number)}
              aria-labelledby="inflation-slider"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0}
              max={6}
            />
            <Typography variant="body2" className="text-gray-600">
              Historical average: 2-3% annually. Affects rent, maintenance, and other costs over time.
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Expected Annual Return on Savings/Investments ({inputs.annualReturnOnSavings}%)
            </Typography>
            <Slider
              value={inputs.annualReturnOnSavings}
              onChange={(_e, value) => onInputChange('annualReturnOnSavings', value as number)}
              aria-labelledby="savings-return-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={1}
              max={12}
            />
            <Typography variant="body2" className="text-gray-600">
              Conservative: 3-5%, Moderate: 6-8%, Aggressive: 9-12%. 
              This affects the opportunity cost of your down payment and monthly savings.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">About These Settings</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom className="text-blue-700">
              Why These Matter
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Inflation:</strong> Reduces the purchasing power of money over time. 
              Your future rent payments will be worth less in today's dollars, and maintenance costs will increase.
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Investment Returns:</strong> The opportunity cost of your down payment. 
              Money not spent on a down payment could be invested and earn returns.
            </Typography>
          </Box>

          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom className="text-green-700">
              Inflation Applied To:
            </Typography>
            <Typography variant="body2" className="mb-2">
              ✅ Rent increases (compounds with base rent increase)
            </Typography>
            <Typography variant="body2" className="mb-2">
              ✅ Maintenance costs
            </Typography>
            <Typography variant="body2" className="mb-2">
              ✅ Additional monthly expenses
            </Typography>
            <Typography variant="body2" className="mb-3 text-gray-600">
              ❌ Renter's insurance (stays flat)
            </Typography>
            <Typography variant="body2" className="mb-3 text-gray-600">
              ❌ Home insurance, HOA fees, transaction costs
            </Typography>
          </Box>
          
          <Box className="p-3 bg-blue-50 rounded">
            <Typography variant="body2" className="text-blue-800">
              <strong>Conservative Approach:</strong> Use lower investment returns (3-5%) 
              and higher inflation (3-4%) for more pessimistic scenarios.
            </Typography>
          </Box>
          
          <Box className="mt-3 p-3 bg-green-50 rounded">
            <Typography variant="body2" className="text-green-800">
              <strong>Optimistic Approach:</strong> Use higher investment returns (8-10%) 
              and lower inflation (2%) for more favorable scenarios.
            </Typography>
          </Box>
          
          <Box className="mt-4">
            <Typography variant="body2" className="text-gray-600">
              <strong>Tip:</strong> Try running the calculator with different scenarios 
              to see how sensitive your decision is to these assumptions.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdvancedTab;