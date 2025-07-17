import { FC, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Slider,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  MonetizationOn as MoneyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { RetirementInputs } from '../../../../types/retirement';

interface BasicInfoTabProps {
  inputs: RetirementInputs;
  onInputChange: <K extends keyof RetirementInputs>(field: K, value: RetirementInputs[K]) => void;
}

const BasicInfoTab: FC<BasicInfoTabProps> = ({ inputs, onInputChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-7">
          <Typography variant="h6" className="mb-4" sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon className="mr-2" color="primary" />
            Personal Information
          </Typography>
          
          <Box className="mb-4">
            <Typography gutterBottom>Current Age: {inputs.currentAge}</Typography>
            <Slider
              value={inputs.currentAge}
              onChange={(_e, val) => onInputChange('currentAge', val as number)}
              min={18}
              max={80}
              marks={[
                { value: 18, label: '18' },
                { value: 50, label: '50' },
                { value: 80, label: '80' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box className="mb-4">
            <Typography gutterBottom>Retirement Age: {inputs.retirementAge}</Typography>
            <Slider
              value={inputs.retirementAge}
              onChange={(_e, val) => onInputChange('retirementAge', val as number)}
              min={Math.max(inputs.currentAge + 1, 50)}
              max={90}
              marks={[
                { value: 55, label: '55' },
                { value: 65, label: '65' },
                { value: 75, label: '75' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box className="mb-4">
            <Typography gutterBottom>Life Expectancy: {inputs.lifeExpectancy}</Typography>
            <Slider
              value={inputs.lifeExpectancy}
              onChange={(_e, val) => onInputChange('lifeExpectancy', val as number)}
              min={Math.max(inputs.retirementAge + 1, 70)}
              max={100}
              marks={[
                { value: 75, label: '75' },
                { value: 85, label: '85' },
                { value: 95, label: '95' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Current Annual Income
            </Typography>
            <TextField
              value={inputs.currentAnnualIncome}
              onChange={(e) => onInputChange('currentAnnualIncome', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography gutterBottom>
              Income Replacement Percentage: {inputs.desiredIncomeReplacement}%
            </Typography>
            <Tooltip title="The percentage of your current income you'll need in retirement">
              <Slider
                value={inputs.desiredIncomeReplacement}
                onChange={(_e, val) => onInputChange('desiredIncomeReplacement', val as number)}
                min={50}
                max={100}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
                valueLabelDisplay="auto"
              />
            </Tooltip>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-7">
          <Typography variant="h6" className="mb-4" sx={{ display: 'flex', alignItems: 'center' }}>
            <MoneyIcon className="mr-2" color="primary" />
            Savings & Investments
          </Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Current Retirement Savings
            </Typography>
            <TextField
              value={inputs.currentSavings}
              onChange={(e) => onInputChange('currentSavings', Number(e.target.value) || 0)}
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
              Monthly Contribution
            </Typography>
            <TextField
              value={inputs.monthlyContribution}
              onChange={(e) => onInputChange('monthlyContribution', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          <Box className="mb-4">
            <Typography gutterBottom>
              Expected Annual Return: {inputs.expectedAnnualReturn}%
            </Typography>
            <Slider
              value={inputs.expectedAnnualReturn}
              onChange={(_e, val) => onInputChange('expectedAnnualReturn', val as number)}
              min={1}
              max={12}
              step={0.5}
              marks={[
                { value: 4, label: '4%' },
                { value: 7, label: '7%' },
                { value: 10, label: '10%' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box className="mb-4">
            <Typography gutterBottom>
              Expected Inflation Rate: {inputs.expectedInflation}%
            </Typography>
            <Slider
              value={inputs.expectedInflation}
              onChange={(_e, val) => onInputChange('expectedInflation', val as number)}
              min={1}
              max={5}
              step={0.5}
              marks={[
                { value: 1.5, label: '1.5%' },
                { value: 2.5, label: '2.5%' },
                { value: 4, label: '4%' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Divider className="my-4" />
          
          <Box className="flex items-center justify-between mb-2">
            <Typography variant="h6">Additional Income</Typography>
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              color="primary"
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>
              Estimated Monthly Social Security
            </Typography>
            <TextField
              value={inputs.socialSecurityBenefits}
              onChange={(e) => onInputChange('socialSecurityBenefits', Number(e.target.value) || 0)}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
          
          {showAdvanced && (
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>
                Other Monthly Income (pension, etc.)
              </Typography>
              <TextField
                value={inputs.otherIncome}
                onChange={(e) => onInputChange('otherIncome', Number(e.target.value) || 0)}
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BasicInfoTab; 