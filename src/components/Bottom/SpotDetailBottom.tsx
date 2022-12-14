import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import SVGIcon from '@utils/common/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';
import router from 'next/router';
import { useSelector, useStore } from 'react-redux';
import { spotSelector } from '@store/spot';
import { SpotDetailEventTooltip } from '@components/Shared/Tooltip';
import { postSpotLike, deleteSpotLike, getSpotDetail } from '@api/spot';
import { SPOT_ITEM } from '@store/spot';
import { userForm } from '@store/user';
import { cartForm } from '@store/cart';
import { useDispatch } from 'react-redux';
import { destinationForm, SET_USER_DELIVERY_TYPE, SET_DESTINATION, SET_TEMP_DESTINATION } from '@store/destination';
import { SET_ALERT } from '@store/alert';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { PickupSheet } from '@components/BottomSheet/PickupSheet';
import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { postDestinationApi } from '@api/destination';
import { SET_TEMP_EDIT_SPOT } from '@store/mypage';
import { ISpotPickupInfoInDestination } from '@model/index';

const SpotDetailBottom = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isDelivery, subsDeliveryType, menuId, orderId, destinationId }: any = router.query;
  const { isLoginSuccess, me } = useSelector(userForm);
  const { cartLists } = useSelector(cartForm);
  const { spotDetail, spotPickupId } = useSelector(spotSelector);
  const [isSubs, setIsSubs] = useState<boolean>();

  useEffect(() => {
    if (router.isReady) {
      if (router.query.isSubscription === 'true') {
        const IsSubs = router.query.isSubscription === 'true';
        setIsSubs(IsSubs);
      }
    }
  }, []);
  const { userTempDestination } = useSelector(destinationForm);

  const pickUpTime = `${spotDetail?.lunchDeliveryStartTime}-${spotDetail?.lunchDeliveryEndTime} / ${spotDetail?.dinnerDeliveryStartTime}-${spotDetail?.dinnerDeliveryEndTime}`;
  // 날짜 커스텀
  const dt = new Date(spotDetail?.openedAt!);
  const openDate = `${dt?.getMonth() + 1}월 ${dt.getDate()}일 ${dt.getHours()}시 오픈 예정이에요.`;

  // 스팟 주문하기 - 스팟 상세 주문하기 버튼
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

    const getDestinationInfo = async (pickupInfo: ISpotPickupInfoInDestination) => {
      // 로그인 o, 스팟 검색 내에서 장바구니(cart)로 넘어간 경우
      const reqBody = {
        name: spotDetail?.name!,
        delivery: 'SPOT',
        deliveryMessage: '',
        main: false,
        receiverName: '',
        receiverTel: '',
        location: {
          addressDetail: spotDetail?.location?.addressDetail!,
          address: spotDetail?.location?.address!,
          zipCode: spotDetail?.location?.zipCode!,
          dong: spotDetail?.location?.dong!,
        },
        spotPickupId: pickupInfo.id,
      };
      try {
        const { data } = await postDestinationApi(reqBody); // 배송지 id 값을 위해 api 호출
        if (data.code === 200) {
          const response = data.data;
          const destinationId = response.id;
          if (orderId) {
            // 마이페이지 - 배송정보 - 스팟 배송지 변경인 경우
            dispatch(
              SET_TEMP_EDIT_SPOT({
                spotPickupId: pickupInfo.id,
                name: spotDetail?.name!,
                spotPickup: pickupInfo.name,
                location: response.location,
              })
            );
            router.replace({
              pathname: '/mypage/order-detail/edit/[orderId]',
              query: { orderId, destinationId },
            });
          } else {
            dispatch(
              SET_DESTINATION({
                name: response.name,
                location: {
                  addressDetail: response.location.addressDetail,
                  address: response.location.address,
                  dong: response.location.dong,
                  zipCode: response.location.zipCode,
                },
                main: response.main,
                deliveryMessage: response.deliveryMessage,
                receiverName: response.receiverName,
                receiverTel: response.receiverTel,
                deliveryMessageType: '',
                delivery: response.delivery,
                id: destinationId,
                spotId: spotDetail?.id,
                availableTime: pickUpTime,
                spotPickupType: pickupInfo.type,
                spotPickupId: pickupInfo.id,
              })
            );
            dispatch(SET_USER_DELIVERY_TYPE('spot'));
            router.replace({ pathname: '/cart', query: { isClosed: !!spotDetail?.closedDate } });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const goToDeliveryInfo = (pickupInfo: ISpotPickupInfoInDestination) => {
      // 장바구니 o, 배송 정보에서 픽업장소 변경하기 위헤 넘어온 경우
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
        spotPickupId: pickupInfo.id!,
      };
      dispatch(SET_USER_DELIVERY_TYPE('spot'));
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      router.replace({
        pathname: '/cart/delivery-info',
        query: { isClosed: !!spotDetail?.closedDate },
      });
    };

    const handleSubsDeliveryType = () => {
      // TODO : 임시 구독 제외한 다른부분들도 확인필요
      destinationInfo.spotPickupId = store.getState().spot.spotPickupId;
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.replace({
        pathname: '/cart/delivery-info',
        query: { destinationId: spotDetail?.id, isSubscription: isSubs, subsDeliveryType, menuId },
      });
    };

    const handleSubsDeliveryTypeWithSpot = () => {
      destinationInfo.spotPickupId = store.getState().spot.spotPickupId;
      dispatch(SET_TEMP_DESTINATION(destinationInfo));
      dispatch(SET_USER_DELIVERY_TYPE(subsDeliveryType));
      router.replace({
        pathname: '/cart/delivery-info',
        query: { destinationId: spotDetail?.id, isSubscription: isSubs, subsDeliveryType, menuId },
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
      if (orderId) {
        // 마이페이지 - 배송정보 - 스팟 배송지 변경일 경우
        <PickupSheet pickupInfo={spotDetail?.pickups} spotType={spotDetail?.type} onSubmit={getDestinationInfo} />;
      }

      if (cartLists.length) {
        // 장바구니 o
        if (isDelivery) {
          // 장바구니 o, 배송 정보에서 넘어온 경우
          if (isSubs) {
            // 구독에서 넘어옴
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
          // 로그인 o, 장바구니 o, 스팟 검색에서 장바구니(cart)로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: (
                <PickupSheet
                  pickupInfo={spotDetail?.pickups}
                  spotType={spotDetail?.type}
                  onSubmit={getDestinationInfo}
                />
              ),
            })
          );
        }
      } else {
        // 장바구니 x
        if (isSubs) {
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
          // 로그인o and 장바구니 x, 장바구니(cart)로 이동
          dispatch(
            SET_BOTTOM_SHEET({
              content: (
                <PickupSheet
                  pickupInfo={spotDetail?.pickups}
                  spotType={spotDetail?.type}
                  onSubmit={getDestinationInfo}
                />
              ),
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

  const {
    data,
    error: spotError,
    isLoading,
  } = useQuery(
    'getSpotDetail',
    async () => {
      const { data } = await getSpotDetail(spotDetail?.id!);

      return data?.data;
    },
    {
      onSuccess: (data) => {
        dispatch(SPOT_ITEM(data));
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!spotDetail?.id,
    }
  );

  const { mutate: mutatePostSpotLike } = useMutation(
    async () => {
      const { data } = await postSpotLike(spotDetail?.id!);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getSpotDetail');
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  const { mutate: mutateDeleteSpotLike } = useMutation(
    async () => {
      const { data } = await deleteSpotLike(spotDetail?.id!);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getSpotDetail');
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '알 수 없는 에러가 발생했습니다.' }));
        console.error(error);
      },
    }
  );

  // 좋아요 버튼
  const hanlderLike = async () => {
    if (me) {
      if (spotDetail?.liked) {
        mutateDeleteSpotLike();
      } else {
        mutatePostSpotLike();
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
        <Wrapper>
          {!spotDetail?.isTrial && (
            <>
              <LikeWrapper>
                <LikeBtn onClick={hanlderLike}>
                  <SVGIcon name={spotDetail?.liked ? 'likeRed' : 'likeBlack'} />
                </LikeBtn>
                <TextH5B color={theme.white} padding="0 0 0 4px">
                  {spotDetail?.likeCount || 0}
                </TextH5B>
              </LikeWrapper>
              <Col />
            </>
          )}
          <BtnWrapper onClick={orderHandler}>
            <TextH5B color={theme.white}>{spotDetail?.isOpened ? '주문하기' : `${openDate}`}</TextH5B>
          </BtnWrapper>
          {spotDetail?.isOpened && spotDetail?.discountRate !== 0 && (
            <TooltipWrapper>
              <SpotDetailEventTooltip
                message={`${spotDetail?.discountRate}% 할인 중 (구독 상품 제외)`}
                bgColor={theme.brandColor}
                color={theme.white}
                minWidth="78px"
              />
            </TooltipWrapper>
          )}
        </Wrapper>
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

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 40px;
`;

const Col = styled.div`
  width: 1px;
  height: 24px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${theme.white};
`;

const BtnWrapper = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  text-align: center;
`;

const LikeBtn = styled.div`
  display: flex;
  cursor: pointer;
  svg {
    margin-bottom: 3px;
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: -17%;
  left: 38%;

  ${({ theme }) => theme.mobile`
    left: 34%;
  `};
`;

export default SpotDetailBottom;
