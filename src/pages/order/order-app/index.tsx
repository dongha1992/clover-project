import { postKakaoPaymentApi, postNicePaymnetApi, postPaycoPaymentApi, postTossPaymentApi } from '@api/order';
import { ICreateOrder, IGetNicePaymentResponse, Obj } from '@model/index';
import { SET_ALERT } from '@store/alert';
import { SET_IS_LOADING } from '@store/common';
import { getCookie, setCookie } from '@utils/common';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const OrderAppPage = () => {
  const dispatch = useDispatch();
  const [payMethod, setPayMethod] = useState();

  useEffect(() => {
    processOrder();
  }, []);

  const processOrder = async () => {
    const { payMethod, orderData } = JSON.parse(localStorage.getItem('payData') as string);
    setPayMethod(payMethod);

    switch (payMethod) {
      case 'NICE_CARD' || 'NICE_BANK':
        await progressPayNice(orderData, payMethod);
        break;
      case 'TOSS_CARD':
        await processTossPay(orderData, payMethod);
        break;
      case 'KAKAO_CARD':
        await processKakaoPay(orderData, payMethod);
        break;
      case 'PAYCO_EASY':
        await processPayco(orderData, payMethod);
        break;
    }
  };

  // 나이스 페이 ----------------------------------------------------------------------------------
  const progressPayNice = async (orderData: ICreateOrder, payMethod: string) => {
    const orderId = orderData.id;
    const reqBody = {
      payMethod,
      successUrl: `${process.env.SERVICE_URL}/order/finish?orderId=${orderId}&pg=toss`,
      failureUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
    };
    try {
      const { data }: { data: IGetNicePaymentResponse } = await postNicePaymnetApi({ orderId, data: reqBody });
      console.log('data', data);

      let payForm = document.getElementById('payForm')! as HTMLFormElement;
      payForm!.innerHTML = '';
      payForm!.action = `${process.env.API_URL}/order/v1/orders/${orderId}/nicepay-approve`;

      let payFormMobile: any = document.getElementById('payFormMobile')!;
      payFormMobile.innerHTML = 'https://web.nicepay.co.kr/v3/smart/smartPayment.jsp';

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

        if (!['EncodeParameters', 'SocketYN', 'UserIP'].includes(formName)) {
          payFormMobile.appendChild(inputHidden);
        }
      }

      let acsNoIframeInput = document.createElement('input');
      acsNoIframeInput.setAttribute('type', 'hidden');
      acsNoIframeInput.setAttribute('name', 'AcsNoIframe');
      acsNoIframeInput.setAttribute('value', 'Y'); // 변경 불가
      payFormMobile.appendChild(acsNoIframeInput);
      nicepayMobileStart();

      return;
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
      dispatch(SET_IS_LOADING(false));
    }
  };

  // 토스 ----------------------------------------------------------------------------------
  const processTossPay = async (orderData: ICreateOrder, payMethod: string) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/order/finish?orderId=${orderId}&pg=toss`,
      failureUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
    };

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

  // 카카오 ----------------------------------------------------------------------------------
  const processKakaoPay = async (orderData: ICreateOrder, payMethod: string) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/order/finish?orderId=${orderId}&pg=kakao`,
      cancelUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
      failureUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
    };

    try {
      const { data } = await postKakaoPaymentApi({ orderId, data: reqBody });

      setCookie({
        name: 'kakao-tid-clover',
        value: data.data.tid,
      });
      window.location.href = data.data.next_redirect_app_url;
    } catch (error: any) {
      if (error.code === 1207) {
        dispatch(SET_ALERT({ alertMessage: '잘못된 카카오페이 URL입니다.' }));
      } else {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      }
      dispatch(SET_IS_LOADING(false));
    }
  };

  // 페이코 ----------------------------------------------------------------------------------
  const processPayco = async (orderData: ICreateOrder, payMethod: string) => {
    const orderId = orderData.id;
    const reqBody = {
      successUrl: `${process.env.SERVICE_URL}/order/finish?orderId=${orderId}`,
      cancelUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
      failureUrl: `${process.env.SERVICE_URL}/order/order-app-fail`,
    };

    try {
      const { data } = await postPaycoPaymentApi({ orderId, data: reqBody });

      window.location.href = data.data.result.orderSheetUrl;
      dispatch(SET_IS_LOADING(false));
    } catch (error: any) {
      dispatch(SET_ALERT({ alertMessage: error.message }));
      dispatch(SET_IS_LOADING(false));
    }
  };

  const nicepayMobileStart = () => {
    const nicepayMobile: any = document.getElementById('payFormMobile');
    nicepayMobile?.submit();
  };

  return <></>;
};
export default OrderAppPage;
