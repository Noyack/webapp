import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button,
  Box,
  Grid,
  InputAdornment
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { LiquidAsset, liquidAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface LiquidAssetFormProps {
  onAdd: (asset: LiquidAsset) => void;
  generateId: () => string;
}

const LiquidAssetForm: React.FC<LiquidAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<LiquidAsset>({
    id: generateId(),
    type: 'checking',
    name: '',
    institution: '',
    currentValue: 0,
    notes: ''
  });

  // Handle TextField input changes
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAsset({
      ...newAsset,
      [name]: name === 'currentValue' || name === 'interestRate' ? Number(value) : value
    });
  };

  // Handle Select input changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setNewAsset({
      ...newAsset,
      [name]: value
    });
  };

  // Add new asset
  const handleAddAsset = () => {
    // Basic validation
    if (!newAsset.name || newAsset.currentValue <= 0) return;
    
    // Call the onAdd function from props
    onAdd(newAsset);
    
    // Reset the form
    setNewAsset({
      id: generateId(),
      type: 'checking',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Liquid Asset</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Asset Type</InputLabel>
            <Select
              name="type"
              value={newAsset.type}
              onChange={handleSelectChange}
              label="Asset Type *"
            >
              {liquidAssetTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Name/Description"
            name="name"
            value={newAsset.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Emergency Fund, College Savings"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Institution"
            name="institution"
            value={newAsset.institution}
            onChange={handleTextFieldChange}
            placeholder="e.g., Chase Bank, Vanguard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Current Value"
            type="number"
            name="currentValue"
            value={newAsset.currentValue}
            onChange={handleTextFieldChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>
        {(newAsset.type === 'savings' || 
          newAsset.type === 'moneyMarket' || 
          newAsset.type === 'cd' || 
          newAsset.type === 'treasuryBill') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Interest Rate"
              type="number"
              name="interestRate"
              value={newAsset.interestRate || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        )}
        {(newAsset.type === 'cd' || newAsset.type === 'treasuryBill') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maturity Date"
              type="date"
              name="maturityDate"
              value={newAsset.maturityDate || ''}
              onChange={handleTextFieldChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={newAsset.notes}
            onChange={handleTextFieldChange}
            multiline
            rows={2}
            placeholder="Any additional details"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAsset}
            disabled={!newAsset.name || newAsset.currentValue <= 0}
          >
            Add Liquid Asset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiquidAssetForm;