import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { ILocation } from '@model/index';
import { FlexBetweenStart, FlexColEnd, FlexRow, theme } from '@styles/theme';

interface IProps {
  location: ILocation;
  delivery: string;
  deliveryDetail: string;
  dayFormatter: string;
  spotName: string;
  spotPickupName: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
}
const DeliveryDateBox = ({
  location,
  delivery,
  deliveryDetail,
  dayFormatter,
  spotName,
  spotPickupName,
  deliveryStartTime,
  deliveryEndTime,
}: IProps) => {
  const isLunch = deliveryDetail === 'LUNCH';

  const deliveryTimeInfo = `${deliveryStartTime}-${deliveryEndTime}`;
  return (
    <>
      {delivery === 'PARCEL' && (
        <>
          <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정일시</TextH5B>
            <FlexColEnd>
              <TextB2R>{dayFormatter}</TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>배송지</TextH5B>
            <FlexColEnd>
              <TextB2R>{location.address}</TextB2R>
              <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
        </>
      )}
      {delivery === 'MORNING' && (
        <>
          <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>{dayFormatter} 00:00-07:00</TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>배송지</TextH5B>
            <FlexColEnd>
              <TextB2R>{location.address}</TextB2R>
              <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
        </>
      )}
      {delivery === 'QUICK' && (
        <>
          <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>
                {dayFormatter} {isLunch ? '11:30-12:00' : '15:30-18:00'}
              </TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>배송지</TextH5B>
            <FlexColEnd>
              <TextB2R>{location.address}</TextB2R>
              <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
        </>
      )}
      {delivery === 'SPOT' && (
        <>
          <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>
                {dayFormatter} {deliveryTimeInfo}
              </TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>픽업장소</TextH5B>
            <FlexColEnd>
              <FlexRow>
                <TextB3R>
                  {spotName} {spotPickupName}
                </TextB3R>
              </FlexRow>
              <FlexRow>
                <TextB3R color={theme.greyScale65} margin="0 4px 0 0">
                  ({location.zipCode})
                </TextB3R>
                <TextB3R color={theme.greyScale65}>{location.address}</TextB3R>
              </FlexRow>
            </FlexColEnd>
          </FlexBetweenStart>
        </>
      )}
    </>
  );
};

export default DeliveryDateBox;
