import {
  RealHourlyWageInputs,
  RealWageCalculation,
  ExpenseBreakdown,
  TimeBreakdown,
  WageComparison,
  JobExpenses,
  WorkSchedule,
  TaxInformation
} from '../types/realHourlyWage';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatHours = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)} hrs`;
};

export const calculateGrossHourlyWage = (
  salary: number,
  schedule: WorkSchedule
): number => {
  const totalHoursWorked = (schedule.hoursPerWeek * schedule.weeksPerYear) + 
                          (schedule.overtimeHours * schedule.weeksPerYear);
  return salary / totalHoursWorked;
};

export const calculateTotalTaxes = (
  grossIncome: number,
  taxes: TaxInformation
): number => {
  const federalTax = grossIncome * (taxes.federalTaxRate / 100);
  const stateTax = grossIncome * (taxes.stateTaxRate / 100);
  const socialSecurity = Math.min(grossIncome * (taxes.socialSecurityRate / 100), 9932.40); // 2024 cap
  const medicare = grossIncome * (taxes.medicareRate / 100);
  const stateDisability = grossIncome * (taxes.stateDisabilityRate / 100);
  const unemployment = grossIncome * (taxes.unemploymentRate / 100);

  return federalTax + stateTax + socialSecurity + medicare + stateDisability + unemployment;
};

export const calculateJobExpenses = (
  expenses: JobExpenses,
  schedule: WorkSchedule
): number => {
  const workDaysPerYear = (schedule.hoursPerWeek / 8) * schedule.weeksPerYear;
  
  // Commuting costs
  const dailyCommutingCosts = expenses.commuting.dailyTransportCost + 
                             expenses.commuting.vehicleWearAndTear;
  const annualCommutingCosts = dailyCommutingCosts * workDaysPerYear + 
                              expenses.commuting.parkingCosts * workDaysPerYear +
                              expenses.commuting.monthlyTransportPass * 12;

  // Work-related costs
  const annualMealCosts = expenses.workRelated.dailyMeals * workDaysPerYear;
  const annualWorkCosts = expenses.workRelated.annualClothing +
                         expenses.workRelated.equipment +
                         expenses.workRelated.training +
                         expenses.workRelated.childcare * 12 +
                         expenses.workRelated.professionalDues +
                         annualMealCosts;

  return annualCommutingCosts + annualWorkCosts;
};

export const calculateTotalTimeCommitment = (
  expenses: JobExpenses,
  schedule: WorkSchedule
): number => {
  const workDaysPerYear = (schedule.hoursPerWeek / 8) * schedule.weeksPerYear;
  
  // Work hours (including overtime)
  const workHours = (schedule.hoursPerWeek * schedule.weeksPerYear) + 
                   (schedule.overtimeHours * schedule.weeksPerYear);
  
  // Unpaid breaks
  const unpaidBreakHours = (schedule.unpaidBreaks / 60) * workDaysPerYear;
  
  // Commuting time
  const commutingHours = (expenses.commuting.dailyCommutingTime / 60) * workDaysPerYear;
  
  // Preparation time
  const dailyPrepHours = (expenses.preparation.dailyPrepTime / 60) * workDaysPerYear;
  const weeklyPrepHours = expenses.preparation.weeklyPrepTime * schedule.weeksPerYear;

  return workHours + unpaidBreakHours + commutingHours + dailyPrepHours + weeklyPrepHours;
};

export const calculateRealHourlyWage = (inputs: RealHourlyWageInputs): RealWageCalculation => {
  const grossAnnualSalary = inputs.salary.salaryType === 'salary' 
    ? inputs.salary.annualSalary
    : (inputs.salary.hourlyRate || 0) * inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear;

  const grossHourlyWage = calculateGrossHourlyWage(grossAnnualSalary, inputs.schedule);
  
  const totalTaxes = calculateTotalTaxes(grossAnnualSalary, inputs.taxes);
  const netAnnualIncome = grossAnnualSalary - totalTaxes;
  const netHourlyWage = netAnnualIncome / (inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear);
  
  const totalAnnualExpenses = calculateJobExpenses(inputs.expenses, inputs.schedule);
  const totalTimeCommitment = calculateTotalTimeCommitment(inputs.expenses, inputs.schedule);
  
  const realHourlyWage = (netAnnualIncome - totalAnnualExpenses) / totalTimeCommitment;
  const effectiveHourlyRate = netAnnualIncome / totalTimeCommitment;
  
  const expenseImpact = totalAnnualExpenses / (inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear);
  const timeImpact = (totalTimeCommitment - (inputs.schedule.hoursPerWeek * inputs.schedule.weeksPerYear)) / totalTimeCommitment * 100;

  return {
    grossAnnualSalary,
    grossHourlyWage,
    netAnnualIncome,
    netHourlyWage,
    totalAnnualExpenses,
    totalTimeCommitment,
    realHourlyWage,
    effectiveHourlyRate,
    expenseImpact,
    timeImpact
  };
};

export const calculateExpenseBreakdown = (
  expenses: JobExpenses,
  schedule: WorkSchedule
): ExpenseBreakdown[] => {
  const workDaysPerYear = (schedule.hoursPerWeek / 8) * schedule.weeksPerYear;
  const totalHours = schedule.hoursPerWeek * schedule.weeksPerYear;
  
  const breakdown: ExpenseBreakdown[] = [];
  
  // Commuting expenses
  const dailyTransport = expenses.commuting.dailyTransportCost * workDaysPerYear;
  const vehicleWear = expenses.commuting.vehicleWearAndTear * workDaysPerYear;
  const parking = expenses.commuting.parkingCosts * workDaysPerYear;
  const transitPass = expenses.commuting.monthlyTransportPass * 12;
  
  breakdown.push(
    {
      category: 'Commuting',
      subcategory: 'Daily Transport',
      annualCost: dailyTransport,
      dailyCost: expenses.commuting.dailyTransportCost,
      hourlyImpact: dailyTransport / totalHours,
      percentage: 0 // Will calculate after getting total
    },
    {
      category: 'Commuting',
      subcategory: 'Vehicle Wear & Tear',
      annualCost: vehicleWear,
      dailyCost: expenses.commuting.vehicleWearAndTear,
      hourlyImpact: vehicleWear / totalHours,
      percentage: 0
    }
  );

  if (parking > 0) {
    breakdown.push({
      category: 'Commuting',
      subcategory: 'Parking',
      annualCost: parking,
      dailyCost: expenses.commuting.parkingCosts,
      hourlyImpact: parking / totalHours,
      percentage: 0
    });
  }

  if (transitPass > 0) {
    breakdown.push({
      category: 'Commuting',
      subcategory: 'Transit Pass',
      annualCost: transitPass,
      dailyCost: transitPass / workDaysPerYear,
      hourlyImpact: transitPass / totalHours,
      percentage: 0
    });
  }

  // Work-related expenses
  const dailyMeals = expenses.workRelated.dailyMeals * workDaysPerYear;
  const childcare = expenses.workRelated.childcare * 12;
  
  breakdown.push(
    {
      category: 'Work-Related',
      subcategory: 'Clothing',
      annualCost: expenses.workRelated.annualClothing,
      dailyCost: expenses.workRelated.annualClothing / workDaysPerYear,
      hourlyImpact: expenses.workRelated.annualClothing / totalHours,
      percentage: 0
    },
    {
      category: 'Work-Related',
      subcategory: 'Meals',
      annualCost: dailyMeals,
      dailyCost: expenses.workRelated.dailyMeals,
      hourlyImpact: dailyMeals / totalHours,
      percentage: 0
    },
    {
      category: 'Work-Related',
      subcategory: 'Equipment',
      annualCost: expenses.workRelated.equipment,
      dailyCost: expenses.workRelated.equipment / workDaysPerYear,
      hourlyImpact: expenses.workRelated.equipment / totalHours,
      percentage: 0
    },
    {
      category: 'Work-Related',
      subcategory: 'Training',
      annualCost: expenses.workRelated.training,
      dailyCost: expenses.workRelated.training / workDaysPerYear,
      hourlyImpact: expenses.workRelated.training / totalHours,
      percentage: 0
    },
    {
      category: 'Work-Related',
      subcategory: 'Professional Dues',
      annualCost: expenses.workRelated.professionalDues,
      dailyCost: expenses.workRelated.professionalDues / workDaysPerYear,
      hourlyImpact: expenses.workRelated.professionalDues / totalHours,
      percentage: 0
    }
  );

  if (childcare > 0) {
    breakdown.push({
      category: 'Work-Related',
      subcategory: 'Childcare',
      annualCost: childcare,
      dailyCost: expenses.workRelated.childcare,
      hourlyImpact: childcare / totalHours,
      percentage: 0
    });
  }

  // Calculate percentages
  const totalExpenses = breakdown.reduce((sum, item) => sum + item.annualCost, 0);
  breakdown.forEach(item => {
    item.percentage = (item.annualCost / totalExpenses) * 100;
  });

  return breakdown.sort((a, b) => b.annualCost - a.annualCost);
};

export const calculateTimeBreakdown = (
  expenses: JobExpenses,
  schedule: WorkSchedule
): TimeBreakdown[] => {
  const workDaysPerYear = (schedule.hoursPerWeek / 8) * schedule.weeksPerYear;
  
  const breakdown: TimeBreakdown[] = [
    {
      category: 'Paid Work Hours',
      hoursPerWeek: schedule.hoursPerWeek,
      hoursPerYear: schedule.hoursPerWeek * schedule.weeksPerYear,
      percentage: 0
    },
    {
      category: 'Overtime Hours',
      hoursPerWeek: schedule.overtimeHours,
      hoursPerYear: schedule.overtimeHours * schedule.weeksPerYear,
      percentage: 0
    },
    {
      category: 'Unpaid Breaks',
      hoursPerWeek: (schedule.unpaidBreaks / 60) * (schedule.hoursPerWeek / 8),
      hoursPerYear: (schedule.unpaidBreaks / 60) * workDaysPerYear,
      percentage: 0
    },
    {
      category: 'Commuting',
      hoursPerWeek: (expenses.commuting.dailyCommutingTime / 60) * (schedule.hoursPerWeek / 8),
      hoursPerYear: (expenses.commuting.dailyCommutingTime / 60) * workDaysPerYear,
      percentage: 0
    },
    {
      category: 'Daily Preparation',
      hoursPerWeek: (expenses.preparation.dailyPrepTime / 60) * (schedule.hoursPerWeek / 8),
      hoursPerYear: (expenses.preparation.dailyPrepTime / 60) * workDaysPerYear,
      percentage: 0
    },
    {
      category: 'Weekly Preparation',
      hoursPerWeek: expenses.preparation.weeklyPrepTime,
      hoursPerYear: expenses.preparation.weeklyPrepTime * schedule.weeksPerYear,
      percentage: 0
    }
  ];

  const totalHours = breakdown.reduce((sum, item) => sum + item.hoursPerYear, 0);
  breakdown.forEach(item => {
    item.percentage = (item.hoursPerYear / totalHours) * 100;
  });

  return breakdown.filter(item => item.hoursPerYear > 0)
                  .sort((a, b) => b.hoursPerYear - a.hoursPerYear);
};

export const generateWageComparisons = (
  baseInputs: RealHourlyWageInputs
): WageComparison[] => {
  const baseCalculation = calculateRealHourlyWage(baseInputs);
  
  const scenarios: WageComparison[] = [
    {
      scenario: 'Current Situation',
      realHourlyWage: baseCalculation.realHourlyWage,
      netAnnualIncome: baseCalculation.netAnnualIncome,
      timeCommitment: baseCalculation.totalTimeCommitment,
      workLifeBalance: calculateWorkLifeBalance(baseInputs)
    }
  ];

  // Scenario: Remote Work (no commute)
  const remoteInputs = { ...baseInputs };
  remoteInputs.expenses.commuting.dailyTransportCost = 0;
  remoteInputs.expenses.commuting.dailyCommutingTime = 0;
  remoteInputs.expenses.commuting.vehicleWearAndTear = 0;
  remoteInputs.expenses.commuting.parkingCosts = 0;
  remoteInputs.expenses.workRelated.dailyMeals = 5; // Reduced meal costs
  const remoteCalculation = calculateRealHourlyWage(remoteInputs);
  
  scenarios.push({
    scenario: 'Remote Work',
    realHourlyWage: remoteCalculation.realHourlyWage,
    netAnnualIncome: remoteCalculation.netAnnualIncome,
    timeCommitment: remoteCalculation.totalTimeCommitment,
    workLifeBalance: calculateWorkLifeBalance(remoteInputs)
  });

  // Scenario: Closer to Work (halved commute)
  const closerInputs = { ...baseInputs };
  closerInputs.expenses.commuting.dailyTransportCost *= 0.5;
  closerInputs.expenses.commuting.dailyCommutingTime *= 0.5;
  closerInputs.expenses.commuting.vehicleWearAndTear *= 0.5;
  const closerCalculation = calculateRealHourlyWage(closerInputs);
  
  scenarios.push({
    scenario: 'Closer to Work',
    realHourlyWage: closerCalculation.realHourlyWage,
    netAnnualIncome: closerCalculation.netAnnualIncome,
    timeCommitment: closerCalculation.totalTimeCommitment,
    workLifeBalance: calculateWorkLifeBalance(closerInputs)
  });

  // Scenario: Higher Salary (+20%)
  const higherSalaryInputs = { ...baseInputs };
  higherSalaryInputs.salary.annualSalary *= 1.2;
  const higherSalaryCalculation = calculateRealHourlyWage(higherSalaryInputs);
  
  scenarios.push({
    scenario: 'Higher Salary (+20%)',
    realHourlyWage: higherSalaryCalculation.realHourlyWage,
    netAnnualIncome: higherSalaryCalculation.netAnnualIncome,
    timeCommitment: higherSalaryCalculation.totalTimeCommitment,
    workLifeBalance: calculateWorkLifeBalance(higherSalaryInputs)
  });

  return scenarios;
};

export const calculateWorkLifeBalance = (inputs: RealHourlyWageInputs): number => {
  const totalTimeCommitment = calculateTotalTimeCommitment(inputs.expenses, inputs.schedule);
  const availableHours = (365 * 24) - (8 * 365); // Assuming 8 hours sleep
  const workTimePercentage = (totalTimeCommitment / availableHours) * 100;
  
  // Convert to a 0-100 scale where 100 is perfect work-life balance
  return Math.max(0, 100 - workTimePercentage);
};

export const validateRealHourlyWageInputs = (
  inputs: RealHourlyWageInputs
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Salary validation
  if (inputs.salary.salaryType === 'salary' && inputs.salary.annualSalary <= 0) {
    errors.push('Annual salary must be greater than 0');
  }
  if (inputs.salary.salaryType === 'hourly' && (!inputs.salary.hourlyRate || inputs.salary.hourlyRate <= 0)) {
    errors.push('Hourly rate must be greater than 0');
  }

  // Schedule validation
  if (inputs.schedule.hoursPerWeek <= 0 || inputs.schedule.hoursPerWeek > 80) {
    errors.push('Hours per week must be between 1 and 80');
  }
  if (inputs.schedule.weeksPerYear <= 0 || inputs.schedule.weeksPerYear > 52) {
    errors.push('Weeks per year must be between 1 and 52');
  }
  if (inputs.schedule.overtimeHours < 0) {
    errors.push('Overtime hours cannot be negative');
  }

  // Expense validation
  if (inputs.expenses.commuting.dailyCommutingTime < 0) {
    errors.push('Commuting time cannot be negative');
  }
  if (inputs.expenses.preparation.dailyPrepTime < 0) {
    errors.push('Preparation time cannot be negative');
  }

  // Tax validation
  if (inputs.taxes.federalTaxRate < 0 || inputs.taxes.federalTaxRate > 50) {
    errors.push('Federal tax rate must be between 0% and 50%');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 