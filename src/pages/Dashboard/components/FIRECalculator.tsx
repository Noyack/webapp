import { useState, ChangeEvent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  AttachMoney,
  Calculate,
  Timeline,
  AccountBalance,
  Payments
} from "@mui/icons-material";
import {
  FireCalculatorState,
  FireCalculatorProps,
  AgeNetWorthDataPoint
} from '../../../types'; // Import types

const FIRECalculator = ({ defaultValues, onCalculate }: FireCalculatorProps = {}) => {
  // State with proper typing
  const [state, setState] = useState<FireCalculatorState>({
    // Age parameters
    currentAge: defaultValues?.currentAge ?? 30,
    desiredRetirementAge: defaultValues?.desiredRetirementAge ?? 45,
    endAge: defaultValues?.endAge ?? 65,
    
    // Financial parameters
    currentNetWorth: defaultValues?.currentNetWorth ?? 100000,
    preTaxSalary: defaultValues?.preTaxSalary ?? 100000,
    postTaxSalary: defaultValues?.postTaxSalary ?? 80000,
    currentAnnualSpending: defaultValues?.currentAnnualSpending ?? 40000,
    desiredRetirementSpending: defaultValues?.desiredRetirementSpending ?? 40000,
    
    // Asset allocation
    stocksAllocation: defaultValues?.stocksAllocation ?? 90,
    bondsAllocation: defaultValues?.bondsAllocation ?? 5,
    cashAllocation: defaultValues?.cashAllocation ?? 1,
    otherAllocation: defaultValues?.otherAllocation ?? 4,
    
    // Expected returns
    stocksReturn: defaultValues?.stocksReturn ?? 8,
    bondsReturn: defaultValues?.bondsReturn ?? 5,
    cashReturn: defaultValues?.cashReturn ?? 0.5,
    otherReturn: defaultValues?.otherReturn ?? 1.5,
    
    // Other assumptions
    safeWithdrawalRate: defaultValues?.safeWithdrawalRate ?? 4,
    inflationRate: defaultValues?.inflationRate ?? 3,
    company401kMatch: defaultValues?.company401kMatch ?? 1,
    incomeGrowthRate: defaultValues?.incomeGrowthRate ?? 2,
    socialSecurity: defaultValues?.socialSecurity ?? 0,
    
    // Calculation results
    fireNumber: 0,
    fireAge: null,
    yearsUntilFire: null,
    chartData: []
  });

  // Helper function to update state with type safety
  const updateState = <K extends keyof FireCalculatorState>(
    key: K, 
    value: FireCalculatorState[K]
  ) => {
    setState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle number input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof FireCalculatorState) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      updateState(fieldName, value);
    }
  };

  // Calculate FIRE
  const calculateFIRE = () => {
    // 1) Validate total allocations = 100%
    const totalAllocation = state.stocksAllocation + 
                           state.bondsAllocation + 
                           state.cashAllocation + 
                           state.otherAllocation;
                           
    if (totalAllocation !== 100) {
      alert("Your asset allocations must sum to 100%.");
      return;
    }

    // 2) Calculate weighted average return (nominal, before inflation)
    const weightedReturn =
      (state.stocksAllocation / 100) * state.stocksReturn +
      (state.bondsAllocation / 100) * state.bondsReturn +
      (state.cashAllocation / 100) * state.cashReturn +
      (state.otherAllocation / 100) * state.otherReturn;

    // 3) Convert to real return (subtract inflation)
    const realReturn = ((1 + weightedReturn / 100) / (1 + state.inflationRate / 100) - 1) * 100;

    // 4) Calculate annual savings while working
    const annual401kMatch = (state.company401kMatch / 100) * state.preTaxSalary;
    let annualSavings = (state.postTaxSalary - state.currentAnnualSpending) + annual401kMatch;
    if (annualSavings < 0) {
      annualSavings = 0; // can't save negative
    }

    // 5) Calculate the FIRE number based on the desired retirement spending
    const requiredFireNumber = state.desiredRetirementSpending / (state.safeWithdrawalRate / 100);
    
    // 6) Project net worth growth year by year until endAge or until netWorth >= FIRE number
    let currentNW = state.currentNetWorth;
    let age = state.currentAge;
    const projectionData: AgeNetWorthDataPoint[] = [{ age, netWorth: currentNW }];

    let foundFire = false;
    let fireAchievedAge = null;

    while (age < state.endAge) {
      age += 1;
      // Increase salary each year by incomeGrowthRate
      const nextYearSalary = state.postTaxSalary * 
                             Math.pow(1 + state.incomeGrowthRate / 100, age - state.currentAge);
      const nextYear401kMatch = (state.company401kMatch / 100) * 
                                (state.preTaxSalary * 
                                Math.pow(1 + state.incomeGrowthRate / 100, age - state.currentAge));

      // Recalculate annual savings each year
      let nextYearSavings = (nextYearSalary - state.currentAnnualSpending) + nextYear401kMatch;
      if (nextYearSavings < 0) nextYearSavings = 0;

      // Grow net worth by real return
      currentNW = currentNW * (1 + realReturn / 100) + nextYearSavings;
      projectionData.push({ age, netWorth: currentNW });

      // Check if net worth has reached the FIRE number
      if (!foundFire && currentNW >= requiredFireNumber) {
        foundFire = true;
        fireAchievedAge = age;
        break;
      }
    }

    // Update state with results
    setState(prev => ({
      ...prev,
      fireNumber: Math.round(requiredFireNumber),
      fireAge: fireAchievedAge,
      yearsUntilFire: fireAchievedAge ? fireAchievedAge - state.currentAge : null,
      chartData: projectionData
    }));

    // Notify parent component if callback provided
    if (onCalculate) {
      onCalculate({
        fireNumber: Math.round(requiredFireNumber),
        fireAge: fireAchievedAge,
        yearsUntilFire: fireAchievedAge ? fireAchievedAge - state.currentAge : null,
        chartData: projectionData
      });
    }
  };

  // Render the component (UI remains largely unchanged)
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <AccountBalance className="text-green-600" />
        <h2 className="text-xl font-bold">FIRE Calculator</h2>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-2 gap-8">
        {/* LEFT COLUMN: INPUTS */}
        <div className="space-y-6">
          {/* Current Age */}
          <div className="flex items-center gap-3">
            <Timeline className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Current Age</label>
              <input
                type="number"
                value={state.currentAge}
                onChange={(e) => handleInputChange(e, 'currentAge')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Current age"
              />
            </div>
          </div>

          {/* Desired Retirement Age */}
          <div className="flex items-center gap-3">
            <Timeline className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Desired Retirement Age</label>
              <input
                type="number"
                value={state.desiredRetirementAge}
                onChange={(e) => handleInputChange(e, 'desiredRetirementAge')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Desired retirement age"
              />
            </div>
          </div>

          {/* End Age (final projection age) */}
          <div className="flex items-center gap-3">
            <Timeline className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">End Age</label>
              <input
                type="number"
                value={state.endAge}
                onChange={(e) => handleInputChange(e, 'endAge')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="End age for projection"
              />
            </div>
          </div>

          {/* Current Net Worth */}
          <div className="flex items-center gap-3">
            <AccountBalance className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Current Net Worth ($)</label>
              <input
                type="number"
                value={state.currentNetWorth}
                onChange={(e) => handleInputChange(e, 'currentNetWorth')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Current net worth"
              />
            </div>
          </div>

          {/* Pre-tax Salary */}
          <div className="flex items-center gap-3">
            <Payments className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Pre-tax Salary ($)</label>
              <input
                type="number"
                value={state.preTaxSalary}
                onChange={(e) => handleInputChange(e, 'preTaxSalary')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Pre-tax salary"
              />
            </div>
          </div>

          {/* Post-tax Salary */}
          <div className="flex items-center gap-3">
            <Payments className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Post-tax Salary ($)</label>
              <input
                type="number"
                value={state.postTaxSalary}
                onChange={(e) => handleInputChange(e, 'postTaxSalary')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Post-tax salary"
              />
            </div>
          </div>

          {/* Current Annual Spending */}
          <div className="flex items-center gap-3">
            <AttachMoney className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Current Annual Spending ($)</label>
              <input
                type="number"
                value={state.currentAnnualSpending}
                onChange={(e) => handleInputChange(e, 'currentAnnualSpending')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Current annual spending"
              />
            </div>
          </div>

          {/* Desired Retirement Annual Spending */}
          <div className="flex items-center gap-3">
            <AttachMoney className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Desired Retirement Spending ($)</label>
              <input
                type="number"
                value={state.desiredRetirementSpending}
                onChange={(e) => handleInputChange(e, 'desiredRetirementSpending')}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Desired retirement spending"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MORE INPUTS + RESULTS */}
        <div className="space-y-6">
          {/* ASSET ALLOCATION */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h3 className="text-md font-semibold mb-2">Asset Allocation</h3>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Stocks (%)</label>
              <input
                type="number"
                value={state.stocksAllocation}
                onChange={(e) => handleInputChange(e, 'stocksAllocation')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Stocks allocation percentage"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={state.stocksReturn}
                onChange={(e) => handleInputChange(e, 'stocksReturn')}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
                aria-label="Stocks expected return percentage"
              />
            </div>

            {/* ... Similar inputs for bonds, cash, and other allocations ... */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Bonds (%)</label>
              <input
                type="number"
                value={state.bondsAllocation}
                onChange={(e) => handleInputChange(e, 'bondsAllocation')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Bonds allocation percentage"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={state.bondsReturn}
                onChange={(e) => handleInputChange(e, 'bondsReturn')}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
                aria-label="Bonds expected return percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Cash (%)</label>
              <input
                type="number"
                value={state.cashAllocation}
                onChange={(e) => handleInputChange(e, 'cashAllocation')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Cash allocation percentage"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={state.cashReturn}
                onChange={(e) => handleInputChange(e, 'cashReturn')}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
                aria-label="Cash expected return percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Other (%)</label>
              <input
                type="number"
                value={state.otherAllocation}
                onChange={(e) => handleInputChange(e, 'otherAllocation')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Other assets allocation percentage"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={state.otherReturn}
                onChange={(e) => handleInputChange(e, 'otherReturn')}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
                aria-label="Other assets expected return percentage"
              />
            </div>
          </div>

          {/* OTHER ASSUMPTIONS */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h3 className="text-md font-semibold mb-2">Other Assumptions</h3>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">SWR (%)</label>
              <input
                type="number"
                value={state.safeWithdrawalRate}
                onChange={(e) => handleInputChange(e, 'safeWithdrawalRate')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Safe withdrawal rate percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Inflation (%)</label>
              <input
                type="number"
                value={state.inflationRate}
                onChange={(e) => handleInputChange(e, 'inflationRate')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Inflation rate percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">401k Match (%)</label>
              <input
                type="number"
                value={state.company401kMatch}
                onChange={(e) => handleInputChange(e, 'company401kMatch')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="401k match percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Income Growth (%)</label>
              <input
                type="number"
                value={state.incomeGrowthRate}
                onChange={(e) => handleInputChange(e, 'incomeGrowthRate')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Income growth rate percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Social Security ($)</label>
              <input
                type="number"
                value={state.socialSecurity}
                onChange={(e) => handleInputChange(e, 'socialSecurity')}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
                aria-label="Social Security amount"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CALCULATE BUTTON */}
      <button
        onClick={calculateFIRE}
        className="w-full bg-[#2E7D32] text-white py-3 rounded-lg hover:bg-green-700 mt-6 flex items-center justify-center"
        aria-label="Calculate FIRE results"
      >
        <Calculate className="mr-2" />
        Calculate FIRE
      </button>

      {/* RESULTS */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Your FIRE Number</h3>
          <p className="text-2xl mt-2">
            ${state.fireNumber.toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Your FIRE Age</h3>
          <p className="text-2xl mt-2">
            {state.fireAge ?? "N/A"}
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Years Until FIRE</h3>
          <p className="text-2xl mt-2">
            {state.yearsUntilFire ?? "N/A"}
          </p>
        </div>
      </div>

      {/* CHART */}
      {state.chartData.length > 1 && (
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                label={{ value: "Age", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Net Worth",
                ]}
                labelFormatter={(label) => `Age: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#2E7D32"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* DISCLAIMER */}
      <p className="text-xs text-gray-400 mt-4">
        *This calculator is for illustrative purposes only and does not constitute
        financial advice. Please consult a qualified professional for personalized
        advice.
      </p>
    </div>
  );
};

export default FIRECalculator;