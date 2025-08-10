import { useState } from 'react';
import { 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  Search as SearchIcon,
  Home as HomeIcon,
  Money as MoneyIcon,
  Percent as PercentIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { glossaryTerms } from '../../utils/GlossaryTerms';

// Financial Glossary Component
const FinancialGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Define categories
  const categories = [
    { name: 'Housing', icon: <HomeIcon /> },
    { name: 'Money', icon: <MoneyIcon /> },
    { name: 'Rates', icon: <PercentIcon /> },
    { name: 'Time', icon: <ScheduleIcon /> },
    { name: 'Results', icon: <InsightsIcon /> },
    { name: 'Debt', icon: <CreditCardIcon /> },
    { name: 'Retirement', icon: <AccountBalanceIcon /> }
  ];

  // Filter terms based on search and category
  const filteredTerms = glossaryTerms.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box className="financial-glossary p-4">
      <Typography variant="h4" className="mb-6 text-center text-[#011E5A] font-bold">
        Financial Terms Glossary
      </Typography>
      
      <Typography variant="subtitle1" className="mb-6 text-center text-gray-600">
        Understanding the key financial concepts in our planning tools
      </Typography>
      
      <Box className="mb-6">
        <TextField
          fullWidth
          variant="outlined"
          label="Search terms"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Box className="mb-6 flex flex-wrap gap-2 justify-center">
        {categoryFilter && (
          <Chip 
            label="Clear filters" 
            onClick={() => setCategoryFilter(null)} 
            color="primary" 
            className="mr-2"
            variant="outlined"
          />
        )}
        
        {categories.map((category) => (
          <Chip
            key={category.name}
            label={category.name}
            onClick={() => setCategoryFilter(category.name === categoryFilter ? null : category.name)}
            color={category.name === categoryFilter ? "primary" : "default"}
            icon={category.icon}
            variant={category.name === categoryFilter ? "filled" : "outlined"}
          />
        ))}
      </Box>
      
      <Divider className="mb-6" />
      
      {filteredTerms.length === 0 ? (
        <Paper className="p-6 text-center">
          <Typography variant="h6" className="text-gray-500">
            No terms match your search
          </Typography>
          <Typography variant="body2" className="text-gray-400 mt-2">
            Try adjusting your search or clearing the filters
          </Typography>
        </Paper>
      ) : (
        filteredTerms.map((item, index) => (
          <Accordion key={index} className="mb-2">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`term-content-${index}`}
              id={`term-header-${index}`}
            >
              <Box className="flex items-center">
                <Typography variant="h6">{item.term}</Typography>
                <Chip 
                  label={item.category} 
                  size="small" 
                  variant="outlined"
                  className="ml-3"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                {item.definition}
              </Typography>
              
              <Typography variant="subtitle2" className="mt-2 font-bold">
                Example:
              </Typography>
              <Typography variant="body2" className="text-gray-600 italic">
                {item.example}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default FinancialGlossary;