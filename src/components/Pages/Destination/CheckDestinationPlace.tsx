import { AxiosError } from 'axios';
import React from 'react';
import styled from 'styled-components';
import { getAvailabilityDestinationApi } from '@api/destination';
import { checkDestinationHelper } from '@utils/destination';
import { useSelector, useDispatch } from 'react-redux';
import { destinationForm, SET_AVAILABLE_DESTINATION, SET_LOCATION_STATUS } from '@store/destination';
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
import { Obj } from '@model/index';

interface IObj {
  morning: boolean;
  parcel: boolean;
  quick: boolean;
  spot: boolean;
}
interface IResponse {
  status: TLocationType;
  availableDestinationObj: IObj;
}

const CheckDestinationPlace = () => {
  const { tempLocation, userDeliveryType } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLocation, isSpot } = router.query;

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery(
    'getAvailabilityDestination',
    async () => {
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
        if (isLocation) {
          dispatch(SET_LOCATION_STATUS(status));
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        } else {
          dispatch(SET_AVAILABLE_DESTINATION({ ...availableDestinationObj }));
        }
      },
      onError: (error: AxiosError) => {
        // TODO : 리액트쿼리 onError에서 error.response란 값 자체가 안옴 확인 필요
        // const { message } = error.response?.data;
        // alert(message);
        // return;
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
      switch (userDeliveryType) {
        // 유저가 선택한 배송방법과 배송 가능 지역따라 분기
        case 'morning': {
          if (canEverything || canMorning) {
            return <MorningInfo />;
          } else if (canParcel) {
            return <ParcelInfo />;
          }
        }
        case 'parcel': {
          if ((canEverything && parcel) || canParcelAndCanMorning) {
            return <MorningAndPacelInfo />;
          } else if (canParcel) {
            return <ParcelInfo />;
          } else if (noParcelButCanMorning) {
            return <MorningInfo />;
          }
        }
        case 'quick': {
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
    return <div>로딩</div>;
  }

  if (isNil(result)) {
    return <div>에러 발생</div>;
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
