import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import BorderLine from '@components/Shared/BorderLine';
import { TextB2R, TextH4B, TextH5B, TextH6B, TextB3R, TextH3B } from '@components/Shared/Text';
import { homePadding, theme, FlexBetween, FlexEnd, FlexCol, FlexRow, fixedBottom } from '@styles/theme';
import Checkbox from '@components/Shared/Checkbox';
import { SVGIcon, getFormatPrice, getCookie } from '@utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from '@components/Shared/Tag';
import { Calendar, deliveryTimeInfoRenderer } from '@components/Calendar';
import { Button, CountButton, RadioButton } from '@components/Shared/Button';
import { useRouter } from 'next/router';
import {
  INIT_AFTER_SETTING_DELIVERY,
  cartForm,
  SET_CART_LISTS,
  INIT_CART_LISTS,
  SET_NON_MEMBER_CART_LISTS,
  INIT_NON_MEMBER_CART_LISTS,
} from '@store/cart';
import { SET_ORDER } from '@store/order';
import { Item, DetailItem } from '@components/Item';
import { SET_ALERT } from '@store/alert';
import {
  destinationForm,
  SET_USER_DELIVERY_TYPE,
  INIT_TEMP_DESTINATION,
  SET_TEMP_DESTINATION,
} from '@store/destination';
import {
  ISubOrderDelivery,
  IGetCart,
  ILunchOrDinner,
  IDeliveryObj,
  IMenus,
  IDeleteCartRequest,
  IOrderOptionsInOrderPreviewRequest,
  ICreateCartRequest,
  IMenuDetailsId,
  IDisposable,
  IOrderedMenuDetails,
} from '@model/index';
import { isNil, isEqual } from 'lodash-es';
import { SubDeliverySheet } from '@components/BottomSheet/SubDeliverySheet';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { INIT_USER_ORDER_INFO } from '@store/order';
import { getCustomDate } from '@utils/destination';
import { checkIsAllSoldout, checkCartMenuStatus, checkPeriodCartMenuStatus } from '@utils/menu';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getAvailabilityDestinationApi, getMainDestinationsApi } from '@api/destination';
import { getOrderListsApi, getSubOrdersCheckApi } from '@api/order';
import { getCartsApi, deleteCartsApi, patchCartsApi, postCartsApi } from '@api/cart';
import { getLikeMenus, getOrderedMenusApi } from '@api/menu';
import { userForm } from '@store/user';
import { onUnauthorized } from '@api/Api';
import { pipe, toArray, flatMap } from '@fxts/core';
import {
  CartItem,
  DeliveryTypeAndLocation,
  CartDisposableBox,
  CartDiscountBox,
  CartDeliveryFeeBox,
  NutritionBox,
  SpotPickupAvailability,
} from '@components/Pages/Cart';
import { DELIVERY_FEE_OBJ, INITIAL_NUTRITION, INITIAL_DELIVERY_DETAIL } from '@constants/cart';
import { INIT_ACCESS_METHOD } from '@store/common';
import { setCookie } from '@utils/common';
import { DeliveryTypeInfoSheet } from '@components/BottomSheet/DeliveryTypeInfoSheet';
import { show, hide } from '@store/loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'swiper/css';
import { INIT_COUPON } from '@store/coupon';
import { getPickupAvailabilityApi } from '@api/spot';

dayjs.locale('ko');

const now = dayjs();
const REST_HEIGHT = 60;

