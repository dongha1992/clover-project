import { defaults } from 'lodash-es';

interface IProps {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

type TReturnType = 'morning' | 'quick' | 'parcel' | 'noDelivery';

export const checkDestinationHelper = ({
  morning,
  quick,
  parcel,
}: IProps): TReturnType => {
  if (!morning && !quick && !parcel) {
    return;
  }
  switch (true) {
    case morning && quick && parcel:
    case morning && parcel: {
      return 'morning';
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
