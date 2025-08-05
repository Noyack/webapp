import { useState } from 'react';
import { Paper, Box, Typography, Tabs, Tab } from '@mui/material';

import UserIdentityInfo from './Identify';
import InvestmentPortfolio from './InvestmentPortfolio';
import LiabilitiesDisplay from './Liabilities';
import MyAccounts from './MyAccounts';
import Transactions from './Transactions';

type TabType = 'accounts' | 'transactions' | 'identity' | 'investment' | 'liability';

const PlaidDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('accounts');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };

  // Common tab styling
  const tabSx = {
    '&.Mui-selected': {
      color: '#2E7D32',
      borderBottom: '2px solid #2E7D32'
    },
    textTransform: 'none',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.secondary',
    '&:hover': {
      color: 'text.primary'
    }
  };

  // Tab configuration data
  const tabs = [
    { label: "Accounts", value: "accounts" },
    { label: "Recent Transactions", value: "transactions" },
    { label: "Identity", value: "identity" },
    { label: "Investment", value: "investment" },
    // { label: "Liability", value: "liability" }
  ];

  // Component map for rendering based on activeTab
  const tabComponents = {
    accounts: <MyAccounts />,
    transactions: <Transactions />,
    identity: <UserIdentityInfo />,
    investment: <InvestmentPortfolio />,
    liability: <LiabilitiesDisplay />
  };

  return (
    <Paper className="bg-white shadow rounded-lg overflow-hidden">
      <Box className="p-4 border-b">
        <Typography variant="h5" className="text-2xl font-semibold text-gray-800">
          Your Financial Dashboard
        </Typography>
      </Box>
      
      <Box className="border-b">
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#2E7D32',
            }
          }}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: '#2E7D32'
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.value}
              label={tab.label} 
              value={tab.value}
              sx={tabSx}
            />
          ))}
        </Tabs>
      </Box>
      
      {tabComponents[activeTab]}
    </Paper>
  );
};

export default PlaidDashboard;