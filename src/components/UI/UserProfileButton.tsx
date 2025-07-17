import React, { useState, useRef, useEffect, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Mail,
  Shield,
  CreditCard
} from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';

const UserProfileButton = () => {
  const { userInfo, subs } = useContext(UserContext);
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const handleAccountSettings = () => {
    // Navigate to your custom account page
    navigate('/profile')
    setIsOpen(false);
  };

  const handleBilling = () => {
    // Navigate to billing page
    navigate('/profile?billing')
    setIsOpen(false);
  };

  const handleSecurity = () => {
    // Navigate to security settings
    navigate('/profile?security')
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-[200px] p-2 rounded-l-4xl bg-white shadow-2xl hover:shadow-xl transition-shadow duration-200 border border-gray-100"
      >
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {userInfo?.firstName?.charAt(0) || userInfo?.email || 'U'}
        </div>
        
        {/* User Info */}
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900 truncate">
            {(`${userInfo?.firstName} ${userInfo?.lastName}`) || 'User'}
          </p>
          <p className="text-sm text-gray-500 truncate">Individual</p>
        </div>
        
        {/* Chevron */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-900">{`${userInfo?.firstName} ${userInfo?.lastName}`}</p>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleAccountSettings}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Account Settings</span>
            </button>

            <button
              onClick={handleSecurity}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Security</span>
            </button>

            <button
              onClick={handleBilling}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
            >
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">Billing</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;