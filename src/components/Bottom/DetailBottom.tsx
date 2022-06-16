import React, { useState, useEffect, useCallback } from 'react';
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
import { menuSelector, SET_MENU_ITEM } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { useQuery } from 'react-query';
import { getMenuDetailApi } from '@api/menu';
import { useRouter } from 'next/router';
import { INIT_DESTINATION, INIT_TEMP_DESTINATION } from '@store/destination';
import { TimerTooltip } from '@components/Shared/Tooltip';
import { SUBS_INIT } from '@store/subscription';
import { userForm } from '@store/user';
/*TODO: Like 리덕스로 받아서 like + 시 api 콜 */
/*TODO: 재입고 알림등 리덕스에서 메뉴 정보 가져와야 함 */

const DetailBottom = () => {
  const router = useRouter();
  const [menuDetailId, setMenuDetailId] = useState<number>();
  const [subsDeliveryType, setSubsDeliveryType] = useState<string>();
  const [subsDiscount, setSubsDiscount] = useState<string>();
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { isTimerTooltip } = useSelector(orderForm);
  const { menuItem } = useSelector(menuSelector);
  const deliveryType = checkTimerLimitHelper();
  const { isLoginSuccess } = useSelector(userForm);

  useEffect(() => {
    if (router.isReady) {
      setMenuDetailId(Number(router.query.menuId));
    }
  }, [router.isReady]);

  useEffect(() => {
    const isNotTimer = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

    if (!isNotTimer) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  }, []);

  const {
    data: menuDetail,
    error: menuError,
    isLoading,
  } = useQuery(
    ['getMenuDetail'],
    async () => {
      const { data } = await getMenuDetailApi(menuDetailId!);
      return data.data;
    },

    {
      onSuccess: (data) => {},
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: !!menuDetailId,
    }
  );

  useEffect(() => {
    if (menuDetail?.subscriptionPeriods?.includes('UNLIMITED')) {
      setSubsDiscount('정기구독 최대 15% 할인');
    } else {
      setSubsDiscount('최대 9% 할인');
    }
    if (menuDetail?.subscriptionDeliveries?.includes('SPOT')) {
      setSubsDeliveryType('SPOT');
    } else if (
      menuDetail?.subscriptionDeliveries?.includes('PARCEL') ||
      menuDetail?.subscriptionDeliveries?.includes('MORNING')
    ) {
      setSubsDeliveryType('PARCEL');
    }
  }, [menuDetail]);

  // const tempStatus = 'isSoldout';
  const tempStatus = '';
  const tempNotiOff = false;
  const isAlreadyStockNoti = false;

  const goToDib = useCallback(() => {
    setTempIsLike((prev) => !prev);
  }, [tempIsLike]);

  const buttonStatusRender = useCallback((status: string) => {
    switch (status) {
      case 'isSoldout': {
        return '일시품절·재입고 알림받기';
      }
      default: {
        return `장바구니 담기`;
      }
    }
  }, []);

  const goToRestockSetting = () => {};

  const cartClickButtonHandler = () => {
    if (!tempNotiOff) {
      /* TODO: 이거 뭔지 확인 */
      dispatch(SET_MENU_ITEM(menuItem));
      dispatch(
        SET_BOTTOM_SHEET({
          content: <CartSheet />,
        })
      );
      return;
    }

    if (tempNotiOff) {
      const restockMgs = '재입고 알림 신청을 위해 알림을 허용해주세요.';
      dispatch(
        SET_ALERT({
          alertMessage: restockMgs,
          onSubmit: () => {
            goToRestockSetting();
          },
          submitBtnText: '설정 앱 이동',
          closeBtnText: '취소',
        })
      );
    } else {
      const message = isAlreadyStockNoti ? '이미 재입고 알림 신청한 상품이에요!' : '재입고 알림 신청을 완료했어요!';
      showToast({ message });
    }
  };

  const subscriptionButtonHandler = () => {
    dispatch(SUBS_INIT());
    dispatch(INIT_DESTINATION());
    dispatch(INIT_TEMP_DESTINATION());
    if (isLoginSuccess) {
      router.push(`/subscription/set-info?menuId=${menuDetailId}&subsDeliveryType=${subsDeliveryType}`);
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToDib}>
            <SVGIcon name={tempIsLike ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="0 0 0 4px">
            {menuItem.likeCount ? menuItem.likeCount : 0}
          </TextH5B>
        </LikeWrapper>
        <Col />
        {menuDetail?.type === 'SUBSCRIPTION' ? (
          <BtnWrapper onClick={subscriptionButtonHandler}>
            <TextH5B color={theme.white} pointer>
              <TootipWrapper>
                <TimerTooltip message={subsDiscount} bgColor={theme.brandColor} color={theme.white} minWidth="0" />
              </TootipWrapper>
              구독하기
            </TextH5B>
          </BtnWrapper>
        ) : (
          <BtnWrapper onClick={cartClickButtonHandler}>
            <TextH5B color={theme.white} pointer>
              {buttonStatusRender(tempStatus)}
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
  text-align: center;
`;

const LikeBtn = styled.div`
  display: flex;
  cursor: pointer;
  svg {
    margin-bottom: 3px;
  }
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
