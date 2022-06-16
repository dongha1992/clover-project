import React, { useState } from 'react';
import Carousel from '@components/Shared/Carousel';
import styled from 'styled-components';
import { TextH6B } from '@components/Shared/Text';
import { theme } from '@styles/theme';
import { IBanners } from '@model/index';

interface IProps {
  bannerList: IBanners[];
}

const Banner = ({ bannerList }: IProps) => {
  const [currentImg, setCurrentImg] = useState(0);

  const totalLength = bannerList.length;

  if (bannerList.length === 0) {
    return <div>로딩중</div>;
  }

  return (
    <Container>
      <Carousel images={bannerList} setCountIndex={setCurrentImg} />
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

export default React.memo(Banner);
