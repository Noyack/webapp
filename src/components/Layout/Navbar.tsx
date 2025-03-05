// components/Layout/Navbar.tsx
import { Typography } from "@mui/material";
import { Link } from "react-router"
import { Article, CurrencyExchange, Dashboard, MonetizationOn, Newspaper, People, Support } from '@mui/icons-material';


export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-54 bg-white shadow-lg p-4 flex flex-col justify-between">
      {/* Logo */}
      <div className="">
        <Link  to="/" className="text-2xl font-bold text-primary">
          Noyack
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="space-y-2 flex flex-col text-black">
        <Link to="/" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <Dashboard />
          Dashboard
        </Link>
        <Link to="/profile" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <People />
          Community
        </Link>
        <Link to="/profile" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <CurrencyExchange />
          Invest
        </Link>
        <Link to="/profile" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <MonetizationOn />
          Rewards
        </Link>
        <Link to="/profile" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <Article />
          My Documents
        </Link>
      </div>

      <div className="flex justify-center">
        <Link to="/" color="#fff" className="py-2 px-5 rounded-lg bg-green-700 text-white">
        <Typography>
           Invest Now
        </Typography>
        </Link>
      </div>
      
      <div>
        <Link to="/" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <Support />
          Support
        </Link>
        <Link to="/" className="flex p-2 hover:bg-gray-100 rounded gap-1">
        <Newspaper />
          Newsletter
        </Link>
      </div>
    </nav>
  );
}