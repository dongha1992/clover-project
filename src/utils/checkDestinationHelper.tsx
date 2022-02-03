interface IProps {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
}

export type TLocationType = 'morning' | 'spot' | 'parcel' | 'noDelivery' | '';

export const checkDestinationHelper = ({
  morning,
  quick,
  parcel,
}: IProps): TLocationType => {
  /*TODO: morning, quick, pacel 값이 아예 없을때 방어로직. 경우 어떤 경우 있나 고민 */

  /* spot은 quick 케이스와 동일 */
  switch (true) {
    case morning && quick && !parcel:
    case morning && quick && parcel: {
      return 'spot';
    }

    case morning && !parcel && !quick:
    case morning && parcel && !quick: {
      return 'morning';
    }

    case quick: {
      return 'spot';
    }

    case parcel: {
      return 'parcel';
    }

    default: {
      return 'noDelivery';
    }
  }
};
