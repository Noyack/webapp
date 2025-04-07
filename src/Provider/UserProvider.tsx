// UserProvider.tsx
import { PropsWithChildren, useState } from 'react';
import { User } from '../types';
import { UserContext } from '../context/UserContext';

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);
  
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};