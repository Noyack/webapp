import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { UserState } from '../../../../types';

interface InvestmentsStepProps {
  userData: UserState;
  updateUserData: (newData: UserState) => void;
}

const InvestmentsStep: React.FC<InvestmentsStepProps> = ({ userData, updateUserData }) => {
  
  // Toggle has investments
  const toggleHasInvestments = (value: boolean) => {
    updateUserData({
      ...userData,
      hasInvestments: value
    });
  };

  // Update investment values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInvestmentChange = (field: keyof UserState, value: any) => {
    updateUserData({
      ...userData,
      [field]: value
    });
  };

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Investment Information</Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={userData.hasInvestments}
            onChange={(e) => toggleHasInvestments(e.target.checked)}
          />
        }
        label="I have investments (stocks, crypto, etc.)"
        className="mb-4"
      />
      
      {userData.hasInvestments && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stocks/ETFs Value"
              type="number"
              value={userData.stocksValue}
              onChange={(e) => handleInvestmentChange('stocksValue', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cryptocurrency Value"
              type="number"
              value={userData.cryptoValue}
              onChange={(e) => handleInvestmentChange('cryptoValue', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Real Estate Investments Value"
              type="number"
              value={userData.realEstateValue}
              onChange={(e) => handleInvestmentChange('realEstateValue', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} className="mt-4">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Investment Tax Optimization Strategies</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" className="mb-2">Tax-Loss Harvesting</Typography>
                <Typography variant="body2" className="mb-3">
                  Strategically sell investments at a loss to offset capital gains taxes on profitable investments.
                  This can reduce your overall tax liability while maintaining your investment strategy.
                </Typography>
                
                <Typography variant="subtitle2" className="mb-2">Long-Term vs. Short-Term Capital Gains</Typography>
                <Typography variant="body2" className="mb-3">
                  Long-term capital gains (assets held for more than a year) are taxed at preferential rates (0%, 15%, or 20%),
                  while short-term gains are taxed as ordinary income.
                </Typography>
                
                <Typography variant="subtitle2" className="mb-2">Cryptocurrency Tax Considerations</Typography>
                <Typography variant="body2">
                  Cryptocurrency transactions are taxable events. Careful record-keeping of cost basis and
                  transaction dates is essential for accurate reporting and tax optimization.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default InvestmentsStep;