// /monte-carlo-engine/config/MarketParameters.ts

import { MarketParameters, RiskProfile, EconomicRegime, AssetAllocation } from '../core/types';

// Base market parameters for different asset classes
export const ASSET_CLASS_PARAMETERS: Record<string, MarketParameters> = {
  US_EQUITIES: {
    averageReturn: 0.10,
    standardDeviation: 0.20,
    averageInflation: 0.025,
    inflationVolatility: 0.015,
    correlationToInflation: -0.3,
    bondReturn: 0.035,
    bondVolatility: 0.05,
    crashProbability: 0.08, // 8% chance per year of significant downturn
    crashMagnitude: 0.25
  },
  
  INTERNATIONAL_EQUITIES: {
    averageReturn: 0.085,
    standardDeviation: 0.22,
    averageInflation: 0.025,
    inflationVolatility: 0.015,
    correlationToInflation: -0.2,
    bondReturn: 0.030,
    bondVolatility: 0.06,
    crashProbability: 0.10,
    crashMagnitude: 0.30
  },
  
  BONDS: {
    averageReturn: 0.04,
    standardDeviation: 0.05,
    averageInflation: 0.025,
    inflationVolatility: 0.015,
    correlationToInflation: 0.6,
    bondReturn: 0.035,
    bondVolatility: 0.03
  },
  
  REAL_ESTATE: {
    averageReturn: 0.08,
    standardDeviation: 0.15,
    averageInflation: 0.025,
    inflationVolatility: 0.015,
    correlationToInflation: 0.4,
    bondReturn: 0.035,
    bondVolatility: 0.05
  },
  
  COMMODITIES: {
    averageReturn: 0.05,
    standardDeviation: 0.25,
    averageInflation: 0.025,
    inflationVolatility: 0.015,
    correlationToInflation: 0.8,
    bondReturn: 0.035,
    bondVolatility: 0.05
  }
};

// Economic regime definitions
export const ECONOMIC_REGIMES: EconomicRegime[] = [
  {
    name: 'Bull Market',
    probability: 0.65,
    expectedReturn: 0.12,
    volatility: 0.15,
    inflationRate: 0.025,
    duration: 7
  },
  {
    name: 'Bear Market',
    probability: 0.15,
    expectedReturn: -0.05,
    volatility: 0.25,
    inflationRate: 0.015,
    duration: 2
  },
  {
    name: 'Stagnation',
    probability: 0.15,
    expectedReturn: 0.03,
    volatility: 0.10,
    inflationRate: 0.035,
    duration: 4
  },
  {
    name: 'Recovery',
    probability: 0.05,
    expectedReturn: 0.20,
    volatility: 0.20,
    inflationRate: 0.02,
    duration: 2
  }
];

// Risk profile configurations
export const RISK_PROFILES: Record<string, RiskProfile> = {
  CONSERVATIVE: {
    name: 'conservative',
    description: 'Low risk, stable returns with capital preservation focus',
    assetAllocation: {
      equities: 0.30,
      bonds: 0.60,
      realEstate: 0.05,
      cash: 0.05
    },
    marketParameters: {
      averageReturn: 0.06,
      standardDeviation: 0.08,
      averageInflation: 0.025,
      inflationVolatility: 0.01,
      correlationToInflation: -0.1,
      bondReturn: 0.035,
      bondVolatility: 0.03,
      crashProbability: 0.03,
      crashMagnitude: 0.10
    }
  },
  
  MODERATE: {
    name: 'moderate',
    description: 'Balanced approach with moderate risk and growth potential',
    assetAllocation: {
      equities: 0.60,
      bonds: 0.30,
      realEstate: 0.08,
      cash: 0.02
    },
    marketParameters: {
      averageReturn: 0.08,
      standardDeviation: 0.12,
      averageInflation: 0.025,
      inflationVolatility: 0.015,
      correlationToInflation: -0.2,
      bondReturn: 0.035,
      bondVolatility: 0.04,
      crashProbability: 0.06,
      crashMagnitude: 0.18
    }
  },
  
  AGGRESSIVE: {
    name: 'aggressive',
    description: 'High growth potential with increased volatility and risk',
    assetAllocation: {
      equities: 0.85,
      bonds: 0.10,
      realEstate: 0.05,
      cash: 0.00
    },
    marketParameters: {
      averageReturn: 0.10,
      standardDeviation: 0.18,
      averageInflation: 0.025,
      inflationVolatility: 0.015,
      correlationToInflation: -0.3,
      bondReturn: 0.035,
      bondVolatility: 0.05,
      crashProbability: 0.08,
      crashMagnitude: 0.25
    }
  }
};

// Age-based asset allocation formulas
export class AssetAllocationCalculator {
  
