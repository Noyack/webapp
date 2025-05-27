import { useUser } from "@clerk/clerk-react";
import { Box, Divider, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ReactNode, useState, useRef, useEffect } from "react";
import BasicInfo from "./BasicInfo";
import IncomeInfo from "./IncomeInfo";
import AssetsAllocations from "./AssetsAllocations";
import DebtProfile from "./DebtProfile";
import Expenses from "./Expenses";
import EmergencyFunds from "./EmergencyFunds";
import PlaidLinkButton from "./plaid/plaidButton";
import PlaidDashboard from "./plaid/PlaidDashboard";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function Wealthview() {
    const { user } = useUser();
    const [value, setValue] = useState<number>(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(1020));
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    // Check scroll position and update fade indicators
    const checkScrollPosition = () => {
      if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowLeftFade(scrollLeft > 0);
        setShowRightFade(scrollLeft + clientWidth < scrollWidth - 5); // Small buffer to ensure right fade shows correctly
      }
    };
    
    // Set initial fade status and add event listener
    useEffect(() => {
      const tabsContainer = tabsContainerRef.current;
      
      // Initial check after component mounts and tabs render
      setTimeout(() => {
        checkScrollPosition();
      }, 100);
      
      // Set up scroll event listener
      if (tabsContainer) {
        tabsContainer.addEventListener('scroll', checkScrollPosition);
        
        // Handle resize events
        const resizeObserver = new ResizeObserver(() => {
          checkScrollPosition();
        });
        resizeObserver.observe(tabsContainer);
        
        return () => {
          tabsContainer.removeEventListener('scroll', checkScrollPosition);
          resizeObserver.disconnect();
        };
      }
    }, []);

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
                                {user?.fullName}
                            </Typography>
                            <Typography className='text-gray-500' fontSize={"15px"}>
                                Account Holder
                            </Typography>
                        </div>
                    </div>
                    <div className={`${isMobile ? 'relative mt-4' : 'absolute top-5 right-5'}`}>
                        <div className="flex items-center gap-2">
                            Connect with <PlaidLinkButton />
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
                        <Tabs 
                            value={value} 
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
                            <Tab label="Basic Info" {...a11yProps(0)} />
                            <Tab label="Income" {...a11yProps(1)} />
                            <Tab label="Assets & Allocation" {...a11yProps(2)} />
                            <Tab label="Debt Profile" {...a11yProps(3)} />
                            <Tab label="Expenses" {...a11yProps(4)} />
                            <Tab label="Emergency Funds" {...a11yProps(5)} />
                            <Tab label="Accounts" {...a11yProps(6)} />
                        </Tabs>
                    </div>
                    
                    {/* Right fade indicator */}
                    {showRightFade && (
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
                    )}
                </div>
                
                <CustomTabPanel value={value} index={0}>
                    <BasicInfo  />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <IncomeInfo />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <AssetsAllocations />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <DebtProfile />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                    <Expenses />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={5}>
                    <EmergencyFunds />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={6}>
                    <PlaidDashboard />
                </CustomTabPanel>
            </div>
        </div>
    );
}

export default Wealthview;