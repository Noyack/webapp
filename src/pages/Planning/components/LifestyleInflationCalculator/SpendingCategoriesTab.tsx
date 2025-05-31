import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Chip,
  Alert,
  Slider,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { LifestyleInflationInputs, SpendingCategory, INFLATION_SEVERITY } from '../../../../types/lifestyleInflation';
import { formatCurrency, calculateAverageInflationRate, getInflationSeverity } from '../../../../utils/lifestyleInflationCalculations';

interface SpendingCategoriesTabProps {
  inputs: LifestyleInflationInputs;
  onInputChange: <K extends keyof LifestyleInflationInputs>(field: K, value: LifestyleInflationInputs[K]) => void;
}

export default function SpendingCategoriesTab({ inputs, onInputChange }: SpendingCategoriesTabProps) {
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState<SpendingCategory>({
    name: '',
    currentMonthlyAmount: 0,
    inflationRate: 25,
    isNecessary: true,
    description: ''
  });

  // Calculate totals and metrics
  const totalMonthlySpending = inputs.spendingCategories.reduce(
    (sum, cat) => sum + cat.currentMonthlyAmount, 0
  );
  const spendingRatio = totalMonthlySpending / inputs.currentIncome.monthly;
  const averageInflationRate = calculateAverageInflationRate(inputs.spendingCategories);
  const inflationSeverity = getInflationSeverity(averageInflationRate);

  // Handle category updates
  const updateCategory = (index: number, updates: Partial<SpendingCategory>) => {
    const updatedCategories = inputs.spendingCategories.map((cat, i) => 
      i === index ? { ...cat, ...updates } : cat
    );
    onInputChange('spendingCategories', updatedCategories);
  };

  // Handle category deletion
  const deleteCategory = (index: number) => {
    const updatedCategories = inputs.spendingCategories.filter((_, i) => i !== index);
    onInputChange('spendingCategories', updatedCategories);
  };

  // Handle adding new category
  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const updatedCategories = [...inputs.spendingCategories, { ...newCategory }];
    onInputChange('spendingCategories', updatedCategories);
    
    // Reset form
    setNewCategory({
      name: '',
      currentMonthlyAmount: 0,
      inflationRate: 25,
      isNecessary: true,
      description: ''
    });
    setShowAddDialog(false);
  };

  // Get inflation severity color and icon
  const getSeverityDisplay = (rate: number) => {
    const severity = getInflationSeverity(rate);
    const config = INFLATION_SEVERITY[severity];
    
    return {
      color: config.color as 'success' | 'warning' | 'error',
      label: config.label,
      icon: rate < 20 ? <CheckIcon /> : rate < 40 ? <InfoIcon /> : <WarningIcon />
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Spending Categories
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how much your spending increases in each category when you get a raise.
      </Typography>

      {/* Spending Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" color="primary.main">Total Monthly Spending</Typography>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {formatCurrency(totalMonthlySpending)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(spendingRatio * 100).toFixed(1)}% of income
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: `${getSeverityDisplay(averageInflationRate).color}.50` }}>
            <CardContent>
              <Typography variant="h6">Average Inflation Rate</Typography>
              <Typography variant="h4" fontWeight="bold">
                {averageInflationRate.toFixed(1)}%
              </Typography>
              <Chip 
                label={getSeverityDisplay(averageInflationRate).label}
                color={getSeverityDisplay(averageInflationRate).color}
                icon={getSeverityDisplay(averageInflationRate).icon}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Categories</Typography>
              <Typography variant="h4" fontWeight="bold">
                {inputs.spendingCategories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {inputs.spendingCategories.filter(c => c.isNecessary).length} necessary
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Spending validation alerts */}
      {spendingRatio > 0.9 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">⚠️ High Spending Ratio</Typography>
          <Typography variant="body2">
            You're spending {(spendingRatio * 100).toFixed(1)}% of your income. Consider reducing expenses or increasing income.
          </Typography>
        </Alert>
      )}

      {averageInflationRate > 40 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">🚨 High Lifestyle Inflation Risk</Typography>
          <Typography variant="body2">
            Your average inflation rate of {averageInflationRate.toFixed(1)}% per raise is quite high. 
            Consider implementing spending controls.
          </Typography>
        </Alert>
      )}

      {/* Categories List */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Spending Categories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
          >
            Add Category
          </Button>
        </Box>

        <Grid container spacing={2}>
          {inputs.spendingCategories.map((category, index) => (
            <Grid item xs={12} lg={6} key={index}>
              <Card sx={{ 
                border: editingCategory === index ? '2px solid' : '1px solid',
                borderColor: editingCategory === index ? 'primary.main' : 'grey.300'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.name}
                        <Chip 
                          label={category.isNecessary ? 'Necessary' : 'Optional'}
                          color={category.isNecessary ? 'success' : 'default'}
                          size="small"
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setEditingCategory(editingCategory === index ? null : index)}
                        color={editingCategory === index ? 'primary' : 'default'}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteCategory(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {editingCategory === index ? (
                    // Edit mode
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Category Name"
                          value={category.name}
                          onChange={(e) => updateCategory(index, { name: e.target.value })}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={category.description}
                          onChange={(e) => updateCategory(index, { description: e.target.value })}
                          size="small"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Monthly Amount"
                          type="number"
                          value={category.currentMonthlyAmount}
                          onChange={(e) => updateCategory(index, { currentMonthlyAmount: parseFloat(e.target.value) || 0 })}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Inflation Rate"
                          type="number"
                          value={category.inflationRate}
                          onChange={(e) => updateCategory(index, { inflationRate: parseFloat(e.target.value) || 0 })}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={category.isNecessary}
                              onChange={(e) => updateCategory(index, { isNecessary: e.target.checked })}
                            />
                          }
                          label="Necessary expense"
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    // View mode
                    <Box>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Monthly Amount</Typography>
                          <Typography variant="h6">{formatCurrency(category.currentMonthlyAmount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Annual Amount</Typography>
                          <Typography variant="h6">{formatCurrency(category.currentMonthlyAmount * 12)}</Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Lifestyle Inflation Rate: {category.inflationRate}%
                        </Typography>
                        <Slider
                          value={category.inflationRate}
                          min={0}
                          max={100}
                          disabled
                          color={
                            category.inflationRate < 20 ? 'success' :
                            category.inflationRate < 40 ? 'warning' : 'error'
                          }
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getSeverityDisplay(category.inflationRate).label} inflation rate
                        </Typography>
                      </Box>

                      {/* Future spending preview */}
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          After 3 raises ({(category.inflationRate * 3).toFixed(0)}% total increase):
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {formatCurrency(category.currentMonthlyAmount * Math.pow(1 + category.inflationRate / 100, 3))} per month
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Spending Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Entertainment, Subscriptions"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                multiline
                rows={2}
                placeholder="Brief description of what this category includes"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly Amount"
                type="number"
                value={newCategory.currentMonthlyAmount || ''}
                onChange={(e) => setNewCategory({ ...newCategory, currentMonthlyAmount: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inflation Rate"
                type="number"
                value={newCategory.inflationRate}
                onChange={(e) => setNewCategory({ ...newCategory, inflationRate: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText="How much this spending increases per raise"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCategory.isNecessary}
                    onChange={(e) => setNewCategory({ ...newCategory, isNecessary: e.target.checked })}
                  />
                }
                label="This is a necessary expense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={addCategory} 
            variant="contained"
            disabled={!newCategory.name.trim()}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tips */}
      <Alert severity="info">
        <Typography variant="subtitle2">💡 Spending Category Tips</Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Track inflation rates by observing how your spending changes after raises</li>
          <li>Discretionary categories (dining, shopping) typically have higher inflation rates</li>
          <li>Fixed expenses (rent, insurance) usually have lower inflation rates</li>
          <li>Consider the 50% rule: save 50% of every raise to combat lifestyle inflation</li>
        </ul>
      </Alert>
    </Box>
  );
} 