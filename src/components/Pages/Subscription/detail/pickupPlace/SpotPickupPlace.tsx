import { TextB2R, TextB3R, TextH5B } from '@components/Shared/Text';
import { FlexBetween, FlexBetweenStart, FlexColEnd, FlexRow } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

interface IProps {
  spotName: string;
  spotPickupName: string;
  address: string;
  isFail: boolean;
  delivery: string;
  deliveryDetail: string;
}

const SpotPickupPlace = ({ address, spotName, spotPickupName, delivery, deliveryDetail, isFail }: IProps) => {
  return (
    <Container>
      <FlexBetween padding="0 0 16px">
        <TextH5B>배송방법</TextH5B>
        <TextB2R>
          {delivery} {deliveryDetail}
        </TextB2R>
      </FlexBetween>
      <FlexBetweenStart padding="0 0 24px">
        <TextH5B>픽업장소</TextH5B>
        <FlexColEnd>
          {isFail ? (
            <FlexRow>
              <SVGIcon name="exclamationMark" />
              <TextB2R padding="2.5px 0 0 4px" className="textRight">
                {spotName} - {spotPickupName}
              </TextB2R>
            </FlexRow>
          ) : (
            <TextB2R padding="2.5px 0 0 4px" className="textRight">
              {spotName} {spotPickupName}
            </TextB2R>
          )}
          <TextB3R color="#717171">{address}</TextB3R>
        </FlexColEnd>
      </FlexBetweenStart>
    </Container>
  );
};

const Container = styled.div`
  .textRight {
    text-align: right;
  }
`;
export default SpotPickupPlace;
