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

  // Glossary terms with definitions and categories
  const glossaryTerms = [
    {
      term: 'Down Payment',
      definition: 'The initial upfront portion of the total home purchase price that you pay in cash (not financed through a mortgage). Typically ranges from 3% to 20% of the home price.',
      example: 'On a $300,000 home with a 20% down payment, you would pay $60,000 upfront.',
      category: 'Housing'
    },
    {
      term: 'Monthly Rent',
      definition: 'The amount you pay each month to your landlord in exchange for living in a property you don\'t own.',
      example: 'A typical monthly rent might be $1,500 for an apartment.',
      category: 'Housing'
    },
    {
      term: 'Home Price',
      definition: 'The total purchase price of a home. This is the amount you\'ll need to finance through a combination of your down payment and mortgage loan.',
      example: 'The median home price in the US is around $400,000 as of 2025.',
      category: 'Housing'
    },
    {
      term: 'Mortgage',
      definition: 'A loan specifically for buying real estate where the property serves as collateral. If you don\'t repay the loan, the lender can take your home through foreclosure.',
      example: 'A $240,000 mortgage on a $300,000 home with a $60,000 down payment.',
      category: 'Money'
    },
    {
      term: 'Principal',
      definition: 'The original amount of money borrowed in a loan, or the amount still owed, not including interest.',
      example: 'If you borrow $240,000, that\'s your principal. As you make payments, your principal decreases.',
      category: 'Money'
    },
    {
      term: 'Interest',
      definition: 'The cost of borrowing money, expressed as a percentage of the loan amount. You pay interest on your mortgage in addition to repaying the principal.',
      example: 'A 5% interest rate on a $240,000 mortgage means you\'ll pay about $12,000 in interest during the first year.',
      category: 'Rates'
    },
    {
      term: 'Interest Rate',
      definition: 'The percentage that a lender charges on the amount you borrow. Mortgage interest rates can be fixed (staying the same for the whole loan term) or adjustable (changing over time).',
      example: 'A 30-year fixed mortgage might have a 5.5% interest rate.',
      category: 'Rates'
    },
    {
      term: 'PMI (Private Mortgage Insurance)',
      definition: 'Insurance that protects the lender if you stop making payments on your mortgage. Usually required if your down payment is less than 20% of the home\'s value.',
      example: 'With a 10% down payment, you might pay $100-200 per month for PMI until you reach 20% equity.',
      category: 'Housing'
    },
    {
      term: 'Property Tax',
      definition: 'Taxes charged by local governments based on the value of your property. These vary widely depending on location.',
      example: 'If your property tax rate is 1% and your home is worth $300,000, you would pay $3,000 annually in property taxes.',
      category: 'Housing'
    },
    {
      term: 'Homeowner\'s Insurance',
      definition: 'Insurance that covers damage to your home from various causes like fire, weather, or theft. Mortgage lenders require you to have this insurance.',
      example: 'Homeowner\'s insurance might cost $1,200 per year for a $300,000 home.',
      category: 'Housing'
    },
    {
      term: 'Renter\'s Insurance',
      definition: 'Insurance that protects your personal belongings in a rented home or apartment. It does not cover the building itself.',
      example: 'Renter\'s insurance typically costs $15-30 per month.',
      category: 'Housing'
    },
    {
      term: 'HOA (Homeowners Association) Fees',
      definition: 'Monthly or annual fees paid by homeowners in certain communities to maintain common areas and amenities.',
      example: 'HOA fees might range from $100 to $700 monthly depending on the community and services provided.',
      category: 'Housing'
    },
    {
      term: 'Closing Costs',
      definition: 'Fees and expenses paid at the closing of a real estate transaction, over and above the purchase price. These typically range from 3-5% of the loan amount.',
      example: 'On a $300,000 home, closing costs might be $9,000-15,000.',
      category: 'Housing'
    },
    {
      term: 'Maintenance Costs',
      definition: 'Ongoing expenses for keeping a home in good condition, including repairs and routine upkeep.',
      example: 'A common rule of thumb is to budget 1% of your home\'s value annually for maintenance, so $3,000 per year on a $300,000 home.',
      category: 'Housing'
    },
    {
      term: 'Appreciation',
      definition: 'The increase in a property\'s value over time. Real estate often (but not always) increases in value due to factors like inflation, development, and market demand.',
      example: 'If your home appreciates by 3% annually, a $300,000 home would be worth $309,000 after one year.',
      category: 'Rates'
    },
    {
      term: 'Depreciation',
      definition: 'The decrease in a property\'s value over time, which can happen due to deterioration, neighborhood decline, or market downturns.',
      example: 'During the 2008 housing crisis, many homes depreciated by 20% or more.',
      category: 'Rates'
    },
    {
      term: 'Amortization',
      definition: 'The process of spreading out a loan into a series of fixed payments over time. Early in a mortgage, most of your payment goes toward interest, while later payments go more toward principal.',
      example: 'In a 30-year mortgage, you might pay mostly interest for the first 10-15 years.',
      category: 'Money'
    },
    {
      term: 'Equity',
      definition: 'The portion of your home that you truly "own." It\'s the difference between your home\'s market value and the amount you still owe on your mortgage.',
      example: 'If your home is worth $350,000 and you owe $200,000 on your mortgage, you have $150,000 in equity.',
      category: 'Money'
    },
    {
      term: 'Mortgage Term',
      definition: 'The length of time over which you\'ll repay your mortgage, typically 15 or 30 years.',
      example: 'A 30-year mortgage will have lower monthly payments than a 15-year mortgage but will cost more in interest over time.',
      category: 'Time'
    },
    {
      term: 'Annual Percentage Rate (APR)',
      definition: 'The yearly cost of a loan including interest and fees, expressed as a percentage. APR is always higher than the interest rate alone.',
      example: 'A mortgage with a 5.5% interest rate might have an APR of 5.7% when fees are included.',
      category: 'Rates'
    },
    {
      term: 'Fixed-Rate Mortgage',
      definition: 'A mortgage with an interest rate that stays the same for the entire term of the loan.',
      example: 'A 30-year fixed-rate mortgage at 5.5% will have the same interest rate in year 30 as in year 1.',
      category: 'Rates'
    },
    {
      term: 'Adjustable-Rate Mortgage (ARM)',
      definition: 'A mortgage with an interest rate that can change over time, usually after an initial fixed period.',
      example: 'A 5/1 ARM has a fixed rate for 5 years, then adjusts annually after that.',
      category: 'Rates'
    },
    {
      term: 'Inflation',
      definition: 'The general increase in prices and fall in the purchasing value of money over time.',
      example: 'With 3% annual inflation, something that costs $100 today would cost $103 next year.',
      category: 'Rates'
    },
    {
      term: 'Return on Investment (ROI)',
      definition: 'A performance measure used to evaluate the efficiency of an investment. In the context of housing, this might refer to how much your home appreciates compared to what you paid.',
      example: 'If you buy a home for $300,000 and sell it for $400,000 ten years later, your ROI would be about 33% (not accounting for other costs).',
      category: 'Results'
    },
    {
      term: 'Break-Even Point',
      definition: 'The point in time when the cost of buying a home becomes less than the cost of renting, considering all expenses and equity built.',
      example: 'Your calculator might show that buying becomes cheaper than renting after 5 years in a specific scenario.',
      category: 'Results'
    },
    {
      term: 'Opportunity Cost',
      definition: 'The potential benefit that is lost when choosing one alternative over another. In a rent vs. buy decision, this often refers to what you could have earned by investing your down payment money elsewhere.',
      example: 'If you use $60,000 for a down payment instead of investing it in stocks that earn 7% annually, your opportunity cost is $4,200 in the first year.',
      category: 'Results'
    },
    {
      term: 'Net Worth',
      definition: 'The total value of what you own (assets) minus what you owe (liabilities). Home equity contributes to your net worth.',
      example: 'If you have $150,000 in home equity, $50,000 in savings, and $20,000 in other debts, your net worth would be $180,000.',
      category: 'Results'
    },
    {
      term: 'Tax Deduction',
      definition: 'An expense that reduces your taxable income. Mortgage interest and property taxes are often tax-deductible for homeowners who itemize deductions.',
      example: 'If you pay $10,000 in mortgage interest and are in the 22% tax bracket, you might save $2,200 in taxes.',
      category: 'Money'
    },
    {
      term: 'Rent Increase',
      definition: 'The amount by which a landlord raises rent, usually annually. This can vary widely depending on location and market conditions.',
      example: 'A 3% annual rent increase would raise a $1,500 monthly rent to $1,545 after one year.',
      category: 'Rates'
    },
    {
      term: 'Rate of Return on Savings',
      definition: 'The percentage gain or loss on an investment over a set period. In a rent vs. buy analysis, this represents what you could earn by investing money instead of using it for a down payment.',
      example: 'The stock market has historically returned about 7% annually over long periods.',
      category: 'Rates'
    },
    {
      term: 'Time Horizon',
      definition: 'The length of time you expect to hold an investment or live in a home. This is a critical factor in the rent vs. buy decision.',
      example: 'If your time horizon is only 2-3 years, renting might be more cost-effective than buying due to transaction costs.',
      category: 'Time'
    },
    {
      term: 'Total Cost of Ownership',
      definition: 'All expenses associated with owning a home, including mortgage, taxes, insurance, maintenance, and opportunity costs.',
      example: 'The total cost of owning a $300,000 home over 30 years might be $600,000 or more when all expenses are considered.',
      category: 'Results'
    },
    {
      term: 'Total Cost of Renting',
      definition: 'All expenses associated with renting, including rent payments, renter\'s insurance, and any other fees. This doesn\'t build any equity.',
      example: 'Paying $1,500 per month in rent for 30 years would cost $540,000, not accounting for rent increases.',
      category: 'Results'
    },
    {
      term: 'Investment Account Balance',
      definition: 'In a rent vs. buy analysis, this represents the amount you could accumulate by investing the difference between renting and buying costs, including the down payment amount.',
      example: 'If you invested your $60,000 down payment plus $200 monthly savings from renting, you might accumulate $250,000 after 15 years.',
      category: 'Results'
    },
    {
      term: 'Net Buying Cost',
      definition: 'The total cost of buying and owning a home minus the equity built through mortgage payments and home appreciation.',
      example: 'If you spend $400,000 on mortgage and expenses over 15 years but build $300,000 in equity, your net buying cost would be $100,000.',
      category: 'Results'
    },
    // Debt Payoff Terms
    {
      term: 'Debt Snowball',
      definition: 'A debt repayment strategy where you pay off your smallest debts first, regardless of interest rate, to build momentum with quick wins.',
      example: 'If you have debts of $2,000, $5,000, and $10,000, you would focus on the $2,000 debt first using the snowball method.',
      category: 'Debt'
    },
    {
      term: 'Debt Avalanche',
      definition: 'A debt repayment strategy where you pay off debts with the highest interest rates first, which saves the most money overall.',
      example: 'If you have three credit cards with interest rates of 22%, 18%, and 15%, you would focus on paying off the 22% card first with the avalanche method.',
      category: 'Debt'
    },
    {
      term: 'Minimum Payment',
      definition: 'The smallest amount you can pay on a debt each month without defaulting. Paying only the minimum extends your repayment time and increases interest costs.',
      example: 'A credit card with a $5,000 balance might have a minimum payment of $150, but paying only that could take over 15 years to repay the debt.',
      category: 'Debt'
    },
    {
      term: 'Debt Payoff Date',
      definition: 'The estimated date when a debt will be completely paid off based on your current payment plan.',
      example: 'If you pay $300 monthly on a $10,000 loan at 5% interest, your payoff date would be approximately 3 years from now.',
      category: 'Debt'
    },
    {
      term: 'Consumer Debt',
      definition: 'Money owed for purchases of goods and services for personal consumption, such as credit cards, auto loans, and personal loans.',
      example: 'Having $8,000 in credit card debt, a $15,000 car loan, and a $5,000 personal loan means you have $28,000 in consumer debt.',
      category: 'Debt'
    },
    {
      term: 'Revolving Debt',
      definition: 'Credit arrangements that allow you to borrow money up to a certain limit, repay it, and borrow again without applying for a new loan. Credit cards are the most common form.',
      example: 'If you have a credit card with a $10,000 limit, charge $3,000, pay back $1,000, and then charge another $2,000, you\'re using revolving debt.',
      category: 'Debt'
    },
    {
      term: 'Installment Debt',
      definition: 'A loan that is repaid on a regular schedule (in installments) with a fixed payment amount. Auto loans, mortgages, and student loans are common examples.',
      example: 'A 5-year car loan with monthly payments of $350 is an installment debt.',
      category: 'Debt'
    },
    {
      term: 'Principal Balance',
      definition: 'The amount you still owe on a loan, not including interest. As you make payments, your principal balance decreases.',
      example: 'If you borrowed $20,000 and have paid $5,000 toward the principal, your principal balance is $15,000.',
      category: 'Debt'
    },
    {
      term: 'Compound Interest',
      definition: 'Interest calculated on both the initial principal and the accumulated interest from previous periods. In debt, this works against you by making your balance grow faster.',
      example: 'If you have $5,000 in credit card debt at 18% annual interest and don\'t make payments, it would grow to $5,900 after one year due to compound interest.',
      category: 'Rates'
    },
    {
      term: 'Debt-to-Income Ratio (DTI)',
      definition: 'The percentage of your gross monthly income that goes toward paying debts. Lenders use this to assess your ability to take on additional debt.',
      example: 'If your monthly income is $5,000 and you pay $1,500 in debt payments, your DTI is 30%.',
      category: 'Debt'
    },
    {
      term: 'Debt Consolidation',
      definition: 'The process of combining multiple debts into a single loan, ideally with a lower interest rate, to simplify payments and potentially reduce interest costs.',
      example: 'Taking out a $20,000 personal loan at 10% interest to pay off five credit cards with 20-25% interest rates is a form of debt consolidation.',
      category: 'Debt'
    },
    {
      term: 'Debt-Free Date',
      definition: 'The estimated date when you will have paid off all your debts based on your current payment strategy.',
      example: 'Following your debt payoff plan, you might be completely debt-free by March 2027.',
      category: 'Debt'
    },
    {
      term: 'Extra Payment',
      definition: 'Any amount paid toward a debt above the required minimum payment. Extra payments reduce the principal faster and save interest.',
      example: 'If your minimum mortgage payment is $1,200 and you pay $1,500, you\'re making a $300 extra payment each month.',
      category: 'Debt'
    },
    // Retirement Terms
    {
      term: 'Retirement Age',
      definition: 'The age at which you plan to stop working and begin living off accumulated savings, investments, and benefits.',
      example: 'Planning to retire at age 65 means you\'ll need your retirement savings to last from age 65 until the end of your life.',
      category: 'Retirement'
    },
    {
      term: 'Retirement Savings',
      definition: 'Money set aside specifically for your retirement years, often in tax-advantaged accounts like 401(k)s or IRAs.',
      example: 'Building up $1 million in retirement savings through regular contributions to your 401(k) over your working career.',
      category: 'Retirement'
    },
    {
      term: 'Social Security Benefits',
      definition: 'Monthly payments from the government to eligible individuals during retirement, based on their work history and lifetime earnings.',
      example: 'After working for 35 years, your Social Security benefits might be $1,800 per month starting at age 67.',
      category: 'Retirement'
    },
    {
      term: '401(k)',
      definition: 'A tax-advantaged retirement account sponsored by employers, allowing employees to contribute pre-tax money from their paychecks.',
      example: 'Contributing 10% of your $60,000 salary ($6,000 per year) to your company\'s 401(k) plan to save for retirement.',
      category: 'Retirement'
    },
    {
      term: 'IRA (Individual Retirement Account)',
      definition: 'A tax-advantaged retirement account that individuals can set up and fund themselves, separate from employer-sponsored plans.',
      example: 'Opening a Roth IRA and contributing $6,000 annually for retirement, with tax-free growth and withdrawals.',
      category: 'Retirement'
    },
    {
      term: 'Roth vs. Traditional',
      definition: 'Two different tax treatments for retirement accounts. Traditional accounts are funded with pre-tax dollars (tax deferred), while Roth accounts use after-tax dollars but grow tax-free.',
      example: 'With a traditional 401(k), you don\'t pay taxes now but will pay them when you withdraw. With a Roth 401(k), you pay taxes now but withdrawals in retirement are tax-free.',
      category: 'Retirement'
    },
    {
      term: 'Required Minimum Distribution (RMD)',
      definition: 'The minimum amount you must withdraw from certain retirement accounts each year, generally beginning at age 73.',
      example: 'At age 73, you might need to withdraw at least $20,000 from your traditional IRA and 401(k) accounts, based on your account balance and life expectancy.',
      category: 'Retirement'
    },
    {
      term: 'Pension',
      definition: 'A retirement plan where an employer makes contributions to a pool of funds set aside for workers\' future benefits, giving retirees a fixed payout after retirement.',
      example: 'After 30 years with a company, you might receive a pension of $3,000 monthly for the rest of your life.',
      category: 'Retirement'
    },
    {
      term: 'Annuity',
      definition: 'A financial product that pays out a fixed stream of income over time, often used as part of retirement planning.',
      example: 'Purchasing an annuity for $250,000 that provides $1,500 monthly income for the rest of your life.',
      category: 'Retirement'
    },
    {
      term: 'Income Replacement Ratio',
      definition: 'The percentage of your pre-retirement income that you\'ll need to maintain your lifestyle in retirement.',
      example: 'Using an 80% income replacement ratio means if you earn $100,000 before retirement, you\'ll need about $80,000 annually in retirement.',
      category: 'Retirement'
    },
    {
      term: 'Cost of Living Adjustment (COLA)',
      definition: 'An increase in income or benefits to account for changes in the cost of living, often tied to inflation.',
      example: 'Social Security benefits receiving a 2.5% COLA to help retirees keep pace with rising prices.',
      category: 'Retirement'
    },
    {
      term: 'Life Expectancy',
      definition: 'An estimate of how long a person is expected to live, often used in retirement planning to determine how long savings need to last.',
      example: 'Planning for retirement funds to last until age 95 to ensure you don\'t outlive your savings.',
      category: 'Retirement'
    },
    {
      term: '4% Rule',
      definition: 'A retirement withdrawal guideline suggesting that retirees can safely withdraw 4% of their retirement savings the first year, adjusting for inflation thereafter, with minimal risk of running out of money over a 30-year retirement.',
      example: 'With $1 million in retirement savings, you could withdraw $40,000 the first year, then adjust that amount for inflation each subsequent year.',
      category: 'Retirement'
    },
    {
      term: 'Catch-Up Contributions',
      definition: 'Additional amounts that individuals age 50 and older can contribute to retirement accounts beyond the standard limits.',
      example: 'At age 55, you can contribute the standard $22,500 to your 401(k) plus a $7,500 catch-up contribution, for a total of $30,000 per year.',
      category: 'Retirement'
    },
    {
      term: 'Retirement Shortfall',
      definition: 'The gap between what you have saved and what you will need for retirement, indicating potential future financial challenges.',
      example: 'Needing $1.2 million for retirement but only being on track to save $800,000 means you have a $400,000 retirement shortfall to address.',
      category: 'Retirement'
    },
    {
      term: 'Sequence of Returns Risk',
      definition: 'The danger that the timing of withdrawals from retirement accounts will damage the investor\'s overall return rate, particularly if early withdrawals occur during market downturns.',
      example: 'Starting retirement during a major market downturn and needing to sell investments at reduced prices to fund expenses, permanently reducing your portfolio\'s long-term value.',
      category: 'Retirement'
    },
    {
      term: 'Healthcare in Retirement',
      definition: 'Medical care costs during retirement years, which typically increase significantly as people age and often represent one of the largest expenses in retirement.',
      example: 'Budgeting $300,000 for healthcare costs during retirement for a couple retiring at age 65.',
      category: 'Retirement'
    },
    {
      term: 'Medicare',
      definition: 'The federal health insurance program for people who are 65 or older, certain younger people with disabilities, and people with End-Stage Renal Disease.',
      example: 'Enrolling in Medicare at age 65 to cover hospital stays, doctor visits, and prescription drugs during retirement.',
      category: 'Retirement'
    },
    {
      term: 'Long-Term Care',
      definition: 'Services designed to meet health or personal care needs for an extended period, such as nursing home care or in-home assistance. This is often a major retirement expense not fully covered by Medicare.',
      example: 'Purchasing long-term care insurance at age 60 to help cover potential nursing home costs of $90,000 per year if needed in later retirement years.',
      category: 'Retirement'
    },
    {
      term: 'Cost of Living Index',
      definition: 'A measurement that compares the cost of goods and services across different geographic areas. Used to compare how expensive it is to live in different locations.',
      example: 'A city with a cost of living index of 120 is 20% more expensive than the national average (index 100).',
      category: 'Retirement'
    }
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