import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import GlobalStyle from '@styles/GlobalStyle';
import Wrapper from '@components/Layout/Wrapper';
import { theme } from '@styles/theme';
import { mediaQuery } from '@utils/getMediaQuery';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { wrapper } from '@store/index';
import { SET_IS_MOBILE, INIT_IMAGE_VIEWER } from '@store/common';
import MobileDetect from 'mobile-detect';
import { Stage } from '@enum/index';
import { ReactQueryDevtools } from 'react-query/devtools';
import Script from 'next/script';
import { commonSelector } from '@store/common';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SET_LOGIN_SUCCESS, SET_USER, userForm } from '@store/user';
import { userProfile } from '@api/user';
import { getCookie } from '@utils/cookie';

/*TODO : _app에서 getInitialProps 갠춘? */
declare global {
  interface Window {
    Kakao: any;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const dispatch = useDispatch();
  const queryClient = useRef<QueryClient>();

  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  const store: any = useStore();
  const { me } = useSelector(userForm);
  const isAutoLogin = getCookie({ name: 'autoL' });

  if (!queryClient.current) {
    queryClient.current = new QueryClient({
      defaultOptions: {
        queries: {
          // retry: process.env.STAGE === Stage.Development ? false : 3,
          // refetchOnWindowFocus: false,
          // refetchOnMount: false,
          // staleTime: 10000,
        },
      },
    });
  }

  useEffect(() => {
    if (typeof window === undefined) {
      const md = new MobileDetect(window.navigator.userAgent);
      let mobile = !!md.mobile();
      dispatch(SET_IS_MOBILE(mobile));
    }

    authCheck();

    // temp
    dispatch(INIT_IMAGE_VIEWER());
  }, []);

  const authCheck = async () => {
    try {
      if (sessionStorage.accessToken) {
        const { data } = await userProfile();
        if (data.code === 200) {
          data.data.nickName ??= data.data.name;
          data.data.nickName ||= data.data.name;
          dispatch(SET_USER(data.data));
          dispatch(SET_LOGIN_SUCCESS(true));
        }
      } else {
        if (isAutoLogin === 'Y') {
          const { data } = await userProfile();
          if (data.code === 200) {
            data.data.nickName ??= data.data.name;
            data.data.nickName ||= data.data.name;
            dispatch(SET_USER(data.data));
            dispatch(SET_LOGIN_SUCCESS(true));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>
      <QueryClientProvider client={queryClient.current}>
        <ThemeProvider theme={{ ...theme, ...mediaQuery, isWithContentsSection, isMobile }}>
          <GlobalStyle />
          <PersistGate persistor={store.__persistor}>
            <Wrapper>
              <ReactQueryDevtools initialIsOpen={false} />
              <Component {...pageProps} />
              <Script src="https://developers.kakao.com/sdk/js/kakao.js"></Script>
              <Script
                type="text/javascript"
                src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
              ></Script>
              <Script
                type="text/javascript"
                src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=b298p0vcq4&callback=initMap"
              ></Script>
            </Wrapper>
          </PersistGate>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
