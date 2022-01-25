import { defaults } from 'lodash-es';

interface IProps {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

type TReturnType = 'morning' | 'quick' | 'parcel' | 'noDelivery' | 'noQuick';

export const checkDestinationHelper = ({
  morning,
  quick,
  parcel,
}: IProps): TReturnType => {
  /*TODO: morning, quick, pacel 값이 아예 없을때 방어로직. 경우 어떤 경우 있나 고민 */
  console.log(morning, quick, parcel);
  switch (true) {
    case morning && quick && parcel: {
      return 'morning';
    }

    case morning && parcel && !quick: {
      return 'noQuick';
    }

    case quick: {
      return 'quick';
    }

    case parcel: {
      return 'parcel';
    }

    default: {
      return 'noDelivery';
    }
  }
};
