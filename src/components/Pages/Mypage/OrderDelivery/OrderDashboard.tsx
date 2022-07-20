import React from 'react';
import { TextH4B, TextB2R, TextH3B, TextB4R } from '@components/Shared/Text';
import { FlexCol, FlexRow, theme, FlexBetween, FlexColCenter } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';
import { IGetOrderInfo } from '@model/index';
import router from 'next/router';
import { isNil } from 'lodash-es';

interface IProps {
  orderList: IGetOrderInfo;
}

const OrderDashboard = ({ orderList }: IProps) => {
  const { reservedCount, preparingCount, deliveringCount, completedCount, canceledCount } = orderList;
  const total = reservedCount + preparingCount + deliveringCount + completedCount;

  return (
    <Container>
      <FlexCol>
        <FlexBetween pointer onClick={() => router.push('/mypage/order-delivery-history')}>
          <TextH4B>주문/배송 내역</TextH4B>
          <FlexRow>
            <TextB2R padding="0 8px 0 0" pointer>
              {total} 건
            </TextB2R>
            <div>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </FlexCol>
      <Wrapper>
        <FlexBetween padding="0 24px">
          <FlexColCenter>
            <TextH3B>{reservedCount}</TextH3B>
            <TextB4R color={theme.greyScale65}>주문완료</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{preparingCount}</TextH3B>
            <TextB4R color={theme.greyScale65}>상품준비중</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{deliveringCount}</TextH3B>
            <TextB4R color={theme.greyScale65}>배송중</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{completedCount ?? 0}</TextH3B>
            <TextB4R color={theme.greyScale65}>배송완료</TextB4R>
          </FlexColCenter>
        </FlexBetween>
      </Wrapper>
    </Container>
  );
};
const Container = styled.div`
  padding-bottom: 24px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: ${theme.greyScale3};
    bottom: 0;
    left: 0;
  }
`;
const Wrapper = styled.div`
  background-color: ${theme.greyScale3};
  margin-top: 15px;
  border-radius: 8px;
  padding: 20px 21px 15px 21px;
`;

const ArrowWrapper = styled.div`
  padding-bottom: 16px;
`;

export default React.memo(OrderDashboard);
