import { useState, useEffect, useCallback, SetStateAction } from 'react';
import axios from 'axios';
import { REVIEWS_URL } from '@constants/mock';

export interface IUseFetch {
  page?: number;
}

function useFetch(page: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(false);
  const [list, setList] = useState<any>([]);

  const sendQuery = useCallback(async (page: any) => {
    try {
      await setLoading(true);
      await setError(false);
      const { data } = await axios.get(
        `${REVIEWS_URL}/photos?_page=${page}&_limit=20`
      );
      await setList((prev: any) => [...prev, ...data]);
    } catch (error) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    sendQuery(page);
  }, [sendQuery, page]);

  return { loading, error, list };
}

export default useFetch;
