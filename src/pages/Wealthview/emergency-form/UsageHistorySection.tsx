// src/components/EmergencyFunds/UsageHistory/UsageHistorySection.tsx
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
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import UsageHistoryItem from './UsageHistoryItem';
import { EmergencyFundUsage } from '../../../types';

interface UsageHistorySectionProps {
  hasUsedEmergencyFunds: boolean;
  usageHistory: EmergencyFundUsage[];
  handleBooleanChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateUsageHistory: (id: string, updatedUsage: EmergencyFundUsage) => void;
  removeUsageHistory: (id: string) => void;
  addUsageHistory: () => void;
}

const UsageHistorySection: React.FC<UsageHistorySectionProps> = ({
  hasUsedEmergencyFunds,
  usageHistory,
  handleBooleanChange,
  updateUsageHistory,
  removeUsageHistory,
  addUsageHistory
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="usage-history-content"
        id="usage-history-header"
      >
        <Typography variant="h5">Emergency Fund Usage History</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={0} sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>Have you needed to use your emergency fund in the past?</Typography>
                <RadioGroup
                  row
                  name="hasUsedEmergencyFunds"
                  value={hasUsedEmergencyFunds.toString()}
                  onChange={handleBooleanChange}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            {hasUsedEmergencyFunds && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Please provide details about your emergency fund usage:
                  </Typography>
                  {usageHistory.map((usage) => (
                    <UsageHistoryItem
                      key={usage.id}
                      usage={usage}
                      onChange={(updatedUsage) => updateUsageHistory(usage.id, updatedUsage)}
                      onDelete={() => removeUsageHistory(usage.id)}
                    />
                  ))}
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={addUsageHistory}
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add Usage History
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default UsageHistorySection;