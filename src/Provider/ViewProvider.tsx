// UserProvider.tsx
import { PropsWithChildren, useState } from 'react';
import { ViewContext } from '../context/ViewContext';
import { View } from '../context/ViewContext';

export const ViewProvider = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<View>({ view: 'Learn' });
  
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};