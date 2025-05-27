import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TransactionsView from './InvestmentTransaction'; 

enum DashboardView {
  PORTFOLIO = 'portfolio',
  TRANSACTIONS = 'transactions'
}

const InvestmentDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<DashboardView>(DashboardView.PORTFOLIO);

  const handleViewChange = (_event: React.SyntheticEvent, newValue: DashboardView) => {
    setActiveView(newValue);
  };

  return (
    <Container className="mx-auto px-4 py-6 max-w-6xl">
      <Box className="mb-6">
        <Typography variant="h3" className="text-3xl font-bold text-gray-800">
          Financial Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Manage your finances and track your spending with ease.
        </Typography>
      </Box>
      
      <Box className="mb-6">
        <Box className="border-b border-gray-200">
          <Tabs 
            value={activeView} 
            onChange={handleViewChange}
            className="-mb-px"
          >
            <Tab 
              label="Portfolio" 
              value={DashboardView.PORTFOLIO}
              className={`px-4 py-2 text-sm font-medium border-b-2 focus:outline-none ${
                activeView === DashboardView.PORTFOLIO
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            />
            <Tab 
              label="Transactions" 
              value={DashboardView.TRANSACTIONS}
              className={`ml-8 px-4 py-2 text-sm font-medium border-b-2 focus:outline-none ${
                activeView === DashboardView.TRANSACTIONS
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            />
          </Tabs>
        </Box>
      </Box>
      
      <Box className="mt-6">
        {activeView === DashboardView.PORTFOLIO ? (
          <InvestmentDashboard />
        ) : (
          <TransactionsView />
        )}
      </Box>
      
      <Paper className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <Box className="p-4 border-b">
          <Typography variant="h6" className="text-xl font-semibold text-gray-800">
            Connect More Accounts
          </Typography>
        </Box>
        <Box className="p-6 text-center">
          <Typography variant="body1" className="text-gray-600 mb-4">
            Link more financial accounts to get a complete view of your finances.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center"
            onClick={() => {/* Open Plaid Link */}}
          >
            Connect a Bank Account
          </Button>
        </Box>
      </Paper>
      
      <Box className="mt-6 text-center text-sm text-gray-500">
        <Typography variant="body2">
          Powered by Plaid • Data is securely processed • Bank-level encryption
        </Typography>
      </Box>
    </Container>
  );
};

export default InvestmentDashboard;