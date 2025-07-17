import BoxCard from '../../../components/UI/BoxCard'
import { useState } from 'react';
import { AccessTime, AttachMoney, Calculate, Savings } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RetiermentCalc = () => {

    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
    const [years, setYears] = useState(10);
    const [result, setResult] = useState<number | null>(null);
    const [chartData, setChartData] = useState<Array<{ year: number; value: number }>>([]);

    const calculateRetirement = () => {
        const annualReturn = 0.07;
        const monthlyRate = annualReturn / 12;
        const monthsTotal = years * 12;
        
        // Calculate full projection
        const futureValue = 
            initialInvestment * Math.pow(1 + annualReturn, years) +
            monthlyInvestment * (Math.pow(1 + monthlyRate, monthsTotal) - 1) / monthlyRate;

        // Generate yearly data points
        const yearlyData = [];
        for (let year = 1; year <= years; year++) {
            const yearMonths = year * 12;
            const yearValue = 
                initialInvestment * Math.pow(1 + annualReturn, year) +
                monthlyInvestment * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
            
            yearlyData.push({
                year: year,
                value: Math.round(yearValue)
            });
        }

        setResult(futureValue);
        setChartData(yearlyData);
    };

    const formatCurrency = (value: number) => {
        if (value >= 3000) {
            return `$${(value / 1000).toFixed(1)}k`; // Shows as $1.5k, $2.5k, etc.
        }
        return `$${Math.round(value).toLocaleString()}`; // Shows as $100, $2,500
    };

    // Dynamic Y-axis tick calculation
    const getYTicks = (data: Array<{ value: number }>) => {
        const maxValue = Math.max(...data.map(d => d.value), 0);
        if (maxValue === 0) return [0];
        
        const step = maxValue >= 3000 ? 
            Math.ceil(maxValue / 5000) * 1000 : // Steps in thousands
            Math.ceil(maxValue / 500) * 100;    // Steps in hundreds
        
        return Array.from(
            { length: Math.ceil(maxValue / step) + 1 }, 
            (_, i) => i * step
        );
    };



  return (
    <BoxCard height={20} width={100}>
    <div>
      <div className="flex justify-center items-center gap-3 mb-2 p-5">
        <Savings className="text-green-600" />
        <h2 className="text-xl font-bold ">NOYACK Retirement Calculator</h2>
      </div>
    
      <div className="flex flex-wrap p-5 justify-evenly gap-8">
        {/* Left Column */}
        <div className="w-1.4/3 space-y-4">
          <div className="flex items-center gap-3">
            <AttachMoney className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Initial Investment</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-[#2E7D32]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AttachMoney className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Monthly Recurring</label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-[#2E7D32]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AccessTime className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm text-gray-600">Duration</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full p-2 border-b-2 border-gray-200 focus:border-[#2E7D32]"
              />
            </div>
          </div>

          
        </div>

        {/* Right Column */}
        <div className=" w-1.4/3 space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            If you'd initially invested ${initialInvestment.toLocaleString()} 
            and ${monthlyInvestment.toLocaleString()} recurring monthly investments...
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[12, 22].map((months) => (
              <div key={months} className="p-4 border rounded-lg">
                <div className="text-lg font-bold text-[#2E7D32]">
                  ${((initialInvestment + monthlyInvestment * months)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{months} months</div>
              </div>
            ))}
          </div>

          <button
            onClick={calculateRetirement}
            className="w-full bg-[#2E7D32] text-white py-3 rounded-lg hover:bg-[#304d2c] cursor-pointer
                     flex items-center justify-center gap-2"
          >
            <Calculate />
            Calculate Full Projection
          </button>

          {result && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold">
                Projected Value: ${result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                After {years} years at 7% annual return
              </div>
            </div>
          )}
        </div>
        </div>
        {result && <div className="w-full p-5 min-h-30 mt-6 h-64">
            <ResponsiveContainer width="90%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="year" 
                        label={{ 
                            value: 'Years', 
                            position: 'bottom', 
                            fontSize: 14 
                        }}
                    />
                    <YAxis
                        domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                        ticks={getYTicks(chartData)}
                        tickFormatter={(value) => formatCurrency(value)}
                        label={{ 
                            value: 'Investment Value', 
                            angle: -90, 
                            position: 'left', 
                            fontSize: 14 
                        }}
                    />
                    <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Value']}
                        labelFormatter={(label) => `Year ${label}`}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#16a34a" 
                        strokeWidth={2}
                        dot={{ fill: '#16a34a', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>}
        </div>
    </BoxCard>
  )
}

export default RetiermentCalc


