import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBottomSheet } from '@hooks/useBottomSheet';
import Content from '@components/BottomSheet/Content';
import Button from '@components/Button';
import { initBottomSheet, bottomSheetForm } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../hooks/useToast';
import router from 'next/router';
import { breakpoints } from '@utils/getMediaQuery';
/* TODO: height 조절해야함 */
/* TODO: height bottom 버튼 크기 만큼 위로 + translateY 비율로, 상수 X */

function BottomSheet() {
  const { sheetRef, contentRef, size, height } = useBottomSheet();
  const dispatch = useDispatch();
  const { content, buttonTitle }: any = useSelector(bottomSheetForm);
  const { showToast } = useToast();

  useEffect(() => {
    if (sheetRef.current && size.maxY) {
      sheetRef.current.style.setProperty('transform', `translateY(${-100}px)`);
    }
  }, []);

  const clickButtonHandler = () => {
    const isCart = buttonTitle.includes('장바구니');
    dispatch(initBottomSheet());
    if (isCart) {
      router.push('/').then((res) => {
        setTimeout(() => {
          showToast({ message: '장바구니에 담겼습니다.' });
        }, 1000);
      });
    }
    /* TODO: 장바구니 add 로직 */
  };

  return (
    <Background>
      <Container ref={sheetRef} height={height}>
        <BottomSheetContent ref={contentRef}>
          <Content content={content} />
        </BottomSheetContent>
        <ButtonContainer onClick={() => clickButtonHandler()}>
          <Button
            height="48px"
            width="100%"
            margin="0 8px 0 0"
            borderRadius="0"
          >
            {buttonTitle}
          </Button>
        </ButtonContainer>
      </Container>
    </Background>
  );
}

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
  z-index: 10000;

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
  margin-bottom: 50px;
`;

const ButtonContainer = styled.div`
  z-index: 10000;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
`;

export default BottomSheet;
