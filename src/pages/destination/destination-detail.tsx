import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckDestinationPlace } from '@components/Pages/Destination';
import { DefaultKakaoMap } from '@components/Map';
import { Button, ButtonGroup } from '@components/Shared/Button';
import { fixedBottom, FlexCol, FlexRow } from '@styles/theme';
import { TextH5B, TextB2R } from '@components/Shared/Text';
import TextInput from '@components/Shared/TextInput';
import Checkbox from '@components/Shared/Checkbox';
import router from 'next/router';
import { getLonLatFromAddress } from '@api/location';
import { getMainDestinationsApi, postDestinationApi } from '@api/destination';
import AddressItem from '@components/Pages/Location/AddressItem';
import { useSelector, useDispatch } from 'react-redux';
import {
  destinationForm,
  INIT_LOCATION_TEMP,
  SET_TEMP_DESTINATION,
  SET_DESTINATION_TYPE,
  SET_USER_DELIVERY_TYPE,
  INIT_DESTINATION_TYPE,
  INIT_AVAILABLE_DESTINATION,
  SET_DESTINATION,
} from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION } from '@store/mypage';
import { checkDestinationHelper } from '@utils/destination';
import { Obj } from '@model/index';
import { SET_ALERT } from '@store/alert';

/* TODO: receiverName, receiverTel  */

const deliveryMap: Obj = {
  parcel: '택배배송',
  morning: '새벽배송',
};

