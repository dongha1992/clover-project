import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TeststPage = () => {
  const router = useRouter();
  const [testId, setTestId] = useState<string | string[] | undefined>();
  useEffect(() => {
    if (router.isReady) {
      setTestId(router.query.testId);
    }
  }, []);
  return <div>{testId}</div>;
};

export default TeststPage;
