// Modified component with responsive tabs
import { AccountBalance, AttachMoney, KeyboardArrowRightOutlined, LocalAtmOutlined } from "@mui/icons-material"
import { ReactNode, useState, useRef, useEffect } from "react";
import FundStatus from "./components/FundSatus";
import RetirementCalc from "./components/RetiermentCalc";
import Community from "./components/Community";
import FIRECalculator from "./components/FIRECalculator";
import { Box, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Aside from "../../components/Layout/Aside";
import { FundStatusElement } from "../../types";
import { Link } from "react-router-dom";

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
  const theme = useTheme();
  const isFullWidth = useMediaQuery(theme.breakpoints.up(1492));
  // const isMobile = useMediaQuery(theme.breakpoints.down(1020));
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

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
    {
      id: 1,
      title: "Distribution Last quarter",
      value: "$565,541",
      icon: <AccountBalance sx={{height:"15px", color:"#fff"}}/>
    },
    {
      id: 2,
      title: "Target Annual Returns",
      value: "12-15%",
      icon: <AttachMoney sx={{height:"15px", color:"#fff"}}/>
    },
    {
      id: 3,
      title: "Resident Impact",
      value: "$756k+",
      icon: <LocalAtmOutlined sx={{height:"15px", color:"#fff"}}/>
    }
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-10 px-2">
        <FundStatus statusElements={statusElements} />
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
                    <Tab label="FIRE Calculator" {...a11yProps(1)} />
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
              <Link to={"/planning"} className="flex items-center text-sm">
                See More
                <KeyboardArrowRightOutlined fontSize="small" />
              </Link>
            </div>
          </div>

          <CustomTabPanel value={value} index={0}>
            <RetirementCalc />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <FIRECalculator />
          </CustomTabPanel>
        </div>
        <Community />
      </div>
      {isFullWidth && (
        <div className="h-screen sticky top-0">
          <Aside />
        </div>
      )}
    </div>
  );
};

export default Dashboard;