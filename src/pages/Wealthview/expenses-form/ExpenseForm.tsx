import React from 'react';
import { 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Grid,
  SelectChangeEvent
} from "@mui/material";
import { ExpenseItem, categoryOptions, subcategoryOptions, frequencyOptions, priorityOptions } from '../../../types';

interface ExpenseFormProps {
  expense: ExpenseItem;
  setExpense: React.Dispatch<React.SetStateAction<ExpenseItem>>;
  onSave: () => void;
  onCancel: () => void;
}

function ExpenseForm({ expense, setExpense, onSave, onCancel }: ExpenseFormProps) {
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExpense({
      ...expense,
      [name]: value
    });
  };
  
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    
    // If changing category, reset subcategory
    if (name === "category") {
      setExpense({
        ...expense,
        category: value,
        subcategory: ""
      });
    } else {
      setExpense({
        ...expense,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    
    setExpense({
      ...expense,
      [name]: checked
    });
  };
  
  const handleRangeChange = (field: "min" | "max") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setExpense({
      ...expense,
      variableRange: {
        ...expense.variableRange || { min: 0, max: 0 },
        [field]: value
      }
    });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={expense.category}
              onChange={handleSelectChange}
              label="Category *"
            >
              {categoryOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required disabled={!expense.category}>
            <InputLabel>Subcategory</InputLabel>
            <Select
              name="subcategory"
              value={expense.subcategory}
              onChange={handleSelectChange}
              label="Subcategory *"
            >
              {expense.category && subcategoryOptions[expense.category] 
                ? subcategoryOptions[expense.category].map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))
                : []
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={expense.description}
            onChange={handleTextFieldChange}
            placeholder="e.g., Rent for apartment, Netflix subscription"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Frequency</InputLabel>
            <Select
              name="frequency"
              value={expense.frequency}
              onChange={handleSelectChange}
              label="Frequency"
            >
              {frequencyOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Amount"
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleTextFieldChange}
            InputProps={{ 
              inputProps: { min: 0 },
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={expense.priority}
              onChange={handleSelectChange}
              label="Priority"
            >
              {priorityOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={expense.isVariable}
                onChange={handleCheckboxChange}
                name="isVariable"
              />
            }
            label="This expense amount varies month to month"
          />
        </Grid>
        {expense.isVariable && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Monthly Amount"
                type="number"
                value={expense.variableRange?.min || 0}
                onChange={handleRangeChange("min")}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Monthly Amount"
                type="number"
                value={expense.variableRange?.max || 0}
                onChange={handleRangeChange("max")}
                InputProps={{ 
                  inputProps: { min: 0 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={expense.isTaxDeductible}
                onChange={handleCheckboxChange}
                name="isTaxDeductible"
              />
            }
            label="This expense is tax deductible"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={expense.notes}
            onChange={handleTextFieldChange}
            multiline
            rows={2}
            placeholder="Any additional details about this expense"
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onSave}
              disabled={!expense.category || !expense.subcategory || !expense.amount}
            >
              Save Expense
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseForm;