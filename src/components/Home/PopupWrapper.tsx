import React, { useEffect, Children } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersApi } from '@api/banner';
import { useQuery } from 'react-query';
import { SET_BOTTOM_SHEET, INIT_BOTTOM_SHEET } from '@store/bottomSheet';
import { HomePopupSheet } from '@components/BottomSheet/HomePopupSheet';
import { AppDownloadPushSheet } from '@components/BottomSheet/AppDownloadPushSheet';
import useIsApp from '@hooks/useIsApp';
import { commonSelector } from '@store/common';

interface IProps {
  children: React.ReactNode;
}

const PopupWrapper = ({ children }: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const isApp = useIsApp();
  const { isMobile } = useSelector(commonSelector);
  const pathnameHome = window.location.pathname.indexOf('/') !== -1;
  const dynamicLink = 'https://freshcodeclover.page.link/DtUc';
  const { data: fetchBanner, error: popupBannerError } = useQuery(
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

  useEffect(() => {
    const getHomePopupKey = localStorage.getItem('HOMEMAIN_POPUP_CLOSE');
    const getLookAroundKey = localStorage.getItem('LOOKAROUND_POPUP_CLOSE');
    const currentData = new Date().getTime();

    setTimeout(() => {
      if (pathnameHome) {
        if (
          isMobile &&
          isApp === false &&
          (JSON.parse(getLookAroundKey!) === null || JSON.parse(getLookAroundKey!) < currentData)
        ) {
          dispatch(
            SET_BOTTOM_SHEET({
              content: <AppDownloadPushSheet closeHandler={lookAroundHandler} href={dynamicLink} />,
              noneMarginBottom: true,
              dimmedHandler: () => {
                lookAroundHandler();
              },
            })
          );
        } else if (
          (isApp !== null && fetchBanner?.length! > 0 && JSON.parse(getHomePopupKey!) === null) ||
          JSON.parse(getHomePopupKey!) < currentData
        ) {
          dispatch(
            SET_BOTTOM_SHEET({
              content: (
                <HomePopupSheet
                  bannerList={fetchBanner!}
                  closeHandler={closeHandler}
                  onClick={popupTodayCloseHandler}
                />
              ),
            })
          );
        }
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBanner, isApp]);

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

  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: 100%;
`;

export default PopupWrapper;
