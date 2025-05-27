import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button,
  Box,
  Grid,
  Paper,
  InputAdornment,
  Alert
} from "@mui/material";
import { AssetAllocation } from '../../../types';

interface AssetAllocationFormProps {
  currentAllocation: AssetAllocation;
  targetAllocation: AssetAllocation;
  liquidityNeeds: number;
  updateCurrentAllocation: (allocation: AssetAllocation) => void;
  updateTargetAllocation: (allocation: AssetAllocation) => void;
  updateLiquidityNeeds: (value: number) => void;
  isReadOnly?: boolean; // New prop to indicate if current allocation is read-only
}

const AssetAllocationForm: React.FC<AssetAllocationFormProps> = ({ 
  currentAllocation,
  targetAllocation,
  liquidityNeeds,
  updateCurrentAllocation,
  updateTargetAllocation,
  updateLiquidityNeeds,
  isReadOnly = false // Default to false for backward compatibility
}) => {
  // Local state for form data
  const [currentAllocationState, setCurrentAllocationState] = useState<AssetAllocation>(currentAllocation);
  const [targetAllocationState, setTargetAllocationState] = useState<AssetAllocation>(targetAllocation);
  const [liquidityNeedsState, setLiquidityNeedsState] = useState<number>(liquidityNeeds);
  
  // State for save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Reset local state when props change
  useEffect(() => {
    setCurrentAllocationState(currentAllocation);
    setTargetAllocationState(targetAllocation);
    setLiquidityNeedsState(liquidityNeeds);
  }, [currentAllocation, targetAllocation, liquidityNeeds]);

  // Calculate if allocation adds up to 100%
  const isAllocationValid = (allocation: AssetAllocation): boolean => {
    const sum = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    return Math.abs(sum - 100) < 0.01; // Allow for floating point imprecision
  };

  // Current allocation handlers
  const handleCurrentAllocationChange = (name: keyof AssetAllocation) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    
    const updatedAllocation = {
      ...currentAllocationState,
      [name]: value
    };
    
    setCurrentAllocationState(updatedAllocation);
  };

  // Target allocation handlers
  const handleTargetAllocationChange = (name: keyof AssetAllocation) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    
    const updatedAllocation = {
      ...targetAllocationState,
      [name]: value
    };
    
    setTargetAllocationState(updatedAllocation);
  };

  // Liquidity needs handler
  const handleLiquidityNeedsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiquidityNeedsState(Number(event.target.value));
  };

  // Save changes
  const handleSaveChanges = () => {
    console.log("Saving allocation settings");
    console.log("Target allocation to save:", targetAllocationState);
    
    if (!isReadOnly) {
      updateCurrentAllocation(currentAllocationState);
    }
    
    // Always update target allocation regardless of read-only state
    updateTargetAllocation(targetAllocationState);
    updateLiquidityNeeds(liquidityNeedsState);
    
    // Show visual confirmation
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Asset Allocations</Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Current Asset Allocation</Typography>
        
        {isReadOnly && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Current allocation is automatically calculated based on your assets
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stocks"
              type="number"
              name="stocks"
              value={currentAllocationState.stocks}
              onChange={handleCurrentAllocationChange('stocks')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bonds"
              type="number"
              name="bonds"
              value={currentAllocationState.bonds}
              onChange={handleCurrentAllocationChange('bonds')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cash & Cash Equivalents"
              type="number"
              name="cash"
              value={currentAllocationState.cash}
              onChange={handleCurrentAllocationChange('cash')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Real Estate"
              type="number"
              name="realEstate"
              value={currentAllocationState.realEstate}
              onChange={handleCurrentAllocationChange('realEstate')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Alternative Investments"
              type="number"
              name="alternatives"
              value={currentAllocationState.alternatives}
              onChange={handleCurrentAllocationChange('alternatives')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Other"
              type="number"
              name="other"
              value={currentAllocationState.other}
              onChange={handleCurrentAllocationChange('other')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                readOnly: isReadOnly
              }}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color={isAllocationValid(currentAllocationState) ? 'success.main' : 'error.main'}>
              Total: {Object.values(currentAllocationState).reduce((sum, value) => sum + value, 0).toFixed(1)}%
              {isAllocationValid(currentAllocationState) ? '' : ' (Should equal 100%)'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Target Asset Allocation</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stocks"
              type="number"
              name="stocks"
              value={targetAllocationState.stocks}
              onChange={handleTargetAllocationChange('stocks')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bonds"
              type="number"
              name="bonds"
              value={targetAllocationState.bonds}
              onChange={handleTargetAllocationChange('bonds')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cash & Cash Equivalents"
              type="number"
              name="cash"
              value={targetAllocationState.cash}
              onChange={handleTargetAllocationChange('cash')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Real Estate"
              type="number"
              name="realEstate"
              value={targetAllocationState.realEstate}
              onChange={handleTargetAllocationChange('realEstate')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Alternative Investments"
              type="number"
              name="alternatives"
              value={targetAllocationState.alternatives}
              onChange={handleTargetAllocationChange('alternatives')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Other"
              type="number"
              name="other"
              value={targetAllocationState.other}
              onChange={handleTargetAllocationChange('other')}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 0.5 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color={isAllocationValid(targetAllocationState) ? 'success.main' : 'error.main'}>
              Total: {Object.values(targetAllocationState).reduce((sum, value) => sum + value, 0).toFixed(1)}%
              {isAllocationValid(targetAllocationState) ? '' : ' (Should equal 100%)'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Liquidity Needs</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              What percentage of your portfolio should remain liquid (available within 30 days without penalty)?
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="liquidityNeeds"
              value={liquidityNeedsState}
              onChange={handleLiquidityNeedsChange}
              InputProps={{ 
                inputProps: { min: 0, max: 100, step: 1 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSaveChanges}
          disabled={(!isReadOnly && !isAllocationValid(currentAllocationState)) || !isAllocationValid(targetAllocationState)}
        >
          Save Allocation Settings
        </Button>
        
        {showSaveConfirmation && (
          <Alert severity="success" sx={{ ml: 2 }}>
            Settings saved to form
          </Alert>
        )}
      </Box>
    </>
  );
};

export default AssetAllocationForm;