// import { Box, Tab, Tabs } from "@mui/material"
// import { useState } from "react";
import Overview from "./Overview";

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
//   }
  

// function CustomTabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;
  
//     return (
//       <div
//         role="tabpanel"
//         hidden={value !== index}
//         id={`simple-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//       >
//         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//       </div>
//     );
//   }
  
//   function a11yProps(index: number) {
//     return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//     };
//   }


function Wallet() {
    // const [value, setValue] = useState(0);
    // const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    //     setValue(newValue);
    // };

  return (
    <div className="flex flex-col">
        <div className="w-full min-h-[50dvh] px-10">
            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
                value={value} 
                onChange={handleChange} 
                aria-label="basic tabs example"
            >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Recurring Investments" {...a11yProps(2)} />
                <Tab label="Cash Out" {...a11yProps(3)} />
                <Tab label="History" {...a11yProps(4)} />
            </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Overview />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Item Four
            </CustomTabPanel> */}
            <Overview />
        </div>
    </div>
  )
}

export default Wallet