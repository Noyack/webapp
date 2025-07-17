// /public/workers/monte-carlo-worker.js

// Web Worker for running Monte Carlo simulations in a separate thread
// This prevents UI blocking during heavy computations

// Import types and utilities (these would need to be bundled for the worker)
// In a real implementation, you'd need to bundle dependencies for the worker

class WorkerSimulationEngine {
  constructor() {
    this.isRunning = false;
  }

  // Generate normal random number using Box-Muller transformation
  generateNormalRandom(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  // Generate correlated inflation rate
  generateCorrelatedInflation(marketReturn, params) {
    const baseInflation = params.averageInflation;
    const correlation = params.correlationToInflation;
    const returnDeviation = (marketReturn - params.averageReturn) / params.standardDeviation;
    
    const correlatedComponent = correlation * returnDeviation * params.inflationVolatility;
    const randomComponent = Math.sqrt(1 - correlation * correlation) * 
      this.generateNormalRandom(0, params.inflationVolatility);
    
    return Math.max(0, baseInflation + correlatedComponent + randomComponent);
  }

  // Generate bond return with flight-to-quality adjustment
  generateBondReturn(marketReturn, inflationRate, params) {
    const baseBondReturn = params.bondReturn;
    const bondVolatility = params.bondVolatility || 0.05;
    
    // Bonds tend to perform inversely to stocks in crisis scenarios
    const flightToQualityAdjustment = marketReturn < -0.1 ? 0.02 : 0;
    
    // Real yield adjustment for inflation
    const realYieldAdjustment = Math.max(-0.02, inflationRate - params.averageInflation);
    
    return this.generateNormalRandom(
      baseBondReturn + flightToQualityAdjustment + realYieldAdjustment,
      bondVolatility
    );
  }

  // Generate market scenario
  generateMarketScenario(yearsToProject, parameters) {
    const returns = [];
    const inflationRates = [];
    const bondReturns = [];
    
    const { marketParameters } = parameters;
    
    for (let year = 0; year < yearsToProject; year++) {
      // Generate market return with potential crash scenarios
      let marketReturn = this.generateNormalRandom(
        marketParameters.averageReturn,
        marketParameters.standardDeviation
      );
      
      // Apply crash scenario if configured
      if (marketParameters.crashProbability && Math.random() < marketParameters.crashProbability) {
        marketReturn = -(marketParameters.crashMagnitude || 0.3);
      }
      
      const inflationRate = this.generateCorrelatedInflation(marketReturn, marketParameters);
      const bondReturn = this.generateBondReturn(marketReturn, inflationRate, marketParameters);
      
      returns.push(marketReturn);
      inflationRates.push(inflationRate);
      bondReturns.push(bondReturn);
    }
    
    return { returns, inflationRates, bondReturns };
  }

  // Run retirement simulation scenario
  runRetirementScenario(inputs, scenario, scenarioId) {
    let currentSavingsValue = inputs.currentSavings;
    let yearIndex = 0;
    let success = true;
    let yearsDepleted;
    let cumulativeInflation = 1.0;
    
    // Calculate withdrawal strategies
    const baseTargetAnnualIncome = (inputs.currentAnnualIncome * inputs.desiredIncomeReplacement / 100);
    const socialSecurityAnnual = inputs.socialSecurityBenefits * 12;
    const otherIncomeAnnual = inputs.otherIncome * 12;
    const incomeBasedNeeds = Math.max(0, baseTargetAnnualIncome - socialSecurityAnnual - otherIncomeAnnual);
    
    const currentTotalExpenses = Object.values(inputs.monthlyExpenses).reduce((sum, expense) => sum + expense, 0) * 12;
    const inflationAdjustedExpenses = currentTotalExpenses * Math.pow(1 + (inputs.expectedInflation || 2.5) / 100, inputs.retirementAge - inputs.currentAge);
    const expenseBasedNeeds = Math.max(0, inflationAdjustedExpenses - socialSecurityAnnual - otherIncomeAnnual);
    
    const baseNeededFromSavings = Math.max(incomeBasedNeeds, expenseBasedNeeds);
    
    for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
      const marketReturn = scenario.returns[yearIndex] || 0.07;
      const inflationRate = scenario.inflationRates[yearIndex] || 0.025;
      const bondReturn = scenario.bondReturns?.[yearIndex] || 0.035;
      
      if (age < inputs.retirementAge) {
        // Accumulation phase
        const contributions = inputs.monthlyContribution * 12;
        const interestEarned = currentSavingsValue * marketReturn;
        currentSavingsValue = currentSavingsValue + interestEarned + contributions;
      } else {
        // Withdrawal phase
        if (age === inputs.retirementAge) {
          cumulativeInflation = 1.0;
        } else {
          cumulativeInflation *= (1 + inflationRate);
        }
        
        const yearlyWithdrawal = baseNeededFromSavings * cumulativeInflation;
        
        // Dynamic asset allocation
        const yearsIntoRetirement = age - inputs.retirementAge;
        const equityPercentage = Math.max(20, Math.min(80, 110 - age)) / 100;
        const bondPercentage = 1 - equityPercentage;
        
        const adjustedMarketReturn = (equityPercentage * marketReturn) + (bondPercentage * bondReturn);
        const sequenceRiskAdjustment = yearsIntoRetirement < 5 ? 0.01 : 0;
        const finalReturn = Math.max(0.005, adjustedMarketReturn - sequenceRiskAdjustment);
        
        const interestEarned = currentSavingsValue * finalReturn;
        currentSavingsValue = currentSavingsValue + interestEarned - yearlyWithdrawal;
        
        if (currentSavingsValue <= 0 && !yearsDepleted) {
          success = false;
          yearsDepleted = age;
          currentSavingsValue = 0;
        }
      }
      
      yearIndex++;
    }
    
    return {
      scenarioId,
      finalBalance: Math.max(0, currentSavingsValue),
      success,
      yearsDepleted,
      additionalMetrics: {
        baseWithdrawalNeed: baseNeededFromSavings,
        finalCumulativeInflation: cumulativeInflation
      }
    };
  }

