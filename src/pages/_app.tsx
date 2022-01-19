import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import GlobalStyle from '@styles/GlobalStyle';
import Wrapper from '@components/Layout/Wrapper';
import { theme } from '@styles/theme';
import { mediaQuery } from '@utils/getMediaQuery';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { wrapper } from '@store/index';
import { SET_IS_MOBILE } from '@store/common';
import MobileDetect from 'mobile-detect';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SET_LOGIN_SUCCESS, SET_USER } from '@store/user';
import { userProfile } from '@api/user';

/*TODO : _app에서 getInitialProps 갠춘? */
declare global {
  interface Window {
    Kakao: any;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();

  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  const store: any = useStore();

  useEffect(() => {
    if (typeof window === undefined) {
      const md = new MobileDetect(window.navigator.userAgent);
      let mobile = !!md.mobile();
      dispatch(SET_IS_MOBILE(mobile));
    }

    authCheck();
  }, []);

  // TODO : 로그인 상태에서 http://localhost:3000/ url 입력했을 때 /home화면으로 리다이렉트

  const authCheck = async () => {
    const { loginType } = store.getState().common;

    if (loginType !== 'NONMEMBER') {
      const userInfo = await userProfile().then((res) => {
        return res?.data;
      });

      if (userInfo?.code === 200) {
        dispatch(SET_USER(userInfo?.data));
        dispatch(SET_LOGIN_SUCCESS(true));
      }
    }
  };

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>

      <ThemeProvider
        theme={{ ...theme, ...mediaQuery, isWithContentsSection, isMobile }}
      >
        <GlobalStyle />
        <PersistGate persistor={store.__persistor}>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </PersistGate>
      </ThemeProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
