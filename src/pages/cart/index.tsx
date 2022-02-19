import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import {
  homePadding,
  theme,
  ScrollHorizonList,
  FlexBetween,
  FlexStart,
  FlexEnd,
  FlexCol,
  FlexRow,
  fixedBottom,
} from '@styles/theme';
import { CartSheetItem } from '@components/BottomSheet/CartSheet';
import Checkbox from '@components/Shared/Checkbox';
import InfoMessage from '@components/Shared/Message';
import SVGIcon from '@utils/SVGIcon';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { Calendar } from '@components/Calendar';
import { Button, CountButton, RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { INIT_AFTER_SETTING_DELIVERY, cartForm } from '@store/cart';
import { HorizontalItem } from '@components/Item';
import { SET_ALERT } from '@store/alert';
import { destinationForm, SET_DESTINATION } from '@store/destination';
import { Obj } from '@model/index';
import isNill from 'lodash-es/isNil';
import { TogetherDeliverySheet } from '@components/BottomSheet/TogetherDeliverySheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import getCustomDate from '@utils/getCustomDate';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { identity } from 'lodash-es';

const mapper: Obj = {
  morning: '새벽배송',
  parcel: '택배배송',
  quick: '퀵배송',
  noDelivery: '배송불가',
};
/*TODO: 장바구니 비었을 때 UI */
/*TODO: 찜하기&이전구매 UI, 찜하기 사이즈에 따라 가격 레인지, 첫 구매시 100원 -> 이전  */

interface ILunchOrDinner {
  id: number;
  value: string;
  text: string;
  discription: string;
  isDisabled: boolean;
  isSelected: boolean;
  time: string;
}

//temp
export interface IOtherDeliveryInfo {
  id: number;
  location: {
    address: string;
    addressDetail: string;
  };
  delivery: string;
  deliveryTime: string;
  deliveryDate: string;
  totalPrice: number;
  deliveryFee: number;
}

const otherDeliveryInfo: IOtherDeliveryInfo[] = [
  {
    id: 1,
    location: {
      address: '주소',
      addressDetail: '상세주소',
    },
    delivery: 'QUICK',
    deliveryTime: 'LUNCH',
    deliveryDate: '2022-02-23',
    totalPrice: 30000,
    deliveryFee: 3000,
  },
  {
    id: 2,
    location: {
      address: '주소',
      addressDetail: '상세주소',
    },
    delivery: 'QUICK',
    deliveryTime: 'LUNCH',
    deliveryDate: '2022-02-19',
    totalPrice: 30000,
    deliveryFee: 3000,
  },
];

//temp

const disabledDates = ['2022-02-21', '2022-02-22'];

/* TODO: 체크 상태 관리
 *
 * 현재 isAllChecked 초기값 true 설정 후 useEffect에서 isAllChecked에 따라 cartItemList의 id 값을 checkedMenuList에 넣어줌
 * 1. cartItemList 갱신 후 allChecked로 변경하는 로직의 경우 1-1 문제 발생
 * 1-1. quantity가 변경될 때 마다 서버 콜 후 refetch를 하면서 cartItemList 갱신됨 -> check 안 한 상태에서 quantity 변경 시 refetch되면서 다시 checked가 됨
 * 2. 현재의 방법으로는 동작이 되지만 플로우가 복잡한 느낌
 *
 ******/

const CartPage = () => {
  const [cartItemList, setCartItemList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);
  const [checkedMenuList, setCheckedMenuList] = useState<number[]>([]);
  const [isAllChecked, setIsAllchecked] = useState<boolean>(true);
  const [lunchOrDinner, setLunchOrDinner] = useState<ILunchOrDinner[]>([
    {
      id: 1,
      value: 'LUNCH',
      text: '점심',
      discription: '(오전 9:30까지 주문시 12:00 전 도착)',
      isDisabled: false,
      isSelected: true,
      time: '12시',
    },
    {
      id: 2,
      value: 'DINNER',
      text: '저녁',
      discription: '(오전 11:00까지 주문시 17:00 전 도착)',
      isDisabled: false,
      isSelected: false,
      time: '17시',
    },
  ]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [disposableList, setDisposableList] = useState([
    { id: 1, value: 'fork', quantity: 1, text: '포크/물티슈', price: 100, isSelected: true },
    { id: 2, value: 'stick', quantity: 1, text: '젓가락/물티슈', price: 100, isSelected: true },
  ]);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');

  const calendarRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isFromDeliveryPage } = useSelector(cartForm);
  const { userDestinationStatus, userDestination } = useSelector(destinationForm);

  const queryClient = useQueryClient();

  const { isLoading } = useQuery(
    'getCartList',
    async () => {
      const { data }: { data: any } = await axios.get(`${BASE_URL}/cartList`);
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCartItemList(data);
      },
    }
  );

  const {} = useQuery(
    'getItemList',
    async () => {
      const { data }: { data: any } = await axios.get(`${BASE_URL}/itemList`);
      setItemList(data.data);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const { mutateAsync: mutateItemQuantity } = useMutation(
    async (params: { menuDetailId: number; quantity: number }) => {
      const { data }: { data: any } = await axios.put(`${BASE_URL}/cartList`, { params });
    },
    {
      onSuccess: async () => {
        // Q. invalidateQueries랑 refetchQueries 차이
        await queryClient.invalidateQueries('getCartList');
        // await queryClient.refetchQueries('getCartList');
      },
    }
  );

  const { mutateAsync: mutateDeleteItem } = useMutation(
    async () => {
      const { data } = await axios.delete(`${BASE_URL}/cartList`, { data: checkedMenuList });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCartList');
      },
    }
  );

  const handleSelectCartItem = (id: any) => {
    const findItem = checkedMenuList.find((_id: number) => _id === id);
    let tempCheckedMenuList = checkedMenuList.slice();

    if (findItem) {
      tempCheckedMenuList = tempCheckedMenuList.filter((_id) => _id !== id);
      if (isAllChecked) {
        setIsAllchecked(!isAllChecked);
      }
    } else {
      tempCheckedMenuList.push(id);
    }

    setCheckedMenuList(tempCheckedMenuList);
  };

  const handleSelectAllCartItem = useCallback(() => {
    const checkedMenuId = cartItemList.map((item: any) => item.id);

    if (!isAllChecked) {
      setCheckedMenuList(checkedMenuId);
    } else {
      setCheckedMenuList([]);
    }
    setIsAllchecked(!isAllChecked);
  }, [isAllChecked]);

  const handleSelectDisposable = (id: any) => {
    const newDisposableList = disposableList.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: !item.isSelected };
      } else {
        return item;
      }
    });
    setDisposableList(newDisposableList);
  };

  const handleLunchOrDinner = (selectedItem: ILunchOrDinner) => {
    if (selectedItem.isDisabled) {
      return;
    }

    const newLunchDinner = lunchOrDinner.map((item) => {
      return item.id === selectedItem.id ? { ...item, isSelected: true } : { ...item, isSelected: false };
    });

    setLunchOrDinner(newLunchDinner);
  };

  const removeItemHandler = async () => {
    dispatch(
      SET_ALERT({
        alertMessage: '선택을 상품을 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem(),
      })
    );
  };

  const clickDisposableItemCount = (id: number, quantity: number) => {
    const findItem = disposableList.map((item) => {
      if (item.id === id) {
        item.quantity = quantity;
      }
      return item;
    });
    setDisposableList(findItem);
  };

  const deliveryTimeInfoRenderer = () => {
    const { dates }: { dates: number } = getCustomDate(new Date(selectedDeliveryDay));
    const today: number = new Date().getDate();
    const selectedTime = lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected);
    const selectToday = dates === today;

    try {
      switch (userDestinationStatus) {
        case 'parcel': {
          return <TextH6B>{`${dates}일 도착`}</TextH6B>;
        }
        case 'morning': {
          return <TextH6B>{`${dates}일 새벽 7시 전 도착`}</TextH6B>;
        }
        case 'quick':
        case 'spot': {
          if (selectToday) {
            return <TextH6B>{`오늘 ${selectedTime?.time} 전 도착`}</TextH6B>;
          } else {
            return <TextH6B>{`${dates}일 ${selectedTime?.time} 전 도착`}</TextH6B>;
          }
        }
        default:
          return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clickPlusButton = (id: number, quantity: number) => {
    const parmas = {
      menuDetailId: id,
      quantity,
    };
    mutateItemQuantity(parmas);
  };

  const clickMinusButton = (id: number, quantity: number) => {
    const parmas = {
      menuDetailId: id,
      quantity,
    };
    mutateItemQuantity(parmas);
  };

  const clickRestockNoti = () => {};

  const getTotalPrice = useCallback((): number => {
    return (
      cartItemList.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
      }, 0) || 0
    );
  }, [cartItemList]);

  const goToDeliveryInfo = () => {
    router.push('/cart/delivery-info');
  };

  const goToSearchPage = () => {
    router.push('/search');
  };

  const goToPayment = () => {
    const deliveryTime = lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected)?.value;
    userDestination && dispatch(SET_DESTINATION({ ...userDestination, deliveryTime }));
    router.push('/payment');
  };

  const goToTogetherDelivery = (id: number): void => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: (
          <TogetherDeliverySheet
            title="함께배송 안내"
            otherDeliveryInfo={[otherDeliveryInfo.find((item) => item.id === id)]}
          />
        ),
      })
    );
  };

  const buttonRenderer = useCallback(() => {
    return (
      <Button borderRadius="0" height="100%">
        {getTotalPrice()}원 주문하기
      </Button>
    );
  }, [cartItemList]);

  useEffect(() => {
    const { currentTime, currentDate } = getCustomDate(new Date());
    const isFinishLunch = currentTime >= 9.29;
    const isDisabledLunch = isFinishLunch && currentDate === selectedDeliveryDay;

    let newLunchDinner = [];

    if (isDisabledLunch) {
      newLunchDinner = lunchOrDinner.map((item) => {
        return item.value === 'LUNCH'
          ? { ...item, isDisabled: true, isSelected: false }
          : { ...item, isSelected: true };
      });
    } else {
      newLunchDinner = lunchOrDinner.map((item) => {
        return item.value === 'LUNCH'
          ? { ...item, isDisabled: false, isSelected: true }
          : { ...item, isSelected: false };
      });
    }
    setLunchOrDinner(newLunchDinner);
  }, [selectedDeliveryDay]);

  useEffect(() => {
    /* TODO: 초기값 설정 때문에 조금 버벅임 */
    if (calendarRef && isFromDeliveryPage) {
      const offsetTop = calendarRef.current?.offsetTop;

      window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: offsetTop,
      });
    }

    return () => {
      dispatch(INIT_AFTER_SETTING_DELIVERY());
    };
  }, [calendarRef.current?.offsetTop]);

  useEffect(() => {
    if (checkedMenuList.length === cartItemList.length) {
      setIsAllchecked(true);
    }
  }, [checkedMenuList]);

  useEffect(() => {
    if (isAllChecked) {
      setCheckedMenuList(cartItemList.map((item) => item.id));
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  const isSpot = userDestinationStatus == 'spot';
  const isSpotAndQuick = ['spot', 'quick'].includes(userDestinationStatus);

  return (
    <Container>
      <DeliveryMethodAndPickupLocation>
        <Left>
          <TextH4B>{userDestinationStatus ? mapper[userDestinationStatus] : '배송방법과'}</TextH4B>
          <TextH4B>{!isNill(userDestination) ? userDestination?.location.dong : '배송장소를 설정해주세요'}</TextH4B>
        </Left>
        <Right onClick={goToDeliveryInfo}>
          <SVGIcon name="arrowRight" />
        </Right>
      </DeliveryMethodAndPickupLocation>
      <BorderLine height={8} margin="24px 0" />
      <CartInfoContainer>
        <CartListWrapper>
          <ListHeader>
            <div className="itemCheckbox">
              <Checkbox onChange={handleSelectAllCartItem} isSelected={isAllChecked ? true : false} />
              <TextB2R padding="0 0 0 8px">전체선택 ({`${checkedMenuList.length}/${cartItemList.length}`})</TextB2R>
            </div>
            <Right>
              <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={removeItemHandler}>
                선택삭제
              </TextH6B>
            </Right>
          </ListHeader>
          <BorderLine height={1} margin="16px 0" />
          <VerticalCartList>
            {cartItemList?.map((item: any, index) => (
              <ItemWrapper key={index}>
                <div className="itemCheckbox">
                  <Checkbox
                    onChange={() => handleSelectCartItem(item.id)}
                    isSelected={checkedMenuList.includes(item.id)}
                  />
                  <CartSheetItem
                    isCart
                    isSoldout={item.soldout}
                    menu={item}
                    clickPlusButton={clickPlusButton}
                    clickMinusButton={clickMinusButton}
                    clickRestockNoti={clickRestockNoti}
                  />
                </div>
                <div className="itemInfo">
                  <InfoMessage status="soldSoon" count={2} />
                </div>
                <BorderLine height={1} margin="16px 0" />
              </ItemWrapper>
            ))}
          </VerticalCartList>
        </CartListWrapper>
        <DisposableSelectWrapper>
          <WrapperTitle>
            <SVGIcon name="fcoIcon" />
            <TextH5B padding="0 0 0 8px">일회용품은 한 번 더 생각해주세요!</TextH5B>
          </WrapperTitle>
          <CheckBoxWrapper>
            {disposableList?.map((item, index) => (
              <DisposableItem key={index}>
                <div className="disposableLeft">
                  <Checkbox onChange={() => handleSelectDisposable(item.id)} isSelected={item.isSelected} />
                  <div className="disposableText">
                    <TextB2R padding="0 4px 0 8px">{item.text}</TextB2R>
                    <TextH5B>+{item.price}원</TextH5B>
                  </div>
                </div>
                <Right>
                  <CountButton
                    id={item.id}
                    quantity={item.quantity}
                    clickPlusButton={clickDisposableItemCount}
                    clickMinusButton={clickDisposableItemCount}
                  />
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
            <div onClick={() => setIsShow(!isShow)}>
              <SVGIcon name={isShow ? 'triangleDown' : 'triangleUp'} />
            </div>
          </FlexBetween>
          {isShow && (
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
          )}
        </NutritionInfoWrapper>
        <GetMoreBtn ref={calendarRef} onClick={goToSearchPage}>
          <Button backgroundColor={theme.white} color={theme.black} border>
            + 더 담으러 가기
          </Button>
        </GetMoreBtn>
      </CartInfoContainer>
      {userDestination && (
        <>
          <BorderLine height={8} margin="32px 0" />
          <FlexCol padding="0 24px">
            <FlexBetween>
              <FlexRow margin="0 0 16px 0">
                <TextH3B padding="2px 4px 0 0">{isSpot ? '픽업날짜' : '배송일'}</TextH3B>
                <SVGIcon name="questionMark" />
              </FlexRow>
              {deliveryTimeInfoRenderer()}
            </FlexBetween>
            <Calendar
              disabledDates={disabledDates}
              otherDeliveryInfo={otherDeliveryInfo}
              selectedDeliveryDay={selectedDeliveryDay}
              setSelectedDeliveryDay={setSelectedDeliveryDay}
              goToTogetherDelivery={goToTogetherDelivery}
            />
            {isSpotAndQuick &&
              lunchOrDinner.map((item, index) => {
                return (
                  <FlexRow key={index} padding="16px 0 0 0">
                    <RadioButton onChange={() => handleLunchOrDinner(item)} isSelected={item.isSelected} />
                    {item.isDisabled ? (
                      <>
                        <TextH5B padding="0 4px 0 8px" color={theme.greyScale25}>
                          {item.text}
                        </TextH5B>
                        <TextB2R color={theme.greyScale25}>{item.discription}</TextB2R>
                      </>
                    ) : (
                      <>
                        <TextH5B padding="0 4px 0 8px">{item.text}</TextH5B>
                        <TextB2R>{item.discription}</TextB2R>
                      </>
                    )}
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
                  return <HorizontalItem item={item} key={index} />;
                })}
              </ScrollHorizonListGroup>
            </ScrollHorizonList>
          </MenuListHeader>
        </MenuListWarpper>
        <MenuListWarpper>
          <MenuListHeader>
            <TextH3B padding="12px 0 24px 0">이전에 구매한 상품들은 어떠세요?</TextH3B>
            <ScrollHorizonList>
              <ScrollHorizonListGroup>
                {itemList.map((item, index) => {
                  return <HorizontalItem item={item} key={index} />;
                })}
              </ScrollHorizonListGroup>
            </ScrollHorizonList>
          </MenuListHeader>
        </MenuListWarpper>
        <TotalPriceWrapper>
          <FlexBetween>
            <TextH5B>총 상품금액</TextH5B>
            <TextB2R>30,000원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween>
            <TextH5B>총 할인 금액</TextH5B>
            <TextB2R>-222원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>상품 할인</TextB2R>
            <TextB2R>22원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>스팟 이벤트 할인</TextB2R>
            <TextB2R>22원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween>
            <TextH5B>배송비</TextH5B>
            <TextB2R>22원</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextB2R padding="8px 0 0 0">배송비 할인</TextB2R>
            <TextB2R>22원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween padding="8px 0 0 0">
            <TextH4B>결제예정금액</TextH4B>
            <TextH4B>{totalPrice}</TextH4B>
          </FlexBetween>
          <FlexEnd padding="11px 0 0 0">
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              프코 회원
            </Tag>
            <TextB3R padding="0 0 0 3px">구매 시</TextB3R>
            <TextH6B>n 포인트 (n%) 적립 예정</TextH6B>
          </FlexEnd>
        </TotalPriceWrapper>
      </MenuListContainer>
      <OrderBtn onClick={goToPayment}>{buttonRenderer()}</OrderBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;
const DeliveryMethodAndPickupLocation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  align-self: center;
`;

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
  margin-top: 12px;
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
`;

const OrderBtn = styled.div`
  ${fixedBottom}
`;

export default CartPage;
