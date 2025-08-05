import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingPage from '../components/Loading/LoadingPage';

interface GlobalContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <GlobalContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && <LoadingPage />}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};