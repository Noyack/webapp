// import { useRef, useState, useEffect } from "react";
// import { useSearch } from "./SearchContext";
// import { createPortal } from "react-dom";

// export const GlobalSearchPopover = () => {
//   const { isPopoverOpen, closePopover, query } = useSearch();
//   const [isAnimating, setIsAnimating] = useState(false);
//   const popoverRef = useRef<HTMLDivElement>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   // Handle animation end
//   const handleAnimationEnd = () => {
//     setIsAnimating(false);
//   };

//   // Begin animation when popover opens or closes
//   useEffect(() => {
//     setIsAnimating(true);
//   }, [isPopoverOpen]);

//   // Close popover when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popoverRef.current && 
//         !popoverRef.current.contains(event.target as Node) &&
//         // Don't close if clicking on the search input (which has a special class)
//         !(event.target as Element).closest('.search-input-container')
//       ) {
//         closePopover();
//       }
//     };

//     // Close on escape key
//     const handleEscKey = (event: KeyboardEvent) => {
//       if (event.key === 'Escape' && isPopoverOpen) {
//         closePopover();
//       }
//     };

//     if (isPopoverOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.addEventListener("keydown", handleEscKey);
//     }
    
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscKey);
//     };
//   }, [isPopoverOpen, closePopover]);

//   // Track if iframe has been loaded
//   const [iframeLoaded, setIframeLoaded] = useState(false);
  
//   // Handle iframe load event
//   const handleIframeLoad = () => {
//     setIframeLoaded(true);
//   };
  
//   // Send query to iframe when it changes
//   useEffect(() => {
//     if (iframeRef.current && isPopoverOpen && iframeLoaded) {
//       try {
//         iframeRef.current.contentWindow?.postMessage({
//           type: 'SEARCH_QUERY',
//           query: query
//         }, '*');
//       } catch (error) {
//         console.error("Failed to communicate with iframe:", error);
//       }
//     }
//   }, [query, isPopoverOpen, iframeLoaded]);

//   // We no longer return null when closed, instead we keep it in the DOM but hide it

//   // Use a portal to render at the root level
//   return createPortal(
//     <div 
//       className="fixed inset-0 bg-[#00000099] z-50 flex items-center justify-center p-4"
//       style={{
//         opacity: isPopoverOpen ? 1 : 0,
//         pointerEvents: isPopoverOpen ? 'auto' : 'none',
//         transition: 'opacity 300ms ease-in-out',
//         visibility: isPopoverOpen || isAnimating ? 'visible' : 'hidden',
//       }}
//     >
//       <div 
//         id="search-popover"
//         ref={popoverRef}
//         className={`relative bg-white rounded-xl shadow-2xl overflow-hidden 
//           transition-all duration-300 ease-in-out w-full max-w-4xl
//           ${isPopoverOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
//         `}
//         style={{ 
//           maxHeight: "calc(100vh - 80px)",
//           transform: isPopoverOpen ? 'translateY(0)' : 'translateY(-20px)',
//         }}
//         onTransitionEnd={handleAnimationEnd}
//         role="dialog"
//         aria-label="Search Assistant"
//       >
//         <div className="relative">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h3 className="text-lg font-medium text-gray-900">Noyack Copilot</h3>
//             <button 
//               onClick={closePopover}
//               className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors"
//               aria-label="Close popover"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           </div>
          
//           <div 
//             className="iframe-container" 
//             style={{ 
//               overflow: "hidden",
//               height: "calc(100vh - 160px)",
//               position: "relative"
//             }}
//           >
//             <iframe 
//               ref={iframeRef}
//               src="https://noyack-copilot.kindrock-2260a423.eastus.azurecontainerapps.io/" 
//               width="100%" 
//               height="100%" 
//               style={{ 
//                 border: "none"
//               }}
//               title="Noyack Copilot"
//               onLoad={handleIframeLoad}
//               loading="lazy"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default GlobalSearchPopover;