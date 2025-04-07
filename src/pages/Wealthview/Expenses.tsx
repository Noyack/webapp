import React, { useState } from 'react';
import { 
  Typography, 
  Button,
  Box,
  Paper,
  Tabs,
  Tab
} from "@mui/material";
import { ExpenseInfoForm, ExpenseItem } from '../../types';
import { generateId, getCategoryKey, getAllExpenses, calculateMonthlyEquivalent, formatCurrency } from '../../utils/expenseTracking';
import TabPanel from './expenses-form/TabPanel';
import ExpenseForm from './expenses-form/ExpenseForm';
import ExpenseSummaryView from './expenses-form/ExpenseSummaryView';
import CategoryExpensePanel from './expenses-form/CategoryExpensePanel';
import ExpenseTable from './expenses-form/ExpenseTable';
import { Add } from '@mui/icons-material';

function ExpenseInfo() {
  // Create initial empty form state
  const createEmptyExpenseCategory = () => ({
    totalMonthly: 0,
    items: [] as ExpenseItem[]
  });

  const initialFormState: ExpenseInfoForm = {
    housing: createEmptyExpenseCategory(),
    utilities: createEmptyExpenseCategory(),
    food: createEmptyExpenseCategory(),
    transportation: createEmptyExpenseCategory(),
    insurance: createEmptyExpenseCategory(),
    healthcare: createEmptyExpenseCategory(),
    dependentCare: createEmptyExpenseCategory(),
    debtPayments: createEmptyExpenseCategory(),
    discretionary: createEmptyExpenseCategory(),
    financialGoals: createEmptyExpenseCategory(),
    periodicExpenses: createEmptyExpenseCategory(),
    businessExpenses: createEmptyExpenseCategory()
  };

  // Form state
  const [formData, setFormData] = useState<ExpenseInfoForm>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // New/edit expense state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);
  
  // Empty expense template
  const emptyExpense: ExpenseItem = {
    id: "",
    category: "",
    subcategory: "",
    description: "",
    amount: 0,
    frequency: "Monthly",
    isVariable: false,
    isTaxDeductible: false,
    priority: "Essential",
    notes: ""
  };
  
  const [currentExpense, setCurrentExpense] = useState<ExpenseItem>({...emptyExpense, id: generateId()});

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Start adding a new expense
  const handleAddExpense = (category: string) => {
    setCurrentExpense({
      ...emptyExpense,
      id: generateId(),
      category: category
    });
    setIsAddingExpense(true);
    setIsEditingExpense(false);
    setCurrentExpenseId(null);
  };

  // Start editing an existing expense
  const handleEditExpense = (id: string) => {
    // Find the expense in all categories
    let foundExpense: ExpenseItem | null = null;
    
    Object.values(formData).forEach(category => {
      const expense = category.items.find(item => item.id === id);
      if (expense) {
        foundExpense = {...expense};
      }
    });
    
    if (foundExpense) {
      setCurrentExpense(foundExpense);
      setIsEditingExpense(true);
      setIsAddingExpense(false);
      setCurrentExpenseId(id);
    }
  };

  // Delete an expense
  const handleDeleteExpense = (id: string) => {
    const updatedFormData = {...formData};
    
    // Look through all categories to find and remove the expense
    Object.keys(updatedFormData).forEach(key => {
      const categoryKey = key as keyof ExpenseInfoForm;
      updatedFormData[categoryKey].items = updatedFormData[categoryKey].items.filter(
        item => item.id !== id
      );
    });
    
    setFormData(updatedFormData);
  };

  // Save a new or edited expense
  const handleSaveExpense = () => {
    if (!currentExpense.category) return;
    
    const categoryKey = getCategoryKey(currentExpense.category);
    const updatedFormData = {...formData};
    
    if (isEditingExpense && currentExpenseId) {
      // First remove the old expense from wherever it is
      Object.keys(updatedFormData).forEach(key => {
        const catKey = key as keyof ExpenseInfoForm;
        updatedFormData[catKey].items = updatedFormData[catKey].items.filter(
          item => item.id !== currentExpenseId
        );
      });
      
      // Then add the updated expense to the correct category
      updatedFormData[categoryKey].items.push({...currentExpense});
    } else {
      // Just add the new expense
      updatedFormData[categoryKey].items.push({...currentExpense});
    }
    
    setFormData(updatedFormData);
    cancelExpenseForm();
  };

  // Cancel adding/editing an expense
  const cancelExpenseForm = () => {
    setIsAddingExpense(false);
    setIsEditingExpense(false);
    setCurrentExpenseId(null);
    setCurrentExpense({...emptyExpense, id: generateId()});
  };

  // Submit entire form
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
  };

  // Calculate total monthly expenses for the header
  const calculateTotalExpenses = () => {
    return Object.values(formData).reduce((total, category) => {
      const categoryTotal = category.items.reduce((catTotal, expense) => {
        return Number(catTotal) + Number(calculateMonthlyEquivalent(expense.amount, expense.frequency));
      }, 0);
      return Number(total) + Number(categoryTotal);
    }, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Expense Information</Typography>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          {/* Form for adding/editing an individual expense */}
          {(isAddingExpense || isEditingExpense) && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {isAddingExpense ? "Add New Expense" : "Edit Expense"}
              </Typography>
              <ExpenseForm 
                expense={currentExpense}
                setExpense={setCurrentExpense}
                onSave={handleSaveExpense}
                onCancel={cancelExpenseForm}
              />
            </Paper>
          )}
          
          {/* Main expense management interface */}
          {!isAddingExpense && !isEditingExpense && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Total Monthly Expenses: {formatCurrency(calculateTotalExpenses())}
                </Typography>
              </Box>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="expense tabs">
                  <Tab label="By Category" id="expenses-tab-0" />
                  <Tab label="All Expenses" id="expenses-tab-1" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <CategoryExpensePanel
                  title="Housing"
                  expenses={formData.housing.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Utilities"
                  expenses={formData.utilities.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Food"
                  expenses={formData.food.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Transportation"
                  expenses={formData.transportation.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Insurance"
                  expenses={formData.insurance.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Healthcare"
                  expenses={formData.healthcare.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Dependent Care"
                  expenses={formData.dependentCare.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Debt Payments"
                  expenses={formData.debtPayments.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Discretionary"
                  expenses={formData.discretionary.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Financial Goals"
                  expenses={formData.financialGoals.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Periodic Expenses"
                  expenses={formData.periodicExpenses.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
                <CategoryExpensePanel
                  title="Business Expenses"
                  expenses={formData.businessExpenses.items}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                />
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {getAllExpenses(formData).length > 0 ? (
                  <ExpenseTable 
                    expenses={getAllExpenses(formData)} 
                    onEdit={handleEditExpense} 
                    onDelete={handleDeleteExpense} 
                  />
                ) : (
                  <Typography color="text.secondary">No expenses added yet</Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => handleAddExpense("")}
                  sx={{ mt: 2 }}
                >
                  Add New Expense
                </Button>
              </TabPanel>
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Save Expense Information
            </Button>
          </Box>
        </form>
      ) : (
        <ExpenseSummaryView expenses={formData} onEdit={() => setIsEditing(true)} />
      )}
    </Box>
  );
}

export default ExpenseInfo;