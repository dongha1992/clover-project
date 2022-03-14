import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import { SET_ALERT } from '@store/alert';
import { useDispatch, useSelector } from 'react-redux';
import { CheckTimerByDelivery } from '@components/CheckTimer';
import checkTimerLimitHelper from '@utils/checkTimerLimitHelper';
import { SET_TIMER_STATUS } from '@store/order';
import { orderForm } from '@store/order';
import { useToast } from '@hooks/useToast';
import { SET_CART_SHEET_OBJ } from '@store/cart';
import { CartSheet } from '@components/BottomSheet/CartSheet';
import { menuSelector } from '@store/menu';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
/*TODO: Like 리덕스로 받아서 like + 시 api 콜 */
/*TODO: 재입고 알림등 리덕스에서 메뉴 정보 가져와야 함 */

const DetailBottom = () => {
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { isTimerTooltip } = useSelector(orderForm);
  const { menuItem } = useSelector(menuSelector);

  const deliveryType = checkTimerLimitHelper();

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

  const clickButtonHandler = () => {
    if (!tempNotiOff) {
      dispatch(SET_CART_SHEET_OBJ(menuItem));
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

  useEffect(() => {
    const isNotTimer = ['스팟저녁', '새벽택배', '새벽택배N일', '스팟점심', '스팟점심N일'].includes(deliveryType);

    if (!isNotTimer) {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: true }));
    } else {
      dispatch(SET_TIMER_STATUS({ isTimerTooltip: false }));
    }
  }, []);

  return (
    <Container>
      <Wrapper>
        <LikeWrapper>
          <LikeBtn onClick={goToDib}>
            <SVGIcon name={tempIsLike ? 'likeRed' : 'likeBlack'} />
          </LikeBtn>
          <TextH5B color={theme.white} padding="0 0 0 4px">
            {menuItem.likeCount}
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper onClick={clickButtonHandler}>
          <TextH5B color={theme.white}>{buttonStatusRender(tempStatus)}</TextH5B>
        </BtnWrapper>
      </Wrapper>
      {isTimerTooltip && (
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
  /* height: 56px; */
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
  position: relative;
  padding: 16px 24px;
  display: flex;
  width: 100%;
  align-items: center;
`;

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
`;

const Col = styled.div`
  width: 1px;
  height: 26px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.white};
`;

const BtnWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const LikeBtn = styled.div``;
const TimerTooltipWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: -10%;
  left: 30%;

  ${({ theme }) => theme.mobile`
    left: 25%;
  `};
`;

export default DetailBottom;
