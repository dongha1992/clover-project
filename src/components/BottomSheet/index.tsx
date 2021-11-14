import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBottomSheet } from '@hooks/useBottomSheet';
import useDimensions from '@hooks/useDimensions';
import Content from '@components/BottomSheet/Content';

type TProps = {
  isActive: boolean;
};

function BottomSheet({ isActive }: TProps) {
  const { sheetRef, contentRef, size, height } = useBottomSheet();

  console.log(size, height);

  useEffect(() => {}, []);

  return (
    <Container ref={sheetRef} height={height}>
      <BottomSheetContent>
        <Content />
      </BottomSheetContent>
    </Container>
  );
}

const Container = styled.div<{ height: number | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 1024px;
  position: fixed;
  z-index: 1;
  top: ${({ height }) => height}px;
  left: 0;
  right: 0;

  margin: 0 auto;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  height: ${({ height }) => height}px;
  transition: transform 150ms ease-out;
`;
const BottomSheetContent = styled.div`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

export default BottomSheet;
