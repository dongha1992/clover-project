import React, { useState, useEffect } from 'react';
import { ModalFullScreen } from '@components/Shared/Modal';
import Carousel from '@components/Shared/Carousel';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import { useDispatch } from 'react-redux';
import { INIT_IMAGE_VIEWER } from '@store/common';

const ImageViewer = ({ images }: any) => {
  const [currentImg, setCurrentImg] = useState(0);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(INIT_IMAGE_VIEWER());
  };

  const totalImg = images.length;

  return (
    <ModalFullScreen height={'300px'} padding="10px" style={{ borderRadius: '8px' }}>
      <Container>
        <Header>
          <TextH5B color={theme.white}>
            {currentImg + 1}/{totalImg}
          </TextH5B>
          <div className="close" onClick={closeModal}>
            <SVGIcon name="defaultCancel24White" />
          </div>
        </Header>
        <Carousel images={images} setCountIndex={setCurrentImg} />
      </Container>
    </ModalFullScreen>
  );
};

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

export default React.memo(ImageViewer);