  // Run 401(k) simulation scenario
  run401kScenario(inputs, scenario, scenarioId) {
    let balance = inputs.currentBalance;
    let yearlyContribution = inputs.monthlyContribution * 12;
    let currentIncome = inputs.annualIncome;
    
    const maxEmployerMatch = (inputs.annualIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
    let currentEmployerMatch = Math.min(
      yearlyContribution * (inputs.employerMatch / 100),
      maxEmployerMatch
    );
    
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    let totalContributions = inputs.currentBalance;
    let totalEmployerMatch = 0;
    let yearIndex = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      const marketReturn = scenario.returns[yearIndex] || inputs.estimatedReturn / 100;
      const inflationRate = scenario.inflationRates[yearIndex] || inputs.inflationRate / 100;
      
      const netReturn = marketReturn - (inputs.totalFees / 100);
      
      balance = balance * (1 + netReturn);
      balance += yearlyContribution + currentEmployerMatch;
      totalContributions += yearlyContribution;
      totalEmployerMatch += currentEmployerMatch;
      
      if (inputs.includeInflation && year < yearsToRetirement) {
        const incomeGrowthRate = inputs.incomeGrowthRate / 100;
        currentIncome *= (1 + incomeGrowthRate);
        yearlyContribution *= (1 + incomeGrowthRate);
        
        const newMaxEmployerMatch = (currentIncome * inputs.employerMatchLimit / 100) * (inputs.employerMatch / 100);
        currentEmployerMatch = Math.min(
          yearlyContribution * (inputs.employerMatch / 100),
          newMaxEmployerMatch
        );
      }
      
      yearIndex++;
    }
    
    const totalGrowth = balance - totalContributions - totalEmployerMatch;
    
    return {
      scenarioId,
      finalBalance: Math.max(0, balance),
      success: balance > 0,
      additionalMetrics: {
        totalContributions,
        totalEmployerMatch,
        totalGrowth,
        finalIncome: currentIncome
      }
    };
  }

  // Calculate percentile from sorted array
  getPercentile(sortedArray, percentile) {
    const index = Math.floor(sortedArray.length * (percentile / 100));
    return sortedArray[Math.min(index, sortedArray.length - 1)] || 0;
  }

