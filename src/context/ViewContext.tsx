import { createContext, Dispatch, SetStateAction } from 'react';

export type View = {
    view: 'Learn' | 'Invest' 
}

export interface ViewContextType {
    view: View;
    setView: Dispatch<SetStateAction<View>>;
}

export const ViewContext = createContext<ViewContextType>({
  view:{ view: 'Learn'},
  setView: () => {},
});