const CartPage = () => {
  const [cartItemList, setCartItemList] = useState<IGetCart[]>([]);
  const [checkedMenus, setCheckedMenus] = useState<IGetCart[]>([]);
  const [isAllChecked, setIsAllchecked] = useState<boolean>(true);
  const [lunchOrDinner, setLunchOrDinner] = useState<ILunchOrDinner[]>(INITIAL_DELIVERY_DETAIL);
  const [isShow, setIsShow] = useState(false);
  const [isInvalidDestination, setIsInvalidDestination] = useState<boolean>(false);
  const [disposableList, setDisposableList] = useState<IDisposable[]>([]);
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
    main: false,
    spotId: null,
    name: '',
    pickupId: null,
    pickupType: '',
  });
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [holiday, setHoliday] = useState<string[]>([]);
  const [isCheckedEventSpot, setIsCheckedEventSpot] = useState<boolean>(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isFromDeliveryPage } = useSelector(cartForm);
  const { userDeliveryType, userDestination } = useSelector(destinationForm);
  const { me } = useSelector(userForm);
  const { nonMemberCartLists } = useSelector(cartForm);

  const queryClient = useQueryClient();

  const { mutateAsync: mutateAddCartItem } = useMutation(
    async (reqBody: ICreateCartRequest[]) => {
      const { data } = await postCartsApi(reqBody);
    },
    {
      onError: (error: any) => {},
      onSuccess: async (message) => {
        if (nonMemberCartLists?.length !== 0) {
          dispatch(INIT_NON_MEMBER_CART_LISTS());
        }
      },
    }
  );

  const {
    data: cartResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery(
    ['getCartList'],
    async () => {
      const isSpot = userDeliveryType?.toUpperCase() === 'SPOT';

      const obj = {
        delivery: userDeliveryType?.toUpperCase()! ? userDeliveryType?.toUpperCase()! : null,
        deliveryDate: selectedDeliveryDay ? selectedDeliveryDay : null,
        spotId: isSpot ? destinationObj?.spotId : null,
      };

      const params = selectedDeliveryDay ? obj : undefined;
      const { data } = await getCartsApi(obj);
      return data.data;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      enabled: !!me && !!selectedDeliveryDay,
      onSuccess: (data) => {
        try {
          setCartItemList(data.cartMenus);
          setIsCheckedEventSpot(data.discountInfos[0]?.discountRate > 0);
          dispatch(INIT_CART_LISTS());
          dispatch(SET_CART_LISTS(data));
        } catch (error) {
          console.error(error);
        }
      },
      onSettled: () => {
        dispatch(hide());
      },
      onError: (error: any) => {
        alert(error);
      },
    }
  );

  const {} = useQuery(
    ['getOrderLists'],
    async () => {
      const params = {
        days: 90,
        page: 1,
        size: 10,
        orderType: 'GENERAL',
      };

      const { data } = await getOrderListsApi(params);
      return data.data.orderDeliveries[0];
    },
    {
      onSuccess: async (response) => {
        const validDestination = userDestination?.delivery?.toUpperCase() === userDeliveryType.toUpperCase();

        if (validDestination && userDeliveryType && userDestination) {
          const destinationId = userDestination?.id!;

          setDestinationObj({
            ...destinationObj,
            delivery: userDeliveryType,
            destinationId,
            location: userDestination.location!,
            closedDate: userDestination.closedDate && userDestination.closedDate,
            spotId: userDestination.spotId ? userDestination.spotId! : null,
            name: userDestination.name,
            pickupId: userDestination?.spotPickupId,
            pickupType: userDestination?.spotPickupType!,
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
                name: data.data.name,
                delivery: response.delivery.toLowerCase(),
                destinationId,
                location: data.data?.location ? data.data?.location : null,
                closedDate: data.data?.spotPickup?.spot?.closedDate ? data.data?.spotPickup?.spot?.closedDate : null,
                spotId: data.data?.spotPickup?.id && data.data?.spotPickup?.id,
                pickupId: data.data.spotPickup?.id && data.data.spotPickup?.id,
                pickupType: data.data?.spotPickup?.spot.placeType && data.data?.spotPickup?.spot.placeType,
              });

              dispatch(SET_USER_DELIVERY_TYPE(response.delivery.toLowerCase()));
              dispatch(SET_TEMP_DESTINATION(null));
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: !!me,
    }
  );

  const { data: likeMenusList, isLoading: likeLoading } = useQuery(
    ['getLikeMenus', 'GENERAL'],
    async () => {
      const { data } = await getLikeMenus('GENERAL');
      return reorderLikeMenus(data.data);
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: orderedMenusList, isLoading: orderedMenuLoading } = useQuery(
    ['getOrderedMenus', 'GENERAL'],
    async () => {
      const params = { size: 10 };
      const { data } = await getOrderedMenusApi({ params });

      return data.data.menuDetails;
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me,
    }
  );

  const { data: result } = useQuery(
    ['getAvailabilityDestination'],
    async () => {
      const params = {
        roadAddress: userDestination?.location?.address!,
        jibunAddress: null,
        zipCode: userDestination?.location?.zipCode!,
        delivery: userDeliveryType.toUpperCase() || null,
      };
      const { data } = await getAvailabilityDestinationApi(params);
      return data.data;
    },
    {
      onSuccess: async (data) => {
        if (userDeliveryType === Object.keys(data)[0]) {
          const availability = Object.values(data)[0];
          if (!availability) {
            dispatch(
              SET_ALERT({
                alertMessage: '현재 주문할 수 없는 배송지예요. 배송지를 변경해 주세요.',
              })
            );
            setIsInvalidDestination(true);
          } else {
            setIsInvalidDestination(false);
          }
        }
      },
      onError: ({ response }: any) => {
        const { data: error } = response as any;
        dispatch(SET_ALERT({ alertMessage: error?.message }));
        return;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      enabled: !!me && !!userDestination,
    }
  );

  const {
    data: pickUpAvailability,
    error,
    isLoading: isLoadingPickup,
  } = useQuery(
    'getPickupAvailability',
    async () => {
      const { data } = await getPickupAvailabilityApi(destinationObj?.pickupId!);
      return data.data.isAvailability;
    },
    {
      onSuccess: async (data) => {
        if (!data) {
          dispatch(
            SET_ALERT({
              alertMessage: '현재 사용 가능한 보관함이 없어요.\n다른 프코스팟을 이용해 주세요.',
              submitBtnText: '확인',
            })
          );
        }
      },
      onError: ({ response }: any) => {
        const { data: error } = response as any;

        dispatch(SET_ALERT({ alertMessage: error?.message }));
        return;
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!me && !!destinationObj?.pickupId!,
    }
  );

  const { mutate: mutateItemQuantity } = useMutation(
    async (params: { menuDetailId: number; quantity: number; type: string }) => {
      const { data } = await patchCartsApi({ menuDetailId: params.menuDetailId, quantity: params.quantity });
      if (data.code === 200) {
        return params;
      }
    },
    {
      onSuccess: async (params) => {
        const { menuDetailId, quantity, type } = params!;
        calculateDisposableByMenus(type, menuDetailId);
        const sliced = cartItemList.slice();
        const changedCartItemList = changedQuantityHandler(sliced, menuDetailId, quantity);
        reorderCartList(changedCartItemList);
      },
      onError: () => {
        dispatch(SET_ALERT({ alertMessage: '다시 시도해주세요.' }));
      },
    }
  );

  const { mutate: mutateDeleteItem } = useMutation(
    async ({ reqBody }: { reqBody: IDeleteCartRequest }) => {
      const { data } = await deleteCartsApi([reqBody]);
      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getCartList');
      },
      onError: () => {
        dispatch(SET_ALERT({ alertMessage: '장바구니 삭제에 실패했습니다.' }));
      },
    }
  );

  const isSpot = destinationObj.delivery === 'spot';
  const isSpotAndQuick = ['spot', 'quick'].includes(destinationObj?.delivery!);

  const canCheckFilteredMenus = (list: IGetCart[]) => {
    const canCheckMenus = getCanCheckedMenus(list);
    const canOrderPeriodMenus = list.filter((item) => checkPeriodCartMenuStatus(item.menuDetails));
    return canCheckMenus.filter((item) => !canOrderPeriodMenus?.map((item) => item.menuId).includes(item.menuId));
  };

  const formatHoliday = () => {
    const holidays = checkedMenus?.flatMap((item) =>
      item?.menuDetails?.flatMap((detail) => detail?.holiday?.map((holiday) => holiday!))
    )!;

    return getUniqueInArray(holidays!);
  };

  const initMenuOptions = (list: any) => {
    const checkedDisposable = getCookie({ name: 'disposableChecked' });
    let editDisposableList: any = [];

    list?.forEach((item: any) => {
      item.menuDetails?.forEach((menuDetail: any) => {
        editDisposableList = menuDetail.menuDetailOptions?.map((detail: any) => {
          const found = editDisposableList?.find((item: any) => item.id === detail.id);
          const isSelected = checkedDisposable ? checkedDisposable.includes(detail.id) : true;
          if (found) {
            return { ...detail, quantity: found.quantity + detail.quantity, isSelected };
          }
          return { ...detail, isSelected };
        });
      });
    });

    return editDisposableList;
  };

  const reorderLikeMenus = (menus: IMenus[]) => {
    let copiedMenus = menus.slice();
    return copiedMenus.filter((menu, index) => !menu.isSold && index < 10);
  };

  const reorderCartList = (data: IGetCart[]) => {
    const checkMenusId = checkedMenus?.map((item) => item.menuId);
    const updatedQuantityCart = data?.filter((item: IGetCart) => checkMenusId.includes(item.menuId));

    setCheckedMenus(updatedQuantityCart);
    setCartItemList(data);
  };

  const storedChckedMenusHanlder = (list: IGetCart[]) => {
    const checkedMenusIds = list.map((item) => item.menuId);
    sessionStorage.setItem('checkedMenus', JSON.stringify(checkedMenusIds));
  };

  const selectCartItemHandler = (menu: IGetCart) => {
    const foundItem = checkedMenus.find((item: IGetCart) => item.menuId === menu.menuId);
    let tempCheckedMenus: IGetCart[] = checkedMenus.slice();
    if (foundItem) {
      tempCheckedMenus = tempCheckedMenus.filter((item) => item.menuId !== menu.menuId);

      if (isAllChecked) {
        setIsAllchecked(!isAllChecked);
      }
    } else {
      const isAllSoldout = checkIsAllSoldout(menu.menuDetails);
      const canOrderPeriodMenus = !checkPeriodCartMenuStatus(menu.menuDetails);

      if (isAllSoldout || !canOrderPeriodMenus) return;

      tempCheckedMenus.push(menu);
    }
    // 선택/해제 할 때마다 저장
    storedChckedMenusHanlder(tempCheckedMenus);
    setCheckedMenus(tempCheckedMenus);
  };

  const selectAllCartItemHandler = () => {
    const canCheckMenus = getCanCheckedMenus(cartItemList);
    const canOrderPeriodMenus = cartItemList.filter((item) => checkPeriodCartMenuStatus(item.menuDetails));
    const filtered = canCheckMenus.filter(
      (item) => !canOrderPeriodMenus?.map((item) => item.menuId).includes(item.menuId)
    );

    const canNotCheckAllMenus = filtered?.length === 0;

    if (!isAllChecked) {
      storedChckedMenusHanlder(filtered);
      setCheckedMenus(filtered);
    } else {
      storedChckedMenusHanlder([]);
      setCheckedMenus([]);
    }
    setIsAllchecked((prev) => (canNotCheckAllMenus ? false : !prev));
  };

  const selectDisposableHandler = (id: number) => {
    const newDisposableList = disposableList.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: !item.isSelected };
      } else {
        return item;
      }
    });

    setDisposableList(newDisposableList);
  };

  const lunchOrDinnerHandler = (selectedItem: ILunchOrDinner) => {
    if (selectedItem.isDisabled) {
      return;
    }

    const newLunchDinner = lunchOrDinner.map((item) => {
      return item.id === selectedItem.id ? { ...item, isSelected: true } : { ...item, isSelected: false };
    });

    if (subDeliveryId) {
      const callback = () => {
        setLunchOrDinner(newLunchDinner);
        setSubDeliveryId(null);
      };
      displayAlertForSubDelivery({ callback });
      return;
    } else {
      setLunchOrDinner(newLunchDinner);
    }
  };

  const removeSelectedItemHandler = async () => {
    const selectedMenuDetails = pipe(
      checkedMenus,
      flatMap((item) =>
        item.menuDetails.map((detail) => {
          return {
            cartId: detail?.cartId,
            menuId: item?.menuId!,
            menuDetailId: detail.id,
          };
        })
      ),
      toArray
    );

    dispatch(
      SET_ALERT({
        alertMessage: '선택하신 상품을 모두 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => {
          if (!me) {
            const selectedIds = checkedMenus.map((item) => item.menuId);
            const filtered = cartItemList.filter((item) => !selectedIds.includes(item.menuId));
            setNonMemberCartListsHandler(filtered);
            return;
          } else {
            try {
              const result = selectedMenuDetails.map((detail) => {
                const reqBody = { menuDetailId: detail.menuDetailId };
                return mutateDeleteItem({ reqBody });
              });
            } catch (error) {
              console.error(error);
            }
          }
        },
      })
    );
  };

  const removeCartActualItemHandler = ({
    menuDetailId,
    menuId,
    cartId,
  }: {
    menuId: number;
    menuDetailId: number;
    cartId: number;
  }) => {
    let foundMenu = cartItemList.find((item) => item.menuId === menuId);

    const isMain = foundMenu?.menuDetails.find((item) => item.id === menuDetailId)?.main;

    let selectedMenuDetails = [{ menuDetailId }];
    let alertMessage = '';

    if (isMain) {
      const hasOptionalMenu = foundMenu?.menuDetails.some((item) => !item.main);
      if (hasOptionalMenu) {
        const hasMoreOneMainMenu = foundMenu?.menuDetails.filter((item) => item.main)?.length === 1;
        if (hasMoreOneMainMenu) {
          alertMessage = '선택옵션 상품도 함께 삭제돼요. \n 삭제하시겠어요?';
          const foundOptional =
            foundMenu?.menuDetails
              .filter((item) => !item.main)
              .map((item) => {
                return {
                  menuDetailId: item.id,
                };
              })! || [];
          selectedMenuDetails = [...selectedMenuDetails, ...foundOptional];
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
        onSubmit: () => {
          if (!me) {
            const menuDetailIds = selectedMenuDetails.map((ids) => ids.menuDetailId);
            let filtered = cartItemList.map((item) => {
              if (item.menuId === menuId) {
                return {
                  ...item,
                  menuDetails: item.menuDetails.filter((item) => !menuDetailIds.includes(item.menuDetailId)),
                };
              } else {
                return item;
              }
            });

            const checkHasMainMenu = filtered
              .find((item) => item.menuId === menuId)
              ?.menuDetails.some((item) => item.main);

            if (!checkHasMainMenu) {
              filtered = filtered.filter((item) => item.menuId !== menuId);
            }

            setNonMemberCartListsHandler(filtered);
          } else {
            try {
              const result = selectedMenuDetails.map((detail) => {
                const reqBody = { menuDetailId: detail.menuDetailId };
                return mutateDeleteItem({ reqBody });
              });
            } catch (error) {
              console.error(error);
            }
          }
        },
      })
    );
  };

  const removeCartDisplayItemHandler = (menu: IGetCart) => {
    const selectedMenuDetails = menu.menuDetails.map((item) => {
      return {
        cartId: item.cartId!,
        menuId: menu?.menuId!,
        menuDetailId: item.id,
      };
    });

    dispatch(
      SET_ALERT({
        alertMessage: '선택하신 상품을 모두 삭제하시겠어요?',
        closeBtnText: '취소',
        submitBtnText: '확인',
        onSubmit: () => {
          if (!me) {
            const filtered: any = cartItemList.filter((item) => item.menuId !== menu.menuId);
            setNonMemberCartListsHandler(filtered);
            return;
          } else {
            try {
              const result = selectedMenuDetails.map((detail) => {
                const reqBody = { menuDetailId: detail.menuDetailId };
                return mutateDeleteItem({ reqBody });
              });
            } catch (error) {
              console.error(error);
            }
          }
        },
      })
    );
  };

  const changedQuantityHandler = (list: IGetCart[], menuDetailId: number, quantity: number) => {
    // 비회원일때
    let changedCartItemList: any = [];

    list.forEach((item) => {
      let menuId;
      const changed = item.menuDetails.map((detail) => {
        if (detail.menuDetailId ?? detail.id === menuDetailId) {
          menuId = item.menuId;
          return {
            ...detail,
            quantity,
            menuDetailOptions: detail.menuDetailOptions?.map((item) => {
              return { ...item, quantity };
            }),
          };
        } else {
          return detail;
        }
      });

      if (item.menuId === menuId) {
        const found = { ...item, menuDetails: changed };
        changedCartItemList.push(found);
      } else {
        changedCartItemList.push(item);
      }
    });

    return changedCartItemList;
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

  const displayAlertForSubDelivery = ({ type, callback }: { type?: string; callback?: () => void }) => {
    const isRouting = type! === 'route';
    dispatch(
      SET_ALERT({
        alertMessage: '기본 주문과 배송정보가 다른 경우 함께배송이 불가해요!',
        alertSubMessage: '(배송정보는 함께 받을 기존 주문에서 변경할 수 있어요)',
        submitBtnText: '변경하기',
        closeBtnText: '취소',
        onSubmit: () => {
          if (isRouting) {
            router.push('/cart/delivery-info');
          } else {
            callback && callback();
          }
        },
      })
    );
    return;
  };

  const changeDeliveryDate = ({ value, isChanged }: { value: string; isChanged: boolean }) => {
    const canSubDelivery = subOrderDelivery.find((item) => item.deliveryDate === value);

    if (value.length === 0) {
      dispatch(
        SET_ALERT({
          alertMessage: '선택한 배송지로 가능한 날짜가 없어요. 배송지를 변경해주세요.',
          onSubmit: () => scrollToTop(),
        })
      );
      return;
    }
    if (isChanged) {
      dispatch(
        SET_ALERT({
          alertMessage: '설정한 배송지로 가능한 날짜를 확인해주세요.',
          onSubmit: () => setSelectedDeliveryDay(value),
        })
      );
      return;
    }

    if (!canSubDelivery && subDeliveryId) {
      const callback = () => {
        setSelectedDeliveryDay(value);
        setSubDeliveryId(null);
      };
      displayAlertForSubDelivery({ callback });
      return;
    }
    setSelectedDeliveryDay(value);
  };

  const subDelieryHandler = (deliveryId: number) => {
    setSubDeliveryId(deliveryId);
  };

  const checkHasSubOrderDelivery = (canSubOrderlist: ISubOrderDelivery[]) => {
    const checkAvailableSubDelivery = ({ delivery, location }: ISubOrderDelivery) => {
      const sameDeliveryAddress = isEqual(location, destinationObj?.location!);

      return sameDeliveryAddress;
    };

    return canSubOrderlist.filter((subOrder: ISubOrderDelivery) => checkAvailableSubDelivery(subOrder));
  };

  const checkSameDateSubDelivery = () => {
    const isSpotOrQuick = ['spot', 'quick'].includes(userDeliveryType);

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

  const clickPlusButton = (menuDetailId: number, quantity: number) => {
    if (!me) {
      const sliced = cartItemList.slice();
      const changedCartItemList = changedQuantityHandler(sliced, menuDetailId, quantity);
      reorderCartList(changedCartItemList);
      return;
    } else {
      const parmas = {
        menuDetailId,
        quantity,
        type: 'plus',
      };

      mutateItemQuantity(parmas);
    }
  };

  const clickMinusButton = (menuDetailId: number, quantity: number) => {
    if (!me) {
      const sliced = cartItemList.slice();
      const changedCartItemList = changedQuantityHandler(sliced, menuDetailId, quantity);
      reorderCartList(changedCartItemList);
      return;
    }

    const parmas = {
      menuDetailId,
      quantity,
      type: 'minus',
    };

    mutateItemQuantity(parmas);
  };

  const setNonMemberCartListsHandler = (list: any) => {
    dispatch(SET_NON_MEMBER_CART_LISTS(list));
    setCartItemList(list);
  };

  const setPemanentedDisposableItem = () => {
    const checkedId = disposableList.filter((item) => item.isSelected).map((item) => item.id);
    setCookie({
      name: 'disposableChecked',
      value: JSON.stringify(checkedId),
    });
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
            calorie: total.calorie + cur?.calorie! * cur.quantity,
            protein: total.protein + cur?.protein! * cur.quantity,
          };
        }, total);
      },
      { ...INITIAL_NUTRITION }
    );
  };

  const getMenuDetailsId = (list: IGetCart[]): IMenuDetailsId[] => {
    const tempOrderMenus: IMenuDetailsId[] = [];

    list.forEach((item: IGetCart) =>
      item.menuDetails.forEach((detail) => {
        tempOrderMenus.push({
          menuDetailId: detail.id,
          menuQuantity: detail.quantity,
        });
      })
    );

    return tempOrderMenus;
  };

  const getOptionsItemId = (list: IDisposable[]): IOrderOptionsInOrderPreviewRequest[] => {
    return list
      ?.map((item: IDisposable) => {
        if (item.isSelected) {
          return {
            optionId: item.id,
            optionQuantity: item.quantity,
          };
        } else {
          return {
            optionId: null,
            optionQuantity: null,
          };
        }
      })
      .filter((item) => item.optionId || item.optionQuantity);
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

  const getDisposableItem = useCallback((): { price: number; quantity: number } => {
    return disposableList
      ?.filter((item) => item.isSelected)
      .reduce(
        (total, item) => {
          return { price: total.price + item.price * item.quantity, quantity: total.quantity + item.quantity };
        },
        { price: 0, quantity: 0 }
      );
  }, [disposableList]);

  const getItemsPrice = useCallback((): number => {
    return checkedMenus?.reduce((totalPrice, item) => {
      return item.menuDetails.reduce((totalPrice, detail) => {
        if (detail.isSold) return totalPrice;
        return totalPrice + detail.price * detail.quantity;
      }, totalPrice);
    }, 0);
  }, [checkedMenus]);

  const getTotalPrice = useCallback((): void => {
    const itemsPrice = getItemsPrice();

    const disposablePrice = getDisposableItem()?.price ?? 0;
    const totalDiscountPrice = getTotalDiscountPrice();
    const tempTotalAmout = itemsPrice + disposablePrice - totalDiscountPrice;

    setTotalAmount(tempTotalAmout);
  }, [checkedMenus, disposableList]);

  const getTotalDiscountPrice = useCallback((): number => {
    return isSpot ? getItemDiscountPrice() + getSpotDiscountPrice() : getItemDiscountPrice();
  }, [checkedMenus]);

  const getItemDiscountPrice = useCallback((): number => {
    return checkedMenus?.reduce((tdp, item) => {
      return item.menuDetails.reduce((tdp, detail) => {
        if (detail.isSold) return tdp;
        return tdp + detail.discountPrice * detail.quantity;
      }, tdp);
    }, 0);
  }, [checkedMenus]);

  const getSpotDiscountPrice = useCallback((): number => {
    const spotDiscount = cartResponse?.discountInfos[0];
    const discoutnedItemsPrice = getItemsPrice() - getItemDiscountPrice();

    return spotDiscount?.discountRate ? (spotDiscount?.discountRate! / 100) * discoutnedItemsPrice ?? 0 : 0;
  }, [checkedMenus]);

  const getDeliveryFee = useCallback(() => {
    if (destinationObj?.delivery && me) {
      const { fee, amountForFree, minimum } =
        destinationObj.delivery && DELIVERY_FEE_OBJ[destinationObj?.delivery?.toLowerCase()!]!;
      if (!fee || amountForFree <= totalAmount) return 0;
      return fee;
    } else {
      return 0;
    }
  }, [destinationObj?.delivery, disposableList, totalAmount]);

  const getCanCheckedMenus = (list: IGetCart[]) => {
    return list?.filter((item) => !item.isSold && !checkIsAllSoldout(item.menuDetails))!;
  };

  const getUniqueInArray = (list: (number[] | undefined)[]) => {
    const getUnique: string[] = [];

    list?.forEach((item, index) => {
      const toString = item?.join()!;
      if (!getUnique.includes(toString!)) {
        getUnique.push(toString!);
      }
    });
    return getUnique;
  };

  const checkCanOrderThatDate = () => {
    const formatDate = selectedDeliveryDay
      .split('-')
      .map((item, index) => {
        if (index) {
          return item.replace('0', '');
        }
        return item;
      })
      .join(',');

    return !formatHoliday().includes(formatDate);
  };

  const goToDeliveryInfo = () => {
    sessionStorage.setItem('selectedDay', selectedDeliveryDay);
    // 합배송 선택한 경우
    if (subDeliveryId) {
      displayAlertForSubDelivery({ type: 'route' });
      return;
    } else {
      router.push('/cart/delivery-info');
      dispatch(INIT_TEMP_DESTINATION());
    }
  };

  const goToSearchPage = () => {
    router.push('/');
  };

  const scrollToTop = () => {
    const offsetTop = containerRef.current?.offsetTop! - REST_HEIGHT;
    window.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: offsetTop,
    });
  };

  const goToOrder = () => {
    if (!me) return;
    if (!destinationObj.destinationId) return;
    if (isSpot && (isLoadingPickup || !pickUpAvailability)) return;

    if (isInvalidDestination) {
      dispatch(
        SET_ALERT({
          alertMessage: '현재 주문할 수 없는 배송지예요. 배송지를 변경해 주세요.',
          onSubmit: () => scrollToTop(),
        })
      );
      return;
    }

    const allAvailableMenus = checkedMenus.filter((item) => checkCartMenuStatus(item.menuDetails))?.length === 0;
    const canOrderThatDate = checkCanOrderThatDate();

    const canOrderPeriodMenus =
      checkedMenus.filter((item) => checkPeriodCartMenuStatus(item.menuDetails))?.length === 0;
    const canOrderdMenus = getCanCheckedMenus(checkedMenus);

    const hasSoldOutMenus = canOrderdMenus?.length !== checkedMenus?.length || !canOrderPeriodMenus;
    if (hasSoldOutMenus) {
      dispatch(
        SET_ALERT({
          alertMessage: '품절된 상품이 포함되어 있어 주문할 수 없어요.',
          onSubmit: () => scrollToTop(),
        })
      );
      return;
    }
    if (!canOrderThatDate) {
      dispatch(
        SET_ALERT({
          alertMessage: '선택한 날짜에 배송 불가능한 상품을 확인해 주세요.',
          onSubmit: () => scrollToTop(),
        })
      );
      return;
    }

    if (!allAvailableMenus) {
      dispatch(
        SET_ALERT({
          alertMessage: '주문 가능 수량이 초과된 상품을 확인 후 변경해 주세요.',
          onSubmit: () => scrollToTop(),
        })
      );
      return;
    }

    const { minimum } = DELIVERY_FEE_OBJ[destinationObj?.delivery?.toLowerCase()!];
    const isUnderMinimum = totalAmount < minimum;

    if (isNil(destinationObj) || isUnderMinimum) return;

    const isSpotOrQuick = ['spot', 'quick'].includes(userDeliveryType);
    const deliveryDetail = lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected)?.value!;

    const orderMenus = getMenuDetailsId(checkedMenus);
    const orderOptions = getOptionsItemId(disposableList);

    const reqBody = {
      destinationId: destinationObj.destinationId!,
      delivery: destinationObj.delivery?.toUpperCase()!,
      deliveryDetail: isSpotOrQuick ? deliveryDetail : '',
      isSubOrderDelivery: subDeliveryId ? true : false,
      orderDeliveries: [
        {
          orderMenus,
          orderOptions,
          deliveryDate: selectedDeliveryDay,
        },
      ],

      type: 'GENERAL',
    };

    dispatch(SET_ORDER(reqBody));
    sessionStorage.removeItem('selectedDay');
    setPemanentedDisposableItem();

    router.push('/order');
  };

  const goToBottomSheet = () => {
    dispatch(SET_BOTTOM_SHEET({ content: <DeliveryTypeInfoSheet /> }));
  };

  const orderButtonRender = () => {
    let buttonMessage = '';
    const hasDestination = destinationObj.destinationId !== null;

    if (!me) {
      return (
        <Button borderRadius="0" height="100%" onClick={onUnauthorized}>
          로그인을 해주세요
        </Button>
      );
    }

    if (isSpot && (isLoadingPickup || !pickUpAvailability)) {
      return (
        <Button borderRadius="0" height="100%" disabled={!pickUpAvailability}>
          배송정보를 설정해 주세요
        </Button>
      );
    }

    if (destinationObj.delivery && destinationObj.destinationId) {
      const { fee, amountForFree, minimum } = DELIVERY_FEE_OBJ[destinationObj?.delivery?.toLowerCase()!];
      const isUnderMinimum = totalAmount < minimum;

      if (isUnderMinimum) {
        buttonMessage = `최소주문금액까지 ${getFormatPrice(String(minimum - totalAmount))}원 남았습니다`;
      } else if (amountForFree > totalAmount) {
        buttonMessage = `${getFormatPrice(String(amountForFree - totalAmount))}원 더 담고 무료 배송하기`;
      } else {
        buttonMessage = `${getFormatPrice(String(totalAmount))}원 주문하기`;
      }

      return (
        <Button borderRadius="0" height="100%" disabled={!hasDestination || isUnderMinimum}>
          {buttonMessage}
        </Button>
      );
    } else {
      return (
        <Button borderRadius="0" height="100%" onClick={() => router.push('/cart/delivery-info')}>
          배송정보를 입력해주세요.
        </Button>
      );
    }
  };

  const calculateDisposableByMenus = (type: string, menuDetailId: number) => {
    const plus = type === 'plus';
    const found = checkedMenus.find((details) => details.menuDetails.find((item) => item.id === menuDetailId));

    if (found) {
      setDisposableList(
        disposableList.map((item) => {
          if (!plus && item.quantity < 2) return { ...item, quantity: 1 };
          return { ...item, quantity: plus ? item.quantity + 1 : item.quantity - 1 };
        })
      );
    }
  };

  const addDisposableItems = () => {
    const checkedDisposable = getCookie({ name: 'disposableChecked' });
    let editDisposableList: any = [];
    checkedMenus?.forEach((item: any) => {
      item.menuDetails?.forEach((menuDetail: any) => {
        editDisposableList = menuDetail.menuDetailOptions?.map((detail: any) => {
          const found = editDisposableList?.find((item: any) => item.id === detail.id);
          const isSelected = checkedDisposable ? checkedDisposable.includes(detail.id) : true;
          if (found) {
            return { ...detail, quantity: found.quantity + detail.quantity, isSelected };
          }
          return { ...detail, isSelected };
        });
      });
    });

    setDisposableList(editDisposableList);
  };

  const getStoredCheckedMenus = () => {
    const storedCheckedIds = JSON.parse(sessionStorage.getItem('checkedMenus')! ?? null);
    return cartItemList.filter((items) => storedCheckedIds?.includes(items.menuId));
  };

  const getSubOrderDelivery = async () => {
    if (me) {
      const params = {
        delivery: userDeliveryType.toUpperCase(),
      };
      try {
        const { data } = await getSubOrdersCheckApi(params);
        if (data.code === 200) {
          const result = checkHasSubOrderDelivery(data?.data.orderDeliveries);

          setSubOrderDeliery(result);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const checkMenusHandler = (data: IGetCart[]) => {
    if (data.length! > 0 && canCheckFilteredMenus(data)?.length === cartItemList.length) {
      setIsAllchecked(true);
      setCheckedMenus(data);
    } else {
      setIsAllchecked(false);
      setCheckedMenus(canCheckFilteredMenus(data));
    }
  };

  const checkIsClosedSpot = () => {
    // 스팟 종료 날짜
    const { dateFormatter: closedDate } = getCustomDate(destinationObj?.closedDate!);
    const dDay = now.diff(dayjs(destinationObj?.closedDate!), 'day');

    // 스팟 운영 종료
    if (dDay || !destinationObj?.closedDate!) {
      return;
    }

    const closedSoonOperation = dDay >= -14;

    if (closedSoonOperation && isSpot) {
      dispatch(
        SET_ALERT({
          alertMessage: `해당 프코스팟은\n${closedDate}에 운영 종료돼요!`,
          submitBtnText: '확인',
        })
      );
    }
  };

  const addToCartItemByNonmember = () => {
    // 비회원일경우
    if (!me) {
      reorderCartList(nonMemberCartLists ?? []);
    } else {
      // 로그인 경우 비회원 장바구니 리스트 있는 조회
      const hasNonMemberCarts = nonMemberCartLists?.length !== 0;
      if (hasNonMemberCarts) {
        const reqBody = nonMemberCartLists.flatMap((item) =>
          item.menuDetails.map((detail) => {
            return {
              menuId: item.menuId!,
              menuDetailId: detail.menuDetailId,
              quantity: detail.quantity,
              main: detail.main,
            };
          })
        );
        mutateAddCartItem(reqBody);
      }
    }
  };

  const getCartList = async () => {
    if (!selectedDeliveryDay && !userDeliveryType && me) {
      try {
        const { data } = await getCartsApi(undefined);

        setCartItemList(data.data.cartMenus);
        setIsCheckedEventSpot(data.data.discountInfos[0]?.discountRate > 0);
        dispatch(INIT_CART_LISTS());
        dispatch(SET_CART_LISTS(data.data));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const isSpotOrQuick = ['spot', 'quick'].includes(destinationObj.delivery!);
    if (isSpotOrQuick) {
      const { currentTime, currentDate } = getCustomDate();
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

    if (selectedDeliveryDay) {
      refetch();
    }
  }, [selectedDeliveryDay]);

  useEffect(() => {
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
    if (subOrderDelivery?.length > 0) {
      checkSameDateSubDelivery();
    }
  }, [selectedDeliveryDay, lunchOrDinner, subOrderDelivery]);

  useEffect(() => {
    // 개별 선택 아이템이 전체 카트 아이템의 수량과 일치하면 all 전체선택
    if (checkedMenus?.length === cartItemList?.length) {
      setIsAllchecked(true);
    }
    addDisposableItems();
  }, [checkedMenus]);

  useEffect(() => {
    getSubOrderDelivery();
    checkIsClosedSpot();
  }, [destinationObj]);

  useEffect(() => {
    const foundChecked = getStoredCheckedMenus();
    const checked = foundChecked.length !== 0 ? foundChecked : cartItemList;

    setDisposableList(initMenuOptions(checked));
    setHoliday(formatHoliday());
    checkMenusHandler(checked);
  }, [cartItemList]);

  useEffect(() => {
    getTotalPrice();
    setNutritionObj(getTotalNutrition(checkedMenus));
  }, [checkedMenus, disposableList]);

  useEffect(() => {
    getCartList();
  }, []);

  useEffect(() => {
    addToCartItemByNonmember();
    dispatch(INIT_ACCESS_METHOD());
    dispatch(INIT_USER_ORDER_INFO());
    dispatch(INIT_COUPON());
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Container ref={containerRef}>
      {isCheckedEventSpot && (
        <TopNoticeWrapper>
          <TextH5B color={theme.white}>이벤트 프코스팟 주문은 픽업장소 변경이 불가해요.</TextH5B>
        </TopNoticeWrapper>
      )}
      {me ? (
        <DeliveryTypeWrapper>
          <DeliveryTypeAndLocation
            goToDeliveryInfo={goToDeliveryInfo}
            deliveryType={destinationObj.delivery!}
            deliveryDestination={destinationObj}
          />
          {userDeliveryType === 'spot' &&
            (destinationObj?.pickupType === 'GS_LOCKER' || destinationObj?.pickupType === 'KORAIL_LOCKER') && (
              <SpotPickupAvailability pickUpAvailability={pickUpAvailability} isLoadingPickup={isLoadingPickup} />
            )}
        </DeliveryTypeWrapper>
      ) : (
        <DeliveryMethodAndPickupLocation onClick={onUnauthorized}>
          <Left>
            <TextH3B>로그인 후 배송방법과</TextH3B>
            <TextH3B>배송지를 설정해주세요</TextH3B>
          </Left>
          <Right>
            <SVGIcon name="arrowRight" />
          </Right>
        </DeliveryMethodAndPickupLocation>
      )}
      <BorderLine height={8} margin="24px 0" />
      {cartItemList?.length === 0 ? (
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
      ) : (
        <CartInfoContainer>
          <CartListWrapper>
            <ListHeader>
              <div className="itemCheckbox">
                <Checkbox onChange={selectAllCartItemHandler} isSelected={isAllChecked ? true : false} />
                <TextB2R padding="0 0 0 8px">전체선택 ({`${checkedMenus?.length}/${cartItemList?.length}`})</TextB2R>
              </div>
              <Right>
                <TextH6B
                  color={theme.greyScale65}
                  textDecoration="underline"
                  onClick={removeSelectedItemHandler}
                  pointer
                >
                  선택삭제
                </TextH6B>
              </Right>
            </ListHeader>
            <BorderLine height={1} margin="16px 0" />
            <VerticalCartList>
              {cartItemList?.map((menu: any, index) => (
                <CartItem
                  menu={menu}
                  selectCartItemHandler={selectCartItemHandler}
                  checkedMenus={checkedMenus}
                  clickPlusButton={clickPlusButton}
                  clickMinusButton={clickMinusButton}
                  removeCartDisplayItemHandler={removeCartDisplayItemHandler}
                  removeCartActualItemHandler={removeCartActualItemHandler}
                  key={index}
                />
              ))}
            </VerticalCartList>
          </CartListWrapper>
          {me && (
            <DisposableSelectWrapper>
              <WrapperTitle>
                <SVGIcon name="fcoIcon" />
                <TextH5B padding="0 0 0 8px">일회용품은 한 번 더 생각해주세요!</TextH5B>
              </WrapperTitle>
              <CheckBoxWrapper>
                {disposableList?.map((item, index) => (
                  <DisposableItem key={index}>
                    <div className="disposableLeft">
                      <Checkbox onChange={() => selectDisposableHandler(item.id)} isSelected={item.isSelected!} />
                      <div className="disposableText">
                        <TextB2R padding="0 4px 0 8px">{item.name}</TextB2R>
                        <TextH5B>{item.price}원</TextH5B>
                      </div>
                    </div>
                    <Right>
                      <CountButton
                        isSold={!item.isSelected}
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
          )}

          <NutritionInfoWrapper>
            <FlexBetween onClick={() => setIsShow(!isShow)}>
              <span className="h5B">
                💪 내 장바구니 체크! 현재
                <span className="brandColor"> 관리중</span>
                이신가요?
              </span>
              <div>
                <SVGIcon name={isShow ? 'triangleUp' : 'triangleDown'} />
              </div>
            </FlexBetween>
            {isShow && (
              <FlexCol>
                <NutritionBox nutritionObj={nutritionObj} />
                <TextB3R margin="8px 0 0 0" color={theme.greyScale65}>
                  * 현재 장바구니에 담긴 샐러드 상품의 영양정보예요.
                </TextB3R>
              </FlexCol>
            )}
          </NutritionInfoWrapper>
          <GetMoreBtn ref={calendarRef} onClick={goToSearchPage}>
            <Button backgroundColor={theme.white} color={theme.black} border>
              + 더 담으러 가기
            </Button>
          </GetMoreBtn>
        </CartInfoContainer>
      )}
      {destinationObj.delivery && (
        <>
          <BorderLine height={8} margin="32px 0" />
          <FlexCol padding="0 24px">
            <FlexBetween>
              <FlexRow margin="0 0 16px 0">
                <TextH3B padding="2px 4px 0 0">{isSpot ? '픽업날짜' : '배송일'}</TextH3B>
                <SVGIcon name="questionMark" />
              </FlexRow>
              {deliveryTimeInfoRenderer({
                selectedDeliveryDay,
                selectedTime: lunchOrDinner && lunchOrDinner.find((item: ILunchOrDinner) => item?.isSelected)?.time!,
                delivery: destinationObj.delivery,
              })}
            </FlexBetween>
            <Calendar
              disabledDates={holiday}
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
                    <RadioButton onChange={() => lunchOrDinnerHandler(item)} isSelected={item.isSelected} />
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
      {me && <BorderLine height={8} margin="32px 0" />}
      <MenuListContainer>
        {me && likeMenusList?.length !== 0 && (
          <MenuListWarpper>
            <MenuListHeader>
              <TextH3B padding="12px 0 24px 0">{me?.nickname}님이 찜한 상품이에요</TextH3B>
              <ScrollHorizonListGroup className="swiper-container" slidesPerView={'auto'} spaceBetween={16} speed={500}>
                {likeMenusList?.map((item: IMenus, index: number) => {
                  if (index > 9) return;
                  return (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <Item item={item} key={index} isHorizontal />
                    </SwiperSlide>
                  );
                })}
              </ScrollHorizonListGroup>
            </MenuListHeader>
          </MenuListWarpper>
        )}
        {me && orderedMenusList?.length !== 0 && (
          <MenuListWarpper>
            <MenuListHeader>
              <TextH3B padding="24px 0 24px 0">이전에 구매한 상품들은 어떠세요?</TextH3B>
              <ScrollHorizonListGroup className="swiper-container" slidesPerView={'auto'} spaceBetween={15} speed={500}>
                {orderedMenusList?.map((item: IOrderedMenuDetails, index: number) => {
                  if (index > 9) return;
                  return (
                    <SwiperSlide className="swiper-slide" key={index}>
                      <DetailItem item={item} key={index} isHorizontal />
                    </SwiperSlide>
                  );
                })}
              </ScrollHorizonListGroup>
            </MenuListHeader>
          </MenuListWarpper>
        )}
      </MenuListContainer>
      {cartItemList?.length > 0 && (
        <TotalPriceWrapper>
          <FlexBetween>
            <TextH5B>총 상품금액</TextH5B>
            <TextB2R>{getFormatPrice(String(getItemsPrice()))}원</TextB2R>
          </FlexBetween>
          <BorderLine height={1} margin="16px 0" />
          <CartDiscountBox
            totalDiscountPrice={getTotalDiscountPrice()}
            itemDiscountPrice={getItemDiscountPrice()}
            spotDiscountPrice={getSpotDiscountPrice()}
            hasSpotEvent={cartResponse?.discountInfos?.length !== 0}
            isSpot={isSpot}
          />
          <CartDisposableBox disposableList={disposableList} disposableItems={getDisposableItem()} />
          <BorderLine height={1} margin="16px 0" />
          <CartDeliveryFeeBox
            deliveryFee={getDeliveryFee()}
            deliveryFeeDiscount={0}
            isLogin={isNil(me)}
            onClick={goToBottomSheet}
          />
          <BorderLine height={1} margin="16px 0" backgroundColor={theme.black} />
          <FlexBetween padding="0 0 0 0">
            <TextH4B>결제예정금액</TextH4B>
            <TextH4B>{getFormatPrice(String(totalAmount + getDeliveryFee()))}원</TextH4B>
          </FlexBetween>
          {me && (
            <FlexEnd padding="11px 0 0 0">
              <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
                {me?.grade?.name}
              </Tag>
              <TextB3R padding="0 0 0 3px">결제 금액의 </TextB3R>
              <TextH6B>{me.grade.benefit.accumulationRate * 100}% 적립</TextH6B>
            </FlexEnd>
          )}
        </TotalPriceWrapper>
      )}
      <OrderBtn onClick={goToOrder}>{orderButtonRender()}</OrderBtn>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
  position: relative;
`;

const TopNoticeWrapper = styled.div`
  width: 100%;
  height: 45px;
  position: reletive;
  top: 0;
  background: ${theme.brandColor};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50vh;
`;

const DeliveryTypeWrapper = styled.div`
  width: 100%;
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

const CartListWrapper = styled.div`
  ${homePadding}
`;

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
  cursor: pointer;
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

const GetMoreBtn = styled.div`
  padding: 12px 24px 24px 24px;
`;
const BtnWrapper = styled.div`
  margin: 0 24px;
`;

const CartInfoContainer = styled.div``;
const MenuListContainer = styled.div`
  ${homePadding}
`;
const MenuListWarpper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuListHeader = styled.div``;

const ScrollHorizonListGroup = styled(Swiper)`
  width: 100%;

  cursor: pointer;
  .swiper-slide {
    max-width: 130px;
    width: 100%;
  }
`;

const TotalPriceWrapper = styled.div`
  margin-top: 48px;
  padding: 24px;
  background-color: ${theme.greyScale3};
  display: flex;
  flex-direction: column;
`;

const OrderBtn = styled.div`
  ${fixedBottom}
`;

export default CartPage;
