import React, { useEffect } from 'react';
import styled from 'styled-components';
import { bottomSheetButton, theme } from '@styles/theme';
import { Button } from '@components/Shared/Button';
import Carousel from "@components/Shared/Carousel";
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { INIT_BOTTOM_SHEET } from '@store/bottomSheet';

const HomePopupSheet = () => {
  const dispatch = useDispatch();

  useEffect(()=> {
  }, []);

  const { data: popupBanner, error: popupBannerError } = useQuery(
    'homepopupBanner',
    async () => {
      const params = { type: 'POPUP', size: 100 };
      const { data } = await getBannersApi(params);
      return data.data;
    },
    { 
      refetchOnMount: true, 
      refetchOnWindowFocus: false, 
    }
  );

  const popupTodayCloseHandler = () => {
    let midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    localStorage.setItem('popupClose', midnight.getTime()?.toString());
    dispatch(INIT_BOTTOM_SHEET());
  };
 
  const closeHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <ImageWrapper>
        <Carousel 
          images={popupBanner?.map((banner: IBanners) => ({ src: banner.image.url }))} 
          noneArrow
          width='512px'
          height='270px' 
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
          onClick={popupTodayCloseHandler}
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
