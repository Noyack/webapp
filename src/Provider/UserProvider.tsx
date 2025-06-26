// UserProvider.tsx
import { PropsWithChildren, useState } from 'react';
import { Subscriptions, User } from '../types';
import { UserContext } from '../context/UserContext';

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<User | undefined>(undefined);
  const [subs, setSubs] = useState<Subscriptions | undefined>(undefined);
  
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, subs, setSubs }}>
      {children}
    </UserContext.Provider>
  );
};