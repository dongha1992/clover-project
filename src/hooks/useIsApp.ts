import { useEffect, useState } from 'react';

const useIsApp = () => {
  const [isApp, setIsApp] = useState<boolean | null>(null);
  useEffect(() => {
    window.navigator.userAgent.includes('fco-clover-webview') ? setIsApp(true) : setIsApp(false);
  }, []);

  return isApp;
};
export default useIsApp;
