import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TextH3B, TextH5B, TextH6B, TextB3R, TextH4B } from '@components/Shared/Text';
import { Button, RadioButton } from '@components/Shared/Button';
import { Tag } from '@components/Shared/Tag';
import { fixedBottom, FlexBetween, homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AFTER_SETTING_DELIVERY } from '@store/cart';
import {
  SET_USER_DELIVERY_TYPE,
  SET_DESTINATION,
  INIT_TEMP_DESTINATION,
  INIT_DESTINATION_TYPE,
  INIT_USER_DELIVERY_TYPE,
  INIT_AVAILABLE_DESTINATION,
} from '@store/destination';
import { destinationForm } from '@store/destination';
import { postDestinationApi, getMainDestinationsApi } from '@api/destination';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import { checkTimerLimitHelper, checkIsValidTimer, getTargetDelivery } from '@utils/destination';
import { INIT_TIMER, orderForm, SET_TIMER_STATUS } from '@store/order';
import { useRouter } from 'next/router';
import { DELIVERY_METHOD } from '@constants/delivery-info';
import { IDestinationsResponse } from '@model/index';
import { PickupPlaceBox, DeliveryPlaceBox } from '@components/Pages/Cart';
import { SET_ALERT } from '@store/alert';
import { getOrderListsApi } from '@api/order';
import { useQuery } from 'react-query';
import { SET_SUBS_DELIVERY_EXPECTED_DATE, SET_SUBS_INFO_STATE, SET_SUBS_START_DATE } from '@store/subscription';
import { useMenuDetail } from '@queries/menu';
import { getCurrentDate } from '@utils/common/dateHelper';
import { show, hide } from '@store/loading';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip/Tooltip'), {
  ssr: false,
});

