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
import { BusinessAsset, businessAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface BusinessAssetFormProps {
  onAdd: (asset: BusinessAsset) => void;
  generateId: () => string;
}

const BusinessAssetForm: React.FC<BusinessAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<BusinessAsset>({
    id: generateId(),
    type: 'businessOwnership',
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
      [name]: ['currentValue', 'ownershipPercentage', 'annualRevenue', 'annualProfit'].includes(name) 
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
      type: 'businessOwnership',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Business Asset</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Business Asset Type</InputLabel>
            <Select
              name="type"
              value={newAsset.type}
              onChange={handleSelectChange}
              label="Business Asset Type *"
            >
              {businessAssetTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Business Name/Description"
            name="name"
            value={newAsset.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Smith Consulting LLC, Tech Startup"
          />
        </Grid>
        {(newAsset.type === 'businessOwnership' || 
          newAsset.type === 'partnership') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ownership Percentage"
              type="number"
              name="ownershipPercentage"
              value={newAsset.ownershipPercentage || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.01 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Current Estimated Value"
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
        {(newAsset.type === 'businessOwnership' || 
          newAsset.type === 'partnership') && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Revenue"
                type="number"
                name="annualRevenue"
                value={newAsset.annualRevenue || ''}
                onChange={handleTextFieldChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Profit"
                type="number"
                name="annualProfit"
                value={newAsset.annualProfit || ''}
                onChange={handleTextFieldChange}
                InputProps={{ 
                  inputProps: { min: -1000000000, step: 1000 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
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
            placeholder="Any additional details about the business asset"
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
            Add Business Asset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessAssetForm;