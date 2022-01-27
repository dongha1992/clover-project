import getCustomDate from './getCustomDate';

const checkTimerLimitHelper = (currentTime: number): string => {
  const { days } = getCustomDate(new Date());

  console.log(days);
  const spotLunch = currentTime >= 9.0 && currentTime < 9.3;
  const spotDinner = currentTime >= 10.3 && currentTime < 11.0;
  const morning = currentTime >= 16.3 && currentTime < 17.0;
  const parcel = currentTime >= 16.3 && currentTime < 17.0;

  //
  const isWeekends = days === '토' || days === '일';

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

    case isWeekends: {
      return '';
    }

    default: {
      return '';
    }
  }
};

export default checkTimerLimitHelper;
