import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { PlaidAccount, PlaidInvestmentTransaction, Security } from '../../../types';
import wealthViewService from '../../../services/wealthView.service';
import { Box, CircularProgress, Typography, Paper, InputLabel, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

// Reuse the Security and Account interfaces from the previous component

const InvestmentTransactions: React.FC = () => {
  const {userInfo} = useContext(UserContext)
  const [transactions, setTransactions] = useState<PlaidInvestmentTransaction[]>([]);
  const [securities, setSecurities] = useState<Record<string, Security>>({});
  const [accounts, setAccounts] = useState<Record<string, PlaidAccount>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Date range state (default to last 30 days)
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    
    if (userInfo?.id) {
      fetchTransactions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.id]);

  const fetchTransactions = async () => {
    if(userInfo?.id)
  try {
    setLoading(true);
    
    const response = await wealthViewService.getInvestmentTranscations(userInfo?.id, startDate, endDate);
    setTransactions(response?.investment_transactions);
    
    // Convert securities array to a map
    const securitiesMap = response.securities.reduce((acc: Record<string, Security>, security: Security) => {
      acc[security.security_id] = security;
      return acc;
    }, {});
    setSecurities(securitiesMap);
    
    // Convert accounts array to a map
    const accountsMap = response.accounts.reduce((acc: Record<string, PlaidAccount>, account: PlaidAccount) => {
      acc[account.account_id] = account;
      return acc;
    }, {});
    setAccounts(accountsMap);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const formatCurrency = (amount: number | null, currency = 'USD') => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
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
          <Typography variant="h6" className="text-xl font-semibold text-red-700">Error</Typography>
          <Typography className="text-red-600 mt-2">{error}</Typography>
        </Box>
      );
    }
  
    return (
      <Paper className="bg-white shadow rounded-lg overflow-hidden">
        <Box className="p-4 border-b">
          <Typography variant="h5" className="text-2xl font-semibold text-gray-800">
            Investment Transactions
          </Typography>
        </Box>
        
        <Box className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-end">
          <Box>
            <InputLabel htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </InputLabel>
            <TextField
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              size="small"
              className="mt-1 block w-full"
              InputProps={{
                className: "rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              }}
            />
          </Box>
          <Box>
            <InputLabel htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </InputLabel>
            <TextField
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              size="small"
              className="mt-1 block w-full"
              InputProps={{
                className: "rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              }}
            />
          </Box>
          <Button variant='contained' color='success' onClick={fetchTransactions}>Update</Button>
        </Box>
        
        {transactions.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography className="text-gray-500">
              No investment transactions found for the selected period.
            </Typography>
          </Box>
        ) : (
          <TableContainer className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </TableCell>
                  <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </TableCell>
                  <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </TableCell>
                  <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const security = securities[transaction.security_id];
                  const account = accounts[transaction.account_id];
                  
                  return (
                    <TableRow key={transaction.investment_transaction_id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account?.name || 'Unknown Account'}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Typography className="text-sm font-medium text-gray-900">
                          {security?.name || transaction.name || 'Unknown Security'}
                        </Typography>
                        {security?.ticker_symbol && (
                          <Typography className="text-sm text-gray-500">
                            {security.ticker_symbol}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`${transaction.type}${transaction.subtype ? ` (${transaction.subtype})` : ''}`}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {transaction.quantity ? transaction.quantity.toFixed(4) : 'N/A'}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {transaction.price ? formatCurrency(transaction.price, transaction.iso_currency_code) : 'N/A'}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        {formatCurrency(transaction.amount, transaction.iso_currency_code)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    );
};

export default InvestmentTransactions;