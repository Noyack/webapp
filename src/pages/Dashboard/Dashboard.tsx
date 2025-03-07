import { DashboardSearch } from "../../components/UI/SearchInput"
import { AccountBalance, AttachMoney, LocalAtmOutlined } from "@mui/icons-material"
import { ReactNode, useState } from "react";
import FundSatus from "./components/FundSatus";
import RetiermentCalc from "./components/RetiermentCalc";
import Community from "./components/Community";
import FIRECalculator from "./components/FIRECalculator";
import { Box, Tab, Tabs } from "@mui/material";

export type FundStatusProp = {
  title: string;
  value: string;
  icon: ReactNode
}
const statusElements:FundStatusProp[] = [
  {
    title:" Distribution Last quarter",
    value:"$565,541",
    icon: <AccountBalance sx={{height:"15px",  color:"#fff"}}/>
  },
  {
    title:"Target Annial Returns",
    value:"12-15%",
    icon: <AttachMoney  sx={{height:"15px",  color:"#fff"}}/>
  },
  {
    title:"Resident Impact",
    value:"$756k+",
    icon: <LocalAtmOutlined  sx={{height:"15px",  color:"#fff"}}/>
  }
]
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
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className="flex flex-col gap-10 px-2">
      <DashboardSearch />
      <FundSatus statusElements={statusElements} />
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Retirement Projection" {...a11yProps(0)} />
          <Tab label="FIRE Calculator" {...a11yProps(1)} />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
      <RetiermentCalc />
      </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
      <FIRECalculator />
      </CustomTabPanel>
      <Community />
    </div>
  )
}

export default Dashboard