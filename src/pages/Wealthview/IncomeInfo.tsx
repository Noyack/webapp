/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/income/IncomeInfo.tsx
// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import {
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent
} from "@mui/material";
import { UserContext } from '../../context/UserContext';
import incomeService from '../../services/income.service';

import PrimaryIncomeForm from './income-forms/PrimaryIncomeForm';
import AdditionalIncomeForm from './income-forms/AdditionalIncomeForm';
import IncomeInfoDisplay from './income-forms/IncomeInfoDisplay';
import { IncomeInfoForm, IncomeSource, employmentStatusOptions } from './income-forms/types';

function IncomeInfo() {
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id;

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate unique ID for income sources
  const generateId = useCallback(() => 
    `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, 
    []
  );

  // Form state
  const [formData, setFormData] = useState<IncomeInfoForm>({
    employmentStatus: "Employed",
    primaryIncome: {
      salary: 0,
      paymentFrequency: "Bi-weekly",
      stabilityType: "Fixed salary",
      annualGrowthRate: 3,
      futureChanges: "No anticipated changes",
      futureChangeTimeframe: 0,
      bonusStructure: "",
      averageBonus: 0
    },
    additionalIncomes: []
  });

  // Original form data for tracking changes
  const [originalFormData, setOriginalFormData] = useState<IncomeInfoForm | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  
  // Additional income form visibility
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  
  // New income source state
  const [newIncomeSource, setNewIncomeSource] = useState<IncomeSource>(() => ({
    id: generateId(),
    type: "",
    name: "",
    amount: 0,
    frequency: "Monthly",
    duration: "Ongoing/Indefinite",
    taxStatus: "Fully taxable",
    growthRate: 2,
    notes: ""
  }));

  // Reset new income source to default values
  const resetNewIncomeSource = useCallback(() => {
    setNewIncomeSource({
      id: generateId(),
      type: "",
      name: "",
      amount: 0,
      frequency: "Monthly",
      duration: "Ongoing/Indefinite",
      taxStatus: "Fully taxable",
      growthRate: 2,
      notes: ""
    });
  }, [generateId]);

  // Fetch income data from API
  const fetchIncomeData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const incomeSources = await incomeService.getUserIncomeSources(userId);
      if (!Array.isArray(incomeSources)) {
        throw new Error("Invalid response format from API");
      }
      
      // Find primary income and additional incomes
      const primarySource = incomeSources.find((source: any) => source.isPrimary);
      const additionalSources = incomeSources.filter((source: any) => !source.isPrimary);
      
      // Initialize form with default values
      const updatedFormData = {
        employmentStatus: "Employed",
        primaryIncome: {
          salary: 0,
          paymentFrequency: "Bi-weekly",
          stabilityType: "Fixed salary",
          annualGrowthRate: 3,
          futureChanges: "No anticipated changes",
          futureChangeTimeframe: 0,
          bonusStructure: "",
          averageBonus: 0
        },
        additionalIncomes: [] as IncomeSource[]
      };
      
      // Update with primary income if exists
      if (primarySource) {
        updatedFormData.employmentStatus = primarySource.type === "self_employment" ? "Self-employed" : "Employed";
        updatedFormData.primaryIncome = {
          salary: typeof primarySource.amount === 'string' 
            ? parseFloat(primarySource.amount) 
            : primarySource.amount || 0,
          paymentFrequency: primarySource.frequency || "Bi-weekly",
          stabilityType: primarySource.type === "self_employment" 
            ? "Commission-based" 
            : "Fixed salary",
          annualGrowthRate: typeof primarySource.growthRate === 'string'
            ? parseFloat(primarySource.growthRate)
            : primarySource.growthRate || 3,
          futureChanges: primarySource.futureChanges || "No anticipated changes",
          futureChangeTimeframe: typeof primarySource.futureChangeTimeframe === 'string'
            ? parseInt(primarySource.futureChangeTimeframe) 
            : primarySource.futureChangeTimeframe || 0,
          bonusStructure: primarySource.bonusStructure || "",
          averageBonus: typeof primarySource.averageBonus === 'string'
            ? parseFloat(primarySource.averageBonus)
            : primarySource.averageBonus || 0
        };
      }
      
      // Add additional income sources
      if (additionalSources.length > 0) {
        // Process and normalize each income source
        updatedFormData.additionalIncomes = additionalSources.map((source: any) => ({
          id: source.id,
          type: source.type,
          name: source.name || "",
          amount: typeof source.amount === 'string' ? parseFloat(source.amount) : source.amount || 0,
          frequency: source.frequency || "Monthly",
          duration: source.duration || "Ongoing/Indefinite",
          taxStatus: source.taxStatus || "Fully taxable",
          growthRate: typeof source.growthRate === 'string' ? parseFloat(source.growthRate) : source.growthRate || 2,
          notes: source.notes || "",
          isPrimary: false
        }));
      }
      
      // Update form data state
      setFormData(updatedFormData);
      // Store the original data for comparison when saving
      setOriginalFormData(JSON.parse(JSON.stringify(updatedFormData)));
      
      // Switch to display mode if we have data
      if (primarySource || additionalSources.length > 0) {
        setIsEditing(false);
      }
      
    } catch (err) {
      console.error("Error fetching income data:", err);
      setError("Failed to load income data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch data on component mount
  useEffect(() => {
    if (userId) {
      fetchIncomeData();
    }
  }, [userId, fetchIncomeData]);

  // Handle TextField input changes for primary income
  const handlePrimaryIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    // Parse numeric fields
    const numericFields = ['salary', 'averageBonus', 'futureChangeTimeframe', 'annualGrowthRate'];
    
    setFormData(prevData => ({
      ...prevData,
      primaryIncome: {
        ...prevData.primaryIncome,
        [name]: numericFields.includes(name) 
          ? value === '' ? 0 : parseFloat(value) 
          : value
      }
    }));
  };
  
  // Handle Select input changes for primary income
  const handlePrimaryIncomeSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    
    setFormData(prevData => ({
      ...prevData,
      primaryIncome: {
        ...prevData.primaryIncome,
        [name]: value
      }
    }));
  };

  // Handle employment status change
  const handleEmploymentStatusChange = (event: SelectChangeEvent) => {
    setFormData(prevData => ({
      ...prevData,
      employmentStatus: event.target.value
    }));
  };

  // Handle slider changes for primary income
  const handlePrimaryIncomeSliderChange = (name: string) => (_event: Event, newValue: number | number[]) => {
    setFormData(prevData => ({
      ...prevData,
      primaryIncome: {
        ...prevData.primaryIncome,
        [name]: newValue
      }
    }));
  };

  // Handle TextField input changes for new income source
  const handleNewIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    // Parse numeric fields
    const numericFields = ['amount', 'growthRate'];
    const newValue = numericFields.includes(name) 
      ? value === '' ? 0 : parseFloat(value) 
      : value;
    
    setNewIncomeSource(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  // Handle Select input changes for new income source
  const handleNewIncomeSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    
    setNewIncomeSource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle slider changes for new income source
  const handleNewIncomeSliderChange = (name: string) => (_event: Event, newValue: number | number[]) => {
    setNewIncomeSource(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Add new income source
  const addIncomeSource = () => {
    if (!newIncomeSource.type || !newIncomeSource.amount) {
      setError("Income type and amount are required");
      return;
    }
    if (newIncomeSource.amount <= 0) {
      setError("Income amount is not valid");
      return;
    }
    
    // Explicitly mark as NOT primary
    setFormData(prevData => ({
      ...prevData,
      additionalIncomes: [...prevData.additionalIncomes, { 
        ...newIncomeSource,
        isPrimary: false // Ensuring additional income is never primary
      }]
    }));
    toggleAddIncomeForm()
    resetNewIncomeSource();
    setError(null);
  };

  // Remove income source
  const removeIncomeSource = (id: string) => {
    setFormData(prevData => ({
      ...prevData,
      additionalIncomes: prevData.additionalIncomes.filter(income => income.id !== id)
    }));
  };

  // Toggle add income form visibility
  const toggleAddIncomeForm = () => {
    setShowAddIncomeForm(!showAddIncomeForm);
  };

  // Calculate total annual income
  const totalAnnualIncome = useMemo(() => {
    if (formData.employmentStatus === "Unemployed") {
      return 0;
    }
    
    // Calculate primary income
    const primaryIncome = typeof formData.primaryIncome.salary === 'string' 
      ? parseFloat(formData.primaryIncome.salary) || 0
      : formData.primaryIncome.salary || 0;
    
    // Calculate bonus
    const bonus = typeof formData.primaryIncome.averageBonus === 'string'
      ? parseFloat(formData.primaryIncome.averageBonus) || 0
      : formData.primaryIncome.averageBonus || 0;
    
    // Calculate additional incomes (excluding one-time payments)
    const additionalIncome = formData.additionalIncomes.reduce((total, income) => {
      if (income.duration === "One-time") return total;
      
      const amount = typeof income.amount === 'string' 
        ? parseFloat(income.amount) || 0
        : income.amount || 0;
      
      // Handle large amounts as annual
      if (income.frequency === "Annually" || 
          (amount > 10000 && ["Weekly", "Bi-weekly", "Bi-monthly", "Monthly"].includes(income.frequency))) {
        return total + amount;
      } else {
        // Convert to annual equivalent
        const multiplier = 
          income.frequency === "Weekly" ? 52 :
          income.frequency === "Bi-weekly" ? 26 :
          income.frequency === "Bi-monthly" ? 24 :
          income.frequency === "Monthly" ? 12 :
          income.frequency === "Quarterly" ? 4 :
          income.frequency === "Semi-annually" ? 2 : 1;
        
        return total + (amount * multiplier);
      }
    }, 0);
    
    return primaryIncome + bonus + additionalIncome;
  }, [formData]);

  // Find changes to income sources by comparing with original data
  const findChanges = () => {
    if (!originalFormData) return {
      primaryChanged: true,
      additionalToAdd: formData.additionalIncomes,
      additionalToUpdate: [],
      additionalToDelete: []
    };

    // Check if primary income changed
    const primaryChanged = formData.employmentStatus !== originalFormData.employmentStatus ||
      JSON.stringify(formData.primaryIncome) !== JSON.stringify(originalFormData.primaryIncome);
    
    // Find additional incomes to add, update, or delete
    const additionalToAdd = formData.additionalIncomes.filter(income => 
      income.id?.startsWith('temp_')
    );
    
    const additionalToUpdate = formData.additionalIncomes.filter(income => 
      !income.id?.startsWith('temp_') && 
      originalFormData.additionalIncomes.some(orig => orig.id === income.id &&
        JSON.stringify(orig) !== JSON.stringify(income))
    );
    
    const additionalToDelete = originalFormData.additionalIncomes.filter(origIncome => 
      !formData.additionalIncomes.some(income => income.id === origIncome.id)
    );
    
    return {
      primaryChanged,
      additionalToAdd,
      additionalToUpdate,
      additionalToDelete
    };
  };

  // Submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!userId) {
      setError("User not authenticated. Please log in.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { 
        primaryChanged, 
        additionalToAdd, 
        additionalToUpdate, 
        additionalToDelete 
      } = findChanges();
      
      // Save primary income if changed
      if (primaryChanged && formData.employmentStatus !== "Unemployed") {
        // Create the primary income object with proper structure for the service
        const primaryIncomeData = {
          type: formData.employmentStatus === "Self-employed" ? "self_employment" : "salary",
          name: "Primary Income",
          amount: formData.primaryIncome.salary,
          frequency: formData.primaryIncome.paymentFrequency,
          description: `Growth Rate: ${formData.primaryIncome.annualGrowthRate}%, Future Changes: ${formData.primaryIncome.futureChanges}${
            formData.primaryIncome.bonusStructure ? `, Bonus: ${formData.primaryIncome.bonusStructure}` : ''
          }`,
          growthRate: formData.primaryIncome.annualGrowthRate,
          isPrimary: true  // This is the critical flag
        };
        
        await incomeService.savePrimaryIncome(userId, primaryIncomeData);
      }
      
      // Create array of operations to execute
      const operations = [];
      
      // Add operations for additional incomes
      for (const source of additionalToAdd) {
        operations.push(incomeService.createIncomeSource(userId, source));
      }
      
      for (const source of additionalToUpdate) {
        operations.push(incomeService.updateIncomeSource(source.id!, source));
      }
      
      for (const source of additionalToDelete) {
        operations.push(incomeService.deleteIncomeSource(source.id!));
      }
      
      // Execute operations in parallel
      if (operations.length > 0) {
        await Promise.all(operations);
      }
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Refresh data to ensure we have the latest
      fetchIncomeData();
      
    } catch (err) {
      console.error("Error saving income data:", err);
      setError("Failed to save income data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSaveSuccess(false);
    setError(null);
  };

  // Whether primary income section should be shown
  const showPrimaryIncome = formData.employmentStatus !== "Unemployed" && formData.employmentStatus !== "Student";

  if (loading && !isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: {xs: 0, md:3} }}>
      <Typography variant="h4" fontSize={{xs:"24px", md:"34px"}} gutterBottom>Income Information</Typography>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Employment Status</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Current Employment Status</InputLabel>
              <Select
                value={formData.employmentStatus}
                onChange={handleEmploymentStatusChange}
                label="Current Employment Status"
              >
                {employmentStatusOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {showPrimaryIncome && (
              <PrimaryIncomeForm
                primaryIncome={formData.primaryIncome}
                onTextChange={handlePrimaryIncomeChange}
                onSelectChange={handlePrimaryIncomeSelectChange}
                onSliderChange={handlePrimaryIncomeSliderChange}
              />
            )}
          </Paper>

          <AdditionalIncomeForm
            additionalIncomes={formData.additionalIncomes}
            newIncomeSource={newIncomeSource}
            showAddIncomeForm={showAddIncomeForm}
            onShowFormToggle={toggleAddIncomeForm}
            onNewIncomeTextChange={handleNewIncomeChange}
            onNewIncomeSelectChange={handleNewIncomeSelectChange}
            onNewIncomeSliderChange={handleNewIncomeSliderChange}
            onAddIncomeSource={addIncomeSource}
            onRemoveIncomeSource={removeIncomeSource}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {error && (
              <Typography color="error">{error}</Typography>
            )}
            <Box sx={{ ml: 'auto' }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Income Information'}
              </Button>
            </Box>
          </Box>
        </form>
      ) : (
        <IncomeInfoDisplay
          formData={formData}
          totalAnnualIncome={totalAnnualIncome}
          onEdit={handleEdit}
          loading={loading}
        />
      )}
      
      <Snackbar 
        open={saveSuccess || !!error} 
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={saveSuccess ? "success" : "error"} 
          sx={{ width: '100%' }}
        >
          {saveSuccess ? "Income information saved successfully!" : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default IncomeInfo;