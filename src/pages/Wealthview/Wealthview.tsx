import { useUser } from "@clerk/clerk-react";
import { Backdrop, Box, Button, Divider, Fade, Modal, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ReactNode, useState, useRef, useEffect, useContext } from "react";
import BasicInfo from "./BasicInfo";
import IncomeInfo from "./IncomeInfo";
import AssetsAllocations from "./AssetsAllocations";
import DebtProfile from "./DebtProfile";
import Expenses from "./Expenses";
import EmergencyFunds from "./EmergencyFunds";
import Budget from "./Budget";
import PlaidLinkButton from "./plaid/plaidButton";
import PlaidDashboard from "./plaid/PlaidDashboard";
import { Link } from "react-router";
import { UserContext } from "../../context/UserContext";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { FeatureGateComponent } from "../../components/FeatureGateComponent";


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
    const { userInfo } = useContext(UserContext)
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
    const [value, setValue] = useState('1');

      const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };
    

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
                                <PlaidLinkButton />
                        </FeatureGateComponent>
                        
                    </div>
                <div className="flex flex-col justify-center">
                    <Typography textAlign={'center'}>Wealth IQ score: <span className="font-bold">{iq?iq:"Complete the IQ test to view your first score"}</span></Typography>
                    <div className="flex justify-around items-center gap-4">
                        <Button color="warning" disabled={!iq&&true} onClick={handleOpen}>Previous scores</Button>
                        <Link to={'/quiz'} className="underline noyack-green" >Test Wealth IQ</Link>
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
                            <Tab label="Basic Info" value={"1"} />
                            <Tab label="Income" value={"2"}/>
                            <Tab label="Assets & Allocation" value={"3"}  />
                            <Tab label="Debt Profile" value={"4"} />
                            <Tab label="Expenses" value={"5"} />
                            <Tab label="Emergency Funds" value={"6"} />
                            <Tab label="Budgeting" value={"7"} />
                            <Tab label="Accounts" value={"8"} />
                        </TabList>
                    </div>
                    
                    {/* Right fade indicator */}
                    {showRightFade && (
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
                    )}
                </div>
                
                <TabPanel value={"1"} className="w-full">
                    <BasicInfo  />
                </TabPanel>
                <TabPanel value={"2"} className="w-full">
                    <IncomeInfo />
                </TabPanel>
                <TabPanel value={"3"} className="w-full">
                    <AssetsAllocations />
                </TabPanel>
                <TabPanel value={"4"} className="w-full">
                    <DebtProfile />
                </TabPanel>
                <TabPanel value={"5"} className="w-full">
                    <Expenses />
                </TabPanel>
                <TabPanel value={"6"} className="w-full">
                    <EmergencyFunds />
                </TabPanel>
                <TabPanel value={"7"} className="w-full">
                    <Budget />
                </TabPanel>
                <TabPanel value={"8"} className="w-full">
                    <PlaidDashboard />
                </TabPanel>

            </div>
      </TabContext>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
          <Box sx={modal}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
        </div>
    );
}

export default Wealthview;
