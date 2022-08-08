import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState<any>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};
