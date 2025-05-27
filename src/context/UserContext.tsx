// UserContext.tsx
import { createContext, Dispatch, SetStateAction } from 'react';
import { User } from '../types';

export interface UserContextType {
  userInfo: User | undefined;
  setUserInfo: Dispatch<SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: undefined,
  setUserInfo: () => {},
});