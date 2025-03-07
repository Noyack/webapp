import { useState } from 'react';
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

const FIRECalculator = () => {
  // ----------------------------
  // INPUT STATES
  // ----------------------------
  const [currentAge, setCurrentAge] = useState(30);
  const [desiredRetirementAge, setDesiredRetirementAge] = useState(45);
  const [endAge, setEndAge] = useState(65);

  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [preTaxSalary, setPreTaxSalary] = useState(100000);
  const [postTaxSalary, setPostTaxSalary] = useState(80000);

  // Distinguish between current spending and desired retirement spending
  const [currentAnnualSpending, setCurrentAnnualSpending] = useState(40000);
  const [desiredRetirementSpending, setDesiredRetirementSpending] = useState(40000);

  // Asset allocations
  const [stocksAllocation, setStocksAllocation] = useState(90);  // in %
  const [bondsAllocation, setBondsAllocation] = useState(5);     // in %
  const [cashAllocation, setCashAllocation] = useState(1);       // in %
  const [otherAllocation, setOtherAllocation] = useState(4);     // in %

  // Expected returns for each asset class (nominal)
  const [stocksReturn, setStocksReturn] = useState(8);   // in %
  const [bondsReturn, setBondsReturn] = useState(5);     // in %
  const [cashReturn, setCashReturn] = useState(0.5);     // in %
  const [otherReturn, setOtherReturn] = useState(1.5);   // in %

  // Other assumptions
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(4);  // e.g., 4%
  const [inflationRate, setInflationRate] = useState(3);            // e.g., 3%
  const [company401kMatch, setCompany401kMatch] = useState(1);      // e.g., 1% of salary
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(2);      // e.g., 2% yearly
  const [socialSecurity, setSocialSecurity] = useState(0);          // placeholder

  // ----------------------------
  // RESULT STATES
  // ----------------------------
  const [fireNumber, setFireNumber] = useState(0);
  const [fireAge, setFireAge] = useState<number | null>(null);
  const [yearsUntilFire, setYearsUntilFire] = useState<number | null>(null);

  const [chartData, setChartData] = useState<Array<{ age: number; netWorth: number }>>([]);

  // ----------------------------
  // CALCULATION FUNCTION
  // ----------------------------
  const calculateFIRE = () => {
    // 1) Validate total allocations = 100%
    const totalAllocation = stocksAllocation + bondsAllocation + cashAllocation + otherAllocation;
    if (totalAllocation !== 100) {
      alert("Your asset allocations must sum to 100%.");
      return;
    }

    // 2) Calculate weighted average return (nominal, before inflation)
    const weightedReturn =
      (stocksAllocation / 100) * stocksReturn +
      (bondsAllocation / 100) * bondsReturn +
      (cashAllocation / 100) * cashReturn +
      (otherAllocation / 100) * otherReturn;

    // 3) Convert to real return (subtract inflation)
    const realReturn = ((1 + weightedReturn / 100) / (1 + inflationRate / 100) - 1) * 100;

    // 4) Calculate annual savings while working
    //    (postTaxSalary - currentAnnualSpending) + 401k match 
    const annual401kMatch = (company401kMatch / 100) * preTaxSalary;
    let annualSavings = (postTaxSalary - currentAnnualSpending) + annual401kMatch;
    if (annualSavings < 0) {
      annualSavings = 0; // can't save negative
    }

    // 5) Calculate the FIRE number based on the *desired* retirement spending
    //    = desiredRetirementSpending / (safeWithdrawalRate / 100)
    //    e.g., with a 4% SWR => desiredRetirementSpending / 0.04
    const requiredFireNumber = desiredRetirementSpending / (safeWithdrawalRate / 100);
    setFireNumber(Math.round(requiredFireNumber));

    // 6) Project net worth growth year by year until endAge or until netWorth >= FIRE number
    let currentNW = currentNetWorth;
    let age = currentAge;
    const projectionData = [{ age, netWorth: currentNW }];

    let foundFire = false;
    let fireAchievedAge = null;

    while (age < endAge) {
      age += 1;
      // Increase salary each year by incomeGrowthRate
      const nextYearSalary = postTaxSalary * Math.pow(1 + incomeGrowthRate / 100, age - currentAge);
      const nextYear401kMatch = (company401kMatch / 100) * (preTaxSalary * Math.pow(1 + incomeGrowthRate / 100, age - currentAge));

      // Recalculate annual savings each year (still using currentAnnualSpending until retirement)
      let nextYearSavings = (nextYearSalary - currentAnnualSpending) + nextYear401kMatch;
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

    setChartData(projectionData);

    if (foundFire && fireAchievedAge) {
      setFireAge(fireAchievedAge);
      setYearsUntilFire(fireAchievedAge - currentAge);
    } else {
      // If never found, you won't achieve FIRE by endAge
      setFireAge(null);
      setYearsUntilFire(null);
    }
  };

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
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={desiredRetirementAge}
                onChange={(e) => setDesiredRetirementAge(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={endAge}
                onChange={(e) => setEndAge(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={currentNetWorth}
                onChange={(e) => setCurrentNetWorth(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={preTaxSalary}
                onChange={(e) => setPreTaxSalary(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={postTaxSalary}
                onChange={(e) => setPostTaxSalary(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={currentAnnualSpending}
                onChange={(e) => setCurrentAnnualSpending(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={desiredRetirementSpending}
                onChange={(e) => setDesiredRetirementSpending(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-green-500"
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
                value={stocksAllocation}
                onChange={(e) => setStocksAllocation(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={stocksReturn}
                onChange={(e) => setStocksReturn(Number(e.target.value))}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Bonds (%)</label>
              <input
                type="number"
                value={bondsAllocation}
                onChange={(e) => setBondsAllocation(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={bondsReturn}
                onChange={(e) => setBondsReturn(Number(e.target.value))}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Cash (%)</label>
              <input
                type="number"
                value={cashAllocation}
                onChange={(e) => setCashAllocation(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={cashReturn}
                onChange={(e) => setCashReturn(Number(e.target.value))}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-24">Other (%)</label>
              <input
                type="number"
                value={otherAllocation}
                onChange={(e) => setOtherAllocation(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
              <label className="text-sm w-20 text-right">Return (%)</label>
              <input
                type="number"
                value={otherReturn}
                onChange={(e) => setOtherReturn(Number(e.target.value))}
                className="w-16 p-1 border-b-2 border-gray-200 focus:border-green-500 text-right"
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
                value={safeWithdrawalRate}
                onChange={(e) => setSafeWithdrawalRate(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Inflation (%)</label>
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">401k Match (%)</label>
              <input
                type="number"
                value={company401kMatch}
                onChange={(e) => setCompany401kMatch(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Income Growth (%)</label>
              <input
                type="number"
                value={incomeGrowthRate}
                onChange={(e) => setIncomeGrowthRate(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-32">Social Security ($)</label>
              <input
                type="number"
                value={socialSecurity}
                onChange={(e) => setSocialSecurity(Number(e.target.value))}
                className="flex-1 p-1 border-b-2 border-gray-200 focus:border-green-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* CALCULATE BUTTON */}
      <button
        onClick={calculateFIRE}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mt-6 flex items-center justify-center"
      >
        <Calculate className="mr-2" />
        Calculate FIRE
      </button>

      {/* RESULTS */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Your FIRE Number</h3>
          <p className="text-2xl mt-2">
            ${fireNumber.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Your FIRE Age</h3>
          <p className="text-2xl mt-2">
            {fireAge ?? "N/A"}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Years Until FIRE</h3>
          <p className="text-2xl mt-2">
            {yearsUntilFire ?? "N/A"}
          </p>
        </div>
      </div>

      {/* CHART */}
      {chartData.length > 1 && (
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                stroke="#16a34a"
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
