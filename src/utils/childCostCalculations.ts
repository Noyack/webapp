import { 
  ChildCostInputs, 
  YearlyCostData, 
  LifetimeSummary, 
  CollegeFundProjection,
  ChildData,
  AGE_STAGES 
} from '../types/childCost';

// USDA base annual cost for a child (middle-income, two-parent family)
// Updated with 2024 data - Brookings Institution estimates $310,605 total cost through age 17
// This translates to approximately $17,256 annual average (310,605 / 18 years)
// LendingTree 2023 data shows $21,681 annual average
const USDA_BASE_COST = 21681; // Updated to reflect 2024 inflation-adjusted costs

// Historical reference for transparency
const USDA_BASE_COST_2015 = 12980; // Previous USDA estimate (outdated)
const INFLATION_ADJUSTMENT_2015_TO_2024 = 1.67; // ~67% inflation since 2015

// Age-based cost multipliers based on USDA data and 2024 research
// Updated to reflect more realistic spending patterns
const AGE_MULTIPLIERS = {
  '0-2': 1.2,   // Higher due to initial setup costs, diapers, formula, childcare
  '3-5': 1.1,   // Preschool costs, but lower basic needs
  '6-8': 1.0,   // Base cost for elementary school age
  '9-11': 1.15, // Pre-teen increase in activities and food
  '12-14': 1.35, // Middle school - higher food, activities, technology needs
  '15-17': 1.55, // High school - peak costs (car insurance, activities, college prep)
  '18+': 0.6    // Reduced if living at home during college
};

// Category-specific age adjustments
const CATEGORY_AGE_ADJUSTMENTS = {
  food: {
    '0-2': 0.6, '3-5': 0.8, '6-8': 1.0, '9-11': 1.2, 
    '12-14': 1.4, '15-17': 1.6, '18+': 1.8
  },
  childcare: {
    '0-2': 2.5, '3-5': 2.0, '6-8': 0.3, '9-11': 0.2, 
    '12-14': 0.1, '15-17': 0.05, '18+': 0
  },
  transportation: {
    '0-2': 0.8, '3-5': 0.9, '6-8': 1.0, '9-11': 1.1, 
    '12-14': 1.3, '15-17': 1.8, '18+': 2.0
  },
  healthcare: {
    '0-2': 1.5, '3-5': 1.2, '6-8': 1.0, '9-11': 1.1, 
    '12-14': 1.2, '15-17': 1.3, '18+': 1.4
  },
  clothing: {
    '0-2': 0.8, '3-5': 1.0, '6-8': 1.2, '9-11': 1.4, 
    '12-14': 1.6, '15-17': 1.8, '18+': 1.5
  },
  personal: {
    '0-2': 0.3, '3-5': 0.5, '6-8': 0.8, '9-11': 1.2, 
    '12-14': 1.6, '15-17': 2.0, '18+': 1.8
  }
};

// Advanced financial calculations

// Family size adjustment multipliers (economies of scale)
const FAMILY_SIZE_MULTIPLIERS = {
  1: 1.0,    // Single child
  2: 0.85,   // Second child costs 15% less per child
  3: 0.75,   // Third child costs 25% less per child
  4: 0.70,   // Fourth+ child costs 30% less per child
};

// Income-based adjustment factors (based on USDA income brackets)
const INCOME_ADJUSTMENTS = {
  low: 0.75,     // Under $59,200 (2024 poverty guidelines + margin)
  middle: 1.0,   // $59,200 - $107,400 (middle class range)
  high: 1.35     // Over $107,400 (upper middle class adjustments)
};

