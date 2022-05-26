import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  FlexColStart,
} from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import SVGIcon from '@utils/common/SVGIcon';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { Calendar } from '@components/Calendar';
import { Button, CountButton, RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import { INIT_AFTER_SETTING_DELIVERY, cartForm, SET_CART_LISTS, INIT_CART_LISTS } from '@store/cart';
import { SET_ORDER } from '@store/order';
import { HorizontalItem } from '@components/Item';
import { SET_ALERT, INIT_ALERT } from '@store/alert';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
import {
  Obj,
  ISubOrderDelivery,
  IMenuDetailsInCart,
  IGetCart,
  ILocation,
  ILunchOrDinner,
  IDeliveryObj,
  IMenus,
  IDeleteCartRequest,
} from '@model/index';
import { isNil, isEqual } from 'lodash-es';
import { SubDeliverySheet } from '@components/BottomSheet/SubDeliverySheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { getCustomDate } from '@utils/destination';
import { checkIsAllSoldout } from '@utils/menu';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getAvailabilityDestinationApi, getMainDestinationsApi } from '@api/destination';
import { getOrderListsApi, getSubOrdersCheckApi } from '@api/order';
import { getCartsApi, getRecentDeliveryApi, deleteCartsApi, patchCartsApi, postCartsApi } from '@api/cart';
import { getMenusApi } from '@api/menu';
import { userForm } from '@store/user';
import { onUnauthorized } from '@api/Api';
import { pluck, pipe, reduce, toArray, map, entries, each, flatMap, intersectionBy } from '@fxts/core';
import { CartItem, DeliveryTypeAndLocation } from '@components/Pages/Cart';
import { DELIVERY_FEE_OBJ } from '@constants/cart';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

/*TODO: 찜하기&이전구매 UI, 찜하기 사이즈에 따라 가격 레인지, 첫 구매시 100원 -> 이전  */

const disabledDates: any = ['2022-02-22'];

interface IMenuDetailsId {
  menuDetailId: number;
  menuQuantity: number;
}

interface IDisposable {
  id: number;
  value: string;
  quantity: number;
  text: string;
  price: number;
  isSelected: boolean;
}

const INITIAL_NUTRITION = {
  protein: 0,
  calorie: 0,
};

const now = dayjs();

