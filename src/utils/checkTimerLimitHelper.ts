import getCustomDate from './getCustomDate';

export type TResult =
  | '스팟점심'
  | '스팟저녁'
  | '새벽배송'
  | '택배배송'
  | '스팟저녁롤링'
  | '새벽택배롤링'
  | '새벽택배N일롤링'
  | '스팟당일롤링'
  | '스팟N일롤링'
  | '';

interface IProps {
  currentTime?: number;
}

/* 현재 시간 관련하여 배송 마감 타이머 / 배송 정보 롤링 체크 */
/* 관련 피그마 https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=7214%3A111244 */

const checkTimerLimitHelper = (): TResult => {
  const { days } = getCustomDate(new Date());

  // let currentTime = Number(`${getFormatTime(hours)}.${getFormatTime(minutes)}`);
  let currentTime;
  /* 스팟 런치 테스트 */
  currentTime = 19.0;

  /* 스팟 저녁 테스트 */
  // currentTime = 10.4;

  /* 새벽 테스트 */
  // currentTime = 16.4;

  /* 택배 테스트 */
  // currentTime = 16.4;

  const spotLunchDinnerToday = currentTime >= 0.0 && currentTime < 9.0;
  const spotLunch = currentTime >= 9.0 && currentTime < 9.3;
  const spotDinnerRolling = currentTime >= 9.3 && currentTime < 10.3;
  const spotDinner = currentTime >= 10.3 && currentTime < 11.0;
  const morningAndParcelRolling = currentTime >= 11.0 && currentTime < 16.3;
  const morning = currentTime >= 16.3 && currentTime < 17.0;
  const parcel = currentTime >= 16.3 && currentTime < 17.0;
  const spotLunchDinnerTomorrow = currentTime >= 17.0 && currentTime < 24.0;

  let isFriday = days === '금';
  let isSunday = days === '일';
  let isWeekends = ['토', '일'].includes(days);

  isFriday = true;
  // 주말의 경우 타이머 없고 '새벽택배롤링'만 나옴. 단, 일요일 17시 이후부터 24시까지 '스팟차일롤링'
  if (isWeekends) {
    if (isSunday && spotLunchDinnerTomorrow) {
      return '스팟N일롤링';
    } else {
      return '새벽택배N일롤링';
    }
  } else {
    // 평일의 경우
    switch (true) {
      case spotLunch: {
        return '스팟점심';
      }
      case spotDinner: {
        return '스팟저녁';
      }
      case morning: {
        return '새벽배송';
      }
      case parcel: {
        return '택배배송';
      }
      case spotLunchDinnerToday: {
        return '스팟당일롤링';
      }
      case spotLunchDinnerTomorrow: {
        // 금요일 17시 이후만 '새벽택배롤링'
        if (isFriday) {
          return '새벽택배N일롤링';
        }
        return '스팟N일롤링';
      }
      case spotDinnerRolling: {
        return '스팟저녁롤링';
      }
      case morningAndParcelRolling: {
        return '새벽택배롤링';
      }
      default: {
        return '';
      }
    }
  }
};

export default checkTimerLimitHelper;
