import { AxiosError } from 'axios';
import React from 'react';
import styled from 'styled-components';
import { getAvailabilityDestinationApi } from '@api/destination';
import { checkDestinationHelper } from '@utils/destination';
import { useSelector, useDispatch } from 'react-redux';
import {
  destinationForm,
  SET_AVAILABLE_DESTINATION,
  SET_LOCATION_STATUS,
  SET_CAN_NOT_DELIVERY,
} from '@store/destination';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { TLocationType } from '@utils/destination/checkDestinationHelper';
import {
  CanNotDeliveryInfo,
  SpotInfo,
  ParcelInfo,
  MorningInfo,
  ParcelAndQuickInfo,
  QuickAndMorningInfo,
  MorningAndPacelInfo,
} from '@components/Pages/Destination';
import isNil from 'lodash-es/isNil';
import { show, hide } from '@store/loading';
import { SET_ALERT } from '@store/alert';

interface IObj {
  morning?: boolean;
  parcel?: boolean;
  quick?: boolean;
  spot?: boolean;
}
interface IResponse {
  status: TLocationType;
  availableDestinationObj: IObj;
}

const CheckDestinationPlace = () => {
  const { tempLocation } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLocation, isSpot, deliveryType, subsDeliveryType } = router.query;

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery(
    'getAvailabilityDestination',
    async () => {
      dispatch(show());
      const params = {
        jibunAddress: tempLocation.jibunAddr,
        roadAddress: tempLocation.roadAddr,
        zipCode: tempLocation.zipNo,
        delivery: null,
      };
      const { data } = await getAvailabilityDestinationApi(params);

      if (data.code === 200) {
        const { morning, parcel, quick, spot } = data.data;
        const availableDestinationObj: IObj = {
          morning,
          parcel,
          quick,
          spot,
        };

        const status = checkDestinationHelper({
          ...availableDestinationObj,
        });

        return { status, availableDestinationObj };
      }
    },
    {
      onSuccess: async ({ status, availableDestinationObj }: IResponse) => {
        const isCanNotDelivery = Object.values(availableDestinationObj)?.every((delivery) => !delivery);

        if (isCanNotDelivery) {
          dispatch(SET_CAN_NOT_DELIVERY(true));
          return;
        }

        if (isLocation) {
          dispatch(SET_LOCATION_STATUS(status));
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        } else {
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        }

        dispatch(SET_CAN_NOT_DELIVERY(false));
      },
      onError: (error: AxiosError) => {
        dispatch(SET_ALERT({ alertMessage: error.message }));
      },
      onSettled: () => {
        dispatch(hide());
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  const userPlaceInfoRender = ({ status, availableDestinationObj }: IResponse) => {
    const canMorning = status === 'morning';
    const canEverything = status === 'spot';
    const canParcel = status === 'parcel';
    const canNotDelivery = status === 'noDelivery';

    if (isLocation || isSpot) {
      // 홈 위치 검색
      switch (status) {
        case 'spot': {
          return <SpotInfo />;
        }
        case 'parcel': {
          return <ParcelInfo />;
        }
        case 'morning': {
          return <MorningInfo />;
        }
        case 'noDelivery': {
          return <CanNotDeliveryInfo />;
        }

        default:
          return;
      }
    } else {
      if (canNotDelivery) {
        return <CanNotDeliveryInfo />;
      }
      const { quick, parcel, morning, spot } = availableDestinationObj;

      // 예외 케이스
      /* TODO: checkDestinationHelper의 예외케이스인데 정리 필요 */

      const noQuickButCanParcel = !morning && !quick && parcel;
      const canQuickAndParcel = !morning && quick && parcel;
      const noParcelButCanMorning = !parcel && morning;
      const canParcelAndCanMorning = morning && parcel;
      const noQuickButCanMorning = !quick && morning;
      const canQuickAndMorning = quick && morning;

      // 배송정보 배송지 검색
      switch (deliveryType ?? subsDeliveryType) {
        // 유저가 선택한 배송방법과 배송 가능 지역따라 분기
        case 'MORNING': {
          if (canEverything || canMorning) {
            return <MorningInfo />;
          } else if (canParcel) {
            return <ParcelInfo />;
          }
        }
        case 'PARCEL': {
          if ((canEverything && parcel) || canParcelAndCanMorning) {
            return <MorningAndPacelInfo />;
          } else if (canParcel) {
            return <ParcelInfo />;
          } else if (noParcelButCanMorning) {
            return <MorningInfo />;
          }
        }
        case 'QUICK': {
          if (canQuickAndMorning) {
            return <QuickAndMorningInfo />;
          } else if (noQuickButCanMorning) {
            return <MorningInfo />;
          } else if (noQuickButCanParcel) {
            return <ParcelInfo />;
          } else if (canQuickAndParcel) {
            return <ParcelAndQuickInfo />;
          }
        }
        default:
          return;
      }
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  if (isNil(result)) {
    dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다' }));
  }

  return (
    <Container>
      <PlaceInfo>{userPlaceInfoRender(result!)}</PlaceInfo>
    </Container>
  );
};

const Container = styled.div``;

const PlaceInfo = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export default React.memo(CheckDestinationPlace);
