import { FC, useState, useEffect } from 'react';
import {
  Typography,
  Slider,
  TextField,
  FormControl,
  Grid,
  Box,
  Paper,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Autocomplete,
  Alert,
  FormHelperText
} from '@mui/material';
import { RentVsBuyInputs } from '../../../../types/rentVsBuy';
import { usStates } from '../../../../utils/locationData';
import { formatCurrency, validateInputs } from '../../../../utils/rentVsBuyCalculations';

interface BasicInputsTabProps {
  inputs: RentVsBuyInputs;
  onInputChange: <K extends keyof RentVsBuyInputs>(field: K, value: RentVsBuyInputs[K]) => void;
}

const BasicInputsTab: FC<BasicInputsTabProps> = ({ inputs, onInputChange }) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Validate inputs whenever they change
  useEffect(() => {
    const validation = validateInputs(inputs);
    setValidationErrors(validation.errors);
  }, [inputs]);
  
  const updateLocation = (field: keyof RentVsBuyInputs['location'], value: string | number) => {
    onInputChange('location', {
      ...inputs.location,
      [field]: value
    });
  };

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

  // Check if a specific field has errors
  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };

  return (
    <Box>
      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <Alert severity="warning" className="mb-4">
          <Typography variant="subtitle2" className="mb-2">Please review the following:</Typography>
          <ul className="pl-4">
            {validationErrors.slice(0, 3).map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
            {validationErrors.length > 3 && (
              <li className="text-sm">...and {validationErrors.length - 3} more issues</li>
            )}
          </ul>
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Location & Personal Details</Typography>
            
            <Box className="mb-4">
              <Autocomplete
                options={usStates}
                getOptionLabel={(option) => option.name}
                value={usStates.find(state => state.code === inputs.location.state) || null}
                onChange={(_event, newValue) => {
                  updateLocation('state', newValue?.code || '');
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="State" 
                    variant="outlined" 
                    margin="normal"
                    fullWidth
                    helperText="Select your state for accurate tax rates and costs"
                  />
                )}
              />
              
              {/* Show location impact when state is selected */}
              {inputs.location.state && (
                <Box className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <Typography variant="subtitle2" className="text-blue-700 mb-2">
                    📍 Location Impact for {usStates.find(s => s.code === inputs.location.state)?.name}
                  </Typography>
                  <Box className="space-y-1 text-sm">
                    <Box className="flex justify-between">
                      <Typography variant="body2">Property Tax Rate:</Typography>
                      <Typography variant="body2" className="font-semibold">
                        {inputs.location.propertyTaxRate?.toFixed(2) || '1.1'}%
                      </Typography>
                    </Box>
                    <Box className="flex justify-between">
                      <Typography variant="body2">Home Insurance Rate:</Typography>
                      <Typography variant="body2" className="font-semibold">
                        {inputs.homeInsuranceRate?.toFixed(2) || '0.5'}%
                      </Typography>
                    </Box>
                    <Box className="flex justify-between">
                      <Typography variant="body2">Monthly Impact (on $400k home):</Typography>
                      <Typography variant="body2" className="font-semibold text-blue-600">
                        {formatCurrency(
                          (400000 * ((inputs.location.propertyTaxRate || 1.1) / 100) / 12) +
                          (400000 * (inputs.homeInsuranceRate / 100) / 12) -
                          (400000 * (1.1 / 100) / 12) - 
                          (400000 * (0.5 / 100) / 12)
                        )} vs national avg
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box className="mb-4">
              <TextField
                label="City"
                value={inputs.location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
                helperText="Optional: for future local market data integration"
              />
            </Box>
            
            <Box className="mb-4">
              <FormControl component="fieldset">
                <Typography variant="subtitle1" className="mb-2">Marital Status</Typography>
                <RadioGroup
                  row
                  value={inputs.maritalStatus}
                  onChange={(e) => onInputChange('maritalStatus', e.target.value as 'single' | 'married')}
                >
                  <FormControlLabel value="single" control={<Radio color="primary" />} label="Single" />
                  <FormControlLabel value="married" control={<Radio color="primary" />} label="Married Filing Jointly" />
                </RadioGroup>
                <FormHelperText>Affects tax benefit calculations</FormHelperText>
              </FormControl>
            </Box>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Annual Household Income
              </Typography>
              <TextField
                value={getDisplayValue(inputs.annualIncome)}
                onChange={(e) => handleNumberInputChange(e.target.value, 'annualIncome')}
                type="number"
                variant="outlined"
                fullWidth
                error={hasFieldError('income')}
                helperText={getFieldError('income') || "Used for affordability and tax calculations"}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 10000000,
                  step: 1000
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">Rent vs. Buy Basics</Typography>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Monthly Rent
              </Typography>
              <TextField
                value={getDisplayValue(inputs.monthlyRent)}
                onChange={(e) => handleNumberInputChange(e.target.value, 'monthlyRent')}
                type="number"
                variant="outlined"
                fullWidth
                error={hasFieldError('rent')}
                helperText={getFieldError('rent') || "Current or target monthly rent"}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 50000,
                  step: 50
                }}
              />
            </Box>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Target Home Price
              </Typography>
              <TextField
                value={getDisplayValue(inputs.homePrice)}
                onChange={(e) => handleNumberInputChange(e.target.value, 'homePrice')}
                type="number"
                variant="outlined"
                fullWidth
                error={hasFieldError('home price')}
                helperText={getFieldError('home price') || "Target purchase price"}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 50000000,
                  step: 5000
                }}
              />
            </Box>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Down Payment ({inputs.downPaymentPercent}%)
              </Typography>
              <Slider
                value={inputs.downPaymentPercent}
                onChange={(_e, value) => onInputChange('downPaymentPercent', value as number)}
                aria-labelledby="down-payment-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 3, label: '3%' },
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' },
                  { value: 20, label: '20%' },
                  { value: 30, label: '30%' }
                ]}
                min={3}
                max={50}
              />
              <Box className="flex justify-between items-center mt-2">
                <Typography variant="body2" className="text-gray-600">
                  Down Payment Amount: {inputs.homePrice > 0 ? formatCurrency(inputs.homePrice * (inputs.downPaymentPercent / 100)) : '$0'}
                </Typography>
                {inputs.downPaymentPercent < 20 && inputs.downPaymentPercent > 0 && (
                  <Typography variant="body2" className="text-yellow-600 font-semibold">
                    PMI Required
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                How long do you plan to stay? ({inputs.timeHorizon} {inputs.timeHorizon === 1 ? 'year' : 'years'})
              </Typography>
              <Slider
                value={inputs.timeHorizon}
                onChange={(_e, value) => onInputChange('timeHorizon', value as number)}
                aria-labelledby="time-horizon-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 1, label: '1y' },
                  { value: 5, label: '5y' },
                  { value: 10, label: '10y' },
                  { value: 20, label: '20y' },
                  { value: 35, label: '35y' }
                ]}
                min={1}
                max={35}
              />
              <Typography variant="body2" className="text-gray-600 mt-2">
                {inputs.timeHorizon < 5 && inputs.timeHorizon > 0 && "Short-term: Renting often more cost-effective"}
                {inputs.timeHorizon >= 5 && inputs.timeHorizon < 10 && "Medium-term: Consider transaction costs"}
                {inputs.timeHorizon >= 10 && "Long-term: Buying typically builds more wealth"}
                {inputs.timeHorizon === 0 && "Please select your time horizon"}
              </Typography>
            </Box>

            {/* Quick affordability check */}
            {inputs.monthlyRent > 0 && inputs.annualIncome > 0 && (
              <Box className="p-3 bg-gray-50 rounded">
                <Typography variant="subtitle2" className="mb-2">Affordability Quick Check</Typography>
                <Box className="space-y-1">
                  <Box className="flex justify-between">
                    <Typography variant="body2">Rent to Income Ratio:</Typography>
                    <Typography variant="body2" className={`font-semibold ${
                      (inputs.monthlyRent / (inputs.annualIncome / 12)) * 100 > 30 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {((inputs.monthlyRent / (inputs.annualIncome / 12)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-gray-600 text-sm">
                    Recommended: ≤30% for rent, ≤35% for total housing
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInputsTab;