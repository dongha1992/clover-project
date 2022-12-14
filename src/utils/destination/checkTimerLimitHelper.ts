import getCustomDate from './getCustomDate';
import { TLocationType } from '@utils/destination/checkDestinationHelper';

export type TResult =
  | '스팟점심타이머'
  | '스팟저녁타이머'
  | '새벽배송타이머'
  | '택배배송타이머'
  | '스팟저녁'
  | '새벽택배'
  | '새벽택배N일'
  | '스팟점심'
  | '스팟점심N일'
  | string;

// 위치없음, 스팟배송 가능 지역은 타임라인 같음

/* 현재 시간 관련하여 배송 마감 타이머 / 배송 정보 롤링 체크 */
/* 관련 피그마 https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=7214%3A111244 */

const checkTimerLimitHelper = (locationStatus: TLocationType): TResult => {
  const { days, currentTime } = getCustomDate();

  // let currentTime;
  /* 스팟 런치 테스트 */
  // currentTime = 9.4;

  /* 스팟 저녁 테스트 */
  // currentTime = 10.3;

  /* 새벽 테스트 */
  // currentTime = 16.4;

  /* 택배 테스트 */
  // currentTime = 16.4;

  // currentTime = 16.3;

  const spotLunchDinnerToday = currentTime >= 0.0 && currentTime < 9.0;
  const spotLunchTimer = currentTime >= 9.0 && currentTime < 9.3;
  const spotDinner = currentTime >= 9.3 && currentTime < 10.3;
  const spotDinnerTimer = currentTime >= 10.3 && currentTime < 11.0;
  const morningAndParcel = currentTime >= 11.0 && currentTime < 16.3;
  const morningTimer = currentTime >= 16.3 && currentTime < 17.0;
  const parcelTimer = currentTime >= 16.3 && currentTime < 17.0;
  const spotLunchDinnerTomorrow = currentTime >= 17.0 && currentTime < 24.0;

  const isFriday = days === '금';
  const isSunday = days === '일';
  const isWeekends = ['토', '일'].includes(days);

  const isParcel = locationStatus === 'parcel';
  const isMorning = locationStatus === 'morning';

  // 주말의 경우 타이머 없고 '새벽택배'만 나옴. 단, 일요일 17시 이후부터 24시까지 '스팟점심N일'
  if (isWeekends) {
    if (isSunday && spotLunchDinnerTomorrow) {
      return '스팟점심N일';
    } else {
      return '새벽택배N일';
    }
  } else {
    // 평일의 경우
    switch (true) {
      case spotLunchTimer: {
        if (isParcel || isMorning) {
          return '스팟점심';
        }
        return '스팟점심타이머';
      }
      case spotDinnerTimer: {
        if (isParcel || isMorning) {
          return '스팟저녁';
        }
        return '스팟저녁타이머';
      }
      case morningTimer: {
        // if (isParcel) {
        //   return '스팟점심';
        // }
        return '새벽배송타이머';
      }
      case parcelTimer: {
        return '택배배송타이머';
      }
      case spotLunchDinnerToday: {
        return '스팟점심';
      }
      case spotLunchDinnerTomorrow: {
        // 금요일 17시 이후만 '새벽택배'
        if (isFriday) {
          return '새벽택배N일';
        }
        return '스팟점심N일';
      }
      case spotDinner: {
        return '스팟저녁';
      }
      case morningAndParcel: {
        return '새벽택배';
      }
      default: {
        return '';
      }
    }
  }
};

export default checkTimerLimitHelper;
