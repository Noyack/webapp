import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import RentVsBuyCalculator from "./RentVsBuyCalculator";
import { HomeRounded, CalculateRounded, ScheduleRounded, AccountBalanceRounded } from "@mui/icons-material";
import FinancialGlossary from "./FinancialGlossary";
import DebtPayoffPlanner from "./DebtPayoffPlanner";
import RetirementCalculator from "./RetirementCalculator";
import TaxOptimizationCalculator from "./TaxOptimizationCalculator";

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
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="planning tools tabs"
          className="border-b border-gray-200"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<HomeRounded />} 
            iconPosition="start" 
            label="Rent vs. Buy" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<CalculateRounded />} 
            iconPosition="start" 
            label="Retirement Calculator" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<ScheduleRounded />} 
            iconPosition="start" 
            label="Debt Payoff Planner" 
            {...a11yProps(2)} 
          />
          <Tab 
            icon={<AccountBalanceRounded />} 
            iconPosition="start" 
            label="Tax Optimization" 
            {...a11yProps(3)} 
          />
        </Tabs>

        <CustomTabPanel value={activeTab} index={0}>
          <RentVsBuyCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={1}>
          <RetirementCalculator />
        </CustomTabPanel>
        
        <CustomTabPanel value={activeTab} index={2}>
            <DebtPayoffPlanner />          
        </CustomTabPanel>
        <CustomTabPanel value={activeTab} index={3}>
          <TaxOptimizationCalculator />
        </CustomTabPanel>
      </Paper>
      <FinancialGlossary />
    </div>
  );
};

export default Planning;