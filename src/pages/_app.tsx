import type { AppProps } from 'next/app';
import Head from 'next/head';
import GlobalStyle from '@styles/GlobalStyle';
import Wrapper from '@components/Layout/Wrapper';
import { theme } from '@styles/theme';
import { mediaQuery } from '@utils/getMediaQuery';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Provider } from 'react-redux';
import wrapper from '@store/index';
import { SET_IS_MOBILE } from '@store/common';
import MobileDetect from 'mobile-detect';
import { isMobile } from 'react-device-detect';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

declare global {
  interface Window {
    Kakao: any;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  const store = useStore();
  const persistor = persistStore(store);

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>

      <ThemeProvider
        theme={{ ...theme, ...mediaQuery, isWithContentsSection, isMobile }}
      >
        <GlobalStyle />
        <PersistGate persistor={persistor}>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </PersistGate>
      </ThemeProvider>
    </>
  );
};

MyApp.getInitialProps = wrapper.getInitialPageProps(
  (store) =>
    async ({ ctx }: any) => {
      {
        let mobile;

        if (ctx.req) {
          const md = new MobileDetect(ctx.req.headers['user-agent']);
          mobile = !!md.mobile();
        } else {
          mobile = isMobile;
        }

        store.dispatch(SET_IS_MOBILE(mobile));
        return {
          props: {},
        };
      }
    }
);

export default wrapper.withRedux(MyApp);
