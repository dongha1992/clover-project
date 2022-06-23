import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexColEnd, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';
import { IMAGE_S3_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { useRouter } from 'next/router';
import { cartForm } from '@store/cart';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';
import { SVGIcon } from '@utils/common';
import { getSpotDistanceUnit } from '@utils/spot';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

interface IProps {
    item: ISpotsDetail | any;
}

const now = dayjs();

const SpotSearchMapList = ({item}: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, isSubscription, subsDeliveryType }: any = router.query;
  const { cartLists } = useSelector(cartForm);
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  const { spotSearchArr, spotsPosition } = useSelector(spotSelector);
  const spotList = spotSearchArr&&spotSearchArr;

  const positionLen = spotsPosition?.latitude !== null;
  const userLocationLen = !!userLocation.emdNm?.length;
  const pickUpTime = `${item.lunchDeliveryStartTime}-${item.lunchDeliveryEndTime} / ${item.dinnerDeliveryStartTime}-${item.dinnerDeliveryEndTime}`;

  // 운영 종료 예정 or 종료
  const closedDate = item?.closedDate;
  const dDay = now.diff(dayjs(closedDate), 'day');
  const closedOperation = dDay > 0 || item?.isClosed;
  const closedSoonOperation = dDay >= -14;
  
  const renderSpotMsg = () => {
    switch (true) {
      case closedOperation: {
        return (
          <MeterAndTime>
            <SVGIcon name="exclamationMark" width="14" height="14" />
            <TextB3R color={theme.brandColor} padding="0 0 0 2px">
              운영 종료된 프코스팟이에요
            </TextB3R>
          </MeterAndTime>
        );
      }
      case closedSoonOperation: {
        if (closedDate) {
          return (
            <MeterAndTime>
              <SVGIcon name="exclamationMark" width="14" height="14" />
              <TextB3R color={theme.brandColor} padding="0 0 0 2px">
                운영 종료 예정인 프코스팟이에요
              </TextB3R>
            </MeterAndTime>
          );
        }
      }
      default: {
        return (
          <MeterAndTime>
            {(userLocationLen || positionLen) && (
              <>
                <TextH6B>{`${getSpotDistanceUnit(item.distance).distance}${getSpotDistanceUnit(item.distance).unit}`}</TextH6B>
                <Col />
              </>
            )}
            <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
              픽업
            </TextH6B>
            <TextH6B color={theme.greyScale65}>{pickUpTime}</TextH6B>
          </MeterAndTime>
        );
      }
    }
  };


  const orderHandler = () => {
    const destinationInfo = {
      name: item.name,
      location: {
        addressDetail: item.location.addressDetail,
        address: item.location.address,
        dong: item.location.dong,
        zipCode: item.location.zipCode,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: item.type,
      // spotPickupId: spotPickupId,
      closedDate: item.closedDate,
    };

    const goToCart = () => {
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart', query: { isClosed: !!item.closedDate }});
    };

    const goToDeliveryInfo = () => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: item?.id, isClosed: !!item.closedDate } });
    };

    const goToSelectMenu = () => {
      // 로그인o and 장바구니 x, 메뉴 검색으로 이동
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/search', query: { isClosed: !!item.closedDate }});  
    };

    const handleSubsDeliveryType = () => {
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, subsDeliveryType },
      });
    };

    const handleSubsDeliveryTypeWithSpot = () => {
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, subsDeliveryType },
      });
    };
    
    if(!item.isOpened) {
      // 스찻 오픈 예정인 상태 - 주문 불가
      return;
    }
    if(item.isClosed) {
      // 스팟 종료된 상태 - 주문 불가
      return;
    } 
    if (isLoginSuccess) {
      //로그인 o
      if (orderId) {
        dispatch(
          SET_TEMP_EDIT_SPOT({
            spotPickupId: item.pickups[0].id,
            name: item.name,
            spotPickup: item.pickups[0].name,
          })
        );
        router.push({
          pathname: '/mypage/order-detail/edit/[orderId]',
          query: { orderId },
        });
        return;
      }
      if (cartLists.length) {
        // 로그인o and 장바구니 o
        if (isDelivery) {
          // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubscription) {
            // 구독에서 넘어옴
            if(!!item.closedDate){
              // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
              dispatch(
                SET_ALERT({
                  alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                  submitBtnText: '확인',
                  onSubmit: () => {},
                })
              );        
            } else {
              dispatch(
                SET_BOTTOM_SHEET({
                  content: (
                    <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={handleSubsDeliveryType} />
                  ),
                })
              );
            }
          } else {
            // 장바구니 o , 배송 정보에서 넘어온 경우
            dispatch(
              SET_BOTTOM_SHEET({
                content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToDeliveryInfo} />,
              })
            );
          }
        } else {
          // 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToCart} />,
            })
          );
        }
      } else {
        // 로그인o and 장바구니 x
        if (isSubscription) {
          // 구독에서 넘어옴
          if(!!item.closedDate){
            // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
            dispatch(
              SET_ALERT({
                alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                submitBtnText: '확인',
                onSubmit: () => {},
              })
            );        
          } else {
            dispatch(
              SET_BOTTOM_SHEET({
                content: (
                  <PickupSheet
                    pickupInfo={item?.pickups}
                    spotType={item?.type}
                    onSubmit={handleSubsDeliveryTypeWithSpot}
                  />
                ),
              })
            );  
          }
        } else {
          // 로그인o and 장바구니 x, 메뉴 검색으로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToSelectMenu} />,
            })
          );
        }
      }
    } else {
      // 로그인x, 로그인 이동
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    }
  };

  
  return (
    <Container mapList>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.location.address}</TextB3R>
        {renderSpotMsg()}
        <TagWrapper>
        {
            !item.isClosed && 
            (
              <>
                {
                  item?.isTrial ? (
                    <Tag margin='0 5px 0 0' backgroundColor={theme.greyScale6} color={theme.greyScale45}>트라이얼</Tag>
                  ) : 
                  item?.type === 'PRIVATE' ? (
                    <Tag margin='0 5px 0 0' backgroundColor={theme.brandColor5P} color={theme.brandColor}>프라이빗</Tag>
                  ) : (
                    null
                  )
                }
                {
                  item?.discountRate! > 0 &&
                    <Tag margin='0 5px 0 0' backgroundColor={theme.brandColor5P} color={theme.brandColor}>{`${item?.discountRate}% 할인 중`}</Tag>
                }
              </>
            )
          }
          {!item.isOpened && 
            <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              오픈예정
            </Tag>
          }
        </TagWrapper>
      </FlexColStart>
      <FlexColEnd>
        <ImageWrapper mapList>
          {item?.images?.map((i: { url: string }, idx: number) => {
            return <SpotImg key={idx} src={`${IMAGE_S3_URL}${i.url}`} />;
          })}
        </ImageWrapper>
        {
          (item.isOpened && !item.isClosed) ? (
            // 오픈예정 or 종료된스팟 둘중 하나라도 false하면 주문하기 disabled
            <Button backgroundColor={theme.white} color={theme.black} width="75px" height="38px" border onClick={orderHandler}>
              주문하기
            </Button>
          ) : (
            <Button backgroundColor={theme.white} width="75px" height="38px" disabled>
              주문하기
            </Button>
          )
        }
      </FlexColEnd>
    </Container>
  );
};

const Container = styled.section<{ mapList: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 145px;
  margin-bottom: 24px;
  padding: 16px;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
  ${({ mapList }) => {
    if (mapList) {
      return css`
        background: ${theme.white};
        max-width: ${breakpoints.desktop}px;
        max-width: ${breakpoints.mobile}px;
        height: 160px;
        border-radius: 8px;
        padding: 20px;
      `;
    }
  }}
`;

const MeterAndTime = styled.div`
  display: flex;
  margin: 8px 0 16px 0;
`;

const ImageWrapper = styled.div<{ mapList: boolean }>`
  width: 70px;
  margin-left: 15px;
  border-radius: 8px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        margin-bottom: 10px;
      `;
    }
  }}
`;

const TagWrapper = styled.div`
  display: flex;
`;

const SpotImg = styled.img`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${theme.greyScale6};
`;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;


export default SpotSearchMapList;
