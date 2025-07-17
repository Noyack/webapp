import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Info as InfoIcon, Savings as SavingsIcon } from '@mui/icons-material';
import { UserState, TaxAdvantaged } from '../../../../types';

interface TaxAdvantagedStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const TaxAdvantagedStep: React.FC<TaxAdvantagedStepProps> = ({ userData, updateUserData }) => {
  
  // Update a tax-advantaged account contribution
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateTaxAdvantaged = (type: string, field: keyof TaxAdvantaged, value: any) => {
    updateUserData({
      ...userData,
      taxAdvantaged: {
        ...userData.taxAdvantaged,
        [type]: {
          ...userData.taxAdvantaged[type],
          [field]: value
        }
      }
    });
  };

  // Calculate total annual contributions
  const totalAnnualContributions = Object.values(userData.taxAdvantaged).reduce(
    (sum, account) => sum + account.contribution, 0
  );

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Tax-Advantaged Accounts</Typography>
      <Typography variant="body2" className="mb-4">
        These accounts offer tax benefits that can help reduce your overall tax burden.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} className="mb-2">
          <Typography variant="subtitle1">Retirement Accounts</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual 401(k) Contribution"
            type="number"
            value={userData.taxAdvantaged['401k'].contribution}
            onChange={(e) => updateTaxAdvantaged('401k', 'contribution', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`2023 Maximum: ${userData.taxAdvantaged['401k'].maxContribution.toLocaleString()}`}>
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Traditional IRA Contribution"
            type="number"
            value={userData.taxAdvantaged['ira-traditional'].contribution}
            onChange={(e) => updateTaxAdvantaged('ira-traditional', 'contribution', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`2023 Maximum: ${userData.taxAdvantaged['ira-traditional'].maxContribution.toLocaleString()}`}>
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Roth IRA Contribution"
            type="number"
            value={userData.taxAdvantaged['ira-roth'].contribution}
            onChange={(e) => updateTaxAdvantaged('ira-roth', 'contribution', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`2023 Maximum: ${userData.taxAdvantaged['ira-roth'].maxContribution.toLocaleString()}`}>
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual HSA Contribution"
            type="number"
            value={userData.taxAdvantaged['hsa'].contribution}
            onChange={(e) => updateTaxAdvantaged('hsa', 'contribution', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`2023 Maximum (Individual): ${userData.taxAdvantaged['hsa'].maxContribution.toLocaleString()}`}>
                    <InfoIcon fontSize="small" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} className="mt-2">
          <Typography variant="subtitle1">Education Accounts</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual 529 Plan Contribution"
            type="number"
            value={userData.taxAdvantaged['529'].contribution}
            onChange={(e) => updateTaxAdvantaged('529', 'contribution', parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
      
      <Box className="mt-6 p-4 bg-blue-50 rounded">
        <Typography variant="subtitle2" className="flex items-center">
          <SavingsIcon fontSize="small" className="mr-1" />
          Total Annual Contributions: ${totalAnnualContributions.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default TaxAdvantagedStep;