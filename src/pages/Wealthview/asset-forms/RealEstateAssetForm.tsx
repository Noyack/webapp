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
import { RealEstateAsset, realEstateAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface RealEstateAssetFormProps {
  onAdd: (asset: RealEstateAsset) => void;
  generateId: () => string;
}

const RealEstateAssetForm: React.FC<RealEstateAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<RealEstateAsset>({
    id: generateId(),
    type: 'primaryResidence',
    name: '',
    institution: '',
    address: '',
    purchasePrice: 0,
    currentValue: 0,
    notes: ''
  });

  // Handle TextField input changes
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAsset({
      ...newAsset,
      [name]: ['currentValue', 'purchasePrice', 'remainingMortgage', 'rentalIncome', 'propertyTaxes', 'insuranceCost'].includes(name) 
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
    if (!newAsset.name || !newAsset.address || newAsset.currentValue <= 0) return;
    
    onAdd(newAsset);
    
    setNewAsset({
      id: generateId(),
      type: 'primaryResidence',
      name: '',
      institution: '',
      address: '',
      purchasePrice: 0,
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Real Estate Asset</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Property Type</InputLabel>
            <Select
              name="type"
              value={newAsset.type}
              onChange={handleSelectChange}
              label="Property Type *"
            >
              {realEstateAssetTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Property Name/Description"
            name="name"
            value={newAsset.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Primary Home, Beach Condo"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Property Address"
            name="address"
            value={newAsset.address}
            onChange={handleTextFieldChange}
            placeholder="Full address of property"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Purchase Price"
            type="number"
            name="purchasePrice"
            value={newAsset.purchasePrice}
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
            required
            label="Current Market Value"
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Remaining Mortgage"
            type="number"
            name="remainingMortgage"
            value={newAsset.remainingMortgage || ''}
            onChange={handleTextFieldChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>
        {(newAsset.type === 'investmentProperty') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Monthly Rental Income"
              type="number"
              name="rentalIncome"
              value={newAsset.rentalIncome || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0 },
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Property Taxes"
            type="number"
            name="propertyTaxes"
            value={newAsset.propertyTaxes || ''}
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
            label="Annual Insurance Cost"
            type="number"
            name="insuranceCost"
            value={newAsset.insuranceCost || ''}
            onChange={handleTextFieldChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={newAsset.notes}
            onChange={handleTextFieldChange}
            multiline
            rows={2}
            placeholder="Any additional details about the property"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAsset}
            disabled={!newAsset.name || !newAsset.address || newAsset.currentValue <= 0}
          >
            Add Real Estate Asset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealEstateAssetForm;