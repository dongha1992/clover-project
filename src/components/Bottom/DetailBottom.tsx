import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/common/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/common/getMediaQuery';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import { checkTimerLimitHelper } from '@utils/destination';
import { SET_TIMER_STATUS } from '@store/order';
import { orderForm } from '@store/order';
import { useToast } from '@hooks/useToast';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { menuSelector } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useRouter } from 'next/router';
import { destinationForm, INIT_DESTINATION, INIT_TEMP_DESTINATION } from '@store/destination';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { SUBS_INIT } from '@store/subscription';
import { checkMenuStatus } from '@utils/menu/checkMenuStatus';
import { userForm } from '@store/user';
import { ReopenSheet } from '@components/BottomSheet/ReopenSheet';
import { useMutation, useQueryClient } from 'react-query';
import { deleteNotificationApi, postLikeMenus, deleteLikeMenus } from '@api/menu';
import { IMenuDetail } from '@model/index';
import { last } from 'lodash-es';

const DetailBottom = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { menuItem: menuDetail } = useSelector(menuSelector);
  const { isTimerTooltip } = useSelector(orderForm);
  const { me } = useSelector(userForm);

  const [subsDeliveryType, setSubsDeliveryType] = useState<string>();
  const [subsDiscount, setSubsDiscount] = useState<string>();
  const { showToast, hideToast } = useToast();

  const { locationStatus } = useSelector(destinationForm);

  const deliveryType = checkTimerLimitHelper(locationStatus);

  const { mutate: mutatePostMenuLike } = useMutation(
    async () => {
      const { data } = await postLikeMenus({ menuId: menuDetail?.id! });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getMenuDetail');
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '??? ??? ?????? ????????? ??????????????????.' }));
        console.error(error);
      },
    }
  );

  const { mutate: mutateDeleteMenuLike } = useMutation(
    async () => {
      const { data } = await deleteLikeMenus({ menuId: menuDetail?.id! });
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries('getMenuDetail');
      },
      onMutate: async () => {},
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '??? ??? ?????? ????????? ??????????????????.' }));
        console.error(error);
      },
    }
  );
  const { mutate: mutateDeleteNotification } = useMutation(
    async () => {
      const { data } = await deleteNotificationApi(menuDetail?.id!);
    },
    {
      onSuccess: async () => {
        hideToast();
        showToast({ message: '????????? ???????????????!' });
        await queryClient.refetchQueries('getMenuDetail');
      },
      onError: async (error: any) => {
        dispatch(SET_ALERT({ alertMessage: '?????? ????????? ??????????????????.' }));
        console.error(error);
      },
    }
  );

  useEffect(() => {
    if (router.isReady && !menuDetail?.reopenNotificationRequested && menuDetail?.id && router.query.isReopen) {
      dispatch(SET_BOTTOM_SHEET({ content: <ReopenSheet menuId={menuDetail?.id!} isDetailBottom /> }));
    }
  }, [menuDetail?.id, router.isReady]);

  useEffect(() => {
    const isNotTimer = ['????????????', '????????????', '????????????N???', '????????????', '????????????N???'].includes(deliveryType);

    if (!isNotTimer) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  }, []);

  useEffect(() => {
    if (menuDetail?.type === 'SUBSCRIPTION') {
      if (menuDetail?.subscriptionPeriods?.includes('UNLIMITED')) {
        setSubsDiscount(`???????????? ?????? ${last(menuDetail?.subscriptionDiscountRates)}% ??????`);
      } else {
        setSubsDiscount(`?????? ${menuDetail?.subscriptionDiscountRates[3]}% ??????`);
      }
      if (menuDetail?.subscriptionDeliveries?.includes('SPOT')) {
        setSubsDeliveryType('SPOT');
      } else if (
        menuDetail?.subscriptionDeliveries?.includes('PARCEL') ||
        menuDetail?.subscriptionDeliveries?.includes('MORNING')
      ) {
        setSubsDeliveryType(menuDetail?.subscriptionDeliveries[0]);
      }
    }
  }, [menuDetail]);

  useEffect(() => {
    return () => hideToast();
  }, []);

  const goToLike = () => {
    if (!me) {
      goToLogin();
      return;
    }
    if (menuDetail?.liked) {
      mutateDeleteMenuLike();
    } else {
      mutatePostMenuLike();
    }
  };

  const buttonStatusRender = (menuDetail: IMenuDetail) => {
    const { isReopen, reopenNotificationRequested } = menuDetail!;
    const { isItemSold, checkIsBeforeThanLaunchAt } = checkMenuStatus(menuDetail || {});
    const isOpenSoon = !isItemSold && isReopen && checkIsBeforeThanLaunchAt.length > 0;
    const isReOpen = isItemSold && isReopen;
    const reOpenCondition = isOpenSoon || isReOpen;

    switch (true) {
      case isItemSold && !isReopen: {
        return '????????? ???????????????';
      }
      case reOpenCondition && !reopenNotificationRequested: {
        return '?????? ?????? ?????? ??????';
      }
      case reOpenCondition && reopenNotificationRequested: {
        return '?????? ?????? ????????????';
      }
      default: {
        return `???????????? ??????`;
      }
    }
  };

  const cartClickButtonHandler = (e: React.MouseEvent<HTMLElement>) => {
    const { innerHTML } = e.target as HTMLDivElement;
    const { isItemSold, checkIsBeforeThanLaunchAt } = checkMenuStatus(menuDetail!);

    switch (innerHTML) {
      case '????????? ???????????????': {
        return;
      }
      case '?????? ?????? ?????? ??????': {
        if (!me) {
          goToLogin();
          return;
        }
        dispatch(SET_BOTTOM_SHEET({ content: <ReopenSheet menuId={menuDetail?.id!} isDetailBottom /> }));
        return;
      }
      case '?????? ?????? ????????????': {
        if (!me) {
          goToLogin();
          return;
        }
        mutateDeleteNotification();
        return;
      }
      case '???????????? ??????': {
        if (!isItemSold) {
          dispatch(
            SET_BOTTOM_SHEET({
              content: <CartSheet menuItem={menuDetail} />,
            })
          );
        }

        return;
      }
      default: {
        return;
      }
    }
  };

  const goToLogin = () => {
    return dispatch(
      SET_ALERT({
        alertMessage: `???????????? ????????? ???????????????.\n????????? ????????????????`,
        submitBtnText: '??????',
        closeBtnText: '??????',
        onSubmit: () => router.push(`/onboarding?returnPath=${encodeURIComponent(location.pathname)}`),
      })
    );
  };

  const subscriptionButtonHandler = () => {
    dispatch(SUBS_INIT());
    dispatch(INIT_DESTINATION());
    dispatch(INIT_TEMP_DESTINATION());
    if (me) {
      router.push(`/subscription/set-info?menuId=${menuDetail?.id}&subsDeliveryType=${subsDeliveryType}`);
    } else {
      goToLogin();
    }
  };

  if (!menuDetail) {
    return <div></div>;
  }

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToLike}>
            <SVGIcon name={menuDetail?.liked ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="2px 0 0 4px">
            {menuDetail?.likeCount || 0}
          </TextH5B>
        </LikeWrapper>
        <Col />
        {menuDetail?.type === 'SUBSCRIPTION' ? (
          menuDetail?.isSold ? (
            <BtnWrapper>
              <TextH5B color={theme.white} pointer>
                ????????????
              </TextH5B>
            </BtnWrapper>
          ) : (
            <BtnWrapper onClick={subscriptionButtonHandler}>
              <TextH5B color={theme.white} pointer>
                <TootipWrapper>
                  <TimerTooltip message={subsDiscount} bgColor={theme.brandColor} color={theme.white} minWidth="0" />
                </TootipWrapper>
                ????????????
              </TextH5B>
            </BtnWrapper>
          )
        ) : (
          <BtnWrapper onClick={cartClickButtonHandler}>
            <TextH5B color={theme.white} pointer>
              {menuDetail && buttonStatusRender(menuDetail)}
            </TextH5B>
          </BtnWrapper>
        )}
      </Wrapper>
      {menuDetail?.type !== 'SUBSCRIPTION' && isTimerTooltip && (
        <TimerTooltipWrapper>
          <CheckTimerByDelivery isTooltip />
        </TimerTooltipWrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 10;
  left: calc(50%);
  background-color: ${({ theme }) => theme.black};

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
  padding: 0 24px;
  height: 56px;
  align-items: center;
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
  height: 26px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.white};
`;

const BtnWrapper = styled.div`
  position: relative;
  width: 100%;
  width: 400px;
  text-align: center;
`;

const LikeBtn = styled.div`
  display: flex;
  cursor: pointer;
`;
const TimerTooltipWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: -10%;
  left: 30%;

  ${({ theme }) => theme.mobile`
    left: 25%;
  `};
`;

const TootipWrapper = styled.article`
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  > div {
    position: relative;
    left: auto;
    top: auto;
  }
`;

export default DetailBottom;
