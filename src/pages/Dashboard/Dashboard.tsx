import { AccountBalance, AttachMoney, KeyboardArrowRightOutlined, LocalAtmOutlined } from "@mui/icons-material"
import { ReactNode, useState } from "react";
import FundStatus from "./components/FundSatus";
import RetirementCalc from "./components/RetiermentCalc";
import Community from "./components/Community";
import FIRECalculator from "./components/FIRECalculator";
import { Box, Tab, Tabs } from "@mui/material";
import Aside from "../../components/Layout/Aside";
import { FundStatusElement } from "../../types";
import { Link } from "react-router";


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

        <div className="flex justify-between items-center">
          <Tabs value={value} onChange={handleChange} aria-label="financial calculators tabs">
            <Tab label="Retirement Projection" {...a11yProps(0)} />
            <Tab label="FIRE Calculator" {...a11yProps(1)} />
          </Tabs>
          <Link to={"/planning"}>
            See More
            <KeyboardArrowRightOutlined />
          </Link>
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
      <div className="h-screen sticky top-0">
        <Aside />
      </div>
    </div>
  )
}

export default Dashboard;