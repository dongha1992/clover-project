import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { TextH6B } from '@components/Shared/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding } from '@styles/theme';
import { OrderDeliveryItem } from '@components/Pages/Mypage/OrderDelivery';
import BorderLine from '@components/Shared/BorderLine';
import { IGetOrderList, IGetOrderListResponse, Obj } from '@model/index';
import { useInfiniteOrderList } from '@queries/mypage';

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

const DEFAULT_SIZE = 10;

const OrderDeliveryHistoryPage = () => {
  const dispatch = useDispatch();
  const [withInDays, setWithInDays] = useState<string>('90');
  const [page, setPage] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const option = {
    root: parentRef?.current!, // 관찰대상의 부모요소를 지정
    rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0,
  };

  // const { data, isLoading } = useQuery(
  //   ['getOrderLists', withInDays],
  //   async () => {
  //     const params = {
  //       days: Number(withInDays),
  //       page: 1,
  //       size: 10,
  //       orderType: 'GENERAL',
  //     };

  //     const { data } = await getOrderListsApi(params);

  //     /*TODO: 정기구독이랑 묶일 경우 type="SUB" */

  //     return data.data.orderDeliveries;
  //   },
  //   {
  //     onSuccess: (data) => {},

  //     refetchOnMount: true,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, isLoading } = useInfiniteOrderList({
    withInDays,
    orderType: 'GENERAL',
    size: DEFAULT_SIZE,
    page,
  });

  console.log(page, 'page');

  const clickFilterHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <OrderDateFilter handler={setWithInDays} />,
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

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    console.log(target, 'target');
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, option);

    if (ref?.current) {
      observer.observe(ref?.current);
    }
    return () => observer && observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page <= data?.pages[0]?.totalPage!) {
      fetchNextPage();
    }
  }, [page]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container ref={parentRef}>
      <FlexEnd onClick={clickFilterHandler} padding="16px 0">
        <SVGIcon name="filter" />
        <TextH6B padding="0 0 0 4px">정렬</TextH6B>
      </FlexEnd>
      {data?.pages[0]?.result?.length !== 0 ? (
        data?.pages.map((page: any, index: number) => {
          return (
            <List key={index}>
              {page?.result.map((item: IGetOrderList, index: number) => {
                return (
                  <FlexCol key={index}>
                    <OrderDeliveryItem orderDeliveryItem={item} buttonHandler={buttonHandler} />
                    {page.result - 1 !== index && <BorderLine height={1} margin="24px 0" />}
                  </FlexCol>
                );
              })}
            </List>
          );
        })
      ) : (
        <div>none</div>
      )}
      <div className="last" ref={ref}></div>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const List = styled.div``;

export default OrderDeliveryHistoryPage;
