import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { Holding, PlaidAccount, Security } from '../../../types';
import wealthViewService from '../../../services/wealthView.service';
import { Box, CircularProgress, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';



const InvestmentPortfolio: React.FC = () => {
  const {userInfo} = useContext(UserContext)
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [securities, setSecurities] = useState<Record<string, Security>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestmentData = async () => {
        if(userInfo?.id)
      try {
        setLoading(true);
        
        const response = await wealthViewService.getHoldings(userInfo?.id);
        setAccounts(response.accounts);
        setHoldings(response.holdings);
        
        // Convert securities array to a map for easier lookup
        const securitiesMap = response.securities.reduce((acc: Record<string, Security>, security: Security) => {
          acc[security.security_id] = security;
          return acc;
        }, {});
        
        setSecurities(securitiesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchInvestmentData();
    }
  }, [userInfo?.id]);

  const formatCurrency = (amount: number | null, currency = 'USD') => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Group holdings by account
  const holdingsByAccount = accounts.map(account => {
    const accountHoldings = holdings.filter(holding => holding.account_id === account.account_id);
    return {
      account,
      holdings: accountHoldings,
    };
  });

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

  if (accounts.length === 0) {
    return (
      <Box className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="h6" className="text-xl font-semibold text-yellow-700">
          No Investment Accounts Found
        </Typography>
        <Typography className="text-yellow-600 mt-2">
          You haven't connected any investment accounts yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper className="bg-white shadow rounded-lg overflow-hidden">
      <Box className="p-4 border-b">
        <Typography variant="h5" className="text-2xl font-semibold text-gray-800">
          Investment Portfolio
        </Typography>
      </Box>
      
      {holdingsByAccount.map(({ account, holdings }) => (
        <Box key={account.account_id} className="p-4 border-b">
          <Box className="mb-4">
            <Typography variant="h6" className="text-lg font-medium text-gray-800">
              {account.name}
            </Typography>
            <Typography variant="body2" className="text-sm text-gray-500">
              {account.type} • {account.subtype} • ••••{account.mask}
            </Typography>
            <Typography variant="subtitle1" className="text-md font-semibold mt-1">
              Total Value: {formatCurrency(account.balances.current, account.balances.iso_currency_code)}
            </Typography>
          </Box>
          
          {holdings.length === 0 ? (
            <Typography className="text-gray-500">
              No holdings found for this account.
            </Typography>
          ) : (
            <TableContainer className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHead className="bg-gray-50">
                  <TableRow>
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
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {holdings.map((holding) => {
                    const security = securities[holding.security_id];
                    const value = holding.institution_value || (holding.quantity * (security?.close_price || 0));
                    const price = holding.institution_price || security?.close_price;
                    
                    return (
                      <TableRow key={`${holding.account_id}-${holding.security_id}`}>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Typography className="font-medium text-gray-900">
                            {security?.name || 'Unknown Security'}
                          </Typography>
                          {security?.ticker_symbol && (
                            <Typography variant="body2" className="text-sm text-gray-500">
                              {security.ticker_symbol}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {security?.type || 'Unknown'}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {holding.quantity.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(price, account.balances.iso_currency_code)}
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          {formatCurrency(value, account.balances.iso_currency_code)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default InvestmentPortfolio;