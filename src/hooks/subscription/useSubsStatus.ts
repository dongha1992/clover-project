import { useEffect, useState } from 'react';

const useSubsStatus = (subsStatus: string) => {
  const [status, setStatus] = useState<string>();
  useEffect(() => {
    switch (subsStatus) {
      case 'UNPAID':
        setStatus('구독예정');
        break;
      case 'RESERVED':
        setStatus('구독예정');
        break;
      case 'PROGRESS':
        setStatus('구독 중');
        break;
      case 'COMPLETED':
        setStatus('구독완료');
        break;
      case 'CANCELED':
        setStatus('구독취소');
        break;

      default:
        break;
    }
  }, [subsStatus]);
  return status;
};
export default useSubsStatus;
