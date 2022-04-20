import React from 'react';
import { TextH4B, TextB2R, TextH3B, TextB4R } from '@components/Shared/Text';
import { FlexCol, FlexRow, theme, FlexBetween, FlexColCenter } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import styled from 'styled-components';

import router from 'next/router';

interface IDeliveryList {
  DELIVERING?: any[];
  COMPLETED?: any[];
  PREPARING?: any[];
  RESERVED?: any[];
}

interface IProps {
  deliveryList: IDeliveryList[];
  total: number;
}

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
        <FlexBetween padding="0 24px">
          <FlexColCenter>
            <TextH3B>{deliveryList['RESERVED']?.length || 0}</TextH3B>
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
  padding: 20px 21px 15px 21px;
`;

const ArrowWrapper = styled.div`
  padding-bottom: 16px;
`;

export default OrderDashboard;
