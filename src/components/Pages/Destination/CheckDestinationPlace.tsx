import { AxiosError } from 'axios';
import React from 'react';
import styled from 'styled-components';
import { TextB3R, TextH2B } from '@components/Shared/Text';
import { theme, FlexRow } from '@styles/theme';
import { availabilityDestination } from '@api/destination';
import { checkDestinationHelper } from '@utils/checkDestinationHelper';
import { useSelector, useDispatch } from 'react-redux';
import { destinationForm, SET_AVAILABLE_DESTINATION, SET_LOCATION_STATUS } from '@store/destination';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { TLocationType } from '@utils/checkDestinationHelper';
interface IResponse {
  status: TLocationType;
  availableDestinationObj: {
    morning: boolean;
    parcel: boolean;
    spot: boolean;
    quick: boolean;
  };
}

const CheckDestinationPlace = () => {
  const { tempLocation } = useSelector(destinationForm);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isLocation } = router.query;

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
      const { data } = await availabilityDestination(params);

      if (data.code === 200) {
        const { morning, parcel, quick, spot } = data.data;
        const availableDestinationObj = {
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
        const { message } = error.response?.data;
        alert(message);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  const userPlaceInfoRender = (status?: string) => {
    if (isLocation) {
      switch (status) {
        case 'spot': {
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
              <TextB3R color={theme.greyScale65}>서울 내 등록된 프코스팟에서 배송비 무료로 이용 가능해요</TextB3R>
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
              <TextB3R color={theme.greyScale65}>전국 어디서나 이용할 수 있어요. (제주, 도서 산간지역 제외)</TextB3R>
            </>
          );
        }
        case 'morning': {
          return (
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
              <TextB3R color={theme.greyScale65}>서울 전체, 경기/인천 일부 지역 이용 가능해요</TextB3R>
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
              <TextB3R color={theme.greyScale65}>(섬/공단지역/학교/학교 기숙사/병원/군부대/시장/백화점 등)</TextB3R>
            </>
          );
        }

        default:
          return;
      }
    } else {
    }
  };

  if (isLoading) {
    return <div>로딩</div>;
  }

  return (
    <Container>
      <PlaceInfo>{userPlaceInfoRender(result?.status)}</PlaceInfo>
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
