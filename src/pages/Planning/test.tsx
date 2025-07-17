// Example of how to integrate the new Monte Carlo engine with your existing calculators

import React, { useState, useEffect } from 'react';
import { MonteCarloEngine } from '../../monte-carlo-engine/core/SimulationEngine';
import { RetirementAdapter, RetirementInputs, RetirementResults } from '../../monte-carlo-engine/adapters/RetirementAdapter';
import { FourOhOneKAdapter, FourOhOneKInputs, FourOhOneKResults } from '../../monte-carlo-engine/adapters/FourOhOneKAdapter';
import { BaseSimulationResults, SimulationProgress } from '../../monte-carlo-engine/core/types';

// Integration with your existing retirement calculator
export const EnhancedRetirementMonteCarloTab: React.FC<{ inputs: any; costOfLivingIndex: number }> = ({ 
  inputs, 
  costOfLivingIndex 
}) => {
  const [results, setResults] = useState<RetirementResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState<SimulationProgress | null>(null);
  const [engine] = useState(() => new MonteCarloEngine());

  // Convert your existing inputs to the new format
  const convertToRetirementInputs = (oldInputs: any): RetirementInputs => ({
    currentAge: oldInputs.currentAge,
    timeHorizon: oldInputs.lifeExpectancy - oldInputs.currentAge + 1,
    retirementAge: oldInputs.retirementAge,
    lifeExpectancy: oldInputs.lifeExpectancy,
    currentSavings: oldInputs.currentSavings,
    monthlyContribution: oldInputs.monthlyContribution,
    currentAnnualIncome: oldInputs.currentAnnualIncome,
    desiredIncomeReplacement: oldInputs.desiredIncomeReplacement,
    socialSecurityBenefits: oldInputs.socialSecurityBenefits,
    otherIncome: oldInputs.otherIncome,
    monthlyExpenses: oldInputs.monthlyExpenses,
    expectedInflation: oldInputs.expectedInflation,
    simulationCount: 10000,
    riskProfile: 'moderate' // or derive from user settings
  });

  const runSimulation = async () => {
    setIsCalculating(true);
    setProgress(null);
    
    try {
      const retirementInputs = convertToRetirementInputs(inputs);
      const adapter = new RetirementAdapter();
      
      const results = await engine.runSimulation(
        retirementInputs,
        adapter,
        (progressUpdate: SimulationProgress) => {
          setProgress(progressUpdate);
        }
      );
      
      // Calculate retirement-specific metrics
      const enhancedResults = adapter.calculateRetirementMetrics(results, retirementInputs);
      setResults(enhancedResults);
      
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsCalculating(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    if (inputs.currentAge && inputs.retirementAge && inputs.currentSavings) {
      runSimulation();
    }
    
    // Cleanup on unmount
    return () => {
      engine.destroy();
    };
  }, [inputs.currentAge, inputs.retirementAge, inputs.currentSavings]);

  // Your existing UI components can remain mostly the same
  if (isCalculating) {
    return (
      <div className="text-center p-8">
        <h3>Running Enhanced Monte Carlo Analysis...</h3>
        {progress && (
          <div>
            <p>Phase: {progress.currentPhase}</p>
            <p>Progress: {progress.completed}/{progress.total} ({((progress.completed / progress.total) * 100).toFixed(1)}%)</p>
            {progress.estimatedTimeRemaining && (
              <p>Est. time remaining: {Math.round(progress.estimatedTimeRemaining / 1000)}s</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center p-8">
        <button onClick={runSimulation} className="btn btn-primary">
          Run Enhanced Monte Carlo Analysis
        </button>
      </div>
    );
  }

  // Enhanced results display with new metrics
  return (
    <div>
      {/* Your existing UI structure */}
      <div className="results-overview">
        <div className="metric-card">
          <h3>{results.successProbability.toFixed(1)}%</h3>
          <p>Success Probability</p>
        </div>
        
        <div className="metric-card">
          <h3>${results.expectedMonthlyIncome.toLocaleString()}</h3>
          <p>Expected Monthly Income</p>
        </div>
        
        <div className="metric-card">
          <h3>{results.incomeReplacementRatio.toFixed(0)}%</h3>
          <p>Income Replacement</p>
        </div>
        
        <div className="metric-card">
          <h3>{results.socialSecurityCoverage.toFixed(0)}%</h3>
          <p>Social Security Coverage</p>
        </div>
      </div>

      {/* Enhanced recommendations */}
      <div className="recommendations">
        <h4>Personalized Recommendations</h4>
        <ul>
          {results.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Your existing charts and detailed analysis */}
      {/* These can use the same data structure as before */}
    </div>
  );
};

// Integration with 401(k) calculator
export const Enhanced401kMonteCarloTab: React.FC<{ inputs: any }> = ({ inputs }) => {
  const [results, setResults] = useState<FourOhOneKResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [engine] = useState(() => new MonteCarloEngine());

  // Convert your existing 401k inputs to the new format
  const convertTo401kInputs = (oldInputs: any): FourOhOneKInputs => ({
    currentAge: oldInputs.currentAge,
    timeHorizon: oldInputs.retirementAge - oldInputs.currentAge,
    retirementAge: oldInputs.retirementAge,
    annualIncome: oldInputs.annualIncome,
    currentBalance: oldInputs.currentBalance,
    monthlyContribution: oldInputs.monthlyContribution,
    employerMatch: oldInputs.employerMatch,
    employerMatchLimit: oldInputs.employerMatchLimit,
    estimatedReturn: oldInputs.estimatedReturn,
    totalFees: oldInputs.totalFees,
    includeInflation: oldInputs.includeInflation,
    inflationRate: oldInputs.inflationRate,
    incomeGrowthRate: oldInputs.incomeGrowthRate,
    simulationCount: 5000, // Smaller count for 401k simulations
    riskProfile: 'moderate'
  });

  const runSimulation = async () => {
    setIsCalculating(true);
    
    try {
      const fourOhOneKInputs = convertTo401kInputs(inputs);
      const adapter = new FourOhOneKAdapter();
      
      const results = await engine.runSimulation(fourOhOneKInputs, adapter);
      
      // Calculate 401k-specific metrics
      const enhancedResults = adapter.calculate401kMetrics(results, fourOhOneKInputs);
      setResults(enhancedResults);
      
    } catch (error) {
      console.error('401k simulation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (inputs.currentAge && inputs.retirementAge && inputs.currentBalance !== undefined) {
      runSimulation();
    }
    
    return () => {
      engine.destroy();
    };
  }, [inputs.currentAge, inputs.retirementAge, inputs.currentBalance, inputs.monthlyContribution]);

  if (isCalculating) {
    return <div>Running 401(k) Monte Carlo Analysis...</div>;
  }

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Enhanced 401k results */}
      <div className="results-overview">
        <div className="metric-card">
          <h3>${results.medianOutcome.toLocaleString()}</h3>
          <p>Projected Balance</p>
        </div>
        
        <div className="metric-card">
          <h3>${results.monthlyReplacementIncome.toLocaleString()}</h3>
          <p>Monthly Income (4% rule)</p>
        </div>
        
        <div className="metric-card">
          <h3>{results.employerMatchEfficiency.toFixed(0)}%</h3>
          <p>Match Efficiency</p>
        </div>
        
        <div className="metric-card">
          <h3>${results.feeImpact.toLocaleString()}</h3>
          <p>Fee Impact</p>
        </div>
      </div>

      {/* Enhanced recommendations */}
      <div className="recommendations">
        <h4>401(k) Optimization Recommendations</h4>
        <ul>
          {results.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Risk analysis specific to 401k */}
      <div className="risk-analysis">
        <h4>Market Risk Analysis</h4>
        <p>Based on {results.scenarios.length * 100} market scenarios:</p>
        <ul>
          <li>Best case (90th percentile): ${results.bestCase90th.toLocaleString()}</li>
          <li>Median outcome: ${results.medianOutcome.toLocaleString()}</li>
          <li>Worst case (10th percentile): ${results.worstCase10th.toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

// Utility hook for managing simulation state
export const useMonteCarloSimulation = <TInputs, TResults>(
  inputs: TInputs,
  adapter: any,
  dependencies: any[] = []
) => {
  const [results, setResults] = useState<TResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState<SimulationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [engine] = useState(() => new MonteCarloEngine());

  const runSimulation = async () => {
    if (!inputs) return;
    
    setIsCalculating(true);
    setError(null);
    setProgress(null);
    
    try {
      const results = await engine.runSimulation(
        inputs,
        adapter,
        (progressUpdate: SimulationProgress) => {
          setProgress(progressUpdate);
        }
      );
      
      setResults(results as TResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsCalculating(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    runSimulation();
    
    return () => {
      engine.destroy();
    };
  }, dependencies);

  return {
    results,
    isCalculating,
    progress,
    error,
    runSimulation,
    engine
  };
};

// Migration guide from your old Monte Carlo to new engine
export class MonteCarloMigrationHelper {
  
  // Convert your existing MonteCarloResults to new BaseSimulationResults
  static convertLegacyResults(legacyResults: any): BaseSimulationResults {
    return {
      successProbability: legacyResults.successProbability,
      medianOutcome: legacyResults.medianOutcome,
      worstCase10th: legacyResults.worstCase10th,
      bestCase90th: legacyResults.bestCase90th,
      probabilityOfDepletion: legacyResults.probabilityOfDepletion,
      confidenceIntervals: legacyResults.confidenceIntervals,
      yearlyProjections: legacyResults.yearlyProjections,
      scenarios: legacyResults.scenarios
    };
  }
  
  // Convert your existing RetirementInputs to new format
  static convertLegacyRetirementInputs(legacyInputs: any): RetirementInputs {
    return {
      currentAge: legacyInputs.currentAge,
      timeHorizon: legacyInputs.lifeExpectancy - legacyInputs.currentAge + 1,
      retirementAge: legacyInputs.retirementAge,
      lifeExpectancy: legacyInputs.lifeExpectancy,
      currentSavings: legacyInputs.currentSavings,
      monthlyContribution: legacyInputs.monthlyContribution,
      currentAnnualIncome: legacyInputs.currentAnnualIncome,
      desiredIncomeReplacement: legacyInputs.desiredIncomeReplacement,
      socialSecurityBenefits: legacyInputs.socialSecurityBenefits,
      otherIncome: legacyInputs.otherIncome,
      monthlyExpenses: legacyInputs.monthlyExpenses,
      expectedInflation: legacyInputs.expectedInflation,
      simulationCount: 10000,
      riskProfile: 'moderate'
    };
  }
  
  // Backwards compatibility wrapper for your existing MonteCarloTab
  static wrapLegacyComponent(LegacyComponent: React.ComponentType<any>) {
    return (props: any) => {
      const [isUsingNewEngine, setIsUsingNewEngine] = useState(false);
      
      if (isUsingNewEngine) {
        return <EnhancedRetirementMonteCarloTab {...props} />;
      }
      
      return (
        <div>
          <div style={{ padding: '10px', background: '#f0f8ff', marginBottom: '20px' }}>
            <p>🚀 <strong>Enhanced Monte Carlo Engine Available!</strong></p>
            <p>Try our new engine with improved accuracy, better performance, and enhanced scenarios.</p>
            <button 
              onClick={() => setIsUsingNewEngine(true)}
              style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Try Enhanced Engine
            </button>
          </div>
          <LegacyComponent {...props} />
        </div>
      );
    };
  }
}

// Example usage in your existing components
export const MigratedMonteCarloTab = MonteCarloMigrationHelper.wrapLegacyComponent(
  // Your existing MonteCarloTab component
  ({ inputs, costOfLivingIndex }: any) => {
    // Your existing implementation
    return <div>Legacy Monte Carlo Tab</div>;
  }
);

// Performance comparison component
export const PerformanceComparison: React.FC<{ inputs: any }> = ({ inputs }) => {
  const [legacyTime, setLegacyTime] = useState<number | null>(null);
  const [newEngineTime, setNewEngineTime] = useState<number | null>(null);
  
  const runComparison = async () => {
    // Run legacy simulation
    const legacyStart = performance.now();
    // ... your existing simulation code
    const legacyEnd = performance.now();
    setLegacyTime(legacyEnd - legacyStart);
    
    // Run new engine simulation
    const newStart = performance.now();
    const engine = new MonteCarloEngine();
    const adapter = new RetirementAdapter();
    const convertedInputs = MonteCarloMigrationHelper.convertLegacyRetirementInputs(inputs);
    
    await engine.runSimulation(convertedInputs, adapter);
    const newEnd = performance.now();
    setNewEngineTime(newEnd - newStart);
    
    engine.destroy();
  };
  
  return (
    <div style={{ padding: '20px', background: '#f8f9fa', margin: '20px 0' }}>
      <h4>Performance Comparison</h4>
      <button onClick={runComparison}>Run Performance Test</button>
      
      {legacyTime && newEngineTime && (
        <div style={{ marginTop: '10px' }}>
          <p>Legacy Engine: {legacyTime.toFixed(0)}ms</p>
          <p>New Engine: {newEngineTime.toFixed(0)}ms</p>
          <p>
            <strong>
              {newEngineTime < legacyTime 
                ? `${((legacyTime / newEngineTime - 1) * 100).toFixed(1)}% faster!`
                : `${((newEngineTime / legacyTime - 1) * 100).toFixed(1)}% slower`
              }
            </strong>
          </p>
        </div>
      )}
    </div>
  );
};