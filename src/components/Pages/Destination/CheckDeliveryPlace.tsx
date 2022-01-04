import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH2B } from '@components/Shared/Text';
import { theme, FlexRow } from '@styles/theme';
import { availabilityDestination } from '@api/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';
import { useSelector, useDispatch } from 'react-redux';
import { commonSelector, SET_IS_LOADING } from '@store/common';

/* TODO: spot 추가 되어야 함 */

const CheckDeliveryPlace = () => {
  const [deliveryStatus, setDeliveryStatus] = useState('');

  const { isLoading } = useSelector(commonSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAvailablePlace();
  }, []);

  const checkAvailablePlace = async () => {
    dispatch(SET_IS_LOADING(true));
    const userLocation =
      JSON.parse(sessionStorage.getItem('loc') ?? '{}') ?? {};
    const params = {
      jibunAddress: userLocation.jibunAddr,
      roadAddress: userLocation.roadAddr,
      zipCode: userLocation.zipNo,
      delivery: null,
    };
    try {
      const { data } = await availabilityDestination(params);
      if (data.code === 200) {
        const { morning, parcel, quick } = data.data;
        const deliveryStatusObj = {
          morning,
          parcel,
          quick,
        };
        sessionStorage.setItem(
          'availabilityDestination',
          JSON.stringify({ ...deliveryStatusObj })
        );

        setDeliveryStatus(
          checkDestinationHelper({
            ...deliveryStatusObj,
          })
        );

        dispatch(SET_IS_LOADING(false));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userPlaceInfoRender = (status?: string) => {
    switch (status) {
      case 'quick': {
        return (
          <>
            <FlexRow>
              <TextH2B>주변에</TextH2B>
              <TextH2B color={theme.brandColor} padding="0 0 0 4px">
                프코스팟
              </TextH2B>
              <TextH2B>이 있습니다.</TextH2B>
            </FlexRow>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              점심·저녁 원하는 시간에 픽업 가능!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              서울 내 등록된 프코스팟에서 배송비 무료로 이용 가능해요
            </TextB3R>
          </>
        );
      }
      case 'parcel': {
        return (
          <>
            <FlexRow>
              <TextH2B color={theme.brandColor}>택배배송</TextH2B>
              <TextH2B padding="0 4px 0 0">만</TextH2B>
              <TextH2B>가능한 지역입니다.</TextH2B>
            </FlexRow>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              오후 5시까지 주문 시 당일 발송!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              전국 어디서나 이용할 수 있어요. (제주, 도서 산간지역 제외)
            </TextB3R>
          </>
        );
      }
      case 'noDelivery': {
        return (
          <>
            <FlexRow>
              <TextH2B color={theme.brandColor} padding="0 4px 0 0">
                배송불가
              </TextH2B>
              <TextH2B>지역입니다.</TextH2B>
            </FlexRow>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              신선식품의 특성상 일부지역의 배송이 불가해요!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              (섬/공단지역/학교/학교 기숙사/병원/군부대/시장/백화점 등)
            </TextB3R>
          </>
        );
      }
      case 'morning': {
        <>
          <FlexRow>
            <TextH2B color={theme.brandColor} padding="0 4px 0 0">
              새벽배송
            </TextH2B>
            <TextH2B>지역입니다.</TextH2B>
          </FlexRow>
          <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
            오후 5시까지 주문 시 다음날 새벽에 도착!
          </TextB3R>
          <TextB3R color={theme.greyScale65}>
            서울 전체, 경기/인천 일부 지역 이용 가능해요
          </TextB3R>
        </>;
      }
      default:
        return;
    }
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <PlaceInfo>{userPlaceInfoRender(deliveryStatus)}</PlaceInfo>
    </Container>
  );
};

const Container = styled.div``;

const PlaceInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export default React.memo(CheckDeliveryPlace);
