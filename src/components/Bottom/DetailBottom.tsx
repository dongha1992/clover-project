import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import SVGIcon from '@utils/SVGIcon';
import { TextH5B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { breakpoints } from '@utils/getMediaQuery';
import { useToast } from '@hooks/useToast';
import { setAlert } from '@store/alert';
import { useDispatch } from 'react-redux';
import { TimerTooltip } from '@components/Shared/Tooltip';

/*TODO: Like 리덕스로 받아서 like + 시 api 콜 */
/*TODO: 재입고 알림등 리덕스에서 메뉴 정보 가져와야 함s*/

const DetailBottom = () => {
  const [tempIsLike, setTempIsLike] = useState<boolean>(false);
  const [isFirstToastRender, setIsFirstToastRender] = useState<boolean>(true);
  const { showToast, hideToast } = useToast();
  const dispatch = useDispatch();

  //temp
  const numOfLike = 10;
  const tempStatus = 'isSoldout';
  const tempNotiOff = false;
  const isAlreadyStockNoti = true;

  const goToDib = useCallback(() => {
    setTempIsLike((prev) => !prev);
  }, [tempIsLike]);

  useEffect(() => {
    setIsFirstToastRender(false);
  }, []);

  useEffect(() => {
    /* TODO : 렌더 시 처음에 alert 뜨는 거 */
    if (isFirstToastRender) return;
    /* TODO: 빠르게 눌렀을 때 toast 메시지 엉킴 */
    const message =
      tempIsLike === true ? '상품을 찜했어요.' : '찜을 해제했어요.';
    showToast({ message });
    /* TODO: warning 왜? */

    return () => hideToast();
  }, [goToDib]);

  const buttonStatusRender = useCallback((status: string) => {
    switch (status) {
      case 'isSoldout': {
        return '일시품절·재입고 알림받기';
      }
      default: {
        return `5시까지 주문하면 내일 새벽 7시전 도착`;
      }
    }
  }, []);

  const goToRestockSetting = () => {};

  const clickButtonHandler = () => {
    if (tempNotiOff) {
      const restockMgs = '재입고 알림 신청을 위해 알림을 허용해주세요.';
      dispatch(
        setAlert({
          alertMessage: restockMgs,
          onSubmit: () => {
            goToRestockSetting();
          },
          submitBtnText: '설정 앱 이동',
          closeBtnText: '취소',
        })
      );
    } else {
      const message = isAlreadyStockNoti
        ? '이미 재입고 알림 신청한 상품이에요!'
        : '재입고 알림 신청을 완료했어요!';
      showToast({ message });
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
            {tempIsLike ? numOfLike + 1 : numOfLike}
          </TextH5B>
        </LikeWrapper>
        <Col />
        <BtnWrapper onClick={clickButtonHandler}>
          <TextH5B color={theme.white}>
            {buttonStatusRender(tempStatus)}
          </TextH5B>
        </BtnWrapper>
      </Wrapper>
      <TimerTooltip
        message={'새벽배송 마감 30:00 전 (내일 새벽 7시 전 도착)'}
        bgColor={theme.brandColor}
        color={theme.white}
        minWidth="78px"
      />
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
  height: 56px;
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
  height: 24px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ theme }) => theme.white};
`;

const BtnWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const LikeBtn = styled.div``;

export default DetailBottom;
