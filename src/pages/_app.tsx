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
import { useDispatch } from 'react-redux';
import { wrapper } from '@store/index';
import { SET_IS_MOBILE } from '@store/common';
import MobileDetect from 'mobile-detect';
import { Stage } from '@enum/index';
import { ReactQueryDevtools } from 'react-query/devtools';

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
  const queryClient = useRef<QueryClient>();

  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  const store: any = useStore();

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
  }, []);

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
      <QueryClientProvider client={queryClient.current}>
        <ThemeProvider
          theme={{ ...theme, ...mediaQuery, isWithContentsSection, isMobile }}
        >
          <GlobalStyle />
          <PersistGate persistor={store.__persistor}>
            <Wrapper>
              <ReactQueryDevtools initialIsOpen={false} />
              <Component {...pageProps} />
            </Wrapper>
          </PersistGate>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
