import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TextH3B, TextH5B, TextH6B, TextB3R } from '@components/Shared/Text';
import { Button, RadioButton } from '@components/Shared/Button';
import Tag from '@components/Shared/Tag';
import { FlexBetween, homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AFTER_SETTING_DELIVERY } from '@store/cart';
import {
  SET_USER_DESTINATION_STATUS,
  SET_DESTINATION,
  INIT_TEMP_DESTINATION,
  INIT_DESTINATION_STATUS,
  INIT_USER_DESTINATION_STATUS,
} from '@store/destination';
import { destinationForm } from '@store/destination';
import { destinationRegister } from '@api/destination';
import { getMainDestinations, availabilityDestination } from '@api/destination';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import { orderForm, SET_TIMER_STATUS } from '@store/order';
import checkIsValidTimer from '@utils/checkIsValidTimer';
import { DELIVERY_METHOD } from '@constants/delivery-info';
import { ITempDestination } from '@store/destination';
import { PickupPlaceBox, DeliveryPlaceBox } from '@components/Pages/Cart';
import { setAlert } from '@store/alert';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip/Tooltip'), {
  ssr: false,
});

/* TODO: map 리팩토링 */
/* TODO: 스팟 배송일 경우 추가 */
/* TODO: 최근 주문 나오면 userDestination와 싱크 */
/* TODO: 내 위치 검색 / 배송지 검색 -> 두 경우 available 체킹 리팩토링 */
/* TODO: 가끔씩 첫 렌더에서 500 에러 왜? */

const recentOrder = '';

