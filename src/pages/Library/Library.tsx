import { Box, Tab, Tabs } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import FinancialGlossary from "./FinancialGlossary";
import Ebook from "./Ebooks/Ebook";

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

function Library() {
  const [value, setValue] = useState<number>(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

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
  
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return(
      <>
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
                              <Tab label="Glossary" {...a11yProps(0)} />
                              <Tab label="Ebook" {...a11yProps(1)} />
                          </Tabs>
                      </div>
                      
                      {/* Right fade indicator */}
                      {showRightFade && (
                          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />
                      )}
                  </div>

                  <CustomTabPanel value={value} index={0}>
                    <FinancialGlossary />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Ebook />
                  </CustomTabPanel>
      </>
    )
}

export default Library