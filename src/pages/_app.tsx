import type { AppProps } from 'next/app';
import Head from 'next/head';
import { globalStyle } from '@styles/GlobalStyle';
import { Wrapper } from '@components/Layout/Wrapper';
import { theme } from '@styles/theme';
import { mediaQuery } from '@utils/getMediaQuery';
import { ThemeProvider } from 'styled-components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>프레시코드</title>
        <style>{globalStyle}</style>
      </Head>
      <ThemeProvider theme={{ ...theme, ...mediaQuery }}>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
