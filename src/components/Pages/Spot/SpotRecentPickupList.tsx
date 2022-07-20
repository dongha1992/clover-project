import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme, FlexCol, FlexColStart } from '@styles/theme';
import { TextB3R, TextH5B, TextH6B } from '@components/Shared/Text';
import { Tag } from '@components/Shared/Tag';
import { Button } from '@components/Shared/Button';
import { breakpoints } from '@utils/common/getMediaQuery';
import { IMAGE_S3_URL, IMAGE_S3_DEV_URL } from '@constants/mock';
import { useDispatch, useSelector } from 'react-redux';
import { IDestinationsResponse } from '@model/index';
import { useRouter } from 'next/router';
import { userForm } from '@store/user';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_TEMP_DESTINATION, SET_DESTINATION } from '@store/destination';
import { SET_TEMP_EDIT_DESTINATION, SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { SET_ALERT } from '@store/alert';
import { spotSelector } from '@store/spot';
import { SVGIcon } from '@utils/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { getSpotDistanceUnit } from '@utils/spot';

interface IProps {
  item: IDestinationsResponse | undefined;
  hasCart?: boolean;
}

const now = dayjs();

// 스팟 검색 - 최근픽업이력
const SpotRecentPickupList = ({ item, hasCart }: IProps): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDelivery, orderId, destinationId, isSubscription, subsDeliveryType, menuId }: any = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { userLocation } = useSelector(destinationForm);
  const { spotPickupId } = useSelector(spotSelector);

  const userLocationLen = !!userLocation.emdNm?.length;
  const recentPickupTime = `${item?.spotPickup?.spot.lunchDeliveryStartTime}-${item?.spotPickup?.spot.lunchDeliveryEndTime} / ${item?.spotPickup?.spot.dinnerDeliveryStartTime}-${item?.spotPickup?.spot.dinnerDeliveryEndTime}`;
  const isOpened = item?.spotPickup?.spot.isOpened;
  const isClosed = item?.spotPickup?.spot.isClosed;
  const isTrial = item?.spotPickup?.spot.isTrial;
  const type = item?.spotPickup?.spot?.type;
  const discountRate = item?.spotPickup?.spot?.discountRate;
  const [isSubs, setIsSubs] = useState<boolean>();

  // 운영 종료 예정 or 종료
  const closedDate = item?.spotPickup?.spot.closedDate;
  const dDay = now.diff(dayjs(item?.spotPickup?.spot.closedDate), 'day');
  const closedOperation = dDay > 0 || item?.spotPickup?.spot.isClosed;
  const closedSoonOperation = dDay >= -14;

  useEffect(() => {
    if (router.isReady) {
      if (router.query.isSubscription === 'true') {
        const IsSubs = router.query.isSubscription === 'true';
        setIsSubs(IsSubs);
      }
    }
  }, [router.isReady, router.query.isSubscription]);

  const renderSpotMsg = useCallback(() => {
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
        } else {
          return (
            <MeterAndTime>
              {userLocationLen && (
                <>
                  <TextH6B color={theme.greyScale65}>{`${
                    getSpotDistanceUnit(item?.spotPickup?.spot.distance!).distance
                  }${getSpotDistanceUnit(item?.spotPickup?.spot.distance!).unit}`}</TextH6B>
                  <Col />
                </>
              )}
              <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
                픽업
              </TextH6B>
              <TextH6B color={theme.greyScale65}>{recentPickupTime}</TextH6B>
            </MeterAndTime>
          );
        }
      }
      default: {
        return (
          <MeterAndTime>
            {userLocationLen && (
              <>
                <TextH6B color={theme.greyScale65}>{`${getSpotDistanceUnit(item?.spotPickup?.spot.distance!).distance}${
                  getSpotDistanceUnit(item?.spotPickup?.spot.distance!).unit
                }`}</TextH6B>
                <Col />
              </>
            )}
            <TextH6B color={theme.greyScale65} padding="0 4px 0 0">
              픽업
            </TextH6B>
            <TextH6B color={theme.greyScale65}>{recentPickupTime}</TextH6B>
          </MeterAndTime>
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스팟 주문하기 - 스팟 검색 : 최근 픽업 이력 
  // item.id : 배송지 id, item.spotPickup.id: 스팟픽업 id, item.spotPickup.spotId: 스팟 id
  const orderHandler = (e: any) => {
    e.stopPropagation();
    /* NOTICE: destinationInfo의 인터페이스가 서버 response임 */

    const destinationInfo = {
      spotId: item?.spotPickup?.spot.id,
      id: item?.id,
      name: item?.name!,
      location: {
        addressDetail: item?.location?.addressDetail!,
        address: item?.location?.address!,
        dong: item?.location?.dong!,
        zipCode: item?.location?.zipCode!,
      },
      delivery: 'spot',
      main: false,
      availableTime: recentPickupTime!,
      spaceType: item?.spotPickup?.spot.type!,
      spotPickupId: spotPickupId! || item?.spotPickup?.id,
      closedDate: closedDate,
    };

    const goToCart = () => { // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart', query: { isClosed: !!closedDate } });
    };

    const goToDeliveryInfo = () => { // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart/delivery-info', query: { destinationId: item?.id, isClosed: !!closedDate } });
    };

    const handleSubsDeliveryType = () => {
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: item?.id, isSubscription, subsDeliveryType, menuId },
      });
    };

    if (!isOpened) { // 스찻 오픈 예정인 상태 - 주문 불가
      return;
    };
    if (isClosed) { // 스팟 종료된 상태 - 주문 불가
      return;
    };

    if (isLoginSuccess) {
      if (orderId) {
        dispatch(
          SET_TEMP_EDIT_SPOT({
            spotPickupId: item?.spotPickup?.id!,
            name: item?.name!,
            spotPickup: item?.spotPickup?.name!,
          })
        );
        router.push({
          pathname: '/mypage/order-detail/edit/[orderId]',
          query: { orderId, destinationId },
        });
        return;
      };

      if (hasCart) { // 로그인o and 장바구니 o
        if (isDelivery) { // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubscription) { // 구독에서 넘어옴
            if (!!closedDate) { // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
              dispatch(
                SET_ALERT({
                  alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                  submitBtnText: '확인',
                  onSubmit: () => {},
                })
              );
            } else {
              handleSubsDeliveryType();
            }
          } else { // 장바구니 o , 배송 정보에서 넘어온 경우
            goToDeliveryInfo();
          }
        } else { // 장바구니 o, 스팟 검색에서 cart로 이동
          goToCart();
        }
      } else { // 로그인o and 장바구니 x
        if (isSubscription) { // 구독에서 넘어옴
          if (!!closedDate) { // 종료 예정인 스팟 - 정기구독 주문 불가 팝업
            dispatch(
              SET_ALERT({
                alertMessage: `운영 종료 예정된 프코스팟은\n구독을 이용할 수 없어요!`,
                submitBtnText: '확인',
                onSubmit: () => {},
              })
            );
          } else {
            handleSubsDeliveryType();
          }
        } else { // 로그인o and 장바구니 x, cart로 이동
          goToCart();
        }
      }
    } else { // 로그인x, 로그인 이동
      dispatch(
        SET_ALERT({
          alertMessage: `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`,
          submitBtnText: '확인',
          closeBtnText: '취소',
          onSubmit: () => router.push('/onboarding'),
        })
      );
    };
  };

  const goToDetail = (id: number | undefined) => {
    router.push({
      pathname: `/spot/detail/${id}`,
      query: { isSpot: true },
    });
  };

  return (
    <Container spotClose={isClosed} onClick={(e) => goToDetail(item?.id)}>
      <FlexColStart>
        <TextH5B>{item?.name}</TextH5B>
        <TextB3R padding="2px 0 0 0">{item?.location?.address}</TextB3R>
        {renderSpotMsg()}
        <TagWrapper>
          {!isClosed && (
            <>
              {isTrial ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.greyScale6} color={theme.greyScale45}>
                  트라이얼
                </Tag>
              ) : type === 'PRIVATE' ? (
                <Tag margin="0 5px 0 0" backgroundColor={theme.brandColor5P} color={theme.brandColor}>
                  프라이빗
                </Tag>
              ) : null}
              {discountRate! > 0 && !isSubs && (
                <Tag
                  margin="0 5px 0 0"
                  backgroundColor={theme.brandColor5P}
                  color={theme.brandColor}
                >{`${item?.spotPickup?.spot?.discountRate}% 할인 중`}</Tag>
              )}
            </>
          )}
        </TagWrapper>
      </FlexColStart>
      <FlexCol>
        <ImageWrapper>
          {item?.spotPickup?.spot.isTrial ? (
            <SpotImg src={`${IMAGE_S3_DEV_URL}${`/img_spot_default.png`}`} />
          ) : item?.spotPickup?.spot?.images?.length! > 0 ? (
            <SpotImg src={`${IMAGE_S3_URL}${item?.spotPickup?.spot.images[0].url}`} />
          ) : (
            <SpotImg src={`${IMAGE_S3_DEV_URL}${`/img_spot_default.png`}`} />
          )}
        </ImageWrapper>
        {isOpened && !isClosed ? (
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
          <Button backgroundColor={theme.white} color={theme.black} width="75px" height="38px" disabled>
            주문하기
          </Button>
        )}
      </FlexCol>
    </Container>
  );
};

const Container = styled.section<{ spotClose?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: ${theme.white};
  max-width: ${breakpoints.desktop}px;
  max-width: ${breakpoints.mobile}px;
  padding: 12px 0;
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
  margin: 8px 0 10px 0;
`;

const ImageWrapper = styled.div`
  width: 60px;
  margin-left: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const SpotImg = styled.img`
  width: 100%;
  border: 1px solid ${theme.greyScale6};
  border-radius: 8px;
`;

const TagWrapper = styled.div``;

const Col = styled.div`
  height: 16px;
  width: 1px;
  background-color: ${theme.greyScale6};
  margin: 0 4px;
`;

export default React.memo(SpotRecentPickupList);
