import React, { useEffect, useState, useRef } from 'react';
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
  FlexBetween,
  FlexStart,
  FlexEnd,
  FlexCol,
  FlexRow,
} from '@styles/theme';
import CartSheetItem from '@components/CartSheet/CartSheetItem';
import Checkbox from '@components/Checkbox';
import { InfoMessage } from '@components/Message';
import SVGIcon from '@utils/SVGIcon';
import Button from '@components/Button';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import Item from '@components/Item';
import Tag from '@components/Tag';
import CountButton from '@components/Button/CountButton';
import router from 'next/router';
import Calendar from '@components/Calendar';
import { RadioButton } from '@components/Button/RadioButton';
import { useRouter } from 'next/router';
import { INIT_AFTER_SETTING_DELIVERY, cartForm } from '@store/cart';

const DISPOSABLE_LIST = [
  { id: 1, value: 'fork', text: '포크/물티슈', price: 100 },
  { id: 2, value: 'stick', text: '젓가락/물티슈', price: 100 },
];

const LUNCH_OR_DINNER = [
  {
    id: 1,
    value: 'lunch',
    text: '점심',
    discription: '(오전 9:30까지 주문시 12:00 전 도착)',
  },
  {
    id: 2,
    value: 'dinner',
    text: '저녁',
    discription: '(오전 11:00까지 주문시 17:00 전 도착)',
  },
];
/*TODO: 장바구니 비었을 때 UI */

