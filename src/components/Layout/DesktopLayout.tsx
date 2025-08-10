// components/Layout/DesktopLayout.tsx
import Navbar from './Navbar';
import { DesktopLayoutProps } from '../../types';
// import GlobalSearchInput from '../Search/GlobalSearchInput';
import UserProfileButton from '../UI/UserProfileButton';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ViewContext } from '../../context/ViewContext';
import { Box, Typography } from '@mui/material';


export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const location = useLocation()
  const {setView} = useContext(ViewContext)
  const learn = ["community", "planning", "bookmark", "wealthview"]
  const invest = ["invest", "account", "funding", "wallet"]
  const path = location.pathname.split('/')[1]

  useEffect(()=>{

    if(learn.includes(path)){
      setView({view:'Learn'})
    }
    if(invest.includes(path)){
      setView({view:'Invest'})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location.pathname])
  return (
      <div className="min-h-screen grid grid-cols-[226px_1fr] bg-gray-100 ">
        <Box bgcolor={"#1C398E"} position={"absolute"} top={0} left={0} width={"100dvw"}
          className="sticky top-0 z-1 bg-gray-10 backdrop-blur-lg"
        >
          <Typography fontSize={14} color='#fff' textAlign={'center'}>Noyack is currently in Beta, you currently have full access to the platform</Typography>
        </Box>
        {/* Left Navbar - Fixed width */}
        <div className="h-screen sticky top-0 w-fit z-2">
          <Navbar />
        </div>
        
        {/* Main Content - Flexible middle column */}
        <main className="mainCont overflow-y-auto h-screen py-6 px-5 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="search-input-container">
            {/* <GlobalSearchInput /> */}
          </div>
            {children}
            <div className="flex  content-center gap-2 items-center  fixed top-2 right-0 z-2">
                  {/* <div className='flex justify-center items-center bg-white w-[40px] h-[40px] rounded-full shadow-xl'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" fill="none">
                          <path d="M12 24.0002C12 26.2135 13.7867 28.0002 16 28.0002C18.2134 28.0002 20 26.2135 20 24.0002M25.3334 16.0002C25.3334 16.0002 25.3334 1.3335 16 1.3335C6.6667 1.3335 6.6667 16.0002 6.6667 16.0002C3.89337 16.0002 3.04004 19.1735 2.77337 21.1468C2.6667 21.9468 3.3067 22.6668 4.1067 22.6668H27.8934C28.6934 22.6668 29.3334 21.9468 29.2267 21.1468C28.96 19.1735 28.1067 16.0002 25.3334 16.0002Z" stroke="#009FE3" strokeWidth="2.66667"></path>
                      </svg>
                  </div> */}
                  <UserProfileButton />
              </div>
          </div>
        </main>
      </div>
  );
}