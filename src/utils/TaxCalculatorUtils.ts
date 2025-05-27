import { UserState, TaxResults } from '../types';
import { federalTaxBrackets, stateTaxRates, standardDeduction } from '../constants/TaxConstants';

/**
 * Calculates tax results based on user input data
 */
export const calculateTaxResults = (userData: UserState): TaxResults => {
  // Calculate total income
  const totalIncome = userData.incomeSources.reduce((sum, source) => sum + source.amount, 0);
  
  // Calculate pre-tax contributions
  const pretaxContributions = userData.taxAdvantaged['401k'].contribution +
    userData.taxAdvantaged['ira-traditional'].contribution +
    userData.taxAdvantaged['hsa'].contribution;
  
  // Calculate adjusted gross income
  const adjustedGrossIncome = totalIncome - pretaxContributions;
  
  // Calculate deductions
  let totalDeductions = 0;
  if (userData.useItemizedDeductions) {
    totalDeductions = userData.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  } else {
    totalDeductions = standardDeduction[userData.filingStatus];
  }
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);
  
  // Calculate federal tax
  const { federalTax, taxByBracket } = calculateFederalTax(taxableIncome, userData.filingStatus);
  
  // Calculate state tax (simplified)
  const stateTax = calculateStateTax(taxableIncome, userData.state);
  
  // Calculate FICA taxes
  const ficaTax = calculateFicaTax(userData);
  
  // Calculate self-employment tax
  const selfEmploymentTax = calculateSelfEmploymentTax(userData);
  
  // Calculate total tax
  const totalTax = federalTax + stateTax + ficaTax + selfEmploymentTax;
  
  // Calculate effective tax rate
  const effectiveTaxRate = (totalTax / totalIncome) * 100;
  
  // Calculate after-tax income
  const afterTaxIncome = totalIncome - totalTax;
  
  // Calculate total savings
  const totalSavings = Object.values(userData.taxAdvantaged).reduce(
    (sum, account) => sum + account.contribution, 0
  );
  
  // Calculate savings rate
  const savingsRate = (totalSavings / totalIncome) * 100;
  
  // Calculate unused tax-advantaged space
  const unusedTaxSpace: { [key: string]: number } = {};
  Object.entries(userData.taxAdvantaged).forEach(([key, account]) => {
    if (account.maxContribution > 0) {
      unusedTaxSpace[key] = Math.max(0, account.maxContribution - account.contribution);
    }
  });
  
  // Generate optimization tips
  const optimizationTips = generateOptimizationTips(userData, adjustedGrossIncome, unusedTaxSpace, savingsRate);
  
  // Generate projected savings data
  const projectedSavings = generateProjectedSavings(userData, unusedTaxSpace, totalSavings, totalIncome);
  
  return {
    totalIncome,
    adjustedGrossIncome,
    taxableIncome,
    federalTax,
    stateTax,
    ficaTax,
    selfEmploymentTax,
    totalTax,
    effectiveTaxRate,
    afterTaxIncome,
    savingsRate,
    totalSavings,
    unusedTaxSpace,
    taxByBracket,
    optimizationTips,
    projectedSavings
  };
};

/**
 * Calculates federal tax based on taxable income and filing status
 */
const calculateFederalTax = (taxableIncome: number, filingStatus: string): { federalTax: number; taxByBracket: { bracket: string; amount: number }[] } => {
  const brackets = federalTaxBrackets[filingStatus];
  let federalTax = 0;
  const taxByBracket: { bracket: string; amount: number }[] = [];
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const min = bracket.min;
    const max = bracket.max === null ? Infinity : bracket.max;
    const rate = bracket.rate;
    
    if (taxableIncome > min) {
      const taxableAmountInBracket = Math.min(taxableIncome, max) - min;
      const taxInBracket = taxableAmountInBracket * rate;
      federalTax += taxInBracket;
      
      taxByBracket.push({
        bracket: `${(rate * 100).toFixed(0)}%`,
        amount: taxInBracket
      });
    }
  }
  
  return { federalTax, taxByBracket };
};