const DeliverInfoPage = () => {
  const [deliveryTypeWithTooltip, setDeliveryTypeWithTooltip] = useState<string>('');
  const [hasRecentOrder, setHasRecentOrder] = useState<boolean>(false);
  const [userSelectDeliveryType, setUserSelectDeliveryType] = useState<string>('');
  const [timerDevlieryType, setTimerDeliveryType] = useState<string>('');
  const [tempDestination, setTempDestination] = useState<IDestinationsResponse | null>();
  const [isMainDestination, setIsMaindestination] = useState<boolean>(false);
  const [menuId, setMenuId] = useState<number>();
  const {
    destinationDeliveryType,
    userTempDestination,
    locationStatus,
    userDeliveryType,
    availableDestination,
    userDestination,
  } = useSelector(destinationForm);

  const dispatch = useDispatch();
  const router = useRouter();

  let { destinationId, isSubscription, subsDeliveryType, selected, deliveryType } = router.query;
  const isSubs = isSubscription === 'true';

  const { isTimerTooltip } = useSelector(orderForm);

  useEffect(() => {
    if (router.isReady) {
      setMenuId(Number(router.query.menuId));
    }
  }, [router.isReady, router.query.menuId]);

  const { data: recentOrderDelivery } = useQuery(
    'getOrderLists',
    async () => {
      dispatch(show());
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
      onSuccess: (data) => {
        setHasRecentOrder(true);
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data: menuDetail, isFetching } = useMenuDetail('getMenuDetail', Number(menuId!), {
    onSuccess: () => {},
    enabled: !!menuId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const goToFindAddress = () => {
    if (userSelectDeliveryType === 'spot') {
      if (isSubs) {
        router.replace({
          pathname: '/spot/search/result',
          query: {
            subsDeliveryType: userSelectDeliveryType.toUpperCase(),
            isSubscription: isSubs,
            isDelivery: true,
            menuId,
          },
        });
      } else {
        router.replace({
          pathname: '/spot/search/result',
          query: { isDelivery: true },
        });
      }
    } else {
      if (isSubs) {
        router.replace({
          pathname: '/destination/search',
          query: {
            subsDeliveryType: userSelectDeliveryType.toUpperCase(),
            isSubscription: isSubs,
            menuId,
          },
        });
      } else {
        router.replace({
          pathname: '/destination/search',
          query: { deliveryType: userSelectDeliveryType.toUpperCase() },
        });
      }
    }
  };

  const changeDeliveryTypeHandler = (value: string) => {
    // ?????? ?????? ????????? ????????? ???????????? ????????? ????????? ????????? ?????? ?????????

    if (tempDestination && !isMainDestination) {
      dispatch(
        SET_ALERT({
          alertMessage: '???????????? ??? ????????? ???????????? ?????????.  \n ??????????????? ??????????????????????',
          onSubmit: () => {
            dispatch(INIT_TEMP_DESTINATION());
            dispatch(INIT_DESTINATION_TYPE());
            dispatch(INIT_USER_DELIVERY_TYPE());
            setUserSelectDeliveryType(value);
            setTempDestination(null);
            setHasRecentOrder(false);
          },
          submitBtnText: '??????',
          closeBtnText: '??????',
        })
      );
    } else {
      if (value === deliveryTypeWithTooltip) {
        setDeliveryTypeWithTooltip('');
      }

      setUserSelectDeliveryType(value);
    }
  };

  const finishDeliverySetting = async () => {
    const isSpot = userSelectDeliveryType === 'spot';

    if (!tempDestination) {
      return;
    }

    // ????????????????????? ?????????????????? ???????????? ????????? post ??? ?????? ?????? ???????????????

    if (destinationId || isMainDestination) {
      const spotPickupType = tempDestination?.spotPickup?.type ?? userDestination?.spotPickupType;
      const spotPickupId = tempDestination?.spotPickup?.id ?? userDestination?.spotPickupId;
      dispatch(
        SET_DESTINATION({
          ...tempDestination,
          spotId: tempDestination.spotId,
          spotPickupType: isSpot ? spotPickupType : null,
          spotPickupId: isSpot ? spotPickupId : null,
        })
      );
      dispatch(SET_USER_DELIVERY_TYPE(tempDestination?.delivery?.toLowerCase()!));
      dispatch(SET_AFTER_SETTING_DELIVERY());
      dispatch(INIT_TEMP_DESTINATION());
      dispatch(INIT_DESTINATION_TYPE());
      dispatch(INIT_AVAILABLE_DESTINATION());

      if (isSubs) {
        if (isSpot) {
          const reqBody = {
            name: tempDestination?.name!,
            delivery: userSelectDeliveryType ? userSelectDeliveryType.toUpperCase() : userDeliveryType.toUpperCase(),
            deliveryMessage: tempDestination?.deliveryMessage ? tempDestination.deliveryMessage : '',
            main: tempDestination?.main!,
            receiverName: tempDestination?.receiverName,
            receiverTel: tempDestination?.receiverTel,
            location: {
              addressDetail: tempDestination?.location?.addressDetail!,
              address: tempDestination?.location?.address!,
              zipCode: tempDestination?.location?.zipCode!,
              dong: tempDestination?.location?.dong!,
            },
            spotPickupId: userSelectDeliveryType === 'spot' ? tempDestination?.spotPickupId : null,
          };

          try {
            const { data } = await postDestinationApi(reqBody);
            if (data.code === 200) {
              const response = data.data;

              dispatch(
                SET_DESTINATION({
                  name: response.name,
                  delivery: response.delivery,
                  deliveryMessageType: '',
                  main: response.main,
                  receiverName: response.receiverName,
                  receiverTel: response.receiverTel,
                  location: {
                    addressDetail: response.location.addressDetail,
                    address: response.location.address,
                    dong: response.location.dong,
                    zipCode: response.location.zipCode,
                  },
                  deliveryMessage: response.deliveryMessage,
                  id: response.id,
                  availableTime: tempDestination.availableTime,
                  spaceType: tempDestination.spaceType,
                  spotPickupType: response?.spotPickup?.type,
                  spotPickupId: response?.spotPickup?.id,
                })
              );
              dispatch(SET_AFTER_SETTING_DELIVERY());
              dispatch(SET_USER_DELIVERY_TYPE(response.delivery.toLowerCase()));
              dispatch(INIT_TEMP_DESTINATION());
              dispatch(INIT_DESTINATION_TYPE());
              dispatch(INIT_AVAILABLE_DESTINATION());
              if (isSubs) {
                router.push({
                  pathname: '/subscription/set-info',
                  query: { subsDeliveryType: subsDeliveryType, menuId },
                });
              } else {
                router.replace('/cart');
              }
            }
          } catch (error) {
            if (isSubs) {
              router.push({
                pathname: '/subscription/set-info',
                query: { subsDeliveryType: subsDeliveryType, menuId },
              });
            }
            console.log('error', error);
          }
        } else {
          if (userDestination?.delivery !== userSelectDeliveryType.toUpperCase()) {
            dispatch(
              SET_SUBS_INFO_STATE({
                startDate: null,
                deliveryDay: null,
                deliveryTime: null,
              })
            );
            dispatch(
              SET_SUBS_START_DATE({
                subsStartDate: null,
              })
            );
            dispatch(
              SET_SUBS_DELIVERY_EXPECTED_DATE({
                subsDeliveryExpectedDate: null,
              })
            );
          }
          router.push({
            pathname: '/subscription/set-info',
            query: { subsDeliveryType: subsDeliveryType, menuId },
          });
        }
      } else {
        router.push('/cart');
      }
    } else {
      if (tempDestination) {
        const spotPickupId = tempDestination?.spotPickupId ?? userDestination?.spotPickupId;
        const reqBody = {
          name: tempDestination?.name!,
          delivery: userSelectDeliveryType ? userSelectDeliveryType.toUpperCase() : userDeliveryType.toUpperCase(),
          deliveryMessage: tempDestination?.deliveryMessage ? tempDestination.deliveryMessage : '',
          main: tempDestination?.main!,
          receiverName: tempDestination?.receiverName,
          receiverTel: tempDestination?.receiverTel,
          location: {
            addressDetail: tempDestination?.location?.addressDetail!,
            address: tempDestination?.location?.address!,
            zipCode: tempDestination?.location?.zipCode!,
            dong: tempDestination?.location?.dong!,
          },
          spotPickupId: isSpot ? spotPickupId : null,
        };

        try {
          const { data } = await postDestinationApi(reqBody);
          if (data.code === 200) {
            const response = data.data;

            dispatch(
              SET_DESTINATION({
                name: response.name,
                location: {
                  addressDetail: response.location.addressDetail,
                  address: response.location.address,
                  dong: response.location.dong,
                  zipCode: response.location.zipCode,
                },
                main: response.main,
                deliveryMessage: response.deliveryMessage,
                receiverName: response.receiverName,
                receiverTel: response.receiverTel,
                deliveryMessageType: '',
                delivery: response.delivery,
                id: response.id,
                availableTime: tempDestination.availableTime ? tempDestination.availableTime! : undefined,
                spaceType: tempDestination.spaceType ? tempDestination.spaceType : undefined,
                spotPickupType: response.spotPickup?.type,
                spotPickupId: response.spotPickup?.id,
              })
            );
            dispatch(SET_AFTER_SETTING_DELIVERY());
            dispatch(SET_USER_DELIVERY_TYPE(response.delivery.toLowerCase()));
            dispatch(INIT_TEMP_DESTINATION());
            dispatch(INIT_DESTINATION_TYPE());
            dispatch(INIT_AVAILABLE_DESTINATION());
            if (isSubs) {
              router.push({
                pathname: '/subscription/set-info',
                query: { subsDeliveryType: subsDeliveryType, menuId },
              });
            } else {
              router.push('/cart');
            }
          }
        } catch (error) {
          console.error(error);
          dispatch(SET_ALERT({ alertMessage: '?????? ??????????????????.' }));
          return;
        }
      }
    }
  };

  const placeInfoRender = () => {
    switch (userSelectDeliveryType) {
      case 'spot': {
        return <PickupPlaceBox place={tempDestination} />;
      }

      default: {
        return <DeliveryPlaceBox place={tempDestination} type={userSelectDeliveryType.toUpperCase()} />;
      }
    }
  };

  const tooltipRender = () => {
    switch (deliveryTypeWithTooltip) {
      case 'morning': {
        return <Tooltip message="??????????????? ????????????!" top="25px" width="150px" />;
      }
      case 'parcel': {
        return <Tooltip message="??????????????? ????????????!" top="25px" width="150px" />;
      }
      case 'spot': {
        return <Tooltip message="?????? ??????????????? ????????????!" top="25px" width="180px" />;
      }
    }
  };

  const checkTooltipMsgByDeliveryType = () => {
    const canEverything = destinationDeliveryType === 'spot';

    const locationCanMorning = locationStatus === 'morning';
    const locationCanEverything = locationStatus === 'spot';
    const locationCanParcel = locationStatus === 'parcel';

    const { morning, parcel, quick } = availableDestination;
    // ?????? ?????????
    const canQuickAndCanParcel = !morning && quick && parcel;
    const canParcelAndCanMorning = morning && parcel;

    // ?????? ???????????? ????????? ?????? ?????? ??????
    if (destinationId) {
      setDeliveryTypeWithTooltip('');
      return;
    }

    // ?????? ?????? ????????? ??????
    if (locationStatus && !destinationDeliveryType && !recentOrderDelivery) {
      switch (true) {
        case locationCanEverything:
          {
            setDeliveryTypeWithTooltip('spot');
          }
          break;
        case locationCanMorning:
          {
            setDeliveryTypeWithTooltip('morning');
          }
          break;
        case locationCanParcel:
          {
            setDeliveryTypeWithTooltip('parcel');
          }
          break;
        default:
          return;
      }
    }

    // ????????? ?????? ?????? ??? ?????? ????????? ????????? ??????
    switch (userDeliveryType) {
      case 'parcel':
        {
          if (canEverything || canParcelAndCanMorning) {
            setDeliveryTypeWithTooltip('morning');
          }
        }
        break;
      case 'quick':
        {
          if (canEverything) {
            setDeliveryTypeWithTooltip('morning');
          } else if (canQuickAndCanParcel) {
            setDeliveryTypeWithTooltip('parcel');
          }
        }
        break;
    }
  };

  const userSelectDeliveryTypeHelper = () => {
    // ????????? ?????? ??????????????? ?????? ?????? ?????? ??????
    if (userDeliveryType && !deliveryType) {
      if (isSubs) {
        // ???????????? ?????? ???????????? ???????????? ??? ?????? ??????
        if (subsDeliveryType === 'SPOT') {
          setUserSelectDeliveryType('spot');
        } else if (['PARCEL', 'MORNING'].includes(subsDeliveryType as string)) {
          if (selected === 'Y' || !selected) {
            console.log('here by tayler 442');
            setUserSelectDeliveryType((subsDeliveryType as string).toLowerCase());
          }
        }
      } else {
        setUserSelectDeliveryType(userDeliveryType?.toLowerCase());
      }
    }
  };

  const getMainDestinationByDeliveryType = async () => {
    if (!userSelectDeliveryType || userTempDestination) {
      return;
    }

    if (userDestination?.delivery?.toUpperCase() === userSelectDeliveryType.toUpperCase()) {
      setTempDestination(userDestination);
      setIsMaindestination(true);
      return;
    }

    const params = {
      delivery: userSelectDeliveryType.toUpperCase(),
    };

    try {
      const { data } = await getMainDestinationsApi(params);
      if (data.code === 200) {
        if (data.data) {
          setTempDestination({ ...data.data, spotId: data.data.spotPickup?.spotId });
          setIsMaindestination(true);
        } else {
          setTempDestination(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkTimerShow = () => {
    // ?????? ?????? ????????? ?????? ?????? ?????? ????????? ?????? ?????? 30??? ??? ?????? show
    const timerResult = checkTimerLimitHelper(locationStatus);
    if (checkIsValidTimer(getCurrentDate(), timerResult)) {
      dispatch(INIT_TIMER({ isInitDelay: false })); //????????? ??????
      const timerDeliveryType = getTargetDelivery(timerResult);
      if (['????????????', '????????????'].includes(timerDeliveryType)) {
        setTimerDeliveryType('????????????');
      } else {
        setTimerDeliveryType(timerDeliveryType);
      }
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(INIT_TIMER({ isInitDelay: true })); //????????? ??????
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  };

  useEffect(() => {
    const vaildSelectedDestination = userDestination?.delivery?.toUpperCase() === userSelectDeliveryType?.toUpperCase();

    // ????????? ????????? ???????????? ????????? ?????? ????????? ??????
    if (userTempDestination) {
      setTempDestination(userTempDestination);
      setIsMaindestination(false);

      // ????????? ????????? ?????????
    } else if (!userTempDestination && userDestination && vaildSelectedDestination) {
      setTempDestination(userDestination);

      // ?????? ?????? ????????? ?????????
    } else if (!userTempDestination && recentOrderDelivery && hasRecentOrder) {
      if (!isSubs) {
        setUserSelectDeliveryType(recentOrderDelivery.delivery.toLowerCase());
        setIsMaindestination(true);
      }
    } else {
    }
  }, [userTempDestination, recentOrderDelivery, userDestination]);

  useEffect(() => {
    if (isSubs) {
      // ???????????? ?????? ???????????? ???????????? ??? ?????? ??????
      if (subsDeliveryType === 'SPOT') {
        setUserSelectDeliveryType('spot');
      } else if (['PARCEL', 'MORNING'].includes(subsDeliveryType as string)) {
        if (selected === 'Y' || !selected) {
          console.log('here by tayler 528');
          setUserSelectDeliveryType((subsDeliveryType as string).toLowerCase());
        }
      }
    } else {
      if (deliveryType) {
        setUserSelectDeliveryType((deliveryType as string).toLowerCase());
      }
    }
  }, [isSubs, subsDeliveryType, deliveryType]);

  useEffect(() => {
    // ???????????? ?????? ??? ?????? ????????? api ??????
    getMainDestinationByDeliveryType();
  }, [userSelectDeliveryType]);

  useEffect(() => {
    checkTimerShow();

    // ?????? ???????????? ????????? ?????? ??????
    userSelectDeliveryTypeHelper();

    // ????????? ????????? ??????????????? ?????? ?????? ??????
    checkTooltipMsgByDeliveryType();
  }, []);

  const isSpotPickupPlace = userSelectDeliveryType === 'spot';
  const subsParcelAndMorning = ['PARCEL', 'MORNING'].includes(subsDeliveryType as string);

  if (isFetching) return <div></div>;

  return (
    <Container>
      <Wrapper>
        <TextH4B padding="24px">????????????</TextH4B>
        <DeliveryMethodWrapper>
          {!subsParcelAndMorning && (
            <>
              <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
                ??????
              </TextH5B>
              {DELIVERY_METHOD['pickup'].map((item: any, index: number) => {
                const isSelected = userSelectDeliveryType === item.value;

                return (
                  <MethodGroup key={index}>
                    <RowWrapper>
                      <RadioWrapper>
                        <RadioButton isSelected={isSelected} onChange={() => changeDeliveryTypeHandler(item.value)} />
                      </RadioWrapper>
                      <Content>
                        <FlexBetween margin="0 0 8px 0">
                          <RowLeft>
                            <TextH5B margin="0 4px 0px 8px">{item.name}</TextH5B>
                            {item.tag && (
                              <Tag backgroundColor={theme.greyScale6} color={theme.greyScale45}>
                                {item.tag}
                              </Tag>
                            )}
                          </RowLeft>

                          {!isSubs && deliveryTypeWithTooltip === item.value && tooltipRender()}
                          {!isSubs && isTimerTooltip && item.name === timerDevlieryType && <CheckTimerByDelivery />}
                        </FlexBetween>
                        <Body>
                          <TextB3R color={theme.greyScale45}>{item.description}</TextB3R>
                          <TextH6B color={theme.greyScale45}>{item.feeInfo}</TextH6B>
                        </Body>
                      </Content>
                    </RowWrapper>
                  </MethodGroup>
                );
              })}
            </>
          )}
          {!isSubs && <BorderLine height={1} margin="24px 0" />}
          {subsDeliveryType !== 'SPOT' && (
            <>
              <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
                ??????
              </TextH5B>
              {DELIVERY_METHOD['delivery'].map((item: any, index: number) => {
                // ??????????????? ???????????? ???????????? ???????????? ??????

                if (isSubs && item.name === '?????????') {
                  return;
                } else {
                  if (isSubs && !menuDetail?.subscriptionDeliveries.includes(item.value.toUpperCase())) return;
                }

                const isSelected = userSelectDeliveryType === item.value;

                return (
                  <MethodGroup key={index}>
                    <RowWrapper>
                      <RadioWrapper>
                        <RadioButton isSelected={isSelected} onChange={() => changeDeliveryTypeHandler(item.value)} />
                      </RadioWrapper>
                      <Content>
                        <FlexBetween margin="0 0 8px 0">
                          <RowLeft>
                            <TextH5B margin="0 4px 0 8px">{item.name}</TextH5B>
                            {item.tag && (
                              <Tag backgroundColor={theme.greyScale6} color={theme.greyScale45}>
                                {item.tag}
                              </Tag>
                            )}
                          </RowLeft>
                          {!isSubs && deliveryTypeWithTooltip === item.value && tooltipRender()}
                          {!isSubs && isTimerTooltip && item.name === timerDevlieryType && <CheckTimerByDelivery />}
                        </FlexBetween>
                        <Body>
                          <TextB3R color={theme.greyScale45}>{item.description}</TextB3R>
                          <TextH6B color={theme.greyScale45}>{item.feeInfo}</TextH6B>
                        </Body>
                      </Content>
                    </RowWrapper>
                  </MethodGroup>
                );
              })}
            </>
          )}
        </DeliveryMethodWrapper>
        <BorderLine height={8} margin="32px 0" />
        {userSelectDeliveryType && (
          <PlaceWrapper>
            <FlexBetween>
              <TextH3B padding="0 0 14px 0">{isSpotPickupPlace ? '????????????' : '?????????'}</TextH3B>
              {tempDestination && (
                <TextH6B textDecoration="underline" color={theme.greyScale65} onClick={goToFindAddress} pointer>
                  ????????????
                </TextH6B>
              )}
            </FlexBetween>
            {tempDestination ? placeInfoRender() : ''}
            {(!userSelectDeliveryType || !tempDestination) && (
              <BtnWrapper onClick={goToFindAddress}>
                <Button backgroundColor={theme.white} color={theme.black} border>
                  {isSpotPickupPlace ? '???????????? ????????????' : '????????? ????????????'}
                </Button>
              </BtnWrapper>
            )}
          </PlaceWrapper>
        )}
      </Wrapper>
      <SettingBtnWrapper onClick={finishDeliverySetting}>
        <Button borderRadius="0" height="56px" disabled={!tempDestination}>
          ????????????
        </Button>
      </SettingBtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 56px;
`;

const PlaceWrapper = styled.div`
  ${homePadding}
`;

const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 32px;
`;
const DeliveryMethodWrapper = styled.div`
  width: 100%;
  ${homePadding}
`;
const RadioWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  margin-top: 2px;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const RowLeft = styled.div`
  position: relative;
  display: flex;
`;
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MethodGroup = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const Body = styled.div`
  padding-left: 8px;
`;

const BtnWrapper = styled.div``;

const SettingBtnWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  ${fixedBottom}
`;

export default DeliverInfoPage;

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
