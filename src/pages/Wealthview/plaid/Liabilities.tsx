import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { LiabilitiesData, PlaidAccount } from '../../../types';
import wealthViewService from '../../../services/wealthView.service';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Stack, 
  Card, 
  Grid, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material';

// Constants
const GREEN_COLOR = '#2E7D32';

const LiabilitiesDisplay: React.FC = () => {
  const { userInfo } = useContext(UserContext);
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [liabilities, setLiabilities] = useState<LiabilitiesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credit' | 'student' | 'mortgage'>('credit');

  useEffect(() => {
    const fetchLiabilities = async () => {
      if (userInfo?.id) {
        try {
          setLoading(true);
          const response = await wealthViewService.getLiabilities(userInfo.id);
          setAccounts(response.accounts);
          setLiabilities(response.liabilities);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (userInfo?.id) {
      fetchLiabilities();
    }
  }, [userInfo]);

  // Utility functions
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getAccountName = (accountId: string) => {
    const account = accounts?.find(a => a.account_id === accountId);
    return account ? account.name : 'Unknown Account';
  };

  // Loading and error states
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

  if (!liabilities) {
    return (
      <Box className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="h6" className="text-xl font-semibold text-yellow-700">No Liabilities Found</Typography>
        <Typography className="text-yellow-600 mt-2">
          We couldn't find any liabilities associated with your linked accounts.
        </Typography>
      </Box>
    );
  }

  // Tab availability
  const hasCreditCards = liabilities.credit && liabilities.credit.length > 0;
  const hasStudentLoans = liabilities.student && liabilities.student.length > 0;
  const hasMortgages = liabilities.mortgage && liabilities.mortgage.length > 0;

  // Available tabs
  const availableTabs = [
    { value: 'credit', label: 'Credit Cards', available: hasCreditCards },
    { value: 'student', label: 'Student Loans', available: hasStudentLoans },
    { value: 'mortgage', label: 'Mortgages', available: hasMortgages }
  ] as const;

  // Credit card section renderer
  const renderCreditCards = () => (
    <Stack spacing={3}>
      {liabilities.credit.map((card) => (
        <Card key={card.account_id} className="border rounded-lg p-4">
          <Typography variant="h6" className="text-lg font-medium text-gray-800 mb-2">
            {getAccountName(card.account_id)}
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { label: 'Last Statement Balance', value: formatCurrency(card.last_statement_balance) },
              { label: 'Minimum Payment', value: formatCurrency(card.minimum_payment_amount) },
              { label: 'Due Date', value: formatDate(card.next_payment_due_date) },
              { label: 'Last Payment', value: `${formatCurrency(card.last_payment_amount)} on ${formatDate(card.last_payment_date)}` }
            ].map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography variant="body2" className="text-sm text-gray-500">{item.label}</Typography>
                <Typography variant="body1" className="font-medium">{item.value}</Typography>
              </Grid>
            ))}
          </Grid>
          
          {card.aprs.length > 0 && (
            <Box className="mt-4">
              <Typography variant="subtitle1" className="text-md font-medium text-gray-700 mb-2">APRs</Typography>
              <TableContainer className="overflow-x-auto">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableCell>
                      <TableCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</TableCell>
                      <TableCell className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {card.aprs.map((apr, idx) => (
                      <TableRow key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <TableCell className="px-4 py-2 text-sm text-gray-900">{apr.apr_type}</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-900">{apr.apr_percentage.toFixed(2)}%</TableCell>
                        <TableCell className="px-4 py-2 text-sm text-gray-900">{formatCurrency(apr.balance_subject_to_apr)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Card>
      ))}
    </Stack>
  );

  // Student loan section renderer
  const renderStudentLoans = () => (
    <Stack spacing={3}>
      {liabilities.student.map((loan) => (
        <Card key={loan.account_id} className="border rounded-lg p-4">
          <Typography variant="h6" className="text-lg font-medium text-gray-800 mb-1">
            {loan.loan_name || getAccountName(loan.account_id)}
          </Typography>
          
          <Typography variant="body2" className="text-sm text-gray-500 mb-4">
            {loan.repayment_plan?.description || 'Standard Repayment'}
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { label: 'Interest Rate', value: `${loan.interest_rate_percentage.toFixed(2)}%` },
              { label: 'Minimum Payment', value: formatCurrency(loan.minimum_payment_amount) },
              { label: 'Next Due Date', value: formatDate(loan.next_payment_due_date) },
              { label: 'Original Principal', value: formatCurrency(loan.origination_principal_amount) },
              { label: 'Outstanding Interest', value: formatCurrency(loan.outstanding_interest_amount) },
              { label: 'Expected Payoff', value: formatDate(loan.expected_payoff_date) }
            ].map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Typography variant="body2" className="text-sm text-gray-500">{item.label}</Typography>
                <Typography variant="body1" className="font-medium">{item.value}</Typography>
              </Grid>
            ))}
          </Grid>
          
          {loan.pslf_status && (
            <Paper elevation={0} className="mt-4 p-3 bg-blue-50 rounded-lg">
              <Typography variant="subtitle1" className="text-md font-medium text-blue-700 mb-2">
                Public Service Loan Forgiveness
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" className="text-sm text-gray-500">Payments Made</Typography>
                  <Typography variant="body1" className="font-medium">{loan.pslf_status.payments_made}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" className="text-sm text-gray-500">Payments Remaining</Typography>
                  <Typography variant="body1" className="font-medium">{loan.pslf_status.payments_remaining}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" className="text-sm text-gray-500">Estimated Eligibility Date</Typography>
                  <Typography variant="body1" className="font-medium">{formatDate(loan.pslf_status.estimated_eligibility_date)}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          <Box className="mt-4">
            <Typography variant="subtitle1" className="text-md font-medium text-gray-700 mb-2">Year-to-Date Payments</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="text-sm text-gray-500">Principal Paid</Typography>
                <Typography variant="body1" className="font-medium">{formatCurrency(loan.ytd_principal_paid)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="text-sm text-gray-500">Interest Paid</Typography>
                <Typography variant="body1" className="font-medium">{formatCurrency(loan.ytd_interest_paid)}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      ))}
    </Stack>
  );

  // Mortgage section renderer
  const renderMortgages = () => (
    <Stack spacing={3}>
      {liabilities.mortgage.map((mortgage) => (
        <Card key={mortgage.account_id} className="border rounded-lg p-4">
          <Typography variant="h6" className="text-lg font-medium text-gray-800 mb-1">
            {getAccountName(mortgage.account_id)}
          </Typography>
          
          <Typography variant="body2" className="text-sm text-gray-500 mb-4">
            {mortgage.loan_type_description}
          </Typography>
          
          {mortgage.property_address && (
            <Paper elevation={0} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <Typography variant="subtitle1" className="text-md font-medium text-gray-700 mb-2">Property</Typography>
              <Typography variant="body2">
                {mortgage.property_address.street}<br />
                {mortgage.property_address.city}, {mortgage.property_address.region} {mortgage.property_address.postal_code}
              </Typography>
            </Paper>
          )}
          
          <Grid container spacing={2}>
            {[
              { label: 'Interest Rate', value: `${mortgage.interest_rate.percentage.toFixed(2)}% (${mortgage.interest_rate.type})` },
              { label: 'Next Payment', value: formatCurrency(mortgage.next_monthly_payment) },
              { label: 'Due Date', value: formatDate(mortgage.next_payment_due_date) },
              { label: 'Original Principal', value: formatCurrency(mortgage.origination_principal_amount) },
              { label: 'Maturity Date', value: formatDate(mortgage.maturity_date) },
              { label: 'Loan Term', value: mortgage.loan_term }
            ].map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Typography variant="body2" className="text-sm text-gray-500">{item.label}</Typography>
                <Typography variant="body1" className="font-medium">{item.value}</Typography>
              </Grid>
            ))}
          </Grid>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" className="text-md font-medium text-gray-700 mb-2">Additional Details</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Escrow Balance', value: formatCurrency(mortgage.escrow_balance) },
                { label: 'Private Mortgage Insurance', value: mortgage.has_pmi ? 'Yes' : 'No' },
                { label: 'Prepayment Penalty', value: mortgage.has_prepayment_penalty ? 'Yes' : 'No' }
              ].map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Typography variant="body2" className="text-sm text-gray-500">{item.label}</Typography>
                  <Typography variant="body1" className="font-medium">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box className="mt-4">
            <Typography variant="subtitle1" className="text-md font-medium text-gray-700 mb-2">Year-to-Date Payments</Typography>
            <Grid container spacing={1}>
              {[
                { label: 'Principal Paid', value: formatCurrency(mortgage.ytd_principal_paid) },
                { label: 'Interest Paid', value: formatCurrency(mortgage.ytd_interest_paid) },
                { label: 'Taxes/Insurance Paid', value: formatCurrency(mortgage.ytd_taxes_insurance_fees_paid) }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Typography variant="body2" className="text-sm text-gray-500">{item.label}</Typography>
                  <Typography variant="body1" className="font-medium">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      ))}
    </Stack>
  );

  // Content components map
  const tabContent = {
    credit: hasCreditCards ? renderCreditCards() : null,
    student: hasStudentLoans ? renderStudentLoans() : null,
    mortgage: hasMortgages ? renderMortgages() : null
  };

  return (
    <Paper className="bg-white shadow rounded-lg overflow-hidden">
      <Box className="p-4 border-b">
        <Typography variant="h5" className="text-2xl font-semibold text-gray-800">Your Liabilities</Typography>
      </Box>
      
      <Box className="border-b">
        <Tabs 
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: GREEN_COLOR,
            }
          }}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: GREEN_COLOR
            }
          }}
        >
          {availableTabs
            .filter(tab => tab.available)
            .map(tab => (
              <Tab 
                key={tab.value}
                label={tab.label} 
                value={tab.value}
                sx={{
                  '&.Mui-selected': {
                    color: GREEN_COLOR,
                    borderBottom: `2px solid ${GREEN_COLOR}`
                  },
                  textTransform: 'none',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary'
                  }
                }}
              />
            ))}
        </Tabs>
      </Box>
      
      {/* Active tab content */}
      {tabContent[activeTab] ? (
        <Box className="p-4">
          {tabContent[activeTab]}
        </Box>
      ) : (
        <Box className="p-6 text-center">
          <Typography className="text-gray-500">
            No {activeTab === 'credit' ? 'credit cards' : activeTab === 'student' ? 'student loans' : 'mortgages'} found.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LiabilitiesDisplay;