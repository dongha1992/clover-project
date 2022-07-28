import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { TextH5B } from '@components/Shared/Text';
import { Select, MenuOption } from '@components/Shared/Dropdown';
import { theme, bottomSheetButton } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import { useSelector, useDispatch } from 'react-redux';
import { cartForm, SET_CART_LISTS } from '@store/cart';
import { orderForm, SET_TIMER_STATUS } from '@store/order';
import CartSheetItem from './CartSheetItem';
import { Button } from '@components/Shared/Button';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { useToast } from '@hooks/useToast';
import { Rolling } from '@components/Rolling';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import { calculateArrival, getCustomDate, checkTimerLimitHelper } from '@utils/destination';
import { filter, map, pipe, toArray } from '@fxts/core';
import dayjs from 'dayjs';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Obj, IMenus, IMenuDetails, IGetCart, IMenuDetailsInCart } from '@model/index';
import { SET_NON_MEMBER_CART_LISTS, INIT_NON_MEMBER_CART_LISTS, DELETE_NON_MEMBER_CART_LISTS } from '@store/cart';
import { postCartsApi } from '@api/cart';
import differenceWith from 'lodash-es/differenceWith';

import 'dayjs/locale/ko';
import { menuSelector } from '@store/menu';
import { SET_ALERT } from '@store/alert';
import { userForm } from '@store/user';

dayjs.locale('ko');

const disabledDates: any = [];

interface IRolling {
  id: number;
  type: string;
  description: string;
}

interface ISelectedMenu {
  discountPrice: number;
  menuDetailId: number;
  main: boolean;
  menuId?: number;
  name: string;
  price: number;
  quantity?: number;
  personalMaximum?: number;
  calorie?: number;
  isSold?: boolean;
  protein?: number;
}

const CartSheet = ({ menuItem }: any) => {
  const [rollingData, setRollingData] = useState([
    {
      id: 1,
      type: '스팟점심',
      description: '9시30분까지 주문 시 12시 전 도착',
    },
    { id: 2, type: '스팟저녁', description: '11시까지 주문 시 17시 전 도착' },
    {
      id: 3,
      type: '새벽배송',
      description: '17시까지 주문 시 다음날 새벽 7시 전 도착',
    },
    {
      id: 4,
      type: '택배배송',
      description: '17시까지 주문 시 당일 발송',
    },
  ]);
  let [selectedMenus, setSelectedMenus] = useState<ISelectedMenu[]>([]);

  const { showToast, hideToast } = useToast();

  const dispatch = useDispatch();

  const { cartLists, nonMemberCartLists } = useSelector(cartForm);
  const { isTimerTooltip } = useSelector(orderForm);
  // const { menuItem } = useSelector(menuSelector);
  const { me } = useSelector(userForm);

  const queryClient = useQueryClient();

  /* TODO: axios 여러번 */

  const { mutateAsync: mutateAddCartItem } = useMutation(
    async () => {
      const reqBody = selectedMenus.map((item) => {
        return {
          menuId: menuItem.id,
          menuDetailId: item.menuDetailId,
          quantity: item.quantity,
          main: item.main,
        };
      });

      /* TODO: 장바구니에 이미 있는지? */

      // const result = checkAlreadyInCart();

      const { data } = await postCartsApi(reqBody);
    },
    {
      onError: (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '장바구니 담기에 실패했어요' }));
      },
      onSuccess: async () => {
        showToast({ message: '상품을 장바구니에 담았어요! 😍' });
        dispatch(INIT_BOTTOM_SHEET());
        await queryClient.refetchQueries('getCartList');
        await queryClient.refetchQueries('getCartCount');
      },
    }
  );

  const deliveryType = checkTimerLimitHelper();

  const canSpotLunchAndDinnerToday = deliveryType === '스팟점심';
  const canSpotLunchAndDinnerTomorrow = deliveryType === '스팟점심N일';
  const canMorningAndParcelTomorrow = deliveryType === '새벽택배';
  const canMorningAndParcelNday = deliveryType === '새벽택배N일';
  const canSpotDinnerToday = deliveryType === '스팟저녁';

  const checkArrivaldate = (): string => {
    const { days } = getCustomDate(new Date());

    let isFriday = days === '금';
    let isSaturday = days === '토';
    let isSunday = days === '일';
    let isWeekdays = !['금', '토', '일'].includes(days);

    isFriday = true;

    switch (true) {
      case isFriday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(4, 'day').format('YYYY-MM-DD');
        }
      }

      case isSaturday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(3, 'day').format('YYYY-MM-DD');
        }
      }

      case isSunday: {
        if (canMorningAndParcelNday) {
          return dayjs().add(2, 'day').format('YYYY-MM-DD');
        } else if (canSpotLunchAndDinnerTomorrow) {
          return dayjs().add(1, 'day').format('YYYY-MM-DD');
        }
      }

      case isWeekdays: {
        if (canSpotLunchAndDinnerTomorrow) {
          return dayjs().add(1, 'day').format('YYYY-MM-DD');
        }
      }

      default: {
        return dayjs().add(1, 'day').format('YYYY-MM-DD');
      }
    }
  };

  const checkIsValidRollingMsg = () => {
    let arrivalDate = '';

    // N일에 걸리는 경우, N일을 따로 구해줘야 함
    // 관련 피그마 : https://www.figma.com/file/JoJXAkWwkDIiQutsxL170J/FC_App2.0_UI?node-id=7214%3A111244

    if (canMorningAndParcelNday || canSpotLunchAndDinnerTomorrow) {
      arrivalDate = calculateArrival(checkArrivaldate(), disabledDates).split('-')[2];
    }

    let newRollingData: IRolling[] = [];

    switch (true) {
      case canSpotLunchAndDinnerTomorrow:
        {
          newRollingData = pipe(
            rollingData,
            filter((item: IRolling) => item.id < 3),
            map((data: IRolling) => {
              const isSpotLunch = data.type === '스팟점심';
              return {
                ...data,
                description: isSpotLunch
                  ? `9시30분까지 주문 시 ${arrivalDate}일 12시 전 도착`
                  : `11시까지 주문 시 ${arrivalDate}일 17시 전 도착`,
              };
            }),
            toArray
          );
        }
        break;
      case canSpotLunchAndDinnerToday:
        {
          newRollingData = rollingData.filter((item) => item.id < 3);
        }
        break;
      case canMorningAndParcelNday:
        {
          newRollingData = pipe(
            rollingData,
            filter((item: IRolling) => item.id > 2),
            map((data: IRolling) => {
              const isParcel = data.type === '택배배송';
              return {
                ...data,
                description: `17시까지 주문 시 ${
                  isParcel ? `${arrivalDate}일 당일 발송` : `${arrivalDate}일 새벽 7시 전 도착`
                }`,
              };
            }),
            toArray
          );
        }
        break;
      case canMorningAndParcelTomorrow:
        {
          newRollingData = rollingData.filter((item) => item.id > 2);
        }
        break;
      case canSpotDinnerToday:
        {
          newRollingData = rollingData.filter((item) => item.id === 2);
        }
        break;
    }

    setRollingData(newRollingData);
  };

  const selectMenuHandler = (menu: IMenuDetails) => {
    // menu.id === menuDetailId

    if (!checkAlreadySelect(menu?.id!)) {
      const { id, ...rest } = menu;
      setSelectedMenus([...selectedMenus, { ...menu, menuDetailId: menu.id, quantity: 1 }]);
    } else {
      clickPlusButton(menu.id);
    }
  };

  const getCalculateTotalPrice = () => {
    return selectedMenus.reduce((acc: number, cur: any) => {
      return acc + (cur.price - cur.discountPrice) * cur.quantity;
    }, 0);
  };

  const removeCartItemHandler = (id: number): void => {
    const newSelectedMenus = selectedMenus.filter((item: any) => item.menuDetailId !== id);
    setSelectedMenus(newSelectedMenus);
  };

  const checkHasMainMenu = (): boolean => {
    return selectedMenus.some((item: any) => item.main);
  };

  const checkAlreadySelect = (id: number) => {
    return selectedMenus.find((item: any) => item.id === id);
  };

  const clickPlusButton = async (id: number, quantity?: number) => {
    /*TODO: 중복코드 */

    const foundItem = selectedMenus.find((item: ISelectedMenu) => item.menuDetailId === id);

    if (foundItem?.personalMaximum) {
      if (foundItem?.personalMaximum < quantity!) return;
    }

    const newSelectedMenus = selectedMenus.map((item: ISelectedMenu) => {
      if (item.menuDetailId === id) {
        if (item.personalMaximum && item?.quantity! > item.personalMaximum - 1) {
          return item;
        } else {
          return { ...item, quantity: quantity ? quantity : item?.quantity! + 1 };
        }
      }
      return item;
    });

    setSelectedMenus(newSelectedMenus);
  };

  const clickMinusButton = (id: number, quantity: number) => {
    const newSelectedMenus = selectedMenus.map((item: ISelectedMenu) => {
      if (item.menuDetailId === id) {
        return { ...item, quantity };
      }
      return item;
    });

    setSelectedMenus(newSelectedMenus);
  };

  const addNonMemberCart = () => {
    const menuObj = {
      isSold: menuItem.isSold,
      menuId: menuItem.id,
      image: menuItem.thumbnail[0],
      name: menuItem.name,
    };

    let formatCartLists: IMenuDetailsInCart[] = selectedMenus?.map((item) => {
      //id: item.menuId! -> item.menuDetailId!
      return {
        cartId: null,
        availabilityInfo: { availability: true, remainingQuantity: 0, menuDetailAvailabilityMessage: 'NONE' },
        menuDetailId: item.menuDetailId,
        name: item.name,
        price: item.price,
        quantity: item.quantity!,
        calorie: item.calorie && item.calorie,
        protein: item.protein && item.protein,
        isSold: item.isSold!,
        main: item.main,
        status: '',
        createdAt: '',
        discountPrice: item.discountPrice,
        discountRate: null,
        id: item.menuDetailId!,
        menuId: item.menuId,
      };
    });

    let cartMenus: IGetCart = {
      menuId: menuObj.menuId,
      holiday: null,
      name: menuObj.name,
      image: menuObj.image,
      menuDetails: formatCartLists,
      isSold: menuObj.isSold,
      createdAt: '',
    };

    const addToAlreadyInCartLists: any = [];
    const addedCartLists: any = [];

    // 메뉴 하나
    const found = nonMemberCartLists.find((item) => item.menuId === menuItem.id);

    try {
      if (nonMemberCartLists.length !== 0 && found) {
        nonMemberCartLists.forEach((localItem) => {
          const changed = localItem.menuDetails.map((localDetail) => {
            const found = formatCartLists.find((detail) => detail.menuDetailId === localDetail.menuDetailId);
            if (found) {
              addedCartLists.push(found.menuDetailId);
              return { ...localDetail, quantity: localDetail.quantity + found.quantity };
            } else {
              return localDetail;
            }
          });

          if (localItem.menuId === menuItem.id) {
            const found = { ...localItem, menuDetails: changed };
            addToAlreadyInCartLists.push(found);
          } else {
            addToAlreadyInCartLists.push(localItem);
          }
        });

        const filtred = formatCartLists.filter((item) => !addedCartLists.includes(item.menuDetailId));

        const mergedCartLists = addToAlreadyInCartLists.map((item: IGetCart) => {
          if (item.menuId === menuItem.id) {
            return { ...item, menuDetails: [...filtred, ...item.menuDetails] };
          } else {
            return item;
          }
        });

        dispatch(SET_NON_MEMBER_CART_LISTS(mergedCartLists));
      } else {
        const newCartLists = [...nonMemberCartLists, cartMenus] as any;
        dispatch(SET_NON_MEMBER_CART_LISTS(newCartLists));
      }
    } catch (error) {
      dispatch(SET_ALERT({ alertMessage: '장바구니 담기에 실패했어요' }));
    } finally {
      showToast({ message: '상품을 장바구니에 담았어요! 😍' });
      dispatch(INIT_BOTTOM_SHEET());
    }
  };

  const addToCart = async () => {
    // 비회원일 경우
    if (!me) {
      if (checkHasMainMenu()) {
        addNonMemberCart();
      } else {
        dispatch(SET_ALERT({ alertMessage: '필수옵션을 선택해주세요.' }));
      }
    } else {
      if (checkHasMainMenu()) {
        await mutateAddCartItem();
      } else {
        dispatch(SET_ALERT({ alertMessage: '필수옵션을 선택해주세요.' }));
      }
    }
  };

  useEffect(() => {
    const isRolling = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

    if (isRolling) {
      checkIsValidRollingMsg();
    }

    if (!isRolling && deliveryType) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  }, []);

  useEffect(() => {
    getCalculateTotalPrice();
  }, [selectedMenus]);

  const optionalMenus = menuItem?.menuDetails.filter((item: any) => !item.main);

  if (menuItem.length === 0) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <TextH5B padding="24px 0 16px 0" center>
        옵션 선택
      </TextH5B>
      <ContentWrapper>
        <Wrapper>
          <MainOption>
            <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
              필수옵션
            </TextH5B>
            <Select placeholder="필수옵션" type={'main'}>
              {menuItem?.menuDetails?.map((option: any, index: number) => {
                if (option.main) {
                  return (
                    <MenuOption
                      key={index}
                      option={option}
                      selectMenuHandler={selectMenuHandler}
                      menuId={menuItem.id}
                    />
                  );
                }
              })}
            </Select>
          </MainOption>
          <OptionalOption>
            <TextH5B padding="24px 0 16px 2px" color={theme.greyScale65}>
              선택옵션
            </TextH5B>

            <Select placeholder="선택옵션" type={'optional'}>
              {menuItem?.menuDetails?.map((option: any, index: number) => {
                if (!option.main) {
                  return (
                    <MenuOption
                      key={index}
                      option={option}
                      selectMenuHandler={selectMenuHandler}
                      menuId={menuItem.id}
                    />
                  );
                }
              })}
            </Select>
          </OptionalOption>
          {selectedMenus.length > 0 ? (
            <SelectedCartItemContainer>
              {selectedMenus.map((menu: any, index: number) => (
                <CartSheetItem
                  menu={menu}
                  key={index}
                  padding="16px"
                  removeCartItemHandler={removeCartItemHandler}
                  clickPlusButton={clickPlusButton}
                  clickMinusButton={clickMinusButton}
                />
              ))}
            </SelectedCartItemContainer>
          ) : null}
        </Wrapper>
        <OrderInfoContainer>
          <TotalSumContainer>
            <TextH5B>총 {selectedMenus.length}개</TextH5B>
            <TextH5B>{getCalculateTotalPrice().toLocaleString()}원</TextH5B>
          </TotalSumContainer>
          <BorderLine height={1} margin="13px 0 10px 0" />
          <DeliveryInforContainer>
            {isTimerTooltip ? <CheckTimerByDelivery isCartSheet /> : <Rolling list={rollingData} />}
          </DeliveryInforContainer>
        </OrderInfoContainer>
      </ContentWrapper>
      <ButtonContainer onClick={() => addToCart()}>
        <Button height="100%" width="100%" borderRadius="0">
          장바구니에 담기
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-height: 85vh;
  height: 100%;
`;

const Wrapper = styled.div`
  padding: 0 24px;
  width: 100%;
`;

const ContentWrapper = styled.div``;

const MainOption = styled.div`
  width: 100%;
`;
const OptionalOption = styled.div`
  width: 100%;
`;

const OrderInfoContainer = styled.div`
  padding: 0 24px;
  margin-bottom: 16px;
  width: 100%;
  margin-bottom: 8px;
`;

const SelectedCartItemContainer = styled.div`
  margin-top: 16px;
  width: 100%;
  overflow-y: scroll;
  max-height: 220px;
`;

const TotalSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeliveryInforContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(CartSheet);