  // Rule of 110: 110 - age = equity percentage
  static calculateByAge(age: number, riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate'): AssetAllocation {
    const baseEquityPercentage = Math.max(20, Math.min(90, 110 - age)) / 100;
    
    // Adjust based on risk profile
    const riskAdjustment = {
      conservative: -0.15,
      moderate: 0,
      aggressive: 0.15
    };
    
    const adjustedEquity = Math.max(0.1, Math.min(0.9, 
      baseEquityPercentage + riskAdjustment[riskProfile]
    ));
    
    const bonds = Math.min(0.8, 1 - adjustedEquity);
    const realEstate = Math.min(0.1, Math.max(0, 0.1 - (age - 30) * 0.002));
    const cash = Math.max(0, 1 - adjustedEquity - bonds - realEstate);
    
    return {
      equities: Number(adjustedEquity.toFixed(3)),
      bonds: Number(bonds.toFixed(3)),
      realEstate: Number(realEstate.toFixed(3)),
      cash: Number(cash.toFixed(3))
    };
  }
  
  // Target date fund glide path
  static calculateGlidePath(currentAge: number, retirementAge: number, riskProfile: string = 'moderate'): AssetAllocation[] {
    const glidePath: AssetAllocation[] = [];
    
    for (let age = currentAge; age <= retirementAge + 20; age++) {
      glidePath.push(this.calculateByAge(age, riskProfile as any));
    }
    
    return glidePath;
  }
  
  // Blend two asset allocations
  static blendAllocations(allocation1: AssetAllocation, allocation2: AssetAllocation, weight1: number): AssetAllocation {
    const weight2 = 1 - weight1;
    
    return {
      equities: allocation1.equities * weight1 + allocation2.equities * weight2,
      bonds: allocation1.bonds * weight1 + allocation2.bonds * weight2,
      realEstate: (allocation1.realEstate || 0) * weight1 + (allocation2.realEstate || 0) * weight2,
      cash: (allocation1.cash || 0) * weight1 + (allocation2.cash || 0) * weight2
    };
  }
}

// Market parameter utilities
export class MarketParameterUtils {
  
  // Blend market parameters based on asset allocation
  static blendMarketParameters(allocation: AssetAllocation): MarketParameters {
    const equityParams = ASSET_CLASS_PARAMETERS.US_EQUITIES;
    const bondParams = ASSET_CLASS_PARAMETERS.BONDS;
    const realEstateParams = ASSET_CLASS_PARAMETERS.REAL_ESTATE;
    
    const totalWeight = allocation.equities + allocation.bonds + (allocation.realEstate || 0);
    
    return {
      averageReturn: 
        (equityParams.averageReturn * allocation.equities +
         bondParams.averageReturn * allocation.bonds +
         realEstateParams.averageReturn * (allocation.realEstate || 0)) / totalWeight,
         
      standardDeviation: Math.sqrt(
        (Math.pow(equityParams.standardDeviation, 2) * allocation.equities +
         Math.pow(bondParams.standardDeviation, 2) * allocation.bonds +
         Math.pow(realEstateParams.standardDeviation, 2) * (allocation.realEstate || 0)) / totalWeight
      ),
      
      averageInflation: equityParams.averageInflation,
      inflationVolatility: equityParams.inflationVolatility,
      correlationToInflation: 
        (equityParams.correlationToInflation * allocation.equities +
         bondParams.correlationToInflation * allocation.bonds +
         realEstateParams.correlationToInflation * (allocation.realEstate || 0)) / totalWeight,
         
      bondReturn: bondParams.bondReturn,
      bondVolatility: bondParams.bondVolatility,
      crashProbability: equityParams.crashProbability * allocation.equities,
      crashMagnitude: equityParams.crashMagnitude * allocation.equities
    };
  }
  
  // Adjust parameters for different time periods
  static adjustForTimePeriod(params: MarketParameters, years: number): MarketParameters {
    // Longer time periods may have different risk characteristics
    const timeAdjustment = Math.min(1.2, 1 + (years - 10) * 0.01);
    
    return {
      ...params,
      standardDeviation: params.standardDeviation * timeAdjustment,
      crashProbability: params.crashProbability ? params.crashProbability * 0.8 : undefined // Less frequent over longer periods
    };
  }
  
  // Create custom scenario based on user inputs
  static createCustomScenario(
    expectedReturn: number,
    riskLevel: 'low' | 'medium' | 'high',
    inflationExpectation?: number
  ): MarketParameters {
    const riskMultipliers = {
      low: 0.6,
      medium: 1.0,
      high: 1.5
    };
    
    const baseVolatility = 0.15 * riskMultipliers[riskLevel];
    
    return {
      averageReturn: expectedReturn,
      standardDeviation: baseVolatility,
      averageInflation: inflationExpectation || 0.025,
      inflationVolatility: 0.015,
      correlationToInflation: -0.2,
      bondReturn: 0.035,
      bondVolatility: 0.04,
      crashProbability: riskLevel === 'high' ? 0.1 : riskLevel === 'medium' ? 0.06 : 0.03,
      crashMagnitude: riskLevel === 'high' ? 0.3 : riskLevel === 'medium' ? 0.2 : 0.15
    };
  }
}