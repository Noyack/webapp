// components/Layout/DesktopLayout.tsx
import { DesktopLayoutProps } from '../../types';
// import GlobalSearchInput from '../Search/GlobalSearchInput';
import UserProfileButton from '../UI/UserProfileButton';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ViewContext } from '../../context/ViewContext';
import MobileNav from './MobileNav';

export default function MobileView({ children }: DesktopLayoutProps) {
  const location = useLocation();
  const { setView } = useContext(ViewContext);
  const learn = ["community", "planning", "bookmark", "wealthview"];
  const invest = ["invest"];
  const path = location.pathname.split('/')[1];
  
  useEffect(() => {
    if (learn.includes(path)) {
      setView({ view: 'Learn' });
    }
    if (invest.includes(path)) {
      setView({ view: 'Invest' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col bg-gray-100 h-[100vh] w-full">
      {/* Header with user profile and notification elements - Fixed at top with safe area */}
      <div className="sticky top-0 z-20 bg-gray-10 backdrop-blur-lg">
        <div className="flex justify-end items-center p-2 w-full">
          <div className="flex content-center gap-2 items-center">
            {/* <div className='flex justify-center items-center bg-white w-[40px] h-[40px] rounded-full shadow-xl'>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M12 24.0002C12 26.2135 13.7867 28.0002 16 28.0002C18.2134 28.0002 20 26.2135 20 24.0002M25.3334 16.0002C25.3334 16.0002 25.3334 1.3335 16 1.3335C6.6667 1.3335 6.6667 16.0002 6.6667 16.0002C3.89337 16.0002 3.04004 19.1735 2.77337 21.1468C2.6667 21.9468 3.3067 22.6668 4.1067 22.6668H27.8934C28.6934 22.6668 29.3334 21.9468 29.2267 21.1468C28.96 19.1735 28.1067 16.0002 25.3334 16.0002Z" stroke="#009FE3" strokeWidth="2.66667"></path>
              </svg>
            </div> */}
            <UserProfileButton />
          </div>
        </div>
      </div>
      
   {/* Main Content Area with top fade effect */}
    <div className="flex-1 overflow-hidden relative">
      {/* Fade overlay at the top */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none z-10"
      style={{
        background: 'linear-gradient(to bottom, rgb(243, 244, 246) 0%, rgba(243, 244, 246, 0.738) 19%, rgba(243, 244, 246, 0.541) 34%, rgba(243, 244, 246, 0.382) 47%, rgba(243, 244, 246, 0.278) 56.5%, rgba(243, 244, 246, 0.194) 65%, rgba(243, 244, 246, 0.126) 73%, rgba(243, 244, 246, 0.075) 80.2%, rgba(243, 244, 246, 0.042) 86.1%, rgba(243, 244, 246, 0.021) 91%, rgba(243, 244, 246, 0.008) 95.2%, rgba(243, 244, 246, 0.002) 98.2%, transparent 100%)'
      }}
      ></div>
      
      {/* Scrollable content */}
      <div className="mainCont h-full overflow-auto">
        <main className="px-5 ">
          <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-4">
            <div className="search-input-container">
              {/* <GlobalSearchInput /> */}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
      
      {/* Mobile Navigation - Fixed at bottom with safe area */}
      <div className="sticky bottom-0 z-20 bg-gray-100 pb-safe-bottom">
        <div className="h-[75px] w-full">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}