// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// // Define the context type
// interface SearchContextType {
//   isPopoverOpen: boolean;
//   openPopover: () => void;
//   closePopover: () => void;
//   query: string;
//   setQuery: (query: string) => void;
// }

// // Create the context with a default value
// const SearchContext = createContext<SearchContextType>({
//   isPopoverOpen: false,
//   openPopover: () => {},
//   closePopover: () => {},
//   query: '',
//   setQuery: () => {},
// });

// // Provider props type
// interface SearchProviderProps {
//   children: ReactNode;
// }

// // Custom hook to use the search context
// // eslint-disable-next-line react-refresh/only-export-components
// export const useSearch = () => useContext(SearchContext);

// // Provider component
// export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [query, setQuery] = useState('');
  
//   const openPopover = () => {
//     setIsPopoverOpen(true);
//   };

//   const closePopover = () => {
//     setIsPopoverOpen(false);
//   };

//   // Effect to handle body scrolling
//   useEffect(() => {
//     if (isPopoverOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
    
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isPopoverOpen]);

//   return (
//     <SearchContext.Provider 
//       value={{
//         isPopoverOpen,
//         openPopover,
//         closePopover,
//         query,
//         setQuery
//       }}
//     >
//       {children}
//     </SearchContext.Provider>
//   );
// };

// export default SearchProvider;