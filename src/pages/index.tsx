import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { HomePopupSheet }  from '@components/BottomSheet/HomePopupSheet';
import { AppDownloadPushSheet } from '@components/BottomSheet/AppDownloadPushSheet';
import { WelcomeSheet } from '@components/BottomSheet/WelcomeSheet';
import useIsApp from '@hooks/useIsApp';
import { commonSelector } from '@store/common';

const HomePage = () => {
  const dispatch = useDispatch();
  const isApp = useIsApp();
  const { isMobile } = useSelector(commonSelector);
  const pathnameHome = window.location.pathname.indexOf('/') !== -1;

  const { 
    data: fetchBanner, 
    error: popupBannerError 
  } = useQuery(
    'getPopupBannerList',
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

  console.log(isMobile)

  useEffect(()=> {
    const getHomePopupKey = localStorage.getItem('HOMEMAIN_POPUP_CLOSE');
    const getLookAroundKey = localStorage.getItem('LOOKAROUND_POPUP_CLOSE');
    const currentData = new Date().getTime();

  if(pathnameHome){
    if (JSON.parse(getHomePopupKey!) === null || JSON.parse(getHomePopupKey!) < currentData) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <HomePopupSheet bannerList={fetchBanner!} closeHandler={closeHandler} onClick={popupTodayCloseHandler} />,
        })
      );
    };
    if (isMobile && !isApp && 
        (JSON.parse(getLookAroundKey!) === null || 
          JSON.parse(getLookAroundKey!) < currentData)) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <AppDownloadPushSheet closeHandler={lookAroundHandler} onClick={goToAppLink} />,
          noneMarginBottom: true,
          dimmedHandler: () => {
            lookAroundHandler();
          }
        })
      );  
    };
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBanner]);

  const closeHandler = () => {
    dispatch(INIT_BOTTOM_SHEET());
  };

  const popupTodayCloseHandler = () => {
    let midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    localStorage.setItem('HOMEMAIN_POPUP_CLOSE', midnight.getTime()?.toString());
    dispatch(INIT_BOTTOM_SHEET());
  };

  const goToAppLink = () => {};

  const lookAroundHandler = () => {
    let midnight = new Date();
    midnight.setHours(23, 59, 59, 0);
    localStorage.setItem('LOOKAROUND_POPUP_CLOSE', midnight.getTime()?.toString());
    dispatch(INIT_BOTTOM_SHEET());
  };

  return (
    <Container>
      <Home />
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default HomePage;
