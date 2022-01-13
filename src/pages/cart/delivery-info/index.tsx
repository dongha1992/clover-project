import React, { useState, useCallback, useEffect, ReactElement } from 'react';
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
} from '@store/destination';
import { destinationForm } from '@store/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';
import { destinationRegister } from '@api/destination';

const Tooltip = dynamic(() => import('@components/Shared/Tooltip/Tooltip'), {
  ssr: false,
});

interface IDeliveryMethod {
  id: number;
  value: string;
  name: string;
  tag: string;
  description: string;
  feeInfo: string;
}

/* TODO: map 리팩토링 */
/* TODO: 배송지/픽업지 분기 코드 엉망 리팩토링 */
/* TODO: 타이머 기능 */
/* TODO: 최근 배송지 나오면 userDestination와 싱크 */
/* TODO: 스팟 배송일 경우,  */

const DELIVERY_METHOD: any = {
  pickup: [
    {
      id: 1,
      value: 'spot',
      name: '스팟배송',
      tag: '무료배송',
      description: '- 수도권 내 오픈된 프코스팟으로 픽업 가능',
      feeInfo: '- 언제나 배송비 무료ㅣ점심 · 저녁픽업',
    },
  ],
  delivery: [
    {
      id: 2,
      value: 'morning',
      name: '새벽배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 3,
      value: 'parcel',
      name: '택배배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
    {
      id: 4,
      value: 'quick',
      name: '퀵배송',
      tag: '',
      description: '- 서울 전체, 경기/인천 일부 지역 이용 가능',
      feeInfo: '- 배송비 3,500원 (3만 5천 원 이상 배송비 무료)',
    },
  ],
};

const recentDestination = false;

const DeliverInfoPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const {
    userLocation,
    availableDestination,
    destinationStatus,
    userDestination,
  } = useSelector(destinationForm);

  const isSpotPickupPlace = selectedMethod === 'spot';

  const hasUserLocation =
    Object.values(userLocation).filter((val) => val).length > 0;

  let destinationType = checkDestinationHelper(availableDestination);

  const hasUserSelectDestination =
    Object.values(userDestination).filter((item) => item).length > 0;

  const dispatch = useDispatch();

  useEffect(() => {
    // 내 위치 검색 안 함 && 배송지 검색으로 배송지 체킹
    // 내 위치 검색 함 && 내 위치 찾기에서 배송지 체킹
    if (
      (!hasUserLocation && destinationStatus) ||
      (hasUserLocation && destinationType)
    ) {
      setSelectedMethod(destinationStatus || destinationType);
    }
  }, []);

  const checkTermHandler = () => {};

  const goToFindAddress = () => {
    if (selectedMethod === 'spot') {
      router.push('/spot/search');
    } else {
      router.push('/destination/search');
    }
  };

  const changeMethodHandler = useCallback(
    (value: string) => {
      setSelectedMethod(value);
    },
    [selectedMethod]
  );

  const finishDeliverySetting = async () => {
    if (!hasUserSelectDestination) {
      return;
    }

    const reqBody = {
      addressDetail: userDestination.addressDetail,
      name: userDestination.name,
      address: userDestination.address,
      delivery: selectedMethod.toUpperCase(),
      deliveryMessage: userDestination.deliveryMessage
        ? userDestination.deliveryMessage
        : '',
      dong: userDestination.dong,
      main: userDestination.main,
      receiverName: userDestination.receiverName
        ? userDestination.receiverName
        : '테스트',
      receiverTel: userDestination.receiverTel
        ? userDestination.receiverTel
        : '01012341234',
      zipCode: userDestination.zipCode,
    };

    try {
      const { data } = await destinationRegister(reqBody);
      if (data.code === 200) {
        dispatch(SET_DESTINATION(reqBody));
        dispatch(SET_USER_DESTINATION_STATUS(selectedMethod));
        dispatch(SET_AFTER_SETTING_DELIVERY());
        router.push('/cart');
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const placeInfoRender = () => {
    switch (selectedMethod) {
      case 'spot': {
        return <PickupPlaceBox place={userDestination} />;
      }

      default: {
        return <DeliveryPlaceBox place={userDestination} />;
      }
    }
  };

  const tooltipRender = () => {
    const userSelectParcel = destinationType === 'parcel';
    const userSelectNoQuick = destinationType === 'noQuick';
    const userSelectNothing = destinationType === 'noDelivery';

    if (userSelectNothing) {
      return;
    }

    switch (selectedMethod) {
      case 'morning': {
        if (userSelectParcel) {
          setSelectedMethod('parcel');
          return (
            <Tooltip
              message="택배배송만 가능한 지역입니다."
              top="25px"
              width="190px"
            />
          );
        } else {
          return (
            <Tooltip message="새벽배송 지역입니다." top="25px" width="150px" />
          );
        }
      }
      case 'parcel': {
        if (userSelectParcel) {
          return (
            <Tooltip
              message="택배배송만 가능한 지역입니다."
              top="25px"
              width="190px"
            />
          );
        } else {
          return (
            <Tooltip
              message="새벽/택배배송이 가능한 지역입니다."
              top="25px"
              width="210px"
            />
          );
        }
      }
      case 'quick': {
        if (userSelectParcel) {
          setSelectedMethod('parcel');
          return (
            <Tooltip
              message="택배배송만 가능한 지역입니다."
              top="25px"
              width="190px"
            />
          );
        } else if (userSelectNoQuick) {
          setSelectedMethod('morning');
          return (
            <Tooltip message="새벽배송 지역입니다." top="25px" width="160px" />
          );
        } else {
          return (
            <Tooltip
              message="퀵/새벽배송이 가능한 지역입니다."
              top="25px"
              width="200px"
            />
          );
        }
      }
      default: {
        return '';
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <TextH3B padding="24px 0">배송방법</TextH3B>
        <DeliveryMethodWrapper>
          <TextH5B padding="0 0 16px 0" color={theme.greyScale65}>
            픽업
          </TextH5B>
          {DELIVERY_METHOD['pickup'].map((item: any, index: number) => {
            const isSelected = selectedMethod === item.value;
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
                      {index === 0 && (
                        <TextH6B color={theme.brandColor}>
                          점심배송 마감 29:30 전
                        </TextH6B>
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
            const isSelected = selectedMethod === item.value;
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
                      {isSelected && tooltipRender()}
                      {index === 1 && (
                        <TextH6B color={theme.brandColor}>
                          점심배송 마감 29:30 전
                        </TextH6B>
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
        <BorderLine height={8} margin="32px 0" />
        <FlexBetween>
          <TextH3B padding="0 0 14px 0">
            {isSpotPickupPlace ? '픽업장소' : '배송지'}
          </TextH3B>
          {recentDestination ||
            (hasUserSelectDestination && (
              <TextH6B
                textDecoration="underline"
                color={theme.greyScale65}
                onClick={goToFindAddress}
              >
                변경하기
              </TextH6B>
            ))}
        </FlexBetween>
        {recentDestination || hasUserSelectDestination ? placeInfoRender() : ''}
        {!hasUserSelectDestination && (
          <BtnWrapper onClick={goToFindAddress}>
            <Button backgroundColor={theme.white} color={theme.black} border>
              {isSpotPickupPlace ? '픽업지 검색하기' : '배송지 검색하기'}
            </Button>
          </BtnWrapper>
        )}
      </Wrapper>
      <SettingBtnWrapper onClick={finishDeliverySetting}>
        <Button borderRadius="0" disabled={!hasUserSelectDestination}>
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
      <FlexCol padding="0 0 32px 0">
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
  return (
    <FlexCol padding="0 0 32px 0">
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
