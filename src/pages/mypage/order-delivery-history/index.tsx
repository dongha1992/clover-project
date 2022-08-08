import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { SVGIcon } from '@utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { TextH6B, TextB2R } from '@components/Shared/Text';
import dynamic from 'next/dynamic';
import { FlexCol, FlexEnd, homePadding, theme } from '@styles/theme';
import { OrderDeliveryItem } from '@components/Pages/Mypage/OrderDelivery';
import BorderLine from '@components/Shared/BorderLine';
import { IGetOrderList, IOrderMenusInOrderList, Obj } from '@model/index';
import { useInfiniteOrderList } from '@queries/mypage';
import { Button } from '@components/Shared/Button';
import router from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { postCartsApi } from '@api/cart';
import { useToast } from '@hooks/useToast';
import { SET_ALERT } from '@store/alert';

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

const DEFAULT_SIZE = 100;

const OrderDeliveryHistoryPage = () => {
  const dispatch = useDispatch();
  const [withInDays, setWithInDays] = useState<string>('90');
  const [page, setPage] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  const option = {
    root: parentRef?.current!, // 관찰대상의 부모요소를 지정
    rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0,
  };

  const queryClient = useQueryClient();

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

  const { mutateAsync: mutateAddCartItem } = useMutation(
    async (menus: IOrderMenusInOrderList[]) => {
      const reqBody = menus?.map((item) => {
        return {
          menuId: item.menuId!,
          menuDetailId: item.menuDetailId,
          quantity: item.menuQuantity,
          main: true,
        };
      });

      const { data } = await postCartsApi(reqBody!);
    },
    {
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '장바구니 담기에 실패했어요' }));
      },
      onSuccess: async () => {
        showToast({ message: '상품을 장바구니에 담았어요! 😍' });
        await queryClient.refetchQueries('getCartList');
        await queryClient.refetchQueries('getCartCount');
      },
    }
  );

  const buttonHandler = ({ menus, isDelivering }: { menus: IOrderMenusInOrderList[]; isDelivering: boolean }) => {
    if (isDelivering) {
      // 배송조회
    } else {
      // 장바구니 담기
      mutateAddCartItem(menus);
    }
  };

  const goToShop = () => {
    router.push('/');
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];

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
        <NoSubsBox>
          <FlexCol width="100%">
            <TextB2R padding="0 0 24px" color={theme.greyScale65} center>
              주문/배송 내역이 없어요 😭
            </TextB2R>
            <Button backgroundColor="#fff" color="#242424" width="100%" border onClick={goToShop}>
              상품 보러가기
            </Button>
          </FlexCol>
        </NoSubsBox>
      )}
      <div className="last" ref={ref}></div>
    </Container>
  );
};

const Container = styled.div`
  ${homePadding}
`;

const List = styled.div``;
const NoSubsBox = styled.div`
  height: calc(100vh - 104px);
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

export default OrderDeliveryHistoryPage;
