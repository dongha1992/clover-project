import React from 'react';
import { TextH4B, TextB2R, TextH3B, TextB4R } from '@components/Shared/Text';
import { FlexCol, FlexRow, theme, FlexBetween, FlexColCenter } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';
import styled from 'styled-components';

import router from 'next/router';

interface IDeliveryList {
  PROGRESS?: any[];
  COMPLETED?: any[];
  CANCELD?: any[];
  PREPARING?: any[];
  DELIVERING?: any[];
}

interface IProps {
  deliveryList: IDeliveryList[];
  total: number;
}

/* TODO: deliveryStatus인지 status인지 확인 */

const OrderDashboard = ({ deliveryList, total }: IProps) => {
  return (
    <>
      <FlexCol>
        <FlexBetween>
          <TextH4B>주문/배송 내역</TextH4B>
          <FlexRow>
            <TextB2R padding="0 8px 0 0">{total} 건</TextB2R>
            <div onClick={() => router.push('/mypage/order-delivery-history')}>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </FlexCol>
      <Wrapper>
        <FlexBetween padding="20px 21px 15px 21px">
          <FlexColCenter>
            <TextH3B>{deliveryList['PROGRESS']?.length || 0}</TextH3B>
            <TextB4R color={theme.greyScale65}>주문완료</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{deliveryList['PREPARING']?.length || 0}</TextH3B>
            <TextB4R color={theme.greyScale65}>상품준비중</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{deliveryList['DELIVERING']?.length || 0}</TextH3B>
            <TextB4R color={theme.greyScale65}>배송중</TextB4R>
          </FlexColCenter>
          <ArrowWrapper>
            <SVGIcon name="arrowRightGrey" />
          </ArrowWrapper>
          <FlexColCenter>
            <TextH3B>{deliveryList['COMPLETED']?.length || 0}</TextH3B>
            <TextB4R color={theme.greyScale65}>배송완료</TextB4R>
          </FlexColCenter>
        </FlexBetween>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  background-color: ${theme.greyScale3};
  margin-top: 15px;
  border-radius: 8px;
`;

const ArrowWrapper = styled.div`
  padding-bottom: 16px;
`;

export default OrderDashboard;
