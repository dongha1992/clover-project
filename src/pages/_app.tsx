import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode, useEffect, useRef } from 'react';
import GlobalStyle from '@styles/GlobalStyle';
import { theme } from '@styles/theme';
import { getMediaQuery } from '@utils/common';
import { ThemeProvider } from 'styled-components';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { wrapper } from '@store/index';
import { SET_IS_MOBILE, INIT_IMAGE_VIEWER } from '@store/common';
import MobileDetect from 'mobile-detect';
import { ReactQueryDevtools } from 'react-query/devtools';
import Script from 'next/script';
import { NAME_REGX } from '@constants/regex';
import { useRouter } from 'next/router';

// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { INIT_USER, SET_LOGIN_SUCCESS, SET_USER, userForm } from '@store/user';
import { userProfile } from '@api/user';
import { getCookie } from '@utils/common/cookie';
import useWebviewListener from '@hooks/useWebviewListener';
import { NextPage } from 'next';
import DefaultLayout from '@components/Layout/Default';

declare global {
  interface Window {
    Kakao: any;
    nicepaySubmit: any;
    nicepayClose: any;
    nicepayMobileStart: any;
    kakao: any;
  }
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useRef<QueryClient>();

  /* 스크린 사이즈 체크 전역 처리 */
  /*TODO: 이거 말고 다른 걸로..? */
  const isWithContentsSection = useMediaQuery('(min-width:1024px)');
  const isMobile = useMediaQuery('(max-width:512px)');

  // const { showToast, hideToast } = useToast();
  const store: any = useStore();
  const { me } = useSelector(userForm);
  const isAutoLogin = getCookie({ name: 'autoL' });
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  useWebviewListener();

  if (!queryClient.current) {
    queryClient.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        },
      },
    });
  }

  const authCheck = async () => {
    try {
      const token = await getCookie({ name: 'acstk' });
      // accesstoken이 있을때 로그인
      if (token) {
        const { data } = await userProfile();
        if (data.code === 200) {
          data.data.nickname ??= data.data.name;
          data.data.nickname ||= data.data.name;
          dispatch(SET_USER(data.data));
          dispatch(SET_LOGIN_SUCCESS(true));
          if (!NAME_REGX.test(data.data.name)) {
            router.push('/signup/change-name');
            return;
          }
        }
      } else {
        // 토큰이 없으면 먼저 유저 정보 초기화
        dispatch(INIT_USER());
        // accesstoken이 없고 자동로그인을 체크했을때 로그인
        if (isAutoLogin === 'Y') {
          const { data } = await userProfile();
          if (data.code === 200) {
            data.data.nickname ??= data.data.name;
            data.data.nickname ||= data.data.name;
            dispatch(SET_USER(data.data));
            dispatch(SET_LOGIN_SUCCESS(true));
            if (!NAME_REGX.test(data.data.name)) {
              router.push('/signup/change-name');
              return;
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const initKakao = () => {
    try {
      if (!window.Kakao.isInitialized()) {
        if (typeof window !== undefined) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (typeof window !== undefined) {
      const md = new MobileDetect(window.navigator.userAgent);
      let mobile = !!md.mobile();
      dispatch(SET_IS_MOBILE(mobile));
    }
    authCheck();
    initKakao();
    // temp
    dispatch(INIT_IMAGE_VIEWER());
  }, []);

  return (
    <>
      <Head>
        <title>프레시코드</title>
      </Head>
      <>
        <Script type="text/javascript" src="//developers.band.us/js/share/band-button.js?v=13062022"></Script>
        <Script
          type="text/javascript"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        ></Script>
        <Script
          type="text/javascript"
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="beforeInteractive"
        ></Script>
        <Script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services,clusterer`}
          strategy="beforeInteractive"
        ></Script>
        <Script src="https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js" type="text/javascript"></Script>
        <Script id="test">
          {`  // 결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
            const nicepaySubmit = () => {
                document.payForm.submit()
            }

            const nicepayClose = () => {
                let payForm = document.getElementById('payForm');
                payForm.innerHTML = '';
                window.location.reload()
                alert('결제를 취소 하였습니다.');
                }

            const nicepayMobileStart = () => {
                document.payFormMobile.submit();
                }   
            `}
        </Script>
      </>

      <QueryClientProvider client={queryClient.current}>
        <ThemeProvider theme={{ ...theme, ...getMediaQuery, isWithContentsSection, isMobile }}>
          <GlobalStyle />
            <PersistGate persistor={store.__persistor}>
              <ReactQueryDevtools initialIsOpen={false} />
              {getLayout(<Component {...pageProps} />)}
            </PersistGate>
        </ThemeProvider>
        <form
          name="payForm"
          id="payForm"
          method="post"
          action=""
          acceptCharset="UTF-8"
          style={{ display: 'none' }}
        ></form>
        <form
          name="payFormMobile"
          id="payFormMobile"
          target="_self"
          method="post"
          action="https://web.nicepay.co.kr/v3/smart/smartPayment.jsp"
          acceptCharset="euc-kr"
          style={{ display: 'none' }}
        ></form>
      </QueryClientProvider>
    </>
  );
};

export default wrapper.withRedux(MyApp);
