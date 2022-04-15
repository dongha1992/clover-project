import { TextB2R, TextB3R } from '@components/Shared/Text';
import { FlexRow, FlexRowStart, theme } from '@styles/theme';
import styled from 'styled-components';
import { Label } from '../SubsCardItem';

const SubsOrderItem = () => {
  return (
    <SubsOrderContainer>
      <TextB2R padding="0 0 16px" color={theme.brandColor}>
        5주간, 주 2회씩 (화·목) 총 9회 배송되는 식단입니다.
      </TextB2R>
      <FlexRowStart>
        <ImgBox></ImgBox>
        <InfoBox>
          <div className="labelBox">
            <FlexRow padding="0 0 4px 0">
              <Label className="subs">정기구독</Label>
              <Label>스팟배송</Label>
              <Label>점심</Label>
            </FlexRow>
          </div>
          <TextB3R>600kcal 유지어터 식단</TextB3R>
        </InfoBox>
      </FlexRowStart>
    </SubsOrderContainer>
  );
};
const SubsOrderContainer = styled.div`
  padding-top: 8px;
`;
const ImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #dedede;
`;
const InfoBox = styled.div`
  .labelBox {
  }
`;

export default SubsOrderItem;
