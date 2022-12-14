import React, { useState, useEffect } from 'react';

interface IDimension {
  width: number;
  height: number;
}

/* TODO : innerHeight 값 다름 */

const useDiemension = (): IDimension => {
  const hasWindow = typeof window !== 'undefined';

  function getDiemensions() {
    const width: number | null = hasWindow ? window.innerWidth : null;
    const height: number | null = hasWindow ? window.innerHeight : null;

    return { width, height };
  }
  const [windowDimensions, setWindowDimensions] = useState(getDiemensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getDiemensions());
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions as IDimension;
};

export default useDiemension;
