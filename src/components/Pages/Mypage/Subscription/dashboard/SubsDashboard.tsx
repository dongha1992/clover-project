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
  showBoard: string;
}
const SubsDashboard = ({ subsOrders, subsUnpaidOrders, subsCloseOrders, showBoard }: IProps) => {
  return (
    <DashBoardBox>
      <FlexCol onClick={() => router.push('/mypage/subscription')} pointer>
        <FlexBetween>
          <TextH4B>구독 관리</TextH4B>
          <FlexRow>
            <TextB2R padding="0 8px 0 0" pointer>
              {subsOrders.length} 건
            </TextB2R>
            <div className="rightArrow">
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </FlexCol>
      {showBoard === 'close' && <SubsCloseBoard />}
      {showBoard === 'unpaid' && (
        <SubsUnpaidBoard subscriptionPaymentDate={subsUnpaidOrders[0]?.subscriptionPaymentDate!} />
      )}
      {showBoard === 'progress' && <SubsProgressBoard subscriptionRound={subsOrders[0]?.subscriptionRound} />}
    </DashBoardBox>
  );
};
const DashBoardBox = styled.div`
  padding: 24px;
  .rightArrow {
    cursor: pointer;
  }
`;

export default SubsDashboard;
