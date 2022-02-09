import React, {
  useState,
  useCallback,
  useEffect,
  ReactElement,
  useRef,
} from 'react';
import styled from 'styled-components';
import { TextH3B, TextH5B, TextH6B, TextB3R } from '@components/Shared/Text';
import { Button, RadioButton } from '@components/Shared/Button';
import Tag from '@components/Shared/Tag';
import { FlexBetween, FlexCol, homePadding, theme } from '@styles/theme';
import BorderLine from '@components/Shared/BorderLine';
import Checkbox from '@components/Shared/Checkbox';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AFTER_SETTING_DELIVERY } from '@store/cart';
import {
  SET_USER_DESTINATION_STATUS,
  SET_DESTINATION,
  INIT_DESTINATION,
} from '@store/destination';
import { destinationForm } from '@store/destination';
import { destinationRegister } from '@api/destination';
import { getDestinations, getMainDestinations } from '@api/destination';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import { orderForm, SET_TIMER_STATUS } from '@store/order';
import checkIsValidTimer from '@utils/checkIsValidTimer';
import { DELIVERY_METHOD } from '@constants/delivery-info';
import { IDestinationsResponse } from '@model/index';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip/Tooltip'), {
  ssr: false,
});

/* TODO: map 리팩토링 */
/* TODO: 배송지/픽업지 분기 코드 엉망 리팩토링 */

/* TODO: 스팟 배송일 경우 추가 */

/* TODO: 최근 배송지 나오면 userDestination와 싱크 */
/* TODO: 내 위치 검색 / 배송지 검색 -> 두 경우 available 체킹 리팩토링 */
/* TODO: 가끔씩 첫 렌더에서 500 에러 왜? */

const recentOrder = '';

const DeliverInfoPage = () => {
  const [targetDeliveryType, setTargetDeliveryType] = useState<string>('');
  const [userSelectDeliveryType, setUserSelectDeliveryType] =
    useState<string>('');
  const [timerDevlieryType, setTimerDeliveryType] = useState<string>('');
  const [tempDestination, setTempDestination] =
    useState<IDestinationsResponse>();

  const {
    destinationStatus,
    userTempDestination,
    locationStatus,
    userDestinationStatus,
  } = useSelector(destinationForm);

  const dispatch = useDispatch();

  const isSpotPickupPlace = userSelectDeliveryType === 'spot';
  const { isTimerTooltip } = useSelector(orderForm);

  // const hasUserSelectDestination =
  //   Object.values(userDestination).filter((item) => item).length > 0;

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

  const changeMethodHandler = (value: string) => {
    setUserSelectDeliveryType(value);
    // 배송 방법 변경시 현재 배송지 정보 초기화
    dispatch(INIT_DESTINATION());
  };

  const finishDeliverySetting = async () => {
    if (!tempDestination) {
      return;
    }

    const reqBody = {
      addressDetail: userTempDestination.location.addressDetail,
      name: userTempDestination.name,
      address: userTempDestination.location.address,
      delivery: userDestinationStatus.toUpperCase(),
      deliveryMessage: userTempDestination.deliveryMessage
        ? userTempDestination.deliveryMessage
        : '',
      dong: userTempDestination.location.dong,
      main: userTempDestination.main,
      receiverName: userTempDestination.receiverName
        ? userTempDestination.receiverName
        : '테스트',
      receiverTel: userTempDestination.receiverTel
        ? userTempDestination.receiverTel
        : '01012341234',
      zipCode: userTempDestination.location.zipCode,
    };

    try {
      const { data } = await destinationRegister(reqBody);
      if (data.code === 200) {
        dispatch(SET_DESTINATION(reqBody));
        dispatch(SET_AFTER_SETTING_DELIVERY());
        dispatch(SET_USER_DESTINATION_STATUS(userSelectDeliveryType));
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
    switch (targetDeliveryType) {
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

    // 획득 위치 정보 있고 이전 주문 기록 없음
    if (locationStatus && !userDestinationStatus) {
      switch (true) {
        case locationCanEverything:
          {
            setTargetDeliveryType('spot');
          }

          break;
        case locationNoQuick:
          {
            setTargetDeliveryType('morning');
          }

          break;
        case locationCanParcel:
          {
            setTargetDeliveryType('parcel');
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
            setTargetDeliveryType('parcel');
          }
        }
        break;
      case 'parcel':
        {
          if (canEverything || noQuick) {
            setTargetDeliveryType('morning');
          }
        }
        break;
      // morning && quick && parcel
      case 'quick':
        {
          if (canEverything) {
            setTargetDeliveryType('morning');
          } else if (noQuick) {
            setTargetDeliveryType('morning');
          } else if (canParcel) {
            setTargetDeliveryType('parcel');
          }
        }
        break;
    }
  };

  const userSelectDeliveryTypeHelper = () => {
    // 최근 배송 이력이 있는지
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
    if (!userSelectDeliveryType) {
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
    checkTooltipMsgByDeliveryType();
  }, [userDestinationStatus]);

  useEffect(() => {
    getMainDestinationByDeliveryType();
  }, [userSelectDeliveryType]);

  useEffect(() => {
    userSelectDeliveryTypeHelper();
    checkTimerShow();
  }, []);

  console.log(userTempDestination, 'userTempDestination');

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
                      onChange={() => changeMethodHandler(item.value)}
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
                      {targetDeliveryType === item.value && tooltipRender()}
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
                      onChange={() => changeMethodHandler(item.value)}
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
                      {targetDeliveryType === item.value && tooltipRender()}
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

const PickPlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
`;

const DelvieryPlaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
`;

const PlaceName = styled.div`
  display: flex;
  align-items: center;
`;

const PlaceInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CheckTerm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;

  .h5B {
    padding-top: 2px;
    font-size: 12px;
    letter-spacing: -0.4px;
    line-height: 18px;
    color: ${theme.greyScale65};
    .brandColor {
      color: ${theme.brandColor};
      font-weight: bold;
      padding-right: 4px;
      padding-left: 4px;
    }
  }
`;

const SettingBtnWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const PickupPlaceBox = React.memo(
  ({ place, checkTermHandler, isSelected }: any) => {
    return (
      <FlexCol padding="0 0 0 0">
        <PickPlaceInfo>
          <PlaceName>
            <TextH5B padding="0 4px 0 0">{place.name}</TextH5B>
            <Tag backgroundColor={theme.brandColor5} color={theme.brandColor}>
              {place.spaceType}
            </Tag>
          </PlaceName>
          <TextB3R padding="4px 0" color={theme.greyScale65}>
            {place.address}
          </TextB3R>
          <PlaceInfo>
            <TextH6B padding="0 4px 0 0" color={theme.greyScale65}>
              {place.type}
            </TextH6B>
            <TextB3R color={theme.greyScale65}>{place.availableTime}</TextB3R>
          </PlaceInfo>
        </PickPlaceInfo>
        <CheckTerm>
          <Checkbox isSelected={isSelected} onChange={checkTermHandler} />
          <span className="h5B">
            <span className="brandColor">임직원 전용</span>
            스팟으로, 외부인은 이용이 불가합니다.
          </span>
        </CheckTerm>
      </FlexCol>
    );
  }
);

export const DeliveryPlaceBox = React.memo(({ place }: any): ReactElement => {
  console.log(place, 'place');
  return (
    <FlexCol padding="0 0 0 0">
      <DelvieryPlaceInfo>
        <PlaceName>
          <TextH5B padding="0 4px 0 0">{place.name}</TextH5B>
        </PlaceName>
        <TextB3R padding="4px 0" color={theme.greyScale65}>
          {place.address}
        </TextB3R>
      </DelvieryPlaceInfo>
    </FlexCol>
  );
});

export default DeliverInfoPage;
