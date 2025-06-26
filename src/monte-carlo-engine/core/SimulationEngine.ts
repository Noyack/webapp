// /monte-carlo-engine/core/SimulationEngine.ts

import {
  BaseSimulationInputs,
  BaseSimulationResults,
  MarketScenario,
  SimulationAdapter,
  SimulationParameters,
  MarketParameters,
  EconomicRegime,
  WorkerMessage,
  SimulationProgress
} from './types';

export class MonteCarloEngine {
  private progressCallback?: (progress: SimulationProgress) => void;
  private worker?: Worker;

  constructor() {
    // Initialize worker if available
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker('/workers/monte-carlo-worker.js');
      } catch (error) {
        console.warn('Web Worker not available, using main thread');
      }
    }
  }

  // Main simulation runner
  async runSimulation<TInputs extends BaseSimulationInputs, TResults extends BaseSimulationResults>(
    inputs: TInputs,
    adapter: SimulationAdapter<TInputs, TResults>,
    progressCallback?: (progress: SimulationProgress) => void
  ): Promise<TResults> {
    this.progressCallback = progressCallback;
    
    const simulationCount = inputs.simulationCount || 10000;
    const parameters = adapter.prepareSimulationParameters(inputs);
    
    // If worker is available and simulation is large, use it
    if (this.worker && simulationCount > 1000) {
      return this.runSimulationWithWorker(inputs, adapter, parameters);
    } else {
      return this.runSimulationMainThread(inputs, adapter, parameters);
    }
  }

  // Main thread simulation (fallback and small simulations)
  private async runSimulationMainThread<TInputs extends BaseSimulationInputs, TResults extends BaseSimulationResults>(
    inputs: TInputs,
    adapter: SimulationAdapter<TInputs, TResults>,
    parameters: SimulationParameters
  ): Promise<TResults> {
    const simulationCount = inputs.simulationCount || 10000;
    const yearsToProject = inputs.timeHorizon;
    
    this.updateProgress({
      completed: 0,
      total: simulationCount,
      currentPhase: 'setup'
    });

    const scenarios: TResults['scenarios'] = [];
    const yearlyData: Array<Array<number>> = Array.from({ length: yearsToProject }, () => []);
    
    // Batch processing for progress updates
    const batchSize = Math.max(1, Math.floor(simulationCount / 100));
    
    for (let i = 0; i < simulationCount; i++) {
      const marketScenario = this.generateMarketScenario(yearsToProject, parameters);
      const result = adapter.runSingleScenario(inputs, marketScenario, i);
      scenarios.push(result);
      
      // Store yearly data for percentile calculations
      const yearlyBalances = adapter.calculateYearlyProgression(inputs, marketScenario);
      for (let yearIndex = 0; yearIndex < yearlyBalances.length; yearIndex++) {
        yearlyData[yearIndex].push(yearlyBalances[yearIndex]);
      }
      
      // Update progress periodically
      if (i % batchSize === 0) {
        this.updateProgress({
          completed: i,
          total: simulationCount,
          currentPhase: 'running',
          estimatedTimeRemaining: this.estimateTimeRemaining(i, simulationCount, Date.now())
        });
        
        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    this.updateProgress({
      completed: simulationCount,
      total: simulationCount,
      currentPhase: 'analyzing'
    });
    
    // Calculate results
    const results = this.calculateResults(scenarios, yearlyData, inputs, adapter);
    
    this.updateProgress({
      completed: simulationCount,
      total: simulationCount,
      currentPhase: 'complete'
    });
    
    return results as TResults;
  }

  // Web Worker simulation (for performance)
  private async runSimulationWithWorker<TInputs extends BaseSimulationInputs, TResults extends BaseSimulationResults>(
    inputs: TInputs,
    adapter: SimulationAdapter<TInputs, TResults>,
    parameters: SimulationParameters
  ): Promise<TResults> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const { type, data, progress, error } = event.data;
        
        switch (type) {
          case 'PROGRESS_UPDATE':
            if (progress !== undefined) {
              this.updateProgress({
                completed: progress,
                total: inputs.simulationCount || 10000,
                currentPhase: 'running'
              });
            }
            break;
            
          case 'SIMULATION_COMPLETE':
            resolve(data as TResults);
            break;
            
          case 'ERROR':
            reject(new Error(error || 'Simulation failed'));
            break;
        }
      };

      // Send simulation data to worker
      this.worker.postMessage({
        type: 'START_SIMULATION',
        data: {
          inputs,
          parameters,
          adapterType: adapter.constructor.name
        }
      });
    });
  }

  // Generate market scenario with enhanced modeling
  generateMarketScenario(yearsToProject: number, parameters: SimulationParameters): MarketScenario {
    const returns: number[] = [];
    const inflationRates: number[] = [];
    const bondReturns: number[] = [];
    
    const { marketParameters } = parameters;
    let currentRegime: EconomicRegime | null = null;
    let regimeYearsRemaining = 0;
    
    for (let year = 0; year < yearsToProject; year++) {
      // Economic regime modeling
      if (parameters.economicRegimes && (regimeYearsRemaining <= 0 || !currentRegime)) {
        currentRegime = this.selectEconomicRegime(parameters.economicRegimes);
        regimeYearsRemaining = currentRegime.duration;
      }
      
      // Use regime parameters if available, otherwise use base parameters
      const effectiveParams = currentRegime ? {
        ...marketParameters,
        averageReturn: currentRegime.expectedReturn,
        standardDeviation: currentRegime.volatility,
        averageInflation: currentRegime.inflationRate
      } : marketParameters;
      
      // Generate market return with potential crash scenarios
      let marketReturn = this.generateNormalRandom(
        effectiveParams.averageReturn,
        effectiveParams.standardDeviation
      );
      
      // Apply crash scenario if configured
      if (effectiveParams.crashProbability && Math.random() < effectiveParams.crashProbability) {
        marketReturn = -(effectiveParams.crashMagnitude || 0.3); // Default 30% crash
      }
      
      const inflationRate = this.generateCorrelatedInflation(marketReturn, effectiveParams);
      const bondReturn = this.generateBondReturn(marketReturn, inflationRate, effectiveParams);
      
      returns.push(marketReturn);
      inflationRates.push(inflationRate);
      bondReturns.push(bondReturn);
      
      if (currentRegime) {
        regimeYearsRemaining--;
      }
    }
    
    return { returns, inflationRates, bondReturns };
  }

  // Enhanced random number generation
  private generateNormalRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  // Generate correlated inflation with enhanced modeling
  private generateCorrelatedInflation(marketReturn: number, params: MarketParameters): number {
    const baseInflation = params.averageInflation;
    const correlation = params.correlationToInflation;
    const returnDeviation = (marketReturn - params.averageReturn) / params.standardDeviation;
    
    const correlatedComponent = correlation * returnDeviation * params.inflationVolatility;
    const randomComponent = Math.sqrt(1 - correlation * correlation) * 
      this.generateNormalRandom(0, params.inflationVolatility);
    
    return Math.max(0, baseInflation + correlatedComponent + randomComponent);
  }

  // Generate bond returns with yield curve modeling
  private generateBondReturn(marketReturn: number, inflationRate: number, params: MarketParameters): number {
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

  // Select economic regime based on probabilities
  private selectEconomicRegime(regimes: EconomicRegime[]): EconomicRegime {
    const totalProbability = regimes.reduce((sum, regime) => sum + regime.probability, 0);
    const random = Math.random() * totalProbability;
    
    let cumulativeProbability = 0;
    for (const regime of regimes) {
      cumulativeProbability += regime.probability;
      if (random <= cumulativeProbability) {
        return regime;
      }
    }
    
    return regimes[regimes.length - 1]; // Fallback
  }

  // Calculate comprehensive results
  private calculateResults<TInputs extends BaseSimulationInputs, TResults extends BaseSimulationResults>(
    scenarios: TResults['scenarios'],
    yearlyData: Array<Array<number>>,
    inputs: TInputs,
    adapter: SimulationAdapter<TInputs, TResults>
  ): BaseSimulationResults {
    // Calculate success statistics
    const successfulScenarios = scenarios.filter(s => s.success);
    const successProbability = (successfulScenarios.length / scenarios.length) * 100;
    const probabilityOfDepletion = 100 - successProbability;
    
    // Calculate outcome statistics
    const finalBalances = scenarios.map(s => s.finalBalance).sort((a, b) => a - b);
    const medianOutcome = this.getPercentile(finalBalances, 50);
    const worstCase10th = this.getPercentile(finalBalances, 10);
    const bestCase90th = this.getPercentile(finalBalances, 90);
    
    // Calculate confidence intervals
    const confidenceIntervals = [10, 25, 50, 75, 90].map(percentile => ({
      percentile,
      value: this.getPercentile(finalBalances, percentile)
    }));
    
    // Calculate yearly projections
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
      scenarios: scenarios.slice(0, 100) // Sample for visualization
    };
  }

  // Utility method for percentile calculation
  private getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.floor(sortedArray.length * (percentile / 100));
    return sortedArray[Math.min(index, sortedArray.length - 1)] || 0;
  }

  // Progress tracking
  private updateProgress(progress: SimulationProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  // Time estimation for progress
  private estimateTimeRemaining(completed: number, total: number, startTime: number): number {
    if (completed === 0) return 0;
    
    const elapsed = Date.now() - startTime;
    const rate = completed / elapsed;
    const remaining = total - completed;
    
    return remaining / rate;
  }

  // Cleanup
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}