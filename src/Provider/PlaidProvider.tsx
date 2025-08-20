import { PropsWithChildren, useState } from 'react';
import { PlaidContext } from '../context/PlaidContext';
import { PlaidInfo } from '../types';

export const PlaidProvider = ({ children }: PropsWithChildren) => {
  const [plaidInfo, setPlaidInfo] = useState<PlaidInfo>({
    accountCount: 0,
    noAccount: true,
    error:'',
    linkToken: null,
    loading:false,
    plaidLimit: false,
  });
  return (
    <PlaidContext.Provider value={{ plaidInfo, setPlaidInfo }}>
      {children}
    </PlaidContext.Provider>
  );
};