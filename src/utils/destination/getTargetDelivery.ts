import { TResult } from './checkTimerLimitHelper';

const getTargetDelivery = (deliveryType: TResult): string => {
 if(deliveryType === '택배배송타이머') return "새벽배송";
 if(deliveryType === '새벽배송타이머') return "택배배송";
 if(deliveryType === '스팟점심타이머') return "스팟점심";
 if(deliveryType === '스팟저녁타이머') return "스팟저녁";
 return '';
};

export default getTargetDelivery;
