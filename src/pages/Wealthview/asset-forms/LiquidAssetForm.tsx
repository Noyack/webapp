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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LiquidAsset, liquidAssetTypes } from '../../../types';
import { SelectChangeEvent } from '@mui/material';

interface LiquidAssetFormProps {
  assets?: LiquidAsset[];
  onAdd: (asset: LiquidAsset) => void;
  onRemove?: (id: string) => void;
  generateId: () => string;
}

const LiquidAssetForm: React.FC<LiquidAssetFormProps> = ({ assets, onAdd, onRemove, generateId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState<LiquidAsset>({
    id: generateId(),
    type: 'checking',
    name: '',
    institution: '',
    currentValue: 0,
    notes: ''
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
    if (!newAsset.name || newAsset.currentValue <= 0) return;
    
    onAdd(newAsset);
    
    // Reset form
    setNewAsset({
      id: generateId(),
      type: 'checking',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewAsset({
      id: generateId(),
      type: 'checking',
      name: '',
      institution: '',
      currentValue: 0,
      notes: ''
    });
    setShowAddForm(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Liquid Assets</Typography>
      
      {/* Existing Assets Table */}
      {assets?.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>Interest Rate</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      {liquidAssetTypes.find(type => type.value === asset.type)?.label || asset.type}
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.institution}</TableCell>
                    <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                    <TableCell>{asset.interestRate ? `${asset.interestRate}%` : 'N/A'}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => onRemove(asset.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add Asset Button or Form */}
      {!showAddForm ? (
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={() => setShowAddForm(true)}
        >
          Add Liquid Asset
        </Button>
      ) : (
        <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddAsset}
                  disabled={!newAsset.name || newAsset.currentValue <= 0}
                >
                  Add Asset
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default LiquidAssetForm;