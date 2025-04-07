import { 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { ExpenseItem } from '../../../types';
import { formatCurrency, calculateMonthlyEquivalent } from '../../../utils/expenseTracking';
import ExpenseTable from './ExpenseTable';

interface CategoryExpensePanelProps {
  title: string;
  expenses: ExpenseItem[];
  onAddExpense: (category: string) => void;
  onEditExpense: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

function CategoryExpensePanel({ 
  title, 
  expenses, 
  onAddExpense, 
  onEditExpense, 
  onDeleteExpense 
}: CategoryExpensePanelProps) {
  const totalMonthly = expenses.reduce((total, expense) => {
    return total + calculateMonthlyEquivalent(expense.amount, expense.frequency);
  }, 0);

  return (
    <Accordion defaultExpanded={title === "Housing"}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Monthly: {formatCurrency(totalMonthly)}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {expenses.length > 0 ? (
          <ExpenseTable 
            expenses={expenses} 
            onEdit={onEditExpense} 
            onDelete={onDeleteExpense} 
          />
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>No expenses added yet</Typography>
        )}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => onAddExpense(title)}
        >
          Add {title} Expense
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default CategoryExpensePanel;