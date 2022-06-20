import { getOrderDetailApi } from '@api/order';
import SubsCalendar from '@components/Calendar/subscription/SubsCalendar';
import SubsMngCalendar from '@components/Calendar/subscription/SubsMngCalendar';
import { SubsDetailOrderBox } from '@components/Pages/Subscription/detail';
import SubsDetailOrderInfo from '@components/Pages/Subscription/detail/SubsDetailOrderInfo';
import { SubsInfoBox, SubsOrderItem } from '@components/Pages/Subscription/payment';
import MenusPriceBox from '@components/Pages/Subscription/payment/MenusPriceBox';
import { Label } from '@components/Pages/Subscription/SubsCardItem';
import BorderLine from '@components/Shared/BorderLine';
import { Button } from '@components/Shared/Button';
import { TextB2R, TextB3R, TextH4B, TextH5B, TextH6B } from '@components/Shared/Text';
import { SUBS_MNG_STATUS } from '@constants/subscription';
import useOptionsPrice from '@hooks/subscription/useOptionsPrice';
import useSubsStatus from '@hooks/subscription/useSubsStatus';
import { subscriptionForm, SUBS_INIT } from '@store/subscription';
import { FlexBetween, FlexBetweenStart, FlexColEnd, FlexEnd, FlexRow, theme } from '@styles/theme';
import { getFormatDate, SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
dayjs.locale('ko');

const SubsDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subsCalendarSelectOrders } = useSelector(subscriptionForm);
  const [detailId, setDetailId] = useState<number>();
  const [menuId, setMenuId] = useState<number>();
  const [deliveryDay, setDeliveryDay] = useState<any>();
  const [regularPaymentDate, setRegularPaymentDate] = useState<number>();
  const [options, setOptions] = useState({});
  useEffect(() => {
    if (router.isReady) {
      setDetailId(Number(router.query?.detailId));
      setMenuId(Number(router.query?.menuId));
    }
  }, [router.isReady]);

  const {
    data: orderDetail,
    error,
    isLoading,
  } = useQuery(
    ['getOrderDetail', detailId],
    async () => {
      const { data } = await getOrderDetailApi(detailId!);
      data.data.orderDeliveries.sort(
        (a, b) => Number(a.deliveryDate.replaceAll('-', '')) - Number(b.deliveryDate.replaceAll('-', ''))
      );

      return data.data;
    },
    {
      onSuccess: (data) => {
        let pickupDayObj = new Set();
        data.orderDeliveries.forEach((o) => {
          pickupDayObj.add(dayjs(o.deliveryDate).format('dd'));
        });
        setDeliveryDay(Array.from(pickupDayObj));

        if ([30, 31, 1, 2].includes(Number(dayjs(data.orderDeliveries[0].deliveryDate).format('DD')))) {
          //첫 구독시작일이 [30일, 31일, 1일, 2일]일때 자동결제일: 27일
          setRegularPaymentDate(27);
        } else {
          //첫 구독시작일이 3일 ~ 29일 이면 자동결제일: D-2
          setRegularPaymentDate(Number(dayjs(data.orderDeliveries[0].deliveryDate).format('DD')) - 2);
        }
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!detailId,
    }
  );

  const status = useSubsStatus(orderDetail?.status!);
  const optionsPrice = useOptionsPrice(orderDetail?.orderDeliveries!);

  const reorderHandler = () => {
    router.push({
      pathname: '/subscription/set-info',
      query: { subsDeliveryType: orderDetail?.delivery, menuId: menuId ?? null },
    });
  };

  const paymentChangeHandler = () => {
    router.push({
      pathname: '/mypage/card',
      query: { isOrder: true, orderId: orderDetail?.id },
    });
  };

  if (isLoading) return <div>...로딩중</div>;

  return (
    <Container>
      <InfoBox>
        <TextH4B padding="0 0 24px 0">
          {status} {orderDetail?.subscriptionPeriod === 'UNLIMITED' && `- ${orderDetail.subscriptionRound}회차`}
        </TextH4B>
        <SubsOrderItem
          deliveryType={orderDetail?.delivery!}
          deliveryDetail={orderDetail?.deliveryDetail}
          subscriptionPeriod={orderDetail?.subscriptionPeriod!}
          name={orderDetail?.name!}
          menuImage={orderDetail?.image.url!}
        />
      </InfoBox>

      <BorderLine height={8} />

      <DietConfirmBox>
        <TextH4B>식단 확인</TextH4B>
        <TextH6B color={theme.greyScale65} pointer textDecoration="underline">
          전체 식단 보기
        </TextH6B>
      </DietConfirmBox>

      {orderDetail && <SubsMngCalendar orderDeliveries={orderDetail?.orderDeliveries} />}
      {subsCalendarSelectOrders && (
        <SubsDetailOrderInfo status={orderDetail?.status!} subscriptionPeriod={orderDetail?.subscriptionPeriod!} />
      )}

      <BorderLine height={8} />

      <SubsInfoBox
        subscriptionRound={orderDetail?.subscriptionRound!}
        deliveryDayLength={deliveryDay?.length}
        deliveryDay={deliveryDay?.join('·')}
        datePeriodFirst={getFormatDate(orderDetail?.orderDeliveries[0].deliveryDate)!}
        datePeriodLast={
          getFormatDate(orderDetail?.orderDeliveries[orderDetail?.orderDeliveries.length - 1].deliveryDate)!
        }
      />

      <BorderLine height={8} />

      <OrderInfoBox>
        <TextH4B padding="0 0 24px 0">주문정보</TextH4B>
        <FlexBetween padding="0 0 16px">
          <TextH5B>주문번호</TextH5B>
          <TextB2R>{orderDetail?.id}</TextB2R>
        </FlexBetween>
        <FlexBetween padding="0 0 16px">
          <TextH5B>주문상태</TextH5B>
          <TextB2R>{SUBS_MNG_STATUS[orderDetail?.status!]}</TextB2R>
        </FlexBetween>
        {orderDetail?.status !== 'UNPAID' && (
          <FlexBetween padding="0 0 16px">
            <TextH5B>결제일시</TextH5B>
            <TextB2R>{orderDetail?.paidAt}</TextB2R>
          </FlexBetween>
        )}
        {orderDetail?.subscriptionPeriod === 'UNLIMITED' ? (
          <FlexBetweenStart padding="0 0 24px">
            <TextH5B>결제수단</TextH5B>
            <FlexColEnd>
              <TextB2R>정기결제 / 신용카드</TextB2R>
              <TextB3R color="#717171">
                다음 결제일은 {dayjs().add(1, 'month').format('M')}월 {regularPaymentDate}일 입니다.
              </TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
        ) : (
          <FlexBetween padding="0 0 16px">
            <TextH5B>결제수단</TextH5B>
            <TextB2R>신용카드</TextB2R>
          </FlexBetween>
        )}
        <Button
          onClick={paymentChangeHandler}
          backgroundColor="#fff"
          color="#242424"
          border
          disabled={orderDetail?.status === 'COMPLETED' || orderDetail?.status === 'CANCELED' ? true : false}
        >
          결제수단 변경하기
        </Button>
      </OrderInfoBox>

      <BorderLine height={8} />

      <TextH4B padding="24px 24px 0 24px">결제정보</TextH4B>
      <MenusPriceBox
        disposable={true}
        menuPrice={orderDetail?.menuAmount!}
        menuDiscount={orderDetail?.menuDiscount!}
        eventDiscount={orderDetail?.eventDiscount!}
        menuOption1={optionsPrice.option1}
        menuOption2={optionsPrice.option2}
        deliveryPrice={orderDetail?.deliveryFee! - orderDetail?.deliveryFeeDiscount!}
        deliveryLength={orderDetail?.orderDeliveries.length!}
        point={orderDetail?.point!}
        type="management"
        deliveryType={orderDetail?.delivery!}
      />

      <BorderLine height={8} />

      <FlexRow padding="24px">
        {orderDetail?.status === 'CANCELED' ? (
          <Button backgroundColor="#fff" color="#242424" border onClick={reorderHandler}>
            재주문하기
          </Button>
        ) : (
          <Button backgroundColor="#fff" color="#242424" border>
            주문 취소하기
          </Button>
        )}
      </FlexRow>
    </Container>
  );
};
const Container = styled.div`
  ul.SubsDetailOrderWrapper {
    /* padding: 0 24px; */
    > li {
      border-top: 1px solid #f2f2f2;
      &:first-of-type {
        border-top: none;
      }
    }
  }
`;
const InfoBox = styled.div`
  padding: 24px;
`;
const DietConfirmBox = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// const SubsInfoBox = styled.div`
//   padding: 24px;
// `;
const OrderInfoBox = styled.div`
  padding: 24px;
`;
const PaymentInfoBox = styled.div`
  padding: 24px;
  .bbN {
    border-bottom: 1px solid #ececec;
  }
  .bbB {
    border-bottom: 1px solid #242424;
  }
  svg {
    margin-bottom: 3px;
  }
`;
export default SubsDetailPage;