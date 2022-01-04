import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBottomSheet } from '@hooks/useBottomSheet';
import Content from '@components/BottomSheet/Content';
import { Button } from '@components/Shared/Button';
import { initBottomSheet, bottomSheetForm } from '@store/bottomSheet';
import { SET_CART_LISTS, cartForm } from '@store/cart';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@hooks/useToast';
import { breakpoints } from '@utils/getMediaQuery';
import { theme } from '@styles/theme';
/* TODO: height 조절해야함 */
/* TODO: height bottom 버튼 크기 만큼 위로 + translateY 비율로, 상수 X */

const BottomSheet = () => {
  const { sheetRef, contentRef, size, height } = useBottomSheet();
  const dispatch = useDispatch();
  const { content, buttonTitle }: any = useSelector(bottomSheetForm);
  const { tempSelectedMenus } = useSelector(cartForm);
  const { showToast, hideToast } = useToast();

  useEffect(() => {
    if (sheetRef.current && size.maxY) {
      sheetRef.current.style.setProperty('transform', `translateY(${-95}px)`);
    }
  }, []);

  const closeBottmSheet = ({
    target,
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>): void => {
    if (target !== currentTarget) {
      return;
    }
    dispatch(initBottomSheet());
  };

  const clickButtonHandler = () => {
    const isCart = buttonTitle.includes('장바구니');
    dispatch(initBottomSheet());

    /* TODO : redux 안에서 처리 하도록 로직 변경해야 함 */

    if (isCart) {
      dispatch(SET_CART_LISTS(tempSelectedMenus));
      setTimeout(() => {
        showToast({ message: '장바구니에 담겼습니다.' });
      }, 500);
    }
  };

  const initSpotFilterHandler = () => {};

  const renderButton = () => {
    switch (buttonTitle) {
      case '스팟필터': {
        return (
          <ButtonContainer>
            <Button
              height="100%"
              width="100%"
              borderRadius="0"
              onClick={initSpotFilterHandler}
            >
              전체 초기화
            </Button>
            <Col />
            <Button
              height="100%"
              width="100%"
              borderRadius="0"
              onClick={clickButtonHandler}
            >
              적용하기
            </Button>
          </ButtonContainer>
        );
      }
      default: {
        return (
          <ButtonContainer onClick={() => clickButtonHandler()}>
            <Button height="100%" width="100%" borderRadius="0">
              {buttonTitle}
            </Button>
          </ButtonContainer>
        );
      }
    }
  };

  return (
    <Background onClick={closeBottmSheet}>
      <Container ref={sheetRef} height={height}>
        <BottomSheetContent ref={contentRef}>
          <Content content={content} />
        </BottomSheetContent>
        {buttonTitle ? renderButton() : null}
      </Container>
    </Background>
  );
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: calc(50%);
  right: 0px;
  bottom: 0px;
  max-width: ${breakpoints.mobile}px;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const Container = styled.div<{ height: number | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: ${breakpoints.mobile}px;
  position: fixed;
  z-index: 100;

  left: calc(50%);
  right: 0;
  bottom: -98px;
  background-color: #fff;
  /* top: ${({ height }) => height}px; */
  /* height: 100%; */
  transition: transform 150ms ease-out;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 0;
  `};

  ${({ theme }) => theme.mobile`
    margin: 0 auto;
    left: 0
  `};
`;

const BottomSheetContent = styled.div`
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
  margin-bottom: 60px;
`;

const ButtonContainer = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 56px;
`;

const Col = styled.div`
  position: absolute;
  left: 50%;
  bottom: 25%;
  background-color: ${theme.white};
  width: 1px;
  height: 50%;
`;

export default React.memo(BottomSheet);
