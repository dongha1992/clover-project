import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextB3R, TextH2B } from '@components/Shared/Text';
import { theme, FlexRow } from '@styles/theme';
import { availabilityDestination } from '@api/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';
import { useSelector, useDispatch } from 'react-redux';
import { commonSelector, SET_IS_LOADING } from '@store/common';
import {
  destinationForm,
  SET_AVAILABLE_DESTINATION,
  SET_LOCATION_STATUS,
} from '@store/destination';
import { useRouter } from 'next/router';
import {
  MorningInfo,
  ParcelInfo,
  CanNotDeliveryInfo,
  SpotInfo,
} from '@components/Pages/Destination';
/* TODO: spot 추가 되어야 함 */

const CheckDestinationPlacce = () => {
  const [formatAvailableDestination, setFormatAvailableDestination] =
    useState('');

  const { isLoading } = useSelector(commonSelector);
  const { tempLocation, userDestinationStatus } = useSelector(destinationForm);

  const dispatch = useDispatch();
  const router = useRouter();
  const { isLocation } = router.query;

  const checkAvailablePlace = async () => {
    dispatch(SET_IS_LOADING(true));

    const params = {
      jibunAddress: tempLocation.jibunAddr,
      roadAddress: tempLocation.roadAddr,
      zipCode: tempLocation.zipNo,
      delivery: null,
    };
    try {
      const { data } = await availabilityDestination(params);
      if (data.code === 200) {
        const { morning, parcel, quick } = data.data;
        const availableDestinationObj = {
          morning,
          parcel,
          quick,
        };

        const status = checkDestinationHelper({
          ...availableDestinationObj,
        });

        if (isLocation) {
          dispatch(SET_LOCATION_STATUS(status));
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        } else {
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        }

        setFormatAvailableDestination(status);
        dispatch(SET_IS_LOADING(false));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userPlaceInfoRender = (status?: string) => {
    const noQuick = status === 'morning';
    const canEverything = status === 'spot';
    const canParcel = status === 'parcel';
    const canNotDelivery = status === 'noDelivery';

    if (isLocation) {
      // 홈 위치 검색
      switch (status) {
        case 'spot': {
          return <SpotInfo />;
        }
        case 'parcel': {
          return <ParcelInfo />;
        }
        case 'noDelivery': {
          return <CanNotDeliveryInfo />;
        }
        case 'morning': {
          return <MorningInfo />;
        }
        default:
          return;
      }
    } else {
      if (canNotDelivery) {
        return <CanNotDeliveryInfo />;
      }
      // 배송정보 배송지 검색
      switch (userDestinationStatus || location) {
        // 유저가 선택한 배송방법과 배송 가능 지역따라 분기
        case 'morning': {
          if (canEverything || noQuick) {
            return <MorningInfo />;
          } else if (canParcel) {
            <ParcelInfo />;
          }
        }
        case 'quick': {
          if (canEverything) {
            return (
              <>
                <FlexRow>
                  <TextH2B color={theme.brandColor} padding="0 4px 0 0">
                    퀵/새벽배송
                  </TextH2B>
                  <TextH2B>지역입니다.</TextH2B>
                </FlexRow>
                <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
                  오후 5시까지 주문 시 다음날 새벽에 도착!
                </TextB3R>
                <TextB3R color={theme.greyScale65}>
                  서울 전체, 경기/인천 일부 지역 이용 가능해요
                </TextB3R>
              </>
            );
          } else if (noQuick) {
            return <MorningInfo />;
          } else if (canParcel) {
            return <ParcelInfo />;
          }
        }
        case 'parcel': {
          if (canEverything || noQuick) {
            return (
              <>
                <FlexRow>
                  <TextH2B color={theme.brandColor} padding="0 4px 0 0">
                    새벽/택배배송이 가능한
                  </TextH2B>
                  <TextH2B>지역입니다.</TextH2B>
                </FlexRow>
                <TextB3R color={theme.greyScale65} padding="16px 0 0 0">
                  오후 5시까지 주문 시 다음날 새벽에 도착!
                </TextB3R>
                <TextB3R color={theme.greyScale65}>
                  서울 전체, 경기/인천 일부 지역 이용 가능해요
                </TextB3R>
              </>
            );
          } else if (canParcel) {
            return <ParcelInfo />;
          }
        }
        default:
          return;
      }
    }
  };

  useEffect(() => {
    checkAvailablePlace();
  }, []);

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <PlaceInfo>{userPlaceInfoRender(formatAvailableDestination)}</PlaceInfo>
    </Container>
  );
};

const Container = styled.div``;

const PlaceInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export default React.memo(CheckDestinationPlacce);
