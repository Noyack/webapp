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
import { InvestmentAsset, investmentAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface InvestmentAssetFormProps {
  onAdd: (asset: InvestmentAsset) => void;
  generateId: () => string;
}

const InvestmentAssetForm: React.FC<InvestmentAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<InvestmentAsset>({
    id: generateId(),
    type: 'stock',
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
      [name]: ['currentValue', 'shares', 'purchasePrice', 'expenseRatio', 'yield'].includes(name) 
        ? Number(value) 
        : value
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
    if (!newAsset.name || newAsset.currentValue <= 0) return;
    
    onAdd(newAsset);
    
    setNewAsset({
      id: generateId(),
      type: 'stock',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Investment Asset</Typography>
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
              {investmentAssetTypes.map(option => (
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
            placeholder="e.g., Apple Stock, Vanguard Total Market"
          />
        </Grid>
        {(newAsset.type === 'stock' || 
          newAsset.type === 'etf' || 
          newAsset.type === 'reit') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ticker Symbol"
              name="ticker"
              value={newAsset.ticker || ''}
              onChange={handleTextFieldChange}
              placeholder="e.g., AAPL, VTI"
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Institution/Brokerage"
            name="institution"
            value={newAsset.institution}
            onChange={handleTextFieldChange}
            placeholder="e.g., Fidelity, Schwab"
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
        {(newAsset.type === 'stock' || 
          newAsset.type === 'mutualFund' || 
          newAsset.type === 'etf' || 
          newAsset.type === 'reit' ||
          newAsset.type === 'crypto') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Shares/Units"
              type="number"
              name="shares"
              value={newAsset.shares || ''}
              onChange={handleTextFieldChange}
              InputProps={{ inputProps: { min: 0, step: 0.00000001 } }}
            />
          </Grid>
        )}
        {(newAsset.type === 'stock' || 
          newAsset.type === 'mutualFund' || 
          newAsset.type === 'etf' || 
          newAsset.type === 'reit' ||
          newAsset.type === 'crypto') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Purchase Price (per share/unit)"
              type="number"
              name="purchasePrice"
              value={newAsset.purchasePrice || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, step: 0.01 },
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Grid>
        )}
        {(newAsset.type === 'mutualFund' || 
          newAsset.type === 'etf') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expense Ratio"
              type="number"
              name="expenseRatio"
              value={newAsset.expenseRatio || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, step: 0.01, max: 10 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        )}
        {(newAsset.type === 'bond') && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Yield"
                type="number"
                name="yield"
                value={newAsset.yield || ''}
                onChange={handleTextFieldChange}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
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
          </>
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
            Add Investment Asset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvestmentAssetForm;