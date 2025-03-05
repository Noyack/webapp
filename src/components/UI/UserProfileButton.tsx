// components/UI/UserProfileButton.tsx
import { UserButton } from '@clerk/clerk-react';

export default function UserProfileButton() {


  return (
    <div className="relative shadow-2xl rounded-l-4xl grow">
      <div
        className="flex items-center space-x-3 w-full p-2 rounded-lg"
      >
        <UserButton  />
        <div className="text-left">
          <p className="font-medium">John Doe</p>
          <p className="text-sm text-gray-500">Individual</p>
        </div>
      </div>
    </div>
  );
}