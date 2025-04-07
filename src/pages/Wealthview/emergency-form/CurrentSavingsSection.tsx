// src/components/EmergencyFunds/CurrentSavings/CurrentSavingsSection.tsx
import React from 'react';
import { 
  Typography, 
  Button,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import SavingsAccountForm from './SavingsAccountForm';
import { EmergencySavingsAccount } from '../../../types';
import { calculateTotalSavings, formatCurrency } from '../../../utils/emergencyFund';

interface CurrentSavingsSectionProps {
  savingsAccounts: EmergencySavingsAccount[];
  updateSavingsAccount: (id: string, updatedAccount: EmergencySavingsAccount) => void;
  removeSavingsAccount: (id: string) => void;
  addSavingsAccount: () => void;
}

const CurrentSavingsSection: React.FC<CurrentSavingsSectionProps> = ({
  savingsAccounts,
  updateSavingsAccount,
  removeSavingsAccount,
  addSavingsAccount
}) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="current-savings-content"
        id="current-savings-header"
      >
        <Typography variant="h5">Current Emergency Savings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={0} sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Where is your emergency fund kept?
                  <Tooltip title="Add each account where you keep your emergency savings">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                {savingsAccounts.map((account) => (
                  <SavingsAccountForm
                    key={account.id}
                    account={account}
                    onChange={(updatedAccount) => updateSavingsAccount(account.id, updatedAccount)}
                    onDelete={() => removeSavingsAccount(account.id)}
                  />
                ))}
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={addSavingsAccount}
                  startIcon={<AddIcon />}
                  sx={{ mt: 1 }}
                >
                  Add Emergency Savings Account
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Total Emergency Savings: {formatCurrency(calculateTotalSavings(savingsAccounts))}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default CurrentSavingsSection;