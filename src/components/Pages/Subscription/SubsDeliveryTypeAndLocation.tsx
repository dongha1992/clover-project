import { TextB3R, TextH4B } from '@components/Shared/Text';
import { DELIVERY_TYPE_MAP } from '@constants/order';
import { ILocation } from '@model/index';
import { IDestinationAddress } from '@pages/subscription/set-info';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
interface IProps {
  goToDeliveryInfo: () => void;
  subsDeliveryType: string;
  deliveryType?: string;
  deliveryDestination?: ILocation | null;
  spotMainDestination?: string;
  mainDestinationAddress?: IDestinationAddress;
}
const SubsDeliveryTypeAndLocation = ({
  goToDeliveryInfo,
  subsDeliveryType,
  spotMainDestination,
  mainDestinationAddress,
}: IProps) => {
  return (
    <Container onClick={goToDeliveryInfo}>
      {subsDeliveryType === 'SPOT' && (
        <Left>
          <TextH4B>스팟배송</TextH4B>
          <TextH4B>{spotMainDestination ? spotMainDestination : '픽업장소를 설정해 주세요'}</TextH4B>
          <TextB3R color={theme.greyScale65} padding="8px 0 0">
            배송방법이 제한된 상품입니다.
          </TextB3R>
        </Left>
      )}
      {['PARCEL', 'MORNING'].includes(subsDeliveryType) && (
        <Left>
          <TextH4B>{mainDestinationAddress ? DELIVERY_TYPE_MAP[subsDeliveryType] : '배송방법'}</TextH4B>
          <TextH4B>{mainDestinationAddress ? mainDestinationAddress.address : '배송지를 설정해 주세요'}</TextH4B>
          <TextB3R color={theme.greyScale65} padding="8px 0 0">
            배송방법이 제한된 상품입니다.
          </TextB3R>
        </Left>
      )}
      <Right>
        <SVGIcon name="arrowRight" />
      </Right>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 24px;
  cursor: pointer;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
`;
const Right = styled.div`
  align-self: center;
`;
export default SubsDeliveryTypeAndLocation;
