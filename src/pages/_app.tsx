import type { AppProps } from 'next/app';
import Head from 'next/head';
import GlobalStyle from '@styles/GlobalStyle';
import { Wrapper } from '@components/Layout/Wrapper';
import { theme } from '@styles/theme';
import { mediaQuery } from '@utils/getMediaQuery';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { Provider } from 'react-redux';
import { store } from '@store/index';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  /* 스크린 사이즈 체크 전역 처리 */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:504px)');

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>
      <Provider store={store}>
        <ThemeProvider
          theme={{ ...theme, ...mediaQuery, isWithContentsSection, isMobile }}
        >
          <GlobalStyle />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ThemeProvider>
      </Provider>
    </>
  );
}
export default MyApp;
