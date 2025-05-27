// src/components/EmergencyFunds/SafetyNets/SafetyNetItem.tsx
import React from 'react';
import { 
  Typography, 
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { SafetyNet } from '../../../types';

interface SafetyNetItemProps {
  safetyNet: SafetyNet;
  options: string[];
  onChange: (updatedSafetyNet: SafetyNet) => void;
  onDelete: () => void;
}

const SafetyNetItem: React.FC<SafetyNetItemProps> = ({ 
  safetyNet, 
  options, 
  onChange, 
  onDelete 
}) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onChange({
      ...safetyNet,
      [name]: name === "limit" || name === "available" ? Number(value) : value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    onChange({
      ...safetyNet,
      [name]: value
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={safetyNet.type}
              onChange={handleSelectChange}
              label="Type"
            >
              {options.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Details"
            name="details"
            value={safetyNet.details}
            onChange={handleTextChange}
            placeholder="e.g., Policy #, provider, coverage"
          />
        </Grid>
        {safetyNet.type.toLowerCase().includes("credit") && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Credit Limit"
                type="number"
                name="limit"
                value={safetyNet.limit || ''}
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
                label="Available Credit"
                type="number"
                name="available"
                value={safetyNet.available || ''}
                onChange={handleTextChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={onDelete}
            startIcon={<DeleteIcon />}
          >
            Remove
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SafetyNetItem;