/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import {
  homePadding,
  FlexBetween,
  theme,
  FlexRow,
  FlexCol,
  GridWrapper,
  fixedBottom,
  FlexColCenter,
} from '@styles/theme';
import { TextB2R, TextH4B, TextB3R, TextH6B, TextH5B } from '@components/Shared/Text';
import { Button } from '@components/Shared/Button';
import Checkbox from '@components/Shared/Checkbox';
import { getCookie, getFormatDate, getFormatPrice, SVGIcon } from '@utils/common';
import { DeliveryDateBox, GeneralMenusPriceBox, OrderItem, CancelOrderInfoBox } from '@components/Pages/Order';
import TextInput from '@components/Shared/TextInput';
import { useRouter } from 'next/router';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { commonSelector, INIT_ACCESS_METHOD, SET_ACCESS_METHOD, SET_IS_LOADING } from '@store/common';
import { couponForm, INIT_COUPON } from '@store/coupon';
import { userForm } from '@store/user';
import { subscriptionForm } from '@store/subscription';
import { SET_ALERT } from '@store/alert';
import { orderForm, SET_RECENT_PAYMENT, SET_USER_ORDER_INFO } from '@store/order';
import {
  ACCESS_METHOD_PLACEHOLDER,
  ACCESS_METHOD_VALUE,
  PAYMENT_METHOD_IN_ORDER_PAGE,
  DELIVERY_TYPE_MAP,
  DELIVERY_TIME_MAP,
} from '@constants/order';
import CardItem from '@components/Pages/Mypage/Card/CardItem';
import {
  createOrderPreviewApi,
  createOrderApi,
  postKakaoPaymentApi,
  postTossPaymentApi,
  postPaycoPaymentApi,
  postNicePaymnetApi,
} from '@api/order';
import { useQuery } from 'react-query';
import {
  Obj,
  IGetCard,
  ILocation,
  ICoupon,
  ICreateOrder,
  IGetNicePaymentResponse,
  IUserInputObj,
  IAccessMethod,
} from '@model/index';
import { getCustomDate } from '@utils/destination';
import { OrderCouponSheet } from '@components/BottomSheet/OrderCouponSheet';
import { useMutation, useQueryClient } from 'react-query';
import SlideToggle from '@components/Shared/SlideToggle';
import { SubsInfoBox, SubsOrderItem, SubsOrderList, SubsPaymentMethod } from '@components/Pages/Subscription/payment';
import { setCookie, getUnCommaPrice } from '@utils/common';
import { periodMapper } from '@constants/subscription';
import MenusPriceBox from '@components/Pages/Subscription/payment/MenusPriceBox';
import useIsApp from '@hooks/useIsApp';
import { ACCESS_METHOD } from '@constants/order';

declare global {
  interface Window {
    goPay: any;
  }
}

/* TODO: access method 컴포넌트 분리 가능 나중에 리팩토링 */
/* TODO: 배송 출입 부분 함수로 */
/* TODO: 배송예정 어떻게? */

const successOrderPath: string = 'order/finish';

