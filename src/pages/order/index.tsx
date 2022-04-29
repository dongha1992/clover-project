import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import {
  homePadding,
  FlexBetween,
  FlexEnd,
  theme,
  FlexRow,
  FlexCol,
  FlexColEnd,
  FlexBetweenStart,
  GridWrapper,
  fixedBottom,
} from '@styles/theme';
import { TextB2R, TextH4B, TextB3R, TextH6B, TextH5B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import Checkbox from '@components/Shared/Checkbox';
import { SVGIcon } from '@utils/common';
import { OrderItem } from '@components/Pages/Order';
import TextInput from '@components/Shared/TextInput';
import { useRouter } from 'next/router';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { commonSelector } from '@store/common';
import { couponForm } from '@store/coupon';
import { ACCESS_METHOD_PLACEHOLDER } from '@constants/order';
import { destinationForm } from '@store/destination';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
import { createOrderPreviewApi, createOrderApi } from '@api/order';
import { useQuery } from 'react-query';
import { isNil } from 'lodash-es';
import { Obj, IGetCard, ILocation, ICoupon, ICreateOrder } from '@model/index';
import { DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/order';
import { getCustomDate } from '@utils/destination';
import { OrderCouponSheet } from '@components/BottomSheet/OrderCouponSheet';
import { useMutation, useQueryClient } from 'react-query';
import { orderForm } from '@store/order';
import SlideToggle from '@components/Shared/SlideToggle';
import { SubsOrderItem, SubsOrderList, SubsPaymentMethod } from '@components/Pages/Subscription/payment';

/* TODO: access method 컴포넌트 분리 가능 나중에 리팩토링 */
/* TODO: 배송 출입 부분 함수로 */
/* TODO: 결제 금액 부분 함수로 */
/* TODO: 배송예정 어떻게? */
/* TODO: 출입 방법 input userDestination에 담아서 서버 콜 */

const PAYMENT_METHOD = [
  {
    id: 1,
    text: '프코페이',
    value: 'fcopay',
  },
  {
    id: 2,
    text: '신용카드',
    value: 'creditCard',
  },
  {
    id: 3,
    text: '계좌이체',
    value: 'account',
  },
  {
    id: 4,
    text: '카카오페이',
    value: 'kakaopay',
  },
  {
    id: 5,
    text: '페이코',
    value: 'payco',
  },
  {
    id: 6,
    text: '토스',
    value: 'toss',
  },
];

export interface IAccessMethod {
  id: number;
  text: string;
  value: string;
}

const OrderPage = () => {
  const [showSectionObj, setShowSectionObj] = useState({
    showOrderItemSection: false,
    showCustomerInfoSection: false,
  });
  const [selectedOrderMethod, setSelectedOrderMethod] = useState<string>('fcopay');
  const [checkForm, setCheckForm] = useState<Obj>({
    samePerson: { isSelected: false },
    accessMethodReuse: { isSelected: false },
    alwaysPointAll: { isSelected: false },
    orderMethodReuse: { isSelected: false },
  });

  const [userInputObj, setUserInputObj] = useState<{
    receiverName: string;
    receiverTel: string;
    point: number;
  }>({
    receiverName: '',
    receiverTel: '',
    point: 0,
  });
  const [loadingState, setLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { userAccessMethod } = useSelector(commonSelector);
  const { selectedCoupon } = useSelector(couponForm);
  const { tempOrder } = useSelector(orderForm);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: previewOrder, isLoading: preveiwOrderLoading } = useQuery(
    'getPreviewOrder',
    async () => {
      const { delivery, deliveryDetail, destinationId, isSubOrderDelivery, orderDeliveries, type } = tempOrder!;
      const previewBody = {
        delivery,
        deliveryDetail: deliveryDetail ? deliveryDetail : null,
        destinationId,
        isSubOrderDelivery,
        orderDeliveries,
        type,
      };

      const { data } = await createOrderPreviewApi(previewBody);
      if (data.code === 200) {
        return data.data;
      }
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { mutateAsync: mutateCreateOrder } = useMutation(
    async () => {
      const reqBody = {
        payMethod: 'NICE_BILLING',
        cardId: getMainCardHandler(previewOrder?.cards)?.id!,
        ...previewOrder?.order!,
      };

      setLoadingState(true);

      const { data } = await createOrderApi(reqBody);
      const { id: orderId } = data.data;
      return orderId;
    },
    {
      onError: () => {},
      onSuccess: async (orderId: number) => {
        router.push({ pathname: '/order/finish', query: { orderId } });
        setLoadingState(false);
      },
    }
  );

  const showSectionHandler = (selectedSection: string) => {
    if (selectedSection === 'customerInfo') {
      setShowSectionObj({
        ...showSectionObj,
        showCustomerInfoSection: !showSectionObj.showCustomerInfoSection,
      });
    } else {
      setShowSectionObj({
        ...showSectionObj,
        showOrderItemSection: !showSectionObj.showOrderItemSection,
      });
    }
  };

  const checkOrderTermHandler = () => {};

  const userInputHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;

      if (checkForm.samePerson.isSelected) {
        setCheckForm({ ...checkForm, samePerson: { isSelected: false } });
      }

      setUserInputObj({ ...userInputObj, [name]: value });
    },
    [userInputObj]
  );

  const checkFormHanlder = (name: string) => {
    setCheckForm({ ...checkForm, [name]: { isSelected: !checkForm[name].isSelected } });
  };

  const changePointHandler = (val: number): void => {
    const { point: limitPoint } = previewOrder!;

    const regex = /^[0-9]/g;
    if (!regex.test(val.toString())) return;

    if (val >= limitPoint) {
      val = limitPoint;
    }

    setUserInputObj({ ...userInputObj, point: val });
  };

  const selectAccessMethodHandler = () => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
      })
    );
  };

  const selectOrderMethodHanlder = (method: any) => {
    const { value } = method;
    setSelectedOrderMethod(value);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
  };

  const useAllOfPointHandler = () => {
    const { point: limitPoint } = previewOrder!;
    setUserInputObj({ ...userInputObj, point: limitPoint });
  };

  const deliveryDateRenderer = ({
    location,
    delivery,
    deliveryDetail,
    dayFormatter,
    spotName,
    spotPickupName,
    deliveryStartTime,
    deliveryEndTime,
  }: {
    location: ILocation;
    delivery: string;
    deliveryDetail: string;
    dayFormatter: string;
    spotName: string;
    spotPickupName: string;
    deliveryStartTime: string;
    deliveryEndTime: string;
  }) => {
    const isLunch = deliveryDetail === 'LUNCH';

    const deliveryTimeInfo = `${deliveryStartTime}-${deliveryEndTime}`;

    switch (delivery) {
      case 'PARCEL': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정일시</TextH5B>
              <FlexColEnd>
                <TextB2R>{dayFormatter}</TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>배송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'MORNING': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>{dayFormatter} 00:00-07:00</TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>배송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'QUICK': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {dayFormatter} {isLunch ? '11:30-12:00' : '15:30-18:00'}
                </TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>배송지</TextH5B>
              <FlexColEnd>
                <TextB2R>{location.address}</TextB2R>
                <TextB3R color={theme.greyScale65}>{location.addressDetail}</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
      case 'SPOT': {
        return (
          <>
            <FlexBetweenStart margin="16px 0">
              <TextH5B>배송 예정실시</TextH5B>
              <FlexColEnd>
                <TextB2R>
                  {dayFormatter} {deliveryTimeInfo}
                </TextB2R>
                <TextB3R color={theme.greyScale65}>예정보다 빠르게 배송될 수 있습니다.</TextB3R>
                <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
              </FlexColEnd>
            </FlexBetweenStart>
            <FlexBetweenStart>
              <TextH5B>픽업장소</TextH5B>
              <FlexColEnd>
                <FlexRow>
                  <TextB3R>
                    {spotName} {spotPickupName}
                  </TextB3R>
                </FlexRow>
                <FlexRow>
                  <TextB3R color={theme.greyScale65} margin="0 4px 0 0">
                    ({location.zipCode})
                  </TextB3R>
                  <TextB3R color={theme.greyScale65}>{location.address}</TextB3R>
                </FlexRow>
              </FlexColEnd>
            </FlexBetweenStart>
          </>
        );
      }
    }
  };

  const cancelOrderInfoRenderer = (delivery: string, deliveryDetail: string) => {
    const isLunch = deliveryDetail === 'LUNCH';

    switch (delivery) {
      case 'QUICK':
      case 'SPOT': {
        return (
          <>
            <TextB3R color={theme.brandColor}>주문 변경 및 취소는 수령일 당일 오전 7시까지 가능해요!</TextB3R>
            <TextB3R color={theme.brandColor}>
              단, 수령일 오전 7시~{isLunch ? '9시 25' : '10시 55'}분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및
              취소할 수 있어요!
            </TextB3R>
          </>
        );
      }
      case 'PARCEL':
      case 'MORNING': {
        return (
          <>
            <TextB3R color={theme.brandColor}>주문 변경 및 취소는 수령일 하루 전 오후 3시까지 가능해요!</TextB3R>
            <TextB3R color={theme.brandColor}>
              단, 수령일 오후 3시~4시 55분 사이에 주문하면 주문완료 후 5분 이내로 주문 변경 및 취소할 수 있어요!
            </TextB3R>
          </>
        );
      }
    }
  };

  const couponHandler = (coupons: ICoupon[]) => {
    dispatch(SET_BOTTOM_SHEET({ content: <OrderCouponSheet coupons={coupons} /> }));
  };

  const clearPointHandler = () => {
    setUserInputObj({ ...userInputObj, point: 0 });
  };

  const goToCardManagemnet = (card: IGetCard) => {
    router.push('/mypage/card');
  };

  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };

  const goToTermInfo = () => {};

  const getMainCardHandler = (cards: IGetCard[] = []) => {
    return cards.find((c) => c.main);
  };

  const paymentHandler = () => {
    if (loadingState) return;
    mutateCreateOrder();
  };

  useEffect(() => {
    const { isSelected } = checkForm.samePerson;

    if (previewOrder?.order && isSelected) {
      const { userName, userTel } = previewOrder?.order;

      setUserInputObj({
        ...userInputObj,
        receiverName: userName,
        receiverTel: userTel,
      });
    }
  }, [checkForm.samePerson.isSelected]);

  useEffect(() => {
    /* TODO: 항상 전액 사용 어케? */
    console.log(previewOrder, 'previewOrder');

    const usePointAll = checkForm.alwaysPointAll.isSelected;

    if (usePointAll && previewOrder) {
      const { point: limitPoint } = previewOrder!;
      setUserInputObj({ ...userInputObj, point: limitPoint });
    }
  }, [checkForm.alwaysPointAll.isSelected]);

  if (preveiwOrderLoading) {
    return <div>로딩</div>;
  }

  const {
    userName,
    userTel,
    userEmail,
    delivery,
    deliveryDetail,
    location,
    payAmount,
    optionAmount,
    menuDiscount,
    menuAmount,
    eventDiscount,
    deliveryFeeDiscount,
    deliveryFee,
    coupon,
  } = previewOrder?.order!;

  const { deliveryDate, spotName, spotPickupName, orderOptions, deliveryStartTime, deliveryEndTime } =
    previewOrder?.order?.orderDeliveries[0]!;
  const orderMenus = previewOrder?.order?.orderDeliveries[0]?.orderMenus || [];
  const { point } = previewOrder!;
  const { dayFormatter } = getCustomDate(new Date(deliveryDate));

  const isParcel = delivery === 'PARCEL';
  const isMorning = delivery === 'MORNING';
  const isFcoPay = selectedOrderMethod === 'fcopay';
  const isKakaoPay = selectedOrderMethod === 'kakaopay';

  return (
    <Container>
      <OrderItemsWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문상품 ({orderMenus.length})</TextH4B>
          <FlexRow onClick={() => showSectionHandler('orderItem')}>
            <TextB2R padding="0 13px 0 0">
              {orderMenus
                .map((item) => item.menuName)
                ?.toString()
                .slice(0, 10) + '...'}
            </TextB2R>
            <SVGIcon name={showSectionObj.showOrderItemSection ? 'triangleUp' : 'triangleDown'} />
          </FlexRow>
        </FlexBetween>
        <SlideToggle state={showSectionObj.showOrderItemSection} duration={0.3}>
          <OrderListWrapper>
            {orderMenus?.map((menu, index) => {
              return <OrderItem menu={menu} key={index} />;
            })}
          </OrderListWrapper>
        </SlideToggle>
        {/* <TextB2R padding="8px 0 16px 0" color={theme.brandColor}>
          5주간, 주 2회씩 (화·목) 총 9회 배송되는 식단입니다.
        </TextB2R>
        <SubsOrderItem /> */}
        {/* <SlideToggle state={showSectionObj.showOrderItemSection} duration={0.5}>
          <SubsOrderList />
        </SlideToggle> */}
      </OrderItemsWrapper>
      <BorderLine height={8} margin="16px 0 0 0" />
      <CustomerInfoWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문자 정보</TextH4B>
          <ShowBtnWrapper onClick={() => showSectionHandler('customerInfo')}>
            <TextB2R padding="0 13px 0 0">{`${userName},${userTel}`}</TextB2R>
            <SVGIcon name={showSectionObj.showCustomerInfoSection ? 'triangleUp' : 'triangleDown'} />
          </ShowBtnWrapper>
        </FlexBetween>
        <SlideToggle state={showSectionObj.showCustomerInfoSection} duration={0.3}>
          <CustomInfoList>
            <FlexBetween>
              <TextH5B>보내는 사람</TextH5B>
              <TextB2R>{userName}</TextB2R>
            </FlexBetween>
            <FlexBetween margin="16px 0">
              <TextH5B>휴대폰 전화</TextH5B>
              <TextB2R>{userTel}</TextB2R>
            </FlexBetween>
            <FlexBetween>
              <TextH5B>이메일</TextH5B>
              <TextB2R>{userEmail}</TextB2R>
            </FlexBetween>
          </CustomInfoList>
        </SlideToggle>
      </CustomerInfoWrapper>
      <BorderLine height={8} margin="24px 0 0 0" />
      <ReceiverInfoWrapper>
        <FlexBetween padding="0">
          <TextH4B>받는 사람 정보</TextH4B>
          <FlexRow>
            <Checkbox onChange={() => checkFormHanlder('samePerson')} isSelected={checkForm.samePerson.isSelected} />
            <TextB2R padding="0 0 0 8px">주문자와 동일</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">이름</TextH5B>
          <TextInput
            placeholder="이름"
            value={userInputObj.receiverName}
            name="receiverName"
            eventHandler={userInputHandler}
          />
        </FlexCol>
        <FlexCol>
          <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
          <TextInput
            inputType="number"
            placeholder="휴대폰 번호"
            name="receiverTel"
            value={userInputObj.receiverTel}
            eventHandler={userInputHandler}
          />
        </FlexCol>
      </ReceiverInfoWrapper>
      <BorderLine height={8} />
      <DevlieryInfoWrapper>
        <FlexBetween>
          <TextH4B>배송정보</TextH4B>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <FlexBetween>
            <TextH5B>배송방법</TextH5B>
            {!['PARCEL', 'MORNING'].includes(delivery) ? (
              <TextB2R>
                {DELIVERY_TYPE_MAP[delivery]} - {DELIVERY_TIME_MAP[deliveryDetail]}
              </TextB2R>
            ) : (
              <TextB2R>{DELIVERY_TYPE_MAP[delivery]}</TextB2R>
            )}
          </FlexBetween>
          {deliveryDateRenderer({
            location,
            delivery,
            deliveryDetail,
            dayFormatter,
            spotName,
            spotPickupName,
            deliveryStartTime,
            deliveryEndTime,
          })}
        </FlexCol>
        <MustCheckAboutDelivery>
          <FlexCol>
            <FlexRow padding="0 0 8px 0">
              <SVGIcon name="exclamationMark" />
              <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
                주문 변경 및 취소 시 반드시 확인해주세요!
              </TextH6B>
            </FlexRow>
            {cancelOrderInfoRenderer(delivery, deliveryDetail)}
          </FlexCol>
        </MustCheckAboutDelivery>
      </DevlieryInfoWrapper>
      <BorderLine height={8} />
      {isMorning && (
        <>
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
              <FlexRow>
                <Checkbox
                  onChange={() => checkFormHanlder('accessMethodReuse')}
                  isSelected={checkForm.accessMethodReuse.isSelected}
                />
                <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
              </FlexRow>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>{userAccessMethod?.text || '출입방법 선택'}</TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                margin="8px 0 0 0"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[userAccessMethod?.value!]
                    ? ACCESS_METHOD_PLACEHOLDER[userAccessMethod?.value!]
                    : '요청사항 입력 (선택)'
                }
                eventHandler={changeInputHandler}
              />
            </FlexCol>
            <MustCheckAboutDelivery>
              <FlexCol>
                <FlexRow padding="0 0 8px 0">
                  <SVGIcon name="exclamationMark" />
                  <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
                    반드시 확인해주세요!
                  </TextH6B>
                </FlexRow>
                <TextB3R color={theme.brandColor}>
                  공동현관 및 무인택배함 비밀번호는 조합 방식 및 순서(#,호출버튼)와 함께 자세히 기재해주세요.
                </TextB3R>
              </FlexCol>
            </MustCheckAboutDelivery>
          </VisitorAccessMethodWrapper>
          <BorderLine height={8} />
        </>
      )}
      {isParcel && (
        <>
          <VisitorAccessMethodWrapper>
            <FlexBetween>
              <TextH4B>배송 메모</TextH4B>
              <FlexRow>
                <Checkbox
                  onChange={() => checkFormHanlder('accessMethodReuse')}
                  isSelected={checkForm.accessMethodReuse.isSelected}
                />
                <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
              </FlexRow>
            </FlexBetween>
            <TextInput margin="24px 0 0 0" placeholder="요청사항 입력" eventHandler={changeInputHandler} />
          </VisitorAccessMethodWrapper>
          <BorderLine height={8} />
        </>
      )}
      <CouponWrapper>
        <FlexBetween>
          <TextH4B>할인 쿠폰</TextH4B>
          <FlexRow>
            {selectedCoupon ? (
              <TextB2R padding="0 10px 0 0">{selectedCoupon.value}</TextB2R>
            ) : (
              <TextB2R padding="0 10px 0 0">{previewOrder?.coupons.length}장 보유</TextB2R>
            )}
            <div onClick={() => couponHandler(previewOrder?.coupons!)}>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </CouponWrapper>
      <BorderLine height={8} />
      <PointWrapper>
        <FlexBetween>
          <TextH4B>포인트 사용</TextH4B>
          <FlexRow>
            <Checkbox
              onChange={() => checkFormHanlder('alwaysPointAll')}
              isSelected={checkForm.alwaysPointAll.isSelected}
            />
            <TextB2R padding="0 0 0 8px">항상 전액 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexRow padding="24px 0 0 0">
          <TextInput
            name="point"
            width="100%"
            margin="0 8px 0 0"
            placeholder="0"
            value={userInputObj.point}
            eventHandler={(e) => changePointHandler(Number(e.target.value))}
          />
          {userInputObj.point > 0 && (
            <DeletePoint onClick={clearPointHandler}>
              <SVGIcon name="blackBackgroundCancel" />
            </DeletePoint>
          )}
          <Button width="86px" height="48px" onClick={useAllOfPointHandler}>
            전액 사용
          </Button>
        </FlexRow>
        <TextB3R padding="4px 0 0 16px">사용 가능한 포인트 {point}원</TextB3R>
      </PointWrapper>
      <BorderLine height={8} />
      <OrderMethodWrapper>
        <FlexBetween padding="0 0 24px 0">
          <TextH4B>결제수단</TextH4B>
          <FlexRow>
            <Checkbox
              onChange={() => checkFormHanlder('orderMethodReuse')}
              isSelected={checkForm.orderMethodReuse.isSelected}
            />
            <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <GridWrapper gap={16}>
          {PAYMENT_METHOD.map((method, index) => {
            const isSelected = selectedOrderMethod === method.value;
            return (
              <Button
                onClick={() => selectOrderMethodHanlder(method)}
                backgroundColor={isSelected ? theme.black : theme.white}
                color={isSelected ? theme.white : theme.black}
                border
                key={index}
              >
                {method.text}
              </Button>
            );
          })}
        </GridWrapper>
        {isFcoPay && (
          <>
            <BorderLine height={1} margin="24px 0" />
            {previewOrder?.cards?.length! > 0 ? (
              <>
                <CardItem onClick={goToCardManagemnet} card={getMainCardHandler(previewOrder?.cards)} />
              </>
            ) : (
              <Button border backgroundColor={theme.white} color={theme.black} onClick={goToRegisteredCard}>
                카드 등록하기
              </Button>
            )}
          </>
        )}
      </OrderMethodWrapper>
      {/* <SubsPaymentMethod
        previewOrder={previewOrder}
        goToCardManagemnet={goToCardManagemnet}
        getMainCardHandler={getMainCardHandler}
      /> */}
      <TotalPriceWrapper>
        <FlexBetween>
          <TextH5B>총 상품 금액</TextH5B>
          <TextB2R>{menuAmount}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>총 할인 금액</TextH5B>
          <TextB2R>{menuDiscount}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>상품 할인</TextB2R>
          <TextB2R>{menuDiscount}원</TextB2R>
        </FlexBetween>
        {eventDiscount > 0 && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>스팟 이벤트 할인</TextB2R>
            <TextB2R>{eventDiscount}원</TextB2R>
          </FlexBetween>
        )}
        {selectedCoupon && (
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>쿠폰 사용</TextB2R>
            <TextB2R>{coupon}원</TextB2R>
          </FlexBetween>
        )}
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH5B>환경부담금 (일회용품)</TextH5B>
          <TextB2R>{optionAmount}원</TextB2R>
        </FlexBetween>
        {orderOptions.length > 0 &&
          orderOptions.map((optionItem, index) => {
            const { optionId, optionPrice, optionQuantity, optionName } = optionItem;
            const hasFork = optionId === 1;
            const hasChopsticks = optionId === 2;
            return (
              <div key={index}>
                {hasFork && (
                  <FlexBetween padding="8px 0 0 0">
                    <TextB2R>포크+물티슈</TextB2R>
                    <TextB2R>
                      {optionQuantity}개 / {optionPrice * optionQuantity}원
                    </TextB2R>
                  </FlexBetween>
                )}
                {hasChopsticks && (
                  <FlexBetween padding="8px 0 0 0">
                    <TextB2R>젓가락+물티슈</TextB2R>
                    <TextB2R>
                      {optionQuantity}개 / {optionPrice * optionQuantity}원
                    </TextB2R>
                  </FlexBetween>
                )}
              </div>
            );
          })}

        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>배송비</TextH5B>
          <TextB2R>{deliveryFee}원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>배송비 할인</TextB2R>
          <TextB2R>{deliveryFeeDiscount}원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" />
        {userInputObj.point > 0 && (
          <FlexBetween>
            <TextH5B>포인트 사용</TextH5B>
            <TextB2R>{point}원</TextB2R>
          </FlexBetween>
        )}
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 결제금액</TextH4B>
          <TextB2R>{payAmount}원</TextB2R>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            프코 회원
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
          <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
        </FlexEnd>
      </TotalPriceWrapper>
      <OrderTermWrapper>
        <TextH5B>구매 조건 확인 및 결제 진행 필수 동의</TextH5B>
        <FlexRow padding="17px 0 0 0">
          <Checkbox isSelected onChange={checkOrderTermHandler} />
          <TextB2R padding="0 8px">개인정보 수집·이용 동의 (필수)</TextB2R>
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo}>
            자세히
          </TextH6B>
        </FlexRow>
        {/* <FlexRow padding="8px 0 0 0">
          <Checkbox isSelected onChange={checkOrderTermHandler} />
          <TextB2R padding="0 8px">정기구독 이용약관・주의사항 동의 (필수)</TextB2R>
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo}>
            자세히
          </TextH6B>
        </FlexRow> */}
      </OrderTermWrapper>
      <OrderBtn onClick={() => paymentHandler()}>
        <Button borderRadius="0" height="100%">
          {payAmount}원 결제하기
        </Button>
      </OrderBtn>
    </Container>
  );
};

const Container = styled.div``;
const OrderItemsWrapper = styled.div`
  ${homePadding}
`;
const OrderListWrapper = styled.div`
  flex-direction: column;
  padding: 24px 0 0 0;
`;
const ShowBtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const CustomerInfoWrapper = styled.div`
  ${homePadding}
  display: flex;
  flex-direction: column;
`;

const CustomInfoList = styled.div`
  padding-top: 24px;
  flex-direction: column;
`;
const ReceiverInfoWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;
const DevlieryInfoWrapper = styled.div`
  padding: 24px;
`;
const MustCheckAboutDelivery = styled.div`
  background-color: ${theme.greyScale3};
  padding: 16px;
  border-radius: 8px;
`;

const AccessMethodWrapper = styled.div`
  border: 1px solid ${theme.greyScale15};
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VisitorAccessMethodWrapper = styled.div`
  padding: 24px;
`;

const CouponWrapper = styled.div`
  padding: 24px;
`;

const RegisteredCardWrapper = styled.div`
  padding-bottom: 24px;
`;

const PointWrapper = styled.div`
  padding: 24px;
`;

const OrderMethodWrapper = styled.div`
  padding: 24px;
  width: 100%;
`;

const DeletePoint = styled.div`
  position: absolute;
  right: 28%;
`;

const TotalPriceWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
`;

const OrderTermWrapper = styled.div`
  ${homePadding}
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 160px;
`;

const OrderBtn = styled.div`
  ${fixedBottom}
`;

export default OrderPage;