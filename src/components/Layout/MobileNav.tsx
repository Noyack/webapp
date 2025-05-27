import { Link } from "react-router-dom"
import { BiSolidDashboard } from "react-icons/bi";
import { HiAcademicCap, HiChartPie } from "react-icons/hi2";
import { MenuBook } from "@mui/icons-material";
import { PiBooksFill } from "react-icons/pi";
import { Typography } from "@mui/material";


export default function MobileNav() {
  return (
    <nav id="navigation" className="h-full w-screen shadow-lg py-4 flex bg-white text-[#000] justify-evenly">
      {/* <div className="flex justify-center">
        <ViewToggle />
      </div> */}
      {/* Navigation Links */}
        <Link to="/" className="flex flex-col hover:bg-gray-100 px-2 rounded gap-1">
        {/* <Dashboard /> */}
        <BiSolidDashboard style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Dashboard
        </Typography>
        </Link>
        <Link to="/tools" className="flex flex-col hover:bg-gray-100 px-2 rounded gap-1">
        {/* <MonetizationOn /> */}
        <HiChartPie style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Tools
        </Typography>
        </Link>
        <Link to="/wealthview" className="flex flex-col hover:bg-gray-100 px-2 rounded gap-1">
        {/* <Article /> */}
        <MenuBook style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Wealth
        </Typography>
      </Link>
        <Link to="/library" className="flex flex-col hover:bg-gray-100 px-2 rounded gap-1">
        {/* <Article /> */}
        <PiBooksFill style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Library
        </Typography>
        </Link>
        <Link to="https://academy.wearenoyack.com" className="flex flex-col px-2 hover:bg-gray-100 rounded gap-1">
        {/* <Article /> */}
        <HiAcademicCap style={{width:28, minHeight:28}} />
        <Typography fontSize={".75rem"}>
          Academy
        </Typography>
        </Link>
    </nav>
  );
}