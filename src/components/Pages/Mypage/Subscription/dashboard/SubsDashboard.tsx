import { TextB2R, TextB3R, TextB4R, TextH3B, TextH4B } from '@components/Shared/Text';
import { FlexBetween, FlexCol, FlexColCenter, FlexRow, theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import router from 'next/router';
import { IGetOrders } from '@model/index';
import SubsProgressBoard from './SubsProgressBoard';
import SubsUnpaidBoard from './SubsUnpaidBoard';
import SubsCloseBoard from './SubsCloseBoard';

interface IProps {
  subsOrders: IGetOrders[];
  subsUnpaidOrders: IGetOrders[];
  subsCloseOrders: IGetOrders[];
}
const SubsDashboard = ({ subsOrders, subsUnpaidOrders, subsCloseOrders }: IProps) => {
  return (
    <DashBoardBox>
      <FlexCol>
        <FlexBetween>
          <TextH4B>구독 관리</TextH4B>
          <FlexRow>
            <TextB2R padding="0 8px 0 0">{subsOrders.length} 건</TextB2R>
            <div className="rightArrow" onClick={() => router.push('/mypage/subscription')}>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </FlexCol>
      {subsCloseOrders.length ? (
        <SubsCloseBoard />
      ) : subsUnpaidOrders.length ? (
        <SubsUnpaidBoard firstDeliveryDate={subsUnpaidOrders[0]?.firstDeliveryDateOrigin!} />
      ) : (
        <SubsProgressBoard subscriptionRound={subsOrders[0]?.subscriptionRound} />
      )}

      {/* <SubsInfoBox>
        <SVGIcon name="exclamationMark" />
        <TextB3R color={theme.brandColor}>
          <b>구독 3회차 N% 할인</b> <br />
          1월 6일 (목) 자동 결제되는 새 구독플랜을 확인해 주세요!
        </TextB3R>
      </SubsInfoBox> */}
    </DashBoardBox>
  );
};
const DashBoardBox = styled.div`
  padding: 24px 24px 0;
  .rightArrow {
    cursor: pointer;
  }
`;
const Wrapper = styled.div`
  background-color: ${theme.greyScale3};
  margin-top: 15px;
  border-radius: 8px;
`;

const ArrowWrapper = styled.div`
  padding-bottom: 16px;
`;

const SubsInfoBox = styled.div`
  padding-left: 22px;
  position: relative;
  padding-top: 8px;
  svg {
    position: absolute;
    top: 7px;
    left: 0;
  }
  b {
    font-weight: bold;
  }
`;
export default SubsDashboard;
