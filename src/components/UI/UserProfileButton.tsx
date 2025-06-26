// components/UI/UserProfileButton.tsx
import { UserButton, useUser } from '@clerk/clerk-react';
// import { UserContext } from '../../context/UserContext';
// import { useContext } from 'react';

export default function UserProfileButton() {

  const {user} = useUser()
  // const {userInfo} = useContext(UserContext)
  
  return (
    <div className="relative shadow-2xl rounded-l-4xl grow bg-white">
      <div
        className="flex items-center space-x-3 w-[200px] p-2 rounded-lg"
      >
        <UserButton  />
        <div className="text-left">
          <p className="font-medium">{user?.fullName}</p>
          <p className="text-sm text-gray-500">Individual</p>
        </div>
      </div>
    </div>
  );
}