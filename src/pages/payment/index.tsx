import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/BorderLine';
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
  FlexRowStart,
  fixedBottom,
} from '@styles/theme';
import { TextB2R, TextH4B, TextB3R, TextH6B, TextH5B } from '@components/Text';
import Tag from '@components/Tag';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import SVGIcon from '@utils/SVGIcon';
import { useSelector } from 'react-redux';
import { cartForm } from '@store/cart';
import PaymentItem from '@components/Payment/PaymentItem';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import TextInput from '@components/TextInput';
import { Select, AcessMethodOption } from '@components/Dropdown/index';
import router from 'next/router';
import CardItem from '@components/Mypage/CardItem';

const ACCESS_METHOD = [
  {
    id: 1,
    text: '자유출입 가능',
  },
  {
    id: 2,
    text: '자유출입 가능2',
  },
  {
    id: 3,
    text: '자유출입 가능3',
  },
  {
    id: 4,
    text: '자유출입 가능123123',
  },
];

const PAYMENT_METHOD = [
  {
    id: 1,
    text: '프코페이',
    value: 'fcopay',
  },
  {
    id: 2,
    text: '계좌이체',
    value: 'account',
  },
  {
    id: 3,
    text: '카카오페이',
    value: 'kakaopay',
  },
  {
    id: 4,
    text: '페이코',
    value: 'fcopay',
  },
  {
    id: 5,
    text: '토스',
    value: 'fcopay',
  },
];

const hasRegisteredCart = true;
const point = 5000;

function payment() {
  const [showSectionObj, setShowSectionObj] = useState({
    showOrderItemSection: false,
    showCustomerInfoSection: false,
  });
  const [itemlist, setItemList] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(1);

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

  const selectOptionHandler = () => {};

  const selectPaymentMethodHanlder = (method: any) => {
    const { id } = method;
    setSelectedPaymentMethod(id);
  };

  const goToFinishPayment = () => {};

  const goToCardManagemnet = () => {
    router.push('/mypage/card');
  };

  const goToRegisteredCard = () => {
    router.push('/mypage/card/register');
  };

  return (
    <Container>
      <OrderItemsWrapper>
        <FlexBetween padding="24px 0 0 0">
          <TextH4B>주문상품</TextH4B>
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
          {itemlist.map((menu, index) => {
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
        <FlexBetween>
          <TextH4B>출입 방법</TextH4B>
          <FlexRow>
            <Checkbox onChange={checkSamePerson} isSelected />
            <TextB2R padding="0 0 0 8px">다음에도 사용</TextB2R>
          </FlexRow>
        </FlexBetween>
        <FlexCol padding="24px 0 16px 0">
          <Select placeholder="배송출입 방법">
            {ACCESS_METHOD.map((option: any, index: number) => (
              <AcessMethodOption
                key={index}
                option={option}
                selectOptionHandler={selectOptionHandler}
              />
            ))}
          </Select>
          <TextInput placeholder="내용을 입력해주세요" margin="8px 0 0 0" />
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
              공동현관 및 무인택배함 비밀번호는 조합 방식 및 순서(#,호출버튼)와
              함께 자세히 기재해주세요.
            </TextB3R>
          </FlexCol>
        </MustCheckAboutDelivery>
      </VisitorAccessMethodWrapper>
      <BorderLine height={8} />
      <CouponWrapper>
        <FlexBetween>
          <TextH4B>할인 쿠폰</TextH4B>
          <FlexRow>
            <TextB2R padding="0 10px 0 0">-3000원</TextB2R>
            <TextH6B color={theme.greyScale65} textDecoration="underline">
              선택
            </TextH6B>
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
        {hasRegisteredCart && <CardItem onClick={goToCardManagemnet} />}
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
        <FlexEnd padding="11px 0 0 0">
          <Tag
            backgroundColor={theme.brandColor5}
            color={theme.brandColor}
            margin="0"
          >
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
        <Button borderRadius="0">1232원 주문하기</Button>
      </PaymentBtn>
    </Container>
  );
}

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

export default payment;
