import { useRouter } from 'next/router';
import React, { createContext, useState, useEffect, useContext } from 'react';

interface HValidation {
  history: string[];
  setHistory(data: string[]): void;
}

const HistoryContext = createContext<HValidation>({} as HValidation);

export const HistoryProvider: React.FC = ({ children }) => {
  const { asPath, push, pathname } = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory((previous) => [...previous, asPath]);
  }, [asPath]);

  return (
    <HistoryContext.Provider
      value={{
        history,
        setHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HValidation {
  const context = useContext(HistoryContext);
  return context;
}
