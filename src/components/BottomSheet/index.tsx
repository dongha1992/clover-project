import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBottomSheet } from '@hooks/useBottomSheet';
import Content from '@components/BottomSheet/Content';
import { INIT_BOTTOM_SHEET, bottomSheetForm } from '@store/bottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { breakpoints } from '@utils/common/getMediaQuery';

/* TODO: height 조절해야함 */
/* TODO: height bottom 버튼 크기 만큼 위로 + translateY 비율로, 상수 X */

const BottomSheet = () => {
  const { sheetRef, contentRef, size } = useBottomSheet();
  const dispatch = useDispatch();
  const { content, height }: any = useSelector(bottomSheetForm);

  useEffect(() => {
    if (sheetRef.current && size.maxY) {
      sheetRef.current.style.setProperty('transform', `translateY(${-100}px)`);
    }
    document!.querySelector('html')!.style!.overflow! = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document!.querySelector('html')!.style!.overflow! = 'auto';
    };
  }, []);

  const closeBottmSheet = ({ target, currentTarget }: React.MouseEvent<HTMLDivElement>): void => {
    if (target !== currentTarget) {
      return;
    }
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Background onClick={closeBottmSheet}>
      <Container ref={sheetRef} height={height}>
        <BottomSheetContent ref={contentRef}>
          <Content content={content} />
        </BottomSheetContent>
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
  z-index: 1000;
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
  height: ${({ height }) => (height ? height : null)};
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

export default React.memo(BottomSheet);
