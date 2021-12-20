import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FlexRow,
  theme,
  FlexBetween,
  FlexCol,
  FlexBetweenStart,
  FlexColEnd,
} from '@styles/theme';
import {
  TextH4B,
  TextB3R,
  TextB2R,
  TextH5B,
  TextH6B,
} from '@components/Shared/Text';
import SVGIcon from '@utils/SVGIcon';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import PaymentItem from '@components/Pages/Payment/PaymentItem';
import BorderLine from '@components/Shared/BorderLine';
import Button from '@components/Shared/Button';
import { Obj } from '@model/index';
import { useToast } from '@hooks/useToast';

// const status = 'cancel';
// const status = 'progress' as const;
// const status = 'ready';
const status = 'complete';

interface IStatus {
  [index: string]: {
    text: string;
    color: string;
  };
}

const deliveryStatusMapper: Obj = {
  ready: { text: { value: '상품준비중', color: 'brandColor' }, button: {} },
  cancel: {
    text: { value: '주문취소', color: 'systemRed' },
    button: { color: 'greyScale25', backgroundColor: 'greyScale6' },
  },
  progress: { text: { value: '배송중', color: 'brandColor' }, button: {} },
  complete: { text: { value: '배송완료', color: 'brandColor' }, button: {} },
};

function OrderDetailPage() {
  const [itemList, setItemList] = useState([]);
  const [isShowOrderItemSection, setIsShowOrderItemSection] =
    useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    getCartList();
  }, []);

  const getCartList = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  const showSectionHandler = () => {
    setIsShowOrderItemSection(!isShowOrderItemSection);
  };

  const copyTextHandler = (e: any) => {
    const clipboard = navigator.clipboard;
    const { innerText } = e.target;

    clipboard.writeText(innerText).then(() => {
      showToast({
        message: '복사되었습니다.',
      });
    });
  };

  const getInvoiceNumberHandler = () => {};

  const deliveryDescription = (status: string) => {
    switch (status) {
      case 'complete':
      case 'progress': {
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
                onClick={copyTextHandler}
              >
                복사복사
              </TextH5B>
            </FlexRow>
            <TextH6B
              color={theme.greyScale65}
              padding="4px 0 0 0"
              textDecoration="underline"
              onClick={getInvoiceNumberHandler}
            >
              배송조회하기
            </TextH6B>
          </FlexBetween>
        );
      }
      case 'ready': {
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

  const disabledButton = status === 'cancel';
  const inProgressDelivery = status === 'progress';

  return (
    <Container>
      <DeliveryStatusWrapper>
        <FlexRow padding="0 0 13px 0">
          <TextH4B color={theme[deliveryStatusMapper[status].text.color]}>
            {deliveryStatusMapper[status].text.value}
          </TextH4B>
          <TextH4B padding="0 0 0 4px">11월 18일 도착예정</TextH4B>
        </FlexRow>
        <FlexRow>{deliveryDescription(status)}</FlexRow>
      </DeliveryStatusWrapper>
      <BorderLine height={8} />
      <OrderItemsWrapper>
        <FlexBetween>
          <TextH4B>주문상품</TextH4B>
          <FlexRow onClick={() => showSectionHandler()}>
            <SVGIcon
              name={isShowOrderItemSection ? 'triangleUp' : 'triangleDown'}
            />
          </FlexRow>
        </FlexBetween>
        <OrderListWrapper isShow={isShowOrderItemSection} status={status}>
          {itemList.map((menu, index) => {
            return (
              <PaymentItem
                menu={menu}
                key={index}
                isDeliveryComplete={status === 'complete'}
              />
            );
          })}
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="8px 0 0 0"
          >
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
            <TextB2R>123123</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0">
            <TextH5B>주문 상태</TextH5B>
            <TextB2R>배송 예정 중</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>주문(결제)일시</TextH5B>
            <TextB2R>2021-11-16 14:28</TextB2R>
          </FlexBetween>
        </FlexCol>
        <ButtonWrapper>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            margin="0 16px 0 0"
            disabled={disabledButton}
          >
            주문 취소하기
          </Button>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={disabledButton}
          >
            배송일 수정하기
          </Button>
        </ButtonWrapper>
      </OrderInfoWrapper>
      <BorderLine height={8} />
      <DevlieryInfoWrapper>
        <FlexBetween>
          <TextH4B>배송정보</TextH4B>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <FlexBetween>
            <TextH5B>받는 사람</TextH5B>
            <TextB2R>김프코</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0 0 0">
            <TextH5B>휴대폰 번호</TextH5B>
            <TextB2R>010-1232-2132</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0 0 0">
            <TextH5B>배송방법</TextH5B>
            <TextB2R>스팟배송 - 점심</TextB2R>
          </FlexBetween>
          <FlexBetweenStart margin="16px 0 0 0">
            <TextH5B>픽업장소</TextH5B>
            <FlexColEnd>
              <TextB2R>헤이그라운드 서울숲점 - 10층 냉장고</TextB2R>
              <TextB3R color={theme.greyScale65}>
                서울 성동구 왕십리로 115 10층
              </TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart margin="16px 0 24px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>11월 12일 (금) 11:30-12:00</TextB2R>
              <TextB3R color={theme.greyScale65}>
                예정보다 빠르게 배송될 수 있습니다.
              </TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            border
            disabled={disabledButton}
          >
            배송 정보 변경하기
          </Button>
        </FlexCol>
      </DevlieryInfoWrapper>
      <BorderLine height={8} margin="50px 0 0 0" />
      <TotalPriceWrapper>
        <TextH4B padding="0 0 24px 0">결제정보</TextH4B>
        <FlexBetween>
          <TextB2R>상품 금액</TextB2R>
          <TextB2R>222원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>상품할인금액</TextB2R>
          <TextB2R>22원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>배송비</TextB2R>
          <TextB2R>22원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="16px 0 0 0">
          <TextB2R>할인쿠폰 사용</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <FlexBetween padding="8px 0 0 0">
          <TextB2R>포인트 사용</TextB2R>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="8px 0" />
        <FlexBetween padding="8px 0 0 0">
          <TextH4B>총 결제금액</TextH4B>
          <TextH4B>12312원</TextH4B>
        </FlexBetween>
      </TotalPriceWrapper>
    </Container>
  );
}

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

export default OrderDetailPage;
