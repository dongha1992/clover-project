import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Home from '@components/Home';
import Footer from '@components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { IBanners } from '@model/index';
import { useQuery } from 'react-query';
import { SET_BOTTOM_SHEET } from '@store/bottomSheet';
import { HomePopupSheet }  from '@components/BottomSheet/HomePopupSheet';
import { AppDownloadPushSheet } from '@components/BottomSheet/AppDownloadPushSheet';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(()=> {
    const getMidNight = localStorage.getItem('popupClose');
    const currentData = new Date().getTime();
  
    if (JSON.parse(getMidNight!) === null || JSON.parse(getMidNight!) < currentData) {
      dispatch(
        SET_BOTTOM_SHEET({
          content: <HomePopupSheet />,
        })
      );  
    }

    dispatch(
      SET_BOTTOM_SHEET({
        content: <AppDownloadPushSheet />,
        noneMarginBottom: true,
      })
    );  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
