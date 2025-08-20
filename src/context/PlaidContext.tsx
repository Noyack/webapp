// UserContext.tsx
import { createContext, Dispatch, SetStateAction,  } from 'react';
import { PlaidInfo } from '../types';

export interface PlaidContextType {
  plaidInfo: PlaidInfo | undefined;
  setPlaidInfo: Dispatch<SetStateAction<PlaidInfo | undefined>>;
}

export const PlaidContext = createContext<PlaidContextType>({
    plaidInfo: undefined,
    setPlaidInfo: () => {},
//   userInfo: undefined,
//   subs: undefined,
//   setSubs: () => {}
});