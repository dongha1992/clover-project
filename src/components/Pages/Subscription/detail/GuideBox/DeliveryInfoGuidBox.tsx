import { TextB3R, TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

const DeliveryInfoGuidBox = () => {
  return (
    <DeliveryInfoGuideContainer>
      <div className="titleBox">
        <SVGIcon name="exclamationMark" />
        <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
          반드시 확인해 주세요!
        </TextH6B>
      </div>
      <TextB3R color={theme.brandColor} wordBreak="keep-all">
        오늘 오후 9시 최종 결제 실패 시 정기구독이 해지될 예정이에요. 계속해서 구독하시려면 배송정보를 변경해 주세요!
      </TextB3R>
    </DeliveryInfoGuideContainer>
  );
};
const DeliveryInfoGuideContainer = styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
  margin-bottom: 24px;
  .titleBox {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    > div {
      line-height: 1;
    }
  }
  .textBox {
    padding: 0 16px;
    position: relative;
    &::after {
      content: '';
      width: 3px;
      height: 3px;
      border-radius: 3px;
      background-color: ${theme.brandColor};
      position: absolute;
      top: 6.5px;
      left: 7.5px;
    }
  }
`;
export default DeliveryInfoGuidBox;
