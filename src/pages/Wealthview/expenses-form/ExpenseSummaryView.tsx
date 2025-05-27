import { 
  Typography, 
  Box,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton
} from "@mui/material";
import { ExpenseInfoForm } from '../../../types';
import { 
  formatCurrency, 
  calculateMonthlyEquivalent, 
  calculateTotalMonthly,
  countByPriority,
  calculateTaxDeductible,
  calculateCategoryTotals,
  getAllExpenses
} from '../../../utils/expenseTracking';

interface ExpenseSummaryViewProps {
  expenses: ExpenseInfoForm;
  onEdit: () => void;
  isLoading?: boolean;
}

function ExpenseSummaryView({ expenses, onEdit, isLoading = false }: ExpenseSummaryViewProps) {
  const totalMonthly = calculateTotalMonthly(expenses);
  const priorityData = countByPriority(expenses);
  const taxDeductibleData = calculateTaxDeductible(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);
  
  const allExpenses = getAllExpenses(expenses);
  const hasExpenses = allExpenses.length > 0;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!hasExpenses) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Expense Summary</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
            No expense information found. Click below to start adding your expenses.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={onEdit}>
              Add Expense Information
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="outlined" color="primary" onClick={onEdit}>
          Edit Expense Information
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Expense Summary</Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary">Total Monthly Expenses: {formatCurrency(totalMonthly)}</Typography>
          {taxDeductibleData.count > 0 && (
            <Typography variant="subtitle1" color="info.main">
              Tax Deductible: {formatCurrency(taxDeductibleData.total)} ({taxDeductibleData.count} expenses)
            </Typography>
          )}
        </Box>

        <Typography variant="h6" gutterBottom>Breakdown by Category</Typography>
        <Grid container spacing={3}>
          {categoryTotals.map((category) => (
            <Grid item xs={12} md={6} lg={4} key={category.name}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1">{category.name}</Typography>
                <Typography variant="h6">{formatCurrency(category.total)}</Typography>
                <Typography variant="caption">
                  {Math.round(category.percentage)}% of total • {category.count} expense{category.count !== 1 ? 's' : ''}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Breakdown by Priority</Typography>
        <Grid container spacing={3}>
          {Object.entries(priorityData).map(([priority, data]) => {
            if (data.count > 0) {
              return (
                <Grid item xs={12} md={6} lg={3} key={priority}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: '4px solid', 
                      borderColor: 
                        priority === "Essential" ? "error.main" : 
                        priority === "Important" ? "warning.main" : 
                        priority === "Nice to Have" ? "info.main" : 
                        "action.disabled"
                    }}
                  >
                    <Typography variant="subtitle1">{priority}</Typography>
                    <Typography variant="h6">{formatCurrency(data.total)}</Typography>
                    <Typography variant="caption">
                      {data.count} expense{data.count !== 1 ? 's' : ''} ({Math.round((data.total / totalMonthly) * 100)}%)
                    </Typography>
                  </Paper>
                </Grid>
              );
            }
            return null;
          })}
        </Grid>
        
        {/* Top Expenses Section */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Largest Monthly Expenses</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Expense</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Monthly Amount</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getAllExpenses(expenses)
                .sort((a, b) => {
                  const amountA = calculateMonthlyEquivalent(a.amount, a.frequency);
                  const amountB = calculateMonthlyEquivalent(b.amount, b.frequency);
                  return amountB - amountA;
                })
                .slice(0, 5)
                .map((expense) => {
                  const monthlyAmount = calculateMonthlyEquivalent(expense.amount, expense.frequency);
                  const percentage = totalMonthly > 0 ? (monthlyAmount / totalMonthly) * 100 : 0;
                  
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description || expense.subcategory}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell align="right">{formatCurrency(monthlyAmount)}</TableCell>
                      <TableCell align="right">{percentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// Loading skeleton for better UX during data fetch
const LoadingSkeleton = () => (
  <Box>
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="80%" height={30} sx={{ mb: 3 }} />
      
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} md={6} lg={3} key={item}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
        ))}
      </Grid>
      
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={150} />
    </Paper>
    
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Skeleton variant="rectangular" width={150} height={40} />
    </Box>
  </Box>
);

export default ExpenseSummaryView;