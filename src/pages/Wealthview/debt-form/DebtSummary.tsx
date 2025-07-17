import { 
  Typography, 
  Box,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  LinearProgress
} from "@mui/material";
import { DebtProfileForm, BaseDebt } from '../../../types';
import { formatCurrency } from '../../../utils/assetsFunction'


interface DebtSummaryProps {
  debtProfile: DebtProfileForm;
  totalDebt: number;
  totalMonthlyPayment: number;
  onEdit: () => void;
}

function DebtSummary({ debtProfile, totalDebt, totalMonthlyPayment, onEdit }: DebtSummaryProps) {
  // Calculate debt breakdown by category
  const calculateDebtBreakdown = () => {
    const categories = [
      { key: 'mortgages', label: 'Mortgages' },
      { key: 'autoLoans', label: 'Auto Loans' },
      { key: 'studentLoans', label: 'Student Loans' },
      { key: 'creditCards', label: 'Credit Cards' },
      { key: 'personalLoans', label: 'Personal Loans' },
      { key: 'otherDebts', label: 'Other Debts' }
    ];

    return categories.map(category => {
      const debts = debtProfile[category.key as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[];
      const totalAmount = debts.reduce((sum, debt) => sum + Number(debt.currentBalance), 0);
      const percentage = totalDebt > 0 ? (totalAmount / totalDebt) * 100 : 0;
      return {
        category: category.label,
        amount: totalAmount,
        percentage,
        count: debts.length
      };
    }).filter(item => item.count > 0); // Only show categories with debts
  };

  // Calculate average interest rate weighted by debt amount
  const calculateAverageInterestRate = (): number => {
    let totalWeightedInterest = 0;
    let totalDebtForCalculation = 0;
    
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    
    categories.forEach(category => {
      const debts = debtProfile[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[];
      debts.forEach(debt => {
        const balance = Number(debt.currentBalance) || 0;
        const rate = Number(debt.interestRate) || 0;
        
        totalWeightedInterest += balance * rate;
        totalDebtForCalculation += balance;
      });
    });
    
    return totalDebtForCalculation > 0 ? totalWeightedInterest / totalDebtForCalculation : 0;
  };

  // Get highest interest rate debt
  const getHighestInterestDebt = (): { rate: number; type: string; lender: string } => {
    let highestRate = 0;
    let highestRateDebt = { rate: 0, type: 'None', lender: 'None' };
    
    const categories = [
      { key: 'mortgages', label: 'Mortgage' },
      { key: 'autoLoans', label: 'Auto Loan' },
      { key: 'studentLoans', label: 'Student Loan' },
      { key: 'creditCards', label: 'Credit Card' },
      { key: 'personalLoans', label: 'Personal Loan' },
      { key: 'otherDebts', label: 'Other' }
    ];
    
    categories.forEach(category => {
      const debts = debtProfile[category.key as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[];
      debts.forEach(debt => {
        const interestRate = Number(debt.interestRate) || 0;
        if (interestRate > highestRate) {
          highestRate = interestRate;
          highestRateDebt = {
            rate: interestRate,
            type: category.label,
            lender: debt.lender
          };
        }
      });
    });
    
    return highestRateDebt;
  };

  // Get lowest interest rate debt
  const getLowestInterestDebt = (): { rate: number; type: string; lender: string } => {
    let lowestRate = Number.MAX_VALUE;
    let lowestRateDebt = { rate: 0, type: 'None', lender: 'None' };
    
    const categories = [
      { key: 'mortgages', label: 'Mortgage' },
      { key: 'autoLoans', label: 'Auto Loan' },
      { key: 'studentLoans', label: 'Student Loan' },
      { key: 'creditCards', label: 'Credit Card' },
      { key: 'personalLoans', label: 'Personal Loan' },
      { key: 'otherDebts', label: 'Other' }
    ];
    
    categories.forEach(category => {
      const debts = debtProfile[category.key as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[];
      debts.forEach(debt => {
        const interestRate = Number(debt.interestRate) || 0;
        if (interestRate < lowestRate && interestRate > 0) {
          lowestRate = interestRate;
          lowestRateDebt = {
            rate: interestRate,
            type: category.label,
            lender: debt.lender
          };
        }
      });
    });
    
    return lowestRateDebt;
  };

  // Get debt with highest and lowest monthly payments
  const getExtremeMonthlyPaymentDebts = (): { highest: BaseDebt | null; lowest: BaseDebt | null } => {
    let highestPayment = 0;
    let lowestPayment = Number.MAX_VALUE;
    let highestPaymentDebt: BaseDebt | null = null;
    let lowestPaymentDebt: BaseDebt | null = null;
    
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    
    categories.forEach(category => {
      const debts = debtProfile[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[];
      debts.forEach(debt => {
        const monthlyPayment = Number(debt.monthlyPayment) || 0;
        if (monthlyPayment > highestPayment) {
          highestPayment = monthlyPayment;
          highestPaymentDebt = debt;
        }
        if (monthlyPayment < lowestPayment && monthlyPayment > 0) {
          lowestPayment = monthlyPayment;
          lowestPaymentDebt = debt;
        }
      });
    });
    
    return { highest: highestPaymentDebt, lowest: lowestPaymentDebt };
  };

  // Calculate total number of debts
  const getTotalDebtCount = (): number => {
    const categories = ['mortgages', 'autoLoans', 'studentLoans', 'creditCards', 'personalLoans', 'otherDebts'];
    return categories.reduce((count, category) => {
      return count + (debtProfile[category as keyof Omit<DebtProfileForm, 'debtStrategy'>] as BaseDebt[]).length;
    }, 0);
  };

  const debtBreakdown = calculateDebtBreakdown();
  const averageInterestRate = calculateAverageInterestRate();
  const highestInterestDebt = getHighestInterestDebt();
  const lowestInterestDebt = getLowestInterestDebt();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { highest: highestPaymentDebt, lowest: _lowestPaymentDebt } = getExtremeMonthlyPaymentDebts();
  const totalDebtCount = getTotalDebtCount();

  // Safe formatting functions
  const formatRate = (rate: number): string => {
    const numRate = Number(rate) || 0;
    return numRate.toFixed(2);
  };

  // Get a readable debt type name
  // const getDebtTypeName = (debtType: string): string => {
  //   const types: Record<string, string> = {
  //     'mortgage': 'Mortgage',
  //     'auto_loan': 'Auto Loan',
  //     'student_loan': 'Student Loan',
  //     'credit_card': 'Credit Card',
  //     'personal_loan': 'Personal Loan',
  //     'other': 'Other'
  //   };
  //   return types[debtType] || debtType;
  // };

  // Gets a status label for display
  const formatStatus = (status: string): string => {
    return status.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine status color for chips
  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    if (status === 'current' || status === 'paid_off') return 'success';
    if (status === 'past_due' || status === 'in_grace_period') return 'warning';
    if (status === 'delinquent' || status === 'in_collection' || status === 'default') return 'error';
    return 'default';
  };

  return (
    <div>
      <Box sx={{ mb: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={onEdit}>
            Edit Debt Profile
          </Button>
        </Box>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Debt
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(totalDebt)}
                  </Typography>
                  <Typography color="text.secondary">
                    Across {totalDebtCount} accounts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Monthly Payments
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(totalMonthlyPayment)}
                  </Typography>
                  <Typography color="text.secondary">
                    {totalDebt > 0 ? ((totalMonthlyPayment / totalDebt) * 100).toFixed(1) : "0.0"}% of total debt per month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Interest Rate
                  </Typography>
                  <Typography variant="h4" component="div">
                    {averageInterestRate.toFixed(2)}%
                  </Typography>
                  <Typography color="text.secondary">
                    Weighted by debt amount
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {debtBreakdown.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Debt Breakdown</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Debt Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Accounts</TableCell>
                        <TableCell>% of Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {debtBreakdown.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell>{item.percentage.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                {debtBreakdown.map((item) => (
                  <Box key={item.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2">{formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.percentage} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Key Insights</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Highest Interest Rate</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={`${formatRate(Number(highestInterestDebt.rate))}%`} 
                    color="error" 
                    sx={{ mr: 1 }} 
                  />
                  <Typography>
                    {highestInterestDebt.type} ({highestInterestDebt.lender})
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Lowest Interest Rate</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={`${formatRate(Number(lowestInterestDebt.rate))}%`} 
                    color="success" 
                    sx={{ mr: 1 }} 
                  />
                  <Typography>
                    {lowestInterestDebt.type} ({lowestInterestDebt.lender})
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Highest Monthly Payment</Typography>
                {highestPaymentDebt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={formatCurrency(highestPaymentDebt.monthlyPayment)} 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                    <Typography>
                      {highestPaymentDebt.lender} (Balance: {formatCurrency(highestPaymentDebt.currentBalance)})
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">Current Debt Strategy</Typography>
                <Typography sx={{ mt: 1 }}>
                  {debtProfile.debtStrategy?.currentStrategy === 'none' 
                    ? 'No specific strategy defined' 
                    : debtProfile.debtStrategy?.currentStrategy.charAt(0).toUpperCase() + 
                      debtProfile.debtStrategy?.currentStrategy.slice(1).replace(/([A-Z])/g, ' $1')}
                </Typography>
                {debtProfile.debtStrategy?.customStrategy && (
                  <Typography variant="body2" color="text.secondary">
                    {debtProfile.debtStrategy.customStrategy}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* All Debts Detail Table */}
        {totalDebtCount > 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>All Debts</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Lender</TableCell>
                    <TableCell>Current Balance</TableCell>
                    <TableCell>Monthly Payment</TableCell>
                    <TableCell>Interest Rate</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Combine all debts into one array for display */}
                  {(() => {
                    const allDebts: Array<BaseDebt & { type: string }> = [];
                    
                    // Add mortgages
                    debtProfile.mortgages.forEach(debt => {
                      allDebts.push({...debt, type: 'Mortgage'});
                    });
                    
                    // Add auto loans
                    debtProfile.autoLoans.forEach(debt => {
                      allDebts.push({...debt, type: 'Auto Loan'});
                    });
                    
                    // Add student loans
                    debtProfile.studentLoans.forEach(debt => {
                      allDebts.push({...debt, type: 'Student Loan'});
                    });
                    
                    // Add credit cards
                    debtProfile.creditCards.forEach(debt => {
                      allDebts.push({...debt, type: 'Credit Card'});
                    });
                    
                    // Add personal loans
                    debtProfile.personalLoans.forEach(debt => {
                      allDebts.push({...debt, type: 'Personal Loan'});
                    });
                    
                    // Add other debts
                    debtProfile.otherDebts.forEach(debt => {
                      allDebts.push({...debt, type: 'Other'});
                    });
                    
                    // Sort by balance descending
                    return allDebts
                      .sort((a, b) => b.currentBalance - a.currentBalance)
                      .map(debt => (
                        <TableRow key={debt.id}>
                          <TableCell>{debt.type}</TableCell>
                          <TableCell>{debt.lender}</TableCell>
                          <TableCell>{formatCurrency(debt.currentBalance)}</TableCell>
                          <TableCell>{formatCurrency(debt.monthlyPayment)}</TableCell>
                          <TableCell>{Number(debt.interestRate).toFixed(2)}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={formatStatus(debt.status)} 
                              color={getStatusColor(debt.status)} 
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ));
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

       
      </Box>
    </div>
  );
}

export default DebtSummary;