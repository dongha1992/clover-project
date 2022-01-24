const checkTimerLimitHelper = (currentTime: number): string => {
  const spotLunch = currentTime >= 9.0 && currentTime < 9.3;
  const spotDinner = currentTime >= 10.3 && currentTime < 11.0;
  const morning = currentTime >= 16.3 && currentTime < 17.0;
  const parcel = currentTime >= 16.3 && currentTime < 17.0;

  switch (true) {
    case spotLunch: {
      return '점심배송';
    }
    case spotDinner: {
      return '저녁배송';
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
