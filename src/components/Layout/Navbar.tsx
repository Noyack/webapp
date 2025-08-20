import { Link, useLocation } from "react-router-dom"
import Logo from '../../assets/Logo.svg'
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BiSolidCalendarEvent, BiSolidDashboard } from "react-icons/bi";
import { HiAcademicCap, HiChartPie } from "react-icons/hi2";
import { RiAccountBoxFill } from "react-icons/ri";
import { MenuBook } from "@mui/icons-material";
import ViewToggle from "../UI/NavToggle";
import { useContext } from "react";
import { ViewContext } from "../../context/ViewContext";
import { PiBooksFill } from "react-icons/pi";
import { IoWallet } from "react-icons/io5";
import { RiRefund2Fill } from "react-icons/ri";
import { usePermissions } from "../../hooks/usePermissions";

function LearnNav() {
  const { hasPermission } = usePermissions();
  const location = useLocation();
  
  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex p-2 rounded gap-1 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-900 text-white border-r-4 border-blue-500' 
        : 'hover:bg-gray-100 text-black'
    }`;
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open external link in new tab to avoid breaking React context
    window.open('https://academy.wearenoyack.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-2 flex flex-col gap-5">
      <Link to="/" className={getNavLinkClass('/')}>
        <BiSolidDashboard style={{width:28, height:28}} />
        Dashboard
      </Link>
      <Link to="/tools" className={getNavLinkClass('/tools')}>
        <HiChartPie style={{width:28, height:28}} />
        Tools
      </Link>
      <Link to="/events" className={getNavLinkClass('/events')}>
        <BiSolidCalendarEvent style={{width:28, height:28}} />
        Events
      </Link>
      <Link to="/library" className={getNavLinkClass('/library')}>
        <PiBooksFill style={{width:28, height:28}} />
        Library
      </Link>
      {hasPermission("academy", "access") ? (
        <button 
          onClick={handleExternalLink}
          className="flex p-2 hover:bg-gray-100 rounded gap-1 text-black text-left"
        >
          <HiAcademicCap style={{width:28, height:28}} />
          Academy
        </button>
      ):
      (
        <button 
          className="flex p-2 hover:bg-gray-100 rounded gap-1 text-gray-500 cursor-not-allowed text-left"
        >
          <HiAcademicCap style={{width:28, height:28}} />
          Academy
        </button>
      )}
    </div>
  )
}

function InvestNav() {
  const location = useLocation();
  
  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex p-2 rounded gap-1 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-900 text-white border-r-4 border-blue-500' 
        : 'hover:bg-gray-100 text-black'
    }`;
  };

  return (
    <div className="space-y-2 flex flex-col gap-5">
      <Link to="/" className={getNavLinkClass('/')}>
        <BiSolidDashboard style={{width:28, height:28}} />
        Dashboard
      </Link>
      <Link to="/wallet" className={getNavLinkClass('/wallet')}>
        <IoWallet style={{width:28, height:28}} />
        Wallet
      </Link>
      <Link to="/invest" className={getNavLinkClass('/invest')}>
        <FaMoneyBillTransfer style={{width:28, height:28}} />
        Invest
      </Link>
      <Link to="/funding" className={getNavLinkClass('/funding')}>
        <RiRefund2Fill style={{width:28, height:28}} />
        IRA Funding
      </Link>
    </div>
  )
}

