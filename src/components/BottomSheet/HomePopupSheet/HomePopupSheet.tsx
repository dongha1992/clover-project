import React from 'react';
import styled from 'styled-components';
import { bottomSheetButton, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import Carousel from "@components/Shared/Carousel";
import { IBanners } from '@model/index';

interface IProps {
  bannerList: IBanners[];
  onClick: () => void;
  closeHandler: () => void;
}

const HomePopupSheet = ({bannerList, onClick, closeHandler}: IProps): JSX.Element => {
  return (
    <Container>
      <ImageWrapper>
        <Carousel 
          images={bannerList?.map((banner: IBanners) => ({ src: banner.image.url }))} 
          noneArrow
          width='512px'
          height='384px' 
        />
      </ImageWrapper>
      <BtnWrapper>
        <Button 
          width="80%" 
          height='100%'
          borderRadius="0" 
          color={theme.black} 
          backgroundColor={theme.white} 
          fontWeight={400}
          justifyContent='flex-start'
          padding='0 0 0 35px'
          onClick={onClick}
        >
          오늘 하루 그만보기
        </Button>
        <Button 
          onClick={closeHandler}
          width="20%"
          height='100%'
          borderRadius="0" 
          color={theme.black} 
          backgroundColor={theme.white}
        >
          닫기
        </Button>
      </BtnWrapper>
    </Container>
  )
};

const Container = styled.div`
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const BtnWrapper = styled.div`
  ${bottomSheetButton}
`;

export default React.memo(HomePopupSheet);
