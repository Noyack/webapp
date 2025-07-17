import React from 'react';
import { 
  Typography, 
  Slider, 
  Select, 
  MenuItem, 
  FormControl, 
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Grid, 
  Box, 
  Paper, 
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';
import { StepProps } from '../../../../types';
import { RISK_PROFILES, INVESTMENT_VEHICLES } from '../../../../constants/constant';

const InvestmentPreferencesStep: React.FC<StepProps> = ({
  investmentPrefs,
  setInvestmentPrefs
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Risk Tolerance & Asset Allocation</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Risk Tolerance</Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={investmentPrefs.riskTolerance}
                onChange={(e) => setInvestmentPrefs({
                  ...investmentPrefs, 
                  riskTolerance: e.target.value as string
                })}
              >
                {RISK_PROFILES.map(profile => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {investmentPrefs.riskTolerance === 'conservative' && (
              <Alert severity="info" className="mt-2">
                Conservative profiles prioritize capital preservation with lower returns.
              </Alert>
            )}
            
            {investmentPrefs.riskTolerance === 'moderate' && (
              <Alert severity="info" className="mt-2">
                Moderate profiles balance growth and stability.
              </Alert>
            )}
            
            {investmentPrefs.riskTolerance === 'aggressive' && (
              <Alert severity="info" className="mt-2">
                Aggressive profiles prioritize growth with higher volatility.
              </Alert>
            )}
          </Box>
          
          {investmentPrefs.riskTolerance === 'custom' && (
            <Box className="mb-4">
              <Typography variant="subtitle1" gutterBottom>Custom Asset Allocation</Typography>
              
              <Box className="mb-3">
                <Typography variant="body2" gutterBottom>
                  Stocks: {investmentPrefs.customAllocation.stocks}%
                </Typography>
                <Slider
                  value={investmentPrefs.customAllocation.stocks}
                  onChange={(_e, value) => {
                    const newStocks = value as number;
                    const remainder = 100 - newStocks;
                    
                    // Distribute remainder proportionally to bonds and cash
                    const totalOther = investmentPrefs.customAllocation.bonds + 
                                       investmentPrefs.customAllocation.cash +
                                       investmentPrefs.customAllocation.alternatives;
                    
                    const newBonds = totalOther > 0 
                      ? Math.round(remainder * (investmentPrefs.customAllocation.bonds / totalOther))
                      : Math.round(remainder * 0.75);
                    
                    const newCash = totalOther > 0
                      ? Math.round(remainder * (investmentPrefs.customAllocation.cash / totalOther))
                      : Math.round(remainder * 0.25);
                    
                    const newAlternatives = remainder - newBonds - newCash;
                    
                    setInvestmentPrefs({
                      ...investmentPrefs,
                      customAllocation: {
                          stocks: newStocks,
                          bonds: newBonds,
                          cash: newCash,
                          alternatives: newAlternatives,
                          realEstate: 0,
                          other: 0
                      }
                    });
                  }}
                  aria-labelledby="stocks-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                  min={0}
                  max={100}
                />
              </Box>
              
              <Box className="mb-3">
                <Typography variant="body2" gutterBottom>
                  Bonds: {investmentPrefs.customAllocation.bonds}%
                </Typography>
                <Slider
                  value={investmentPrefs.customAllocation.bonds}
                  onChange={(_e, value) => {
                    const newBonds = value as number;
                    const remainder = 100 - investmentPrefs.customAllocation.stocks - newBonds;
                    
                    // Distribute remainder between cash and alternatives
                    const totalOther = investmentPrefs.customAllocation.cash +
                                       investmentPrefs.customAllocation.alternatives;
                    
                    const newCash = totalOther > 0
                      ? Math.round(remainder * (investmentPrefs.customAllocation.cash / totalOther))
                      : Math.round(remainder);
                    
                    const newAlternatives = remainder - newCash;
                    
                    setInvestmentPrefs({
                      ...investmentPrefs,
                      customAllocation: {
                        ...investmentPrefs.customAllocation,
                        bonds: newBonds,
                        cash: newCash,
                        alternatives: newAlternatives
                      }
                    });
                  }}
                  aria-labelledby="bonds-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                  min={0}
                  max={100 - investmentPrefs.customAllocation.stocks}
                />
              </Box>
              
              <Box className="mb-3">
                <Typography variant="body2" gutterBottom>
                  Cash: {investmentPrefs.customAllocation.cash}%
                </Typography>
                <Slider
                  value={investmentPrefs.customAllocation.cash}
                  onChange={(_e, value) => {
                    const newCash = value as number;
                    const newAlternatives = 100 - 
                                          investmentPrefs.customAllocation.stocks - 
                                          investmentPrefs.customAllocation.bonds - 
                                          newCash;
                    
                    setInvestmentPrefs({
                      ...investmentPrefs,
                      customAllocation: {
                        ...investmentPrefs.customAllocation,
                        cash: newCash,
                        alternatives: newAlternatives
                      }
                    });
                  }}
                  aria-labelledby="cash-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                  min={0}
                  max={100 - investmentPrefs.customAllocation.stocks - investmentPrefs.customAllocation.bonds}
                />
              </Box>
              
              <Box className="mb-3">
                <Typography variant="body2" gutterBottom>
                  Alternative Investments: {investmentPrefs.customAllocation.alternatives}%
                </Typography>
              </Box>
              
              <Alert severity="info" className="mt-2">
                Total allocation: {
                  investmentPrefs.customAllocation.stocks +
                  investmentPrefs.customAllocation.bonds +
                  investmentPrefs.customAllocation.cash +
                  investmentPrefs.customAllocation.alternatives
                }% (must equal 100%)
              </Alert>
            </Box>
          )}
          
          <Box className="mt-4">
            <Typography variant="subtitle1" gutterBottom>Asset Allocation Preview</Typography>
            <Box height={200}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      investmentPrefs.riskTolerance === 'custom'
                        ? [
                            { name: 'Stocks', value: investmentPrefs.customAllocation.stocks },
                            { name: 'Bonds', value: investmentPrefs.customAllocation.bonds },
                            { name: 'Cash', value: investmentPrefs.customAllocation.cash },
                            { name: 'Alternatives', value: investmentPrefs.customAllocation.alternatives }
                          ]
                        : [
                            { 
                              name: 'Stocks', 
                              value: RISK_PROFILES.find(p => p.id === investmentPrefs.riskTolerance)?.stockAllocation || 0 
                            },
                            { 
                              name: 'Bonds', 
                              value: RISK_PROFILES.find(p => p.id === investmentPrefs.riskTolerance)?.bondAllocation || 0 
                            },
                            { 
                              name: 'Cash', 
                              value: RISK_PROFILES.find(p => p.id === investmentPrefs.riskTolerance)?.cashAllocation || 0 
                            }
                          ]
                    }
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="stocks" fill="#0088FE" />
                    <Cell key="bonds" fill="#00C49F" />
                    <Cell key="cash" fill="#FFBB28" />
                    <Cell key="alternatives" fill="#FF8042" />
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" gutterBottom>Investment Preferences</Typography>
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Preferred Investment Vehicles</Typography>
            <Typography variant="body2" className="mb-2">
              Select all that you are interested in using:
            </Typography>
            
            {INVESTMENT_VEHICLES.map(vehicle => (
              <FormControlLabel
                key={vehicle.id}
                control={
                  <Checkbox
                    checked={investmentPrefs.preferredVehicles.includes(vehicle.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setInvestmentPrefs({
                          ...investmentPrefs,
                          preferredVehicles: [...investmentPrefs.preferredVehicles, vehicle.id]
                        });
                      } else {
                        setInvestmentPrefs({
                          ...investmentPrefs,
                          preferredVehicles: investmentPrefs.preferredVehicles.filter(v => v !== vehicle.id)
                        });
                      }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">
                      {vehicle.name} 
                      <Tooltip title={vehicle.description}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {vehicle.taxAdvantaged ? 'Tax-advantaged' : 'Taxable'} • Avg. Return: {vehicle.expectedReturn}%
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
          
          <hr className="my-4" />
          
          <Box className="mb-4">
            <Typography variant="subtitle1" gutterBottom>Investment Preferences</Typography>
            
            <Box className="mb-3">
              <Typography variant="body2" gutterBottom>Management Style</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={investmentPrefs.managementPreference}
                  onChange={(e) => setInvestmentPrefs({
                    ...investmentPrefs, 
                    managementPreference: e.target.value
                  })}
                >
                  <FormControlLabel 
                    value="passive" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Passive/Index</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Lower fees, market-matching returns
                        </Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="active" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Active Management</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Higher fees, potential to outperform
                        </Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="robo" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Robo-Advisor</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Automated management with moderate fees
                        </Typography>
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box className="mb-3">
              <Typography variant="subtitle1" gutterBottom>Fee Sensitivity</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={investmentPrefs.feeSensitivity}
                  onChange={(e) => setInvestmentPrefs({
                    ...investmentPrefs, 
                    feeSensitivity: e.target.value
                  })}
                >
                  <FormControlLabel 
                    value="high" 
                    control={<Radio />} 
                    label="High (minimize fees at all costs)" 
                  />
                  <FormControlLabel 
                    value="moderate" 
                    control={<Radio />} 
                    label="Moderate (balance fees and services)" 
                  />
                  <FormControlLabel 
                    value="low" 
                    control={<Radio />} 
                    label="Low (willing to pay for premium services)" 
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box className="mb-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={investmentPrefs.esgFocus}
                    onChange={(e) => setInvestmentPrefs({
                      ...investmentPrefs, 
                      esgFocus: e.target.checked
                    })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">ESG/Sustainable Investing Focus</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Prioritize environmental, social, and governance factors
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InvestmentPreferencesStep;