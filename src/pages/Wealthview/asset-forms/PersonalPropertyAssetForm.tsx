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
import { PersonalPropertyAsset, personalPropertyAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface PersonalPropertyAssetFormProps {
  onAdd: (asset: PersonalPropertyAsset) => void;
  generateId: () => string;
}

const PersonalPropertyAssetForm: React.FC<PersonalPropertyAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<PersonalPropertyAsset>({
    id: generateId(),
    type: 'vehicle',
    name: '',
    institution: '',
    description: '',
    currentValue: 0,
    notes: ''
  });

  // Handle TextField input changes
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAsset({
      ...newAsset,
      [name]: ['currentValue', 'purchasePrice', 'insuredValue'].includes(name) 
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
    if (!newAsset.name || !newAsset.description || newAsset.currentValue <= 0) return;
    
    onAdd(newAsset);
    
    setNewAsset({
      id: generateId(),
      type: 'vehicle',
      name: '',
      institution: '',
      description: '',
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Personal Property Asset</Typography>
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
              {personalPropertyAssetTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Item Name"
            name="name"
            value={newAsset.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Car, Watch Collection"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Description"
            name="description"
            value={newAsset.description}
            onChange={handleTextFieldChange}
            placeholder="e.g., 2021 Tesla Model 3, Rolex Submariner"
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
            label="Purchase Price"
            type="number"
            name="purchasePrice"
            value={newAsset.purchasePrice || ''}
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
            label="Insured Value"
            type="number"
            name="insuredValue"
            value={newAsset.insuredValue || ''}
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
            placeholder="Any additional details about the item"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAsset}
            disabled={!newAsset.name || !newAsset.description || newAsset.currentValue <= 0}
          >
            Add Personal Property
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalPropertyAssetForm;