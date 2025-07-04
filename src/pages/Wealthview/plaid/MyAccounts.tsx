import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { PlaidAccountsData } from '../../../types';
import wealthViewService from '../../../services/wealthView.service';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
} from '@mui/material';
import FetchError from '../../../components/UI/FetchError';
import FetchEmpty from '../../../components/UI/FetchEmpty';

const MyAccounts = () => {
  const { userInfo } = useContext(UserContext);
  const [accountsData, setAccountsData] = useState<PlaidAccountsData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
        const currentUserId = userInfo?.id; // Replace with actual user ID retrieval
        // Fetch existing basic info if available
        if (currentUserId) {
          fetchFinancialData();
        }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);


  const fetchFinancialData = async () => {
    if(userInfo?.id)
    try {
      setLoading(true);
      // Fetch accounts data
      const accountsResponse = await wealthViewService.getAccounts(userInfo?.id);
      setAccountsData(accountsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
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
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <FetchError />
    );
  }

  if (!accountsData || accountsData.accounts.length === 0) {
    return (
      <FetchEmpty />
    );
  }

  return(
    <Box className="p-4">
      <Box className="mb-4">
        <Typography variant="h6" className="text-gray-700">
          {accountsData.item.name || 'Your Financial Institution'}
        </Typography>
      </Box>
      
      <Box className=" flex flex-wrap gap-5 space-y-4">
        {accountsData.accounts.map((account) => (
          <Card key={account.account_id} className="hover:bg-gray-50 w-[250px] min-h-[100px]">
            <CardContent className="p-4">
              <Box className="flex flex-col">
                <Box>
                  <Typography variant="subtitle1" className="font-medium text-gray-800">
                    {account.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {account.type} • {account.subtype} • ••••{account.mask}
                  </Typography>
                </Box>
                <Box className="text-right">
                  <Typography variant="h6" className="font-semibold text-gray-800">
                    {formatCurrency(account.balances.current)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {account.balances.available !== null ? (
                      <>Available: {formatCurrency(account.balances.available)}</>
                    ) : account.balances.limit !== null ? (
                      <>Limit: {formatCurrency(account.balances.limit)}</>
                    ) : null}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default MyAccounts;