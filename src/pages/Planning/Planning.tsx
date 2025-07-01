import { Box, Paper, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import RentVsBuyCalculator from "./RentVsBuyCalculator";
import { 
  HomeRounded, 
  CalculateRounded, 
  ScheduleRounded, 
  AccountBalanceRounded, 
  ChildCareRounded, 
  CardGiftcardRounded, 
  AttachMoneyRounded, 
  TrendingUpRounded,
  Security as SecurityIcon,
  School as SchoolIcon,
  Calculate as CalculateIcon,
  Savings as SavingsIcon
} from "@mui/icons-material";
import DebtPayoffPlanner from "./DebtPayoffPlanner";
import RetirementCalculator from "./RetirementCalculator";
import TaxOptimizationCalculator from "./TaxOptimizationCalculator";
import ChildCostProjector from "./ChildCostProjector";
import WindfallOptimizer from "./Windfall";
import RealHourlyWageCalculator from "./RealHourlyWageCalculator";
import LifestyleInflationCalculator from "./LifestyleInflationCalculator";
import EmergencyFundCalculator from "./EmergencyFundCalculator";
import CollegeSavingsCalculator from "./CollegeSavingsCalculator";
import MortgageCalculator from "./MortgageCalculator";
import FourOhOneKCalculator from "./Four_OneKCalculator";
// import CostOfOwnership from "./CostOfOwnership";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`planning-tabpanel-${index}`}
      aria-labelledby={`planning-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `planning-tab-${index}`,
    'aria-controls': `planning-tabpanel-${index}`,
  };
}

const Planning = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Define calculator tabs data
  const calculatorTabs = [
    { icon: <HomeRounded />, label: "Rent vs. Buy", shortLabel: "Rent/Buy" },
    { icon: <CalculateIcon />, label: "Mortgage Calculator", shortLabel: "Mortgage" },
    { icon: <SavingsIcon />, label: "401(k) Calculator", shortLabel: "401(k)" },
    { icon: <CalculateRounded />, label: "Retirement Calculator", shortLabel: "Retirement" },
    { icon: <ScheduleRounded />, label: "Debt Payoff Planner", shortLabel: "Debt" },
    { icon: <AccountBalanceRounded />, label: "Tax Optimization", shortLabel: "Tax" },
    { icon: <SecurityIcon />, label: "Emergency Fund", shortLabel: "Emergency" },
    { icon: <SchoolIcon />, label: "College Savings", shortLabel: "College" },
    { icon: <ChildCareRounded />, label: "Cost of Child", shortLabel: "Child" },
    { icon: <AttachMoneyRounded />, label: "Real Hourly Wage", shortLabel: "Hourly" },
    { icon: <TrendingUpRounded />, label: "Lifestyle Inflation", shortLabel: "Lifestyle" },
    { icon: <CardGiftcardRounded />, label: "Windfall", shortLabel: "Windfall" }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <Box className="mb-6">
        <Typography variant="h4" className="text-[#011E5A] font-bold mb-2">
          Financial Planning
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Tools to help you make informed financial decisions
        </Typography>
      </Box>

      <Paper elevation={1} className="w-full">
        {/* Tab Navigation with Enhanced Scrolling */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="planning tools tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              minHeight: isMobile ? 48 : 64,
              '& .MuiTab-root': {
                minWidth: isMobile ? 80 : 120,
                maxWidth: isMobile ? 120 : 180,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? '6px 8px' : '12px 16px',
                textTransform: 'none',
                fontWeight: 500
              },
              '& .MuiTabs-scrollButtons': {
                color: 'primary.main',
                '&.Mui-disabled': {
                  opacity: 0.3
                },
                '&:hover': {
                  bgcolor: 'primary.50'
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTabs-flexContainer': {
                gap: isMobile ? 0.5 : 1
              }
            }}
          >
            {calculatorTabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={isMobile ? tab.shortLabel : tab.label}
                {...a11yProps(index)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.main'
                  },
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Progress Indicator */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 1, 
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            {activeTab + 1} of {calculatorTabs.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, overflow: 'hidden', maxWidth: '200px' }}>
            {calculatorTabs.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === activeTab ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  '&:hover': {
                    transform: 'scale(1.2)',
                    bgcolor: index === activeTab ? 'primary.dark' : 'grey.400'
                  }
                }}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {calculatorTabs[activeTab].label}
          </Typography>
        </Box>

        {/* Tab Content */}
        <CustomTabPanel value={activeTab} index={0}>
          <RentVsBuyCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={1}>
          <MortgageCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={2}>
          <FourOhOneKCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={3}>
          <RetirementCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={4}>
          <DebtPayoffPlanner />          
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={5}>
          <TaxOptimizationCalculator />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={6}>
          <EmergencyFundCalculator />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={7}>
          <CollegeSavingsCalculator />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={8}>
          <ChildCostProjector />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={9}>
          <RealHourlyWageCalculator />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={10}>
          <LifestyleInflationCalculator />
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={11}>
          <WindfallOptimizer /> 
        </CustomTabPanel>
      </Paper>
    </div>
  );
};

export default Planning;