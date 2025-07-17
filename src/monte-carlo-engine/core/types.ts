// /monte-carlo-engine/core/types.ts

export interface BaseSimulationInputs {
  currentAge: number;
  timeHorizon: number; // years to project
  simulationCount?: number;
}

export interface MarketScenario {
  returns: number[];
  inflationRates: number[];
  bondReturns?: number[];
  realEstateReturns?: number[];
}

export interface BaseSimulationResults {
  successProbability: number;
  medianOutcome: number;
  worstCase10th: number;
  bestCase90th: number;
  probabilityOfDepletion: number;
  confidenceIntervals: Array<{
    percentile: number;
    value: number;
  }>;
  yearlyProjections: Array<{
    age: number;
    percentile10: number;
    percentile25: number;
    median: number;
    percentile75: number;
    percentile90: number;
  }>;
  scenarios: Array<{
    scenarioId: number;
    finalBalance: number;
    success: boolean;
    yearsDepleted?: number;
    additionalMetrics?: Record<string, any>;
  }>;
}

export interface AssetAllocation {
  equities: number;
  bonds: number;
  realEstate?: number;
  cash?: number;
}

export interface EconomicRegime {
  name: string;
  probability: number;
  expectedReturn: number;
  volatility: number;
  inflationRate: number;
  duration: number; // years
}

export interface MarketParameters {
  averageReturn: number;
  standardDeviation: number;
  averageInflation: number;
  inflationVolatility: number;
  correlationToInflation: number;
  bondReturn: number;
  bondVolatility: number;
  crashProbability?: number;
  crashMagnitude?: number;
}

// Adapter interface that each calculator must implement
export interface SimulationAdapter<TInputs extends BaseSimulationInputs, TResults extends BaseSimulationResults> {
  // Convert calculator-specific inputs to standardized parameters
  prepareSimulationParameters(inputs: TInputs): SimulationParameters;
  
  // Run a single scenario simulation
  runSingleScenario(
    inputs: TInputs,
    scenario: MarketScenario,
    scenarioId: number
  ): TResults['scenarios'][0];
  
  // Calculate yearly progression for a single scenario
  calculateYearlyProgression(
    inputs: TInputs,
    scenario: MarketScenario
  ): number[];
  
  // Determine success criteria for this calculator type
  evaluateSuccess(finalBalance: number, inputs: TInputs): boolean;
  
  // Get calculator-specific recommendations
  generateRecommendations?(results: TResults, inputs: TInputs): string[];
}

export interface SimulationParameters {
  marketParameters: MarketParameters;
  assetAllocation?: AssetAllocation;
  economicRegimes?: EconomicRegime[];
  customScenarios?: Partial<MarketScenario>[];
  riskAdjustments?: {
    sequenceOfReturnsRisk?: boolean;
    longevityRisk?: boolean;
    inflationRisk?: boolean;
  };
}

// Configuration for different risk profiles
export interface RiskProfile {
  name: 'conservative' | 'moderate' | 'aggressive' | 'custom';
  assetAllocation: AssetAllocation;
  marketParameters: MarketParameters;
  description: string;
}

// Worker message types for performance
export interface WorkerMessage {
  type: 'START_SIMULATION' | 'PROGRESS_UPDATE' | 'SIMULATION_COMPLETE' | 'ERROR';
  data?: any;
  progress?: number;
  error?: string;
}

export interface SimulationProgress {
  completed: number;
  total: number;
  currentPhase: 'setup' | 'running' | 'analyzing' | 'complete';
  estimatedTimeRemaining?: number;
}