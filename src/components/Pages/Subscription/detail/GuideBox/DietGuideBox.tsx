import { TextB3R, TextH6B } from '@components/Shared/Text';
import { FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

const DietGuideBox = () => {
  return (
    <DietGuideContainer>
      <div className="titleBox">
        <SVGIcon name="exclamationMark" />
        <TextH6B padding="2.5px 0 0 2px" color={theme.brandColor}>
          구독 식단 안내
        </TextH6B>
      </div>
      <FlexRow className="textBox">
        <TextB3R color={theme.brandColor}>상품이 품절되면 대체상품으로 변경될 수 있어요.</TextB3R>
      </FlexRow>
      <FlexRow className="textBox">
        <TextB3R color={theme.brandColor}>
          구독 중엔 상품을 변경하거나 추가할 수 없으니 구독하실 식단을 반드시 확인해 주세요.
        </TextB3R>
      </FlexRow>
    </DietGuideContainer>
  );
};
const DietGuideContainer = styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${theme.greyScale3};
  border-radius: 8px;
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

export default DietGuideBox;