const CartPage = () => {
  const [cartItemList, setCartItemList] = useState<IGetCart[]>([]);
  const [itemList, setItemList] = useState<any[]>([]);
  const [checkedMenus, setCheckedMenus] = useState<IGetCart[]>([]);
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
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);
  const [isShow, setIsShow] = useState(false);
  const [disposableList, setDisposableList] = useState<IDisposable[]>([
    { id: 1, value: 'fork', quantity: 1, text: '포크/물티슈', price: 100, isSelected: true },
    { id: 2, value: 'stick', quantity: 1, text: '젓가락/물티슈', price: 100, isSelected: true },
  ]);
  const [selectedDeliveryDay, setSelectedDeliveryDay] = useState<string>('');
  const [subOrderDelivery, setSubOrderDeliery] = useState<ISubOrderDelivery[]>([]);
  const [subDeliveryId, setSubDeliveryId] = useState<number | null>(null);
  const [nutritionObj, setNutritionObj] = useState({ ...INITIAL_NUTRITION });
  const [destinationObj, setDestinationObj] = useState<IDeliveryObj>({
    destinationId: null,
    delivery: null,
    deliveryDetail: null,
    location: null,
    closedDate: '',
  });
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const calendarRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { isClosed } = router.query;
  const { isFromDeliveryPage } = useSelector(cartForm);
  const { userDeliveryType, userDestination } = useSelector(destinationForm);
  const { isLoginSuccess, me } = useSelector(userForm);
  const queryClient = useQueryClient();

  /* TODO: 최근 이력 배송방법 / 기본배송지 api 따로 나옴 */

  const { data: recentOrderDelivery } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        days: 90,
        page: 1,
        size: 10,
        type: 'GENERAL',
      };

      const { data } = await getOrderListsApi(params);
      return data.data.orderDeliveries[0];
    },
    {
      onSuccess: async (response) => {
        const validDestination = userDestination?.delivery === userDeliveryType.toUpperCase();
        if (validDestination && userDeliveryType && userDestination) {
          const destinationId = userDestination?.id!;
          setDestinationObj({
            ...destinationObj,
            delivery: userDeliveryType,
            destinationId,
            location: userDestination.location!,
            closedDate: userDestination.closedDate && userDestination.closedDate,
          });
          dispatch(SET_USER_DELIVERY_TYPE(userDeliveryType));
          dispatch(SET_TEMP_DESTINATION(null));
        } else if (response) {
          const params = {
            delivery: response.delivery,
          };

          try {
            const { data } = await getMainDestinationsApi(params);
            if (data.code === 200) {
              const destinationId = data.data?.id!;

              setDestinationObj({
                ...destinationObj,
                delivery: response.delivery.toLowerCase(),
                destinationId,
                location: data.data?.location ? data.data?.location : null,
                closedDate: data.data?.spotPickup?.spot?.closedDate ? data.data?.spotPickup?.spot?.closedDate : null,
              });

              dispatch(SET_USER_DELIVERY_TYPE(response.delivery.toLowerCase()));
              dispatch(SET_TEMP_DESTINATION(null));
            }
          } catch (error) {
            console.error(error);
          }
        }
        await queryClient.refetchQueries('getSubOrderLists');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  /* TODO: 찜한 상품, 이전 구매 상품 리스트 받아오면 변경해야함 */

  // const { error: menuError } = useQuery(
  //   'getMenus',
  //   async () => {
  //     const params = { categories: '', menuSort: 'LAUNCHED_DESC', searchKeyword: '', type: '' };
  //     const { data } = await getMenusApi(params);

  //     setItemList(data.data);
  //   },
  //   { refetchOnMount: true, refetchOnWindowFocus: false }
  // );

  const {} = useQuery(
    'getSubOrderLists',
    async () => {
      const { data } = await getSubOrdersCheckApi();
      return data.data.orderDeliveries;
    },
    {
      onSuccess: (data) => {
        const result = checkHasSubOrderDeliery(data);
        setSubOrderDeliery(result);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  // const { data: result, refetch } = useQuery(
  //   ['getAvailabilityDestination', hasDeliveryTypeAndDestination],
  //   async () => {
  //     const params = {
  //       roadAddress: userDestination?.location.address!,
  //       jibunAddress: null,
  //       zipCode: userDestination?.location.zipCode!,
  //       delivery: userDeliveryType.toUpperCase() || null,
  //     };
  //     const { data } = await getAvailabilityDestinationApi(params);

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
    async (params: { menuDetailId: number; menuQuantity: number }) => {
      /* TODO : 구매제한체크 api */
      // const checkHasLimitQuantity = checkedMenus.find((item) => item.id === menuDetailId)?.limitQuantity;
      // if (checkHasLimitQuantity && checkHasLimitQuantity < quantity) {
      //   return;
      // }

      const { data } = await patchCartsApi(params);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCartList');
      },
    }
  );

  const { mutate: mutateDeleteItem } = useMutation(
    async (reqBody: IDeleteCartRequest[]) => {
      const { data } = await deleteCartsApi(reqBody);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCartList');
      },
    }
  );

  const { isLoading, isError } = useQuery(
    'getCartList',
    async () => {
      /* TODO: 스팟아이디 넣어야함 */
      const params = {
        delivery: userDeliveryType?.toUpperCase()!,
        deliveryDate: selectedDeliveryDay!,
        spotId: userDeliveryType?.toUpperCase() ? 1 : null,
      };
      const { data } = await getCartsApi({ params });
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: !!selectedDeliveryDay || !!me,
      onSuccess: (data) => {
        /* TODO: 서버랑 store랑 싱크 init후 set으로? */
        try {
          reOrderCartList(data);
          setNutritionObj(getTotalNutrition(data));
          dispatch(INIT_CART_LISTS());
          dispatch(SET_CART_LISTS(data));
        } catch (error) {
          console.error(error);
        }
      },
    }
  );

  const isSpot = destinationObj.delivery === 'spot';
  const isSpotAndQuick = ['spot', 'quick'].includes(destinationObj?.delivery!);

  const reOrderCartList = (data: IGetCart[]) => {
    const checkMenusId = checkedMenus.map((item) => item.menuId);
    const updatedQuantity = data?.filter((item) => checkMenusId.includes(item.menuId));
    setCheckedMenus(updatedQuantity);
    setCartItemList(data);
  };

  const getTotalNutrition = (
    menus: IGetCart[]
  ): {
    calorie: number;
    protein: number;
  } => {
    return menus?.reduce(
      (total, menu) => {
        return menu.menuDetails.reduce((total, cur) => {
          return {
            calorie: total.calorie + cur.calorie,
            protein: total.protein + cur.protein,
          };
        }, total);
      },
      { ...INITIAL_NUTRITION }
    );
  };

  const checkHasSubOrderDeliery = (canSubOrderlist: ISubOrderDelivery[]) => {
    const checkAvailableSubDelivery = ({ delivery, location }: ISubOrderDelivery) => {
      const sameDeliveryType = delivery === destinationObj.delivery?.toUpperCase();
      let sameDeliveryAddress = isEqual(location, destinationObj?.location);
      sameDeliveryAddress = true;
      return sameDeliveryAddress && sameDeliveryType;
    };

    return canSubOrderlist.filter((subOrder: ISubOrderDelivery) => checkAvailableSubDelivery(subOrder));
  };

  const handleSelectCartItem = (menu: IGetCart) => {
    const foundItem = checkedMenus.find((item: IGetCart) => item.menuId === menu.menuId);
    let tempCheckedMenus: IGetCart[] = checkedMenus.slice();
    if (foundItem) {
      tempCheckedMenus = tempCheckedMenus.filter((item) => item.menuId !== menu.menuId);
      if (isAllChecked) {
        setIsAllchecked(!isAllChecked);
      }
    } else {
      const isAllSoldout = checkIsAllSoldout(menu.menuDetails);
      if (isAllSoldout) return;

      tempCheckedMenus.push(menu);
    }

    setCheckedMenus(tempCheckedMenus);
  };

  const handleSelectAllCartItem = () => {
    const canCheckMenus = cartItemList.filter((item) => !item.isSold && !checkIsAllSoldout(item.menuDetails));

    if (!isAllChecked) {
      setCheckedMenus(canCheckMenus);
    } else {
      setCheckedMenus([]);
    }
    setIsAllchecked((prev) => !prev);
  };

  const handleSelectDisposable = (id: number) => {
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
    const reqBody = pipe(
      checkedMenus,
      flatMap((item) =>
        item.menuDetails.map((detail) => {
          return {
            menuId: item.menuId,
            menuDetailId: detail.menuDetailId,
          };
        })
      ),
      toArray
    );

    dispatch(
      SET_ALERT({
        alertMessage: '선택을 상품을 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem(reqBody),
      })
    );
  };

  const removeCartActualItemHandler = ({ menuDetailId, menuId }: { menuId: number; menuDetailId: number }) => {
    let foundMenu = cartItemList.find((item) => item.menuId === menuId);

    const isMain = foundMenu?.menuDetails.find((item) => item.menuDetailId === menuDetailId)?.main;

    let reqBody = [{ menuId, menuDetailId }];
    let alertMessage = '';

    if (isMain) {
      const hasOptionalMenu = foundMenu?.menuDetails.some((item) => !item.main);
      if (hasOptionalMenu) {
        const hasMoreOneMainMenu = foundMenu?.menuDetails.filter((item) => item.main).length === 1;

        if (hasMoreOneMainMenu) {
          alertMessage = '선택옵션 상품도 함께 삭제돼요. 삭제하시겠어요.';
          const foundOptional =
            foundMenu?.menuDetails
              .filter((item) => !item.main)
              .map((item) => {
                return {
                  menuDetailId: item.menuDetailId,
                  menuId: menuId,
                };
              })! || [];
          reqBody = [...reqBody, ...foundOptional];
        } else {
          alertMessage = '상품을 삭제하시겠어요?';
        }
      } else {
        alertMessage = '상품을 삭제하시겠어요?';
      }
    } else {
      alertMessage = '상품을 삭제하시겠어요?';
    }

    dispatch(
      SET_ALERT({
        alertMessage,
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem(reqBody),
      })
    );
  };

  const removeCartDisplayItemHandler = (menu: IGetCart) => {
    const reqBody = menu.menuDetails.map((item) => {
      return {
        menuId: menu.menuId,
        menuDetailId: item.menuDetailId,
      };
    });

    dispatch(
      SET_ALERT({
        alertMessage: '선택을 상품을 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => mutateDeleteItem(reqBody),
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
      switch (destinationObj.delivery) {
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

  const clickPlusButton = (menuDetailId: number, quantity: number) => {
    const parmas = {
      menuDetailId,
      menuQuantity: quantity,
    };
    mutateItemQuantity(parmas);
  };

  const clickMinusButton = (menuDetailId: number, quantity: number) => {
    const parmas = {
      menuDetailId,
      menuQuantity: quantity,
    };
    mutateItemQuantity(parmas);
  };

  const clickRestockNoti = () => {};

  const changeDeliveryDate = (dateValue: string) => {
    const canSubDelivery = subOrderDelivery.find((item) => item.deliveryDate === dateValue);

    if (!canSubDelivery && subDeliveryId) {
      displayAlertForSubDelivery(setSelectedDeliveryDay(dateValue));
      setSubDeliveryId(null);
    }
    setSelectedDeliveryDay(dateValue);
  };

  const displayAlertForSubDelivery = (callback: any) => {
    dispatch(
      SET_ALERT({
        alertMessage: '기본 주문과 배송정보가 다른 경우 함께배송이 불가해요!',
        alertSubMessage: '(배송정보는 함께 받을 기존 주문에서 변경할 수 있어요)',
        submitBtnText: '변경하기',
        closeBtnText: '취소',
        onSubmit: () => callback,
      })
    );
  };

  const goToDeliveryInfo = () => {
    const callback = router.push('/cart/delivery-info');
    // 합배송 선택한 경우
    if (subDeliveryId) {
      displayAlertForSubDelivery(callback);
    } else {
      router.push('/cart/delivery-info');
    }
  };

  const goToSearchPage = () => {
    router.push('/search');
  };

  const goToOrder = () => {
    if (isNil(destinationObj) || !me) return;

    const isSpotOrQuick = ['spot', 'quick'].includes(userDeliveryType);
    const deliveryDetail = lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected)?.value!;

    const orderMenus = getMenuDetailsId(checkedMenus);
    const orderOptions = getOptionsItemId(disposableList);

    const reqBody = {
      destinationId: destinationObj.destinationId!,
      delivery: destinationObj.delivery?.toUpperCase()!,
      deliveryDetail: isSpotOrQuick ? deliveryDetail : '',
      isSubOrderDelivery: subDeliveryId ? true : false,
      // orderDeliveries: [
      //   {
      //     orderMenus,
      //     orderOptions,
      //     deliveryDate: selectedDeliveryDay,
      //   },
      // ],
      orderDeliveries: [
        {
          deliveryDate: selectedDeliveryDay,
          orderMenus: [
            {
              menuDetailId: 72,
              menuQuantity: 1,
            },
            {
              menuDetailId: 511,
              menuQuantity: 1,
            },
          ],
          orderOptions: [
            {
              optionId: 1,
              optionQuantity: 1,
            },
          ],
        },
      ],
      type: 'GENERAL',
    };
    dispatch(SET_ORDER(reqBody));
    router.push('/order');
  };

  const getMenuDetailsId = (list: IGetCart[]): IMenuDetailsId[] => {
    const tempOrderMenus: IMenuDetailsId[] = [];

    list.forEach((item: IGetCart) =>
      item.menuDetails.forEach((detail) => {
        tempOrderMenus.push({
          menuDetailId: detail.menuDetailId,
          menuQuantity: detail.menuQuantity,
        });
      })
    );

    return tempOrderMenus;
  };

  const getOptionsItemId = (list: IDisposable[]): { optionId: number; optionQuantity: number }[] => {
    return list.map((item: IDisposable) => {
      return {
        optionId: item.id,
        optionQuantity: item.quantity,
      };
    });
  };

  const goToSubDeliverySheet = (deliveryId: number): void => {
    const selectedSubDelivery = subOrderDelivery.find((item) => item.id === deliveryId);
    dispatch(
      SET_BOTTOM_SHEET({
        content: (
          <SubDeliverySheet
            title="함께배송 안내"
            selectedSubDelivery={selectedSubDelivery}
            subDelieryHandler={subDelieryHandler}
          />
        ),
      })
    );
  };

  const subDelieryHandler = (deliveryId: number) => {
    setSubDeliveryId(deliveryId);
  };

  const checkSameDateSubDelivery = () => {
    const isSpotOrQuick = ['spot', 'quick'].includes(destinationObj.delivery!);

    for (const subOrder of subOrderDelivery) {
      const { deliveryDate, deliveryDetail } = subOrder;

      const sameDeliveryTime = isSpotOrQuick
        ? deliveryDetail === lunchOrDinner.find((item) => item.isSelected)?.value!
        : true;
      const sameDeliveryDate = deliveryDate === selectedDeliveryDay;
      const canSubDelivery = sameDeliveryDate && sameDeliveryTime;

      if (canSubDelivery) {
        goToSubDeliverySheet(subOrder?.id);
      }
    }
  };

  const getDisposableItemPrice = useCallback((): number => {
    return (
      disposableList.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
      }, 0) || 0
    );
  }, [disposableList]);

  const getItemsPrice = useCallback((): number => {
    return checkedMenus?.reduce((totalPrice, item) => {
      return item.menuDetails.reduce((totalPrice, detail) => {
        if (detail.isSold) return totalPrice;
        return totalPrice + detail.price * detail.menuQuantity;
      }, totalPrice);
    }, 0);
  }, [checkedMenus]);

  const getTotalPrice = useCallback((): void => {
    const itemsPrice = getItemsPrice();
    const disposablePrice = getDisposableItemPrice();
    const totalDiscountPrice = getTotalDiscountPrice();
    const tempTotalAmout = itemsPrice + disposablePrice - totalDiscountPrice;
    setTotalAmount(tempTotalAmout);
  }, [checkedMenus]);

  const getTotalDiscountPrice = useCallback(
    (isSpot?: boolean): number => {
      return isSpot ? getItemDiscountPrice() + getSpotDiscountPrice() : getItemDiscountPrice();
    },
    [checkedMenus]
  );

  const getItemDiscountPrice = useCallback((): number => {
    return checkedMenus?.reduce((tdp, item) => {
      return item.menuDetails.reduce((tdp, detail) => {
        if (detail.isSold) return tdp;
        return tdp + detail.discountPrice;
      }, tdp);
    }, 0);
  }, [checkedMenus]);

  const getSpotDiscountPrice = (): number => {
    return 0;
  };

  const getDeliveryFee = useCallback(() => {
    if (destinationObj?.delivery) {
      const { fee, amountForFree, minimum } =
        destinationObj.delivery && DELIVERY_FEE_OBJ[destinationObj?.delivery?.toLowerCase()!]!;
      if (!fee || amountForFree < totalAmount) return 0;
      return fee;
    }
  }, [totalAmount, destinationObj?.delivery]);

  const orderButtonRender = useCallback(() => {
    let buttonMessage = '';

    if (destinationObj.delivery) {
      const { fee, amountForFree, minimum } = DELIVERY_FEE_OBJ[destinationObj?.delivery?.toLowerCase()!];
      const isUnderMinimum = totalAmount < minimum;
      if (amountForFree > totalAmount) {
        buttonMessage = `${amountForFree - totalAmount}원 더 담고 무료배송하기`;
      } else {
        buttonMessage = `${totalAmount}원 주문하기`;
      }

      return (
        <Button borderRadius="0" height="100%" disabled={isNil(destinationObj) || isUnderMinimum}>
          {buttonMessage}
        </Button>
      );
    } else if (!me) {
      buttonMessage = '로그인을 해주세요';
      return (
        <Button borderRadius="0" height="100%" disabled={true}>
          {buttonMessage}
        </Button>
      );
    }
  }, [checkedMenus, destinationObj.delivery]);

  useEffect(() => {
    const isSpotOrQuick = ['spot', 'quick'].includes(destinationObj.delivery!);
    if (isSpotOrQuick) {
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
    }
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
    // 합배송 관련
    if (subOrderDelivery.length > 0) {
      checkSameDateSubDelivery();
    }
  }, [selectedDeliveryDay, lunchOrDinner, subOrderDelivery]);

  useEffect(() => {
    // 개별 선택 아이템이 전체 카트 아이템의 수량과 일치하면 all 전체선택
    if (checkedMenus?.length === cartItemList?.length) {
      setIsAllchecked(true);
    }
  }, [checkedMenus]);

  useEffect(() => {
    //  첫 렌딩 때 체크
    if (isFirstRender) {
      const canCheckMenus = cartItemList?.filter((item) => !item.isSold && !checkIsAllSoldout(item.menuDetails))!;

      if (cartItemList?.length! > 0 && canCheckMenus?.length === cartItemList?.length) {
        setIsAllchecked(true);
        setCheckedMenus(cartItemList);
      } else {
        setIsAllchecked(false);
        setCheckedMenus(canCheckMenus);
      }
      setIsFirstRender(false);
    }
  }, [cartItemList]);

  useEffect(() => {
    getTotalPrice();
  }, [checkedMenus]);

  useEffect(() => {
    setIsFirstRender(true);
  }, []);

  useEffect(() => {
    // 스팟 종료 날짜
    const { dateFormatter: closedDate } = getCustomDate(new Date(destinationObj?.closedDate!));

    const dDay = now.diff(dayjs(destinationObj?.closedDate!), 'day');
    // 스팟 운영 종료
    if (dDay) {
      return;
    }

    const closedSoonOperation = dDay >= -14;

    if (closedSoonOperation && destinationObj.delivery === 'spot') {
      dispatch(
        SET_ALERT({
          alertMessage: `해당 프코스팟은\n${closedDate}에 운영 종료돼요!`,
          submitBtnText: '확인',
        })
      );
    }
  }, [destinationObj]);

  if (isLoading) {
    return <div>로딩</div>;
  }

  if (cartItemList.length < 0) {
    return (
      <EmptyContainer>
        <FlexCol width="100%">
          <DeliveryTypeAndLocation
            goToDeliveryInfo={goToDeliveryInfo}
            deliveryType={destinationObj.delivery!}
            deliveryDestination={destinationObj.location}
          />
          <BorderLine height={8} margin="24px 0" />
        </FlexCol>
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
        <DeliveryTypeAndLocation
          goToDeliveryInfo={goToDeliveryInfo}
          deliveryType={destinationObj.delivery!}
          deliveryDestination={destinationObj.location}
        />
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
              <TextB2R padding="0 0 0 8px">전체선택 ({`${checkedMenus?.length}/${cartItemList?.length}`})</TextB2R>
            </div>
            <Right>
              <TextH6B color={theme.greyScale65} textDecoration="underline" onClick={removeSelectedItemHandler}>
                선택삭제
              </TextH6B>
            </Right>
          </ListHeader>
          <BorderLine height={1} margin="16px 0" />
          <VerticalCartList>
            {cartItemList?.map((menu: any, index) => (
              <CartItem
                menu={menu}
                handleSelectCartItem={handleSelectCartItem}
                checkedMenus={checkedMenus}
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
                    menuDetailId={item.id}
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
                  <TextH4B padding="0 2px 0 0">{nutritionObj.calorie}</TextH4B>
                  <TextB3R>Kcal</TextB3R>
                </Calorie>
                <Protein>
                  <TextH7B padding="0 8px 0 0" color={theme.greyScale45}>
                    총 단백질
                  </TextH7B>
                  <TextH4B padding="0 2px 0 0">{nutritionObj.protein}</TextH4B>
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
      {destinationObj.delivery && (
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
              subOrderDelivery={subOrderDelivery}
              selectedDeliveryDay={selectedDeliveryDay}
              changeDeliveryDate={changeDeliveryDate}
              goToSubDeliverySheet={goToSubDeliverySheet}
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
            <TextB2R>{getItemsPrice()}원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween>
            <TextH5B>총 할인 금액</TextH5B>
            <TextB2R>{getTotalDiscountPrice(isSpot)}원</TextB2R>
          </FlexBetween>
          <FlexBetween padding="8px 0 0 0">
            <TextB2R>상품 할인</TextB2R>
            <TextB2R>{getItemDiscountPrice()}원</TextB2R>
          </FlexBetween>
          {isSpot && (
            <FlexBetween padding="8px 0 0 0">
              <TextB2R>스팟 이벤트 할인</TextB2R>
              <TextB2R>{getSpotDiscountPrice()}원</TextB2R>
            </FlexBetween>
          )}
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween padding="16px 0 8px">
            <TextH5B>환경부담금 (일회용품)</TextH5B>
            <TextB2R>5개 / 500원</TextB2R>
          </FlexBetween>
          {disposableList.length > 0 &&
            disposableList.map((disposable, index) => {
              const { id, quantity, price } = disposable;
              const hasFork = id === 1;
              const hasChopsticks = id === 2;
              return (
                <div key={index}>
                  {hasFork && (
                    <FlexBetween padding="8px 0 0 0">
                      <TextB2R>포크+물티슈</TextB2R>
                      <TextB2R>
                        {quantity}개 / {price * quantity}원
                      </TextB2R>
                    </FlexBetween>
                  )}
                  {hasChopsticks && (
                    <FlexBetween padding="8px 0 0 0">
                      <TextB2R>젓가락+물티슈</TextB2R>
                      <TextB2R>
                        {quantity}개 / {price * quantity}원
                      </TextB2R>
                    </FlexBetween>
                  )}
                </div>
              );
            })}
          <BorderLine height={1} margin="16px 0" />
          <FlexBetween>
            <TextH5B>배송비</TextH5B>
            <TextB2R>{getDeliveryFee()}원</TextB2R>
          </FlexBetween>
          <FlexBetween>
            <TextB2R padding="8px 0 0 0">배송비 할인</TextB2R>
            <TextB2R>{getDeliveryFee()}원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween padding="8px 0 0 0">
            <TextH4B>결제예정금액</TextH4B>
            <TextH4B>{totalAmount}원</TextH4B>
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
      <OrderBtn onClick={goToOrder}>{orderButtonRender()}</OrderBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;

const EmptyContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