const OrderPage = () => {
  const dispatch = useDispatch();
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
  const [userInputObj, setUserInputObj] = useState<IUserInputObj>({
    receiverName: '',
    receiverTel: '',
    point: 0,
    deliveryMessage: '',
    deliveryMessageType: '',
    coupon: 0,
  });
  const [card, setCard] = useState<IGetCard>();

  const [options, setOptions] = useState<any>();
  const [checkTermList, setCheckTermList] = useState<Obj>({
    privacy: false,
    subscription: false,
  });
  const isApp = useIsApp();
  const token = getCookie({ name: 'acstk' });
  const alwaysPointAll = getCookie({ name: 'alwaysPointAll' }) === 'true';

  const { userAccessMethod, isLoading, isMobile } = useSelector(commonSelector);
  const { selectedCoupon } = useSelector(couponForm);
  const { tempOrder, selectedCard, recentPayment, userOrderInfo } = useSelector(orderForm);
  const { me } = useSelector(userForm);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { message, isSubscription } = router.query;
  const needCard = selectedOrderMethod === 'NICE_BILLING' || selectedOrderMethod === 'NICE_CARD';

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

        if (data?.order.type === 'SUBSCRIPTION' && data?.order.subscriptionPeriod === 'UNLIMITED') {
          // 정기구독은 카드결제만 가능
          setSelectedOrderMethod('NICE_BILLING');
        }
      },
      onError: (error: any) => {
        if (error?.code === 5005) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 배송일 입니다.',
            })
          );
          isSubscription ? router.replace('/subscription') : router.replace('/cart');
        } else {
          isSubscription ? router.replace('/subscription') : router.replace('/cart');
        }
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const { mutateAsync: mutateCreateOrder } = useMutation(
    async () => {
      /*TODO: 모델 수정해야함 */

      const { point, payAmount, deliveryMessage, receiverName, receiverTel, coupon, deliveryMessageReused, ...rest } =
        previewOrder?.order!;

      const hasMsg = userInputObj?.deliveryMessage.length !== 0;
      const hasMsgType = userInputObj.deliveryMessageType.length !== 0;

      dispatch(SET_IS_LOADING(true));

      const reqBody = {
        payMethod: selectedOrderMethod,
        cardId: needCard ? card?.id! : null,
        point: userInputObj?.point,
        payAmount: payAmount - (userInputObj.point + (userInputObj.coupon! || 0)),
        couponId: selectedCoupon?.id! || null,
        deliveryMessage: hasMsg ? userInputObj?.deliveryMessage : null,
        deliveryMessageType: hasMsgType ? userInputObj.deliveryMessageType : null,
        receiverName: userInputObj?.receiverName!,
        receiverTel: userInputObj?.receiverTel!,
        deliveryMessageReused: checkForm?.accessMethodReuse.isSelected
          ? checkForm?.accessMethodReuse.isSelected
          : false,
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
        if (checkForm.alwaysPointAll.isSelected) {
          setCookie({ name: 'alwaysPointAll', value: 'true' });
        }
        if (data.status === 'PROGRESS') {
          router.replace(`/order/finish?orderId=${data.id}`);
          return;
        }

        if (selectedOrderMethod === 'NICE_BILLING') {
          router.replace(`/order/finish?orderId=${data.id}`);
          return;
        }

        processOrder(data);
        // 완료되면 쿠폰 초기화
        dispatch(INIT_COUPON());
      },
      onError: (error: any) => {
        if (error.code === 1122) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 쿠폰입니다.',
            })
          );
        } else if (error.code === 5000) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 배송방법 입니다.',
            })
          );
        } else if (error.code === 5001) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 배송상태 입니다.',
            })
          );
        } else if (error.code === 5002) {
          dispatch(
            SET_ALERT({
              alertMessage: '[BOX25] 지원되지 않는 작업입니다.',
            })
          );
        } else if (error.code === 5003) {
          dispatch(
            SET_ALERT({
              alertMessage: '[코레일] 지원되지 않는 작업입니다.',
            })
          );
        } else if (error.code === 5004) {
          dispatch(
            SET_ALERT({
              alertMessage: '사용할 수 없는 쿠폰 입니다.',
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
        } else if (error.code === 5006) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 결제 금액입니다.',
            })
          );
        } else if (error.code === 5007) {
          dispatch(
            SET_ALERT({
              alertMessage: '포인트가 부족합니다.',
            })
          );
        } else if (error.code === 5008) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 주문 타입입니다.',
            })
          );
          router.replace('/cart');
        } else if (error.code === 5009) {
          dispatch(
            SET_ALERT({
              alertMessage: '카드를 등록해주세요.',
            })
          );
        } else if (error.code === 5010) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 주문 포인트입니다.',
            })
          );
        } else if (error.code === 5011) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 주문 상태입니다.',
            })
          );
        } else if (error.code === 5012) {
          dispatch(
            SET_ALERT({
              alertMessage: '잘못된 결제 방법입니다.',
            })
          );
        } else if (error.code === 5013) {
          dispatch(
            SET_ALERT({
              alertMessage: '함께 배송에 지원되지 않는 작업입니다.',
            })
          );
        } else if (error.code === 5014) {
          dispatch(
            SET_ALERT({
              alertMessage: '정기 구독에 지원되지 않는 작업입니다.',
            })
          );
        } else if (error.code === 5015) {
          dispatch(
            SET_ALERT({
              alertMessage: '함께 배송 상태가 잘못되었습니다.',
            })
          );
        } else if (error.code === 1104) {
          dispatch(
            SET_ALERT({
              alertMessage: '카드를 등록해주세요.',
            })
          );
        } else if (error.code === 1999) {
          dispatch(
            SET_ALERT({
              alertMessage: '상품 정보가 변경되어 결제를 완료할 수 없어요. 장바구니 확인 후 다시 시도해 주세요.',
            })
          );
        } else if (error.code === 5018) {
          dispatch(SET_ALERT({ alertMessage: '결제에 실패했습니다. 다시 시도해주세요.' }));
        } else {
          dispatch(SET_ALERT({ alertMessage: '결제에 실패했습니다. 다시 시도해주세요.' }));
        }
        dispatch(SET_IS_LOADING(false));
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

  const userInputHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (checkForm.samePerson.isSelected) {
      setCheckForm({ ...checkForm, samePerson: { isSelected: false } });
    }

    setUserInputObj({ ...userInputObj, [name]: value });
  };

  const checkFormHanlder = (name: string) => {
    if (tempOrder?.isSubOrderDelivery && name === 'samePerson') {
      return;
    }
    setCheckForm({ ...checkForm, [name]: { isSelected: !checkForm[name].isSelected } });
  };

  const changePointHandler = (val: string): void => {
    const { point } = previewOrder!;
    const { payAmount } = previewOrder?.order!;

    let uncommaValue = Number(getUnCommaPrice(val));
    const limitPoint = Math.min(payAmount, point) - (userInputObj.coupon! || 0);

    if (uncommaValue >= limitPoint) {
      uncommaValue = limitPoint > 0 ? limitPoint : 0;
    }

    setUserInputObj({ ...userInputObj, point: uncommaValue });
  };

  const selectAccessMethodHandler = () => {
    const found = ACCESS_METHOD.find((item) => item.value === userInputObj?.deliveryMessageType);

    dispatch(
      SET_BOTTOM_SHEET({
        content: <AccessMethodSheet userAccessMethod={found} />,
      })
    );
  };

  const selectOrderMethodHanlder = (method: any) => {
    const { value } = method;

    setSelectedOrderMethod(value);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setUserInputObj({ ...userInputObj, [name]: value });
  };

  const getAllOfPointHandler = (): number => {
    const { point } = previewOrder!;
    const { payAmount } = previewOrder?.order!;

    const limitPoint = Math.min(payAmount, point) - (point === 0 ? 0 : userInputObj.coupon ?? 0);
    console.log(limitPoint);
    let avaliablePoint = 0;
    if (limitPoint < payAmount) {
      avaliablePoint = limitPoint;
    } else {
      avaliablePoint = payAmount;
    }
    setUserInputObj({ ...userInputObj, point: avaliablePoint });
    return avaliablePoint;
  };

  const couponHandler = (coupons: ICoupon[]) => {
    dispatch(SET_BOTTOM_SHEET({ content: <OrderCouponSheet coupons={coupons} isOrder /> }));
  };

  const clearPointHandler = () => {
    setUserInputObj({ ...userInputObj, point: 0 });
  };

  const goToCardManagemnet = () => {
    dispatch(SET_USER_ORDER_INFO(userInputObj));
    if (isSubscription) {
      router.push({ pathname: '/mypage/card', query: { isOrder: true, isSubscription: true } });
    } else {
      router.push({ pathname: '/mypage/card', query: { isOrder: true } });
    }
  };

  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };

  const webviewPayment = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        cmd: 'webview-payment',
        data: {
          returnUrl: `${process.env.SERVICE_URL}${router.asPath}`,
        },
      })
    );
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

    const reqBody = {
      payMethod: selectedOrderMethod,
      successUrl: `${process.env.SERVICE_URL}/${successOrderPath}?orderId=${orderId}`,
      failureUrl: `${process.env.SERVICE_URL}${router.asPath}`,
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

        if (isMobile || isApp) {
          if (!['EncodeParameters', 'SocketYN', 'UserIP'].includes(formName)) {
            payFormMobile.appendChild(inputHidden);
          }
        } else {
          payForm.appendChild(inputHidden);
        }
      }

      if (isMobile || isApp) {
        let acsNoIframeInput = document.createElement('input');
        acsNoIframeInput.setAttribute('type', 'hidden');
        acsNoIframeInput.setAttribute('name', 'AcsNoIframe');
        acsNoIframeInput.setAttribute('value', 'Y'); // 변경 불가
        payFormMobile.appendChild(acsNoIframeInput);
        nicepayMobileStart();
        if (isApp) {
          webviewPayment();
        }
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

    /* TODO: 모바일, 안드로이드 체크  */

    try {
      const { data } = await postKakaoPaymentApi({ orderId, data: reqBody });

      setCookie({
        name: 'kakao-tid-clover',
        value: data.data.tid,
      });

      if (isApp) {
        window.location.href = data.data.next_redirect_app_url;
      } else if (isMobile) {
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

    try {
      const { data } = await postTossPaymentApi({ orderId, data: reqBody });
      setCookie({
        name: 'toss-tid-clover',
        value: data.data.payToken,
      });

      window.location.href = data.data.checkoutPage;
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
      dispatch(SET_IS_LOADING(false));
    }
  };

  const checkCouponHandler = () => {
    const { payAmount } = previewOrder?.order!;

    const coupon = selectedCoupon?.usedValue ?? 0;
    const usePointOverAmount = userInputObj.point === payAmount;
    const isUsePoint = userInputObj.point > 0;

    const value = isUsePoint && usePointOverAmount ? userInputObj.point - coupon : userInputObj.point;
    return { value, coupon };
  };

  const paymentHandler = () => {
    const isMorning = previewOrder?.order?.delivery === 'MORNING';
    const isParcel = previewOrder?.order?.delivery === 'PARCEL';

    if (isLoading) return;

    if (!checkTermList.privacy) {
      dispatch(SET_ALERT({ alertMessage: '개인정보 수집·이용 동의를 체크해주세요.' }));
      return;
    }
    if (previewOrder?.order.type === 'SUBSCRIPTION' && !checkTermList.subscription) {
      dispatch(SET_ALERT({ alertMessage: '정기구독 이용약관·주의사항 동의를 체크해주세요.' }));
      return;
    }

    if (isMorning) {
      const isFreeAccess =
        userInputObj?.deliveryMessageType === 'FREE' ||
        userInputObj?.deliveryMessageType === 'DELIVERY_SECURITY_OFFICE';
      if (!isFreeAccess && (!userInputObj?.deliveryMessage || !userInputObj.deliveryMessageType)) {
        dispatch(SET_ALERT({ alertMessage: '출입 방법과 메시지를 입력해주세요.' }));
        return;
      }
    }

    if (userInputObj.receiverName.length === 0 || userInputObj.receiverTel.length === 0) {
      dispatch(SET_ALERT({ alertMessage: '받는 사람 정보를 입력해주세요.' }));
      return;
    }

    if (previewOrder?.order.type === 'SUBSCRIPTION') {
      dispatch(
        SET_ALERT({
          children: (
            <>
              <FlexRow padding="0 0 16px 0">
                <TextH5B padding="1px 4px 0 0" color={theme.brandColor}>
                  구독 결제 전 꼭 확인해 주세요!
                </TextH5B>
              </FlexRow>
              <SubsAlertTextBox>
                <li>
                  <TextB2R>배송지, 배송 요청사항 오기입으로 상품 수령이 불가능한 경우, 보상이 불가해요.</TextB2R>
                </li>
                <li>
                  <TextB2R>
                    프레시코드 구독은 사전예약 상품으로 환불 규정에 따라 특정 시간대 취소 시 전액 환불이 불가할 수
                    있어요. 환불 규정을 참고해 주세요.
                  </TextB2R>
                </li>
              </SubsAlertTextBox>
            </>
          ),
          closeBtnText: '취소',
          submitBtnText: '확인',
          onSubmit: () => {
            mutateCreateOrder();
          },
        })
      );
    } else {
      if (previewOrder?.order.delivery === 'MORNING') {
        dispatch(
          SET_ALERT({
            alertMessage:
              '주문변경 및 취소는 배송일 전날 오후 3시까지만 가능합니다.\n[배송지/배송요청사항] 오기입으로 인해 상품 수령이 불가능하게 될 경우, 고객님의 책임으로 간주되어 보상이 불가능합니다.\n 배송지를 최종 확인 하셨나요?',
            closeBtnText: '취소',
            submitBtnText: '확인',
            onClose: () => {},
            onSubmit: () => {
              mutateCreateOrder();
            },
          })
        );
      } else {
        if (previewOrder?.order?.isSubOrderDelivery) {
          dispatch(
            SET_ALERT({
              children: (
                <FlexColCenter>
                  <TextB2R>함께배송 주문을 결제 하시겠습니까?</TextB2R>
                  <TextB2R color={theme.greyScale65} center>
                    (함께배송은 주문 건당 총 1회 가능,
                  </TextB2R>
                  <TextB2R color={theme.greyScale65} center>
                    주문취소 시 재주문은 불가해요)
                  </TextB2R>
                </FlexColCenter>
              ),

              closeBtnText: '취소',
              submitBtnText: '확인',
              onSubmit: () => {
                mutateCreateOrder();
              },
            })
          );
          return;
        } else {
          mutateCreateOrder();
        }
      }
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
  }, [previewOrder, checkForm.samePerson.isSelected]);

  useEffect(() => {
    const card = selectedCard
      ? previewOrder?.cards.find((c) => c.id === selectedCard)
      : previewOrder?.cards.find((c) => c.main);

    setCard(card!);

    if (recentPayment) {
      setSelectedOrderMethod(recentPayment);
    }

    const hasEditInfo =
      userOrderInfo?.receiverName !== previewOrder?.order.userName ||
      userOrderInfo?.receiverTel !== previewOrder?.order.userTel;

    const isEdited = !!userOrderInfo && hasEditInfo;

    setCheckForm({
      ...checkForm,
      accessMethodReuse: { isSelected: previewOrder?.order?.deliveryMessageReused },
      samePerson: { isSelected: isEdited ? false : true },
    });
  }, [previewOrder]);

  useEffect(() => {
    if (previewOrder) {
      const { coupon, value } = checkCouponHandler();
      setUserInputObj({ ...userInputObj, coupon, point: value });
    }
  }, [selectedCoupon, previewOrder]);

  useEffect(() => {
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
    if (previewOrder) {
      const isMorning = ['MORNING'].includes(previewOrder?.order?.delivery!);
      const { userName, userTel, receiverName, receiverTel, deliveryMessageReused } = previewOrder?.order!;
      const { deliveryMessage, deliveryMessageType } = previewOrder?.destination;

      const editReceiverName = userOrderInfo?.receiverName ? userOrderInfo?.receiverName : userName!;
      const editReceiverTel = userOrderInfo?.receiverTel ? userOrderInfo?.receiverTel : userTel!;
      const editDeliveryMessage = userOrderInfo?.deliveryMessage ? userOrderInfo?.deliveryMessage : deliveryMessage!;
      const editDeliveryMessageType = userOrderInfo?.deliveryMessageType
        ? userOrderInfo?.deliveryMessageType
        : deliveryMessageType!;
      const avaliablePoint = alwaysPointAll ? getAllOfPointHandler() : 0;
      const { coupon, value } = checkCouponHandler();

      if (isMorning) {
        if (deliveryMessageReused && !userAccessMethod?.value) {
          console.log('917');
          setUserInputObj({
            ...userInputObj,
            deliveryMessage: editDeliveryMessage,
            deliveryMessageType: editDeliveryMessageType,
            receiverName: editReceiverName,
            receiverTel: editReceiverTel,
            coupon,
            point: value ? value : avaliablePoint,
          });
        } else if (userAccessMethod?.value!) {
          console.log('926');
          setUserInputObj({
            ...userInputObj,
            deliveryMessageType: userAccessMethod?.value!,
            deliveryMessage: editDeliveryMessage,
            receiverName: editReceiverName,
            receiverTel: editReceiverTel,
            coupon,
            point: value ? value : avaliablePoint,
          });
        } else {
          console.log('935');
          setUserInputObj({
            ...userInputObj,
            receiverName: editReceiverName,
            receiverTel: editReceiverTel,
            coupon,
            point: value ? value : avaliablePoint,
          });
        }
      } else {
        console.log('943');
        setUserInputObj({
          ...userInputObj,
          receiverName: editReceiverName,
          receiverTel: editReceiverTel,
          coupon,
          point: value ? value : avaliablePoint,
          deliveryMessage: '',
          deliveryMessageType: '',
        });
      }
    }
  }, [previewOrder, userAccessMethod, userOrderInfo]);

  useEffect(() => {
    // 새로고침 시 중복 결제 방어 풀림
    dispatch(SET_IS_LOADING(false));
  }, []);

  useEffect(() => {
    if (!token) router.replace('/login');
  }, []);

  useEffect(() => {
    if (userOrderInfo) {
      setUserInputObj(userOrderInfo);
    }
    if (alwaysPointAll) {
      setCheckForm({ ...checkForm, alwaysPointAll: { isSelected: alwaysPointAll } });
    }
  }, []);

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
    type,
  } = previewOrder?.order!;
  const { grade } = me!;

  const { deliveryDate, spotName, spotPickupName, orderOptions, deliveryStartTime, deliveryEndTime } =
    previewOrder?.order?.orderDeliveries[0]!;
  const orderMenus = previewOrder?.order?.orderDeliveries[0]?.orderMenus || [];
  const { point } = previewOrder!;
  const { dayFormatter } = getCustomDate(deliveryDate);

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
              <TextB2R padding="0 13px 0 0">{`${userName}, ${userTel}`}</TextB2R>
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
              // disabled={tempOrder?.isSubOrderDelivery}
            />
            <TextB2R padding="0 0 0 8px" color={tempOrder?.isSubOrderDelivery ? theme.greyScale45 : theme.black}>
              주문자와 동일
            </TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">이름</TextH5B>
          <TextInput
            placeholder="이름"
            value={userInputObj.receiverName}
            name="receiverName"
            eventHandler={userInputHandler}
            disabled={tempOrder?.isSubOrderDelivery}
            maxLength={20}
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
            disabled={tempOrder?.isSubOrderDelivery}
          />
        </FlexCol>
      </ReceiverInfoWrapper>
      <BorderLine height={8} />

      {previewOrder?.order.type === 'SUBSCRIPTION' && (
        <>
          <SubsInfoBox
            subscriptionRound={previewOrder.order.subscriptionRound}
            deliveryDayLength={subsInfo?.deliveryDay?.length!}
            deliveryDay={subsInfo?.deliveryDay?.join('·')!}
            datePeriodFirst={getFormatDate(subsInfo?.datePeriod![0])!}
            datePeriodLast={getFormatDate(subsInfo?.datePeriod![1])!}
            subscriptionPeriod={previewOrder.order.subscriptionPeriod}
          />
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
          <DeliveryDateBox
            location={location}
            delivery={delivery}
            deliveryDetail={deliveryDetail}
            dayFormatter={dayFormatter}
            destinationName={previewOrder?.destination.name!}
            spotPickupName={spotPickupName}
            deliveryStartTime={deliveryStartTime}
            deliveryEndTime={deliveryEndTime}
          />
        </FlexCol>
        <MustCheckAboutDelivery>
          <FlexCol>
            <FlexRow padding="0 0 8px 0">
              <SVGIcon name="exclamationMark" />
              <TextH6B padding="2px 0 0 2px" color={theme.brandColor}>
                주문 변경 및 취소 시 반드시 확인해주세요!
              </TextH6B>
            </FlexRow>
            <CancelOrderInfoBox
              delivery={delivery}
              deliveryDetail={deliveryDetail}
              orderType={previewOrder?.order.type!}
              color={theme.brandColor}
            />
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
                <TextB2R
                  color={ACCESS_METHOD_VALUE[userInputObj.deliveryMessageType] ? theme.greyScale100 : theme.greyScale45}
                >
                  {ACCESS_METHOD_VALUE[userInputObj.deliveryMessageType] || '출입방법 선택'}
                </TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                name="deliveryMessage"
                margin="8px 0 0 0"
                placeholder={
                  ACCESS_METHOD_PLACEHOLDER[userInputObj.deliveryMessageType]
                    ? ACCESS_METHOD_PLACEHOLDER[userInputObj.deliveryMessageType]
                    : '요청사항 입력 (선택)'
                }
                value={userInputObj?.deliveryMessage ? userInputObj?.deliveryMessage : ''}
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
            <TextInput
              name="deliveryMessage"
              margin="24px 0 0 0"
              placeholder="요청사항 입력"
              value={userInputObj?.deliveryMessage ? userInputObj?.deliveryMessage : ''}
              eventHandler={changeInputHandler}
            />
          </VisitorAccessMethodWrapper>
          <BorderLine height={8} />
        </>
      )}
      <CouponWrapper onClick={() => couponHandler(previewOrder?.coupons!)}>
        <FlexBetween>
          <TextH4B>할인 쿠폰</TextH4B>
          <FlexRow>
            {selectedCoupon ? (
              <TextB2R padding="0 10px 0 0">{getFormatPrice(String(selectedCoupon.usedValue))}원</TextB2R>
            ) : (
              <TextB2R padding="0 10px 0 0">{previewOrder?.coupons.length}장 보유</TextB2R>
            )}
            <div>
              <SVGIcon name="arrowRight" />
            </div>
          </FlexRow>
        </FlexBetween>
      </CouponWrapper>
      <BorderLine height={8} />
      <PointWrapper>
        <FlexBetween>
          <TextH4B>포인트 사용</TextH4B>
          {previewOrder?.order?.subscriptionPeriod !== 'UNLIMITED' && (
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
          )}
        </FlexBetween>
        <FlexRow padding="24px 0 0 0">
          <span className="inputBox">
            <TextInput
              name="point"
              width="100%"
              placeholder="0"
              value={userInputObj.point.toLocaleString()}
              eventHandler={(e) => changePointHandler(String(e.target.value))}
            />
            {userInputObj.point > 0 && (
              <DeletePoint onClick={clearPointHandler}>
                <SVGIcon name="blackBackgroundCancel" />
              </DeletePoint>
            )}
          </span>
          <Button width="86px" height="48px" onClick={getAllOfPointHandler}>
            전액 사용
          </Button>
        </FlexRow>
        <TextB3R padding="4px 0 0 16px">사용 가능한 포인트 {point.toLocaleString()}원</TextB3R>
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
            {PAYMENT_METHOD_IN_ORDER_PAGE.map((method, index) => {
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
                  <CardItem
                    onClick={goToCardManagemnet}
                    card={card}
                    cardCount={previewOrder?.cards?.length}
                    isFromOrder={true}
                  />
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
          goToCardManagemnet={goToCardManagemnet}
          card={card!}
          subscriptionPaymentDate={previewOrder?.order?.subscriptionPaymentDate!}
        />
      )}
      {previewOrder?.order.type === 'GENERAL' && (
        <GeneralMenusPriceBox
          menuAmount={menuAmount}
          menuDiscount={menuDiscount}
          eventDiscount={eventDiscount}
          userInputObj={userInputObj}
          optionAmount={optionAmount}
          orderOptions={orderOptions}
          deliveryFee={deliveryFee}
          deliveryFeeDiscount={deliveryFeeDiscount}
          payAmount={payAmount}
          grade={grade!}
        />
      )}
      {previewOrder?.order.type === 'SUBSCRIPTION' && (
        <MenusPriceBox
          disposable={true}
          menuPrice={menuAmount!}
          menuDiscount={menuDiscount!}
          eventDiscount={eventDiscount!}
          menuOption1={options?.option1!}
          menuOption2={options?.option2!}
          deliveryPrice={(deliveryFee - deliveryFeeDiscount)!}
          deliveryLength={previewOrder?.order.orderDeliveries.length}
          point={userInputObj.point}
          type={'last'}
          deliveryType={previewOrder?.order.delivery}
          subscriptionDiscountRates={previewOrder?.order.subscriptionDiscountRates}
          grade={grade!}
          coupon={userInputObj?.coupon > 0 ? userInputObj?.coupon : undefined}
        />
      )}
      <OrderTermWrapper>
        <TextH5B>구매 조건 확인 및 결제 진행 필수 동의</TextH5B>
        <FlexRow padding="17px 0 0 0" pointer>
          <Checkbox
            className="checkBox"
            isSelected={checkTermList.privacy}
            onChange={() => {
              checkOrderTermHandler('privacy');
            }}
          />
          <TextB2R
            padding="0 8px"
            onClick={() => {
              checkOrderTermHandler('privacy');
            }}
          >
            개인정보 수집·이용 동의 (필수)
          </TextB2R>
          <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo} pointer>
            자세히
          </TextH6B>
        </FlexRow>
        {previewOrder?.order.type === 'SUBSCRIPTION' && (
          <FlexRow padding="8px 0 0 0" pointer>
            <Checkbox
              className="checkBox"
              isSelected={checkTermList.subscription}
              onChange={() => {
                checkOrderTermHandler('subscription');
              }}
            />
            <TextB2R
              padding="0 8px"
              onClick={() => {
                checkOrderTermHandler('subscription');
              }}
            >
              정기구독 이용약관・주의사항 동의 (필수)
            </TextB2R>
            <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={goToTermInfo}>
              자세히
            </TextH6B>
          </FlexRow>
        )}
      </OrderTermWrapper>
      <OrderBtn onClick={() => paymentHandler()}>
        <Button borderRadius="0" height="100%" disabled={isLoading} className="orderBtn">
          {getFormatPrice(String(payAmount - (userInputObj.point + (userInputObj.coupon! || 0))))}원 결제하기
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
  cursor: pointer;
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

const OrderTermWrapper = styled.div`
  ${homePadding}
  display: flex;
  flex-direction: column;
  padding: 32px 24px 88px 24px;
`;

const OrderBtn = styled.div`
  ${fixedBottom}
`;

const SubsAlertTextBox = styled.ul`
  li {
    position: relative;
    padding-left: 20px;
    word-break: keep-all;
    &::after {
      content: '';
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 3px;
      left: 9px;
      top: 7.5px;
      background-color: ${theme.black};
    }
  }
`;

export default OrderPage;
