import { Box } from "@mui/material";
import { TabPanelProps } from '../../../types';

// TabPanel component for tab interface
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expenses-tabpanel-${index}`}
      aria-labelledby={`expenses-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;