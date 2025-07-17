import { FC } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { RetirementInputs } from '../../../../types/retirement';
import { usStates } from '../../../../utils/locationData';

interface LocationTabProps {
  inputs: RetirementInputs;
  onInputChange: <K extends keyof RetirementInputs>(field: K, value: RetirementInputs[K]) => void;
  availableCities: string[];
  costOfLivingIndex: number;
}

const LocationTab: FC<LocationTabProps> = ({ 
  inputs, 
  onInputChange, 
  availableCities, 
  costOfLivingIndex 
}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon className="mr-2" color="primary" />
            Location Information
          </Typography>
          
          <Box className="mb-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel>State</InputLabel>
              <Select
                value={inputs.state || ''}
                onChange={(e) => onInputChange('state', e.target.value as string)}
                label="State"
              >
                {usStates.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box className="mb-4">
            <Autocomplete
              value={inputs.city || ''}
              onChange={(_event, newValue) => {
                onInputChange('city', newValue || '');
              }}
              options={availableCities}
              renderInput={(params) => (
                <TextField {...params} label="City" variant="outlined" />
              )}
              freeSolo
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Estimated Tax Rate: {inputs.estimatedTaxRate}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This includes federal, state, and local taxes based on your location and income.
            </Typography>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon className="mr-2" color="primary" />
            Cost of Living Analysis
          </Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Cost of Living Index
            </Typography>
            <Box className="flex items-center">
              <Typography variant="h4" color="primary" className="mr-2">
                {costOfLivingIndex}
              </Typography>
              <Box>
                <Typography variant="body2">
                  {costOfLivingIndex > 100 ? 'Above' : costOfLivingIndex < 100 ? 'Below' : 'Equal to'} national average
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  (100 = National Average)
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle2" gutterBottom>
              Impact on Retirement Planning:
            </Typography>
            {costOfLivingIndex > 110 && (
              <Chip 
                label="High Cost Area - Consider higher savings target" 
                color="warning" 
                size="small" 
                className="mb-2 mr-2" 
              />
            )}
            {costOfLivingIndex < 90 && (
              <Chip 
                label="Lower Cost Area - Your savings may go further" 
                color="success" 
                size="small" 
                className="mb-2 mr-2" 
              />
            )}
            <Typography variant="body2" color="textSecondary">
              Your retirement calculations are automatically adjusted for local cost of living.
            </Typography>
          </Box>
          
          <Box className="p-3 bg-blue-50 rounded">
            <Typography variant="subtitle2" gutterBottom>
              Location Considerations:
            </Typography>
            <ul className="list-disc pl-5 text-sm">
              <li>Housing costs vary significantly by location</li>
              <li>State taxes can impact retirement income</li>
              <li>Healthcare costs may differ regionally</li>
              <li>Consider future moves in retirement planning</li>
            </ul>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LocationTab; 