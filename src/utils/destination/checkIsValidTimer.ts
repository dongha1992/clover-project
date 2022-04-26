import { destinationForm } from '@store/destination';
import { useSelector } from 'react-redux';
import { TResult } from './checkTimerLimitHelper';
import getCustomDate from './getCustomDate';
import { useDispatch } from 'react-redux';
import { INIT_TIMER } from '@store/order';
import { TLocationType } from '@utils/destination/checkDestinationHelper';

/* 현재 위치와 요일 관련하여 배송 마감 타이머 체크 */
/* 관련 피그마 https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=3055%3A40726 */

const checkIsValidTimer = (deliveryType: TResult): string => {
  let { locationStatus } = useSelector(destinationForm);
  const dispatch = useDispatch();

  const { days } = getCustomDate(new Date());

  // 요일 체크
  let isWeekends = ['토', '일'].includes(days);

  // 타이머 관련 변수
  const isParcel = deliveryType === '택배배송타이머';
  const isMorning = deliveryType === '새벽배송타이머';
  const isSpot = ['스팟점심타이머', '스팟저녁타이머'].includes(deliveryType);

  /* 주말 테스트 */
  // isWeekends = true;

  /* 서울 테스트(quick===spot) */
  // locationStatus = '';
  // locationStatus = 'spot';

  /* 경기 테스트(morning) */
  // locationStatus = 'morning';

  /* 지방 테스트(parcel) */
  // locationStatus = 'parcel';

  const isRolling = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

  if (isWeekends || isRolling || !deliveryType) {
    dispatch(INIT_TIMER({ isInitDelay: true }));
  } else {
    // deliveryType = deliveryType.replace('타이머', '').trim();
    dispatch(INIT_TIMER({ isInitDelay: false }));
  }

  switch (locationStatus as TLocationType) {
    // 서울
    case '':
    case 'spot': {
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
