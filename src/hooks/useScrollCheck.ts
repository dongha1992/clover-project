import { useEffect, useState } from 'react';

const useScrollCheck = () => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); //clean up
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (window.scrollY) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };

  return isScroll;
};
export default useScrollCheck;