function Cart() {
  const [itemList, setItemList] = useState([]);
  const [checkedMenuList, setCheckedMenuList] = useState<any[]>([]);
  const [checkedDisposableList, setCheckedDisposalbleList] = useState<any[]>(
    []
  );
  const [isAllChecked, setIsAllchecked] = useState<boolean>(false);
  const [lunchOrDinner, setLunchOrDinner] = useState<number>(1);

  const CalendarRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isFromDeliveryPage } = useSelector(cartForm);

  const isSoldout = true;
  const hasDeliveryPlace = true;

  const disabledDates = [30, 1, 2, 3, 4];

  useEffect(() => {
    getLists();
  }, []);

  useEffect(() => {
    /* TODO: 초기값 설정 때문에 조금 버벅임 */

    if (CalendarRef && isFromDeliveryPage) {
      const offsetTop = CalendarRef.current?.offsetTop;

      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: offsetTop,
      });
    }

    return () => {
      dispatch(INIT_AFTER_SETTING_DELIVERY());
    };
  }, [CalendarRef.current?.offsetTop]);

  const getLists = async () => {
    const { data } = await axios.get(`${BASE_URL}`);
    setItemList(data);
  };

  const goToDeliveryInfo = () => {
    router.push('/cart/delivery-info');
  };

  const handleSelectCartItem = (id: any) => {
    /* TODO: 왜 안됑? */
    const findItem = checkedMenuList.find((_id: any) => _id === id);
    let tempCheckedMenuList = checkedMenuList.slice();

    if (findItem) {
      tempCheckedMenuList.filter((_id: any) => _id !== id);
    } else {
      tempCheckedMenuList.push(id);
    }

    setCheckedMenuList(tempCheckedMenuList);
  };

  const handleSelectAllCartItem = () => {
    /*TODO: 하나 해제 했을 때 다 해제 로직 */
    const checkedMenuId = itemList.map((item: any) => item.id);
    if (!isAllChecked) {
      setCheckedMenuList(checkedMenuId);
    } else {
      setCheckedMenuList([]);
    }
    setIsAllchecked(!isAllChecked);
  };

  const handleSelectDisposable = (id: any) => {
    /* TODO: 왜 안됑? */
    const findItem = checkedDisposableList.find((_id) => _id === id);
    const tempCheckedDisposableList = checkedDisposableList.slice();

    if (findItem) {
      tempCheckedDisposableList.filter((_id) => _id !== id);
    } else {
      tempCheckedDisposableList.push(id);
    }

    setCheckedDisposalbleList(tempCheckedDisposableList);
  };

  const handleLunchOrDinner = (id: number) => {
    setLunchOrDinner(id);
  };

  return (
    <Container>
      <DeliveryMethodAndPickupLocation>
        <Left>
          <TextH4B>배송방법과</TextH4B>
          <TextH4B>배송장소를 설정해주세요</TextH4B>
        </Left>
        <Right onClick={goToDeliveryInfo}>
          <TextH6B color={theme.greyScale65} textDecoration="underline">
            설정하기
          </TextH6B>
        </Right>
      </DeliveryMethodAndPickupLocation>
      <BorderLine height={8} margin="24px 0" />
      <CartInfoContainer>
        <CartListWrapper>
          <ListHeader>
            <div className="itemCheckbox">
              <Checkbox
                onChange={handleSelectAllCartItem}
                isSelected={isAllChecked ? true : false}
              />
              <TextB2R padding="0 0 0 8px">전체선택 (3/5)</TextB2R>
            </div>
            <Right>
              <TextH6B color={theme.greyScale65} textDecoration="underline">
                선택삭제
              </TextH6B>
            </Right>
          </ListHeader>
          <BorderLine height={1} margin="16px 0" />
          <VerticalCartList>
            {itemList.map((item: any, index) => (
              <ItemWrapper key={index}>
                <div className="itemCheckbox">
                  <Checkbox
                    onChange={() => handleSelectCartItem(item.id)}
                    isSelected={checkedMenuList.includes(item.id)}
                  />
                  <CartSheetItem
                    menu={item}
                    isCart
                    isSoldout={item.id === 1 && isSoldout}
                  />
                </div>
                <div className="itemInfo">
                  <InfoMessage message={'dd'} />
                </div>
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
                  <Checkbox
                    onChange={() => handleSelectDisposable(item.id)}
                    isSelected={checkedDisposableList.includes(item.id)}
                  />
                  <div className="disposableText">
                    <TextB2R padding="0 4px 0 8px">{item.text}</TextB2R>
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
          <FlexBetween>
            <span className="h5B">
              💪 내 장바구니 체크! 현재
              <span className="brandColor"> 관리중</span>
              이신가요?
            </span>
            <SVGIcon name="triangleDown" />
          </FlexBetween>
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
        <GetMoreBtn ref={CalendarRef}>
          <Button backgroundColor={theme.white} color={theme.black} border>
            + 더 담으러 가기
          </Button>
        </GetMoreBtn>
      </CartInfoContainer>
      {hasDeliveryPlace && (
        <>
          <BorderLine height={8} margin="32px 0" />
          <FlexCol padding="0 24px">
            <FlexBetween>
              <FlexRow margin="0 0 16px 0">
                <TextH3B padding="0 4px 0 0">픽업날짜</TextH3B>
                <SVGIcon name="questionMark" />
              </FlexRow>
              <TextH6B>오늘 12:00 전 도착</TextH6B>
            </FlexBetween>
            <Calendar disabledDates={disabledDates} />

            {LUNCH_OR_DINNER.map((item, index) => {
              return (
                <FlexRow key={index} padding="16px 0 0 0">
                  <RadioButton
                    onChange={() => handleLunchOrDinner(item.id)}
                    isSelected={lunchOrDinner === item.id}
                  />
                  <TextH5B padding="0 4px 0 8px">{item.text}</TextH5B>
                  <TextB2R>{item.discription}</TextB2R>
                </FlexRow>
              );
            })}
          </FlexCol>
        </>
      )}

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
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween padding="8px 0 0 0">
            <TextH4B>결제예정금액</TextH4B>
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
  width: 100%;
  .itemCheckbox {
    display: flex;
    align-items: center;
  }
`;

const VerticalCartList = styled.div``;

const ItemWrapper = styled.div`
  .itemCheckbox {
    display: flex;
    width: 100%;
    > div {
      align-self: flex-start;
      padding-right: 9px;
    }
  }
  .itemInfo {
    padding-left: 30px;
  }
`;

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
      padding-top: 2px;
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
  .h5B {
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
