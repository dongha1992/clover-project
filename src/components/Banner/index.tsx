import React, { useState } from 'react';
import Carousel from '@components/Shared/Carousel';
import styled from 'styled-components';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';

/*TODO : 왼쪽오른쪽 버튼 */

const BANNERS = [
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
  './images/img1.png',
];

const Banner = () => {
  const [currentImg, setCurrentImg] = useState(0);

  const totalLength = BANNERS.length;
  return (
    <Container>
      <Carousel images={BANNERS} setCountIndex={setCurrentImg} />
      <Count>
        <TextH6B color={theme.white}>{currentImg + 1}</TextH6B>
        <TextH6B color={theme.white} padding="0 4px">
          /
        </TextH6B>
        <TextH6B color={theme.white}>{totalLength}</TextH6B>
      </Count>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 46px;
  background: rgba(36, 36, 36, 0.5);
  right: 5%;
  bottom: 5%;
  padding: 4px 8px 2px;
  border-radius: 24px;
`;

export default Banner;