// Regional cost variation beyond basic cost of living
const REGIONAL_FACTORS = {
  rural: 0.85,      // Rural areas typically 15% lower costs
  suburban: 1.0,    // Suburban baseline
  urban: 1.15,      // Urban areas 15% higher
  metropolitan: 1.25 // Major metros 25% higher
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getAgeGroup = (age: number): string => {
  if (age <= 2) return '0-2';
  if (age <= 5) return '3-5';
  if (age <= 8) return '6-8';
  if (age <= 11) return '9-11';
  if (age <= 14) return '12-14';
  if (age <= 17) return '15-17';
  return '18+';
};

export const getStageForAge = (age: number): string => {
  const stage = AGE_STAGES.find(s => age >= s.startAge && age <= s.endAge);
  return stage ? stage.name : 'Adult';
};

export const calculateEducationCosts = (
  child: ChildData, 
  inputs: ChildCostInputs, 
  childAge: number
): number => {
  let educationCost = 0;
  
  // K-12 Education (ages 5-18)
  if (childAge >= 5 && childAge <= 18) {
    if (child.education.k12Type === 'private') {
      educationCost += inputs.educationCosts.privateK12.annual;
    } else {
      educationCost += inputs.educationCosts.publicK12.annual;
    }
  }
  
  // College (typically ages 18-22, but flexible based on collegeYears)
  if (child.education.collegeType !== 'none' && 
      childAge >= 18 && 
      childAge < (18 + child.education.collegeYears)) {
    if (child.education.collegeType === 'private') {
      educationCost += inputs.educationCosts.privateCollege.annual;
    } else {
      educationCost += inputs.educationCosts.publicCollege.annual;
    }
  }
  
  // Graduate School
  if (child.education.gradSchool && 
      childAge >= (18 + child.education.collegeYears) && 
      childAge < (18 + child.education.collegeYears + child.education.gradYears)) {
    educationCost += inputs.educationCosts.gradSchool.annual;
  }
  
  return educationCost;
};

export const calculateYearlyCosts = (
  child: ChildData,
  inputs: ChildCostInputs,
  childAge: number,
  year: number
): YearlyCostData => {
  const ageGroup = getAgeGroup(childAge);
  const stage = getStageForAge(childAge);
  const yearsFromNow = year - new Date().getFullYear();
  const inflationMultiplier = Math.pow(1 + inputs.household.inflationRate / 100, yearsFromNow);
  
  // Enhanced cost calculation with new factors
  const incomeLevel = getIncomeLevel(inputs.household.income);
  const familySizeMultiplier = getFamilySizeMultiplier(inputs.children.length + inputs.household.additionalChildren);
  const regionalAdjustment = calculateRegionalAdjustment(inputs.location.costOfLivingIndex);
  
  // Base cost adjusted for multiple factors
  const baseCost = USDA_BASE_COST * 
    regionalAdjustment * 
    AGE_MULTIPLIERS[ageGroup as keyof typeof AGE_MULTIPLIERS] *
    INCOME_ADJUSTMENTS[incomeLevel] *
    familySizeMultiplier;
  
  // Calculate individual category costs
  const costs: Record<string, number> = {};
  
  inputs.expenseCategories.forEach(category => {
    const categoryBase = baseCost * (category.basePercent / 100);
    const ageAdjustment = CATEGORY_AGE_ADJUSTMENTS[category.id as keyof typeof CATEGORY_AGE_ADJUSTMENTS]?.[ageGroup as keyof typeof CATEGORY_AGE_ADJUSTMENTS.food] || 1;
    
    let categoryCost = categoryBase * ageAdjustment;
    
    if (category.applyInflation) {
      categoryCost *= inflationMultiplier;
    }
    
    if (category.customBaseAmount) {
      categoryCost = category.customBaseAmount * ageAdjustment * familySizeMultiplier;
      if (category.applyInflation) {
        categoryCost *= inflationMultiplier;
      }
    }
    
    costs[category.id] = categoryCost;
  });
  
  // Housing cost (typically 29% of total child costs) with enhanced calculation
  const housingBasePercent = incomeLevel === 'high' ? 0.32 : incomeLevel === 'low' ? 0.26 : 0.29;
  const housing = baseCost * housingBasePercent * inflationMultiplier;
  
  // Calculate education costs
  const education = calculateEducationCosts(child, inputs, childAge);
  
  // Add additional costs with regional and family size adjustments
  const additionalCosts = (
    child.additionalCosts.extracurriculars +
    child.additionalCosts.travel +
    (child.additionalCosts.healthConditions ? 2500 : 0) // Increased from $2000
  ) * inflationMultiplier * regionalAdjustment;
  
  const totalCost = 
    housing +
    Object.values(costs).reduce((sum, cost) => sum + cost, 0) +
    education +
    additionalCosts;
  
  return {
    year,
    childAge,
    totalCost,
    housing,
    food: costs.food || 0,
    childcare: costs.childcare || 0,
    transportation: costs.transportation || 0,
    healthcare: costs.healthcare || 0,
    clothing: costs.clothing || 0,
    personal: costs.personal || 0,
    education: education + additionalCosts,
    stage
  };
};

export const calculateLifetimeCosts = (
  child: ChildData,
  inputs: ChildCostInputs
): { results: YearlyCostData[], summary: LifetimeSummary } => {
  const results: YearlyCostData[] = [];
  const currentYear = new Date().getFullYear();
  
  // Determine starting age and year based on calculation type
  let startAge: number;
  let startYear: number;
  
  if (inputs.calculationType === 'future') {
    startAge = 0;
    startYear = child.birthYear || inputs.birthYear;
  } else {
    startAge = child.currentAge;
    startYear = currentYear;
  }
  
  // Calculate maximum age to project (up to end of graduate school or 25, whichever is higher)
  const maxAge = Math.max(
    25, 
    18 + child.education.collegeYears + (child.education.gradSchool ? child.education.gradYears : 0)
  );
  
  // Generate yearly projections
  for (let age = startAge; age <= maxAge; age++) {
    const year = startYear + (age - startAge);
    const yearlyData = calculateYearlyCosts(child, inputs, age, year);
    results.push(yearlyData);
  }
  
  // Calculate summary statistics
  const summary: LifetimeSummary = {
    totalCost: results.reduce((sum, year) => sum + year.totalCost, 0),
    byCategory: {
      housing: results.reduce((sum, year) => sum + year.housing, 0),
      food: results.reduce((sum, year) => sum + year.food, 0),
      childcare: results.reduce((sum, year) => sum + year.childcare, 0),
      transportation: results.reduce((sum, year) => sum + year.transportation, 0),
      healthcare: results.reduce((sum, year) => sum + year.healthcare, 0),
      clothing: results.reduce((sum, year) => sum + year.clothing, 0),
      personal: results.reduce((sum, year) => sum + year.personal, 0),
      education: results.reduce((sum, year) => sum + year.education, 0)
    },
    byStage: {},
    collegeCost: results
      .filter(year => year.childAge >= 18 && year.childAge < 18 + child.education.collegeYears)
      .reduce((sum, year) => sum + year.totalCost, 0),
    gradSchoolCost: child.education.gradSchool ? 
      results
        .filter(year => year.childAge >= 18 + child.education.collegeYears)
        .reduce((sum, year) => sum + year.totalCost, 0) : 0
  };
  
  // Calculate costs by stage
  AGE_STAGES.forEach(stage => {
    summary.byStage[stage.name] = results
      .filter(year => year.stage === stage.name)
      .reduce((sum, year) => sum + year.totalCost, 0);
  });
  
  return { results, summary };
};

export const calculateCollegeFundProjection = (
  child: ChildData,
  inputs: ChildCostInputs,
  currentSavings: number = 0
): CollegeFundProjection => {
  // Calculate total college cost
  const collegeStartAge = 18;
  const yearsUntilCollege = Math.max(0, collegeStartAge - child.currentAge);
  const inflationRate = inputs.household.inflationRate / 100;
  const investmentReturn = inputs.household.investmentReturn / 100;
  
  let totalCollegeCost = 0;
  
  // Calculate future cost of college education
  for (let year = 0; year < child.education.collegeYears; year++) {
    const yearFromNow = yearsUntilCollege + year;
    const inflationMultiplier = Math.pow(1 + inflationRate, yearFromNow);
    
    let annualCost = 0;
    if (child.education.collegeType === 'private') {
      annualCost = inputs.educationCosts.privateCollege.annual;
    } else if (child.education.collegeType === 'public') {
      annualCost = inputs.educationCosts.publicCollege.annual;
    }
    
    totalCollegeCost += annualCost * inflationMultiplier;
  }
  
  // Add graduate school costs if applicable
  if (child.education.gradSchool) {
    for (let year = 0; year < child.education.gradYears; year++) {
      const yearFromNow = yearsUntilCollege + child.education.collegeYears + year;
      const inflationMultiplier = Math.pow(1 + inflationRate, yearFromNow);
      totalCollegeCost += inputs.educationCosts.gradSchool.annual * inflationMultiplier;
    }
  }
  
  // Calculate current savings growth
  const projectedBalance = currentSavings * Math.pow(1 + investmentReturn, yearsUntilCollege);
  
  // Calculate required monthly savings to reach goal
  const remainingCost = Math.max(0, totalCollegeCost - projectedBalance);
  const monthsUntilCollege = yearsUntilCollege * 12;
  
  let monthlyRequired = 0;
  if (monthsUntilCollege > 0) {
    // Future value of annuity formula
    const monthlyReturn = investmentReturn / 12;
    if (monthlyReturn > 0) {
      monthlyRequired = remainingCost / (((Math.pow(1 + monthlyReturn, monthsUntilCollege) - 1) / monthlyReturn));
    } else {
      monthlyRequired = remainingCost / monthsUntilCollege;
    }
  }
  
  return {
    totalCost: totalCollegeCost,
    monthlyRequired: Math.max(0, monthlyRequired),
    currentSavings,
    projectedBalance,
    shortfall: Math.max(0, totalCollegeCost - projectedBalance)
  };
};

export const generateUniqueChildId = (): string => {
  return `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateChildData = (child: ChildData): string[] => {
  const errors: string[] = [];
  
  if (!child.name.trim()) {
    errors.push('Child name is required');
  }
  
  if (child.currentAge < 0 || child.currentAge > 30) {
    errors.push('Child age must be between 0 and 30');
  }
  
  if (child.education.collegeYears < 0 || child.education.collegeYears > 8) {
    errors.push('College years must be between 0 and 8');
  }
  
  if (child.education.gradYears < 0 || child.education.gradYears > 6) {
    errors.push('Graduate school years must be between 0 and 6');
  }
  
  if (child.additionalCosts.extracurriculars < 0) {
    errors.push('Extracurricular costs cannot be negative');
  }
  
  if (child.additionalCosts.travel < 0) {
    errors.push('Travel costs cannot be negative');
  }
  
  return errors;
};

export const validateInputs = (inputs: ChildCostInputs): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (inputs.household.income <= 0) {
    errors.push('Household income must be greater than 0');
  }
  
  if (inputs.household.inflationRate < 0 || inputs.household.inflationRate > 10) {
    errors.push('Inflation rate must be between 0% and 10%');
  }
  
  if (inputs.household.investmentReturn < 0 || inputs.household.investmentReturn > 15) {
    errors.push('Investment return must be between 0% and 15%');
  }
  
  if (inputs.children.length === 0) {
    errors.push('At least one child is required');
  }
  
  // Validate each child
  inputs.children.forEach((child, index) => {
    const childErrors = validateChildData(child);
    childErrors.forEach(error => {
      errors.push(`Child ${index + 1}: ${error}`);
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getIncomeLevel = (income: number): 'low' | 'middle' | 'high' => {
  if (income < 59200) return 'low';
  if (income <= 107400) return 'middle';
  return 'high';
};

export const getFamilySizeMultiplier = (totalChildren: number): number => {
  if (totalChildren <= 1) return FAMILY_SIZE_MULTIPLIERS[1];
  if (totalChildren === 2) return FAMILY_SIZE_MULTIPLIERS[2];
  if (totalChildren === 3) return FAMILY_SIZE_MULTIPLIERS[3];
  return FAMILY_SIZE_MULTIPLIERS[4];
};

export const calculateRegionalAdjustment = (costOfLivingIndex: number): number => {
  // Enhanced regional calculation combining cost of living with area type
  const baseAdjustment = costOfLivingIndex / 100;
  
  // Additional adjustment based on cost level
  let regionType: keyof typeof REGIONAL_FACTORS = 'suburban';
  if (costOfLivingIndex < 90) regionType = 'rural';
  else if (costOfLivingIndex > 120) regionType = 'metropolitan';
  else if (costOfLivingIndex > 105) regionType = 'urban';
  
  return baseAdjustment * REGIONAL_FACTORS[regionType];
};

// Monte Carlo simulation for uncertainty analysis
export interface CostProjectionRange {
  low: number;
  median: number;
  high: number;
  confidenceInterval: { min: number; max: number };
}

export const runMonteCarloSimulation = (
  child: ChildData,
  inputs: ChildCostInputs,
  iterations: number = 1000
): CostProjectionRange => {
  const results: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Simulate variations in key parameters
    const simulatedInputs = { ...inputs };
    
    // Inflation rate variation (±1%)
    simulatedInputs.household.inflationRate += (Math.random() - 0.5) * 2;
    
    // Cost of living variation (±10%)
    simulatedInputs.location.costOfLivingIndex *= (1 + (Math.random() - 0.5) * 0.2);
    
    // Income variation (±20%)
    simulatedInputs.household.income *= (1 + (Math.random() - 0.5) * 0.4);
    
    // Education cost variation (±15%)
    simulatedInputs.educationCosts.publicCollege.annual *= (1 + (Math.random() - 0.5) * 0.3);
    simulatedInputs.educationCosts.privateCollege.annual *= (1 + (Math.random() - 0.5) * 0.3);
    
    const { summary } = calculateLifetimeCosts(child, simulatedInputs);
    results.push(summary.totalCost);
  }
  
  results.sort((a, b) => a - b);
  
  const percentile = (p: number) => results[Math.floor(results.length * p / 100)];
  
  return {
    low: percentile(10),
    median: percentile(50),
    high: percentile(90),
    confidenceInterval: {
      min: percentile(5),
      max: percentile(95)
    }
  };
};

// Economic scenario modeling
export interface EconomicScenario {
  name: string;
  inflationRate: number;
  educationInflation: number;
  healthcareInflation: number;
  incomeGrowth: number;
}

export const ECONOMIC_SCENARIOS: EconomicScenario[] = [
  {
    name: 'Optimistic',
    inflationRate: 2.0,
    educationInflation: 3.0,
    healthcareInflation: 4.0,
    incomeGrowth: 3.5
  },
  {
    name: 'Conservative',
    inflationRate: 2.5,
    educationInflation: 5.0,
    healthcareInflation: 6.0,
    incomeGrowth: 2.0
  },
  {
    name: 'Pessimistic',
    inflationRate: 4.0,
    educationInflation: 7.0,
    healthcareInflation: 8.0,
    incomeGrowth: 1.0
  }
];

export const calculateScenarioProjections = (
  child: ChildData,
  inputs: ChildCostInputs
): Record<string, LifetimeSummary> => {
  const scenarios: Record<string, LifetimeSummary> = {};
  
  ECONOMIC_SCENARIOS.forEach(scenario => {
    const scenarioInputs = { ...inputs };
    scenarioInputs.household.inflationRate = scenario.inflationRate;
    
    // Apply different inflation rates to different categories
    scenarioInputs.expenseCategories = scenarioInputs.expenseCategories.map(category => {
      const adjustedCategory = { ...category };
      if (category.id === 'healthcare') {
        // Apply healthcare-specific inflation
        adjustedCategory.basePercent *= (1 + (scenario.healthcareInflation - scenario.inflationRate) / 100);
      }
      return adjustedCategory;
    });
    
    // Apply education inflation
    scenarioInputs.educationCosts.publicCollege.annual *= (1 + (scenario.educationInflation - scenario.inflationRate) / 100);
    scenarioInputs.educationCosts.privateCollege.annual *= (1 + (scenario.educationInflation - scenario.inflationRate) / 100);
    
    const { summary } = calculateLifetimeCosts(child, scenarioInputs);
    scenarios[scenario.name] = summary;
  });
  
  return scenarios;
}; 