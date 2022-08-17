import { TextB2R, TextH5B } from '@components/Shared/Text';
import { FlexBetween, FlexBetweenStart, FlexColEnd, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  delivery: string;
  deliveryMessage: string;
  isFail: boolean;
  address: string;
  addressDetail: string;
}

const ParcelPickupPlace = ({ delivery, address, addressDetail, deliveryMessage, isFail }: IProps) => {
  return (
    <Container>
      <FlexBetween padding="0 0 16px">
        <TextH5B>배송방법</TextH5B>
        <TextB2R>{delivery}</TextB2R>
      </FlexBetween>
      <FlexBetweenStart padding="0 0 24px">
        <TextH5B>배송지</TextH5B>
        <FlexColEnd>
          {isFail ? (
            <FlexRow>
              <SVGIcon name="exclamationMark" />
              <TextB2R padding="2.5px 0 0 4px" className="textRight">
                {address}
              </TextB2R>
            </FlexRow>
          ) : (
            <TextB2R padding="2.5px 0 0 4px" className="textRight">
              {address}
            </TextB2R>
          )}
          <TextB2R className="textRight">{addressDetail}</TextB2R>
        </FlexColEnd>
      </FlexBetweenStart>
      <FlexBetweenStart>
        <TextH5B>배송메모</TextH5B>
        <TextB2R>{deliveryMessage}</TextB2R>
      </FlexBetweenStart>
    </Container>
  );
};
const Container = styled.div`
  .textRight {
    text-align: right;
  }
`;
export default ParcelPickupPlace;
