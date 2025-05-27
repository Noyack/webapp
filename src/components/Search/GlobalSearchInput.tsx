// import { useRef } from "react";
// import Logo from '../../assets/N-Transparent-Background.png';
// import { useSearch } from "./SearchContext";

// export const GlobalSearchInput = () => {
//   const { query, setQuery, isPopoverOpen, openPopover } = useSearch();
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Handle search form submission
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Searching for:", query);
//   };

//   return (
//     <div className="w-3/4 max-w-2xl">
//       <form onSubmit={handleSearch} className="relative">
//         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//           <img src={Logo} className="w-6 h-6" alt="Noyack Logo" />
//         </div>
//         <input
//           ref={searchInputRef}
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onFocus={openPopover}
//           placeholder="Ask me anything about Financial Wealth"
//           className="w-full pl-15 pr-6 py-4 rounded-full border
//           bg-white shadow-lg
//           border-gray-200 focus:border-green-500 focus:ring-1
//           focus:ring-green-500 placeholder-gray-400 text-gray-700 transition-all"
//           aria-expanded={isPopoverOpen}
//           aria-controls="search-popover"
//         />
//       </form>
//     </div>
//   );
// };

// export default GlobalSearchInput;