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
import { RetirementAsset, retirementAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface RetirementAssetFormProps {
  onAdd: (asset: RetirementAsset) => void;
  generateId: () => string;
}

const RetirementAssetForm: React.FC<RetirementAssetFormProps> = ({ onAdd, generateId }) => {
  const [newAsset, setNewAsset] = useState<RetirementAsset>({
    id: generateId(),
    type: '401k',
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
      [name]: ['currentValue', 'contributionRate', 'employerMatch', 'estimatedMonthlyBenefit'].includes(name) 
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
      type: '401k',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Retirement Asset</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="type"
              value={newAsset.type}
              onChange={handleSelectChange}
              label="Account Type *"
            >
              {retirementAssetTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Account Name/Plan"
            name="name"
            value={newAsset.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Company 401(k), Personal IRA"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Institution/Provider"
            name="institution"
            value={newAsset.institution}
            onChange={handleTextFieldChange}
            placeholder="e.g., Fidelity, Vanguard"
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
        {(newAsset.type === '401k' || 
          newAsset.type === '403b' || 
          newAsset.type === 'traditionalIra' || 
          newAsset.type === 'rothIra' ||
          newAsset.type === 'sepIra' ||
          newAsset.type === 'simpleIra') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contribution Rate (% of income)"
              type="number"
              name="contributionRate"
              value={newAsset.contributionRate || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.1 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        )}
        {(newAsset.type === '401k' || 
          newAsset.type === '403b') && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Employer Match (% of contribution)"
              type="number"
              name="employerMatch"
              value={newAsset.employerMatch || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.1 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        )}
        {newAsset.type === 'pension' && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Monthly Benefit"
              type="number"
              name="estimatedMonthlyBenefit"
              value={newAsset.estimatedMonthlyBenefit || ''}
              onChange={handleTextFieldChange}
              InputProps={{ 
                inputProps: { min: 0 },
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Grid>
        )}
        {newAsset.type === 'annuity' && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Payout Terms"
              name="payoutTerms"
              value={newAsset.payoutTerms || ''}
              onChange={handleTextFieldChange}
              placeholder="e.g., $2,000/month for life, lump sum at 65"
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
            Add Retirement Asset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RetirementAssetForm;