export default function Navbar() {
  const { view } = useContext(ViewContext)
  const { hasPermission } = usePermissions()
  const location = useLocation();

  const myview = view.view 
  
  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex p-2 rounded gap-1 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-900 text-white border-r-4 border-blue-500' 
        : 'hover:bg-gray-100 text-black'
    }`;
  };

  return (
    <nav id="navigation" className="fixed left-0 top-0 h-screen w-[226px] shadow-lg p-4 flex flex-col gap-10 bg-white text-[#5D5D5D]">
      {/* Logo */}
      <div className="">
        <Link to="/" className="text-2xl font-bold text-primary flex justify-center py-5">
          <img src={Logo} className="w-[150px]"/>
        </Link>
      </div>
      
      {hasPermission("investor", "access") && (
        <div className="flex justify-center">
          <ViewToggle />
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col h-full justify-between">
        {myview === "Learn" && <LearnNav />}
        {hasPermission("investor", "access") && (
          myview === "Invest" && <InvestNav />
        )}
        
        <div>
          <Link to="/wealthview" className={getNavLinkClass('/wealthview')}>
            <MenuBook style={{width:28, height:28}} />
            Wealth Profile
          </Link>
          <Link to="/support" className={getNavLinkClass('/support')}>
            <svg width="28" height="28" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1667 25.3334H15.8333C12.6778 25.3334 10 24.2334 7.8 22.0334C5.6 19.8334 4.5 17.1556 4.5 14.0001C4.5 10.8445 5.6 8.16675 7.8 5.96675C10 3.76675 12.6778 2.66675 15.8333 2.66675C17.4111 2.66675 18.8836 2.96097 20.2507 3.54941C21.6178 4.13786 22.8178 4.94897 23.8507 5.98275C24.8836 7.01653 25.6942 8.21653 26.2827 9.58275C26.8711 10.949 27.1658 12.4214 27.1667 14.0001C27.1667 16.9779 26.3276 19.7445 24.6493 22.3001C22.9711 24.8556 20.8547 26.8556 18.3 28.3001C18.0778 28.4112 17.8556 28.4725 17.6333 28.4841C17.4111 28.4956 17.2111 28.4454 17.0333 28.3334C16.8556 28.2214 16.7 28.077 16.5667 27.9001C16.4333 27.7232 16.3556 27.5121 16.3333 27.2668L16.1667 25.3334ZM15.8 21.3001C16.1778 21.3001 16.5 21.1667 16.7667 20.9001C17.0333 20.6334 17.1667 20.3112 17.1667 19.9334C17.1667 19.5556 17.0333 19.2334 16.7667 18.9667C16.5 18.7001 16.1778 18.5667 15.8 18.5667C15.4222 18.5667 15.1 18.7001 14.8333 18.9667C14.5667 19.2334 14.4333 19.5556 14.4333 19.9334C14.4333 20.3112 14.5667 20.6334 14.8333 20.9001C15.1 21.1667 15.4222 21.3001 15.8 21.3001ZM12.9 11.1667C13.1444 11.2779 13.3889 11.2836 13.6333 11.1841C13.8778 11.0845 14.0778 10.9232 14.2333 10.7001C14.4333 10.4334 14.6667 10.2276 14.9333 10.0827C15.2 9.93786 15.5 9.86586 15.8333 9.86675C16.3667 9.86675 16.8 10.0165 17.1333 10.3161C17.4667 10.6156 17.6333 10.9992 17.6333 11.4667C17.6333 11.7556 17.5502 12.0445 17.384 12.3334C17.2178 12.6223 16.9231 12.9779 16.5 13.4001C15.9444 13.889 15.5333 14.3503 15.2667 14.7841C15 15.2179 14.8667 15.6565 14.8667 16.1001C14.8667 16.3667 14.9613 16.5947 15.1507 16.7841C15.34 16.9734 15.5676 17.0676 15.8333 17.0667C16.0991 17.0659 16.3213 16.9659 16.5 16.7667C16.6787 16.5676 16.812 16.3343 16.9 16.0667C17.0111 15.689 17.2111 15.3445 17.5 15.0334C17.7889 14.7223 18.0556 14.4445 18.3 14.2001C18.7667 13.7334 19.1169 13.2667 19.3507 12.8001C19.5844 12.3334 19.7009 11.8667 19.7 11.4001C19.7 10.3779 19.3498 9.55564 18.6493 8.93341C17.9489 8.31119 17.0102 8.00008 15.8333 8.00008C15.1222 8.00008 14.4667 8.17253 13.8667 8.51742C13.2667 8.8623 12.7778 9.3343 12.4 9.93341C12.2667 10.1779 12.2498 10.417 12.3493 10.6507C12.4489 10.8845 12.6324 11.0565 12.9 11.1667Z" fill="currentColor"/>
            </svg>
            Support
          </Link>
        </div>
      </div>
    </nav>
  );
}