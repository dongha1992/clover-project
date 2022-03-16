import { TextB3R, TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';

const SbsCardItem = () => {
  return (
    <CardBox>
      <Content>
        <LabelList>
          <Label className="sbsc">구독 정보</Label>
          <Label className="dawn">배송 타입</Label>
        </LabelList>
        <TextH5B className="name">900Kcal 집중관리</TextH5B>
        <TextB3R className="deliveryInfo">
          <b>배송예정(4회차)</b> - 1월 29일 (금) 도착예정
        </TextB3R>
      </Content>
      <SVGIcon name="arrowRight" />
    </CardBox>
  );
};
const CardBox = styled.div`
  cursor: pointer;
  display: flex;
  width: 312px;
  height: 124px;
  border-radius: 8px;
  padding: 0 22px 0 24px;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
`;
const Content = styled.div`
  height: 100%;
  padding-top: 24px;
  .name {
    padding-bottom: 4px;
  }
  .deliveryInfo {
    b {
      font-weight: bold;
    }
  }
`;
const LabelList = styled.div`
  display: flex;
  padding-bottom: 8px;
`;
const Label = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: -0.4px;
  width: 51px;
  height: 24px;
  margin-right: 4px;
  border-radius: 4px;
  &:last-child {
    margin-right: 0;
  }
  &.sbsc {
    background-color: #ebf7f1;
    color: ${theme.brandColor};
  }
  &.spot {
    border: 1px solid ${theme.brandColor};
    color: ${theme.brandColor};
  }
  &.dawn {
    border: 1px solid #7922bc;
    color: #7922bc;
  }
`;

export default SbsCardItem;
