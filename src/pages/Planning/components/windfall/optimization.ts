import { 
    Windfall, 
    PersonalInfo, 
    FinancialSituation, 
    Goals, 
    InvestmentPreferences,
    OptimizationResults,
    TaxImplications,
    CategoryAllocation,
    Recommendation,
    DebtPayoffPlan,
    TaxStrategy,
    Debt
  } from '../../../../types';
  import { INVESTMENT_VEHICLES } from '../../../../constants/constant';
  import { 
    calculateEmergencyFundNeeds,
    generateInvestmentAllocation,
    calculateProjections,
    calculateInterestSaved,
    calculateTaxImpact
  } from '../../../../utils/windfall';
  
  // Optimize windfall allocation
  export const optimizeAllocation = (
    windfall: Windfall,
    personalInfo: PersonalInfo,
    financialSituation: FinancialSituation,
    goals: Goals
  ): CategoryAllocation => {
    const allocation: CategoryAllocation = {
      debtPayoff: 0,
      emergencyFund: 0,
      retirement: 0,
      shortTermGoals: 0,
      longTermInvestment: 0,
      education: 0,
      charity: 0,
      reserve: 0
    };
    
    let remainingWindfall = windfall.amount;
    
    // Step 1: Emergency Fund
    if (goals.priorities.emergencyFund > 3) {
      const emergencyFundNeeds = calculateEmergencyFundNeeds(
        personalInfo.monthlyExpenses,
        financialSituation.emergencyFund
      );
      const emergencyAllocation = Math.min(emergencyFundNeeds, remainingWindfall);
      allocation.emergencyFund = emergencyAllocation;
      remainingWindfall -= emergencyAllocation;
    }
    
    // Step 2: High-interest debt
    if (goals.priorities.debtReduction > 3) {
      const highInterestDebts = financialSituation.debts
        .filter(debt => debt.interestRate > 6)
        .sort((a, b) => b.interestRate - a.interestRate);
      
      let debtPayoff = 0;
      for (const debt of highInterestDebts) {
        const payAmount = Math.min(debt.balance, remainingWindfall);
        debtPayoff += payAmount;
        remainingWindfall -= payAmount;
        
        if (remainingWindfall <= 0) break;
      }
      
      allocation.debtPayoff = debtPayoff;
    }
    
    // Step 3: Retirement accounts
    if (goals.priorities.retirement > 3 && remainingWindfall > 0) {
      // Simplified allocation - in a real app would be more complex based on available accounts
      const retirementAllocation = Math.min(
        remainingWindfall,
        personalInfo.age > 50 ? 27000 : 19500 // Simplified contribution limit
      );
      allocation.retirement = retirementAllocation;
      remainingWindfall -= retirementAllocation;
    }
    
    // Step 4: Education funding if a goal
    if (goals.additionalGoals.includes('education') && remainingWindfall > 0) {
      const educationAllocation = Math.min(remainingWindfall, 10000);
      allocation.education = educationAllocation;
      remainingWindfall -= educationAllocation;
    }
    
    // Step 5: Short term goals
    if (goals.priorities.shortTermSavings > 3 && remainingWindfall > 0) {
      const shortTermNeeds = goals.plannedLargePurchases
        .filter(purchase => purchase.timeframe <= 3)
        .reduce((sum, purchase) => sum + purchase.estimatedAmount, 0);
      
      const shortTermAllocation = Math.min(shortTermNeeds, remainingWindfall * 0.3);
      allocation.shortTermGoals = shortTermAllocation;
      remainingWindfall -= shortTermAllocation;
    }
    
    // Step 6: Long term investment
    if (remainingWindfall > 0) {
      allocation.longTermInvestment = remainingWindfall * 0.9;
      allocation.reserve = remainingWindfall * 0.1;
      remainingWindfall = 0;
    }
    
    return allocation;
  };
  
  // Generate specific recommendations based on allocation
  export const generateRecommendations = (
    allocation: CategoryAllocation,
    investmentPrefs: InvestmentPreferences
  ): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // Emergency fund recommendation
    if (allocation.emergencyFund > 0) {
      recommendations.push({
        category: 'Emergency Fund',
        action: `Build emergency fund to cover 6 months of expenses`,
        amount: allocation.emergencyFund,
        rationale: 'Financial security foundation before other goals',
        vehicle: 'High-yield savings account or money market fund'
      });
    }
    
    // Debt payoff recommendation
    if (allocation.debtPayoff > 0) {
      recommendations.push({
        category: 'Debt Reduction',
        action: 'Pay off high-interest debt',
        amount: allocation.debtPayoff,
        rationale: 'Eliminating high-interest debt provides an immediate guaranteed return',
        vehicle: 'Direct payment to highest interest debts first'
      });
    }
    
    // Retirement contribution
    if (allocation.retirement > 0) {
      const preferredVehicle = investmentPrefs.preferredVehicles.find(v => 
        v === 'roth401k' || v === 'traditional401k' || v === 'rothIRA' || v === 'traditionalIRA'
      ) || 'roth401k';
      
      const vehicleName = INVESTMENT_VEHICLES.find(v => v.id === preferredVehicle)?.name;
      
      recommendations.push({
        category: 'Retirement',
        action: `Maximize ${vehicleName} contributions`,
        amount: allocation.retirement,
        rationale: 'Tax-advantaged retirement savings for long-term growth',
        vehicle: vehicleName || 'Retirement account'
      });
    }
    
    // Education funding
    if (allocation.education > 0) {
      recommendations.push({
        category: 'Education',
        action: 'Fund 529 College Savings Plan',
        amount: allocation.education,
        rationale: 'Tax-advantaged growth for education expenses',
        vehicle: '529 Plan'
      });
    }
    
    // Short-term goals
    if (allocation.shortTermGoals > 0) {
      recommendations.push({
        category: 'Short-Term Goals',
        action: 'Save for upcoming large purchases',
        amount: allocation.shortTermGoals,
        rationale: 'Preserve capital for near-term needs (1-3 years)',
        vehicle: 'High-yield savings, CDs, or short-term bond funds'
      });
    }
    
    // Long-term investment
    if (allocation.longTermInvestment > 0) {
      const allocationStrategy = generateInvestmentAllocation(
        investmentPrefs.riskTolerance,
        investmentPrefs.customAllocation
      );
      
      recommendations.push({
        category: 'Long-Term Growth',
        action: 'Invest according to your risk profile',
        amount: allocation.longTermInvestment,
        rationale: 'Growth potential for long-term wealth building',
        vehicle: 'Diversified portfolio in taxable brokerage account',
        allocation: allocationStrategy
      });
    }
    
    // Cash reserve
    if (allocation.reserve > 0) {
      recommendations.push({
        category: 'Cash Reserve',
        action: 'Maintain cash reserve for opportunities',
        amount: allocation.reserve,
        rationale: 'Flexibility for future opportunities or needs',
        vehicle: 'High-yield savings account'
      });
    }
    
    return recommendations;
  };
  
  // Calculate debt payoff plan
  export const calculateDebtPayoffPlan = (
    debtPayoffAmount: number,
    debts: Debt[]
  ): DebtPayoffPlan => {
    let remainingPayoff = debtPayoffAmount;
    const payoffPlan: DebtPayoffPlan = {};
    
    // Sort debts by priority (interest rate)
    const sortedDebts = [...debts].sort((a, b) => 
      b.interestRate - a.interestRate
    );
    
    for (const debt of sortedDebts) {
      const amountToPayoff = Math.min(debt.balance, remainingPayoff);
      const remaining = debt.balance - amountToPayoff;
      
      payoffPlan[debt.type] = {
        originalBalance: debt.balance,
        amountPaid: amountToPayoff,
        remainingBalance: remaining,
        interestSaved: calculateInterestSaved(debt, amountToPayoff)
      };
      
      remainingPayoff -= amountToPayoff;
      
      if (remainingPayoff <= 0) break;
    }
    
    return payoffPlan;
  };
  
  // Calculate tax savings opportunities
  export const calculateTaxSavings = (
    windfall: Windfall,
    taxBracket: number
  ): TaxStrategy[] => {
    const strategies: TaxStrategy[] = [];
    
    // Traditional 401(k) or IRA contribution for immediate tax savings
    if (taxBracket >= 22) {
      strategies.push({
        strategy: 'traditional401k',
        description: 'Contribute to Traditional 401(k) to reduce taxable income',
        potentialSavings: Math.min(windfall.amount, 19500) * (taxBracket / 100)
      });
    } else {
      strategies.push({
        strategy: 'rothIRA',
        description: 'Contribute to Roth IRA for tax-free growth',
        potentialSavings: 0 // No immediate tax savings
      });
    }
    
    // HSA contributions
    strategies.push({
      strategy: 'hsa',
      description: 'Contribute to HSA for triple tax advantage',
      potentialSavings: 3600 * (taxBracket / 100)
    });
    
    // Tax-loss harvesting
    strategies.push({
      strategy: 'taxLossHarvesting',
      description: 'Consider tax-loss harvesting in taxable accounts',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      potentialSavings: 'Varies' as any
    });
    
    return strategies;
  };
  
  // Calculate full optimization
  export const calculateOptimization = (
    windfall: Windfall,
    personalInfo: PersonalInfo,
    financialSituation: FinancialSituation,
    goals: Goals,
    investmentPrefs: InvestmentPreferences
  ): { 
    optimizationResults: OptimizationResults, 
    taxImplications: TaxImplications 
  } => {
    // Get optimized allocation
    const allocation = optimizeAllocation(windfall, personalInfo, financialSituation, goals);
    
    // Generate specific recommendations
    const recommendations = generateRecommendations(allocation, investmentPrefs);
    
    // Calculate debt payoff plan
    const debtPayoffPlan = calculateDebtPayoffPlan(allocation.debtPayoff, financialSituation.debts);
    
    // Generate investment projections
    const investmentAllocation = generateInvestmentAllocation(
      investmentPrefs.riskTolerance,
      investmentPrefs.customAllocation
    );
    const longTermAmount = allocation.longTermInvestment + allocation.retirement;
    const projections = calculateProjections(investmentAllocation, longTermAmount);
    
    // Generate tax strategies
    const taxStrategies = calculateTaxSavings(windfall, personalInfo.taxBracket);
    
    // Calculate tax impact
    const estimatedTaxImpact = calculateTaxImpact(
      windfall.amount,
      windfall.taxable,
      personalInfo.taxBracket
    );
    
    return {
      optimizationResults: {
        recommendations,
        allocationByCategory: allocation,
        projections,
        debtPayoffPlan
      },
      taxImplications: {
        estimatedTaxImpact,
        taxSavingStrategies: taxStrategies
      }
    };
  };