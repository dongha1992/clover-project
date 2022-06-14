import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import SVGIcon from '@utils/common/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';
import router from 'next/router';
import { useSelector } from 'react-redux';
import { spotSelector } from '@store/spot';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { postSpotLike, deleteSpotLike, getSpotLike } from '@api/spot';
import { SET_SPOT_LIKED, INIT_SPOT_LIKED } from '@store/spot';
import { userForm } from '@store/user';
import { cartForm } from '@store/cart';
import { useDispatch } from 'react-redux';
import { SET_USER_DELIVERY_TYPE, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';

const SpotDetailBottom = () => {
  const dispatch = useDispatch();
  const { isDelivery, orderId, isSubscription, subsDeliveryType, menuId }: any = router.query;
  const { isLoginSuccess } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { spotDetail, spotPickupId } = useSelector(spotSelector);
  const [spotLike, setSpotLike] = useState(spotDetail?.liked);

  const pickUpTime = `${spotDetail?.lunchDeliveryStartTime}-${spotDetail?.lunchDeliveryEndTime} / ${spotDetail?.dinnerDeliveryStartTime}-${spotDetail?.dinnerDeliveryEndTime}`;
  // 날짜 커스텀
  const dt = new Date(spotDetail?.openedAt!);
  const openDate = `${dt?.getMonth() + 1}월 ${dt.getDate()}일 ${dt.getHours()}시 오픈 예정이에요.`;

  //주문하기 btn
  const orderHandler = (e: any): void => {
    e.stopPropagation();
    const destinationInfo = {
      name: spotDetail?.name!,
      location: {
        addressDetail: spotDetail?.location.addressDetail!,
        address: spotDetail?.location.address!,
        dong: spotDetail?.name!,
        zipCode: spotDetail?.location.zipCode!,
      },
      main: false,
      availableTime: pickUpTime,
      spaceType: spotDetail?.type,
      spotPickupId: spotPickupId!,
    };

    const goToCart = () => {
      // 로그인 o, 장바구니 o, 스팟 검색 내에서 cart로 넘어간 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_DESTINATION(destinationInfo));
      router.push({ pathname: '/cart', query: { isClosed: !!spotDetail?.closedDate } });
    };

    const goToDeliveryInfo = () => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: spotDetail?.id, isClosed: !!spotDetail?.closedDate },
      });
    };

    const handleSubsDeliveryType = () => {
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: spotDetail?.id, isSubscription, subsDeliveryType, menuId },
      });
    };

    const handleSubsDeliveryTypeWithSpot = () => {
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.push({
        pathname: '/cart/delivery-info',
        query: { destinationId: spotDetail?.id, isSubscription, subsDeliveryType, menuId },
      });
    };

    if (!spotDetail?.isOpened) {
      // 스찻 오픈 예정인 상태 - 주문 불가
      return;
    }
    if (spotDetail?.isClosed) {
      // 스팟 종료된 상태 - 주문 불가
      return;
    }
    if (isLoginSuccess) {
      //로그인 o
      if (cartLists.length) {
        // 장바구니 o
        if (isDelivery) {
          if (isSubscription) {
            dispatch(
              SET_BOTTOM_SHEET({
                content: (
                  <PickupSheet
                    pickupInfo={spotDetail?.pickups}
                    spotType={spotDetail?.type}
                    onSubmit={handleSubsDeliveryType}
                  />
                ),
              })
            );
          } else {
            // 장바구니 o , 배송 정보에서 넘어온 경우
            dispatch(
              SET_BOTTOM_SHEET({
                content: (
                  <PickupSheet
                    pickupInfo={spotDetail?.pickups}
                    spotType={spotDetail?.type}
                    onSubmit={goToDeliveryInfo}
                  />
                ),
              })
            );
          }
        } else {
          // 로그인 o, 장바구니 o, 스팟 검색에서 cart로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={spotDetail?.pickups} spotType={spotDetail?.type} onSubmit={goToCart} />,
            })
          );
        }
      } else {
        // 장바구니 x
        if (isSubscription) {
          // 구독에서 넘어옴
          dispatch(
            SET_BOTTOM_SHEET({
              content: (
                <PickupSheet
                  pickupInfo={spotDetail?.pickups}
                  spotType={spotDetail?.type}
                  onSubmit={handleSubsDeliveryTypeWithSpot}
                />
              ),
            })
          );
        } else {
          // 로그인o and 장바구니 x, cart로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: <PickupSheet pickupInfo={spotDetail?.pickups} spotType={spotDetail?.type} onSubmit={goToCart} />,
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

  useEffect(() => {
    const spotLikeData = async () => {
      try {
        const { data } = await getSpotLike(spotDetail?.id!);
        setSpotLike(data.data.liked);
        if (data.data.liked) {
          dispatch(SET_SPOT_LIKED());
        } else {
          dispatch(INIT_SPOT_LIKED());
        }
      } catch (err) {
        console.error(err);
      }
    };

    spotLikeData();
  }, [spotDetail, spotDetail?.id, spotLike]);

  // 좋아요 버튼
  const hanlderLike = async () => {
    if (isLoginSuccess) {
      try {
        if (!spotLike) {
          const { data } = await postSpotLike(spotDetail?.id!);
          if (data.code === 200) {
            dispatch(SET_SPOT_LIKED());
            setSpotLike(true);
          }
        } else {
          const { data } = await deleteSpotLike(spotDetail?.id!);
          if (data.code === 200) {
            dispatch(INIT_SPOT_LIKED());
            setSpotLike(false);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const TitleMsg = `로그인이 필요한 기능이에요.\n로그인 하시겠어요?`;
      dispatch(
        SET_ALERT({
          alertMessage: TitleMsg,
          onSubmit: () => {
            router.push('/onboarding');
          },
          submitBtnText: '확인',
          closeBtnText: '취소',
        })
      );
    }
  };

  return (
    <Container isClosed={spotDetail?.isClosed}>
      {spotDetail?.isClosed ? (
        <Wrapper>
          <BtnWrapper>
            <TextH5B color={theme.greyScale25}>운영 종료된 프코스팟이에요</TextH5B>
          </BtnWrapper>
        </Wrapper>
      ) : (
        <>
          <Wrapper>
            {
              !spotDetail?.isTrial &&
              <LikeWrapper>
                <LikeBtn onClick={hanlderLike}>
                  <SVGIcon name={spotDetail?.liked ? 'likeRed' : 'likeBlack'} />
                </LikeBtn>
                <TextH5B color={theme.white} padding="0 0 0 4px">
                  {spotDetail?.likeCount}
                </TextH5B>
                <Col />
              </LikeWrapper>
            }
            <BtnWrapper onClick={orderHandler}>
              <TextH5B color={theme.white}>{spotDetail?.isOpened ? '주문하기' : `${openDate}`}</TextH5B>
            </BtnWrapper>
            {spotDetail?.isOpened && spotDetail?.discountRate !== 0 && (
            <TootipWrapper>
              <TimerTooltip
                message={`${spotDetail?.discountRate}% 할인 중`}
                bgColor={theme.brandColor}
                color={theme.white}
                minWidth="78px"
              />
            </TootipWrapper>
          )}
          </Wrapper>
        </>
      )}
    </Container>
  );
};

const Container = styled.section<{ isClosed?: boolean }>`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  height: 56px;
  left: calc(50%);
  ${({ isClosed }) => {
    if (isClosed) {
      return css`
        background-color: ${theme.greyScale6};
      `;
    } else {
      return css`
        background-color: ${theme.black};
      `;
    }
  }}

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const Wrapper = styled.div`
  position: relative;
  padding: 16px 24px;
  display: flex;
  width: 100%;
`;

const TootipWrapper = styled.article`
  position: absolute;
  ${({ theme }) => theme.desktop`
    top: -11px;
    left: 47%;
  `};

  ${({ theme }) => theme.mobile`
    top: -11px;
    left: 43%;
  `};
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
`;

const Col = styled.div`
  width: 1px;
  height: 24px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${theme.white};
`;

const BtnWrapper = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

const LikeBtn = styled.div`
  cursor: pointer;
`;

export default SpotDetailBottom;
