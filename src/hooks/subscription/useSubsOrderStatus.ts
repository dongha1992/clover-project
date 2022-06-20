import { useEffect, useState } from 'react';

const useSubsOrderStatus = (subsOrderStatus: string, status: string) => {
  const [orderStatus, setOrderStatus] = useState<string>();
  useEffect(() => {
    switch (subsOrderStatus) {
      case 'RESERVED':
        if (status === 'UNPAID') {
          setOrderStatus('주문예정');
        } else {
          setOrderStatus('주문완료');
        }
        break;
      case 'PREPARING':
        setOrderStatus('상품준비 중');
        break;
      case 'DELIVERING':
        setOrderStatus('배송 중');
        break;
      case 'COMPLETED':
        setOrderStatus('배송 완료');
        break;
      case 'CANCELED':
        setOrderStatus('주문취소');
        break;
      default:
        break;
    }
  }, [status, subsOrderStatus]);
  return orderStatus;
};
export default useSubsOrderStatus;
