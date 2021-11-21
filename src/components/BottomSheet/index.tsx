import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBottomSheet } from '@hooks/useBottomSheet';
import Content from '@components/BottomSheet/Content';
import Button from '@components/Button';
import { initBottomSheet, bottomSheetForm } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';

/* TODO: height 조절해야함 */

function BottomSheet() {
  const { sheetRef, contentRef, size, height } = useBottomSheet();
  const dispatch = useDispatch();
  const { content, buttonTitle }: any = useSelector(bottomSheetForm);

  useEffect(() => {
    if (sheetRef.current && size.maxY) {
      sheetRef.current.style.setProperty(
        'transform',
        `translateY(${size.minY - size.maxY}px)`
      );
    }
  }, []);

  const clickButtonHandler = () => {
    dispatch(initBottomSheet());
  };

  return (
    <Background>
      <Container ref={sheetRef} height={height}>
        <BottomSheetContent ref={contentRef}>
          <Content content={content} />
        </BottomSheetContent>
      </Container>
      <ButtonContainer onClick={() => clickButtonHandler()}>
        <Button height="48px" width="100%" margin="0 8px 0 0" borderRadius="0">
          {buttonTitle}
        </Button>
      </ButtonContainer>
    </Background>
  );
}

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: calc(50% + 28px);
  right: 0px;
  bottom: 0px;
  max-width: 504px;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
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
  max-width: 504px;
  position: fixed;
  z-index: 10000;
  top: ${({ height }) => height}px;
  left: calc(50% + 28px);
  right: 0;

  background-color: #fff;
  height: ${({ height }) => height}px;
  transition: transform 150ms ease-out;

  ${({ theme }) => theme.desktop`
    margin: 0 auto;
    left: 50%;
    margin-left: -252px;
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
`;

const ButtonContainer = styled.div`
  z-index: 10000;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
`;

export default BottomSheet;
