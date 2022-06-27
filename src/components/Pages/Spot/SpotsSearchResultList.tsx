import React, { ReactElement, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';
import { IMAGE_S3_URL, IMAGE_S3_DEV_URL } from '@constants/mock';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { ISpotsDetail } from '@model/index';
import { useRouter } from 'next/router';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { getSpotDistanceUnit } from '@utils/spot';

interface IProps {
  item: ISpotsDetail | any;
  hasCart?: boolean;
}
const now = dayjs();

// 스팟 검색 - 검색 결과
const SpotsSearchResultList = ({ item, hasCart }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, destinationId, isSubscription, subsDeliveryType, menuId }: any = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  const { spotPickupId, spotsPosition } = useSelector(spotSelector);
  const store = useStore();

  const userLocationLen = !!userLocation.emdNm?.length;
  const positionLen = spotsPosition?.latitude !== null;
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
                <TextH6B>{`${getSpotDistanceUnit(item.distance).distance}${
                  getSpotDistanceUnit(item.distance).unit
                }`}</TextH6B>
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
      id: item.id,
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
      spotPickupId: spotPickupId!,
      closedDate: item.closedDate,
      delivery: 'spot',
    };

    const goToCart = () => {
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart', query: { isClosed: !!closedDate } });
    };

    const goToDeliveryInfo = () => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: item?.id, isClosed: !!closedDate } });
    };

    const handleSubsDeliveryType = () => {
      destinationInfo.spotPickupId = store.getState().spot.spotPickupId;
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, subsDeliveryType, menuId },
      });
    };

    if (!item.isOpened) {
      // 스찻 오픈 예정인 상태 - 주문 불가
      return;
    }
    if (item.isClosed) {
      // 스팟 종료된 상태 - 주문 불가ㅇ
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
          query: { orderId, destinationId },
        });
        return;
      }
      if (hasCart) {
        // 로그인o and 장바구니 o
        if (isDelivery) {
          // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubscription) {
            // 구독에서 넘어옴
            if (!!closedDate) {
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
          // 장바구니 o, 스팟 검색에서 cart로 이동
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
          if (!!item.closedDate) {
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
          // 로그인o and 장바구니 x, cart로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={item?.pickups} spotType={item?.type} onSubmit={goToCart} />,
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

  const goToDetail = (id: number | undefined) => {
    if (item?.isClosed) {
      router.push(`/spot/detail/${id}`);
    } else {
      return;
    }
  };

  return (
    <Container mapList spotClose={item.isClosed} onClick={() => goToDetail(item.id)}>
      <FlexColStart>
        <TextH5B>{item.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item.location.address}</TextB3R>
        {renderSpotMsg()}
        <TagWrapper>
          {!item.isClosed && (
            <>
              {item?.isTrial ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale45}>
                  트라이얼
                </Tag>
              ) : item?.type === 'PRIVATE' ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
                  프라이빗
                </Tag>
              ) : null}
              {item?.discountRate! > 0 && (
                <Tag
                  margin="0 5px 0 0"
                  backgroundColor={theme.brandColor5P}
                  color={theme.brandColor}
                >{`${item?.discountRate}% 할인 중`}</Tag>
              )}
            </>
          )}
          {!item.isOpened && (
            <Tag backgroundColor={theme.brandColor5P} color={theme.brandColor}>
              오픈예정
            </Tag>
          )}
        </TagWrapper>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper mapList>
          {item.isTrial ? (
            <SpotImg src={`${IMAGE_S3_DEV_URL}${`/img_spot_default.png`}`} />
          ) : item.images?.length! > 0 ? (
            <SpotImg src={`${IMAGE_S3_URL}${item.images[0].url}`} />
          ) : (
            <SpotImg src={`${IMAGE_S3_DEV_URL}${`/img_spot_default.png`}`} />
          )}
        </ImageWrapper>
        {item.isOpened && !item.isClosed ? (
          // 오픈예정 or 종료된스팟 둘중 하나라도 false하면 주문하기 disabled
          <Button
            backgroundColor={theme.white}
            color={theme.black}
            width="75px"
            height="38px"
            border
            onClick={orderHandler}
          >
            주문하기
          </Button>
        ) : (
          <Button backgroundColor={theme.white} width="75px" height="38px" disabled>
            주문하기
          </Button>
        )}
      </FlexCol>
    </Container>
  );
};

const Container = styled.section<{ mapList: boolean; spotClose?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 114px;
  ${({ mapList }) => {
    if (mapList) {
      return css`
        background: ${theme.white};
        max-width: ${breakpoints.desktop}px;
        max-width: ${breakpoints.mobile}px;
        height: 146px;
        border-radius: 8px;
      `;
    }
  }};
  ${({ spotClose }) => {
    if (spotClose) {
      return css`
        cursor: pointer;
      `;
    }
  }};
`;

const MeterAndTime = styled.div`
  display: flex;
  padding: 8px 0 10px 0;
`;

const TagWrapper = styled.div``;

const ImageWrapper = styled.div<{ mapList: boolean }>`
  width: 60px;
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

export default React.memo(SpotsSearchResultList);
