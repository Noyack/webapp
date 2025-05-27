import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  School as EducationIcon,
  LocalHospital as MedicalIcon,
  AccountBalance as LoanIcon,
  Help as HelpIcon,
  Savings as SavingsIcon,
  Money,
  Schedule
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';
// Types
interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: DebtType;
}
interface PaymentSchedule {
  month: number;
  remainingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  totalPaid: number;
  totalInterestPaid: number;
  debtName?: string;
}
interface PayoffSummary {
  months: number;
  totalInterestPaid: number;
  totalPaid: number;
}
interface DebtWithSchedule extends Debt {
  schedule: PaymentSchedule[];
  payoffDate: Date;
}
type DebtType = 'creditCard' | 'mortgage' | 'auto' | 'student' | 'medical' | 'personal' | 'other';
type PayoffMethod = 'snowball' | 'avalanche' | 'highestPaymentFirst' | 'lowestPaymentFirst' | 'balanced';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
// Debt Payoff Planner Component
const DebtPayoffPlanner = () => {
  // State hooks
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(1000);
  const [payoffMethod, setPayoffMethod] = useState<PayoffMethod>('snowball');
  const [payoffResults, setPayoffResults] = useState<{
    scheduleSummary: PaymentSchedule[];
    debtSchedules: DebtWithSchedule[];
    summary: PayoffSummary;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [detailedSchedule, setDetailedSchedule] = useState<Array<{
    month: number;
    date: string;
    totalPayment: number;
    debts: {
      name: string;
      payment: number;
      principal: number;
      interest: number;
      remainingBalance: number;
    }[];
  }>>([]);


  // Default new debt
  const defaultNewDebt: Debt = {
    id: '',
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'creditCard'
  };
  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  // Add or update a debt
  const saveDebt = () => {
    if (!editingDebt) return;
    // Validation
    if (!editingDebt.name || editingDebt.balance <= 0 || editingDebt.interestRate < 0 || editingDebt.minimumPayment <= 0) {
      return;
    }
    if (editingDebt.id) {
      // Update existing debt
      setDebts(debts.map(debt => debt.id === editingDebt.id ? editingDebt : debt));
    } else {
      // Add new debt
      const newDebt = { ...editingDebt, id: generateId() };
      setDebts([...debts, newDebt]);
    }
    // Reset editing state
    setEditingDebt(null);
  };
  // Delete a debt
  const deleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };
  // Start editing a debt
  const startEditDebt = (debt: Debt) => {
    setEditingDebt({ ...debt });
  };
  // Add a new debt
  const addNewDebt = () => {
    setEditingDebt({ ...defaultNewDebt, id: '' });
  };
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  // Get debt type icon
  const getDebtTypeIcon = (type: DebtType) => {
    switch (type) {
      case 'creditCard':
        return <CreditCardIcon />;
      case 'mortgage':
        return <HomeIcon />;
      case 'auto':
        return <CarIcon />;
      case 'student':
        return <EducationIcon />;
      case 'medical':
        return <MedicalIcon />;
      case 'personal':
        return <LoanIcon />;
      default:
        return <LoanIcon />;
    }
  };
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Format percentage
  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };
  // Calculate monthly interest for a debt
  const calculateMonthlyInterest = (balance: number, annualRate: number) => {
    return balance * (annualRate / 100 / 12);
  };
  // Sort debts based on the selected payoff method
  const sortDebtsByMethod = (debtsToSort: Debt[]): Debt[] => {
    const sortedDebts = [...debtsToSort];
    
    switch (payoffMethod) {
      case 'snowball':
        // Sort by balance (smallest first)
        sortedDebts.sort((a, b) => a.balance - b.balance);
        break;
      case 'avalanche':
        // Sort by interest rate (highest first)
        sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
        break;
      case 'highestPaymentFirst':
        // Sort by minimum payment (highest first)
        sortedDebts.sort((a, b) => b.minimumPayment - a.minimumPayment);
        break;
      case 'lowestPaymentFirst':
        // Sort by minimum payment (lowest first)
        sortedDebts.sort((a, b) => a.minimumPayment - b.minimumPayment);
        break;
      case 'balanced':
        // Sort by a combination of factors
        sortedDebts.sort((a, b) => {
          const aScore = (a.interestRate / 100) * a.balance;
          const bScore = (b.interestRate / 100) * b.balance;
          return bScore - aScore;
        });
        break;
      default:
        // Default to snowball
        sortedDebts.sort((a, b) => a.balance - b.balance);
    }
    
    return sortedDebts;
  };
  // Calculate payoff schedules
  const calculatePayoff = () => {
    if (debts.length === 0) return;
    
    // Make sure monthly budget is at least the sum of all minimum payments
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const effectiveMonthlyBudget = Math.max(monthlyBudget, totalMinPayments);
    
    // Sort debts based on the selected payoff method
    const sortedDebts = sortDebtsByMethod(debts);
    
    // Initialize debt schedules - convert Debt[] to DebtWithSchedule[]
    const debtSchedules: DebtWithSchedule[] = sortedDebts.map(debt => ({
      ...debt,
      schedule: [],
      payoffDate: new Date(),
    }));
    
    // Initialize tracking variables
    let month = 0;
    let totalPaid = 0;
    let totalInterestPaid = 0;
    let remainingDebts = [...debtSchedules]; // Now this is DebtWithSchedule[]
    const scheduleSummary: PaymentSchedule[] = [];
    
    // Continue until all debts are paid off
    while (remainingDebts.length > 0 && month < 600) { // Cap at 50 years for safety
      month++;
      
      // Calculate minimum payments and available extra payment
      let availableBudget = effectiveMonthlyBudget;
      let monthlyPayment = 0;
      let monthlyPrincipal = 0;
      let monthlyInterest = 0;
      
      // First, make minimum payments on all debts
      remainingDebts.forEach(debt => {
        const minPayment = Math.min(debt.minimumPayment, debt.balance + calculateMonthlyInterest(debt.balance, debt.interestRate));
        availableBudget -= minPayment;
      });
      
      // Then, distribute extra payment based on the priority
      for (let i = 0; i < remainingDebts.length; i++) {
        const debt = remainingDebts[i];
        
        // Calculate interest for this month
        const interest = calculateMonthlyInterest(debt.balance, debt.interestRate);
        
        // Calculate payment for this debt
        let payment = debt.minimumPayment;
        
        // Add extra payment if this is the targeted debt
        if (i === 0 && availableBudget > 0) {
          payment += availableBudget;
        }
        
        // Ensure payment doesn't exceed remaining balance plus this month's interest
        payment = Math.min(payment, debt.balance + interest);
        
        // Calculate principal and new balance
        const principal = payment - interest;
        const newBalance = Math.max(0, debt.balance - principal);
        
        // Update totals
        monthlyPayment += payment;
        monthlyPrincipal += principal;
        monthlyInterest += interest;
        totalPaid += payment;
        totalInterestPaid += interest;
        
        // Add this month to the debt's schedule
        debt.schedule.push({
          month,
          remainingBalance: newBalance,
          payment,
          principal,
          interest,
          totalPaid: debt.schedule.length > 0 
            ? debt.schedule[debt.schedule.length - 1].totalPaid + payment 
            : payment,
          totalInterestPaid: debt.schedule.length > 0 
            ? debt.schedule[debt.schedule.length - 1].totalInterestPaid + interest 
            : interest,
        });
        
        // Update debt balance
        debt.balance = newBalance;
        
        // If debt is paid off, calculate payoff date
        if (newBalance === 0) {
          const today = new Date();
          const payoffDate = new Date(today);
          payoffDate.setMonth(today.getMonth() + month);
          debt.payoffDate = payoffDate;
        }
      }
      
      // Add monthly summary
      scheduleSummary.push({
        month,
        remainingBalance: remainingDebts.reduce((sum, debt) => sum + debt.balance, 0),
        payment: monthlyPayment,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        totalPaid,
        totalInterestPaid
      });
      
      // Remove paid off debts
      remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
      
      // Re-sort the remaining debts if any have been paid off
      if (remainingDebts.length < debtSchedules.length - remainingDebts.length) {
        // Need to use a different solution here since sortDebtsByMethod expects Debt[]
        // We can sort based on the same criteria directly
        
        switch (payoffMethod) {
          case 'snowball':
            // Sort by balance (smallest first)
            remainingDebts.sort((a, b) => a.balance - b.balance);
            break;
          case 'avalanche':
            // Sort by interest rate (highest first)
            remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
            break;
          case 'highestPaymentFirst':
            // Sort by minimum payment (highest first)
            remainingDebts.sort((a, b) => b.minimumPayment - a.minimumPayment);
            break;
          case 'lowestPaymentFirst':
            // Sort by minimum payment (lowest first)
            remainingDebts.sort((a, b) => a.minimumPayment - b.minimumPayment);
            break;
          case 'balanced':
            // Sort by a combination of factors
            remainingDebts.sort((a, b) => {
              const aScore = (a.interestRate / 100) * a.balance;
              const bScore = (b.interestRate / 100) * b.balance;
              return bScore - aScore;
            });
            break;
          default:
            // Default to snowball
            remainingDebts.sort((a, b) => a.balance - b.balance);
        }
      }
    }
    
    // Set results
    setPayoffResults({
      scheduleSummary,
      debtSchedules,
      summary: {
        months: month,
        totalInterestPaid,
        totalPaid
      }
    });
  };
  // Generate detailed amortization schedule
  const generateDetailedSchedule = () => {
    if (!payoffResults) return [];
    
    const monthlyDetails: {
      month: number;
      date: string;
      totalPayment: number;
      debts: {
        name: string;
        payment: number;
        principal: number;
        interest: number;
        remainingBalance: number;
      }[];
    }[] = [];
    
    // Get max months
    const maxMonths = Math.max(...payoffResults.debtSchedules.map(d => d.schedule.length));
    
    // Generate monthly details
    for (let month = 1; month <= maxMonths; month++) {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setMonth(today.getMonth() + month - 1);
      
      const monthDetail = {
        month,
        date: futureDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        totalPayment: 0,
        debts: [] as {
          name: string;
          payment: number;
          principal: number;
          interest: number;
          remainingBalance: number;
        }[]
      };
      
      // Add details for each debt
      payoffResults.debtSchedules.forEach(debt => {
        if (month <= debt.schedule.length) {
          const paymentDetail = debt.schedule[month - 1];
          monthDetail.totalPayment += paymentDetail.payment;
          monthDetail.debts.push({
            name: debt.name,
            payment: paymentDetail.payment,
            principal: paymentDetail.principal,
            interest: paymentDetail.interest,
            remainingBalance: paymentDetail.remainingBalance
          });
        }
      });
      
      monthlyDetails.push(monthDetail);
    }
    
    return monthlyDetails;
  };

  // Prepare export data
  const prepareExportData = (): GenericExportData => {
    if (!payoffResults) {
      return {
        calculatorName: 'Debt Payoff Planner',
        inputs: {},
        keyMetrics: [],
        recommendations: []
      };
    }

    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate * debt.balance, 0) / totalDebt;
    const monthsToPayoff = payoffResults.summary.months;
    const totalInterestSaved = debts.reduce((sum, debt) => {
      // Calculate interest if paying minimums only
      const minimumOnlyInterest = debt.balance * (debt.interestRate / 100) * (debt.balance / debt.minimumPayment / 12);
      return sum + minimumOnlyInterest;
    }, 0) - payoffResults.summary.totalInterestPaid;

    // Prepare detailed payment schedule data
    const detailedPaymentSchedule = payoffResults.scheduleSummary.map((month, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() + index);
      return {
        month: month.month,
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        totalPayment: month.payment,
        principalPayment: month.principal,
        interestPayment: month.interest,
        remainingBalance: month.remainingBalance,
        totalPaid: month.totalPaid,
        totalInterestPaid: month.totalInterestPaid
      };
    });

    // Prepare debt-specific payment schedules
    const debtSpecificSchedules = payoffResults.debtSchedules.map(debt => ({
      debtName: debt.name,
      debtType: debt.type,
      startingBalance: debts.find(d => d.id === debt.id)?.balance || 0,
      interestRate: debt.interestRate,
      minimumPayment: debt.minimumPayment,
      payoffDate: debt.payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      monthsToPayoff: debt.schedule.length,
      totalInterestPaid: debt.schedule.reduce((sum, payment) => sum + payment.interest, 0),
      schedule: debt.schedule.map((payment, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() + index);
        return {
          month: payment.month,
          date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          payment: payment.payment,
          principal: payment.principal,
          interest: payment.interest,
          remainingBalance: payment.remainingBalance,
          totalPaid: payment.totalPaid,
          totalInterestPaid: payment.totalInterestPaid
        };
      })
    }));

    // Prepare monthly debt distribution (showing how much goes to each debt each month)
    const monthlyDebtDistribution = detailedSchedule.map(month => ({
      month: month.month,
      date: month.date,
      totalPayment: month.totalPayment,
      ...month.debts.reduce((acc, debt) => ({
        ...acc,
        [`${debt.name}_payment`]: debt.payment,
        [`${debt.name}_principal`]: debt.principal,
        [`${debt.name}_interest`]: debt.interest,
        [`${debt.name}_balance`]: debt.remainingBalance
      }), {})
    }));

    return {
      calculatorName: 'Debt Payoff Planner',
      inputs: {
        payoffMethod: payoffMethod,
        monthlyBudget: monthlyBudget,
        numberOfDebts: debts.length,
        totalDebt: totalDebt,
        totalMinimumPayments: totalMinPayments,
        extraPaymentAmount: Math.max(0, monthlyBudget - totalMinPayments),
        debts: debts.map(debt => ({
          name: debt.name,
          type: debt.type,
          balance: debt.balance,
          interestRate: debt.interestRate,
          minimumPayment: debt.minimumPayment
        }))
      },
      keyMetrics: [
        { label: 'Total Debt', value: `$${totalDebt.toLocaleString()}` },
        { label: 'Number of Debts', value: debts.length },
        { label: 'Average Interest Rate', value: `${avgInterestRate.toFixed(2)}%` },
        { label: 'Monthly Budget', value: `$${monthlyBudget.toLocaleString()}` },
        { label: 'Total Minimum Payments', value: `$${totalMinPayments.toLocaleString()}` },
        { label: 'Extra Payment Power', value: `$${Math.max(0, monthlyBudget - totalMinPayments).toLocaleString()}` },
        { label: 'Payoff Method', value: payoffMethod.charAt(0).toUpperCase() + payoffMethod.slice(1).replace(/([A-Z])/g, ' $1') },
        { label: 'Time to Debt Freedom', value: `${Math.floor(monthsToPayoff / 12)} years, ${monthsToPayoff % 12} months` },
        { label: 'Total Interest Paid', value: `$${payoffResults.summary.totalInterestPaid.toLocaleString()}` },
        { label: 'Total Amount Paid', value: `$${payoffResults.summary.totalPaid.toLocaleString()}` },
        { label: 'Interest Savings vs Minimum Payments', value: `$${totalInterestSaved.toLocaleString()}` }
      ],
      summary: {
        totalDebt: totalDebt,
        monthlyBudget: monthlyBudget,
        payoffMethod: payoffMethod,
        monthsToPayoff: monthsToPayoff,
        totalInterestPaid: payoffResults.summary.totalInterestPaid,
        totalPaid: payoffResults.summary.totalPaid,
        interestSavings: totalInterestSaved,
        avgInterestRate: avgInterestRate,
        debtFreeDate: new Date(new Date().getFullYear(), new Date().getMonth() + monthsToPayoff, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      },
      tableData: monthlyDebtDistribution,
      recommendations: [
        monthlyBudget <= totalMinPayments ? 'Your budget only covers minimum payments. Consider increasing your monthly budget or finding additional income to accelerate debt payoff.' : `Excellent! You have $${(monthlyBudget - totalMinPayments).toLocaleString()} extra each month to attack your debt.`,
        payoffMethod === 'snowball' ? 'The Debt Snowball method focuses on smallest balances first for psychological wins and momentum.' : payoffMethod === 'avalanche' ? 'The Debt Avalanche method saves the most money by targeting highest interest rates first.' : 'Your chosen method balances multiple factors for a strategic approach.',
        `With your current plan, you'll be debt-free in ${Math.floor(monthsToPayoff / 12)} years and ${monthsToPayoff % 12} months.`,
        totalInterestSaved > 0 ? `By following this plan instead of paying minimums, you'll save approximately $${totalInterestSaved.toLocaleString()} in interest.` : 'Consider increasing your monthly budget to save more on interest payments.',
        'Consider using windfalls (tax refunds, bonuses) to make extra payments toward your highest priority debt.',
        'Avoid taking on new debt while following this payoff plan.',
        'Build a small emergency fund ($1,000) before aggressively paying off debt to avoid relying on credit cards.',
        avgInterestRate > 15 ? 'Your average interest rate is high. Consider debt consolidation or balance transfer options.' : 'Your interest rates are manageable with your current strategy.',
        'Track your progress monthly and celebrate milestones to stay motivated.',
        'Consider the debt snowflake method: put any extra money (even small amounts) toward debt.'
      ],
      // Additional detailed data for comprehensive export
      additionalData: {
        detailedPaymentSchedule: detailedPaymentSchedule,
        debtSpecificSchedules: debtSpecificSchedules,
        payoffOrder: payoffResults.debtSchedules.map((debt, index) => ({
          order: index + 1,
          debtName: debt.name,
          debtType: debt.type,
          startingBalance: debts.find(d => d.id === debt.id)?.balance || 0,
          interestRate: debt.interestRate,
          minimumPayment: debt.minimumPayment,
          payoffDate: debt.payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          monthsToPayoff: debt.schedule.length,
          totalInterestPaid: debt.schedule.reduce((sum, payment) => sum + payment.interest, 0)
        }))
      }
    };
  };

  // Calculate payoff when relevant inputs change
  useEffect(() => {
    if (debts.length > 0) {
      calculatePayoff();
    }
    if (payoffResults) {
        setDetailedSchedule(generateDetailedSchedule());
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debts, monthlyBudget, payoffMethod]);

  return (
    <Box className="debt-payoff-planner p-4 bg-gray-50 rounded-lg">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Debt Payoff Planner
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="debt payoff tabs">
          <Tab label="My Debts" />
          <Tab label="Payoff Strategy" />
          <Tab label="Results" disabled={debts.length === 0} />
          <Tab label="Payment Schedule" disabled={!payoffResults} />
        </Tabs>
      </Box>
      
      {/* My Debts Tab */}
      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={editingDebt ? 8 : 12}>
              <Paper elevation={2} className="p-4">
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Your Debts</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={addNewDebt}
                    className="bg-[#2E7D32]"
                  >
                    Add Debt
                  </Button>
                </Box>
                
                {debts.length === 0 ? (
                  <Box className="text-center p-6">
                    <Typography variant="subtitle1" className="mb-2 text-gray-500">
                      You haven't added any debts yet
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      Click "Add Debt" to get started
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Debt</TableCell>
                          <TableCell align="right">Balance</TableCell>
                          <TableCell align="right">Interest Rate</TableCell>
                          <TableCell align="right">Min. Payment</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debts.map((debt) => (
                          <TableRow key={debt.id}>
                            <TableCell>
                              <Box className="flex items-center">
                                {getDebtTypeIcon(debt.type)}
                                <Typography className="ml-2">{debt.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(debt.balance)}</TableCell>
                            <TableCell align="right">{formatPercent(debt.interestRate)}</TableCell>
                            <TableCell align="right">{formatCurrency(debt.minimumPayment)}</TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => startEditDebt(debt)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => deleteDebt(debt.id)}
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
                
                {debts.length > 0 && (
                  <Box className="mt-4 p-3 bg-gray-50 rounded">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" className="text-gray-600">
                          Total Debt:
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(debts.reduce((sum, debt) => sum + debt.balance, 0))}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" className="text-gray-600">
                          Average Interest Rate:
                        </Typography>
                        <Typography variant="h6">
                          {formatPercent(debts.reduce((sum, debt) => sum + debt.interestRate * debt.balance, 0) / 
                            debts.reduce((sum, debt) => sum + debt.balance, 0))}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" className="text-gray-600">
                          Total Minimum Payment:
                        </Typography>
                        <Typography variant="h6">
                          {formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
              
              {debts.length > 0 && (
                <Paper elevation={2} className="p-4 mt-4">
                  <Typography variant="h6" className="mb-3">Debt Breakdown</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={debts.map(debt => ({
                              name: debt.name,
                              value: debt.balance
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {debts.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value: number) => formatCurrency(value)} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box className="h-full flex flex-col justify-center">
                        <Typography variant="subtitle1" className="mb-2">
                          Debt Type Breakdown
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                          {Array.from(new Set(debts.map(debt => debt.type))).map(type => (
                            <Chip
                              key={type}
                              icon={getDebtTypeIcon(type)}
                              label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${
                                formatCurrency(
                                  debts
                                    .filter(debt => debt.type === type)
                                    .reduce((sum, debt) => sum + debt.balance, 0)
                                )
                              }`}
                              variant="outlined"
                              className="mb-1"
                            />
                          ))}
                        </Box>
                        
                        <Typography variant="subtitle1" className="mt-4 mb-2">
                          Interest Rate Range
                        </Typography>
                        <Typography>
                          Lowest: {formatPercent(Math.min(...debts.map(debt => debt.interestRate)))}
                        </Typography>
                        <Typography>
                          Highest: {formatPercent(Math.max(...debts.map(debt => debt.interestRate)))}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Grid>
            
            {editingDebt && (
              <Grid item xs={12} md={4}>
                <Paper elevation={3} className="p-4">
                  <Typography variant="h6" className="mb-3">
                    {editingDebt.id ? 'Edit Debt' : 'Add New Debt'}
                  </Typography>
                  
                  <Box component="form" className="flex flex-col gap-4">
                    <TextField
                      label="Debt Name"
                      value={editingDebt.name}
                      onChange={(e) => setEditingDebt({ ...editingDebt, name: e.target.value })}
                      fullWidth
                      required
                    />
                    
                    <FormControl fullWidth>
                      <InputLabel>Debt Type</InputLabel>
                      <Select
                        value={editingDebt.type}
                        onChange={(e) => setEditingDebt({ ...editingDebt, type: e.target.value as DebtType })}
                        label="Debt Type"
                      >
                        <MenuItem value="creditCard">Credit Card</MenuItem>
                        <MenuItem value="mortgage">Mortgage</MenuItem>
                        <MenuItem value="auto">Auto Loan</MenuItem>
                        <MenuItem value="student">Student Loan</MenuItem>
                        <MenuItem value="medical">Medical Debt</MenuItem>
                        <MenuItem value="personal">Personal Loan</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label="Current Balance"
                      type="number"
                      value={editingDebt.balance}
                      onChange={(e) => setEditingDebt({ 
                        ...editingDebt, 
                        balance: Math.max(0, Number(e.target.value)) 
                      })}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    
                    <TextField
                      label="Interest Rate"
                      type="number"
                      value={editingDebt.interestRate}
                      onChange={(e) => setEditingDebt({ 
                        ...editingDebt, 
                        interestRate: Math.max(0, Number(e.target.value)) 
                      })}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                    
                    <TextField
                      label="Minimum Monthly Payment"
                      type="number"
                      value={editingDebt.minimumPayment}
                      onChange={(e) => setEditingDebt({ 
                        ...editingDebt, 
                        minimumPayment: Math.max(0, Number(e.target.value)) 
                      })}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    
                    <Box className="flex gap-2 justify-end mt-2">
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditingDebt(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={saveDebt}
                        className="bg-[#2E7D32]"
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      
      {/* Payoff Strategy Tab */}
      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Payment Strategy</Typography>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom>
                    Monthly Payment Budget
                  </Typography>
                  <TextField
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Math.max(0, Number(e.target.value)))}
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  {debts.length > 0 && (
                    <Typography variant="caption" className="text-gray-500 mt-1 block">
                      Minimum required: {formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))}
                    </Typography>
                  )}
                </Box>
                
                <Box className="mb-4">
                  <Typography variant="subtitle1" gutterBottom className="flex items-center">
                    Debt Payoff Method
                    <Tooltip title="Choose a strategy for paying off your debts">
                      <IconButton size="small">
                        <HelpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={payoffMethod}
                      onChange={(e) => setPayoffMethod(e.target.value as PayoffMethod)}
                    >
                      <MenuItem value="snowball">Debt Snowball (Smallest Balance First)</MenuItem>
                      <MenuItem value="avalanche">Debt Avalanche (Highest Interest First)</MenuItem>
                      <MenuItem value="highestPaymentFirst">Highest Payment First</MenuItem>
                      <MenuItem value="lowestPaymentFirst">Lowest Payment First</MenuItem>
                      <MenuItem value="balanced">Balanced Approach</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box className="mt-3 p-3 bg-blue-50 rounded text-blue-800">
                    {payoffMethod === 'snowball' && (
                      <Typography variant="body2">
                        <strong>Debt Snowball:</strong> Pay minimum payments on all debts, then put extra money toward the smallest debt first. Once that's paid off, roll that payment into the next smallest debt, creating a "snowball" effect. This method provides quick wins for psychological motivation.
                      </Typography>
                    )}
                    {payoffMethod === 'avalanche' && (
                      <Typography variant="body2">
                        <strong>Debt Avalanche:</strong> Pay minimum payments on all debts, then put extra money toward the debt with the highest interest rate first. Once that's paid off, move to the next highest interest rate. This method saves the most money in interest.
                      </Typography>
                    )}
                    {payoffMethod === 'highestPaymentFirst' && (
                      <Typography variant="body2">
                        <strong>Highest Payment First:</strong> Focus on paying off the debt with the highest minimum payment first. This can help free up monthly cash flow more quickly.
                      </Typography>
                    )}
                    {payoffMethod === 'lowestPaymentFirst' && (
                      <Typography variant="body2">
                        <strong>Lowest Payment First:</strong> Focus on paying off the debt with the lowest minimum payment first. This can be useful for simplifying your financial life by reducing the number of different payments.
                      </Typography>
                    )}
                    {payoffMethod === 'balanced' && (
                      <Typography variant="body2">
                        <strong>Balanced Approach:</strong> This method considers both balance and interest rate, prioritizing debts that have high interest and high balances. It aims to balance financial efficiency with psychological motivation.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
              
              {payoffResults && (
                <Paper elevation={2} className="p-4 mt-4">
                  <Typography variant="h6" className="mb-3">Payment Strategy Summary</Typography>
                  
                  <Box className="grid grid-cols-2 gap-4">
                    <Card className="bg-gray-50">
                      <CardContent>
                        <Typography className="text-gray-600 text-sm">Total Months to Debt-Free</Typography>
                        <Typography variant="h5" className="font-bold">{payoffResults.summary.months}</Typography>
                        <Typography className="text-gray-600 text-sm">
                          {Math.floor(payoffResults.summary.months / 12)} years, {payoffResults.summary.months % 12} months
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardContent>
                        <Typography className="text-gray-600 text-sm">Total Interest Paid</Typography>
                        <Typography variant="h5" className="font-bold">{formatCurrency(payoffResults.summary.totalInterestPaid)}</Typography>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardContent>
                        <Typography className="text-gray-600 text-sm">Total Amount Paid</Typography>
                        <Typography variant="h5" className="font-bold">{formatCurrency(payoffResults.summary.totalPaid)}</Typography>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50">
                      <CardContent>
                        <Typography className="text-gray-600 text-sm">Debt-Free Date</Typography>
                        <Typography variant="h5" className="font-bold">
                          {new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + payoffResults.summary.months,
                            1
                          ).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Paper>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {payoffResults && (
                <Paper elevation={2} className="p-4">
                  <Typography variant="h6" className="mb-3">Payoff Order</Typography>
                  
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="text-gray-600 mb-2">
                      Based on the {payoffMethod === 'snowball' ? 'Debt Snowball' : 
                                     payoffMethod === 'avalanche' ? 'Debt Avalanche' : 
                                     payoffMethod === 'highestPaymentFirst' ? 'Highest Payment First' :
                                     payoffMethod === 'lowestPaymentFirst' ? 'Lowest Payment First' :
                                     'Balanced'} method, this is the order in which your debts will be paid off:
                    </Typography>
                    
                    {payoffResults.debtSchedules.map((debt, index) => (
                      <Box 
                        key={debt.id} 
                        className="flex items-center p-3 border-b last:border-b-0"
                      >
                        <Box className="h-8 w-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mr-3">
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1">{debt.name}</Typography>
                          <Box className="flex gap-4 text-sm text-gray-600">
                            <Typography>{formatCurrency(debt.balance)}</Typography>
                            <Typography>{formatPercent(debt.interestRate)}</Typography>
                          </Box>
                        </Box>
                        <Box className="ml-auto">
                          <Chip 
                            label={formatDate(debt.payoffDate)} 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  
                  <Divider className="my-4" />
                  
                  <Typography variant="h6" className="mb-3">Payoff Progress</Typography>
                  <Box className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={payoffResults.scheduleSummary}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)} 
                          labelFormatter={(label) => `Month ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="remainingBalance" 
                          name="Remaining Balance" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalInterestPaid" 
                          name="Total Interest Paid" 
                          stroke="#82ca9d" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              )}
              
              {!payoffResults && (
                <Paper elevation={2} className="p-4 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                  <SavingsIcon color="primary" style={{ fontSize: 64, opacity: 0.5 }} />
                  <Typography variant="h6" className="mt-4 text-gray-500">
                    Add your debts to see your payoff plan
                  </Typography>
                  <Typography variant="body2" className="mt-2 text-gray-400 text-center max-w-md">
                    Once you've added your debts, you'll see your payoff strategy details here
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveTab(0)}
                    className="mt-4 bg-[#2E7D32]"
                  >
                    Add Debts
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Results Tab */}
      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && payoffResults && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Debt Payoff Results</Typography>
                
                <Grid container spacing={4} className="mb-6">
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <Schedule color="primary" className="mr-2" />
                          <Typography variant="h6">Time to Debt-Free</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {payoffResults.summary.months}
                        </Typography>
                        <Typography variant="subtitle1">
                          months
                        </Typography>
                        <Typography className="text-gray-600 mt-2">
                          {Math.floor(payoffResults.summary.months / 12)} years, {payoffResults.summary.months % 12} months
                        </Typography>
                        <Typography className="text-gray-600 mt-1">
                          Debt-free by {new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + payoffResults.summary.months,
                            1
                          ).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <SavingsIcon color="primary" className="mr-2" />
                          <Typography variant="h6">Total Paid Off</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(payoffResults.summary.totalPaid)}
                        </Typography>
                        <Box className="mt-2">
                          <Typography className="text-gray-600">
                            Original debt: {formatCurrency(debts.reduce((sum, debt) => sum + debt.balance, 0))}
                          </Typography>
                          <Typography className="text-gray-600">
                            Interest paid: {formatCurrency(payoffResults.summary.totalInterestPaid)}
                          </Typography>
                          <Typography className="text-gray-600">
                            Interest percentage: {((payoffResults.summary.totalInterestPaid / payoffResults.summary.totalPaid) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <Money color="primary" className="mr-2" />
                          <Typography variant="h6">Monthly Payment</Typography>
                        </Box>
                        <Typography variant="h3" className="font-bold">
                          {formatCurrency(monthlyBudget)}
                        </Typography>
                        <Box className="mt-2">
                          <Typography className="text-gray-600">
                            Minimum required: {formatCurrency(debts.reduce((sum, debt) => sum + debt.minimumPayment, 0))}
                          </Typography>
                          <Typography className="text-gray-600">
                            Extra payment: {formatCurrency(Math.max(0, monthlyBudget - debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)))}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card className="bg-gray-50 h-full">
                      <CardContent>
                        <Box className="flex items-center mb-2">
                          <LoanIcon color="primary" className="mr-2" />
                          <Typography variant="h6">Strategy Used</Typography>
                        </Box>
                        <Typography variant="h5" className="font-bold">
                          {payoffMethod === 'snowball' ? 'Debt Snowball' : 
                           payoffMethod === 'avalanche' ? 'Debt Avalanche' : 
                           payoffMethod === 'highestPaymentFirst' ? 'Highest Payment First' :
                           payoffMethod === 'lowestPaymentFirst' ? 'Lowest Payment First' :
                           'Balanced Approach'}
                        </Typography>
                        <Typography className="text-gray-600 mt-2">
                          {payoffMethod === 'snowball' 
                            ? 'Smallest balance first' 
                            : payoffMethod === 'avalanche'
                            ? 'Highest interest first'
                            : payoffMethod === 'highestPaymentFirst'
                            ? 'Highest payment first'
                            : payoffMethod === 'lowestPaymentFirst'
                            ? 'Lowest payment first'
                            : 'Balance of interest & size'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box className="mb-6">
                  <Typography variant="h6" className="mb-3">Balance Reduction Over Time</Typography>
                  <Box className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={payoffResults.scheduleSummary}
                        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ value: 'Month', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                        />
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)} 
                          labelFormatter={(label) => `Month ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="remainingBalance" 
                          name="Remaining Balance" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalPaid" 
                          name="Total Paid" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalInterestPaid" 
                          name="Total Interest Paid" 
                          stroke="#ffc658" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="h6" className="mb-3">Individual Debt Payoff Timeline</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Debt Name</TableCell>
                          <TableCell align="right">Starting Balance</TableCell>
                          <TableCell align="right">Interest Rate</TableCell>
                          <TableCell align="right">Payoff Date</TableCell>
                          <TableCell align="right">Months to Payoff</TableCell>
                          <TableCell align="right">Total Interest</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payoffResults.debtSchedules.map((debt) => (
                          <TableRow key={debt.id}>
                            <TableCell>
                              <Box className="flex items-center">
                                {getDebtTypeIcon(debt.type)}
                                <Typography className="ml-2">{debt.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(debts.find(d => d.id === debt.id)?.balance || 0)}</TableCell>
                            <TableCell align="right">{formatPercent(debt.interestRate)}</TableCell>
                            <TableCell align="right">{formatDate(debt.payoffDate)}</TableCell>
                            <TableCell align="right">{debt.schedule.length}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(debt.schedule.reduce((sum, payment) => sum + payment.interest, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box className="mt-6 text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveTab(1)}
                    className="mx-2 bg-[#2E7D32]"
                  >
                    Adjust Strategy
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setActiveTab(3)}
                    className="mx-2"
                  >
                    View Payment Schedule
                  </Button>
                </Box>

                {/* Export Section */}
                <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Export Your Debt Payoff Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                    Download your debt analysis, payment strategy, and month-by-month schedule
                  </Typography>
                  <ExportButtons data={prepareExportData()} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Payment Schedule Tab */}
      <Box role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && payoffResults && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={2} className="p-4">
                <Typography variant="h6" className="mb-4">Detailed Payment Schedule</Typography>
                
                <Typography variant="body2" className="mb-4">
                  This schedule shows exactly how your payments will be distributed across your debts each month using the {
                    payoffMethod === 'snowball' ? 'Debt Snowball' : 
                    payoffMethod === 'avalanche' ? 'Debt Avalanche' : 
                    payoffMethod === 'highestPaymentFirst' ? 'Highest Payment First' :
                    payoffMethod === 'lowestPaymentFirst' ? 'Lowest Payment First' :
                    'Balanced'
                  } method.
                </Typography>
                
                <Box className="mb-6">
                  {payoffResults.summary.months > 36 && (
                    <Typography color="warning" className="mb-4">
                      Your plan includes {payoffResults.summary.months} months. For readability, only showing the first 36 months below.
                    </Typography>
                  )}
                  
                  <TableContainer style={{ maxHeight: '600px' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Total Payment</TableCell>
                          <TableCell align="right">Principal</TableCell>
                          <TableCell align="right">Interest</TableCell>
                          <TableCell align="right">Remaining Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payoffResults.scheduleSummary.slice(0, 36).map((month) => {
                          const date = new Date();
                          date.setMonth(date.getMonth() + month.month - 1);
                          
                          return (
                            <TableRow key={month.month}>
                              <TableCell>{month.month}</TableCell>
                              <TableCell>
                                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                              </TableCell>
                              <TableCell align="right">{formatCurrency(month.payment)}</TableCell>
                              <TableCell align="right">{formatCurrency(month.principal)}</TableCell>
                              <TableCell align="right">{formatCurrency(month.interest)}</TableCell>
                              <TableCell align="right">{formatCurrency(month.remainingBalance)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Divider className="my-6" />
                
                <Typography variant="h6" className="mb-4">Debt-specific Payment Schedules</Typography>
                <Box className="mb-4">
                  <Tabs
                    value={showHelp ? 999 : 0}
                    onChange={(_e, val) => setShowHelp(val === 999)}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Summary View" value={0} />
                    {/* {payoffResults.debtSchedules.map((debt, index) => (
                    //   <Tab key={debt.id} label={debt.name} value={index + 1} />
                    ))} */}
                    <Tab 
                      label="How to Read This" 
                      value={999}
                      icon={<HelpIcon />}
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>
                
                {showHelp ? (
                  <Paper elevation={1} className="p-4 bg-blue-50">
                    <Typography variant="h6" className="mb-2">Understanding Your Payment Schedule</Typography>
                    <Typography variant="body2" paragraph>
                      Your payment schedule shows how your monthly budget of {formatCurrency(monthlyBudget)} is distributed across your debts.
                    </Typography>
                    
                    <Typography variant="subtitle2">The schedule includes:</Typography>
                    <ul className="list-disc pl-6 mb-4">
                      <li>
                        <strong>Month:</strong> The payment month number, starting from now.
                      </li>
                      <li>
                        <strong>Date:</strong> The approximate calendar date of the payment.
                      </li>
                      <li>
                        <strong>Total Payment:</strong> The total amount paid across all debts that month.
                      </li>
                      <li>
                        <strong>Principal:</strong> The portion of the payment that reduces your debt balance.
                      </li>
                      <li>
                        <strong>Interest:</strong> The portion of the payment that goes to interest charges.
                      </li>
                      <li>
                        <strong>Remaining Balance:</strong> The total debt remaining after that month's payment.
                      </li>
                    </ul>
                    
                    <Typography variant="subtitle2">How the strategy works:</Typography>
                    <Typography variant="body2" paragraph>
                      Using the {
                        payoffMethod === 'snowball' ? 'Debt Snowball' : 
                        payoffMethod === 'avalanche' ? 'Debt Avalanche' : 
                        payoffMethod === 'highestPaymentFirst' ? 'Highest Payment First' :
                        payoffMethod === 'lowestPaymentFirst' ? 'Lowest Payment First' :
                        'Balanced'
                      } method, you'll make minimum payments on all debts, then put any extra money toward the highest priority debt until it's paid off, then move to the next debt.
                    </Typography>
                    
                    <Typography variant="subtitle2">Tips:</Typography>
                    <ul className="list-disc pl-6">
                      <li>
                        Adding even small additional payments can significantly reduce your payoff time.
                      </li>
                      <li>
                        As debts are paid off, you'll see larger portions of your payment going to principal rather than interest.
                      </li>
                      <li>
                        Consider saving this schedule to track your progress and stay motivated.
                      </li>
                    </ul>
                  </Paper>
                ) : (
                  <TableContainer style={{ maxHeight: '400px' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell>Date</TableCell>
                          {payoffResults.debtSchedules.map(debt => (
                            <TableCell key={debt.id} align="right">{debt.name}</TableCell>
                          ))}
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from({ length: Math.min(24, payoffResults.summary.months) }, (_, i) => i + 1).map(month => {
                          const date = new Date();
                          date.setMonth(date.getMonth() + month - 1);
                          
                          return (
                            <TableRow key={month}>
                              <TableCell>{month}</TableCell>
                              <TableCell>
                                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                              </TableCell>
                              {payoffResults.debtSchedules.map(debt => {
                                const payment = debt.schedule.length >= month
                                  ? debt.schedule[month - 1].payment
                                  : 0;
                                
                                return (
                                  <TableCell 
                                    key={debt.id} 
                                    align="right"
                                    className={payment > debt.minimumPayment ? 'text-[#2E7D32] font-bold' : ''}
                                  >
                                    {formatCurrency(payment)}
                                  </TableCell>
                                );
                              })}
                              <TableCell align="right" className="font-bold">
                                {formatCurrency(payoffResults.scheduleSummary[month - 1].payment)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                <Divider className="my-6" />

                <Typography variant="h6" className="mb-4">Detailed Month-by-Month Breakdown</Typography>

                {detailedSchedule.length > 36 && (
                <Typography color="warning" className="mb-4">
                    Your plan includes {detailedSchedule.length} months. For readability, only showing the first 36 months below.
                </Typography>
                )}

                <TableContainer style={{ maxHeight: '500px' }}>
                <Table stickyHeader>
                    <TableHead>
                    <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total Payment</TableCell>
                        {payoffResults.debtSchedules.map(debt => (
                        <TableCell key={debt.id} align="right" colSpan={2}>{debt.name}</TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3}></TableCell>
                        {payoffResults.debtSchedules.map(debt => (
                        <React.Fragment key={`header-${debt.id}`}>
                            <TableCell align="right">Payment</TableCell>
                            <TableCell align="right">Balance</TableCell>
                        </React.Fragment>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {detailedSchedule.slice(0, 36).map((month) => (
                        <TableRow key={month.month}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell>{month.date}</TableCell>
                        <TableCell align="right" className="font-bold">
                            {formatCurrency(month.totalPayment)}
                        </TableCell>
                        
                        {payoffResults.debtSchedules.map(debt => {
                            const debtDetail = month.debts.find(d => d.name === debt.name);
                            return (
                            <React.Fragment key={`month-${month.month}-debt-${debt.id}`}>
                                <TableCell align="right" className={
                                debtDetail && debtDetail.payment > debt.minimumPayment 
                                    ? 'text-[#2E7D32] font-bold' 
                                    : ''
                                }>
                                {debtDetail ? formatCurrency(debtDetail.payment) : '-'}
                                </TableCell>
                                <TableCell align="right">
                                {debtDetail 
                                    ? (debtDetail.remainingBalance > 0 
                                    ? formatCurrency(debtDetail.remainingBalance) 
                                    : 'PAID OFF') 
                                    : '-'}
                                </TableCell>
                            </React.Fragment>
                            );
                        })}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                
                <Box className="mt-6 flex justify-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveTab(2)}
                    className="mx-2 bg-[#2E7D32]"
                  >
                    Back to Results
                  </Button>
                </Box>

                {/* Export Section */}
                <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    Export Your Debt Payoff Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                    Download your debt analysis, payment strategy, and detailed payment schedule
                  </Typography>
                  <ExportButtons data={prepareExportData()} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Navigation buttons */}
      <Box className="mt-4 flex justify-between">
        <Button
          variant="outlined"
          disabled={activeTab === 0}
          onClick={() => setActiveTab(prev => prev - 1)}
        >
          Previous
        </Button>
        
        {activeTab < 3 && (
          <Button
            variant="contained"
            className="bg-[#2E7D32] text-white"
            onClick={() => setActiveTab(prev => prev + 1)}
            disabled={(activeTab === 0 && debts.length === 0) || (activeTab === 2 && !payoffResults)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DebtPayoffPlanner;