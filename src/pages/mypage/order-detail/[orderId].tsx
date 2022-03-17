import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FlexRow, theme, FlexBetween, FlexCol, FlexBetweenStart, FlexColEnd, FlexEnd } from '@styles/theme';
import { TextH4B, TextB3R, TextB1R, TextB2R, TextH5B, TextH6B } from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import PaymentItem from '@components/Pages/Payment/PaymentItem';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { Obj } from '@model/index';
import { useToast } from '@hooks/useToast';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { DeliveryInfoSheet } from '@components/BottomSheet/DeliveryInfoSheet';
import { CalendarSheet } from '@components/BottomSheet/CalendarSheet';
import { orderForm } from '@store/order';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { IOrderMenus } from '@model/index';
import { deliveryStatusMap, deliveryDetailMap } from '@pages/mypage/order-delivery-history';
import getCustomDate from '@utils/getCustomDate';
import { OrderDetailInfo } from '@components/Pages/Mypage/OrderDelivery';
// temp

const disabledDates = ['2022-01-24', '2022-01-25', '2022-01-26', '2022-01-27', '2022-01-28'];

const otherDeliveryDate = ['2022-01-27'];

const OrderDetailPage = ({ orderId }: { orderId: number }) => {
  const [isShowOrderItemSection, setIsShowOrderItemSection] = useState<boolean>(false);

  const { showToast } = useToast();
  const { deliveryDate } = useSelector(orderForm);
  const dispatch = useDispatch();

  const router = useRouter();

  const { data, isLoading } = useQuery(
    'getOrderDetail',
    async () => {
      // const { data } = await getOrderDetail(id);

      /* temp */

      const { data } = await axios.get(`${BASE_URL}/orderList`);
      return data.data.orders.find((item: any) => item.id === Number(orderId));
    },
    {
      onSuccess: (data) => {},

      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const deliveryStatus = deliveryStatusMap[data?.deliveryStatus];
  const deliveryDetail = deliveryDetailMap[data?.deliveryDetail];
  const isCompleted = data?.deliveryStatus === 'COMPLETED';
  const isCanceled = data?.deliveryStatus === 'CANCELED';
  const isDelivering = data?.deliveryStatus === 'DELIVERING';

  const isSpot = data?.deliveryStatus === 'SPOT';
  const isParcel = data?.deliveryStatus === 'PARCEL';

  const { dateFormatter: deliveryAt } = getCustomDate(new Date(data?.deliveryDate));

  const showSectionHandler = () => {
    setIsShowOrderItemSection(!isShowOrderItemSection);
  };

  const deliveryInfoSheetHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerText } = e.target as HTMLDivElement;
    dispatch(
      SET_BOTTOM_SHEET({
        content: <DeliveryInfoSheet title="운송장번호" copiedValue={innerText} />,
      })
    );
  };

  const deliveryDescription = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERING': {
        return (
          <FlexBetween width="100%">
            <FlexRow>
              <SVGIcon name="delivery" />
              <TextB2R color={theme.greyScale65} padding="4px 0 0 4px">
                운송장번호
              </TextB2R>
              <TextH5B
                color={theme.brandColor}
                padding="4px 0 0 4px"
                textDecoration="underline"
                onClick={deliveryInfoSheetHandler}
              >
                복사복사
              </TextH5B>
            </FlexRow>
          </FlexBetween>
        );
      }
      case 'PREPARING': {
        return (
          <>
            <SVGIcon name="delivery" />
            <TextB3R color={theme.greyScale65} padding="4px 0 0 4px">
              배송중 단계부터 배송상태 확인이 가능합니다.
            </TextB3R>
          </>
        );
      }
      default:
        return;
    }
  };

  const deliveryInfoRenderer = () => {
    const { receiverName, receiverTel, location } = data;
    console.log(data, '@');
    return (
      <>
        <FlexBetween>
          <TextH4B>배송정보</TextH4B>
        </FlexBetween>
        <FlexCol padding="24px 0 0 0">
          <FlexBetween>
            <TextH5B>받는 사람</TextH5B>
            <TextB2R>{receiverName}</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0 0 0">
            <TextH5B>휴대폰 번호</TextH5B>
            <TextB2R>{receiverTel}</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0 0 0">
            <TextH5B>배송방법</TextH5B>
            <TextB2R>스팟배송 - 점심</TextB2R>
          </FlexBetween>
          <FlexBetweenStart margin="16px 0 24px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>11월 12일 (금) 11:30-12:00</TextB2R>
              <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>{isSpot ? '픽업장소' : '배송지'}</TextH5B>
            {isSpot ? (
              <FlexColEnd>
                <TextB2R>
                  {location.address} {location.addressDetail}
                </TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            ) : (
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB2R>{location.addressDetail}</TextB2R>
              </FlexColEnd>
            )}
          </FlexBetweenStart>
          {isParcel && (
            <FlexBetweenStart margin="16px 0 24px 0">
              <TextH5B>출입방법</TextH5B>
              <FlexColEnd>
                <TextB2R>공동현관 비밀번호</TextB2R>
                <TextB2R>#1099</TextB2R>
              </FlexColEnd>
            </FlexBetweenStart>
          )}
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={isCanceled}
            onClick={changeDeliveryInfoHandler}
          >
            배송 정보 변경하기
          </Button>
        </FlexCol>
      </>
    );
  };

  const changeDeliveryInfoHandler = () => {
    router.push({
      pathname: '/mypage/order-detail/edit/[orderId]',
      query: { orderId: 1 },
    });
  };

  const cancelOrderHandler = () => {
    dispatch(
      SET_ALERT({
        alertMessage: '주문을 취소하시겠어요?',
        onSubmit: () => cancelOrder(),
        closeBtnText: '취소',
      })
    );
  };

  const cancelOrder = async () => {};

  const changeDevlieryDateHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <CalendarSheet title="배송일 변경" disabledDates={disabledDates} deliveryDate="2022-02-24" isSheet />,
      })
    );
  };

  // const disabledButton = status === 'cancel';
  // const inProgressDelivery = status === 'progress';

  if (isLoading) {
    return <div>로딩</div>;
  }

  console.log(deliveryAt, 'deliveryAt');
  return (
    <Container>
      <DeliveryStatusWrapper>
        <FlexRow padding="0 0 13px 0">
          <TextH4B color={theme.black}>{deliveryStatus}</TextH4B>
          <TextB1R padding="0 0 0 4px">{deliveryAt} 도착예정</TextB1R>
        </FlexRow>
        <FlexRow>{deliveryDescription(data.deliveryStatus)}</FlexRow>
      </DeliveryStatusWrapper>
      <BorderLine height={8} />
      <OrderItemsWrapper>
        <FlexBetween>
          <TextH4B>주문상품</TextH4B>
          <FlexRow onClick={() => showSectionHandler()}>
            <SVGIcon name={isShowOrderItemSection ? 'triangleUp' : 'triangleDown'} />
          </FlexRow>
        </FlexBetween>
        <OrderListWrapper isShow={isShowOrderItemSection} status={deliveryStatus}>
          {data.menus?.map((menu: IOrderMenus, index: number) => {
            return <PaymentItem menu={menu} key={index} isDeliveryComplete={isCompleted} />;
          })}
          <Button backgroundColor={theme.white} color={theme.black} border margin="8px 0 0 0">
            재주문하기
          </Button>
        </OrderListWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <OrderInfoWrapper>
        <TextH4B>주문자 정보</TextH4B>
        <FlexCol padding="24px 0 0 0">
          <FlexBetween>
            <TextH5B>주문 번호</TextH5B>
            <TextB2R>{data.id}</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0">
            <TextH5B>주문 상태</TextH5B>
            <TextB2R>{deliveryStatus}</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>주문(결제)일시</TextH5B>
            <TextB2R>{data.paidAt}</TextB2R>
          </FlexBetween>
        </FlexCol>
        <ButtonWrapper>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 16px 0 0"
            disabled={false}
            onClick={cancelOrderHandler}
          >
            주문 취소하기
          </Button>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={isCanceled}
            onClick={changeDevlieryDateHandler}
          >
            배송일 변경하기
          </Button>
        </ButtonWrapper>
      </OrderInfoWrapper>
      <BorderLine height={8} />
      <DevlieryInfoWrapper>{/* <OrderDetailInfo /> */}</DevlieryInfoWrapper>
      <BorderLine height={8} />
      <TotalPriceWrapper>
        <TextH4B padding="0 0 24px 0">결제정보</TextH4B>
        <FlexBetween>
          <TextH5B>총 상품 금액</TextH5B>
          <TextB2R>222원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>총 할인 금액</TextH5B>
          <TextB2R>22원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>상품 할인</TextB2R>
          <TextB2R>22원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>스팟 이벤트 할인</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>쿠폰 사용</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>배송비</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>배송비 할인</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 결제금액</TextH4B>
          <TextH4B>12312원</TextH4B>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            프코 회원
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
          <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
        </FlexEnd>
      </TotalPriceWrapper>
      <BorderLine height={8} />
      <RefundInfoWrapper>
        <TextH4B padding="0 0 24px 0">환불정보</TextH4B>
        <FlexBetween>
          <TextH5B>총 상품 금액</TextH5B>
          <TextB2R>222원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>총 할인 금액</TextH5B>
          <TextB2R>22원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>배송비</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>총 결제 금액</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>환불 포인트</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 환불금액</TextH4B>
          <TextH4B>12312원</TextH4B>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            프코 회원
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
          <TextH6B>n 포인트 (n%) 취소 예정</TextH6B>
        </FlexEnd>
      </RefundInfoWrapper>
    </Container>
  );
};

const Container = styled.div``;

const DeliveryStatusWrapper = styled.div`
  padding: 24px;
`;

const OrderItemsWrapper = styled.div`
  padding: 24px;
`;

const OrderListWrapper = styled.div<{ isShow: boolean; status: string }>`
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
  flex-direction: column;
  padding: 24px 0 0 0;
  color: ${({ status }) => (status === 'cancel' ? theme.greyScale25 : '')};
  .percent {
    color: ${({ status }) => (status === 'cancel' ? theme.greyScale25 : '')};
  }
`;

const OrderInfoWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 24px;
`;

const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;

const TotalPriceWrapper = styled.div`
  padding: 24px;
`;

const RefundInfoWrapper = styled.div`
  padding: 24px;
`;

/* TODO: getServerSideProps아니라 static인 거 같은데  */
export async function getServerSideProps(context: any) {
  const { orderId } = context.query;

  return {
    props: { orderId },
  };
}

export default OrderDetailPage;
