import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import { TResult } from './checkTimerLimitHelper';
import getCustomDate from './getCustomDate';

/* 현재 위치와 요일 관련하여 배송 마감 타이머 체크 */
/* 관련 피그마 https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=3055%3A40726 */

const checkIsValidTimer = (deliveryType: TResult): string => {
  const { locationStatus } = useSelector(destinationForm);
  const { days } = getCustomDate(new Date());

  // 요일 체크
  const isWeekends = ['토', '일'].includes(days);
  const isMondayToThursday = ['월', '화', '수', '목'].includes(days);
  const isFriday = days === '금';

  const isParcel = deliveryType === '택배배송';
  const isMorning = deliveryType === '새벽배송';
  const isSpot = ['스팟점심', '스팟저녁'].includes(deliveryType);

  if (isWeekends) {
    return '';
  }

  switch (locationStatus) {
    // 서울
    case '':
    case 'quick': {
      // 택배면 마감시간 중복으로 새벽타이머만 노출
      if (isParcel) {
        return '새벽배송';
      } else {
        return deliveryType;
      }
    }
    // 일부 서울 및 경기권
    case 'morning': {
      // 새벽 배송 타이머만 노출
      if (isSpot || isParcel) {
        return '새벽배송';
      } else {
        return deliveryType;
      }
    }
    // 지방
    case 'parcel': {
      // 택배배송 타이머만 노출
      if (isSpot || isMorning) {
        return '택배배송';
      } else {
        return deliveryType;
      }
    }
    default:
      return '';
  }
};

export default checkIsValidTimer;
