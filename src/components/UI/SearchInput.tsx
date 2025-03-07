import { useState } from "react";
import Logo from '../../assets/N-Transparent-Background.png'

export const DashboardSearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", query);
  };

  return (
    <div className="w-3/4 max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <img src={Logo} className="w-6 h-6"/>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about Financial Wealth"
          className="w-full pl-10 pr-6 py-4 rounded-full border
          bg-white shadow-lg
           border-gray-200 focus:border-green-500 focus:ring-1
            focus:ring-green-500 placeholder-gray-400 text-gray-700 transition-all
            "
        />
      </form>
    </div>
  );
};