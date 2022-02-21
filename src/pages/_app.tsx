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
import { SET_IS_MOBILE } from '@store/common';
import MobileDetect from 'mobile-detect';
import { Stage } from '@enum/index';
import { ReactQueryDevtools } from 'react-query/devtools';
import { commonSelector } from '@store/common';
import { userForm } from '@store/user';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

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
  const { me } = useSelector(userForm);
  const { loginType, isAutoLogin } = useSelector(commonSelector);

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

  const authCheck = async () => {
    try {
      if (loginType !== 'NONMEMBER' && sessionStorage.accessToken) {
        const { data } = await userProfile();
        if (data.code === 200) {
          dispatch(SET_USER(data.data));
          dispatch(SET_LOGIN_SUCCESS(true));
        }
      } else {
        if (isAutoLogin) {
          const { data } = await userProfile();
          if (data.code === 200) {
            dispatch(SET_USER(data.data));
            dispatch(SET_LOGIN_SUCCESS(true));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (typeof window === undefined) {
      const md = new MobileDetect(window.navigator.userAgent);
      let mobile = !!md.mobile();
      dispatch(SET_IS_MOBILE(mobile));
    }
  }, []);

  useEffect(() => {
    authCheck();
  }, [me]);
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
            </Wrapper>
          </PersistGate>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
