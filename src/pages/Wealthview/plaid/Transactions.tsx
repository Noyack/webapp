import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import wealthViewService from '../../../services/wealthView.service';
import { TransactionItem } from '../../../types';
import { Box, CircularProgress, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { PlaidContext } from '../../../context/PlaidContext';


  

function Transactions() {
    const { userInfo } = useContext(UserContext);
    const { plaidInfo } = useContext(PlaidContext);
      const [transactions, setTransactions] = useState<TransactionItem[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        const fetchFinancialData = async () => {
            if(userInfo?.id)
          try {
            setLoading(true);
            
            // Fetch transactions data (last 30 days)
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            const startDate = thirtyDaysAgo.toISOString().split('T')[0];
            const endDate = today.toISOString().split('T')[0];
            
            const transactionsResponse = await wealthViewService.getTransactions(userInfo?.id,startDate, endDate);
            
            setTransactions(transactionsResponse?.transactions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        if (userInfo?.id && !plaidInfo?.noAccount) {
          fetchFinancialData();
        }
      }, [userInfo]);
    
      const formatCurrency = (amount: number | null) => {
        if (amount === null) return 'N/A';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      };
      if (loading) {
        return (
          <Box className="p-4 flex justify-center items-center h-64">
            <CircularProgress color="primary" size={48} />
          </Box>
        );
      }
    
      if (error) {
        return (
          <Box className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <Typography variant="h6" className="font-semibold text-red-700">
              Error
            </Typography>
            <Typography className="text-red-600 mt-2">
              {error}
            </Typography>
            <Typography className="mt-4">
              You may need to reconnect your bank account. Please try again or contact support.
            </Typography>
            <Button 
              variant="contained" 
              className="mt-4 bg-blue-500 hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        );
      }
    
      return (
        <Box className="p-4">
          <Box className="mb-4">
            <Typography variant="h6" className="text-gray-700">
              Last 30 Days Transactions
            </Typography>
          </Box>
          
          {transactions.length === 0 ? (
            <Typography className="text-gray-500 py-4">
              No transactions found in the last 30 days.
            </Typography>
          ) : (
            <TableContainer component={Paper} className="overflow-x-auto">
              <Table>
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow 
                      key={transaction.transaction_id} 
                      className={transaction.pending ? 'bg-gray-50' : ''}
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                        {transaction.pending && (
                          <Chip
                            label="Pending"
                            size="small"
                            className="ml-2 bg-yellow-100 text-yellow-800"
                          />
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category ? transaction.category[0] : 'Uncategorized'}
                      </TableCell>
                      <TableCell 
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.amount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        <p className={`${transaction.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      );
}

export default Transactions