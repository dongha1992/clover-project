import React, { useState, useEffect } from 'react';
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
import {
  TextB2R,
  TextH4B,
  TextB3R,
  TextH6B,
  TextH5B,
} from '@components/Shared/Text';
import Tag from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import Checkbox from '@components/Shared/Checkbox';
import SVGIcon from '@utils/SVGIcon';
import PaymentItem from '@components/Pages/Payment/PaymentItem';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import TextInput from '@components/Shared/TextInput';
import router from 'next/router';
import { setBottomSheet } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { AccessMethodSheet } from '@components/BottomSheet/AccessMethodSheet';
import { commonSelector } from '@store/common';
import { couponForm } from '@store/coupon';
import { ACCESS_METHOD_MAP } from '@constants/payment';
import { destinationForm } from '@store/destination';
import CardItem, { ICard } from '@components/Pages/Mypage/Card/CardItem';

/* TODO: access method 컴포넌트 분리 가능 나중에 리팩토링 */
/* TODO: 배송 출입 부분 함수로 */
/* TODO: 결제 금액 부분 함수로 */
/* TODO: 카드 api로 메인 카드 조회 */
/* TODO: 배송 방법은 from 서버 or store */

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
    value: 'fcopay',
  },
  {
    id: 6,
    text: '토스',
    value: 'fcopay',
  },
];

export interface IAccessMethod {
  id: number;
  text: string;
  value: string;
}

/* TODO CardItem에 card 정보? */

const hasRegisteredCard = true;
const point = 5000;