const DestinationDetailPage = () => {
  const [isDefaultDestination, setIsDefaultDestination] = useState(false);
  const [hasDefaultDestination, setHasDefaultDestination] = useState(false);
  const [destinationStatusByRule, setDestinationStatusByRule] = useState<string>('');
  const [isMaybeChangeType, setIsMaybeChangeType] = useState<boolean>(false);
  const [latitudeLongitude, setLatitudeLongitude] = useState({
    latitude: '',
    longitude: '',
  });

  const destinationNameRef = useRef<HTMLInputElement>(null);
  const destinationDetailRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { orderId, isSubscription, subsDeliveryType, destinationId, menuId } = router.query;

  // 배송 가능 여부
  const { tempLocation, availableDestination, userDeliveryType, isCanNotDelivery } = useSelector(destinationForm);
  const destinationDeliveryType = checkDestinationHelper(availableDestination);

  // 주문 상세 - 배송지 변경의 경우
  const fromOrderDetail = orderId && isMaybeChangeType;

  const getLonLanForMap = async () => {
    const params = {
      query: tempLocation.roadAddrPart1,
      analyze_type: 'similar',
      page: 1,
      size: 20,
    };
    try {
      const { data } = await getLonLatFromAddress(params);
      if (data.documents.length > 0) {
        const longitude = data.documents[0].x;
        const latitude = data.documents[0].y;
        setLatitudeLongitude({
          latitude,
          longitude,
        });
      } else {
        // 검색 결과가 없는 경우?
      }
    } catch (error) {}
  };

  const getDestination = async () => {
    if (isCanNotDelivery) {
      return;
    }

    if (!destinationDetailRef?.current?.value) {
      dispatch(SET_ALERT({ alertMessage: '상세 주소를 입력해주세요.' }));
      return;
    }

    if (!destinationNameRef?.current?.value) {
      dispatch(SET_ALERT({ alertMessage: '배송지명을 입력해주세요.' }));
      return;
    }

    if (destinationDetailRef.current && destinationNameRef.current) {
      const addressDetail = destinationDetailRef.current.value.toString();
      const name = destinationNameRef.current.value.toString();

      const userDestinationInfo = {
        name,
        location: {
          addressDetail,
          address: tempLocation.roadAddrPart1!,
          dong: tempLocation.emdNm!,
          zipCode: tempLocation.zipNo!,
        },
        main: !hasDefaultDestination ? true : isDefaultDestination,
      };

      // 마이페이지 - 주문상세 - 배송지 변경에서 진입
      if (orderId) {
        const reqBody = {
          name,
          delivery: userDeliveryType?.toUpperCase(),
          deliveryMessage: '',
          main: false,
          receiverName: '',
          receiverTel: '',
          location: {
            addressDetail,
            address: tempLocation.roadAddrPart1!,
            zipCode: tempLocation.zipNo!,
            dong: tempLocation.emdNm!,
          },
          spotPickupId: null,
        };
        try {
          const { data } = await postDestinationApi(reqBody);
          if (data.code === 200) {
            const response = data.data;
            dispatch(
              SET_TEMP_EDIT_DESTINATION({
                name: response.name,
                location: {
                  addressDetail: response.location.addressDetail,
                  address: response.location.address,
                  dong: response.location.dong,
                  zipCode: response.location.zipCode,
                },
                main: false,
              })
            );
            dispatch(INIT_LOCATION_TEMP());
            dispatch(INIT_DESTINATION_TYPE());
            dispatch(INIT_AVAILABLE_DESTINATION());
            router.replace({
              pathname: '/mypage/order-detail/edit/[orderId]',
              query: { orderId, destinationId },
            });

            if (isSubscription) {
              router.push({
                pathname: '/subscription/set-info',
                query: { subsDeliveryType: subsDeliveryType, menuId },
              });
            }
          } else {
            router.push('/cart');
          }
        } catch (error) {
          if (isSubscription) {
            router.push({
              pathname: '/subscription/set-info',
              query: { subsDeliveryType: subsDeliveryType, menuId },
            });
          }
          console.log('error', error);
        }
      } else {
        dispatch(SET_TEMP_DESTINATION(userDestinationInfo));
        dispatch(SET_DESTINATION_TYPE(destinationDeliveryType));
        dispatch(SET_USER_DELIVERY_TYPE(destinationStatusByRule));
        dispatch(INIT_LOCATION_TEMP());
        if (isSubscription) {
          router.push({
            pathname: '/cart/delivery-info',
            query: { subsDeliveryType, isSubscription: true, menuId },
          });
        } else {
          router.replace('/cart/delivery-info');
        }
      }
    }
  };

  const checkHasMainDestination = async () => {
    const params = {
      delivery: userDeliveryType.toUpperCase(),
    };

    try {
      const { data } = await getMainDestinationsApi(params);
      if (data.code === 200) {
        !data.data ? setHasDefaultDestination(false) : setHasDefaultDestination(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToSearch = () => {
    orderId ? router.replace(`/destination/search?orderId=${orderId}`) : router.replace('/destination/search');
  };

  const goToHome = () => {
    router.replace('/');
  };

  useEffect(() => {
    getLonLanForMap();
  }, []);

  // useEffect(() => {
  //   if (!latitudeLongitude.latitude || !latitudeLongitude.longitude) router.replace('/cart');
  // }, []);

  useEffect(() => {
    checkHasMainDestination();
  }, []);

  useEffect(() => {
    /* TODO: 리팩토링 필요 */
    const { morning, parcel, quick } = availableDestination;

    const userMorningButParcel = userDeliveryType === 'morning' && !morning && parcel;
    const userQuickButMorning = userDeliveryType === 'quick' && !quick && morning;
    const userQuickButParcel = userDeliveryType === 'quick' && !quick && parcel;
    const onlyMorning = userDeliveryType === 'parcel' && !parcel && morning;

    if (userMorningButParcel || userQuickButMorning || userQuickButParcel || onlyMorning) {
      setIsMaybeChangeType(true);
      switch (true) {
        case userMorningButParcel:
          {
            setDestinationStatusByRule('parcel');
          }
          break;

        case userQuickButMorning:
          {
            setDestinationStatusByRule('morning');
          }
          break;

        case userQuickButParcel:
          {
            setDestinationStatusByRule('parcel');
          }
          break;

        case onlyMorning:
          {
            setDestinationStatusByRule('morning');
          }
          break;

        default:
          {
            setDestinationStatusByRule(userDeliveryType);
          }
          break;
      }
    } else {
      setIsMaybeChangeType(false);
      setDestinationStatusByRule(userDeliveryType);
    }
  }, [availableDestination]);

  if (!Object.keys(tempLocation).length) {
    return;
  }

  return (
    <Container>
      <CheckDestinationPlace />
      <MapWrapper>
        <DefaultKakaoMap
          centerLat={Number(latitudeLongitude.latitude)}
          centerLng={Number(latitudeLongitude.longitude)}
        />
      </MapWrapper>
      <DestinationInfoWrarpper>
        <FlexCol>
          <AddressItem
            roadAddr={tempLocation.roadAddrPart1}
            bdNm={tempLocation.bdNm}
            jibunAddr={tempLocation.jibunAddr}
            zipNo={tempLocation.zipNo}
          />
        </FlexCol>
        <TextInput placeholder="상세주소 입력" ref={destinationDetailRef} />
        <FlexCol padding="24px 0">
          <TextH5B padding="0 0 8px 0">배송지명</TextH5B>
          <TextInput placeholder="배송지명 입력" ref={destinationNameRef} />
        </FlexCol>
        {!orderId && (
          <FlexRow padding="0">
            <Checkbox
              onChange={() => setIsDefaultDestination(!isDefaultDestination)}
              isSelected={isDefaultDestination}
            />
            {isDefaultDestination ? (
              <TextH5B padding="4px 0 0 4px">기본 배송지로 설정</TextH5B>
            ) : (
              <TextB2R padding="4px 0 0 4px">기본 배송지로 설정</TextB2R>
            )}
          </FlexRow>
        )}
      </DestinationInfoWrarpper>
      {(isCanNotDelivery || fromOrderDetail) && (
        <ButtonGroup
          leftButtonHandler={goToSearch}
          rightButtonHandler={goToHome}
          leftText="다른 주소 검색하기"
          rightText="닫기"
        />
      )}
      {!isCanNotDelivery && !fromOrderDetail && (
        <ButtonWrapper>
          <Button height="100%" borderRadius="0" onClick={getDestination}>
            {isMaybeChangeType ? `${deliveryMap[destinationStatusByRule]}으로 변경하기` : '설정하기'}
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin-bottom: 60px;
`;

const ButtonWrapper = styled.div`
  ${fixedBottom}
`;

const DestinationInfoWrarpper = styled.div`
  padding: 24px;
`;

const MapWrapper = styled.div`
  height: 50vh;
`;

export default DestinationDetailPage;
