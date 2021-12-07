import { useState, useEffect } from 'react';

/*TODO: 렌더 3번 됨 */
/* TODO: useLocalStorage 정리해야함 */
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
