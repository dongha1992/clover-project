import React from 'react';
import styled from 'styled-components';
import { FlexRow, theme, FlexCol, FlexRowStart } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import { TextB3R, TextH6B } from '@components/Shared/Text';

interface IProps {
  isChange?: boolean;
  isDestinationChange?: boolean;
}

const SubOrderInfo = ({ isChange, isDestinationChange }: IProps) => {
  const renderer = () => {
    switch (true) {
      case isChange: {
        return (
          <FlexCol>
            <FlexRow>
              <SVGIcon name="exclamationMark" />
              <TextH6B color={theme.brandColor} margin="0 0 0 4px">
                주문 변경 및 취소 시 반드시 확인해주세요!
              </TextH6B>
            </FlexRow>
            <FlexRowStart padding="8px 0 0 0">
              <SVGWrapper>
                <SVGIcon name="brandColorDot" width="4" height="4" />
              </SVGWrapper>
              <TextB3R color={theme.brandColor}>
                함께배송 주문을 취소할 경우 기존 주문은 취소되지 않습니다. (기존 주문을 취소하면 함께배송 주문도
                취소됩니다.)
              </TextB3R>
            </FlexRowStart>
            <FlexRowStart>
              <SVGWrapper>
                <SVGIcon name="brandColorDot" width="4" height="4" />
              </SVGWrapper>
              <TextB3R color={theme.brandColor}>함께배송 주문 취소 시 재주문이 불가합니다.</TextB3R>
            </FlexRowStart>
          </FlexCol>
        );
      }
      case isDestinationChange: {
        return (
          <FlexCol>
            <FlexRow>
              <SVGIcon name="exclamationMark" />
              <TextH6B color={theme.brandColor} margin="0 0 0 4px">
                확인해주세요!
              </TextH6B>
            </FlexRow>
            <FlexRowStart padding="8px 0 0 0">
              <SVGWrapper>
                <SVGIcon name="brandColorDot" width="4" height="4" />
              </SVGWrapper>
              <TextB3R color={theme.brandColor}>
                함께배송 주문의 배송정보는 변경할 수 없습니다. (마이페이지{`>`}주문/배송내역에서 기존 주문의 배송정보를
                변경해 주세요)
              </TextB3R>
            </FlexRowStart>
          </FlexCol>
        );
      }
      default:
        return;
    }
  };
  return <SubOrderInfoWrapper>{renderer()}</SubOrderInfoWrapper>;
};

const SubOrderInfoWrapper = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px;
  margin-top: 16px;
`;

const SVGWrapper = styled.div`
  position: relative;
  margin-right: 10px;
  padding-left: 8px;
  bottom: 2px;
`;

export default React.memo(SubOrderInfo);
