import { FC } from 'react';
import {
  Typography,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Box,
  Paper,
  InputAdornment,
  Alert
} from '@mui/material';
import { Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';
import { RentVsBuyInputs } from '../../../../types/rentVsBuy';
import { formatCurrency, calculateMonthlyMortgage, calculatePMI, formatPercent } from '../../../../utils/rentVsBuyCalculations';

interface HomeDetailsTabProps {
  inputs: RentVsBuyInputs;
  onInputChange: <K extends keyof RentVsBuyInputs>(field: K, value: RentVsBuyInputs[K]) => void;
}

const HomeDetailsTab: FC<HomeDetailsTabProps> = ({ inputs, onInputChange }) => {
  
  const monthlyMortgage = calculateMonthlyMortgage(
    inputs.homePrice,
    inputs.downPaymentPercent,
    inputs.interestRate,
    inputs.mortgageTerm
  );

  const pmiInfo = calculatePMI(inputs.homePrice, inputs.downPaymentPercent);
  const propertyTaxRate = inputs.location.propertyTaxRate || 1.1;
  const monthlyPropertyTax = (inputs.homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyInsurance = (inputs.homePrice * (inputs.homeInsuranceRate / 100)) / 12;
  
  const totalMonthlyPayment = monthlyMortgage + 
    monthlyPropertyTax + 
    monthlyInsurance + 
    pmiInfo.monthlyPMI + 
    inputs.monthlyHOAFees + 
    inputs.monthlyAdditionalExpenses;

  const monthlyIncome = inputs.annualIncome / 12;
  const housingRatio = (totalMonthlyPayment / monthlyIncome) * 100;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Mortgage Details</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Mortgage Term (Years)
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={inputs.mortgageTerm}
                onChange={(e) => onInputChange('mortgageTerm', Number(e.target.value))}
              >
                <MenuItem value={15}>15-year fixed</MenuItem>
                <MenuItem value={20}>20-year fixed</MenuItem>
                <MenuItem value={30}>30-year fixed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Interest Rate ({inputs.interestRate}%)
            </Typography>
            <Slider
              value={inputs.interestRate}
              onChange={(_e, value) => onInputChange('interestRate', value as number)}
              aria-labelledby="interest-rate-slider"
              valueLabelDisplay="auto"
              step={0.125}
              marks
              min={2.5}
              max={10}
            />
          </Box>
          
          {/* PMI Information */}
          {pmiInfo.pmiRequired && (
            <Box className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <Box className="flex items-start">
                <WarningIcon color="warning" className="mr-2 mt-1" fontSize="small" />
                <Box>
                  <Typography variant="subtitle2" className="text-yellow-700 mb-1">
                    PMI Required
                  </Typography>
                  <Typography variant="body2" className="text-yellow-600 mb-2">
                    Down payment is less than 20%. PMI will be required until loan balance reaches 78% of original home value.
                  </Typography>
                  <Typography variant="body2" className="font-semibold text-yellow-700">
                    Monthly PMI: {formatCurrency(pmiInfo.monthlyPMI)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Monthly Payment Breakdown */}
          <Box className="mb-4 p-4 bg-blue-50 rounded">
            <Typography variant="subtitle1" className="mb-3 text-blue-700">
              Total Monthly Payment Breakdown
            </Typography>
            
            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography variant="body2">Principal & Interest:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(monthlyMortgage)}
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2">Property Tax:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(monthlyPropertyTax)}
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2">Home Insurance:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(monthlyInsurance)}
                </Typography>
              </Box>
              
              {pmiInfo.pmiRequired && (
                <Box className="flex justify-between">
                  <Typography variant="body2">PMI:</Typography>
                  <Typography variant="body2" className="font-semibold text-yellow-600">
                    {formatCurrency(pmiInfo.monthlyPMI)}
                  </Typography>
                </Box>
              )}
              
              <Box className="flex justify-between">
                <Typography variant="body2">HOA Fees:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(inputs.monthlyHOAFees)}
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2">Additional Expenses:</Typography>
                <Typography variant="body2" className="font-semibold">
                  {formatCurrency(inputs.monthlyAdditionalExpenses)}
                </Typography>
              </Box>
              
              <hr className="border-blue-200" />
              
              <Box className="flex justify-between">
                <Typography variant="subtitle2" className="text-blue-700">Total Monthly:</Typography>
                <Typography variant="subtitle2" className="font-bold text-blue-700">
                  {formatCurrency(totalMonthlyPayment)}
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2">% of Income:</Typography>
                <Typography variant="body2" className={`font-semibold ${housingRatio > 35 ? 'text-red-600' : housingRatio > 28 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {formatPercent(housingRatio)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Affordability Alert */}
          {housingRatio > 35 && (
            <Alert severity="error" className="mb-4">
              Housing costs exceed 35% of income. Consider a lower price range or larger down payment.
            </Alert>
          )}
          
          {housingRatio > 28 && housingRatio <= 35 && (
            <Alert severity="warning" className="mb-4">
              Housing costs are {formatPercent(housingRatio)} of income. The recommended maximum is 28-35%.
            </Alert>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Home Expenses</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Homeowner's Insurance Rate ({inputs.homeInsuranceRate}% of home value annually)
            </Typography>
            <Slider
              value={inputs.homeInsuranceRate}
              onChange={(_e, value) => onInputChange('homeInsuranceRate', value as number)}
              aria-labelledby="insurance-rate-slider"
              valueLabelDisplay="auto"
              step={0.05}
              marks
              min={0.1}
              max={1.5}
            />
            <Typography variant="body2" className="text-gray-600">
              Annual Amount: {formatCurrency(inputs.homePrice * (inputs.homeInsuranceRate / 100))}
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Monthly HOA/Condo Fees
            </Typography>
            <TextField
              value={inputs.monthlyHOAFees}
              onChange={(e) => onInputChange('monthlyHOAFees', Number(e.target.value))}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Annual Maintenance ({inputs.annualMaintenancePercent}% of home value)
            </Typography>
            <Slider
              value={inputs.annualMaintenancePercent}
              onChange={(_e, value) => onInputChange('annualMaintenancePercent', value as number)}
              aria-labelledby="maintenance-slider"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0.5}
              max={3}
            />
            <Typography variant="body2" className="text-gray-600">
              Annual Amount: {formatCurrency(inputs.homePrice * (inputs.annualMaintenancePercent / 100))}
            </Typography>
            <Typography variant="body2" className="text-gray-500 text-sm mt-1">
              Monthly equivalent: {formatCurrency((inputs.homePrice * (inputs.annualMaintenancePercent / 100)) / 12)}
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Monthly Additional Expenses
            </Typography>
            <TextField
              value={inputs.monthlyAdditionalExpenses}
              onChange={(e) => onInputChange('monthlyAdditionalExpenses', Number(e.target.value))}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <Typography variant="body2" className="text-gray-600 mt-1">
              Extra utilities, yard care, etc.
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Annual Home Value Increase ({inputs.annualHomeValueIncrease}%)
            </Typography>
            <Slider
              value={inputs.annualHomeValueIncrease}
              onChange={(_e, value) => onInputChange('annualHomeValueIncrease', value as number)}
              aria-labelledby="home-appreciation-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
            />
            <Typography variant="body2" className="text-gray-600">
              Historical average: 3-4% annually
            </Typography>
          </Box>

          {/* Property Tax Info */}
          <Box className="p-3 bg-gray-50 rounded">
            <Box className="flex items-start">
              <InfoIcon color="info" className="mr-2 mt-1" fontSize="small" />
              <Box>
                <Typography variant="body2" className="font-semibold text-gray-700 mb-1">
                  Property Tax Rate: {formatPercent(propertyTaxRate)}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Based on {inputs.location.state || 'national average'}. 
                  Annual amount: {formatCurrency(inputs.homePrice * (propertyTaxRate / 100))}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomeDetailsTab; 