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
  // ?????? ?????????
  const dt = new Date(spotDetail?.openedAt!);
  const openDate = `${dt?.getMonth() + 1}??? ${dt.getDate()}??? ${dt.getHours()}??? ?????? ???????????????.`;

  // ?????? ???????????? - ?????? ?????? ???????????? ??????
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
      // ????????? o, ?????? ?????? ????????? ????????????(cart)??? ????????? ??????
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
        const { data } = await postDestinationApi(reqBody); // ????????? id ?????? ?????? api ??????
        if (data.code === 200) {
          const response = data.data;
          const destinationId = response.id;
          if (orderId) {
            // ??????????????? - ???????????? - ?????? ????????? ????????? ??????
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
      // ???????????? o, ?????? ???????????? ???????????? ???????????? ?????? ????????? ??????
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
      // TODO : ?????? ?????? ????????? ?????????????????? ????????????
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
      // ?????? ?????? ????????? ?????? - ?????? ??????
      return;
    }
    if (spotDetail?.isClosed) {
      // ?????? ????????? ?????? - ?????? ??????
      return;
    }
    if (isLoginSuccess) {
      //????????? o
      if (orderId) {
        // ??????????????? - ???????????? - ?????? ????????? ????????? ??????
        <PickupSheet pickupInfo={spotDetail?.pickups} spotType={spotDetail?.type} onSubmit={getDestinationInfo} />;
      }

      if (cartLists.length) {
        // ???????????? o
        if (isDelivery) {
          // ???????????? o, ?????? ???????????? ????????? ??????
          if (isSubs) {
            // ???????????? ?????????
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
            // ???????????? o , ?????? ???????????? ????????? ??????
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
          // ????????? o, ???????????? o, ?????? ???????????? ????????????(cart)??? ??????
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
        // ???????????? x
        if (isSubs) {
          // ???????????? ?????????
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
          // ?????????o and ???????????? x, ????????????(cart)??? ??????
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
      // ?????????x, ????????? ??????
      dispatch(
        SET_ALERT({
          alertMessage: `???????????? ????????? ???????????????.\n????????? ????????????????`,
          submitBtnText: '??????',
          closeBtnText: '??????',
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
        dispatch(SET_ALERT({ alertMessage: '??? ??? ?????? ????????? ??????????????????.' }));
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
        dispatch(SET_ALERT({ alertMessage: '??? ??? ?????? ????????? ??????????????????.' }));
        console.error(error);
      },
    }
  );

  // ????????? ??????
  const hanlderLike = async () => {
    if (me) {
      if (spotDetail?.liked) {
        mutateDeleteSpotLike();
      } else {
        mutatePostSpotLike();
      }
    } else {
      const TitleMsg = `???????????? ????????? ???????????????.\n????????? ????????????????`;
      dispatch(
        SET_ALERT({
          alertMessage: TitleMsg,
          onSubmit: () => {
            router.push('/onboarding');
          },
          submitBtnText: '??????',
          closeBtnText: '??????',
        })
      );
    }
  };

  return (
    <Container isClosed={spotDetail?.isClosed}>
      {spotDetail?.isClosed ? (
        <Wrapper>
          <BtnWrapper>
            <TextH5B color={theme.greyScale25}>?????? ????????? ?????????????????????</TextH5B>
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
            <TextH5B color={theme.white}>{spotDetail?.isOpened ? '????????????' : `${openDate}`}</TextH5B>
          </BtnWrapper>
          {spotDetail?.isOpened && spotDetail?.discountRate !== 0 && (
            <TooltipWrapper>
              <SpotDetailEventTooltip
                message={`${spotDetail?.discountRate}% ?????? ??? (?????? ?????? ??????)`}
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
