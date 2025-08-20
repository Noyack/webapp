// components/income/AdditionalIncomeForm.tsx
import React from 'react';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  SelectChangeEvent
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  IncomeSource,
  incomeTypeOptions,
  frequencyOptions,
  durationOptions,
  taxStatusOptions,
  formatCurrency
} from './types';

interface AdditionalIncomeFormProps {
  additionalIncomes: IncomeSource[];
  newIncomeSource: IncomeSource;
  showAddIncomeForm: boolean;
  onShowFormToggle: () => void;
  onNewIncomeTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewIncomeSelectChange: (event: SelectChangeEvent) => void;
  onNewIncomeSliderChange: (name: string) => (_event: Event, newValue: number | number[]) => void;
  onAddIncomeSource: () => void;
  onRemoveIncomeSource: (id: string) => void;
}

const AdditionalIncomeForm: React.FC<AdditionalIncomeFormProps> = ({
  additionalIncomes,
  newIncomeSource,
  showAddIncomeForm,
  onShowFormToggle,
  onNewIncomeTextChange,
  onNewIncomeSelectChange,
  onNewIncomeSliderChange,
  onAddIncomeSource,
  onRemoveIncomeSource
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Additional Income Sources (Optional)</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onShowFormToggle}
        >
          {showAddIncomeForm ? 'Hide Form' : 'Add New Income Source'}
        </Button>
      </Box>
      
      {additionalIncomes.length > 0 && (
        <TableContainer sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {additionalIncomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.type}</TableCell>
                  <TableCell>{income.name}</TableCell>
                  <TableCell>{formatCurrency(income.amount)}</TableCell>
                  <TableCell>{income.frequency}</TableCell>
                  <TableCell>{income.duration}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => onRemoveIncomeSource(income.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {showAddIncomeForm && (
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Add New Income Source</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Income Type</InputLabel>
                <Select
                  name="type"
                  value={newIncomeSource.type}
                  onChange={onNewIncomeSelectChange}
                  label="Income Type *"
                >
                  {incomeTypeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description/Name"
                name="name"
                value={newIncomeSource.name}
                onChange={onNewIncomeTextChange}
                placeholder="e.g., Rental property on Oak St, IBM dividends"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Amount"
                type="number"
                name="amount"
                onChange={onNewIncomeTextChange}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  name="frequency"
                  value={newIncomeSource.frequency}
                  onChange={onNewIncomeSelectChange}
                  label="Frequency"
                >
                  {frequencyOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Expected Duration</InputLabel>
                <Select
                  name="duration"
                  value={newIncomeSource.duration}
                  onChange={onNewIncomeSelectChange}
                  label="Expected Duration"
                >
                  {durationOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tax Status</InputLabel>
                <Select
                  name="taxStatus"
                  value={newIncomeSource.taxStatus}
                  onChange={onNewIncomeSelectChange}
                  label="Tax Status"
                >
                  {taxStatusOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Expected Growth Rate (%)</Typography>
              <Slider
                value={newIncomeSource.growthRate}
                onChange={onNewIncomeSliderChange('growthRate')}
                valueLabelDisplay="auto"
                step={0.5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' }
                ]}
                min={0}
                max={10}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={newIncomeSource.notes}
                onChange={onNewIncomeTextChange}
                multiline
                rows={2}
                placeholder="Any additional details about this income source"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddIncomeSource}
                disabled={!newIncomeSource.type || !newIncomeSource.amount}
              >
                Save New Income Source
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default AdditionalIncomeForm;