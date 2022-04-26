import { Label } from '@components/Pages/Subscription/SubsCardItem';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { FlexBetween, FlexRow, FlexRowStart, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import router from 'next/router';
import styled from 'styled-components';
import SubsProgressBar from './ProgressBar';
interface IProps {
  type: string;
}

const goToSubsDetail = () => {
  router.push('/subscription/detail');
};

const SubsManagementItem = ({ type }: IProps) => {
  return (
    <Container>
      <FlexBetween>
        <FlexRowStart>
          <TextH5B margin="0 8px 0 0">구독예정</TextH5B>
          <Label className="subs">정기구독</Label>
          <Label className="dawn">새벽배송</Label>
        </FlexRowStart>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline" onClick={goToSubsDetail}>
          구독상세 보기
        </TextH6B>
      </FlexBetween>
      <FlexRow padding="9px 0">
        <SVGIcon name="subscription" /> <TextH5B padding="0 0 0 4px">배송 1회차 - 2월 8일 (화) 도착예정</TextH5B>
      </FlexRow>
      <FlexRowStart>
        <ImgBox></ImgBox>
        <InfoBox>
          <TextB2R padding="0 0 4px">간편하게 비건식단</TextB2R>
          <TextB3R className="date" color="#717171">
            <b>구독 1회차</b> - 2월 8일 (화) ~ 3월 7일 (월)
          </TextB3R>
        </InfoBox>
      </FlexRowStart>
      {type === 'subsIng' && (
        <ProgressBox>
          <SubsProgressBar length={21} count={11} />
          <FlexRow padding="8px 0 0">
            <SVGIcon name="exclamationMark" />
            <TextB3R color={theme.brandColor}>
              <b></b> 구독 식단이 종료되어 N월 N일 (목) 자동으로 구독 해지될 예정이에요.
            </TextB3R>
          </FlexRow>
        </ProgressBox>
      )}
      {type === 'subsComplete' && (
        <Button margin="16px 0 0" border backgroundColor="#fff" color={theme.black}>
          할인쿠폰받고 재주문하기
        </Button>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid #f2f2f2;
  padding-top: 24px;
  &:first-of-type {
    padding-top: 0;
  }
  &:last-of-type {
    border-bottom: none;
  }
`;
const ImgBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
  background-color: #dedede;
`;
const InfoBox = styled.div`
  .date {
    b {
      font-weight: bold;
    }
  }
`;
const ProgressBox = styled.div`
  padding-top: 16px;
  svg {
    margin-bottom: 3px;
  }
  b {
    font-weight: bold;
  }
`;
export default SubsManagementItem;
