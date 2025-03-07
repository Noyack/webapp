import { Link } from "react-router"
import { Article, CurrencyExchange, Dashboard, MonetizationOn, Newspaper, People, Support } from '@mui/icons-material';
import Logo from '../../assets/NOYACK Logo transparent background .png'


export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-54 shadow-lg p-4 flex flex-col gap-20 bg-gray-100">
      {/* Logo */}
      <div className="">
        <Link  to="/" className="text-2xl font-bold text-primary flex justify-center py-5">
          <img src={Logo} className=""/>
        </Link>
      </div>
      {/* Navigation Links */}
      <div  className="flex flex-col h-full justify-between">

      <div className="space-y-2 flex flex-col text-black gap-5">
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
      </div>

    </nav>
  );
}