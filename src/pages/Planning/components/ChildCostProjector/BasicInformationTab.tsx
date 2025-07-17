import { FC } from 'react';
import {
  Typography,
  TextField,
  FormControl,
  Grid,
  Box,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Autocomplete,
  InputAdornment,
  Slider
} from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChildCostInputs } from '../../../../types/childCost';
import { usStates } from '../../../../utils/childCostLocationData';

interface BasicInformationTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const BasicInformationTab: FC<BasicInformationTabProps> = ({
  inputs,
  onInputChange
}) => {
  const handleCalculationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as 'current' | 'future';
    onInputChange('calculationType', newType);
  };

  const handleLocationChange = (newState: string, costOfLivingIndex: number) => {
    onInputChange('location', {
      state: newState,
      costOfLivingIndex
    });
  };

  const handleHouseholdChange = <K extends keyof ChildCostInputs['household']>(
    field: K, 
    value: ChildCostInputs['household'][K]
  ) => {
    onInputChange('household', {
      ...inputs.household,
      [field]: value
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Location & Household</Typography>
          
          <Box className="mb-4">
            <FormControl component="fieldset">
              <FormLabel component="legend">Calculation Type</FormLabel>
              <RadioGroup
                row
                value={inputs.calculationType}
                onChange={handleCalculationTypeChange}
              >
                <FormControlLabel value="current" control={<Radio />} label="Current Child" />
                <FormControlLabel value="future" control={<Radio />} label="Future Child" />
              </RadioGroup>
            </FormControl>
          </Box>
          
          {inputs.calculationType === 'future' && (
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Expected Birth Year
              </Typography>
              <TextField
                value={inputs.birthYear}
                onChange={(e) => onInputChange('birthYear', Number(e.target.value))}
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{ 
                  inputProps: { 
                    min: new Date().getFullYear(), 
                    max: new Date().getFullYear() + 10 
                  } 
                }}
              />
              <Typography variant="body2" className="text-gray-600 mt-1">
                Year when you expect your child to be born
              </Typography>
            </Box>
          )}
          
          <Box className="mb-4">
            <Autocomplete
              options={usStates}
              getOptionLabel={(option) => option.name}
              value={usStates.find(state => state.code === inputs.location.state) || null}
              onChange={(_event, newValue) => {
                if (newValue) {
                  handleLocationChange(newValue.code, newValue.costOfLivingIndex);
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="State" 
                  variant="outlined" 
                  margin="normal"
                  fullWidth
                />
              )}
            />
            <Typography variant="body2" className="text-gray-600">
              Cost of Living Index: {inputs.location.costOfLivingIndex} (US Average = 100)
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Annual Household Income
            </Typography>
            <TextField
              value={inputs.household.income}
              onChange={(e) => handleHouseholdChange('income', Number(e.target.value))}
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
              Number of Children in Household (including future plans)
            </Typography>
            <Slider
              value={inputs.household.additionalChildren + 1}
              onChange={(_e, value) => handleHouseholdChange('additionalChildren', (value as number) - 1)}
              aria-labelledby="children-count-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
            <Typography variant="body2" className="text-gray-600">
              {inputs.household.additionalChildren + 1} {(inputs.household.additionalChildren + 1) === 1 ? 'child' : 'children'} total
            </Typography>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Projected Annual Inflation Rate ({inputs.household.inflationRate}%)
            </Typography>
            <Slider
              value={inputs.household.inflationRate}
              onChange={(_e, value) => handleHouseholdChange('inflationRate', value as number)}
              aria-labelledby="inflation-slider"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={1.0}
              max={5.0}
            />
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Information About Child Costs</Typography>
          
          <Box className="mb-4">
            <Typography variant="body1">
              This calculator estimates the costs of raising children based on:
            </Typography>
            <ul className="list-disc pl-6 mt-2">
              <li>USDA data on child-rearing expenses</li>
              <li>Regional cost of living differences</li>
              <li>Age-specific expense patterns</li>
              <li>Education options and costs</li>
              <li>Special needs and extracurricular activities</li>
            </ul>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" className="mb-2">Cost Distribution By Category:</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={inputs.expenseCategories.map(cat => ({
                    name: cat.name,
                    value: cat.basePercent
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={0}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {inputs.expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="body2" className="text-gray-600">
              💡 <strong>Tip:</strong> Costs vary significantly by age group. 
              Childcare is highest for infants and toddlers, while food and 
              transportation costs peak during teenage years.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BasicInformationTab; 