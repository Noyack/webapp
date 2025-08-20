import React, { useContext, useLayoutEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard,
  Save,
  Edit2,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import Billing from './Billing';
import { useLocation } from 'react-router';

const Account = () => {
  const { user } = useUser();
  const {  } = useContext(UserContext)
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: user?.phoneNumbers[0]?.phoneNumber || '',
  });

  useLayoutEffect(()=>{
    if(location.search){
        if(location.search === "?profile"){
            setActiveTab("profile")
        }
        else if(location.search === "?notifications"){
            setActiveTab("notifications")
        }
        else if(location.search === "?security"){
            setActiveTab("security")
        }
        else if(location.search === "?billing"){
            setActiveTab("billing")
        }
        else{
            setActiveTab("profile")
        }

    }
  },[location])

  const handleSave = async () => {
    try {
      // Update user data with Clerk
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen">
      

      <div className="  px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <Camera className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{user?.fullName}</h3>
                <p className="text-sm text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">{formData.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">{formData.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-500">
                        {formData.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-500">
                        {formData.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                      <p className="text-sm text-gray-600 mb-3">Change your password to keep your account secure</p>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs content would go here */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <p className="text-gray-600">Notification settings coming soon...</p>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                  <Billing />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;