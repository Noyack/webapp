import { useUser } from "@clerk/clerk-react";
import { Backdrop, Box, Button, Divider, Fade, Modal, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ReactNode, useState, useRef, useEffect, useContext, useLayoutEffect } from "react";
import BasicInfo from "./BasicInfo";
import IncomeInfo from "./IncomeInfo";
import AssetsAllocations from "./AssetsAllocations";
import DebtProfile from "./DebtProfile";
import Expenses from "./Expenses";
import EmergencyFunds from "./EmergencyFunds";
import Budget from "./Budget";
import PlaidLinkButton from "./plaid/plaidButton";
import PlaidDashboard from "./plaid/PlaidDashboard";
import { Link, useSearchParams } from "react-router";
import { UserContext } from "../../context/UserContext";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { FeatureGateComponent } from "../../components/FeatureGateComponent";
import { authService } from "../../services";
import { WealthIq } from "../../types";
import wealthViewService from "../../services/wealthView.service";
import { PlaidContext } from "../../context/PlaidContext";


interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Wealthview() {
    const { user } = useUser();
    const { userInfo, setUserInfo } = useContext(UserContext)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(1020));
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);
    const {subs} = useContext(UserContext)
    const [open, setOpen] = useState(false);
    const [iq, setIq] = useState<number|null>(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [value, setValue] = useState<number>(1);
    const [canQuiz, setCanQuiz] = useState<boolean>(false)
    const [previousIq, setPreviousIq] = useState<WealthIq[]>()
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [list, setList] = useState<string[]>(['auth', 'transactions', 'identity', 'liabilities' ])
    const { plaidInfo, setPlaidInfo } = useContext(PlaidContext)
    const [ searchParams, setSearchParams ] = useSearchParams()
    const view = ['info','income', 'assets', 'debt','expenses', 'funds', 'budget', 'plaid']

    useLayoutEffect(()=>{
      if(view.includes(searchParams.get('view'))){
        setValue(()=>view.indexOf(searchParams.get('view')))
      }else{
        setValue(()=>0)
        setSearchParams(`view=${view[0]}`)
      }
    },[])



    const toggleRowExpansion = (id: string) => {
      const newExpanded = new Set(expandedRows);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedRows(newExpanded);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
        setSearchParams(`view=${view[newValue]}`)

    };
    
      useEffect(() => {    
          if (userInfo?.id){
            fetchIq()
            if(!userInfo?.plaidUserToken){
              fetchUserToken();
            }
          } 
        }, [userInfo]);

      useEffect(() => {
        if (userInfo?.plaidUserToken && !plaidInfo?.linkToken) {
          fetchLinkToken();
        }
      }, [userInfo?.plaidUserToken]);
      
      const fetchUserToken = async () => {
    if (!userInfo?.id) return;
    
    try {
      setPlaidInfo(prev => ({ ...prev, loading: true, error: '' }));
      const response = await wealthViewService.FetchPlaidToken(userInfo.id);
      
      if (response?.user_token) {
        setUserInfo(prev => ({ ...prev, plaidUserToken: response.user_token }));
      }
    } catch (err) {
      console.error('Failed to fetch user token:', err);
      setPlaidInfo(prev => ({ 
        ...prev, 
        error: 'Failed to initialize bank connection. Please try again.' 
      }));
    } finally {
      // Fix: Set loading to false, not true
      setPlaidInfo(prev => ({ ...prev, loading: false }));
    }
  };
    const fetchLinkToken = async () => {
      if (!userInfo?.plaidUserToken || !userInfo?.id) return;
      
      setPlaidInfo(prev => ({ ...prev, loading: true, error: '' }));
      
      try {
        const response = await wealthViewService.FetchPlaidLink(
          userInfo.id, 
          userInfo.plaidUserToken, 
          list
        );
        
        if (response.status === 200) {
          setPlaidInfo(prev => ({ 
            ...prev, 
            loading: false,
            linkToken: response.link_token,
            plaidLimit: false,
            error: '',
            noAccount:response?.noAccount
          }));
        } else if (response.status === 401) {
          setPlaidInfo(prev => ({ 
            ...prev, 
            loading: false,
            plaidLimit: true,
            linkToken: null,
            error: '',
            noAccount:response?.noAccount
          }));
        } else {
          setPlaidInfo(prev => ({ 
            ...prev, 
            loading: false,
            error: `Unexpected response status: ${response.status}`,
            linkToken: null
          }));
        }
      } catch (err) {
        console.error('Failed to fetch link token:', err);
        setPlaidInfo(prev => ({ 
          ...prev, 
          loading: false,
          error: 'Failed to initialize bank connection. Please try again.',
          linkToken: null
        }));
      }
    };
    useEffect(() => {
      console.log(plaidInfo)
    }, [plaidInfo]);

      const fetchIq = async() =>{
        const res:WealthIq[] = await authService.getWealthIQ()
        if(res.length>0){
          setIq(()=>res[0].iq)
          setPreviousIq(()=>[...res])
          const dbDate = new Date(res[0].createdAt);
          const now = new Date();
          const daysDifference = (now.getTime() - dbDate.getTime()) / (1000 * 60 * 60 * 24);
          if(daysDifference >= 30){
            setCanQuiz(()=>true)
          }
        }else{
          setCanQuiz(()=>true)
        }
      } 

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="w-full"
            {...other}
          >
            {value === index && <Box sx={{  }}>{children}</Box>}
          </div>
        );
    }
      
    function a11yProps(index: number) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
          <TabContext value={value}>
            <div className='flex flex-col items-center shadow-xl w-full min-h-20 bg-white rounded-4xl gap-4 p-4 sm:p-6 md:p-8 md:gap-8'>
                <div className='flex flex-col items-center relative shadow-xl w-full min-h-20 bg-white rounded-4xl gap-4 p-4 sm:p-6 md:p-8 md:gap-8'>
                    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center gap-3`}>
                        <img 
                            width={"60px"} 
                            height={"60px"} 
                            src={user?.imageUrl} 
                            alt="User profile"
                            className='rounded-full' 
                        />
                        <div className='flex flex-col text-center sm:text-left'>
                            <Typography fontWeight={"bold"} fontSize={"20px"}>
                                {userInfo?.firstName} {userInfo?.lastName}
                            </Typography>
                            <Typography className='text-gray-500' fontSize={"15px"}>
                                Account Holder
                            </Typography>
                        </div>
                    </div>
                    <div className={`${isMobile ? 'relative mt-4' : 'absolute top-5 right-5'}`}>
                        <FeatureGateComponent feature="plaid" action="connect">
                                {!plaidInfo?.loading&&<PlaidLinkButton plaidInfo={plaidInfo} />}
                        </FeatureGateComponent>
                        
                    </div>
                <div className="flex flex-col justify-center">
                    <Typography textAlign={'center'}>Wealth IQ score: <span className="font-bold">{iq?iq:"Complete the IQ test to view your first score"}</span></Typography>
                    <div className="flex justify-around items-center gap-4">
                        <Button color="warning" disabled={!iq&&true} onClick={handleOpen}>Previous scores</Button>

                        {canQuiz
                          ?
                          <Link to={'/quiz'} className="underline noyack-green" >Wealth IQ Test</Link>
                          :
                          <Button disabled className="noyack-green" >Wealth IQ Test</Button>
                        }
                    </div>
                </div>
                </div>

                <Divider variant="inset" className="w-full" style={{marginLeft:0}}/>
                
                {/* Responsive tabs section */}
                <div className="w-full relative">
                    {/* Left fade indicator */}
                    {showLeftFade && (
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10" />
                    )}
                    
                    {/* Scrollable tabs container */}
                    <div 
                        ref={tabsContainerRef}
                        className="w-full overflow-x-auto scrollbar-hide"
                        style={{ 
                            scrollbarWidth: 'none', 
                            msOverflowStyle: 'none' 
                        }}
                    >
                        <TabList 
                            onChange={handleChange} 
                            aria-label="financial information tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{ 
                                minHeight: '48px',
                                '& .MuiTabs-scrollButtons': {
                                    display: { xs: 'flex', md: 'flex' }
                                },
                                '& .MuiTab-root': {
                                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                                    minWidth: { xs: 'auto', md: '120px' },
                                    padding: { xs: '6px 12px', md: '12px 16px' }
                                }
                            }}
                        >
                            <Tab label="Basic Info" value={0} />
                            <Tab label="Income" value={1}/>
                            <Tab label="Assets & Allocation" value={2}  />
                            <Tab label="Debt Profile" value={3} />
                            <Tab label="Expenses" value={4} />
                            <Tab label="Emergency Funds" value={5} />
                            <Tab label="Budgeting" value={6} />
                            <Tab label="Plaid" value={7} />
                        </TabList>
                    </div>
                    
                    {/* Right fade indicator */}
                    {showRightFade && (
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
                    )}
                </div>
                
                <TabPanel value={0} className="w-full">
                    <BasicInfo  />
                </TabPanel>
                <TabPanel value={1} className="w-full">
                    <IncomeInfo />
                </TabPanel>
                <TabPanel value={2} className="w-full">
                    <AssetsAllocations />
                </TabPanel>
                <TabPanel value={3} className="w-full">
                    <DebtProfile />
                </TabPanel>
                <TabPanel value={4} className="w-full">
                    <Expenses />
                </TabPanel>
                <TabPanel value={5} className="w-full">
                    <EmergencyFunds />
                </TabPanel>
                <TabPanel value={6} className="w-full">
                    <Budget />
                </TabPanel>
                <TabPanel value={7} className="w-full">
                    <PlaidDashboard />
                </TabPanel>

            </div>
      </TabContext>
      <Modal
  aria-labelledby="wealth-iq-history-title"
  aria-describedby="wealth-iq-history-description"
  open={open}
  onClose={handleClose}
  closeAfterTransition
  slots={{ backdrop: Backdrop }}
  slotProps={{
    backdrop: {
      timeout: 500,
    },
  }}
>
  <Fade in={open}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
      maxWidth: '800px',
      maxHeight: '80vh',
      bgcolor: 'background.paper',
      borderRadius: '12px',
      boxShadow: 24,
      p: 0,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Typography id="wealth-iq-history-title" variant="h5" component="h2" fontWeight="bold">
          Wealth IQ History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your previous Wealth IQ test results and progress
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ 
        maxHeight: 'calc(80vh - 140px)', 
        overflowY: 'auto',
        p: 0
      }}>
        {previousIq && previousIq.length > 0 ? (
          <Box sx={{ p: 2 }}>
            {/* Table Header */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 2fr' },
              gap: 2,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: '8px',
              mb: 2,
              fontWeight: 'bold'
            }}>
              <Typography variant="subtitle2" fontWeight="bold">IQ Score</Typography>
              <Typography variant="subtitle2" fontWeight="bold">Completed Date</Typography>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Category
              </Typography>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Recommendations
              </Typography>
            </Box>

            {/* Table Rows */}
            {previousIq
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((iqRecord, index) => (
              <Box 
                key={iqRecord.id}
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr 2fr' },
                  gap: 2,
                  p: 2,
                  borderBottom: index !== previousIq.length - 1 ? '1px solid #e0e0e0' : 'none',
                  '&:hover': {
                    bgcolor: 'grey.25'
                  }
                }}
              >
                {/* Mobile Layout */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {iqRecord.iq}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(iqRecord.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      Category: {iqRecord.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Recommendations:</strong>
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                      {(expandedRows.has(iqRecord.id) 
                        ? iqRecord.recommendations 
                        : iqRecord.recommendations.slice(0, 2)
                      ).map((rec, recIndex) => (
                        <Typography component="li" variant="body2" key={recIndex} sx={{ mb: 0.5 }}>
                          {rec}
                        </Typography>
                      ))}
                      {iqRecord.recommendations.length > 2 && (
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer', 
                            fontStyle: 'italic',
                            textDecoration: 'underline',
                            '&:hover': {
                              color: 'primary.dark'
                            }
                          }}
                          onClick={() => toggleRowExpansion(iqRecord.id)}
                        >
                          {expandedRows.has(iqRecord.id) 
                            ? 'Show less' 
                            : `+${iqRecord.recommendations.length - 2} more recommendations`
                          }
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Desktop Layout */}
                <Box sx={{ display: { xs: 'none', sm: 'contents' } }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {iqRecord.iq}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(iqRecord.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {iqRecord.category}
                  </Typography>
                  <Box>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {(expandedRows.has(iqRecord.id) 
                        ? iqRecord.recommendations 
                        : iqRecord.recommendations.slice(0, 3)
                      ).map((rec, recIndex) => (
                        <Typography component="li" variant="body2" key={recIndex} sx={{ mb: 0.5 }}>
                          {rec}
                        </Typography>
                      ))}
                      {iqRecord.recommendations.length > 3 && (
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer', 
                            fontStyle: 'italic',
                            textDecoration: 'underline',
                            '&:hover': {
                              color: 'primary.dark'
                            }
                          }}
                          onClick={() => toggleRowExpansion(iqRecord.id)}
                        >
                          {expandedRows.has(iqRecord.id) 
                            ? 'Show less' 
                            : `+${iqRecord.recommendations.length - 3} more`
                          }
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No previous Wealth IQ scores found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Take your first Wealth IQ test to see your results here.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 3, 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Box>
  </Fade>
</Modal>
        </div>
    );
}

export default Wealthview;