  // Main simulation runner
  async runSimulation(data) {
    const { inputs, parameters, adapterType } = data;
    const simulationCount = inputs.simulationCount || 10000;
    const yearsToProject = inputs.timeHorizon || (inputs.lifeExpectancy - inputs.currentAge + 1);
    
    this.isRunning = true;
    
    const scenarios = [];
    const yearlyData = Array.from({ length: yearsToProject }, () => []);
    
    // Progress tracking
    const batchSize = Math.max(1, Math.floor(simulationCount / 100));
    let lastProgressUpdate = Date.now();
    
    for (let i = 0; i < simulationCount && this.isRunning; i++) {
      const marketScenario = this.generateMarketScenario(yearsToProject, parameters);
      
      let result;
      if (adapterType === 'RetirementAdapter') {
        result = this.runRetirementScenario(inputs, marketScenario, i);
      } else if (adapterType === 'FourOhOneKAdapter') {
        result = this.run401kScenario(inputs, marketScenario, i);
      } else {
        throw new Error(`Unknown adapter type: ${adapterType}`);
      }
      
      scenarios.push(result);
      
      // Store yearly data for percentile calculations
      const yearlyBalances = this.calculateYearlyProgression(inputs, marketScenario, adapterType);
      for (let yearIndex = 0; yearIndex < yearlyBalances.length; yearIndex++) {
        yearlyData[yearIndex].push(yearlyBalances[yearIndex]);
      }
      
      // Update progress periodically
      if (i % batchSize === 0 || Date.now() - lastProgressUpdate > 1000) {
        self.postMessage({
          type: 'PROGRESS_UPDATE',
          progress: i
        });
        lastProgressUpdate = Date.now();
        
        // Allow for interruption
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    if (!this.isRunning) {
      throw new Error('Simulation cancelled');
    }
    
    // Calculate results
    const results = this.calculateResults(scenarios, yearlyData, inputs);
    
    self.postMessage({
      type: 'SIMULATION_COMPLETE',
      data: results
    });
  }

  // Calculate yearly progression (simplified versions of adapter methods)
  calculateYearlyProgression(inputs, scenario, adapterType) {
    if (adapterType === 'RetirementAdapter') {
      return this.calculateRetirementYearlyProgression(inputs, scenario);
    } else if (adapterType === 'FourOhOneKAdapter') {
      return this.calculate401kYearlyProgression(inputs, scenario);
    }
    return [];
  }

  calculateRetirementYearlyProgression(inputs, scenario) {
    // Simplified version of retirement yearly calculation
    let tempSavings = inputs.currentSavings;
    const yearlyBalances = [];
    let yearIndex = 0;
    
    for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
      const marketReturn = scenario.returns[yearIndex] || 0.07;
      
      if (age < inputs.retirementAge) {
        const contributions = inputs.monthlyContribution * 12;
        const interestEarned = tempSavings * marketReturn;
        tempSavings = tempSavings + interestEarned + contributions;
      } else {
        // Simplified withdrawal calculation
        const yearlyWithdrawal = inputs.currentAnnualIncome * 0.7; // Simplified
        const interestEarned = tempSavings * marketReturn * 0.8; // Conservative in retirement
        tempSavings = Math.max(0, tempSavings + interestEarned - yearlyWithdrawal);
      }
      
      yearlyBalances.push(tempSavings);
      yearIndex++;
    }
    
    return yearlyBalances;
  }

  calculate401kYearlyProgression(inputs, scenario) {
    let balance = inputs.currentBalance;
    let yearlyContribution = inputs.monthlyContribution * 12;
    const yearlyBalances = [];
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    let yearIndex = 0;
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      const marketReturn = scenario.returns[yearIndex] || inputs.estimatedReturn / 100;
      const netReturn = marketReturn - (inputs.totalFees / 100);
      
      balance = balance * (1 + netReturn);
      balance += yearlyContribution;
      
      if (inputs.includeInflation) {
        yearlyContribution *= (1 + inputs.incomeGrowthRate / 100);
      }
      
      yearlyBalances.push(balance);
      yearIndex++;
    }
    
    return yearlyBalances;
  }

  // Calculate final results
  calculateResults(scenarios, yearlyData, inputs) {
    const successfulScenarios = scenarios.filter(s => s.success);
    const successProbability = (successfulScenarios.length / scenarios.length) * 100;
    const probabilityOfDepletion = 100 - successProbability;
    
    const finalBalances = scenarios.map(s => s.finalBalance).sort((a, b) => a - b);
    const medianOutcome = this.getPercentile(finalBalances, 50);
    const worstCase10th = this.getPercentile(finalBalances, 10);
    const bestCase90th = this.getPercentile(finalBalances, 90);
    
    const confidenceIntervals = [10, 25, 50, 75, 90].map(percentile => ({
      percentile,
      value: this.getPercentile(finalBalances, percentile)
    }));
    
    const yearlyProjections = yearlyData.map((yearData, index) => {
      const sortedData = [...yearData].sort((a, b) => a - b);
      return {
        age: inputs.currentAge + index,
        percentile10: this.getPercentile(sortedData, 10),
        percentile25: this.getPercentile(sortedData, 25),
        median: this.getPercentile(sortedData, 50),
        percentile75: this.getPercentile(sortedData, 75),
        percentile90: this.getPercentile(sortedData, 90)
      };
    });
    
    return {
      successProbability,
      medianOutcome,
      worstCase10th,
      bestCase90th,
      probabilityOfDepletion,
      confidenceIntervals,
      yearlyProjections,
      scenarios: scenarios.slice(0, 100)
    };
  }

  // Stop simulation
  stop() {
    this.isRunning = false;
  }
}

// Worker message handler
const engine = new WorkerSimulationEngine();

self.onmessage = async function(event) {
  const { type, data } = event.data;
  
  try {
    switch (type) {
      case 'START_SIMULATION':
        await engine.runSimulation(data);
        break;
        
      case 'STOP_SIMULATION':
        engine.stop();
        break;
        
      default:
        self.postMessage({
          type: 'ERROR',
          error: `Unknown message type: ${type}`
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
};