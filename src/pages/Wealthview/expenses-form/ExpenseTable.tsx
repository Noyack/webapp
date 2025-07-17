import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExpenseItem } from '../../../types';
import { formatCurrency, calculateMonthlyEquivalent } from '../../../utils/expenseTracking';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <TableContainer sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Monthly Equivalent</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {expense.description || `${expense.subcategory}`}
                {expense.isTaxDeductible && (
                  <Chip size="small" label="Tax Deductible" color="info" sx={{ ml: 1 }} />
                )}
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>
                {formatCurrency(expense.amount)}
                {expense.isVariable && expense.variableRange && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    Range: {formatCurrency(expense.variableRange.min)} - {formatCurrency(expense.variableRange.max)}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{expense.frequency}</TableCell>
              <TableCell>{formatCurrency(calculateMonthlyEquivalent(expense.amount, expense.frequency))}</TableCell>
              <TableCell>
                <Chip 
                  size="small" 
                  label={expense.priority} 
                  color={
                    expense.priority === "Essential" ? "error" : 
                    expense.priority === "Important" ? "warning" : 
                    expense.priority === "Nice to Have" ? "info" : 
                    "default"
                  } 
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={() => onEdit(expense.id)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDelete(expense.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpenseTable;