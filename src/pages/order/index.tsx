/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { getCookie, getFormatPrice, SVGIcon } from '@utils/common';
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
import {
  createOrderPreviewApi,
  createOrderApi,
  postKakaoPaymentApi,
  postTossPaymentApi,
  postTossApproveApi,
  postPaycoPaymentApi,
  postNicePaymnetApi,
  postNiceApproveApi,
} from '@api/order';
import { useQuery } from 'react-query';
import { isNil } from 'lodash-es';
import {
  Obj,
  IGetCard,
  ILocation,
  ICoupon,
  ICreateOrder,
  IGetNicePayment,
  IGetNicePaymentResponse,
} from '@model/index';
import { DELIVERY_TYPE_MAP, DELIVERY_TIME_MAP } from '@constants/order';
import { getCustomDate } from '@utils/destination';
import { OrderCouponSheet } from '@components/BottomSheet/OrderCouponSheet';
import { useMutation, useQueryClient } from 'react-query';
import { orderForm, INIT_CARD, INIT_ORDER, SET_RECENT_PAYMENT } from '@store/order';
import SlideToggle from '@components/Shared/SlideToggle';
import { SubsInfoBox, SubsOrderItem, SubsOrderList, SubsPaymentMethod } from '@components/Pages/Subscription/payment';
import { SET_ALERT } from '@store/alert';
import { setCookie } from '@utils/common';
import { SET_IS_LOADING } from '@store/common';
import { userForm } from '@store/user';
import { subscriptionForm } from '@store/subscription';
import { periodMapper } from '@constants/subscription';
import dayjs from 'dayjs';
import MenusPriceBox from '@components/Pages/Subscription/payment/MenusPriceBox';

declare global {
  interface Window {
    goPay: any;
  }
}

/* TODO: access method 컴포넌트 분리 가능 나중에 리팩토링 */
/* TODO: 배송 출입 부분 함수로 */
/* TODO: 결제 금액 부분 함수로 */
/* TODO: 배송예정 어떻게? */
/* TODO: 출입 방법 input userDestination에 담아서 서버 콜 */

const PAYMENT_METHOD = [
  {
    id: 1,
    text: '프코페이',
    value: 'NICE_BILLING',
  },
  {
    id: 2,
    text: '신용카드',
    value: 'NICE_CARD',
  },
  {
    id: 3,
    text: '계좌이체',
    value: 'NICE_BANK',
  },
  {
    id: 4,
    text: '카카오페이',
    value: 'KAKAO_CARD',
  },
  {
    id: 5,
    text: '페이코',
    value: 'PAYCO_EASY',
  },
  {
    id: 6,
    text: '토스',
    value: 'TOSS_CARD',
  },
];

const successOrderPath: string = 'order/finish';

const ngorkUrl = 'https://b14a-59-6-1-115.jp.ngrok.io';
export interface IAccessMethod {
  id: number;
  text: string;
  value: string;
}

const OrderPage = () => {
  const { subsOrderMenus, subsInfo } = useSelector(subscriptionForm);
  const [showSectionObj, setShowSectionObj] = useState({
    showOrderItemSection: false,
    showCustomerInfoSection: false,
  });
  const [selectedOrderMethod, setSelectedOrderMethod] = useState<string>('NICE_BILLING');
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
  const [card, setCard] = useState<IGetCard>();
  const [regularPaymentDate, setRegularPaymentDate] = useState<number>();
  const [options, setOptions] = useState<any>();
  const [checkTermList, setCheckTermList] = useState<Obj>({
    privacy: false,
    subscription: false,
  });

  const auth = getCookie({ name: 'refreshTokenObj' });

  const dispatch = useDispatch();
  const { userAccessMethod, isLoading, isMobile } = useSelector(commonSelector);
  const { selectedCoupon } = useSelector(couponForm);
  const { tempOrder, selectedCard, recentPayment } = useSelector(orderForm);
  const { me } = useSelector(userForm);

  const queryClient = useQueryClient();
  const router = useRouter();

  const needCard = selectedOrderMethod === 'NICE_BILLING' || selectedOrderMethod === 'NICE_CARD';

  const { isSubscription } = router.query;

  useEffect(() => {
    if (router.isReady) {
    }
  }, [router.isReady]);

  const {
    data: previewOrder,
    isLoading: preveiwOrderLoading,
    isError,
    error,
  } = useQuery(
    'getPreviewOrder',
    async () => {
      if (!tempOrder) {
        router.push('/cart');
      }
      const {
        delivery,
        deliveryDetail,
        destinationId,
        isSubOrderDelivery,
        orderDeliveries,
        subscriptionMenuDetailId,
        subscriptionPeriod,
        subscriptionRound,
        type,
      } = tempOrder!;
      console.log(tempOrder, 'TEMP ORDER');
      const previewBody = {
        delivery,
        deliveryDetail: deliveryDetail ? deliveryDetail : null,
        destinationId,
        isSubOrderDelivery,
        orderDeliveries,
        subscriptionMenuDetailId: subscriptionMenuDetailId ? subscriptionMenuDetailId : null,
        subscriptionPeriod: subscriptionPeriod ? subscriptionPeriod : null,
        subscriptionRound: subscriptionRound,
        type,
      };

      const { data } = await createOrderPreviewApi(previewBody);
      // orderDeliveries 날짜 순서대로 정렬 서버에서 날짜 순서대로 오지않음
      data.data.order.orderDeliveries.sort(
        (a, b) => Number(a.deliveryDate.replaceAll('-', '')) - Number(b.deliveryDate.replaceAll('-', ''))
      );

      if (data.code === 200) {
        return data.data;
      }
    },
    {
      onSuccess: (data) => {
        let options = {
          option1: { id: 1, name: '', price: 0, quantity: 0 },
          option2: { id: 2, name: '', price: 0, quantity: 0 },
        };
        data?.order.orderDeliveries.forEach((item) => {
          item.orderOptions.forEach((option) => {
            if (option.optionId === 1) {
              if (options.option1.name === '') options.option1.name = option.optionName;
              options.option1.price = options.option1.price + option.optionPrice * option.optionQuantity;
              options.option1.quantity = options.option1.quantity + option.optionQuantity;
            } else if (option.optionId === 2) {
              if (options.option2.name === '') options.option2.name = option.optionName;
              options.option2.price = options.option2.price + option.optionPrice * option.optionQuantity;
              options.option2.quantity = options.option2.quantity + option.optionQuantity;
            }
          });
        });

        setOptions(options);

        if ([30, 31, 1, 2].includes(Number(dayjs(data?.order.orderDeliveries[0].deliveryDate).format('DD')))) {
          //첫 구독시작일이 [30일, 31일, 1일, 2일]일때 자동결제일: 27일
          setRegularPaymentDate(27);
        } else {
          //첫 구독시작일이 3일 ~ 29일 이면 자동결제일: D-2
          setRegularPaymentDate(Number(dayjs(data?.order.orderDeliveries[0].deliveryDate).format('DD')) - 2);
        }
        if (data?.order.type === 'SUBSCRIPTION' && data?.order.subscriptionPeriod === 'UNLIMITED') {
          // 정기구독은 카드결제만 가능
          setSelectedOrderMethod('NICE_BILLING');
        }
      },
      onError: (error: any) => {
        if (error && error?.code === 5005) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 결제 정보입니다.',
            })
          );
          router.replace('/cart');
        } else {
          router.replace('/cart');
        }
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: mutateCreateOrder } = useMutation(
    async () => {
      /*TODO: 모델 수정해야함 */
      /*TODO: 쿠폰 퍼센테이지 */
      const { point, payAmount, ...rest } = previewOrder?.order!;

      dispatch(SET_IS_LOADING(true));

      const reqBody = {
        payMethod: selectedOrderMethod,
        cardId: needCard ? card?.id! : null,
        point: userInputObj?.point,
        payAmount: payAmount - (userInputObj.point + (selectedCoupon?.value! || 0)),
        couponId: selectedCoupon?.id || null,
        ...rest,
      };

      const { data } = await createOrderApi(reqBody);

      return data;
    },
    {
      onSuccess: async ({ data }) => {
        if (checkForm.orderMethodReuse.isSelected) {
          dispatch(SET_RECENT_PAYMENT(selectedOrderMethod));
        }

        if (selectedOrderMethod === 'NICE_BILLING') {
          router.replace(`/order/finish?orderId=${data.id}`);
        } else {
          processOrder(data);
        }
      },
      onError: (error: any) => {
        if (error.code === 1122) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 쿠폰입니다.',
            })
          );
        } else if (error.code === 5005) {
          dispatch(
            SET_ALERT({
              alertMessage:
                '선택하신 배송일의 주문이 마감되어 결제를 완료할 수 없어요. 배송일 변경 후 다시 시도해 주세요.',
            })
          );
          router.replace('/cart');
          /* TODO: 확인 필요 */
        } else if (error.code === 4351) {
          dispatch(
            SET_ALERT({
              alertMessage: '상품 금액이 변경되었습니다. 주문을 다시 시도해주세요.',
            })
          );
          router.replace('/cart');
        } else if (error.code === 4352) {
          dispatch(
            SET_ALERT({
              alertMessage: '상품 할인에 변동이 있습니다. 주문을 다시 시도해주세요.',
            })
          );
          router.replace('/cart');
        } else if (error.code === 1104) {
          dispatch(
            SET_ALERT({
              alertMessage: '카드를 등록해주세요.',
            })
          );
        }
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

  const checkOrderTermHandler = (value: string) => {
    setCheckTermList({ ...checkTermList, [value]: !checkTermList[value] });
  };

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
    const { payAmount } = previewOrder?.order!;
    let avaliablePoint = 0;
    if (limitPoint < payAmount) {
      // avaliablePoint = payAmount - limitPoint;
      avaliablePoint = limitPoint;
    } else {
      avaliablePoint = payAmount;
    }

    setUserInputObj({ ...userInputObj, point: avaliablePoint });
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
    dispatch(SET_BOTTOM_SHEET({ content: <OrderCouponSheet coupons={coupons} isOrder /> }));
  };

  const clearPointHandler = () => {
    setUserInputObj({ ...userInputObj, point: 0 });
  };

  const goToCardManagemnet = (card: IGetCard) => {
    router.push({ pathname: '/mypage/card', query: { isOrder: true } });
  };

  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };

  const goToTermInfo = () => {};

  const nicepayStart = () => {
    window.goPay(document.getElementById('payForm'));
  };

  const nicepayMobileStart = () => {
    const nicepayMobile: any = document.getElementById('payFormMobile');
    nicepayMobile?.submit();
  };

  const processOrder = async (data: ICreateOrder) => {
    switch (selectedOrderMethod) {
      case 'NICE_BILLING': {
        break;
      }
      case 'NICE_CARD': {
        progressPayNice(data);
        break;
      }
      case 'NICE_BANK': {
        progressPayNice(data);
        break;
      }
      case 'KAKAO_CARD':
        processKakaoPay(data);
        break;
      case 'PAYCO_EASY': {
        processPayco(data);
        break;
      }
      case 'TOSS_CARD': {
        processTossPay(data);
        break;
      }
    }
    // router.push(`/order/finish?orderId=${orderId}`);
    // setLoadingState(false);
    // INIT_ORDER();
    // INIT_CARD();
  };

  const checkIsAlreadyPaid = (orderData: ICreateOrder) => {
    const orderId = orderData.id;

    if (orderData.status === 'progress') {
      router.replace(`/${successOrderPath}?orderId=${orderId}`);
      return true;
    }
    return false;
  };

  const handleScrollNicePayModal = useCallback(() => {
    if (document.getElementById('nice_layer')) {
      document!.querySelector('html')!.style!.overflow! = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [document.getElementById('nice_layer')]);

  // 나이스페이

  const progressPayNice = async (orderData: ICreateOrder) => {
    const orderId = orderData.id;
    if (checkIsAlreadyPaid(orderData)) return;

    // const reqBody = {
    //   payMethod: selectedOrderMethod,
    //   successUrl: `${process.env.SERVICE_URL}/${successOrderPath}?orderId=${orderId}`,
    //   failureUrl: `${process.env.SERVICE_URL}${router.asPath}`,
    // };

    const reqBody = {
      payMethod: selectedOrderMethod,
      successUrl: `${ngorkUrl}/${successOrderPath}?orderId=${orderId}`,
      failureUrl: `${ngorkUrl}/order`,
    };

    try {
      const { data }: { data: IGetNicePaymentResponse } = await postNicePaymnetApi({ orderId, data: reqBody });

      let payForm = document.getElementById('payForm')! as HTMLFormElement;
      payForm!.innerHTML = '';
      payForm!.action = `${process.env.API_URL}/order/v1/orders/${orderId}/nicepay-approve`;

      let payFormMobile: any = document.getElementById('payFormMobile')!;
      payFormMobile.innerHTML = '';

      const response: Obj = data.data;

      for (let formName in response) {
        let inputHidden: HTMLInputElement = document.createElement('input');
        inputHidden.setAttribute('type', 'hidden');
        inputHidden.setAttribute('name', formName);
        if (formName === 'TrKey') {
          inputHidden.setAttribute('value', ' ');
        } else {
          inputHidden.setAttribute('value', response[formName]);
        }

        if (isMobile) {
          if (!['EncodeParameters', 'SocketYN', 'UserIP'].includes(formName)) {
            payFormMobile.appendChild(inputHidden);
          }
        } else {
          payForm.appendChild(inputHidden);
        }
      }

      if (isMobile) {
        let acsNoIframeInput = document.createElement('input');
        acsNoIframeInput.setAttribute('type', 'hidden');
        acsNoIframeInput.setAttribute('name', 'AcsNoIframe');
        acsNoIframeInput.setAttribute('value', 'Y'); // 변경 불가
        payFormMobile.appendChild(acsNoIframeInput);
        nicepayMobileStart();
        return;
      } else {
        nicepayStart();
        handleScrollNicePayModal();
        return;
      }
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
      dispatch(SET_IS_LOADING(false));
    }
  };

  // 페이코

  const processPayco = async (orderData: ICreateOrder) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/${successOrderPath}?orderId=${orderId}`,
      cancelUrl: `${process.env.SERVICE_URL}${router.asPath}`,
      failureUrl: `${process.env.SERVICE_URL}${router.asPath}`,
    };

    if (checkIsAlreadyPaid(orderData)) return;

    // const reqBody = {
    //   successUrl: `${ngorkUrl}/${successOrderPath}?orderId=${orderId}`,
    //   cancelUrl: `${ngorkUrl}${router.asPath}`,
    //   failureUrl: `${ngorkUrl}${router.asPath}`,
    // };

    try {
      const { data } = await postPaycoPaymentApi({ orderId, data: reqBody });

      window.location.href = data.data.result.orderSheetUrl;
      dispatch(SET_IS_LOADING(false));
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
      dispatch(SET_IS_LOADING(false));
    }
  };

  // 카카오

  const processKakaoPay = async (orderData: ICreateOrder) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/${successOrderPath}?orderId=${orderId}&pg=kakao`,
      cancelUrl: `${process.env.SERVICE_URL}${router.asPath}`,
      failureUrl: `${process.env.SERVICE_URL}${router.asPath}`,
    };

    if (checkIsAlreadyPaid(orderData)) return;

    // const reqBody = {
    //   successUrl: `${ngorkUrl}/${successOrderPath}?orderId=${orderId}&pg=kakao`,
    //   cancelUrl: `${ngorkUrl}${router.asPath}`,
    //   failureUrl: `${ngorkUrl}${router.asPath}`,
    // };

    /* TODO: 모바일, 안드로이드 체크  */

    try {
      const { data } = await postKakaoPaymentApi({ orderId, data: reqBody });

      setCookie({
        name: 'kakao-tid-clover',
        value: data.data.tid,
      });

      if (isMobile) {
        window.location.href = data.data.next_redirect_mobile_url;
      } else {
        window.location.href = data.data.next_redirect_pc_url;
      }
    } catch (error: any) {
      if (error.code === 1207) {
        dispatch(SET_ALERT({ alertMessage: '잘못된 카카오페이 URL입니다.' }));
      } else {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      }

      dispatch(SET_IS_LOADING(false));
    }
  };

  // 토스

  const processTossPay = async (orderData: ICreateOrder) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/${successOrderPath}?orderId=${orderId}&pg=toss`,
      failureUrl: `${process.env.SERVICE_URL}${router.asPath}`,
    };

    if (checkIsAlreadyPaid(orderData)) return;

    // const reqBody = {
    //   successUrl: `${ngorkUrl}/${successOrderPath}?orderId=${orderId}&pg=toss`,
    //   failureUrl: `${ngorkUrl}${router.asPath}`,
    // };

    const { data } = await postTossPaymentApi({ orderId, data: reqBody });
    setCookie({
      name: 'toss-tid-clover',
      value: data.data.payToken,
    });

    window.location.href = data.data.checkoutPage;
  };

  const paymentHandler = () => {
    if (isLoading) return;
    if (!checkTermList.privacy) {
      dispatch(SET_ALERT({ alertMessage: '개인정보 수집·이용 동의를 체크해주세요.' }));
      return;
    }
    if (previewOrder?.order.type === 'SUBSCRIPTION' && !checkTermList.subscription) return;

    if (previewOrder?.order.delivery === 'MORNING') {
      /* TODO: alert message 마크다운..? */
      dispatch(
        SET_ALERT({
          alertMessage:
            '주문변경 및 취소는 배송일 전날 오후 3시까지만 가능합니다.[배송지/배송요청사항] 오기입으로 인해 상품 수령이 불가능하게 될 경우, 고객님의 책임으로 간주되어 보상이 불가능합니다. 배송지를 최종 확인 하셨나요?',
          closeBtnText: '취소',
          submitBtnText: '확인',
          onClose: () => {},
          onSubmit: () => {
            mutateCreateOrder();
          },
        })
      );
    } else {
      mutateCreateOrder();
    }
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
    const { message } = router.query;

    if (router.isReady && message) {
      try {
        let preDecode = decodeURIComponent(message as string).replace(/ /g, '+');
        const cancleMsg = decodeURIComponent(escape(window.atob(preDecode)));

        dispatch(SET_ALERT({ alertMessage: cancleMsg }));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    /* TODO: 항상 전액 사용 어케? */

    const usePointAll = checkForm.alwaysPointAll.isSelected;

    if (usePointAll && previewOrder) {
      const { point: limitPoint } = previewOrder!;
      setUserInputObj({ ...userInputObj, point: limitPoint });
    }
  }, [checkForm.alwaysPointAll.isSelected]);

  useEffect(() => {
    const card = selectedCard
      ? previewOrder?.cards.find((c) => c.id === selectedCard)
      : previewOrder?.cards.find((c) => c.main);
    setCard(card!);
  }, [previewOrder]);

  useEffect(() => {
    if (recentPayment) {
      setSelectedOrderMethod(recentPayment);
    }
  }, []);

  useEffect(() => {
    // 새로고침 시 중복 결제 방어 풀림
    dispatch(SET_IS_LOADING(false));
  }, []);

  useEffect(() => {
    if (!auth) router.replace('/login');
  }, []);

  if (preveiwOrderLoading) {
    return <div>로딩</div>;
  }

  if (isError) {
    /*TODO: 에러페이지 만들기 or alert으로 띄우기? */
    const { code } = error;
    if (code === 5005) {
      dispatch(
        SET_ALERT({
          alertMessage: '선택하신 배송일의 주문이 마감됐어요. 배송일 변경 후 다시 시도해 주세요.',
          onSubmit: () => router.push('/cart'),
        })
      );
      return;
    } else {
      dispatch(
        SET_ALERT({
          alertMessage: '알수없는 에러발생',
          onSubmit: () => router.push('/cart'),
        })
      );
      return;
    }
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
    type,
  } = previewOrder?.order!;

  const { deliveryDate, spotName, spotPickupName, orderOptions, deliveryStartTime, deliveryEndTime } =
    previewOrder?.order?.orderDeliveries[0]!;
  const orderMenus = previewOrder?.order?.orderDeliveries[0]?.orderMenus || [];
  const { point } = previewOrder!;
  const { dayFormatter } = getCustomDate(new Date(deliveryDate));

  const isParcel = delivery === 'PARCEL';
  const isMorning = delivery === 'MORNING';
  const isFcoPay = selectedOrderMethod === 'NICE_BILLING';
  const isKakaoPay = selectedOrderMethod === 'KAKAO_CARD';

  return (
    <Container>
      <OrderItemsWrapper>
        {previewOrder?.order.type === 'GENERAL' && (
          <>
            <FlexBetween pointer onClick={() => showSectionHandler('orderItem')}>
              <TextH4B>주문상품 ({orderMenus.length})</TextH4B>
              <FlexRow>
                {!showSectionObj.showOrderItemSection && (
                  <TextB2R padding="0 13px 0 0">
                    {orderMenus
                      .map((item) => item.menuName)
                      ?.toString()
                      .slice(0, 10) + '...'}
                  </TextB2R>
                )}
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
          </>
        )}
        {previewOrder?.order.type === 'SUBSCRIPTION' && (
          <>
            <FlexBetween pointer onClick={() => showSectionHandler('orderItem')}>
              <TextH4B>주문상품</TextH4B>
              <FlexRow>
                <SVGIcon name={showSectionObj.showOrderItemSection ? 'triangleUp' : 'triangleDown'} />
              </FlexRow>
            </FlexBetween>
            <TextB2R padding="8px 0 16px 0" color={theme.brandColor}>
              {subsInfo?.period === 'UNLIMITED' ? '5주간' : `${periodMapper[subsInfo?.period!]}간`}, 주{' '}
              {subsInfo?.deliveryDay?.length}회씩 ({subsInfo?.deliveryDay?.join('·')}) 총 {subsOrderMenus?.length}회
              배송되는 식단입니다.
            </TextB2R>
            <SubsOrderItem
              name={previewOrder.order.name}
              deliveryType={previewOrder.order.delivery}
              deliveryDetail={previewOrder.order.deliveryDetail}
              subscriptionPeriod={previewOrder.order.subscriptionPeriod}
              menuImage={subsInfo?.menuImage!}
            />
            <SlideToggle state={showSectionObj.showOrderItemSection} duration={0.5}>
              <SubsOrderList />
            </SlideToggle>
          </>
        )}
      </OrderItemsWrapper>
      <BorderLine height={8} />
      <CustomerInfoWrapper>
        <FlexBetween pointer onClick={() => showSectionHandler('customerInfo')}>
          <TextH4B>주문자 정보</TextH4B>
          <ShowBtnWrapper>
            {!showSectionObj.showCustomerInfoSection && (
              <TextB2R padding="0 13px 0 0">{`${userName},${userTel}`}</TextB2R>
            )}
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
      <BorderLine height={8} />
      <ReceiverInfoWrapper>
        <FlexBetween padding="0">
          <TextH4B>받는 사람 정보</TextH4B>
          <FlexRow
            pointer
            onClick={() => {
              checkFormHanlder('samePerson');
            }}
          >
            <Checkbox
              className="checkBox"
              onChange={() => checkFormHanlder('samePerson')}
              isSelected={checkForm.samePerson.isSelected}
            />
            <TextB2R padding="0 0 0 8px">주문자와 동일</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">이름</TextH5B>
          <TextInput
            placeholder="이름"
            value={checkForm.samePerson.isSelected ? userInputObj.receiverName : ''}
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
            value={checkForm.samePerson.isSelected ? userInputObj.receiverTel : ''}
            eventHandler={userInputHandler}
          />
        </FlexCol>
      </ReceiverInfoWrapper>
      <BorderLine height={8} />

      {previewOrder?.order.type === 'SUBSCRIPTION' && (
        <>
          <SubsInfoBox subscriptionRound={previewOrder.order.subscriptionRound} />
          <BorderLine height={8} />
        </>
      )}

      <DevlieryInfoWrapper>
        <FlexBetween>
          <TextH4B>배송정보</TextH4B>
        </FlexBetween>
        <FlexCol padding="24px 0 16px">
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
              <FlexRow
                pointer
                onClick={() => {
                  checkFormHanlder('accessMethodReuse');
                }}
              >
                <Checkbox
                  className="checkBox"
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
              <FlexRow
                pointer
                onClick={() => {
                  checkFormHanlder('accessMethodReuse');
                }}
              >
                <Checkbox
                  className="checkBox"
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
          <TextH4B>할인 쿠폰 ({previewOrder?.coupons.length})</TextH4B>
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
          <FlexRow
            pointer
            onClick={() => {
              checkFormHanlder('alwaysPointAll');
            }}
          >
            <Checkbox
              className="checkBox"
              onChange={() => checkFormHanlder('alwaysPointAll')}
              isSelected={checkForm.alwaysPointAll.isSelected}
            />
            <TextB2R padding="0 0 0 8px">항상 전액 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexRow padding="24px 0 0 0">
          <span className="inputBox">
            <TextInput
              name="point"
              width="100%"
              placeholder="0"
              value={getFormatPrice(String(userInputObj.point))}
              eventHandler={(e) => changePointHandler(Number(e.target.value))}
            />
            {userInputObj.point > 0 && (
              <DeletePoint onClick={clearPointHandler}>
                <SVGIcon name="blackBackgroundCancel" />
              </DeletePoint>
            )}
          </span>
          <Button width="86px" height="48px" onClick={useAllOfPointHandler}>
            전액 사용
          </Button>
        </FlexRow>
        <TextB3R padding="4px 0 0 16px">
          사용 가능한 포인트 {getFormatPrice(String(point - userInputObj.point))}원
        </TextB3R>
      </PointWrapper>
      <BorderLine height={8} />

      {previewOrder?.order.subscriptionPeriod !== 'UNLIMITED' ? (
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
                  <CardItem onClick={goToCardManagemnet} card={card} cardCount={previewOrder?.cards?.length} />
                </>
              ) : (
                <Button border backgroundColor={theme.white} color={theme.black} onClick={goToRegisteredCard}>
                  카드 등록하기
                </Button>
              )}
            </>
          )}
        </OrderMethodWrapper>
      ) : (
        <SubsPaymentMethod
          previewOrder={previewOrder}
          goToCardManagemnet={goToCardManagemnet}
          card={card!}
          regularPaymentDate={regularPaymentDate!}
        />
      )}

      {previewOrder?.order.type === 'GENERAL' && (
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
              <TextB2R>{userInputObj.point}원</TextB2R>
            </FlexBetween>
          )}
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween>
            <TextH4B>최종 결제금액</TextH4B>
            <TextB2R>{payAmount - userInputObj.point}원</TextB2R>
          </FlexBetween>
          <FlexEnd padding="11px 0 0 0">
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              프코 회원
            </Tag>
            <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
            <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
          </FlexEnd>
        </TotalPriceWrapper>
      )}
      {previewOrder?.order.type === 'SUBSCRIPTION' && (
        <MenusPriceBox
          disposable={true}
          menuPrice={menuAmount!}
          menuDiscount={menuDiscount!}
          eventDiscount={eventDiscount!}
          menuOption1={options?.option1!}
          menuOption2={options?.option2!}
          deliveryPrice={deliveryFee!}
          deliveryLength={13}
          point={userInputObj.point}
          type={'last'}
        />
      )}
      <OrderTermWrapper>
        <TextH5B>구매 조건 확인 및 결제 진행 필수 동의</TextH5B>
        <FlexRow
          padding="17px 0 0 0"
          pointer
          onClick={() => {
            checkOrderTermHandler('privacy');
          }}
        >
          <Checkbox
            className="checkBox"
            isSelected={checkTermList.privacy}
            onChange={() => {
              checkOrderTermHandler('privacy');
            }}
          />
          <TextB2R padding="0 8px">개인정보 수집·이용 동의 (필수)</TextB2R>
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo} pointer>
            자세히
          </TextH6B>
        </FlexRow>
        {previewOrder?.order.type === 'SUBSCRIPTION' && (
          <FlexRow
            padding="8px 0 0 0"
            pointer
            onClick={() => {
              checkOrderTermHandler('subscription');
            }}
          >
            <Checkbox
              className="checkBox"
              isSelected={checkTermList.subscription}
              onChange={() => {
                checkOrderTermHandler('subscription');
              }}
            />
            <TextB2R padding="0 8px">정기구독 이용약관・주의사항 동의 (필수)</TextB2R>
            <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo}>
              자세히
            </TextH6B>
          </FlexRow>
        )}
      </OrderTermWrapper>
      <OrderBtn onClick={() => paymentHandler()}>
        <Button borderRadius="0" height="100%" disabled={isLoading} className="orderBtn">
          {getFormatPrice(String(payAmount - userInputObj.point))}원 결제하기
        </Button>
      </OrderBtn>
    </Container>
  );
};

const Container = styled.div`
  .checkBox {
    margin-bottom: 2px;
  }
`;
const OrderItemsWrapper = styled.div`
  padding: 24px;
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
  padding: 24px;
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
  .inputBox {
    position: relative;
    width: 100%;
    margin-right: 8px;
  }
`;

const OrderMethodWrapper = styled.div`
  padding: 24px;
  width: 100%;
`;

const DeletePoint = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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
  padding: 32px 24px 32px 24px;
`;

const OrderBtn = styled.div`
  ${fixedBottom}
`;

export default OrderPage;
