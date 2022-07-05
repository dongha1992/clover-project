import { useState, useEffect, useCallback } from 'react';
import { UseQueryResult } from 'react-query';

export interface IUseInfinite {
  ref: any;
  parentRef: any;
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<UseQueryResult>;
}

const useInfinite = ({ parentRef, ref, refetch }: IUseInfinite) => {
  const [page, setPage] = useState<number>(0);

  const option = {
    root: parentRef?.current!, // 관찰대상의 부모요소를 지정
    rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0,
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, option);

    if (ref?.current) {
      observer.observe(ref?.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page) {
      refetch();
    }
  }, [page]);

  return { page };
};

export default useInfinite;
