// src/App.tsx
import React, { useEffect } from 'react';
import AppRoute from './routes';
import { useGlobal } from './contexts/GlobalContext';
import Tour from './components/Dashboard/Tour';

export const App: React.FC = () => {

  const { setLoading } = useGlobal();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <Tour/>
    <AppRoute />
    </>
  );
};