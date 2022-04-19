import React, { useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@components/Shared/Button';
import { fixedBottom, homePadding, FlexBetween, FlexCol } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import SVGIcon from '@utils/SVGIcon';
import { TextB2R, TextH2B, TextB3R, TextH4B } from '@components/Shared/Text';
import router from 'next/router';
import { theme } from '@styles/theme';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch } from 'react-redux';
import BorderLine from '@components/Shared/BorderLine';
import { ItemInfo } from '@components/Pages/Mypage/OrderDelivery';

interface IProps {
  name: string;
  url: string;
  payAmount: number;
  orderId: number;
}

const OrderCancelSheet = ({ url, name, payAmount, orderId }: IProps) => {
  const dispatch = useDispatch();

  return (
    <Container>
      <Header>
        <FlexBetween margin="16px 0 0 0">
          <div />
          <TextH4B>취소완료</TextH4B>
          <div
            onClick={() => {
              dispatch(INIT_BOTTOM_SHEET());
            }}
          >
            <SVGIcon name="defaultCancel24" />
          </div>
        </FlexBetween>
      </Header>
      <Body>
        <FlexCol>
          <FlexCol margin="0 0 16px 0 ">
            <TextH2B>주문취소가 정상적으로</TextH2B>
            <TextH2B>완료되었어요.</TextH2B>
          </FlexCol>
          <FlexCol>
            <TextB3R color={theme.greyScale65}>마이 {'>'} 주문/배송 내역에서</TextB3R>
            <TextB3R color={theme.greyScale65}>취소 내역을 확인하실 수 있어요 </TextB3R>
          </FlexCol>
        </FlexCol>
        <BorderLine height={8} margin="72px 0 24px 0" />
        <TextH4B padding="0 0 24px 0" color={theme.greyScale65}>
          취소완료
        </TextH4B>
        <ItemInfo url={url} name={name} amount={payAmount} />
      </Body>
      <BtnWrapper onClick={() => dispatch(INIT_BOTTOM_SHEET())}>
        <Button height="100%">주문상세보기</Button>
      </BtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding};
  height: 90vh;
  width: 100%;
`;
const Header = styled.div`
  height: 56px;
`;
const Body = styled.div``;

const BtnWrapper = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: calc(0%);
  background-color: ${({ theme }) => theme.black};

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0px;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

export default OrderCancelSheet;