const DeliverInfoPage = () => {
  const [deliveryTypeWithTooltip, setDeliveryTypeWithTooltip] =
    useState<string>('');
  const [userSelectDeliveryType, setUserSelectDeliveryType] =
    useState<string>('');
  const [timerDevlieryType, setTimerDeliveryType] = useState<string>('');
  const [tempDestination, setTempDestination] =
    useState<ITempDestination | null>();

  const {
    destinationStatus,
    userTempDestination,
    locationStatus,
    userDestinationStatus,
  } = useSelector(destinationForm);

  const dispatch = useDispatch();

  const isSpotPickupPlace = userSelectDeliveryType === 'spot';
  const { isTimerTooltip } = useSelector(orderForm);

  // 배송 마감 타이머 체크 + 위치 체크
  let deliveryType = checkIsValidTimer(checkTimerLimitHelper());

  const checkTermHandler = () => {};

  const goToFindAddress = () => {
    if (userSelectDeliveryType === 'spot') {
      router.push('/spot/search');
    } else {
      dispatch(SET_USER_DESTINATION_STATUS(userSelectDeliveryType));
      router.push('/destination/search');
    }
  };

  const changeDeliveryTypeHandler = (value: string) => {
    // 배송 방법 변경시 검색한 배송지가 있으면 초기화 배송지 정보 초기화
    // 툴팁이 존재하는 배송방법 선택 시 툴팁 초기화
    console.log(value, deliveryTypeWithTooltip);
    if (tempDestination && destinationStatus) {
      dispatch(
        setAlert({
          alertMessage:
            '설정하신 주소는 저장되지 않습니다. 배송방법을 변경하시겠어요?',
          onSubmit: () => {
            setUserSelectDeliveryType(value);
            setTempDestination(null);
            setDeliveryTypeWithTooltip('');
            dispatch(INIT_TEMP_DESTINATION());
            dispatch(INIT_DESTINATION_STATUS());
            dispatch(INIT_USER_DESTINATION_STATUS());
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
    if (!tempDestination) {
      return;
    }

    const reqBody = {
      addressDetail: tempDestination.location.addressDetail,
      name: tempDestination.name,
      address: tempDestination.location.address,
      delivery: userSelectDeliveryType
        ? userSelectDeliveryType.toUpperCase()
        : userDestinationStatus.toUpperCase(),
      deliveryMessage: tempDestination.deliveryMessage
        ? tempDestination.deliveryMessage
        : '',
      dong: tempDestination.location.dong,
      main: tempDestination.main,
      receiverName: tempDestination.receiverName
        ? tempDestination.receiverName
        : '테스트',
      receiverTel: tempDestination.receiverTel
        ? tempDestination.receiverTel
        : '01012341234',
      zipCode: tempDestination.location.zipCode,
    };
    try {
      const { data } = await destinationRegister(reqBody);
      if (data.code === 200) {
        dispatch(SET_DESTINATION(reqBody));
        dispatch(SET_AFTER_SETTING_DELIVERY());
        dispatch(SET_USER_DESTINATION_STATUS(userSelectDeliveryType));
        dispatch(INIT_TEMP_DESTINATION());
        dispatch(INIT_DESTINATION_STATUS());
        router.push('/cart');
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const placeInfoRender = () => {
    switch (userDestinationStatus) {
      case 'spot': {
        return <PickupPlaceBox place={tempDestination} />;
      }

      default: {
        return <DeliveryPlaceBox place={tempDestination} />;
      }
    }
  };

  const tooltipRender = () => {
    switch (deliveryTypeWithTooltip) {
      case 'morning': {
        return (
          <Tooltip message="새벽배송이 가능해요!" top="25px" width="150px" />
        );
      }
      case 'parcel': {
        return (
          <Tooltip message="택배배송만 가능해요!" top="25px" width="150px" />
        );
      }
      case 'spot': {
        return (
          <Tooltip
            message="무료 스팟배송이 가능해요!"
            top="25px"
            width="170px"
          />
        );
      }
    }
  };

  const checkTooltipMsgByDeliveryType = () => {
    // quick === spot

    const noQuick = destinationStatus === 'morning';
    const canEverything = destinationStatus === 'spot';
    const canParcel = destinationStatus === 'parcel';

    const locationNoQuick = locationStatus === 'morning';
    const locationCanEverything = locationStatus === 'spot';
    const locationCanParcel = locationStatus === 'parcel';

    if (!userDestinationStatus) {
      console.log(userDestinationStatus, 'userDestinationStatus 없음');
    }

    // 획득 위치 정보만 있음
    if (locationStatus && !destinationStatus && !tempDestination) {
      switch (true) {
        case locationCanEverything:
          {
            setDeliveryTypeWithTooltip('spot');
          }
          break;
        case locationNoQuick:
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
    switch (userDestinationStatus) {
      // morning && parcel && !quick
      case 'morning':
        {
          if (canParcel) {
            setDeliveryTypeWithTooltip('parcel');
          }
        }
        break;
      case 'parcel':
        {
          if (canEverything || noQuick) {
            setDeliveryTypeWithTooltip('morning');
          }
        }
        break;
      // morning && quick && parcel
      case 'quick':
        {
          if (canEverything) {
            setDeliveryTypeWithTooltip('morning');
          } else if (noQuick) {
            setDeliveryTypeWithTooltip('morning');
          } else if (canParcel) {
            setDeliveryTypeWithTooltip('parcel');
          }
        }
        break;
    }
  };

  const userSelectDeliveryTypeHelper = () => {
    // 최근 주문 이력이 있는지
    if (recentOrder && !userDestinationStatus) {
      setUserSelectDeliveryType(recentOrder);
    }

    // 배송지 검색 후 배송방법 변하는 예외 케이스
    if (userDestinationStatus) {
      const userMorningButParcel =
        userDestinationStatus === 'morning' && destinationStatus === 'parcel';

      const userQuickButMorning =
        userDestinationStatus === 'quick' && destinationStatus === 'morning';

      const userQuickButParcel =
        userDestinationStatus === 'quick' && destinationStatus === 'parcel';

      switch (true) {
        case userMorningButParcel:
          {
            setUserSelectDeliveryType('parcel');
          }
          break;

        case userQuickButMorning:
          {
            setUserSelectDeliveryType('morning');
          }
          break;

        case userQuickButParcel:
          {
            setUserSelectDeliveryType('parcel');
          }
          break;

        default:
          {
            setUserSelectDeliveryType(userDestinationStatus);
          }
          break;
      }
    }
  };

  const getMainDestinationByDeliveryType = async () => {
    if (!userSelectDeliveryType || userTempDestination) {
      return;
    }

    const params = {
      delivery: userSelectDeliveryType.toUpperCase(),
    };

    try {
      const { data } = await getMainDestinations(params);
      if (data.code === 200) {
        setTempDestination(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkTimerShow = () => {
    // 배송 방법 선택과 관련 없이 현재 시간이 배송 마감 30분 전 이면 show

    const isNotTimer = [
      '스팟저녁',
      '새벽택배',
      '새벽택배N일',
      '스팟점심',
      '스팟점심N일',
    ].includes(deliveryType);

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

  useEffect(() => {
    // 배송지 검색한 배송지가 있다면 임시 주소로 저장
    if (userTempDestination) {
      setTempDestination(userTempDestination);
    }
  }, [userTempDestination]);

  useEffect(() => {
    // 유저가 선택한 배송방법에 따라 툴팁 렌더
    checkTooltipMsgByDeliveryType();
  }, [userDestinationStatus]);

  useEffect(() => {
    // 배송방법 선택 시 기본 배송지 api 조회
    getMainDestinationByDeliveryType();
  }, [userSelectDeliveryType]);

  useEffect(() => {
    checkTimerShow();
    userSelectDeliveryTypeHelper();
  }, []);

  return (
    <Container>
      <Wrapper>
        <TextH3B padding="24px 0">배송방법</TextH3B>
        <DeliveryMethodWrapper>
          <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
            픽업
          </TextH5B>
          {DELIVERY_METHOD['pickup'].map((item: any, index: number) => {
            const isSelected = userSelectDeliveryType === item.value;
            return (
              <MethodGroup key={index}>
                <RowWrapper>
                  <RadioWrapper>
                    <RadioButton
                      isSelected={isSelected}
                      onChange={() => changeDeliveryTypeHandler(item.value)}
                    />
                  </RadioWrapper>
                  <Content>
                    <FlexBetween margin="0 0 8px 0">
                      <RowLeft>
                        <TextH5B margin="0 4px 0px 8px">{item.name}</TextH5B>
                        {item.tag && (
                          <Tag
                            backgroundColor={theme.greyScale6}
                            color={theme.greyScale45}
                          >
                            {item.tag}
                          </Tag>
                        )}
                      </RowLeft>
                      {deliveryTypeWithTooltip === item.value &&
                        tooltipRender()}
                      {isTimerTooltip && item.name === timerDevlieryType && (
                        <CheckTimerByDelivery />
                      )}
                    </FlexBetween>
                    <Body>
                      <TextB3R color={theme.greyScale45}>
                        {item.description}
                      </TextB3R>
                      <TextH6B color={theme.greyScale45}>
                        {item.feeInfo}
                      </TextH6B>
                    </Body>
                  </Content>
                </RowWrapper>
              </MethodGroup>
            );
          })}
          <BorderLine height={1} margin="24px 0" />
          <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
            배송
          </TextH5B>
          {DELIVERY_METHOD['delivery'].map((item: any, index: number) => {
            const isSelected = userSelectDeliveryType === item.value;
            return (
              <MethodGroup key={index}>
                <RowWrapper>
                  <RadioWrapper>
                    <RadioButton
                      isSelected={isSelected}
                      onChange={() => changeDeliveryTypeHandler(item.value)}
                    />
                  </RadioWrapper>
                  <Content>
                    <FlexBetween margin="0 0 8px 0">
                      <RowLeft>
                        <TextH5B margin="0 4px 0 8px">{item.name}</TextH5B>
                        {item.tag && (
                          <Tag
                            backgroundColor={theme.greyScale6}
                            color={theme.greyScale45}
                          >
                            {item.tag}
                          </Tag>
                        )}
                      </RowLeft>
                      {deliveryTypeWithTooltip === item.value &&
                        tooltipRender()}
                      {isTimerTooltip && item.name === timerDevlieryType && (
                        <CheckTimerByDelivery />
                      )}
                    </FlexBetween>
                    <Body>
                      <TextB3R color={theme.greyScale45}>
                        {item.description}
                      </TextB3R>
                      <TextH6B color={theme.greyScale45}>
                        {item.feeInfo}
                      </TextH6B>
                    </Body>
                  </Content>
                </RowWrapper>
              </MethodGroup>
            );
          })}
        </DeliveryMethodWrapper>
        {userSelectDeliveryType && (
          <>
            <BorderLine height={8} margin="32px 0" />
            <FlexBetween>
              <TextH3B padding="0 0 14px 0">
                {isSpotPickupPlace ? '픽업장소' : '배송지'}
              </TextH3B>
              {tempDestination && (
                <TextH6B
                  textDecoration="underline"
                  color={theme.greyScale65}
                  onClick={goToFindAddress}
                >
                  변경하기
                </TextH6B>
              )}
            </FlexBetween>
            {tempDestination ? placeInfoRender() : ''}
            {(!userSelectDeliveryType || !tempDestination) && (
              <BtnWrapper onClick={goToFindAddress}>
                <Button
                  backgroundColor={theme.white}
                  color={theme.black}
                  border
                >
                  {isSpotPickupPlace ? '픽업지 검색하기' : '배송지 검색하기'}
                </Button>
              </BtnWrapper>
            )}
          </>
        )}
      </Wrapper>
      <SettingBtnWrapper onClick={finishDeliverySetting}>
        <Button borderRadius="0" disabled={!tempDestination}>
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
