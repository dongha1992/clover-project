import React, { useState } from 'react';
import { ModalFullScreen } from '@components/Shared/Modal';
import { TextH5B } from '@components/Shared/Text';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SVGIcon } from '@utils/common';
import ViewerCarousel from './ViewerCarousel';
interface IProps {
  images: string[];
  startIndex?: number;
  isShow?: boolean;
  onClose: () => void;
}

const ImageViewer = ({ images=[], startIndex=0, isShow=false, onClose }: IProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(startIndex);
  const onChange = (changedIndex: number) => {
    setCurrentImageIndex(changedIndex);
  }

  return (
    isShow && (
    <ModalFullScreen height="300px" padding="10px" style={{ borderRadius: '8px'}}>
      <Container>
        <Header>
          <TextH5B color={theme.white}>
            {currentImageIndex + 1} / {images.length}
          </TextH5B>
          <div className="close" onClick={onClose}>
            <SVGIcon name="defaultCancel24White" />
          </div>
        </Header>
        <ViewerCarousel images={images} initialSlide={startIndex} onChange={onChange}/>
      </Container>
    </ModalFullScreen>) || null
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
  top: 5%;
  width: 100%;
  z-index: 1000001;

  .close {
    cursor: pointer;
    position: absolute;
    right: 24px;
    ${({ theme }) => theme.mobile`
      right:20%
  `};
  }
`;

export default React.memo(ImageViewer);
