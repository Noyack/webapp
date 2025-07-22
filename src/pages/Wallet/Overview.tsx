import { useUser } from '@clerk/clerk-react'
import { Add, InfoOutlined } from '@mui/icons-material'
import { Button, Switch, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import { useState, MouseEvent, ChangeEvent, useEffect } from 'react'
import { 
  BalanceType, 
  OverviewState,
  AccountBalance,
  // ReferralInfo,
  InvestmentTransaction,
  // RecurringInvestment
} from '../../types'
import { investmentService } from '../../services'
import { Link } from 'react-router-dom'
import equityTrustService from '../../services/equityTrust.service'

function Overview() {
    const { user } = useUser();
    
    // Initialize state with proper typing
    const [state, setState] = useState<OverviewState>({
      balanceType: 'wallet',
      reinvestEnabled: true,
      referralCode: "https://exemple.com/fenwif23e1edw",
      referralCopied: false,
      isLoading: {
        balance: false,
        referral: false,
        transactions: false,
      },
      error: null
    });
    
    // State for data from API
    const [accountBalance,] = useState<AccountBalance>({
      walletBalance: 0,
      totalInvestments: 0,
      totalEarnings: 0,
      availableToWithdraw: 0
    });

    useEffect(()=>{
      const test =async()=> {
        return await equityTrustService.getAccounts("205377261")
      }

      console.log(test())
    },[])
    
    // Using correct type for referralInfo state
    // const [referralInfo, setReferralInfo] = useState<ReferralInfo>({
    //   code: "https://exemple.com/fenwif23e1edw",
    //   url: "https://exemple.com/fenwif23e1edw",
    //   referralCount: 0,
    //   rewardsEarned: 0,
    //   pendingRewards: 0
    // });
    
    const [transactions] = useState<InvestmentTransaction[]>([]);
    
    // Fix the type error by explicitly defining the type
    // const [recurringInvestments] = useState<RecurringInvestment[]>([]);
    
    // Fetch data on component mount
    useEffect(() => {
      // const fetchData = async () => {
      //   try {
      //     // Fetch account balance
      //     setState(prev => ({
      //       ...prev, 
      //       isLoading: {...prev.isLoading, balance: true}
      //     }));
          
      //     const balance = await investmentService.getAccountBalance();
      //     setAccountBalance(balance);
          
      //     setState(prev => ({
      //       ...prev, 
      //       isLoading: {...prev.isLoading, balance: false}
      //     }));
          
      //     // Fetch referral info
      //     setState(prev => ({
      //       ...prev, 
      //       isLoading: {...prev.isLoading, referral: true}
      //     }));
          
      //     const referralData = await investmentService.getReferralInfo();
      //     setReferralInfo(referralData);
      //     setState(prev => ({
      //       ...prev, 
      //       referralCode: referralData.url,
      //       isLoading: {...prev.isLoading, referral: false}
      //     }));
          
      //     // Fetch transaction history
      //     setState(prev => ({
      //       ...prev, 
      //       isLoading: {...prev.isLoading, transactions: true}
      //     }));
          
      //     const txns = await investmentService.getTransactionHistory({
      //       limit: 5 // Just get the most recent 5
      //     });
      //     setTransactions(txns);
          
      //     // Fetch recurring investments
      //     const recurrings = await investmentService.getRecurringInvestments();
      //     setRecurringInvestments(recurrings);
          
      //     setState(prev => ({
      //       ...prev, 
      //       isLoading: {...prev.isLoading, transactions: false}
      //     }));
      //   } catch (error) {
      //     console.error('Error fetching user data:', error);
      //     setState(prev => ({
      //       ...prev,
      //       error: error instanceof Error ? error.message : 'An unknown error occurred',
      //       isLoading: {balance: false, referral: false, transactions: false}
      //     }));
      //   }
      // };
      
      // fetchData();
    }, []);
    
    const tooltipText = `The Fund has adopted an "opt out"
    distribution reinvestment plan (DRIP), 
    whereby investors will automatically 
    have the full amount of any distributions 
    reinvested back into the fund, unless a 
    shareholder elects to opt out of the DRIP 
    by toggling off this reinvestments switch.`;

    const DownloadIcon = () => (
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.97969 1.0988C5.96793 1.10077 5.95618 1.10372 5.9455 1.10668C5.81835 1.13328 5.72859 1.23869 5.7318 1.35888V9.06697L4.01369 7.48279C3.94744 7.41974 3.85021 7.39314 3.75725 7.41186C3.65468 7.42861 3.57241 7.49757 3.54356 7.58919C3.51471 7.6818 3.54463 7.78032 3.62049 7.84534L5.80873 9.863L6.00533 10.0364L6.20193 9.863L8.39017 7.84534C8.49916 7.74485 8.49916 7.58328 8.39017 7.48279C8.28119 7.3823 8.10596 7.3823 7.99697 7.48279L6.27886 9.06697V1.35888C6.28207 1.28598 6.25001 1.21603 6.19338 1.16677C6.13568 1.11653 6.05768 1.0919 5.97969 1.0988ZM1.08179 4.88979V13.4648H10.9289V4.88979H8.19357C8.09527 4.8888 8.00338 4.93609 7.95316 5.01491C7.90401 5.09372 7.90401 5.19027 7.95316 5.26908C8.00338 5.3479 8.09527 5.39519 8.19357 5.3942H10.3818V12.9604H1.62885V5.3942H3.81709C3.91539 5.39519 4.00728 5.3479 4.0575 5.26908C4.10665 5.19027 4.10665 5.09372 4.0575 5.01491C4.00728 4.93609 3.91539 4.8888 3.81709 4.88979H1.08179Z" fill="#046262" stroke="#046262" strokeWidth="0.4"></path>
      </svg>
    );

    const handleChangeType = (
      _event: MouseEvent<HTMLElement>,
      newBalanceType: BalanceType,
    ) => {
      if (newBalanceType !== null) {
        setState(prev => ({...prev, balanceType: newBalanceType}));
      }
    };
    
    const handleChangeDistribution = async (event: ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      try {
        // Update the UI immediately for better UX
        setState(prev => ({...prev, reinvestEnabled: enabled}));
        
        // Call the API to update the preference
        await investmentService.updateReinvestmentPreference(enabled);
      } catch (error) {
        // Revert UI if API call fails
        setState(prev => ({
          ...prev, 
          reinvestEnabled: !enabled,
          error: 'Failed to update dividend reinvestment preference'
        }));
        console.error('Error updating reinvestment preference:', error);
      }
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(state.referralCode);
        setState(prev => ({...prev, referralCopied: true}));
        
        // Reset copied state after 3 seconds
        setTimeout(() => {
          setState(prev => ({...prev, referralCopied: false}));
        }, 3000);
      } catch (error) {
        console.error('Failed to copy:', error);
        setState(prev => ({...prev, error: 'Failed to copy to clipboard'}));
      }
    };
    
    const handleAddPaymentMethod = () => {
      // This would typically open a modal or navigate to a payment method form
      console.log('Add payment method clicked');
    };
    
    const handleCashOut = async () => {
      // This would typically open a cash out form
      console.log('Cash out clicked');
    };
    
    // Show loading state
    if (state.isLoading.balance || state.isLoading.referral) {
      return (
        <div className="flex flex-col gap-4 p-8">
          <Typography fontSize={"25px"} fontWeight={"bold"}>Investment Overview</Typography>
          <div className="animate-pulse flex-1 space-y-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    // Show error state
    if (state.error) {
      return (
        <div className="flex flex-col gap-4 p-8">
          <Typography fontSize={"25px"} fontWeight={"bold"}>Investment Overview</Typography>
          <div className="bg-red-100 p-4 rounded-lg">
            <Typography color="error">Error loading investment data: {state.error}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-2'>
          <Typography fontSize={"22px"} fontWeight={"bold"}>Investment Overview</Typography>
          <div className='flex flex-wrap shadow-xl w-full min-h-20 bg-white rounded-4xl gap-8 p-8'>
            <img 
              width={"60px"} 
              height={"60px"} 
              src={user?.imageUrl} 
              alt="User profile"
              className='rounded-full' 
            />
            <div className='flex flex-col'>
              <Typography fontWeight={"bold"} fontSize={"20px"}>
                {user?.fullName}
              </Typography>
              <Typography className='text-gray-500' fontSize={"15px"}>Account Holder</Typography>
            </div>
            <div className='text-gray-500'>
              <Typography fontWeight={'bold'}>Referral Code</Typography>
              <div className="flex border-1 rounded-md">
                <input 
                  value={state.referralCode} 
                  disabled 
                  className='rounded-l-md w-60 px-1'
                  aria-label="Referral code"
                />
                {state.referralCopied ? (
                  <Button 
                    sx={{ background:"#999", color:"#000"}} 
                    className='rounded-md'
                    disabled
                  >
                    Copied
                  </Button>
                ) : (
                  <Button 
                    onClick={copyToClipboard} 
                    sx={{ background:"#2e7d32", color:"#fff"}} 
                    className='rounded-r-md'
                  >
                    Copy
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Typography fontSize={"22px"} fontWeight={"bold"}>Recurring Investment</Typography>
          <div className='flex flex-col shadow-xl w-full min-h-20 bg-white rounded-4xl gap-8 p-8'>
            {/* {recurringInvestments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recurringInvestments.map((recurring) => (
                  <div key={recurring.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <Typography fontWeight="bold">{recurring.fundName}</Typography>
                      <Typography variant="body2">${recurring.amount} {recurring.frequency}</Typography>
                    </div>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => investmentService.cancelRecurringInvestment(recurring.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Typography>
                You have no recurring investments.
              </Typography>
            )} */}
            <div className='flex justify-around'>
              <Link to={""} className='text-[#2E7D32] font-bold underline'>Invest in Alternative Investments</Link>
            </div>
          </div>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Typography fontSize={"22px"} fontWeight={"bold"}>My Wallet</Typography>
          <div className='flex flex-col shadow-xl w-full min-h-20 bg-white rounded-4xl gap-8 p-8'>
            <div className='flex justify-between'>
              <div>
                <Typography fontSize={"28px"} sx={{color:"#2e7d32"}} fontWeight={"bold"}>
                  ${state.balanceType === 'wallet' 
                    ? accountBalance.walletBalance.toFixed(2) 
                    : accountBalance.totalInvestments.toFixed(2)}
                </Typography>
                {state.balanceType === "wallet" && (
                  <Typography>
                    Wallet Balance
                  </Typography>
                )}
                {state.balanceType === "balance" && (
                  <Typography>
                    Account Balance
                  </Typography>
                )}
              </div>
              <ToggleButtonGroup
                color='success'
                value={state.balanceType}
                exclusive
                onChange={handleChangeType}
                aria-label='Account balance type switch'
              >
                <ToggleButton value={"wallet"}>Wallet</ToggleButton>
                <ToggleButton value={"balance"}>Balance</ToggleButton>
              </ToggleButtonGroup>
            </div>
            
            <div className='flex justify-between'>
              <div>
                <div className='flex gap-1'>
                  <Typography fontWeight={"bold"} className='text-gray-500'>
                    Re-Invest Distributions
                  </Typography>
                  <Tooltip title={tooltipText} placement="top-start">
                    <InfoOutlined />
                  </Tooltip>
                </div>
                {state.reinvestEnabled ? (
                  <Typography>
                    Enabled
                  </Typography>
                ) : (
                  <Typography>
                    Disabled
                  </Typography>
                )}
              </div>
              <Switch 
                color='success' 
                checked={state.reinvestEnabled} 
                onChange={handleChangeDistribution} 
                inputProps={{ 'aria-label': 'Re-Invest Distributions toggle' }}
              />
            </div>
            
            <div>
              <Button 
                startIcon={<Add />} 
                onClick={handleAddPaymentMethod}
                aria-label="Add payment method"
              >
                Add payment method
              </Button>
            </div>
            
            <Button 
              className='w-60 self-end' 
              color='success' 
              sx={{background:"#2e7d32", color:"#fff", p:"10px"}}
              onClick={handleCashOut}
            >
              Cash Out
            </Button>
          </div>
        </div>
        
        <div className='flex flex-col gap-2'>
          <Typography fontSize={"22px"} fontWeight={"bold"}>Investment History</Typography>
          <div className='flex flex-col shadow-xl w-full min-h-20 bg-white rounded-4xl gap-8 p-8'>
            {transactions.length > 0 ? (
              <div className="w-full">
                <div className="flex font-bold border-b pb-2 mb-4">
                  <div className="w-1/4">Date</div>
                  <div className="w-1/4">Type</div>
                  <div className="w-1/4">Amount</div>
                  <div className="w-1/4">Status</div>
                </div>
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex border-b py-2">
                    <div className="w-1/4">{new Date(tx.date).toLocaleDateString()}</div>
                    <div className="w-1/4 capitalize">{tx.type}</div>
                    <div className="w-1/4">${tx.amount.toFixed(2)}</div>
                    <div className="w-1/4 capitalize">{tx.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <Typography>No transaction history available.</Typography>
            )}
            <Button 
              color='success' 
              endIcon={<DownloadIcon />} 
              variant='outlined' 
              sx={{marginLeft:"0", marginRight:"auto"}}
            >
              Account Statement
            </Button>
          </div>
        </div>
      </div>
    );
}

export default Overview;