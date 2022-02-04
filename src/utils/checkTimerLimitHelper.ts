export type TResult = '스팟점심' | '스팟저녁' | '새벽배송' | '택배배송' | '';

interface IProps {
  currentTime: number;
}

/* 현재 시간 관련하여 배송 마감 타이머 체크 */
const checkTimerLimitHelper = ({ currentTime }: IProps): TResult => {
  /* 스팟 런치 테스트 */
  currentTime = 9.1;

  /* 스팟 저녁 테스트 */
  // currentTime = 10.4;

  /* 새벽 테스트 */
  // currentTime = 16.4;

  /* 택배 테스트 */
  // currentTime = 16.4;

  const spotLunch = currentTime >= 9.0 && currentTime < 9.3;
  const spotDinner = currentTime >= 10.3 && currentTime < 11.0;
  const morning = currentTime >= 16.3 && currentTime < 17.0;
  const parcel = currentTime >= 16.3 && currentTime < 17.0;

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

    default: {
      return '';
    }
  }
};

export default checkTimerLimitHelper;
