import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextH7B, TextB3R, TextH3B } from '@components/Shared/Text';
import {
  homePadding,
  theme,
  flexCenter,
  ScrollHorizonList,
  FlexBetween,
  FlexStart,
  FlexEnd,
  FlexCol,
  FlexRow,
  fixedBottom,
  FlexCenter,
} from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import SVGIcon from '@utils/SVGIcon';
import axios from 'axios';
import { BASE_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { Calendar } from '@components/Calendar';
import { Button, CountButton, RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { INIT_AFTER_SETTING_DELIVERY, cartForm, SET_CART_LISTS, INIT_CART_LISTS } from '@store/cart';
import { SET_ORDER_ITEMS } from '@store/order';
import { HorizontalItem } from '@components/Item';
import { SET_ALERT } from '@store/alert';
import { destinationForm, SET_DESTINATION } from '@store/destination';
import { Obj, IOrderDeliveries, IGetOtherDeliveries } from '@model/index';
import { isNil, isEqual, includes } from 'lodash-es';
import { flow, map, filter } from 'lodash/fp';
import { TogetherDeliverySheet } from '@components/BottomSheet/TogetherDeliverySheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import getCustomDate from '@utils/getCustomDate';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { availabilityDestination } from '@api/destination';
import { getOrderLists } from '@api/order';
import { getMenusApi } from '@api/menu';
import { userForm } from '@store/user';
import { onUnauthorized } from '@api/Api';
import { CartItem } from '@components/Pages/Cart';

const mapper: Obj = {
  morning: '새벽배송',
  parcel: '택배배송',
  quick: '퀵배송',
  noDelivery: '배송불가',
  spot: '스팟배송',
};
/*TODO: 장바구니 비었을 때 UI */
/*TODO: 찜하기&이전구매 UI, 찜하기 사이즈에 따라 가격 레인지, 첫 구매시 100원 -> 이전  */

export interface ILunchOrDinner {
  id: number;
  value: string;
  text: string;
  discription: string;
  isDisabled: boolean;
  isSelected: boolean;
  time: string;
}

//temp

const disabledDates = ['2022-02-21', '2022-02-22'];

const CartPage = () => {
  const [cartItemList, setCartItemList] = useState<any[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);
  const [checkedMenuIdList, setCheckedMenuIdList] = useState<number[]>([]);
  const [selectedMenuList, setSelectedMenuList] = useState<any[]>([]);
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
  const [isShow, setIsShow] = useState(false);
  const [disposableList, setDisposableList] = useState([
    { id: 1, value: 'fork', quantity: 1, text: '포크/물티슈', price: 100, isSelected: true },
    { id: 2, value: 'stick', quantity: 1, text: '젓가락/물티슈', price: 100, isSelected: true },
  ]);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');
  const [otherDeliveries, setOtherDeliveries] = useState<IGetOtherDeliveries[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isFromDeliveryPage, cartLists } = useSelector(cartForm);
  const { userDestinationStatus, userDestination } = useSelector(destinationForm);
  const { isLoginSuccess } = useSelector(userForm);

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
      cacheTime: 0,
      onSuccess: (data) => {
        /* TODO: 서버랑 store랑 싱크 init후 set으로? */
        setCartItemList(data);
        dispatch(INIT_CART_LISTS());
        dispatch(SET_CART_LISTS(data));
      },
    }
  );

  /* TODO: 찜한 상품, 이전 구매 상품 리스트 받아오면 변경해야함 */

  const { error: menuError } = useQuery(
    'getMenus',
    async () => {
      const params = { categories: '', menuSort: 'LAUNCHED_DESC', searchKeyword: '', type: '' };
      const { data } = await getMenusApi(params);
      const temp = data.data.slice(0, 10);
      setItemList(temp);
    },
    { refetchOnMount: true, refetchOnWindowFocus: false }
  );

  const {} = useQuery(
    'getOrderLists',
    async () => {
      // const params = {
      //   days: 90,
      //   page: 1,
      //   size: 10,
      //   type: 'GENERAL',
      // };

      // const { data } = await getOrderListsApi(params);

      /* temp */
      const { data } = await axios.get(`${BASE_URL}/orderList`);
      return data.data;
    },
    {
      onSuccess: (data) => {
        const result = checkHasOtherDeliveries(data);
        setOtherDeliveries(result);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const hasDeliveryTypeAndDestination = !isNil(userDestinationStatus) && !isNil(userDestination);

  // const { data: result, refetch } = useQuery(
  //   ['getAvailabilityDestination', hasDeliveryTypeAndDestination],
  //   async () => {
  //     const params = {
  //       roadAddress: userDestination?.location.address!,
  //       jibunAddress: null,
  //       zipCode: userDestination?.location.zipCode!,
  //       delivery: userDestinationStatus.toUpperCase() || null,
  //     };
  //     const { data } = await availabilityDestination(params);

  //     if (data.code === 200) {
  //       const { morning, parcel, quick, spot } = data.data;
  //       console.log(data.data, 'data.data');
  //     }
  //   },
  //   {
  //     onSuccess: async () => {},
  //     onError: (error: AxiosError) => {
  //       const { message } = error.response?.data;
  //       alert(message);
  //       return;
  //     },
  //     refetchOnMount: true,
  //     refetchOnWindowFocus: false,
  //     cacheTime: 0,
  //     enabled: hasDeliveryTypeAndDestination,
  //   }
  // );

  const { mutate: mutateItemQuantity } = useMutation(
    async (params: { menuDetailId: number; quantity: number }) => {
      const { menuDetailId, quantity } = params;

      /* TODO : 구매제한체크 api */
      const checkHasLimitQuantity = selectedMenuList.find((item) => item.id === menuDetailId)?.limitQuantity;
      if (checkHasLimitQuantity && checkHasLimitQuantity < quantity) {
        return;
      }

      const { data }: { data: any } = await axios.put(`${BASE_URL}/cartList`, { params });
    },
    {
      onSuccess: async () => {
        // Q. invalidateQueries랑 refetchQueries 차이
        // await queryClient.invalidateQueries('getCartList');
        await queryClient.refetchQueries('getCartList');
      },
    }
  );

  const { mutate: mutateDeleteItem } = useMutation(
    async (reqBody: number[]) => {
      const { data } = await axios.delete(`${BASE_URL}/cartList`, { data: reqBody });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCartList');
      },
    }
  );

  // const { mutateAsync: mutateAddOrder } = useMutation(
  //   async () => {
  //     const { data } = await axios.delete(`${BASE_URL}/orderList`, { data });
  //   },
  //   {
  //     onSuccess: async () => {
  //       await queryClient.refetchQueries('getOrderList');
  //     },
  //   }
  // );

  const checkHasOtherDeliveries = (list: IGetOtherDeliveries[]) => {
    const checkAvailableOtherDelivery = ({ deliveryStatus, delivery, location }: IGetOtherDeliveries) => {
      const availableDeliveryStatus: string[] = ['PREPARING', 'PROGRESS'];
      const sameDeliveryType = delivery === userDestinationStatus?.toUpperCase();
      const sameDeliveryAddress = isEqual(location, userDestination?.location);
      const avaliableStatus = availableDeliveryStatus.includes(deliveryStatus);

      return avaliableStatus && sameDeliveryAddress && sameDeliveryType;
    };

    return flow(filter((data: IGetOtherDeliveries) => checkAvailableOtherDelivery(data)))(list);
  };

  const handleSelectCartItem = (id: any) => {
    const findItem = checkedMenuIdList.find((_id: number) => _id === id);
    let tempCheckedMenuList = checkedMenuIdList.slice();

    if (findItem) {
      tempCheckedMenuList = tempCheckedMenuList.filter((_id) => _id !== id);
      if (isAllChecked) {
        setIsAllchecked(!isAllChecked);
      }
    } else {
      const checkIsSoldout = cartItemList.find((item) => {
        if (item.soldout) {
          return item.id === id;
        }
      });

      if (checkIsSoldout) {
        return;
      }

      tempCheckedMenuList.push(id);
    }

    setCheckedMenuIdList(tempCheckedMenuList);
  };

  const handleSelectAllCartItem = useCallback(() => {
    const checkedMenuId = cartItemList?.filter((item) => !item.soldout).map((item) => item.id);

    if (!isAllChecked) {
      setCheckedMenuIdList(checkedMenuId);
    } else {
      setCheckedMenuIdList([]);
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

  const removeSelectedItemHandler = async () => {
    dispatch(
      SET_ALERT({
        alertMessage: '선택을 상품을 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem(checkedMenuIdList),
      })
    );
  };

  const removeCartActualItemHandler = ({ id, main }: { id: number; main: boolean }) => {
    if (main) {
      dispatch(
        SET_ALERT({
          alertMessage: '선택옵션 상품도 함께 삭제돼요. 삭제하시겠어요.',
          closeBtnText: '취소',
          submitBtnText: '확인',
          onSubmit: () => mutateDeleteItem([id]),
        })
      );
    } else {
      mutateDeleteItem([id]);
    }
  };

  const removeCartDisplayItemHandler = (id: number) => {
    dispatch(
      SET_ALERT({
        alertMessage: '선택을 상품을 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem([id]),
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
    const itemsPrice = getItemsPrice();
    const disposablePrice =
      disposableList.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
      }, 0) || 0;
    return itemsPrice + disposablePrice;
  }, [selectedMenuList]);

  const getItemsPrice = useCallback((): number => {
    return (
      selectedMenuList.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
      }, 0) || 0
    );
  }, [selectedMenuList]);

  const goToDeliveryInfo = () => {
    router.push('/cart/delivery-info');
  };

  const goToSearchPage = () => {
    router.push('/search');
  };

  const goToPayment = () => {
    if (!hasDeliveryTypeAndDestination) return;

    const deliveryTime = lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected)?.value;
    userDestination && dispatch(SET_DESTINATION({ ...userDestination, deliveryTime }));
    dispatch(SET_ORDER_ITEMS(selectedMenuList));
    router.push('/payment');
  };

  const goToTogetherDelivery = (id: number): void => {
    dispatch(
      SET_BOTTOM_SHEET({
        content: (
          <TogetherDeliverySheet
            title="함께배송 안내"
            otherDeliveryInfo={[otherDeliveries.find((item: IGetOtherDeliveries) => item.id === id)]}
          />
        ),
      })
    );
  };

  const buttonRenderer = useCallback(() => {
    return (
      <Button borderRadius="0" height="100%" disabled={!hasDeliveryTypeAndDestination}>
        {getTotalPrice()}원 주문하기
      </Button>
    );
  }, [selectedMenuList]);

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
    // 선택 메뉴 다 선택 시 all checked, 전체 삭제 하면 전체 선택 풀림
    if (cartItemList.length > 0 && checkedMenuIdList.length === cartItemList.length) {
      setIsAllchecked(true);
    } else if (cartItemList.length === 0) {
      setIsAllchecked(false);
    }
  }, [checkedMenuIdList, cartItemList]);

  useEffect(() => {
    // 전체 선택 시 선택 메뉴 다 선택됨
    let tempCheckMenuList = [];

    if (isAllChecked && !isLoading) {
      tempCheckMenuList = cartItemList?.filter((item) => !item.soldout).map((item) => item.id);
      setCheckedMenuIdList(tempCheckMenuList);
    }
  }, [isLoading, cartItemList]);

  useEffect(() => {
    const filteredMenus = cartItemList.filter((item) => checkedMenuIdList.includes(item.id));
    setSelectedMenuList(filteredMenus);
  }, [checkedMenuIdList, cartItemList]);

  useEffect(() => {
    // 초기 렌더 1회 장바구니 아이템 전체 선택
    setIsAllchecked(true);

    // 합배송 관련
    if (otherDeliveries?.length > 0) {
      const isSpotOrQuick = ['spot', 'quick'].includes(userDestinationStatus);
      for (const otherDelivery of otherDeliveries) {
        const { deliveryDate, deliveryDetail } = otherDelivery;

        const sameDeliveryTime = isSpotOrQuick
          ? deliveryDetail === lunchOrDinner.find((item) => item.isSelected)?.value!
          : true;
        const sameDeliveryDate = deliveryDate === selectedDeliveryDay;

        if (sameDeliveryDate && sameDeliveryTime) {
          goToTogetherDelivery(otherDelivery?.id);
        }
      }
    }
  }, [selectedDeliveryDay, lunchOrDinner]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  const isSpot = userDestinationStatus == 'spot';
  const isSpotAndQuick = ['spot', 'quick'].includes(userDestinationStatus);

  if (cartItemList.length === 0) {
    return (
      <EmptyContainer>
        <FlexCol width="100%">
          <TextB2R padding="0 0 32px 0" center>
            장바구니가 비었어요 😭
          </TextB2R>
          <BtnWrapper onClick={goToSearchPage}>
            <Button backgroundColor={theme.white} color={theme.black} border>
              상품 담으러 가기
            </Button>
          </BtnWrapper>
        </FlexCol>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      {isLoginSuccess ? (
        <DeliveryMethodAndPickupLocation onClick={goToDeliveryInfo}>
          <Left>
            <TextH4B>{userDestinationStatus ? mapper[userDestinationStatus] : '배송방법과'}</TextH4B>
            <TextH4B>{!isNil(userDestination) ? userDestination?.location.dong : '배송장소를 설정해주세요'}</TextH4B>
          </Left>
          <Right>
            <SVGIcon name="arrowRight" />
          </Right>
        </DeliveryMethodAndPickupLocation>
      ) : (
        <DeliveryMethodAndPickupLocation onClick={onUnauthorized}>
          <Left>
            <TextH4B>로그인 후 배송방법과</TextH4B>
            <TextH4B>배송지를 설정해주세요</TextH4B>
          </Left>
          <Right>
            <SVGIcon name="arrowRight" />
          </Right>
        </DeliveryMethodAndPickupLocation>
      )}
      <BorderLine height={8} margin="24px 0" />
      <CartInfoContainer>
        <CartListWrapper>
          <ListHeader>
            <div className="itemCheckbox">
              <Checkbox onChange={handleSelectAllCartItem} isSelected={isAllChecked ? true : false} />
              <TextB2R padding="0 0 0 8px">전체선택 ({`${checkedMenuIdList.length}/${cartItemList.length}`})</TextB2R>
            </div>
            <Right>
              <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={removeSelectedItemHandler}>
                선택삭제
              </TextH6B>
            </Right>
          </ListHeader>
          <BorderLine height={1} margin="16px 0" />
          <VerticalCartList>
            {cartItemList?.map((item: any, index) => (
              <CartItem
                item={item}
                handleSelectCartItem={handleSelectCartItem}
                checkedMenuIdList={checkedMenuIdList}
                clickPlusButton={clickPlusButton}
                clickMinusButton={clickMinusButton}
                clickRestockNoti={clickRestockNoti}
                removeCartDisplayItemHandler={removeCartDisplayItemHandler}
                removeCartActualItemHandler={removeCartActualItemHandler}
                key={index}
              />
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
              <SVGIcon name={isShow ? 'triangleUp' : 'triangleDown'} />
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
              otherDeliveries={otherDeliveries}
              selectedDeliveryDay={selectedDeliveryDay}
              setSelectedDeliveryDay={setSelectedDeliveryDay}
              goToTogetherDelivery={goToTogetherDelivery}
              lunchOrDinner={lunchOrDinner}
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
                {itemList?.map((item, index) => {
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
                {itemList?.map((item, index) => {
                  return <HorizontalItem item={item} key={index} />;
                })}
              </ScrollHorizonListGroup>
            </ScrollHorizonList>
          </MenuListHeader>
        </MenuListWarpper>
        <TotalPriceWrapper>
          <FlexBetween>
            <TextH5B>총 상품금액</TextH5B>
            <TextB2R>{getItemsPrice()}</TextB2R>
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
            <TextH4B>{getTotalPrice()}</TextH4B>
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

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100%;
  ${flexCenter}
`;
const DeliveryMethodAndPickupLocation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  cursor: pointer;
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
const BtnWrapper = styled.div`
  margin: 0 24px;
`;

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
