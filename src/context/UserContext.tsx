// UserContext.tsx
import { createContext, Dispatch, SetStateAction } from 'react';
import { Subscriptions, UserInfo } from '../types';

export interface UserContextType {
  userInfo: UserInfo| undefined;
  setUserInfo: Dispatch<SetStateAction<UserInfo | undefined>>;
  subs: Subscriptions | undefined
  setSubs: Dispatch<SetStateAction<Subscriptions | undefined>>
}

export const UserContext = createContext<UserContextType>({
  userInfo: undefined,
  setUserInfo: () => {},
  subs: undefined,
  setSubs: () => {}
});