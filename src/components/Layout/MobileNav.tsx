import { Link, useLocation } from "react-router-dom"
import { BiSolidDashboard } from "react-icons/bi";
import { HiAcademicCap, HiChartPie } from "react-icons/hi2";
import { MenuBook } from "@mui/icons-material";
import { PiBooksFill } from "react-icons/pi";
import { Typography } from "@mui/material";
import { usePermissions } from "../../hooks/usePermissions";

export default function MobileNav() {
  const location = useLocation();
  const { hasPermission } = usePermissions()
  
  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col px-2 rounded gap-1 transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-100 text-blue-700 border-t-4 border-blue-500' 
        : 'hover:bg-gray-100 text-black'
    }`;
  };

  const getTypographyColor = (path: string) => {
    const isActive = location.pathname === path;
    return isActive ? '#1d4ed8' : 'inherit'; // blue-700 color for active state
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open external link in new tab to avoid breaking React context
    window.open('https://academy.wearenoyack.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <nav id="navigation" className="h-full w-screen shadow-lg py-4 flex bg-white justify-evenly">
      <Link to="/" className={getNavLinkClass('/')}>
        <BiSolidDashboard style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"} sx={{ color: getTypographyColor('/') }}>
          Dashboard
        </Typography>
      </Link>
      
      <Link to="/tools" className={getNavLinkClass('/tools')}>
        <HiChartPie style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"} sx={{ color: getTypographyColor('/tools') }}>
          Tools
        </Typography>
      </Link>
      
      <Link to="/wealthview" className={getNavLinkClass('/wealthview')}>
        <MenuBook style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"} sx={{ color: getTypographyColor('/wealthview') }}>
          Wealth
        </Typography>
      </Link>
      
      
      {
        hasPermission("academy","access")?
        <button 
        onClick={handleExternalLink}
        className="flex flex-col px-2 hover:bg-gray-100 rounded gap-1 text-black"
        >
        <HiAcademicCap style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Academy
        </Typography>
      </button>
      :
      <Link to="/library" className={getNavLinkClass('/library')}>
        <PiBooksFill style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"} sx={{ color: getTypographyColor('/library') }}>
          Library
        </Typography>
      </Link>
      }
    </nav>
  );
}