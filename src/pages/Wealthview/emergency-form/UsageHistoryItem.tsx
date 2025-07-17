// src/components/EmergencyFunds/UsageHistory/UsageHistoryItem.tsx
import React from 'react';
import { 
  Typography, 
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { EmergencyFundUsage } from '../../../types';

interface UsageHistoryItemProps {
  usage: EmergencyFundUsage;
  onChange: (updatedUsage: EmergencyFundUsage) => void;
  onDelete: () => void;
}

const UsageHistoryItem: React.FC<UsageHistoryItemProps> = ({ usage, onChange, onDelete }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange({
      ...usage,
      [name]: name === "amount" || name === "replenishmentTime" ? Number(value) : value
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date (YYYY-MM)"
            name="date"
            value={usage.date}
            onChange={handleTextChange}
            placeholder="2023-05"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Amount Used"
            type="number"
            name="amount"
            value={usage.amount}
            onChange={handleTextChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Purpose"
            name="purpose"
            value={usage.purpose}
            onChange={handleTextChange}
            placeholder="e.g., Car repair, Medical emergency"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Time to Replenish (months)"
            type="number"
            name="replenishmentTime"
            value={usage.replenishmentTime}
            onChange={handleTextChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Remove Entry
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsageHistoryItem;