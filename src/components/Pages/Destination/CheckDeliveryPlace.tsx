import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TextB3R } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { availabilityDestination } from '@api/destination';

const CheckDeliveryPlace = () => {
  // const { tempDestination } = useSelector(destinationForm);

  useEffect(() => {
    checkAvailablePlace();
  }, []);

  const checkAvailablePlace = async () => {
    const userLocation = JSON.parse(localStorage.getItem('loc') ?? '{}') ?? {};
    const params = {
      jibunAddress: userLocation.jibunAddr,
      roadAddress: userLocation.roadAddr,
      zipCode: userLocation.zipNo,
      delivery: null,
    };
    try {
      const { data } = await availabilityDestination(params);
      const { morning, parcel, quick } = data.data;
      sessionStorage.setItem(
        'availabilityDestination',
        JSON.stringify({ morning, parcel, quick })
      );
      console.log(sessionStorage.getItem('availabilityDestination'));
    } catch (error) {
      console.error(error);
    }
  };

  const UserPlaceInfoRender = (status?: string) => {
    switch (status) {
      case '1': {
        return (
          <>
            <span className="brandColor">
              새벽배송
              <span className="h2B"> 지역입니다.</span>
            </span>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              오후 5시까지 주문 시 다음날 새벽에 도착!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              서울 전체, 경기/인천 일부 지역 이용 가능해요
            </TextB3R>
          </>
        );
      }
      case '2': {
        return (
          <>
            <span className="brandColor">
              새벽배송
              <span className="h2B"> 지역입니다.</span>
            </span>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              오후 5시까지 주문 시 다음날 새벽에 도착!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              서울 전체, 경기/인천 일부 지역 이용 가능해요
            </TextB3R>
          </>
        );
      }
      case '3': {
        return (
          <>
            <span className="brandColor">
              새벽배송
              <span className="h2B"> 지역입니다.</span>
            </span>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              오후 5시까지 주문 시 다음날 새벽에 도착!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              서울 전체, 경기/인천 일부 지역 이용 가능해요
            </TextB3R>
          </>
        );
      }
      default:
        return (
          <>
            <span className="brandColor">
              새벽배송
              <span className="h2B"> 지역입니다.</span>
            </span>
            <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
              오후 5시까지 주문 시 다음날 새벽에 도착!
            </TextB3R>
            <TextB3R color={theme.greyScale65}>
              서울 전체, 경기/인천 일부 지역 이용 가능해요
            </TextB3R>
          </>
        );
    }
  };

  return (
    <Container>
      <PlaceInfo>{UserPlaceInfoRender()}</PlaceInfo>
    </Container>
  );
};

const Container = styled.div``;

const PlaceInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;

  .brandColor {
    color: ${theme.brandColor};
    font-size: 20px;
    letter-spacing: -0.4px;
    font-weight: bold;
    line-height: 30px;

    .h2B {
      color: ${theme.black};
    }
  }
`;

export default React.memo(CheckDeliveryPlace);
