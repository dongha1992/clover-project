interface IProps {
  morning: boolean;
  quick: boolean;
  parcel: boolean;
  spot: boolean;
}

export type TLocationType = 'morning' | 'spot' | 'parcel' | 'quick' | 'noDelivery' | '';

export const checkDestinationHelper = ({ morning, quick, parcel, spot }: IProps): TLocationType => {
  /*TODO: morning, quick, pacel , spot 값이 아예 없을때 방어로직. 경우 어떤 경우 있나 고민 */
  try {
    switch (true) {
      case spot: {
        return 'spot';
      }

      case !spot && morning: {
        return 'morning';
      }

      case !spot && !morning && parcel: {
        return 'parcel';
      }

      default: {
        return 'noDelivery';
      }
    }
  } catch (error) {
    console.error(error);
    return 'noDelivery';
  }
};
