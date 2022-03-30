import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { TextH6B } from '@components/Shared/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding } from '@styles/theme';
import { OrderDeliveryItem } from '@components/Pages/Mypage/OrderDelivery';
import BorderLine from '@components/Shared/BorderLine';
import { commonSelector } from '@store/common';
import { useQuery } from 'react-query';
import { IGetOrderList, IGetOrderListResponse, Obj } from '@model/index';
import { getOrderListsApi } from '@api/order';

const OrderDateFilter = dynamic(() => import('@components/Filter/OrderDateFilter'));

export const deliveryStatusMap: Obj = {
  COMPLETED: '배송완료',
  CANCELED: '주문취소',
  RESERVED: '주문완료',
  DELIVERING: '배송중',
  PREPARING: '상품준비 중',
};

export const deliveryDetailMap: Obj = {
  LUNCH: '점심',
  DINNER: '저녁',
};

const OrderDeliveryHistoryPage = () => {
  const dispatch = useDispatch();
  const { withInDays } = useSelector(commonSelector);

  const { data, isLoading } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        days: 90,
        page: 1,
        size: 10,
        type: 'GENERAL',
      };

      const { data } = await getOrderListsApi(params);

      /*TODO: 정기구독이랑 묶일 경우 type="SUB" */

      return data.data.orderDeliveries;
    },
    {
      onSuccess: (data) => {},

      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <OrderDateFilter />,
      })
    );
  };

  const buttonHandler = ({ id, isDelivering }: { id: number; isDelivering: boolean }) => {
    if (isDelivering) {
      // 장바구니 담기
    } else {
      // 배송조회
    }
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <Wrapper>
        <FlexEnd onClick={clickFilterHandler} padding="16px 0">
          <SVGIcon name="filter" />
          <TextH6B padding="0 0 0 4px">정렬</TextH6B>
        </FlexEnd>
        <FlexCol>
          {data?.map((item: IGetOrderList, index: number) => (
            <FlexCol key={index}>
              <OrderDeliveryItem orderDeliveryItem={item} buttonHandler={buttonHandler} />
              {data?.length - 1 !== index && <BorderLine height={1} margin="24px 0" />}
            </FlexCol>
          ))}
        </FlexCol>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div``;
const Wrapper = styled.div`
  ${homePadding}
`;

export default OrderDeliveryHistoryPage;
