import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TextH3B, TextH5B, TextH6B, TextB3R } from '@components/Shared/Text';
import { Button, RadioButton } from '@components/Shared/Button';
import { Tag } from '@components/Shared/Tag';
import { FlexBetween, homePadding, theme } from '@styles/theme';
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
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import { orderForm, SET_TIMER_STATUS } from '@store/order';
import { useRouter } from 'next/router';
import checkIsValidTimer from '@utils/checkIsValidTimer';
import { DELIVERY_METHOD } from '@constants/delivery-info';
import { IDestinationsResponse } from '@model/index';
import { PickupPlaceBox, DeliveryPlaceBox } from '@components/Pages/Cart';
import { SET_ALERT } from '@store/alert';
import { getOrderListsApi } from '@api/order';
import { useQuery, useQueryClient, useMutation } from 'react-query';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip/Tooltip'), {
  ssr: false,
});

/* TODO: map 리팩토링 */
/* TODO: 스팟 배송일 경우 추가 */

const DeliverInfoPage = () => {
  const [deliveryTypeWithTooltip, setDeliveryTypeWithTooltip] = useState<string>('');
  const [userSelectDeliveryType, setUserSelectDeliveryType] = useState<string>('');
  const [timerDevlieryType, setTimerDeliveryType] = useState<string>('');
  const [tempDestination, setTempDestination] = useState<IDestinationsResponse | null>();
  const [isMainDestination, setIsMaindestination] = useState<boolean>(false);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);

  const { destinationDeliveryType, userTempDestination, locationStatus, userDeliveryType, availableDestination } =
    useSelector(destinationForm);

  const dispatch = useDispatch();
  const router = useRouter();

  const { destinationId, isSubscription, deliveryInfo } = router.query;
  const { isTimerTooltip } = useSelector(orderForm);

  const { data: recentOrderDelivery } = useQuery(
    'getOrderLists',
    async () => {
      const params = {
        days: 90,
        page: 1,
        size: 100,
        type: 'GENERAL',
      };

      const { data } = await getOrderListsApi(params);
      return data.data.orderDeliveries[0];
    },
    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  // 배송 마감 타이머 체크 + 위치 체크
  let deliveryType = checkIsValidTimer(checkTimerLimitHelper());

  const noticeHandler = () => {
    setNoticeChecked(!noticeChecked);
  };

  const goToFindAddress = () => {
    if (userSelectDeliveryType === 'spot') {
      if (isSubscription) {
        router.push({
          pathname: '/spot/search',
          query: {
            deliveryInfo,
            isSubscription: true,
            isDelivery: true,
          },
        });
      } else {
        router.push({
          pathname: '/spot/search',
          query: { isDelivery: true },
        });
      }
    } else {
      dispatch(SET_USER_DELIVERY_TYPE(userSelectDeliveryType));
      if (isSubscription) {
        router.push({
          pathname: '/destination/search',
          query: {
            deliveryInfo,
            isSubscription: true,
          },
        });
      } else {
        router.push('/destination/search');
      }
    }
  };

  const changeDeliveryTypeHandler = (value: string) => {
    // 배송 방법 변경시 검색한 배송지가 있으면 초기화 배송지 정보 초기화

    if (tempDestination && !isMainDestination) {
      dispatch(
        SET_ALERT({
          alertMessage: '설정하신 주소는 저장되지 않습니다. 배송방법을 변경하시겠어요?',
          onSubmit: () => {
            setUserSelectDeliveryType(value);
            setTempDestination(null);
            dispatch(INIT_TEMP_DESTINATION());
            dispatch(INIT_DESTINATION_TYPE());
            dispatch(INIT_USER_DELIVERY_TYPE());
          },
          submitBtnText: '확인',
          closeBtnText: '취소',
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
    } else if (userSelectDeliveryType === 'spot' && tempDestination?.spotPickup?.type === 'PRIVATE' && !noticeChecked) {
      // 스팟 배송이고, 프라이빗일 경우 공지 체크 해야만 넘어감
      return;
    }

    // 기본배송지거나 최근이력에서 가져오면 서버에 post 안 하고 바로 장바구니로
    if (destinationId || isMainDestination || isSpot) {
      dispatch(SET_DESTINATION(tempDestination));
      dispatch(SET_AFTER_SETTING_DELIVERY());
      dispatch(SET_USER_DELIVERY_TYPE(tempDestination?.delivery?.toLowerCase()!));
      dispatch(INIT_TEMP_DESTINATION());
      dispatch(INIT_DESTINATION_TYPE());
      dispatch(INIT_AVAILABLE_DESTINATION());

      if (isSubscription) {
        router.push('/subscription/set-info');
      } else {
        router.push('/cart');
      }
    } else {
      /* TODO spotPickupId 형 체크 */

      const reqBody = {
        addressDetail: tempDestination.location.addressDetail,
        name: tempDestination.name,
        address: tempDestination.location.address,
        delivery: userSelectDeliveryType ? userSelectDeliveryType.toUpperCase() : userDeliveryType.toUpperCase(),
        deliveryMessage: tempDestination.deliveryMessage ? tempDestination.deliveryMessage : '',
        dong: tempDestination.location.dong,
        main: tempDestination.main,
        receiverName: tempDestination.receiverName ? tempDestination.receiverName : '테스트',
        receiverTel: tempDestination.receiverTel ? tempDestination.receiverTel : '01012341234',
        zipCode: tempDestination.location.zipCode,
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
            })
          );
          dispatch(SET_AFTER_SETTING_DELIVERY());
          dispatch(SET_USER_DELIVERY_TYPE(response.delivery.toLowerCase()));
          dispatch(INIT_TEMP_DESTINATION());
          dispatch(INIT_DESTINATION_TYPE());
          dispatch(INIT_AVAILABLE_DESTINATION());
          router.push('/cart');
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }
  };

  const placeInfoRender = () => {
    switch (userSelectDeliveryType) {
      case 'spot': {
        return <PickupPlaceBox place={tempDestination} checkTermHandler={noticeHandler} isSelected={noticeChecked} />;
      }

      default: {
        return <DeliveryPlaceBox place={tempDestination} type={userSelectDeliveryType.toUpperCase()} />;
      }
    }
  };

  const tooltipRender = () => {
    switch (deliveryTypeWithTooltip) {
      case 'morning': {
        return <Tooltip message="새벽배송이 가능해요!" top="25px" width="150px" />;
      }
      case 'parcel': {
        return <Tooltip message="택배배송만 가능해요!" top="25px" width="150px" />;
      }
      case 'spot': {
        return <Tooltip message="무료 스팟배송이 가능해요!" top="25px" width="170px" />;
      }
    }
  };

  const checkTooltipMsgByDeliveryType = () => {
    const canEverything = destinationDeliveryType === 'spot';

    const locationCanMorning = locationStatus === 'morning';
    const locationCanEverything = locationStatus === 'spot';
    const locationCanParcel = locationStatus === 'parcel';

    const { morning, parcel, quick } = availableDestination;
    // 예외 케이스
    const canQuickAndCanParcel = !morning && quick && parcel;
    const canParcelAndCanMorning = morning && parcel;

    // 최근 이력에서 가져온 경우 툴팁 리셋
    if (destinationId) {
      setDeliveryTypeWithTooltip('');
      return;
    }

    // 획득 위치 정보만 있음
    if (locationStatus && !destinationDeliveryType) {
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

    // 배송지 주소 검색 후 배송 가능한 배송지 타입
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
    // 배송지 검색 페이지에서 배송 방법 변경 버튼
    if (userDeliveryType) {
      setUserSelectDeliveryType(userDeliveryType);
    }
  };

  const getMainDestinationByDeliveryType = async () => {
    if (!userSelectDeliveryType || userTempDestination) {
      return;
    }

    const isSpot = userSelectDeliveryType === 'spot';

    // 최근 이력에서 고른 경우
    const params = {
      delivery: userSelectDeliveryType.toUpperCase(),
    };

    try {
      const { data } = await getMainDestinationsApi(params);
      if (data.code === 200) {
        setTempDestination({ ...data.data, id: isSpot ? data.data.spotPickup?.id! : data.data.id! });
        setIsMaindestination(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkTimerShow = () => {
    // 배송 방법 선택과 관련 없이 현재 시간이 배송 마감 30분 전 이면 show

    const isNotTimer = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

    if (!isNotTimer) {
      if (['스팟점심타이머', '스팟저녁타이머'].includes(deliveryType)) {
        setTimerDeliveryType('스팟배송');
      } else {
        setTimerDeliveryType(deliveryType);
      }
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  };

  const settingHandler = () => {
    if (userDeliveryType === 'spot') {
      if (tempDestination?.spotPickup?.type === 'PRIVATE') {
        return !noticeChecked;
      }
    } else {
      return !tempDestination;
    }
  };

  useEffect(() => {
    // 배송지 검색한 배송지가 있다면 임시 주소로 저장
    if (userTempDestination) {
      setTempDestination(userTempDestination);
      setIsMaindestination(false);
      // 최근 주문 이력이 있는지
    } else if (!userTempDestination && recentOrderDelivery) {
      setUserSelectDeliveryType(recentOrderDelivery.delivery.toLowerCase());
      setIsMaindestination(true);
    }
  }, [userTempDestination, recentOrderDelivery]);

  useEffect(() => {
    // 배송방법 선택 시 기본 배송지 api 조회
    getMainDestinationByDeliveryType();
  }, [userSelectDeliveryType]);

  useEffect(() => {
    checkTimerShow();

    // 초기 배송방법 선택된 경우 체크
    userSelectDeliveryTypeHelper();

    // 유저가 선택한 배송방법에 따라 툴팁 렌더
    checkTooltipMsgByDeliveryType();
  }, []);

  useEffect(() => {
    // 구독하기로 들어왔을 떄 스팟 정기구독이면 배송방법 스팟배송체크 / 새벽&택배 정기구독이면 배송방법 새벽배송체크
    if (isSubscription) {
      deliveryInfo === 'spot' && setUserSelectDeliveryType('spot');
      deliveryInfo === 'parcel' && setUserSelectDeliveryType('parcel');
    }
  }, [deliveryInfo, isSubscription]);

  const isSpotPickupPlace = userSelectDeliveryType === 'spot';

  return (
    <Container>
      <Wrapper>
        <TextH3B padding="24px 0">배송방법</TextH3B>
        <DeliveryMethodWrapper>
          {deliveryInfo !== 'parcel' && (
            <>
              <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
                픽업
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

                          {!isSubscription && deliveryTypeWithTooltip === item.value && tooltipRender()}
                          {!isSubscription && isTimerTooltip && item.name === timerDevlieryType && (
                            <CheckTimerByDelivery />
                          )}
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
          {!isSubscription && <BorderLine height={1} margin="24px 0" />}
          {deliveryInfo !== 'spot' && (
            <>
              <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
                배송
              </TextH5B>
              {DELIVERY_METHOD['delivery'].map((item: any, index: number) => {
                // 구독하기로 들어오면 퀵배송은 제외하고 출력
                if (isSubscription && item.name === '퀵배송') return;

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
                          {!isSubscription && deliveryTypeWithTooltip === item.value && tooltipRender()}
                          {!isSubscription && isTimerTooltip && item.name === timerDevlieryType && (
                            <CheckTimerByDelivery />
                          )}
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
        {userSelectDeliveryType && (
          <>
            <BorderLine height={8} margin="32px 0" />
            <FlexBetween>
              <TextH3B padding="0 0 14px 0">{isSpotPickupPlace ? '픽업장소' : '배송지'}</TextH3B>
              {tempDestination && (
                <TextH6B textDecoration="underline" color={theme.greyScale65} onClick={goToFindAddress} pointer>
                  변경하기
                </TextH6B>
              )}
            </FlexBetween>
            {tempDestination ? placeInfoRender() : ''}
            {(!userSelectDeliveryType || !tempDestination) && (
              <BtnWrapper onClick={goToFindAddress}>
                <Button backgroundColor={theme.white} color={theme.black} border>
                  {isSpotPickupPlace ? '프코스팟 검색하기' : '배송지 검색하기'}
                </Button>
              </BtnWrapper>
            )}
          </>
        )}
      </Wrapper>
      <SettingBtnWrapper onClick={finishDeliverySetting}>
        <Button borderRadius="0" disabled={settingHandler()}>
          설정하기
        </Button>
      </SettingBtnWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 60px;
`;
const Wrapper = styled.div`
  width: 100%;
  ${homePadding}
  padding-bottom: 32px;
`;
const DeliveryMethodWrapper = styled.div`
  width: 100%;
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
`;

export default DeliverInfoPage;
