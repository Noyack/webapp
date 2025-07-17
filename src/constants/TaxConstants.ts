
  import { TaxBracket, Mode } from '../types';
  
  // Default user state values
  export const defaultUserState = {
    filingStatus: 'single',
    state: 'CA',
    dependents: 0,
    incomeSources: [
      {
        id: '1',
        type: 'primary',
        amount: 80000,
        description: 'Primary Job',
      },
    ],
    deductions: [],
    useItemizedDeductions: false,
    taxAdvantaged: {
      '401k': { type: '401k', contribution: 6000, maxContribution: 22500 },
      'ira-traditional': { type: 'ira-traditional', contribution: 0, maxContribution: 6500 },
      'ira-roth': { type: 'ira-roth', contribution: 0, maxContribution: 6500 },
      'hsa': { type: 'hsa', contribution: 0, maxContribution: 3850 },
      '529': { type: '529', contribution: 0, maxContribution: 16000 },
      'other': { type: 'other', contribution: 0, maxContribution: 0 },
    },
    monthlyExpenses: 3000,
    emergencyFund: 10000,
    hasInvestments: false,
    stocksValue: 0,
    cryptoValue: 0,
    realEstateValue: 0,
  };
  
  // 2023 Federal Tax Brackets
  export const federalTaxBrackets: Record<string, TaxBracket[]> = {
    'single': [
      { rate: 0.10, min: 0, max: 11000 },
      { rate: 0.12, min: 11000, max: 44725 },
      { rate: 0.22, min: 44725, max: 95375 },
      { rate: 0.24, min: 95375, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578125 },
      { rate: 0.37, min: 578125, max: null },
    ],
    'married-joint': [
      { rate: 0.10, min: 0, max: 22000 },
      { rate: 0.12, min: 22000, max: 89450 },
      { rate: 0.22, min: 89450, max: 190750 },
      { rate: 0.24, min: 190750, max: 364200 },
      { rate: 0.32, min: 364200, max: 462500 },
      { rate: 0.35, min: 462500, max: 693750 },
      { rate: 0.37, min: 693750, max: null },
    ],
    'married-separate': [
      { rate: 0.10, min: 0, max: 11000 },
      { rate: 0.12, min: 11000, max: 44725 },
      { rate: 0.22, min: 44725, max: 95375 },
      { rate: 0.24, min: 95375, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 346875 },
      { rate: 0.37, min: 346875, max: null },
    ],
    'head-of-household': [
      { rate: 0.10, min: 0, max: 15700 },
      { rate: 0.12, min: 15700, max: 59850 },
      { rate: 0.22, min: 59850, max: 95350 },
      { rate: 0.24, min: 95350, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578100 },
      { rate: 0.37, min: 578100, max: null },
    ],
  };
  
  // 2023 Standard Deduction amounts
  export const standardDeduction: Record<string, number> = {
    'single': 13850,
    'married-joint': 27700,
    'married-separate': 13850,
    'head-of-household': 20800,
  };
  
  // Simplified state tax rates (percentage)
  export const stateTaxRates: Record<string, number> = {
    'AL': 5.0,
    'AK': 0.0,
    'AZ': 4.5,
    'AR': 6.0,
    'CA': 9.3,
    'CO': 4.55,
    'CT': 6.99,
    'DE': 6.6,
    'FL': 0.0,
    'GA': 5.75,
    'HI': 11.0,
    'ID': 6.5,
    'IL': 4.95,
    'IN': 3.23,
    'IA': 6.0,
    'KS': 5.7,
    'KY': 5.0,
    'LA': 6.0,
    'ME': 7.15,
    'MD': 5.75,
    'MA': 5.0,
    'MI': 4.25,
    'MN': 9.85,
    'MS': 5.0,
    'MO': 5.4,
    'MT': 6.75,
    'NE': 6.84,
    'NV': 0.0,
    'NH': 5.0,
    'NJ': 10.75,
    'NM': 5.9,
    'NY': 10.9,
    'NC': 5.25,
    'ND': 2.9,
    'OH': 3.99,
    'OK': 5.0,
    'OR': 9.9,
    'PA': 3.07,
    'RI': 5.99,
    'SC': 7.0,
    'SD': 0.0,
    'TN': 0.0,
    'TX': 0.0,
    'UT': 4.95,
    'VT': 8.75,
    'VA': 5.75,
    'WA': 0.0,
    'WV': 6.5,
    'WI': 7.65,
    'WY': 0.0,
    'DC': 8.95,
  };
  
  // Calculator modes
  export const calculatorModes: Mode[] = [
    {
      label: 'Basic',
      value: 'basic',
      description: 'For simple tax situations with a single income source and standard deductions.'
    },
    {
      label: 'Advanced',
      value: 'advanced',
      description: 'For complex tax situations with multiple income sources and deductions.'
    },
    {
      label: 'Investor',
      value: 'investor',
      description: 'Focus on optimizing taxes for investment income including stocks and crypto.'
    },
    {
      label: 'Self-Employed',
      value: 'self-employed',
      description: 'For freelancers and business owners with self-employment income.'
    },
  ];
  
  // Income type options with labels
  export const incomeTypeOptions = [
    { value: 'primary', label: 'Primary Job (W-2)' },
    { value: 'secondary', label: 'Secondary Job (W-2)' },
    { value: 'self-employment', label: 'Self-Employment' },
    { value: 'rental', label: 'Rental Income' },
    { value: 'dividends', label: 'Dividends' },
    { value: 'capital-gains', label: 'Capital Gains' },
    { value: 'interest', label: 'Interest' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'other', label: 'Other Income' },
  ];
  
  // Deduction type options with labels
  export const deductionTypeOptions = [
    { value: 'mortgage-interest', label: 'Mortgage Interest' },
    { value: 'property-tax', label: 'Property Tax' },
    { value: 'charity', label: 'Charitable Donations' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'student-loan', label: 'Student Loan Interest' },
    { value: 'education', label: 'Education Expenses' },
    { value: 'child-care', label: 'Child/Dependent Care' },
    { value: 'other', label: 'Other Deductions' },
  ];