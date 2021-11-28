import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/BorderLine';
import {
  TextB2R,
  TextH4B,
  TextH5B,
  TextH6B,
  TextH7B,
  TextB3R,
  TextH3B,
} from '@components/Text';
import {
  homePadding,
  theme,
  ScrollHorizonList,
  FlexBeteewn,
  FlexStart,
  FlexEnd,
} from '@styles/theme';
import CartSheetItem from '@components/CartSheet/CartSheetItem';
import Checkbox from '@components/Checkbox';
import { InfoMessage } from '@components/Message';
import SVGIcon from '@utils/SVGIcon';
import Button from '@components/Button';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { useDispatch } from 'react-redux';
import Item from '@components/Item';
import Tag from '@components/Tag';
import CountButton from '@components/Button/CountButton';

function Cart() {
  const [itemList, setItemList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getLists();
  }, []);

  const DISPOSABLE_LIST = [
    { value: 'fork', text: '포크/물티슈', price: 100 },
    { value: 'stick', text: '젓가락/물티슈', price: 100 },
  ];

  const getLists = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  const handleSelectCartItem = () => {};
  const handleSelectAllCartItem = () => {};
  const handleSelectDisposable = () => {};

  return (
    <Container>
      <DeliveryMethodAndPickupLocation>
        <Left>
          <TextH4B>배송방법과</TextH4B>
          <TextH4B>배송장소를 설정해주세요</TextH4B>
        </Left>
        <Right>
          <TextH6B color={theme.greyScale65} textDecoration="underline">
            설정하기
          </TextH6B>
        </Right>
      </DeliveryMethodAndPickupLocation>
      <BorderLine height={8} margin="24px 0" />
      <CartInfoContainer>
        <CartListWrapper>
          <ListHeader>
            <Left>
              <Checkbox onChange={handleSelectAllCartItem} />
              <TextB2R padding="0 0 0 8px">전체선택 (3/5)</TextB2R>
            </Left>
            <Right>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                선택삭제
              </TextH6B>
            </Right>
          </ListHeader>
          <BorderLine height={1} margin="16px 0" />
          <VerticalCartList>
            {itemList.map((item, index) => (
              <ItemWrapper key={index}>
                <Checkbox item={item} onChange={handleSelectCartItem} />
                <CartSheetItem menu={item} isCart />
                <InfoMessage message={'dd'} />
                <BorderLine height={1} margin="16px 0" />
              </ItemWrapper>
            ))}
          </VerticalCartList>
        </CartListWrapper>
        <DisposableSelectWrapper>
          <WrapperTitle>
            <SVGIcon name="fcoIcon" />
            <TextH5B padding="0 0 0 8px">
              일회용품은 한 번 더 생각해주세요!
            </TextH5B>
          </WrapperTitle>
          <CheckBoxWrapper>
            {DISPOSABLE_LIST.map((item, index) => (
              <DisposableItem key={index}>
                <div className="disposableLeft">
                  <Checkbox item={item} onChange={handleSelectDisposable} />
                  <div className="disposableText">
                    <TextB2R padding="0 4px 0 0">{item.text}</TextB2R>
                    <TextH5B>+{item.price}원</TextH5B>
                  </div>
                </div>
                <Right>
                  <CountButton />
                </Right>
              </DisposableItem>
            ))}
          </CheckBoxWrapper>
        </DisposableSelectWrapper>
        <NutritionInfoWrapper>
          <FlexBeteewn>
            <span className="H5B">
              💪 내 장바구니 체크! 현재
              <span className="brandColor"> 관리중</span>
              이신가요?
            </span>
            <SVGIcon name="triangleDown" />
          </FlexBeteewn>
          <InfoWrapper>
            <BorderLine height={1} margin="16px 0" />
            <FlexStart>
              <Calorie>
                <TextH7B padding="0 8px 0 0" color={theme.greyScale45}>
                  총 열량
                </TextH7B>
                <TextH4B padding="0 2px 0 0">12,000</TextH4B>
                <TextB3R>Kcal</TextB3R>
              </Calorie>
              <Protein>
                <TextH7B padding="0 8px 0 0" color={theme.greyScale45}>
                  총 단백질
                </TextH7B>
                <TextH4B padding="0 2px 0 0">12,00</TextH4B>
                <TextB3R>g</TextB3R>
              </Protein>
            </FlexStart>
          </InfoWrapper>
        </NutritionInfoWrapper>
        <GetMoreBtn>
          <Button backgroundColor={theme.white} color={theme.black} border>
            + 더 담으러 가기
          </Button>
        </GetMoreBtn>
      </CartInfoContainer>
      <BorderLine height={8} margin="32px 0" />
      <MenuListContainer>
        <MenuListWarpper>
          <MenuListHeader>
            <TextH3B padding="0 0 24px 0">루이스님이 찜한 상품이에요</TextH3B>
            <ScrollHorizonList>
              <ScrollHorizonListGroup>
                {itemList.map((item, index) => {
                  return <Item item={item} key={index} isCart />;
                })}
              </ScrollHorizonListGroup>
            </ScrollHorizonList>
          </MenuListHeader>
        </MenuListWarpper>
        <MenuListWarpper>
          <MenuListHeader>
            <TextH3B padding="0 0 24px 0">
              이전에 구매한 상품들은 어떠세요?
            </TextH3B>
            <ScrollHorizonList>
              <ScrollHorizonListGroup>
                {itemList.map((item, index) => {
                  return <Item item={item} key={index} isCart />;
                })}
              </ScrollHorizonListGroup>
            </ScrollHorizonList>
          </MenuListHeader>
        </MenuListWarpper>
        <TotalPriceWrapper>
          <FlexBeteewn>
            <TextB2R>상품 금액</TextB2R>
            <TextB2R>222원</TextB2R>
          </FlexBeteewn>
          <FlexBeteewn padding="8px 0 0 0">
            <TextB2R>상품할인금액</TextB2R>
            <TextB2R>22원</TextB2R>
          </FlexBeteewn>
          <FlexBeteewn padding="8px 0 0 0">
            <TextB2R>배송비</TextB2R>
            <TextB2R>22원</TextB2R>
          </FlexBeteewn>
          <BorderLine height={1} margin="16px 0" />
          <FlexBeteewn padding="8px 0 0 0">
            <TextH4B>결제예정금액</TextH4B>
            <TextH4B>12312원</TextH4B>
          </FlexBeteewn>
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
      </MenuListContainer>
      <OrderBtn>
        <Button borderRadius="0">1232원 주문하기</Button>
      </OrderBtn>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;
const DeliveryMethodAndPickupLocation = styled.div`
  ${homePadding}
  display: flex;
  justify-content: space-between;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div``;

const CartListWrapper = styled.div``;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VerticalCartList = styled.div``;
const ItemWrapper = styled.div``;

const DisposableSelectWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const DisposableItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 0px 0px 16px;
  .disposableLeft {
    width: 100%;
    display: flex;
    .disposableText {
      width: 100%;
      display: flex;
    }
  }
`;

const CheckBoxWrapper = styled.div`
  width: 100%;
`;

const WrapperTitle = styled.div`
  display: flex;
  align-items: center;
`;
const NutritionInfoWrapper = styled.div`
  padding: 16px 24px;
  background-color: #f8f8f8;
  margin-bottom: 24px;
  .H5B {
    font-size: 14px;
    letter-spacing: -0.4px;
    font-weight: bold;
    line-height: 24px;
    color: ${theme.greyScale65};
    .brandColor {
      color: ${theme.brandColor};
    }
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Calorie = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`;
const Protein = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`;

const GetMoreBtn = styled.div``;

const CartInfoContainer = styled.div`
  ${homePadding}
`;
const MenuListContainer = styled.div`
  ${homePadding}
`;
const MenuListWarpper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuListHeader = styled.div``;

const ScrollHorizonListGroup = styled.div`
  display: flex;

  > div {
    width: 120px;
    height: 100%;
    margin-right: 18px;
  }
`;
const TotalPriceWrapper = styled.div`
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
`;

const OrderBtn = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
`;

export default Cart;