/**
 * Calculates state tax based on taxable income and state
 */
const calculateStateTax = (taxableIncome: number, state: string): number => {
  const stateRate = stateTaxRates[state] / 100;
  return taxableIncome * stateRate;
};

/**
 * Calculates FICA taxes (Social Security and Medicare)
 */
const calculateFicaTax = (userData: UserState): number => {
  const socialSecurityWageBase = 160200; // 2023 limit
  const socialSecurityTax = Math.min(
    userData.incomeSources
      .filter(source => source.type === 'primary' || source.type === 'secondary')
      .reduce((sum, source) => sum + source.amount, 0),
    socialSecurityWageBase
  ) * 0.062;
  
  const medicareTax = userData.incomeSources
    .filter(source => source.type === 'primary' || source.type === 'secondary')
    .reduce((sum, source) => sum + source.amount, 0) * 0.0145;
  
  return socialSecurityTax + medicareTax;
};

/**
 * Calculates self-employment tax
 */
const calculateSelfEmploymentTax = (userData: UserState): number => {
  const selfEmploymentIncome = userData.incomeSources
    .filter(source => source.type === 'self-employment')
    .reduce((sum, source) => sum + source.amount, 0);
  
  return selfEmploymentIncome * 0.153 * 0.9235; // Adjusted for deductible portion
};

/**
 * Generates optimization tips based on user data
 */
const generateOptimizationTips = (
  userData: UserState, 
  adjustedGrossIncome: number, 
  unusedTaxSpace: { [key: string]: number }, 
  savingsRate: number
): string[] => {
  const tips: string[] = [];
  
  if (unusedTaxSpace['401k'] > 0) {
    tips.push(`Increase your 401(k) contribution by up to ${unusedTaxSpace['401k'].toLocaleString()} to reduce taxable income.`);
  }
  
  if (unusedTaxSpace['ira-traditional'] > 0 && adjustedGrossIncome < 78000) {
    tips.push(`Consider contributing up to ${unusedTaxSpace['ira-traditional'].toLocaleString()} to a Traditional IRA for additional tax deductions.`);
  }
  
  if (unusedTaxSpace['hsa'] > 0) {
    tips.push(`Maximize your HSA contribution with an additional ${unusedTaxSpace['hsa'].toLocaleString()} for triple tax benefits.`);
  }
  
  if (savingsRate < 15) {
    tips.push(`Your current savings rate (${savingsRate.toFixed(1)}%) is below the recommended 15-20%. Consider increasing your savings.`);
  }

  // Add specific tip for self-employed users
  if (userData.incomeSources.some(source => source.type === 'self-employment')) {
    tips.push('As a self-employed individual, consider setting up a SEP IRA or Solo 401(k) to increase your retirement contribution limits.');
  }
  
  return tips;
};

/**
 * Generates projected savings data
 */
const generateProjectedSavings = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  userData: UserState,
  unusedTaxSpace: { [key: string]: number },
  totalSavings: number,
  totalIncome: number
): { year: number; currentStrategy: number; optimizedStrategy: number }[] => {
  const projectedSavings = [];
  const years = 30;
  const annualReturn = 0.07; // 7% annual return
  const optimizedContributions = totalSavings + Math.min(unusedTaxSpace['401k'], totalIncome * 0.1); // Increase by 10% of income or max available
  
  let currentValue = totalSavings * 12; // Annualized current savings
  let optimizedValue = optimizedContributions * 12; // Annualized optimized savings
  
  for (let year = 1; year <= years; year++) {
    currentValue = currentValue * (1 + annualReturn) + totalSavings * 12;
    optimizedValue = optimizedValue * (1 + annualReturn) + optimizedContributions * 12;
    
    projectedSavings.push({
      year,
      currentStrategy: Math.round(currentValue),
      optimizedStrategy: Math.round(optimizedValue)
    });
  }
  
  return projectedSavings;
};