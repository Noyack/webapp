// Modified component with responsive tabs
import {  KeyboardArrowRightOutlined } from "@mui/icons-material"
import { ReactNode, useState, useRef, useEffect, useContext, FC } from "react";
import FundStatus from "./components/FundSatus";
import RetirementCalc from "./components/RetiermentCalc";
import Academy from "./components/Academy";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { FundStatusElement } from "../../types";
import { Link } from "react-router-dom";
import DebtPayoffPlanner from "../Planning/DebtPayoffPlanner";
import WealthStatus from "./components/WealthStatus";
import { authService } from "../../services";
import { UserContext } from "../../context/UserContext";
import hubspotService from "../../services/hubspot.service";
import LoadingSpinner from "../../components/UI/Loader";

// Define type for tab panel props
interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = useState<number>(0);
  const { userInfo } = useContext(UserContext)
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [wealth, setWealth] = useState({income:0,expenses:0, debt:0})
  const [events, setEvents] = useState([])
  const [ fetching, setFetching ] = useState<boolean>(false)
  useEffect(()=>{
    const fetch = async()=>{
      setFetching(()=>true)
      if(userInfo?.id){
      await authService.getWealth(userInfo?.id).then((res)=>{
        setWealth({income:res.income.income, expenses:res.expenses.expenses, debt:res.debt.debt})
      })
      await hubspotService.getSummaryEvent().then((res)=>{
        setEvents(res.response)
      })
      setFetching(()=>false)
    }
  }
  fetch() 
  },[userInfo?.id])

  // Check if scrolling is needed and update fade indicators
  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Set initial fade status and add event listener
  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    
    // Initial check
    checkScrollPosition();
    
    // Set up scroll event listener
    if (tabsContainer) {
      tabsContainer.addEventListener('scroll', checkScrollPosition);
      
      // Handle resize events
      const resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(tabsContainer);
      
      return () => {
        tabsContainer.removeEventListener('scroll', checkScrollPosition);
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Ensure statusElements has a consistent structure with IDs
  const statusElements: FundStatusElement[] = [
    // {
    //   id: 1,
    //   title: "Resident Impact",
    //   value: "$756k+",
    //   icon: <LocalAtmOutlined sx={{height:"15px", color:"#fff"}}/>
    // }
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if(fetching)
    return(<LoadingSpinner />)

  return (
    <div className="flex justify-center ">
      <div className="flex flex-col gap-10 px-2 min-w-[50dvw]">
        {/* <FundStatus statusElements={statusElements} /> */}
        <WealthStatus wealth={wealth} />
        <div>
          {/* New responsive tab layout */}
          <div className="relative flex flex-col w-full">
            {/* Tab container with horizontal scroll */}
            <div className="relative w-full">
              {/* Left fade indicator */}
              {showLeftFade && (
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10" />
              )}
              
              {/* Scrollable tabs container */}
              <div 
                ref={tabsContainerRef}
                className="w-full overflow-x-auto scrollbar-hide" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div style={{ minWidth: 'min-content' }}>
                  <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="financial calculators tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                      minHeight: '48px',
                      '& .MuiTabs-scrollButtons': {
                        display: { xs: 'auto', sm: 'auto' }
                      }
                    }}
                  >
                    <Tab label="Retirement Projection" {...a11yProps(0)} />
                    <Tab label="Debt Payoff" {...a11yProps(1)} />
                  </Tabs>
                </div>
              </div>
              
              {/* Right fade indicator */}
              {showRightFade && (
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
              )}
            </div>
            
            {/* "See More" link always on the right */}
            <div className="flex justify-end mt-2 mb-2">
              <Link to={"/tools"} className="flex items-center text-sm">
                See More
                <KeyboardArrowRightOutlined fontSize="small" />
              </Link>
            </div>
              <Typography variant="caption" textAlign={'center'}>
                **These calculators are simplified solutions of our more advanced tools, see more or navigate to the Tools page**
              </Typography>
          </div>

          <CustomTabPanel value={value} index={0}>
            <RetirementCalc />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DebtPayoffPlanner />
          </CustomTabPanel>
        </div>
        < Academy events={events} fetching={fetching}/>
      </div>
    </div>
  );
};

export default Dashboard;