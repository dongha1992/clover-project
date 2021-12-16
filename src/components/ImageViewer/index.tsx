import React from 'react';
import ModalFullScreen from '../../components/Modal/ModalFullScreen';
import Carousel from '@components/Carousel';
import { TextH5B } from '@components/Text';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import SVGIcon from '@utils/SVGIcon';

function ImageViewer({ images }: any) {
  const closeModal = () => {};
  return (
    <ModalFullScreen
      height={'300px'}
      padding="10px"
      style={{ borderRadius: '8px' }}
    >
      <Container>
        <Header>
          <TextH5B color={theme.white}>1/2</TextH5B>
          <div className="close" onClick={closeModal}>
            <SVGIcon name="defaultCancel24White" />
          </div>
        </Header>
        <Carousel images={images} />
      </Container>
    </ModalFullScreen>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10%;
  width: 100%;
  z-index: 1000001;

  .close {
    position: absolute;
    right: 10%;
    ${({ theme }) => theme.mobile`
      right:20%
  `};
  }
`;

export default ImageViewer;