const PaymentPage = () => {
  const [showSectionObj, setShowSectionObj] = useState({
    showOrderItemSection: false,
    showCustomerInfoSection: false,
  });
  const [itemList, setItemList] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(1);
  const [selectedAccessMethod, setSelectedAccessMethod] =
    useState<IAccessMethod>();

  const dispatch = useDispatch();
  const { userAccessMethod } = useSelector(commonSelector);
  const { selectedCoupon } = useSelector(couponForm);
  const { userDestinationStatus } = useSelector(destinationForm);

  const getCartList = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  useEffect(() => {
    getCartList();
  }, []);

  const showSectionHandler = (selectedSection: string) => {
    if (selectedSection === 'customInfo') {
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

  const checkPaymentTermHandler = () => {};

  const checkSamePerson = () => {};

  const selectAccessMethodHandler = () => {
    dispatch(
      setBottomSheet({
        content: <AccessMethodSheet userAccessMethod={userAccessMethod} />,
      })
    );
  };

  const selectPaymentMethodHanlder = (method: any) => {
    const { id } = method;
    setSelectedPaymentMethod(id);
  };

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
  };

  const couponHandler = () => {
    router.push({ pathname: '/mypage/coupon', query: { isPayment: true } });
  };

  const goToFinishPayment = () => {
    router.push('/payment/finish');
  };

  const goToCardManagemnet = (card: ICard) => {
    router.push('/mypage/card');
  };

  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };

  const isParcel = userDestinationStatus === 'parcel';
  const isMorning = userDestinationStatus === 'morning';
  const isFcoPay = selectedPaymentMethod === 1;

  return (
    <Container>
      <OrderItemsWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문상품 ({itemList.length})</TextH4B>
          <FlexRow onClick={() => showSectionHandler('orderItem')}>
            <TextB2R padding="0 13px 0 0">상품 이름...</TextB2R>
            <SVGIcon
              name={
                showSectionObj.showOrderItemSection
                  ? 'triangleUp'
                  : 'triangleDown'
              }
            />
          </FlexRow>
        </FlexBetween>
        <OrderListWrapper isShow={showSectionObj.showOrderItemSection}>
          {itemList.map((menu, index) => {
            return <PaymentItem menu={menu} key={index} />;
          })}
        </OrderListWrapper>
      </OrderItemsWrapper>
      <BorderLine height={8} margin="16px 0 0 0" />
      <CustomerInfoWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문자 정보</TextH4B>
          <ShowBtnWrapper onClick={() => showSectionHandler('customInfo')}>
            <TextB2R padding="0 13px 0 0">주문자 이름...</TextB2R>
            <SVGIcon
              name={
                showSectionObj.showCustomerInfoSection
                  ? 'triangleUp'
                  : 'triangleDown'
              }
            />
          </ShowBtnWrapper>
        </FlexBetween>
        <CustomInfoList isShow={showSectionObj.showCustomerInfoSection}>
          <FlexBetween>
            <TextH5B>보내는 사람</TextH5B>
            <TextB2R>김프코</TextB2R>
          </FlexBetween>
          <FlexBetween margin="16px 0">
            <TextH5B>휴대폰 전화</TextH5B>
            <TextB2R>010-2222-2222</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextH5B>이메일</TextH5B>
            <TextB2R>fco@freshcode.me</TextB2R>
          </FlexBetween>
        </CustomInfoList>
      </CustomerInfoWrapper>
      <BorderLine height={8} margin="24px 0 0 0" />
      <ReceiverInfoWrapper>
        <FlexBetween padding="0">
          <TextH4B>받는 사람 정보</TextH4B>
          <FlexRow>
            <Checkbox onChange={checkSamePerson} isSelected />
            <TextB2R padding="0 0 0 8px">주문자와 동일</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">이름</TextH5B>
          <TextInput placeholder="이름" />
        </FlexCol>
        <FlexCol>
          <TextH5B padding="0 0 8px 0">휴대폰 번호</TextH5B>
          <TextInput placeholder="휴대폰 번호" />
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
            <TextB2R>스팟배송</TextB2R>
          </FlexBetween>
          <FlexBetweenStart margin="16px 0">
            <TextH5B>배송 예정실시</TextH5B>
            <FlexColEnd>
              <TextB2R>11월 12일 (금) 11:30-12:00</TextB2R>
              <TextB3R color={theme.greyScale65}>
                예정보다 빠르게 배송될 수 있습니다.
              </TextB3R>
              <TextB3R color={theme.greyScale65}>(배송 후 문자 안내)</TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
          <FlexBetweenStart>
            <TextH5B>베송장소</TextH5B>
            <FlexColEnd>
              <TextB2R>헤이그라운드 서울숲점 - 10층 냉장고</TextB2R>
              <TextB3R color={theme.greyScale65}>
                서울 성동구 왕십리로 115 10층
              </TextB3R>
            </FlexColEnd>
          </FlexBetweenStart>
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
              주문취소는 배송일 전날 오전 7시까지 입니다.
            </TextB3R>
            <TextB3R color={theme.brandColor}>
              단, 오전 7시~9시 반 사이에는 주문 직후 5분 뒤 제조가 시작되어 취소
              불가합니다.
            </TextB3R>
          </FlexCol>
        </MustCheckAboutDelivery>
      </DevlieryInfoWrapper>
      <BorderLine height={8} />

      <VisitorAccessMethodWrapper>
        {isMorning && (
          <>
            <FlexBetween>
              <TextH4B>출입 방법</TextH4B>
              <FlexRow>
                <Checkbox onChange={checkSamePerson} isSelected />
                <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
              </FlexRow>
            </FlexBetween>
            <FlexCol padding="24px 0 16px 0">
              <AccessMethodWrapper onClick={selectAccessMethodHandler}>
                <TextB2R color={theme.greyScale45}>
                  {userAccessMethod.text || '출입방법 선택'}
                </TextB2R>
                <SVGIcon name="triangleDown" />
              </AccessMethodWrapper>
              <TextInput
                margin="8px 0 0 0"
                placeholder={
                  ACCESS_METHOD_MAP[userAccessMethod?.value!]
                    ? ACCESS_METHOD_MAP[userAccessMethod?.value!]
                    : '요청사항 입력'
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
                  공동현관 및 무인택배함 비밀번호는 조합 방식 및
                  순서(#,호출버튼)와 함께 자세히 기재해주세요.
                </TextB3R>
              </FlexCol>
            </MustCheckAboutDelivery>
          </>
        )}
        {isParcel && (
          <>
            <FlexBetween>
              <TextH4B>배송 메모</TextH4B>
              <FlexRow>
                <Checkbox onChange={checkSamePerson} isSelected />
                <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
              </FlexRow>
            </FlexBetween>
            <TextInput
              margin="24px 0 0 0"
              placeholder="요청사항 입력"
              eventHandler={changeInputHandler}
            />
          </>
        )}
      </VisitorAccessMethodWrapper>
      <BorderLine height={8} />
      <CouponWrapper>
        <FlexBetween>
          <TextH4B>할인 쿠폰</TextH4B>
          <FlexRow>
            {selectedCoupon ? (
              <TextB2R padding="0 10px 0 0">{selectedCoupon.discount}</TextB2R>
            ) : (
              <TextB2R padding="0 10px 0 0">4장 보유</TextB2R>
            )}

            <div onClick={couponHandler}>
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
            <Checkbox onChange={checkSamePerson} isSelected />
            <TextB2R padding="0 0 0 8px">항상 전액 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexRow padding="24px 0 0 0">
          <TextInput width="100%" margin="0 8px 0 0" value={point} />
          <DeletePoint>
            <SVGIcon name="blackBackgroundCancel" />
          </DeletePoint>
          <Button width="86px" height="48px">
            전액 사용
          </Button>
        </FlexRow>
        <TextB3R padding="4px 0 0 16px">사용 가능한 포인트 {point}원</TextB3R>
      </PointWrapper>
      <BorderLine height={8} />
      <PaymentMethodWrapper>
        <FlexBetween padding="0 0 24px 0">
          <TextH4B>결제수단</TextH4B>
          <FlexRow>
            <Checkbox onChange={checkSamePerson} isSelected />
            <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <GridWrapper gap={16}>
          {PAYMENT_METHOD.map((method, index) => {
            const isSelected = selectedPaymentMethod === method.id;
            return (
              <Button
                onClick={() => selectPaymentMethodHanlder(method)}
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
        <BorderLine height={1} margin="24px 0" />
        {hasRegisteredCard && (
          <CardItem onClick={goToCardManagemnet} card={card} />
        )}
        <Button
          border
          backgroundColor={theme.white}
          color={theme.black}
          onClick={goToRegisteredCard}
        >
          카드 등록하기
        </Button>
      </PaymentMethodWrapper>
      <BorderLine height={8} />
      <TotalPriceWrapper>
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
        <BorderLine height={1} margin="16px 0" />
        <FlexBetween>
          <TextH5B>포인트 사용</TextH5B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
        <FlexBetween>
          <TextH4B>최종 결제금액</TextH4B>
          <TextB2R>12312원</TextB2R>
        </FlexBetween>
        <FlexEnd padding="11px 0 0 0">
          <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
            프코 회원
          </Tag>
          <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
          <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
        </FlexEnd>
      </TotalPriceWrapper>
      <PaymentTermWrapper>
        <TextH5B>구매 조건 확인 및 결제 진행 필수 동의</TextH5B>
        <FlexRow padding="17px 0 0 0">
          <Checkbox isSelected onChange={checkPaymentTermHandler} />
          <TextB2R padding="0 8px">개인정보 수집·이용 동의 (필수)</TextB2R>
          <TextH6B color={theme.greyScale65} textDecoration="underline">
            자세히
          </TextH6B>
        </FlexRow>
      </PaymentTermWrapper>
      <PaymentBtn onClick={goToFinishPayment}>
        <Button borderRadius="0" height="100%">
          1232원 결제하기
        </Button>
      </PaymentBtn>
    </Container>
  );
};

const Container = styled.div``;
const OrderItemsWrapper = styled.div`
  ${homePadding}
`;
const OrderListWrapper = styled.div<{ isShow: boolean }>`
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
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

const CustomInfoList = styled.div<{ isShow: boolean }>`
  padding-top: 24px;
  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
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

const PaymentMethodWrapper = styled.div`
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

const PaymentTermWrapper = styled.div`
  ${homePadding}
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 160px;
`;

const PaymentBtn = styled.div`
  ${fixedBottom}
`;

export default PaymentPage;
